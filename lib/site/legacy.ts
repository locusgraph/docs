/**
 * Where each page of the old docs host now lives.
 *
 * `doc.locusgraph.com` served the first LocusGraph docs, a Vocs site on Vercel,
 * until this host replaced it. Its 48 pages were indexed and linked from
 * elsewhere, and they describe an API that has since been renamed, so the name
 * points at this worker now and every old path answers a permanent redirect to
 * the page that covers the same ground. A path not listed lands on the
 * section's index rather than a 404.
 *
 * The old site had no sections, so its paths carry no `/locusgraph` prefix.
 * Several old pages fold into one new one: the nine `foundations` essays, for
 * one, are what `overview` says in a page.
 */
export const LEGACY_HOST = "doc.locusgraph.com";

export const LEGACY_FALLBACK = "/locusgraph";

export const LEGACY_REDIRECTS: Record<string, string> = {
  "/getting-started/introduction": "/locusgraph/overview",
  "/getting-started/quickstart": "/locusgraph/quickstart",
  "/getting-started/authentication": "/locusgraph/graphs/keys",

  "/api/store-event": "/locusgraph/api/store-an-event",
  "/api/retrieve-memories": "/locusgraph/api/search-memories",
  "/api/get-context": "/locusgraph/api/read-a-context",
  "/api/list-contexts": "/locusgraph/api/list-contexts",
  "/api/generate-insights": "/locusgraph/api/deep-recall",
  "/api/response-format": "/locusgraph/recall/results",

  "/concepts/memories-and-events": "/locusgraph/concepts",
  "/concepts/contexts-and-graphs": "/locusgraph/contexts/overview",
  "/concepts/event-kinds": "/locusgraph/remember/event-kinds",
  "/concepts/sources": "/locusgraph/remember/sources",
  "/concepts/memory-links": "/locusgraph/contexts/linking",
  "/concepts/payload-structure": "/locusgraph/remember/store",

  "/context-engineering/overview": "/locusgraph/concepts",
  "/context-engineering/memory-schemas": "/locusgraph/contexts/naming",
  "/context-engineering/scoping-strategies": "/locusgraph/use-cases/multi-tenant",
  "/context-engineering/relevance-and-retrieval": "/locusgraph/recall/search",
  "/context-engineering/context-windows": "/locusgraph/recall/options",

  "/foundations/what-is-locusgraph": "/locusgraph/overview",
  "/foundations/agent-structured-knowledge": "/locusgraph/overview",
  "/foundations/graduation-plane": "/locusgraph/overview",
  "/foundations/llm-agnostic": "/locusgraph/overview",
  "/foundations/vs-memory-systems": "/locusgraph/overview",
  "/foundations/evolving-skills": "/locusgraph/use-cases/agent-skills",
  "/foundations/own-your-ip": "/locusgraph/use-cases/agent-skills",
  "/foundations/tokens-in-ides": "/locusgraph/overview",
  "/foundations/context-engineering-misconceptions": "/locusgraph/concepts",

  "/guides/common-patterns": "/locusgraph/overview",
  "/guides/environment-variables": "/locusgraph/client/connecting",
  "/guides/error-handling": "/locusgraph/client/errors",

  "/integrations/langchain": "/locusgraph/client/install",

  "/mcp/overview": "/locusgraph/mcp/overview",
  "/mcp/clients": "/locusgraph/mcp/connecting",
  "/mcp/claude-code": "/locusgraph/mcp/connecting",
  "/mcp/tools": "/locusgraph/mcp/tools",
  "/mcp/resources": "/locusgraph/mcp/resources",

  // Only the TypeScript client is documented here. The other two languages
  // reach LocusGraph over HTTP, which is what the API reference covers.
  "/sdks/typescript": "/locusgraph/client/install",
  "/sdks/python": "/locusgraph/api/search-memories",
  "/sdks/rust": "/locusgraph/api/search-memories",

  "/support/faq": "/locusgraph/overview",

  "/workflows/overview": "/locusgraph/overview",
  "/workflows/single-agent": "/locusgraph/use-cases/agent-skills",
  "/workflows/coding-agent": "/locusgraph/use-cases/agent-skills",
  "/workflows/multi-agent": "/locusgraph/use-cases/team-knowledge",
  "/workflows/session-and-long-term": "/locusgraph/use-cases/conversations",
  "/workflows/memory-augmented-rag": "/locusgraph/use-cases/documents",

  "/llms.txt": "/llms.txt",
  "/llms-full.txt": "/llms-full.txt",
};
