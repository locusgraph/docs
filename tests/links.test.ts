import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ENDPOINTS } from "../lib/api/endpoints";
import { localPages, pages, SECTIONS, specifiers } from "./site";

/** Kept in step with `docsHref` in `mdx-components.tsx`. */
const APP_PATHS = new Set(["/pricing", "/projects", "/keys"]);

/**
 * Internal links resolve.
 *
 * Every page is written with links to its neighbours, and a rename that misses
 * one leaves a 404 nothing else notices: the page still builds, the sidebar
 * still works, and only a reader following prose finds it.
 */
describe("internal links", () => {
  /**
   * The manifest plus the API reference.
   *
   * Endpoint pages are generated from `lib/api/endpoints.json` rather than
   * loaded from the manifest, so a page linking to one looked dead here while
   * resolving perfectly in the browser.
   */
  const known = new Set([
    ...SECTIONS.flatMap((s) => pages(s).map((p) => `/${s}/${p}`)),
    ...ENDPOINTS.map((endpoint) => `/${endpoint.product}/api/${endpoint.slug}`),
  ]);

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

/**
 * Package docs link with their own site's path shape, `/docs/...`, and this
 * host rewrites them when it renders. The rewrite has to cover every one of
 * them, or a reader follows a link into a 404.
 */
describe("package doc links", () => {
  const known = new Set(SECTIONS.flatMap((s) => pages(s).map((p) => `/${s}/${p}`)));

  for (const [slug, specifier] of SECTIONS.flatMap((s) =>
    specifiers(s).map((e) => [e[0], e[1]] as [string, string])
  )) {
    if (specifier.startsWith("@/")) continue; // local content, covered above

    it(`${slug} points only at pages that exist`, () => {
      const body = readFileSync(join("node_modules", specifier), "utf8");
      const dead = [
        ...new Set(
          [...body.matchAll(/\]\((\/[a-z][a-z0-9/-]*)\)/g)]
            .map((m) => m[1])
            // The same rewrite `mdx-components.tsx` applies at render time.
            .map((href) => (href.startsWith("/docs/") ? `/spendgraph${href.slice(5)}` : href))
            // Links at the dashboard leave as absolute URLs, not docs pages.
            .filter((href) => !APP_PATHS.has(href))
            .filter((href) => !known.has(href))
        ),
      ];
      expect(dead, `dead after rewrite: ${dead.join(", ")}`).toEqual([]);
    });
  }
});
