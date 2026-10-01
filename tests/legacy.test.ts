import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ENDPOINTS } from "../lib/api/endpoints";
import { LEGACY_FALLBACK, LEGACY_HOST, LEGACY_REDIRECTS } from "../lib/site/legacy";
import { pages } from "./site";

/**
 * Every old path lands on a page that exists.
 *
 * The map is the one place a renamed or removed page can break an old link
 * without anything else noticing: the redirect still fires, and answers with a
 * 404 on the new host instead of on the old one.
 */
describe("the old docs host", () => {
  const live = new Set([
    "/locusgraph",
    "/llms.txt",
    "/llms-full.txt",
    "/sitemap.xml",
    "/robots.txt",
    ...pages("locusgraph").map((slug) => `/locusgraph/${slug}`),
    ...ENDPOINTS.filter((e) => e.product === "locusgraph").map((e) => `/locusgraph/api/${e.slug}`),
  ]);

  it("covers the 48 pages it served, its llms files, and a crawler's two", () => {
    expect(Object.keys(LEGACY_REDIRECTS)).toHaveLength(52);
  });

  for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
    it(`${from} goes to a page that exists`, () => {
      expect(live, to).toContain(to);
    });
  }

  it("sends anything else to a page that exists", () => {
    expect(live).toContain(LEGACY_FALLBACK);
  });

  it("is attached to the worker that answers it", () => {
    expect(readFileSync("wrangler.jsonc", "utf8")).toContain(`"pattern": "${LEGACY_HOST}"`);
  });
});
