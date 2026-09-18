import type { Metadata } from "next";

/**
 * The docs host, and the only host these pages canonicalise to.
 *
 * `doc.locusgraph.com` is a shared host: it serves every product's docs, and
 * nothing else public lives on it. Marketing pages and articles are on
 * `www.locusgraph.com`; each product's app is on its own noindex subdomain.
 * Pointing a canonical at either would hand Google a URL it is being told not
 * to index.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://doc.locusgraph.com";

/**
 * Canonical, Open Graph and Twitter tags for one docs page.
 *
 * Exists because Next merges metadata by *replacing* the whole `openGraph`
 * object, not by merging its keys: the moment a route declares its own
 * `openGraph` for a title, it silently drops the parent's `siteName` too.
 * One helper, so a page cannot half-declare itself.
 *
 * `path` stays site-relative; `metadataBase` in the root layout resolves it
 * against SITE_URL. A page that built an absolute URL here would keep pointing
 * at production from every preview deploy.
 */
export function pageMeta(opts: {
  title: string;
  description: string;
  /** Site-relative, with a leading slash. Becomes canonical and og:url. */
  path: string;
}): Metadata {
  const { title, description, path } = opts;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      siteName: "LocusGraph Docs",
      type: "website",
      title,
      description,
      url: path,
    },
    twitter: {
      card: "summary",
      site: "@effortlesslabs",
      title,
      description,
    },
  };
}
