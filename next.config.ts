import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Every package's pages live in `@spendgraph/docs`, so the ten packages they
   * describe ship without them. Without this the MDX loader does not reach
   * them, because they resolve through `node_modules` and loaders stop at its
   * edge.
   */
  transpilePackages: ["@spendgraph/docs"],
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
