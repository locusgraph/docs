import { type LucideIcon, TrendingUp, Workflow } from "lucide-react";
import { BrainStormMark, LocusMark } from "@/components/site/marks";
import type { Product } from "@/lib/site/products";

type Mark = (props: { className?: string }) => React.ReactElement;

/**
 * The glyph each section wears.
 *
 * Spendgraph's is `TrendingUp` because that is the mark its own dashboard and
 * landing page already use — a docs host that invents a second logo for a
 * product teaches readers the wrong one. LocusGraph and BrainStorm have real
 * artwork, so they get it; Locus Skill has none yet and borrows a lucide glyph
 * until it does.
 */
const MARKS: Record<Product, Mark | LucideIcon> = {
  locusgraph: LocusMark,
  spendgraph: TrendingUp,
  brainstorm: BrainStormMark,
  "locus-skill": Workflow,
};

/**
 * Drawn artwork carries far more detail than a lucide glyph — dozens of thin
 * strokes against a handful of thick ones — so it reads as a smudge at the size
 * an icon is normally set, and gets a larger default.
 */
const DETAILED: Product[] = ["locusgraph", "brainstorm"];

/** `size` is the glyph, not the tile — the tile is whatever wraps this. */
export function ProductMark({ product, className }: { product: Product; className?: string }) {
  const Mark = MARKS[product];
  const fallback = DETAILED.includes(product) ? "size-6" : "size-4";
  return <Mark className={className ?? fallback} />;
}
