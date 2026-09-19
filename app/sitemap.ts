import type { MetadataRoute } from "next";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { DOCS } from "@/lib/site/docs-manifest";
import { PRODUCT_INFO, PRODUCTS } from "@/lib/site/products";
import { SITE_URL } from "@/lib/site/seo";

/**
 * Every indexable URL, generated from the manifest.
 *
 * The manifest is already the list of pages this host serves, so deriving the
 * sitemap from it means the two cannot drift: a page added without a sitemap
 * entry is not possible, and an entry for a page that does not exist is not
 * possible either.
 *
 * Sections that are not `ready` are left out. Their routes still resolve — the
 * flag only governs whether the host offers them — but a section with
 * placeholder pages is not something to invite a crawler into.
 *
 * No `lastModified`. Most pages load from an installed package, so the only
 * date available is the build's, and a sitemap claiming every page changed at
 * deploy time is worse than one that claims nothing.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const live = PRODUCTS.filter((product) => PRODUCT_INFO[product].ready);

  return [
    { url: SITE_URL, priority: 1 },
    ...live.map((product) => ({
      url: `${SITE_URL}/${product}`,
      priority: 0.8,
    })),
    ...live.flatMap((product) =>
      Object.keys(DOCS[product])
        .sort()
        .map((slug) => ({
          url: `${SITE_URL}/${product}/${slug}`,
          priority: 0.5,
        }))
    ),
    // The API reference is generated from `lib/api/endpoints.ts` rather than
    // loaded from the manifest, so it is listed from its own source. Leaving it
    // out would mean the only pages a crawler never sees are the ones a search
    // for an endpoint name should land on.
    ...ENDPOINTS.map((endpoint) => ({
      url: `${SITE_URL}/locusgraph/api/${endpoint.slug}`,
      priority: 0.5,
    })),
  ];
}
