import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ENDPOINTS } from "../lib/api/endpoints";
import { LEGACY_FALLBACK, LEGACY_HOST, LEGACY_REDIRECTS } from "../lib/site/legacy";
import { SITEMAP_URL } from "../lib/site/seo";
import nextConfig from "../next.config";
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
    "/robots.txt",
    ...pages("locusgraph").map((slug) => `/locusgraph/${slug}`),
    ...ENDPOINTS.filter((e) => e.product === "locusgraph").map((e) => `/locusgraph/api/${e.slug}`),
  ]);

  it("covers the 48 pages it served, its llms files, and robots.txt", () => {
    expect(Object.keys(LEGACY_REDIRECTS)).toHaveLength(51);
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

/**
 * The old host's sitemap goes to the one sitemap there is now, on the landing
 * site. It has its own redirect because every entry in `LEGACY_REDIRECTS` is a
 * path on this host, and the catch-all after it would send the URL to a docs
 * page instead.
 */
describe("the old sitemap", () => {
  it("redirects for good to the landing site's sitemap, before the catch-all", async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    const sitemap = redirects.findIndex(
      (rule) => rule.source === "/sitemap.xml" && rule.has?.some((h) => h.type === "host")
    );
    expect(sitemap).toBeGreaterThan(-1);
    expect(redirects[sitemap]).toMatchObject({ destination: SITEMAP_URL, permanent: true });
    expect(sitemap).toBeLessThan(redirects.findIndex((rule) => rule.source === "/:path*"));
  });

  it("is the www sitemap", () => {
    expect(SITEMAP_URL).toBe("https://www.locusgraph.com/sitemap.xml");
  });
});
