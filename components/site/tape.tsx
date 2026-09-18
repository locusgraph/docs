/**
 * A hairline tape streaming under the hero.
 *
 * Spendgraph's landing page runs this as a WebGPU shader — one line per request,
 * height by cost. There is nothing to measure on a docs host, and a page of
 * prose does not earn a GPU dependency, so this is the same figure drawn in CSS:
 * a band of hairlines sliding right, fading out at both edges.
 *
 * Heights come from a fixed formula rather than `Math.random`, so the server and
 * the client draw the same bars and nothing shifts on hydration. The strip is
 * rendered twice and translated by exactly half its width, which is what makes
 * the loop seamless.
 *
 * `aria-hidden` throughout: it carries no information. Under
 * `prefers-reduced-motion` the animation stops and the bars stay put — the band
 * still reads as a tape, it simply holds still.
 */
// Each bar occupies 4px — 1px wide plus a 3px gap — so one strip has to carry
// enough of them to cover the widest the band is ever drawn (max-w-5xl, 1024px).
// Short of that the strip ends mid-page and the loop shows its seam.
const COUNT = 288;

function heights(): number[] {
  return Array.from({ length: COUNT }, (_, i) => {
    // Three incommensurable waves, so the pattern never visibly repeats inside
    // one pass even though it is entirely deterministic.
    const wave = Math.sin(i * 0.7) + Math.sin(i * 0.31) * 0.6 + Math.sin(i * 1.9) * 0.3;
    return Math.round(18 + ((wave + 1.9) / 3.8) * 82);
  });
}

function Strip({ bars }: { bars: number[] }) {
  return (
    <div className="flex h-full shrink-0 items-end gap-[3px]">
      {bars.map((height, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length decorative strip
          key={i}
          className="w-px shrink-0 rounded-full bg-s1"
          style={{ height: `${height}%`, opacity: 0.18 + (height / 100) * 0.5 }}
        />
      ))}
    </div>
  );
}

export function Tape() {
  const bars = heights();

  return (
    <div
      aria-hidden
      className="pointer-events-none mx-auto mt-14 h-16 w-full max-w-5xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      <div className="tape flex h-full w-max items-end gap-[3px]">
        <Strip bars={bars} />
        <Strip bars={bars} />
      </div>
    </div>
  );
}
