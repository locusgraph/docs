/**
 * What the tests read, parsed once.
 *
 * The nav and the manifest are TypeScript, and importing them would drag in
 * React and the whole component graph for what is really a question about two
 * data structures. They are parsed as text instead, which is also what makes
 * `reachable()` possible: a tree that is declared and never listed in `NAV` is
 * invisible to an import and obvious in the source.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export const nav = readFileSync("lib/site/docs-nav.ts", "utf8");
export const manifest = readFileSync("lib/site/docs-manifest.ts", "utf8");
export const products = readFileSync("lib/site/products.ts", "utf8");

export const SECTIONS = [...products.matchAll(/^\s+"?([a-z-]+)"?: \{\n\s+title:/gm)].map(
  (m) => m[1]
);

/** Every page the manifest can load, by section. */
export function pages(section: string): string[] {
  const key = section.includes("-") ? `"${section}"` : section;
  const open = manifest.indexOf(`${key}: {`);
  if (open === -1) return [];
  const block = manifest.slice(open, manifest.indexOf("},", open));
  return [...block.matchAll(/^\s+"?([a-z0-9/-]+)"?: \(\) => import\("([^"]+)"\)/gm)].map(
    (m) => m[1]
  );
}

/** Where a page's source lives, for the sections that keep it locally. */
export function specifiers(section: string): [string, string][] {
  const key = section.includes("-") ? `"${section}"` : section;
  const open = manifest.indexOf(`${key}: {`);
  if (open === -1) return [];
  const block = manifest.slice(open, manifest.indexOf("},", open));
  return [...block.matchAll(/^\s+"?([a-z0-9/-]+)"?: \(\) => import\("([^"]+)"\)/gm)].map((m) => [
    m[1],
    m[2],
  ]);
}

/**
 * The tree identifiers a section lists, following one level of indirection.
 *
 * A section maps either to an inline array or to a named `DocsTree[]`, and both
 * shapes have to resolve or a whole section looks unreachable.
 */
export function treesFor(section: string): string[] {
  const key = section.includes("-") ? `"${section}"` : section;
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

  // `DocsTree` is the type, and a `*_TREES` name is the array holding the trees,
  // not a tree itself.
  return [...new Set([...body.matchAll(/\b([A-Z][A-Z_]*)\b/g)].map((m) => m[1]))].filter(
    (t) => t !== "DocsTree" && !t.endsWith("_TREES")
  );
}

/**
 * Hrefs a reader can actually reach, walking the trees a section lists rather
 * than every `href:` in the file. The difference is the whole point: a tree can
 * be written, exported and never listed, and only this walk notices.
 */
export function reachable(section: string): string[] {
  const hrefs = new Set<string>();
  for (const tree of treesFor(section)) {
    const at = nav.indexOf(`const ${tree}: DocsTree = {`);
    if (at === -1) continue;
    const body = nav.slice(at, nav.indexOf("\n};", at));
    for (const m of body.matchAll(new RegExp(`href: "/${section}/([^"]+)"`, "g"))) {
      hrefs.add(m[1]);
    }
  }
  return [...hrefs];
}

/** Named trees, whether or not anything lists them. */
export function declaredTrees(): string[] {
  return [...nav.matchAll(/^const ([A-Z][A-Z_]*): DocsTree = \{/gm)].map((m) => m[1]);
}

export function listedTrees(): string[] {
  return [...new Set(SECTIONS.flatMap(treesFor))];
}

/** Every local `.mdx`, as a path. Package pages are not ours to check. */
export function localPages(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (full.endsWith(".mdx")) out.push(full);
    }
  };
  walk("content");
  return out;
}

/** A page with its code fences and inline code taken out. */
export function prose(mdx: string): string {
  return mdx
    .split(/(```[\s\S]*?```)/g)
    .filter((_, i) => i % 2 === 0)
    .join("")
    .split(/(`[^`\n]*`)/g)
    .filter((_, i) => i % 2 === 0)
    .join("");
}

/**
 * Every `.mdx` in `@spendgraph/docs`, as a path.
 *
 * Not ours to edit, but ours to render, so anything they reference has to
 * resolve. They sit one folder per package inside the one docs package, and
 * `evals` nests a folder deeper, so this walks rather than globbing.
 */
export function packagePages(): string[] {
  const root = "node_modules/@spendgraph/docs";
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (full.endsWith(".mdx")) out.push(full);
    }
  };
  try {
    walk(root);
  } catch {
    return [];
  }
  return out;
}

/** Components a page uses, by the JSX tags it opens. */
export function componentsUsed(mdx: string): string[] {
  return [...new Set([...mdx.matchAll(/<([A-Z][A-Za-z0-9]*)[\s/>]/g)].map((m) => m[1]))];
}
