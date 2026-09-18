/**
 * What this docs host serves.
 *
 * A plain module rather than a route file: `app/page.tsx` and the `[product]`
 * routes all need this list, and a Next page has a fixed export contract —
 * anything else it exports is type-checked against the generated route types
 * and rejected. Importing a value out of a page also drags that page's whole
 * module graph into whatever imports it.
 *
 * Lowercase kebab, matching the www product slug. One token per entry, used
 * across marketing, articles, app host and docs.
 */
export const PRODUCTS = ["locusgraph", "spendgraph", "brainstorm", "locus-skill"] as const;

export type Product = (typeof PRODUCTS)[number];

export interface ProductInfo {
  /** Display name. Cased the way the product writes itself. */
  title: string;
  /** One line, used on the index card and as the docs-root meta description. */
  blurb: string;
  /**
   * Whether the section is finished enough to send a reader into.
   *
   * The routes exist either way — this only decides whether the host index
   * offers the card as a link. A section with a handful of placeholder pages is
   * worse than one that says it is not ready yet.
   */
  ready: boolean;
}

export const PRODUCT_INFO: Record<Product, ProductInfo> = {
  locusgraph: {
    title: "LocusGraph",
    blurb: "The graph the products are built on.",
    ready: false,
  },
  spendgraph: {
    title: "Spendgraph",
    blurb: "Know what every token costs.",
    ready: true,
  },
  brainstorm: {
    title: "BrainStorm",
    blurb: "Think out loud, keep the thread.",
    ready: false,
  },
  "locus-skill": {
    title: "Locus Skill",
    blurb: "Working practices an agent compiles and follows.",
    ready: false,
  },
};

export function isProduct(value: string): value is Product {
  return (PRODUCTS as readonly string[]).includes(value);
}
