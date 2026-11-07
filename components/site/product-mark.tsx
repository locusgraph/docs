import { LocusGraphMark } from "@locusgraph/brand";
import type { Icon } from "@phosphor-icons/react";
import { FlowArrowIcon, TrendUpIcon } from "@phosphor-icons/react/ssr";
import { BrainStormMark } from "@/components/site/marks";
import type { Product } from "@/lib/site/products";

type Mark = (props: { className?: string; "aria-hidden"?: boolean }) => React.ReactElement;

/**
 * The glyph each section wears, and the only place on the host that picks one.
 * The headers and the host index all draw marks through `ProductMark`, so a
 * new mark is a one-line change here.
 *
 * Spendgraph's is a trend-up arrow, the glyph its own dashboard and landing
 * page use today. `@locusgraph/brand` 0.4.0 ships `SpendGraphMark`, and the
 * swap waits on pnpm's one-day `minimumReleaseAge`, until 2026-11-08 06:19 UTC.
 * A docs host that invents a second logo for a product teaches readers the
 * wrong one. LocusGraph and BrainStorm have real artwork, so they get it;
 * Locus Skill has none yet and borrows a Phosphor glyph until it does.
 */
const MARKS: Record<Product, Mark | Icon> = {
  locusgraph: LocusGraphMark,
  spendgraph: TrendUpIcon,
  brainstorm: BrainStormMark,
  "locus-skill": FlowArrowIcon,
};

/**
 * Drawn artwork carries far more detail than a Phosphor glyph (dozens of thin
 * strokes against a handful of thick ones), so it reads as a smudge at the size
 * an icon is normally set, and gets a larger default.
 */
const DETAILED: Product[] = ["locusgraph", "brainstorm"];

/** `size` is the glyph, not the tile; the tile is whatever wraps this. */
export function ProductMark({ product, className }: { product: Product; className?: string }) {
  const Mark = MARKS[product];
  const fallback = DETAILED.includes(product) ? "size-6" : "size-4";
  // The name always sits beside the mark, so the glyph itself is decoration.
  return <Mark className={className ?? fallback} aria-hidden />;
}
