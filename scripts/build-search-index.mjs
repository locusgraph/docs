/**
 * Build the search index from the manifest.
 *
 * The manifest already enumerates every page this host serves and says where
 * each one loads from, so deriving the index from it means the two cannot
 * drift: a page that exists is a page that is searchable, and an index entry
 * for a page that does not exist is not possible.
 *
 * Runs in `prebuild`, and writes `public/search-index.json`.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = readFileSync(join(root, "lib/site/docs-manifest.ts"), "utf8");
const products = readFileSync(join(root, "lib/site/products.ts"), "utf8");

/** Sections a reader can reach. An unready section is not worth indexing. */
const ready = [
  ...products.matchAll(/^\s+"?([a-z-]+)"?: \{\n\s+title: "([^"]+)",[\s\S]*?ready: (true|false)/gm),
]
  .filter((m) => m[3] === "true")
  .map((m) => ({ slug: m[1], title: m[2] }));

/** Every `"slug": () => import("specifier")` in the manifest, with its product. */
function entries() {
  const out = [];
  for (const { slug: product } of ready) {
    const open = manifest.indexOf(`${product.includes("-") ? `"${product}"` : product}: {`);
    if (open === -1) continue;
    const block = manifest.slice(open, manifest.indexOf("},", open));
    for (const m of block.matchAll(/^\s+"?([a-z0-9/-]+)"?: \(\) => import\("([^"]+)"\)/gm)) {
      out.push({ product, slug: m[1], specifier: m[2] });
    }
  }
  return out;
}

/** `@/content/x.mdx` is ours; anything else resolves through node_modules. */
function resolve(specifier) {
  return specifier.startsWith("@/")
    ? join(root, specifier.slice(2))
    : join(root, "node_modules", specifier);
}

/** What a reader would actually read, with the machinery taken out. */
function readable(mdx) {
  return mdx
    .replace(/^export const meta = \{[\s\S]*?\n\};\n/, "")
    .replace(/```[\s\S]*?```/g, " ") // code samples
    .replace(/<[A-Z][A-Za-z]*\s*\/>/g, " ") // self-closing components
    .replace(/<\/?[A-Za-z][^>]*>/g, " ") // component tags, keeping their prose
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // link text, not the href
    .replace(/[#*_`|>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const docs = [];
let missing = 0;

for (const { product, slug, specifier } of entries()) {
  let raw;
  try {
    raw = readFileSync(resolve(specifier), "utf8");
  } catch {
    missing++;
    console.warn(`  skipped, cannot read: ${specifier}`);
    continue;
  }

  const meta = raw.match(
    /title:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?description:\s*\n?\s*"((?:[^"\\]|\\.)*)"/
  );
  const headings = [...raw.matchAll(/^#{1,3} (.+)$/gm)].map((m) => m[1].replace(/[`*]/g, ""));
  const section = ready.find((r) => r.slug === product);

  docs.push({
    id: `/${product}/${slug}`,
    product,
    section: section?.title ?? product,
    // The first heading is the page's own title, which reads better than the
    // `<title>` tag, since that carries the site name too.
    title: headings[0] ?? meta?.[1] ?? slug,
    description: meta?.[2] ?? "",
    headings: headings.slice(1).join(" "),
    body: readable(raw).slice(0, 4000),
  });
}

mkdirSync(join(root, "public"), { recursive: true });
const out = join(root, "public/search-index.json");
writeFileSync(out, JSON.stringify(docs));

const bytes = readFileSync(out).length;
console.log(
  `search index: ${docs.length} pages, ${(bytes / 1024).toFixed(0)} KB${missing ? `, ${missing} unreadable` : ""}`
);
