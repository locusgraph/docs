import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { componentsUsed, localPages, packagePages, prose } from "./site";

/**
 * A page that names a component nothing provides renders the tag as nothing,
 * so a figure is silently missing from a page that reads as though it has one.
 *
 * The two kinds of page get it from different places, which is the whole point
 * of the split. A page in `@spendgraph/docs` imports its figures, so it carries
 * what it needs and would render the same anywhere. A page in `content/` is
 * ours, and takes what this file registers.
 */
const registry = readFileSync("mdx-components.tsx", "utf8");
const block = registry.slice(
  registry.indexOf("return {", registry.indexOf("export function useMDXComponents"))
);
const registered = new Set([...block.matchAll(/^\s{4}([A-Z][A-Za-z0-9]*),$/gm)].map((m) => m[1]));

/** What a page brought with it. */
function imported(mdx: string): Set<string> {
  const names = new Set<string>();
  for (const m of mdx.matchAll(/^import \{([^}]+)\} from/gm)) {
    for (const name of m[1].split(",")) names.add(name.trim());
  }
  return names;
}

describe("a local page uses only what this host registers", () => {
  for (const page of localPages()) {
    it(page, () => {
      const used = componentsUsed(prose(readFileSync(page, "utf8")));
      expect(used.filter((c) => !registered.has(c))).toEqual([]);
    });
  }
});

describe("a package page brings its own figures", () => {
  const pages = packagePages();

  it("finds the installed pages at all", () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  for (const page of pages) {
    it(page, () => {
      const src = readFileSync(page, "utf8");
      const brought = imported(src);
      const used = componentsUsed(prose(src));
      // Callout is the one thing a package page still leans on the host for.
      expect(used.filter((c) => !brought.has(c) && !registered.has(c))).toEqual([]);
    });
  }
});

/**
 * A figure written and never registered looks, on the page, exactly like a typo
 * in the tag. Only the host's own figures are checked here; the ones in
 * `@spendgraph/docs` are held by that package's own tests.
 */
it("every figure this host draws is registered", () => {
  const src = readFileSync("components/docs/spendgraph-section-diagrams.tsx", "utf8");
  const exported = [...src.matchAll(/^export function ([A-Z][A-Za-z0-9]*)/gm)].map((m) => m[1]);
  expect(exported.length).toBeGreaterThan(0);
  expect(exported.filter((c) => !registered.has(c))).toEqual([]);
});
