import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AgentPrompt } from "../components/site/agent-prompt";
import { PRODUCT_INFO } from "../lib/site/products";

/**
 * The host index carries one "Start with an agent" button per product. With
 * the visible label alone they share one accessible name, so a screen reader
 * listing buttons reads the same words twice. Each has to carry its product's
 * title inside the button itself, where it becomes part of the name.
 */
describe("AgentPrompt", () => {
  for (const product of ["locusgraph", "spendgraph"] as const) {
    it(`names ${product} inside its button`, () => {
      const html = renderToStaticMarkup(<AgentPrompt product={product} />);
      const button = html.match(/<button[\s\S]*?<\/button>/)?.[0] ?? "";
      expect(button).toContain("Start with an agent");
      expect(button).toContain(`for ${PRODUCT_INFO[product].title}`);
      expect(button).not.toContain("aria-live");
      expect(html).toContain('role="status"');
    });
  }
});
