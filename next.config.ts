import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  /**
   * Docs that describe a package live in the package, beside the code they
   * describe, and the route here is four lines that render one. Without this
   * the MDX loader does not reach them, because they resolve through
   * `node_modules` and loaders stop at its edge.
   */
  transpilePackages: [
    "@spendgraph/cli",
    "@spendgraph/evals",
    "@spendgraph/graph",
    "@spendgraph/harness",
    "@spendgraph/llms",
    "@spendgraph/prompt",
    "@spendgraph/sdk",
    "@spendgraph/stage",
    "@spendgraph/tools",
    "@spendgraph/vigil",
  ],
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
