import type { MetadataRoute } from "next";
import { SITE_URL, SITEMAP_URL } from "@/lib/site/seo";

/**
 * This host is meant to be indexed. It builds no sitemap of its own: the one
 * sitemap on www.locusgraph.com lists these pages too, so there is a single
 * file to submit and keep current. The `Sitemap` line below is what makes it
 * count here. A crawler only accepts a sitemap's URLs for a host whose own
 * `robots.txt` points at that sitemap.
 *
 * `/llms.txt` and `/llms-full.txt` are generated from the manifest, for an
 * agent reading the docs rather than a crawler ranking them. They are static
 * files under `public/`, so they need no route and no entry here; this
 * comment is the pointer, since `MetadataRoute.Robots` has no field for them.
 *
 * Nothing is disallowed: every route served here is documentation, and the two
 * that should not be indexed — the 404, and a section that is not ready — say
 * so through `robots` metadata on the page itself rather than by being hidden
 * from the crawler. A `Disallow` would stop the crawler reading the very tag
 * that tells it what to do.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: SITEMAP_URL,
    host: SITE_URL,
  };
}
