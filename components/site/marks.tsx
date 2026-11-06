/**
 * The BrainStorm mark: a hub with eight nodes radiating off it.
 *
 * The artwork ships with a rounded `rect` behind it, which is dropped here —
 * every caller already sets the mark inside a rounded tile of its own, and
 * keeping it would nest one rounded square inside another. Strokes and fills
 * become `currentColor` for the same reason the other marks do: the tile
 * decides the colour, and the glyph follows it into either theme.
 */
export function BrainStormMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className ?? "size-full"} aria-hidden="true">
      <title>BrainStorm</title>
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="38.18" y1="34.01" x2="51.97" y2="38.49" />
        <line x1="32.45" y1="38.48" x2="33.53" y2="53.95" />
        <line x1="28.67" y1="37.58" x2="24.32" y2="44.88" />
        <line x1="26.37" y1="35.25" x2="15.55" y2="41.5" />
        <line x1="26.16" y1="29.15" x2="13.13" y2="22.79" />
        <line x1="28.75" y1="26.37" x2="24.5" y2="19.01" />
        <line x1="32" y1="25.5" x2="32" y2="10" />
        <line x1="37.84" y1="29.15" x2="48.18" y2="24.11" />
      </g>
      <g fill="currentColor">
        <circle cx="51.97" cy="38.49" r="2.4" />
        <circle cx="33.53" cy="53.95" r="2.7" />
        <circle cx="24.32" cy="44.88" r="2" />
        <circle cx="15.55" cy="41.5" r="2.1" />
        <circle cx="13.13" cy="22.79" r="2.5" />
        <circle cx="24.5" cy="19.01" r="2" />
        <circle cx="32" cy="10" r="2.7" />
        <circle cx="48.18" cy="24.11" r="2.2" />
        <circle cx="32" cy="32" r="3.6" />
      </g>
    </svg>
  );
}

export function XMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}
