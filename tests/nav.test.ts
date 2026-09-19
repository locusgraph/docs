import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { type DocsTree, pagesOf, treeFor } from "../lib/site/docs-nav";
import { declaredTrees, listedTrees, nav, pages, reachable, SECTIONS, treesFor } from "./site";

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
      /**
       * `api/…` is generated from `lib/api/endpoints.ts`, not loaded from the
       * manifest, so it is held by `tests/api.test.ts` instead. This check
       * exists to catch a written page the manifest forgot; these were never
       * its to remember.
       */
      const nav = reachable(section).filter((href) => !href.startsWith("api/"));
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
    for (const page of reachable(section).filter((href) => !href.startsWith("api/"))) {
      const href = `/${section}/${page}`;
      it(href, () => {
        const tree = treeFor(href);
        expect(tree, `${href} belongs to no tree`).toBeDefined();
        expect(pagesOf(tree as DocsTree).map((item) => item.href)).toContain(href);
      });
    }
  }
});

/**
 * The sidebar and the overview page list the ten packages in the same order.
 *
 * They disagreed: the sidebar had prompt before llms, the overview had tools
 * before stage. Neither was wrong on its own, and together they read as no
 * order at all. The sidebar is the source, because it is what a reader moves
 * through.
 */
it("the overview lists the packages in sidebar order", () => {
  // `SPENDGRAPH` is the section's own pages and `SG_API` is the generated
  // reference; neither is a package, and the overview table lists packages.
  const sidebar = treesFor("spendgraph")
    .filter((tree) => tree !== "SPENDGRAPH" && tree !== "SG_API")
    .map((tree) => tree.toLowerCase());

  const overview = readFileSync("content/spendgraph/overview.mdx", "utf8");
  const listed = [...overview.matchAll(/^\| \[`([a-z]+)`\]/gm)].map((m) => m[1]);

  expect(listed).toEqual(sidebar);
});

/**
 * The breadcrumb runs from the host index to the page.
 *
 * It was two levels of plain text, so the header named the section without
 * offering a way back to it. These assert the shape rather than the render: the
 * trail is built from the same nav these tests already walk, so a tree that
 * loses its `href` or `title` breaks a level, and nothing else would notice.
 */
describe("the breadcrumb has a level to show", () => {
  for (const section of SECTIONS) {
    for (const tree of treesFor(section)) {
      it(`${section}: ${tree}`, () => {
        const declared = nav.slice(
          nav.indexOf(`const ${tree}: DocsTree = {`),
          nav.indexOf("\n};", nav.indexOf(`const ${tree}: DocsTree = {`))
        );
        // Every tree needs an href for the group crumb to point anywhere. A
        // title is optional: a tree with none is the section's own pages, and
        // "LocusGraph > Overview" already says where that is.
        expect(declared, `${tree} has no href`).toMatch(/href: "\/[a-z-]+\//);
      });
    }
  }
});
