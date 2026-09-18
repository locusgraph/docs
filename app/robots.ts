import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site/seo";

/**
 * This host is meant to be indexed, and carries its own sitemap.
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
