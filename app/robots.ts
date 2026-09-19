import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site/seo";

/**
 * This host is meant to be indexed, and carries its own sitemap.
 *
 * `/llms.txt` and `/llms-full.txt` sit beside it, generated from the same
 * manifest, for an agent reading the docs rather than a crawler ranking them.
 * They are static files under `public/`, so they need no route and no entry
 * here; this comment is the pointer, since `MetadataRoute.Robots` has no field
 * for them.
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
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
