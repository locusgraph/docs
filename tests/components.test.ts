import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { componentsUsed, localPages, packagePages, prose } from "./site";

/**
 * A page that names a component this host does not register renders the tag as
 * nothing, so the figure is silently missing on a page that reads as though it
 * has one.
 *
 * Package pages matter more than local ones here. A figure used by a package
 * lives in this repo, not in the package, so the two drift independently: the
 * package can be published carrying a tag only a later version of this host
 * knows about.
 */
const registry = readFileSync("mdx-components.tsx", "utf8");
const block = registry.slice(
  registry.indexOf("return {", registry.indexOf("export function useMDXComponents"))
);
const registered = new Set([...block.matchAll(/^\s{4}([A-Z][A-Za-z0-9]*),$/gm)].map((m) => m[1]));

describe("every component a page uses is registered", () => {
  for (const page of [...localPages(), ...packagePages()]) {
    it(page, () => {
      const used = componentsUsed(prose(readFileSync(page, "utf8")));
      expect(used.filter((c) => !registered.has(c))).toEqual([]);
    });
  }
});

/**
 * The other direction is only checked against the figure modules, not against
 * the pages. A figure is written here and used from a package, and between
 * those two steps there is a publish, so a figure with no caller is a normal
 * state of this repo rather than a mistake. Forgetting to register one is the
 * mistake, and it looks the same on the page as a typo in the tag.
 */
describe("every figure is registered", () => {
  for (const module of [
    "components/docs/diagrams.tsx",
    "components/docs/spendgraph-diagrams.tsx",
  ]) {
    it(module, () => {
      const src = readFileSync(module, "utf8");
      const exported = [...src.matchAll(/^export function ([A-Z][A-Za-z0-9]*)/gm)].map((m) => m[1]);
      expect(exported.length).toBeGreaterThan(0);
      expect(exported.filter((c) => !registered.has(c))).toEqual([]);
    });
  }
});
