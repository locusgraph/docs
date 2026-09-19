import type { Metadata } from "next";

/**
 * The docs host, and the only host these pages canonicalise to.
 *
 * `docs.locusgraph.com` is a shared host: it serves every product's docs, and
 * nothing else public lives on it. Marketing pages and articles are on
 * `www.locusgraph.com`; each product's app is on its own noindex subdomain.
 * Pointing a canonical at either would hand Google a URL it is being told not
 * to index.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://docs.locusgraph.com";

/**
 * The social card, drawn at build time by `app/opengraph-image.tsx`.
 *
 * Named here rather than left to the file convention: that convention only
 * applies to a route which does not declare its own `openGraph`, and every page
 * here does. Without this, two pages of 120 carried an image.
 */
/**
 * The map of this host for a language model: every page with its own
 * description, and the note that appending `.md` to any page returns markdown.
 */
const LLMS_TXT = {
  "text/plain": [{ url: "/llms.txt", title: "Documentation index for language models" }],
};

const CARD = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "LocusGraph Docs",
};

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
    alternates: {
      canonical: path,
      /**
       * Where an agent should look first, on every page that has metadata.
       *
       * It belongs here rather than in the root layout because a page's
       * `alternates` replaces the layout's whole object rather than merging
       * into it, so a canonical set anywhere below would drop this.
       */
      types: LLMS_TXT,
    },
    openGraph: {
      siteName: "LocusGraph Docs",
      type: "website",
      title,
      description,
      url: path,
      images: [CARD],
    },
    twitter: {
      card: "summary_large_image",
      site: "@effortlesslabs",
      title,
      description,
      images: [CARD.url],
    },
  };
}
