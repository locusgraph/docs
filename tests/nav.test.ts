import { describe, expect, it } from "vitest";
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
