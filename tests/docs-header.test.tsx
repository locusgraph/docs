import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const path = vi.hoisted(() => ({ current: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => path.current,
  useRouter: () => ({ push: () => {}, prefetch: () => {}, replace: () => {} }),
}));

const { DocsHeader } = await import("../components/docs/docs-header");

/**
 * The section switcher only exists because `DocsHeader` from
 * `@locusgraph/components` draws its brand through `linkComponent`, and this
 * host swaps in a menu when it sees the placeholder href. A package release
 * that draws the brand some other way would quietly leave a dead
 * `#switch-section` link in the header, so the rendered header is held here.
 */
function render(pathname: string): string {
  path.current = pathname;
  return renderToStaticMarkup(<DocsHeader />);
}

describe("DocsHeader", () => {
  for (const pathname of ["/spendgraph/sdk/errors", "/locusgraph/recall/deep-recall"]) {
    it(`draws the brand as a menu button on ${pathname}`, () => {
      const html = render(pathname);
      expect(html).toMatch(/<button[^>]*aria-haspopup="menu"/);
      expect(html).not.toContain('href="#switch-section"');
    });
  }

  it("names the section in the brand", () => {
    expect(render("/spendgraph/sdk/errors")).toContain(">Spendgraph<");
  });
});
