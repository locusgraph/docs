/**
 * Build everything derived from the manifest, in one pass.
 *
 * The manifest already enumerates every page this host serves and says where
 * each one loads from, so deriving these from it means they cannot drift: a
 * page that exists is a page that is searchable and listed, and an entry for a
 * page that does not exist is not possible.
 *
 * Runs in `prebuild` and `predev`, and writes three files:
 *
 *   public/search-index.json   what the search palette queries
 *   public/llms.txt            the map, per llmstxt.org: one line per page
 *   public/llms-full.txt       every page's prose, for a model with room
 *
 * One traversal for all three, because each page is read from disk and a
 * package page resolves through `node_modules`.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = readFileSync(join(root, "lib/site/docs-manifest.ts"), "utf8");
const products = readFileSync(join(root, "lib/site/products.ts"), "utf8");
const nav = readFileSync(join(root, "lib/site/docs-nav.ts"), "utf8");

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

const searchIndex = join(root, "public/search-index.json");
writeFileSync(searchIndex, JSON.stringify(docs));

/**
 * The site's own blurb, from `products.ts`, so the description an agent reads
 * is the one a person reads on the index page.
 */
function blurbOf(product) {
  const at = products.indexOf(`${product.includes("-") ? `"${product}"` : product}: {`);
  if (at === -1) return "";
  const block = products.slice(at, products.indexOf("},", at));
  return block.match(/blurb:\s*\n?\s*"((?:[^"\\]|\\.)*)"/)?.[1] ?? "";
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://docs.locusgraph.com";

/**
 * The sidebar's order, per product: each group, and the pages under it.
 *
 * Sorting pages by slug put `enterprise` above `recall` and scattered the path
 * a reader is meant to take. This is a map, and a map in arbitrary order is a
 * worse map, so it follows the nav rather than the alphabet.
 */
function groupsOf(product) {
  const key = product.includes("-") ? `"${product}"` : product;
  const at = nav.indexOf(`${key}: `, nav.indexOf("export const NAV:"));
  if (at === -1) return [];
  const tail = nav.slice(at + key.length + 2);

  const inline = tail.match(/^\[([\s\S]*?)\]/);
  const body = inline
    ? inline[1]
    : (() => {
        const name = tail.match(/^([A-Z][A-Z_]*)/)?.[1];
        if (!name) return "";
        const decl = nav.indexOf(`const ${name}: DocsTree[] = [`);
        return decl === -1 ? "" : nav.slice(decl, nav.indexOf("];", decl));
      })();

  const names = [...new Set([...body.matchAll(/\b([A-Z][A-Z_]*)\b/g)].map((m) => m[1]))].filter(
    (t) => t !== "DocsTree" && !t.endsWith("_TREES")
  );

  return names.flatMap((tree) => {
    const open = nav.indexOf(`const ${tree}: DocsTree = {`);
    if (open === -1) return [];
    const block = nav.slice(open, nav.indexOf("\n};", open));
    const title = block.match(/title: "([^"]*)"/)?.[1] ?? "";
    const slugs = [
      ...new Set(
        [...block.matchAll(new RegExp(`href: "/${product}/([^"]+)"`, "g"))].map((m) => m[1])
      ),
    ];
    return [{ title, slugs }];
  });
}

/**
 * `llms.txt`, per llmstxt.org: a map, not the content.
 *
 * One line per page with its own description, in the order the sidebar shows
 * them, so an agent sees the whole surface and fetches only what it needs.
 */
const map = [
  "# LocusGraph Docs",
  "",
  "> Documentation for every LocusGraph product. Each link below is a page on this host; append nothing, the URLs are complete.",
  "",
  "Every page is also served as Markdown-ish prose in `/llms-full.txt` if you would rather read the whole corpus in one request.",
  "",
];

const ordered = new Map();

for (const { slug: product, title } of ready) {
  const pages = docs.filter((d) => d.product === product);
  if (pages.length === 0) continue;
  const byId = new Map(pages.map((page) => [page.id, page]));

  map.push(`## ${title}`, "");
  const blurb = blurbOf(product);
  if (blurb) map.push(blurb, "");
  map.push(`- [${title}](${SITE}/${product}): the section index, with every group`, "");

  const seen = [];
  for (const group of groupsOf(product)) {
    const inGroup = group.slugs.map((slug) => byId.get(`/${product}/${slug}`)).filter(Boolean);
    if (inGroup.length === 0) continue;
    if (group.title) map.push(`### ${group.title}`, "");
    for (const page of inGroup) {
      map.push(`- [${page.title}](${SITE}${page.id}): ${page.description || page.title}`);
      seen.push(page);
    }
    map.push("");
  }

  // A page the manifest has and no tree lists would be invisible here, the way
  // it is invisible in the sidebar. `tests/nav.test.ts` holds that the two
  // agree, so this is a belt on braces rather than a fallback to rely on.
  for (const page of pages) {
    if (seen.includes(page)) continue;
    map.push(`- [${page.title}](${SITE}${page.id}): ${page.description || page.title}`);
    seen.push(page);
  }
  ordered.set(product, seen);
}

const llms = join(root, "public/llms.txt");
writeFileSync(llms, `${map.join("\n").trimEnd()}\n`);

/**
 * `llms-full.txt`: the prose itself, in the same order.
 *
 * `readable()` already strips the machinery an agent cannot use — the meta
 * export, component tags, link hrefs. Code samples go with them, which is the
 * one real loss: an agent wanting the exact call signature has to fetch the
 * page. Keeping them would multiply the size and most of the value here is the
 * explanation rather than the snippet.
 */
const full = ["# LocusGraph Docs", "", `Every page on ${SITE}, in one file.`, ""];

for (const { slug: product, title } of ready) {
  for (const page of ordered.get(product) ?? []) {
    full.push(
      `## ${page.title}`,
      "",
      `Source: ${SITE}${page.id}`,
      `Section: ${title}`,
      "",
      page.description,
      "",
      page.body,
      ""
    );
  }
}

const llmsFull = join(root, "public/llms-full.txt");
writeFileSync(llmsFull, `${full.join("\n").trimEnd()}\n`);

const kb = (file) => (readFileSync(file).length / 1024).toFixed(0);
console.log(
  `${docs.length} pages${missing ? `, ${missing} unreadable` : ""} · ` +
    `search-index.json ${kb(searchIndex)} KB · ` +
    `llms.txt ${kb(llms)} KB · llms-full.txt ${kb(llmsFull)} KB`
);
