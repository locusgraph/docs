import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { localPages, pages, SECTIONS } from "./site";

/**
 * Internal links resolve.
 *
 * Every page is written with links to its neighbours, and a rename that misses
 * one leaves a 404 nothing else notices: the page still builds, the sidebar
 * still works, and only a reader following prose finds it.
 */
describe("internal links", () => {
  const known = new Set(SECTIONS.flatMap((s) => pages(s).map((p) => `/${s}/${p}`)));

  it("knows about every page", () => {
    expect(known.size).toBeGreaterThan(100);
  });

  for (const file of localPages()) {
    it(`${file} points only at pages that exist`, () => {
      const body = readFileSync(file, "utf8");
      const links = [...body.matchAll(/\]\((\/[a-z-]+\/[a-z0-9/-]+)\)/g)].map((m) => m[1]);
      const dead = [...new Set(links.filter((href) => !known.has(href)))];
      expect(dead, `dead links: ${dead.join(", ")}`).toEqual([]);
    });
  }
});
