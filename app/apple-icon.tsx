import { ImageResponse } from "next/og";

/**
 * The home-screen icon iOS asks for.
 *
 * `app/icon.svg` covers browser tabs, but iOS ignores SVG when a page is saved
 * to the home screen and falls back to a screenshot of the page. This is drawn
 * at build like the social card, so there is no binary to keep in the repo.
 *
 * The mark is a square rather than the site's own glyph: the LocusGraph artwork
 * is forty-one hairlines, which is illegible at 180px and unreadable at the
 * 60px iOS actually renders.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#ededed",
        fontSize: 104,
        fontWeight: 700,
        fontFamily: "sans-serif",
      }}
    >
      L
    </div>,
    size
  );
}
