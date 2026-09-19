import { ImageResponse } from "next/og";

/**
 * The social card, drawn at build time.
 *
 * Generated rather than committed as a PNG: the card then carries the same
 * tokens as the site, and changing the wording is an edit here instead of a
 * round trip through a design tool. The route is static, so Satori runs during
 * `next build` and what ships is an ordinary image asset, not a function.
 */
export const alt = "LocusGraph Docs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0a0a0a",
        padding: 80,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "#ededed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0a0a0a",
            fontSize: 38,
            fontWeight: 700,
          }}
        >
          L
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#ededed", fontWeight: 600 }}>
          LocusGraph
          <span style={{ color: "#8b8b8b", marginLeft: 12, fontWeight: 400 }}>docs</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            color: "#ededed",
            letterSpacing: -2,
            lineHeight: 1.05,
          }}
        >
          Everything we ship,
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            color: "#3987e5",
            letterSpacing: -2,
            lineHeight: 1.05,
          }}
        >
          written down.
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#8b8b8b" }}>
          docs.locusgraph.com
        </div>
      </div>
    </div>,
    size
  );
}
