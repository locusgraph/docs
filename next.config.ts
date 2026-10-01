import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { LEGACY_FALLBACK, LEGACY_HOST, LEGACY_REDIRECTS } from "./lib/site/legacy";
import { SITE_URL } from "./lib/site/seo";

/**
 * The old docs host, answered from here.
 *
 * `doc.locusgraph.com` is a second custom domain on this worker, so a request
 * for it reaches this app with that `host`. Each known path goes to the page
 * that replaced it, and anything else to the section index. Absolute
 * destinations, because a relative one would redirect within `doc.` itself.
 */
const legacy = { type: "host" as const, value: LEGACY_HOST.replaceAll(".", "\\.") };

const nextConfig: NextConfig = {
  /**
   * Every package's pages live in `@spendgraph/docs`, so the ten packages they
   * describe ship without them. Without this the MDX loader does not reach
   * them, because they resolve through `node_modules` and loaders stop at its
   * edge.
   */
  transpilePackages: ["@spendgraph/docs"],

  async redirects() {
    return [
      ...Object.entries(LEGACY_REDIRECTS).map(([source, to]) => ({
        source,
        has: [legacy],
        destination: `${SITE_URL}${to}`,
        permanent: true,
      })),
      {
        source: "/:path*",
        has: [legacy],
        destination: `${SITE_URL}${LEGACY_FALLBACK}`,
        permanent: true,
      },
    ];
  },
};

/**
 * Plugins are named as strings, not imported and called.
 *
 * Turbopack is the default bundler in Next 16 and passes this config into Rust,
 * which a JavaScript function cannot cross — so a plugin imported and called
 * here builds locally and fails the real build. `keepBackground: false` drops
 * shiki's own background so code blocks take the site's tokens instead.
 */
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      [
        "rehype-pretty-code",
        {
          theme: { light: "github-light", dark: "github-dark" },
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
