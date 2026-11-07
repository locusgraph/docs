import { LocusGraphMark, SpendGraphMark } from "@locusgraph/brand";
import type { Icon } from "@phosphor-icons/react";
import { FlowArrowIcon } from "@phosphor-icons/react/ssr";
import { BrainStormMark } from "@/components/site/marks";
import type { Product } from "@/lib/site/products";

type Mark = (props: { className?: string; "aria-hidden"?: boolean }) => React.ReactElement;

/**
 * The glyph each section wears, and the only place on the host that picks one.
 * The headers and the host index all draw marks through `ProductMark`, so a
 * new mark is a one-line change here.
 *
 * LocusGraph and Spendgraph wear the marks `@locusgraph/brand` ships, the same
 * ones their own sites use; a docs host that invents a second logo for a
 * product teaches readers the wrong one. BrainStorm has its own artwork here.
 * Locus Skill has none yet and borrows a Phosphor glyph until it does.
 */
const MARKS: Record<Product, Mark | Icon> = {
  locusgraph: LocusGraphMark,
  spendgraph: SpendGraphMark,
  brainstorm: BrainStormMark,
  "locus-skill": FlowArrowIcon,
};

/**
 * Drawn artwork reads smaller than a Phosphor glyph at the same box. The
 * LocusGraph and BrainStorm marks are dozens of thin strokes, and the Spendgraph
 * tally sits inside a wide margin of its own viewBox, so all three get the
 * larger default.
 */
const DETAILED: Product[] = ["locusgraph", "spendgraph", "brainstorm"];

/** `size` is the glyph, not the tile; the tile is whatever wraps this. */
export function ProductMark({ product, className }: { product: Product; className?: string }) {
  const Mark = MARKS[product];
  const fallback = DETAILED.includes(product) ? "size-6" : "size-4";
  // The name always sits beside the mark, so the glyph itself is decoration.
  return <Mark className={className ?? fallback} aria-hidden />;
}
