import { describe, expect, it } from "vitest";
import { type DocsTree, pagesOf, treeFor } from "../lib/site/docs-nav";
import { declaredTrees, listedTrees, pages, reachable, SECTIONS } from "./site";

/**
 * The nav and the manifest describe the same set of pages, or a reader meets a
 * dead link and a written page has no way in.
 *
 * Both failures have happened. The Enterprise group was declared, exported and
 * never listed in `NAV`, so it was invisible in the product while every count
 * that grepped the file still said it was there.
 */
describe("navigation", () => {
  it("lists every tree it declares", () => {
    const orphans = declaredTrees().filter((t) => !listedTrees().includes(t));
    expect(orphans, `declared but never listed in NAV: ${orphans.join(", ")}`).toEqual([]);
  });

  it("lists no tree it does not declare", () => {
    const missing = listedTrees().filter((t) => !declaredTrees().includes(t));
    expect(missing, `listed in NAV with no definition: ${missing.join(", ")}`).toEqual([]);
  });

  for (const section of SECTIONS) {
    describe(section, () => {
      const nav = reachable(section);
      const manifest = pages(section);

      it("has a page behind every link", () => {
        const dead = nav.filter((href) => !manifest.includes(href));
        expect(dead, `nav points at pages that do not exist: ${dead.join(", ")}`).toEqual([]);
      });

      it("has a link to every page", () => {
        const hidden = manifest.filter((slug) => !nav.includes(slug));
        expect(hidden, `pages nothing links to: ${hidden.join(", ")}`).toEqual([]);
      });
    });
  }
});

/**
 * Every page resolves to the tree that lists it.
 *
 * The header names the page from that tree and the footer takes its prev and
 * next from the same place, so a page no tree claims renders as "Docs" with no
 * way forward. `treeFor` matched on the first three path segments, which is
 * right for a tree under its own folder and wrong for one whose pages sit
 * directly under the product: the Spendgraph start tree claimed only
 * `/spendgraph/overview`, and `concepts` and `getting-started` fell through.
 *
 * This imports the real function rather than parsing the file, because the
 * fault was in the matching, not in the data. `docs-nav.ts` type-imports and
 * nothing else, so there is no component graph to drag in.
 */
describe("every reachable page resolves to a tree", () => {
  for (const section of SECTIONS) {
    for (const page of reachable(section)) {
      const href = `/${section}/${page}`;
      it(href, () => {
        const tree = treeFor(href);
        expect(tree, `${href} belongs to no tree`).toBeDefined();
        expect(pagesOf(tree as DocsTree).map((item) => item.href)).toContain(href);
      });
    }
  }
});
