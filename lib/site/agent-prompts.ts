import type { Product } from "@/lib/site/products";

/**
 * The prompt each card on the host index copies, one per ready section.
 *
 * One prompt used to cover both products, so a reader who wanted only one of
 * them handed their agent a second product to ignore. Each now names its own
 * product and nothing else, and points at that section's own map, so the
 * agent starts from a list of the pages it needs and no others.
 *
 * Everything named here exists. `tests/llms.test.ts` checks every
 * URL against the built files, because an agent handed a 404 reports that
 * the docs are missing.
 */
const SITE = "https://docs.locusgraph.com";

export const AGENT_PROMPTS = {
  locusgraph: `Use LocusGraph for durable memory in this project.

Documentation index for models: ${SITE}/locusgraph/llms.txt
Any page as markdown: append .md to its URL

Start here:
  ${SITE}/locusgraph/quickstart.md

LocusGraph also speaks MCP at https://api.locusgraph.com/mcp, which is the
better route if this editor can connect to a remote MCP server:
  ${SITE}/locusgraph/mcp/connecting.md`,

  spendgraph: `Use Spendgraph to know what each model call in this project costs.

Documentation index for models: ${SITE}/spendgraph/llms.txt
Any page as markdown: append .md to its URL

Start here:
  ${SITE}/spendgraph/getting-started.md

Then the SDK, to report each call and read back what it cost:
  ${SITE}/spendgraph/sdk/quickstart.md`,
} satisfies Partial<Record<Product, string>>;

export type PromptProduct = keyof typeof AGENT_PROMPTS;

export function hasAgentPrompt(product: Product): product is PromptProduct {
  return product in AGENT_PROMPTS;
}
