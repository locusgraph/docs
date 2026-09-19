/**
 * The public API: what a key with the default scopes can reach.
 *
 * `DEFAULT_KEY_SCOPES` in the engine is `["memory.read", "memory.write"]`, so
 * that is the line drawn here. Deliberately outside it, and not documented on
 * this host: `key.manage`, `graph.create`, `graph.admin` and `analytics.read`.
 * Those are the control plane, reachable only by a key someone widened on
 * purpose or by a signed-in session, and a reference page for them would invite
 * calls that answer 403 to almost everyone reading it.
 *
 * Every parameter below is copied from the engine, never inferred: the shapes
 * come from the MCP catalogue's JSON Schemas, which are the same descriptors
 * the server advertises, and the numbers from the request parser beside the
 * route. A field nobody can point at in the engine does not go in this file.
 */

export interface ApiParam {
  readonly name: string;
  readonly type: string;
  readonly required?: boolean;
  readonly note: string;
  /**
   * The values this field accepts, when it is an enum. The playground renders a
   * select rather than a text box, because a field with eight valid values and
   * no list of them is a field you have to leave the page to fill in.
   */
  readonly options?: readonly string[];
  /** `prose` gets a textarea: a payload is a sentence, not a word. */
  readonly field?: "prose";
}

export interface ApiError {
  readonly status: number;
  readonly code: string;
  readonly note: string;
}

export interface Endpoint {
  readonly slug: string;
  readonly group: string;
  readonly name: string;
  readonly method: "GET" | "POST" | "DELETE";
  readonly path: string;
  readonly scope: "memory.read" | "memory.write";
  readonly summary: string;
  readonly description: string;
  readonly params: readonly ApiParam[];
  readonly returns: string;
  readonly sample: Record<string, unknown>;
  readonly response: string;
  readonly errors: readonly ApiError[];
}

/** On every endpoint, so each page does not restate them. */
const COMMON: readonly ApiError[] = [
  {
    status: 400,
    code: "BAD_REQUEST",
    note: "The body was not valid JSON, or a field failed its check. The message names the field.",
  },
  { status: 401, code: "UNAUTHORIZED", note: "No key, or a key that has been revoked." },
  {
    status: 403,
    code: "FORBIDDEN",
    note: "The key is pinned to a different graph. A key cannot widen itself.",
  },
];

export const ENDPOINTS: readonly Endpoint[] = [
  {
    slug: "search-memories",
    group: "Memories",
    name: "Search memories",
    method: "POST",
    path: "/v1/memories",
    scope: "memory.read",
    summary: "Ask a question in your own words and get back the memories that answer it.",
    description:
      "Matching is on meaning, not keywords, so the query works best as the question your feature is actually trying to answer rather than the words you expect to find.",
    params: [
      {
        name: "graph_id",
        type: "string",
        required: true,
        note: "Which graph to search. A key pinned to one graph may omit it.",
      },
      { name: "query", type: "string", required: true, note: "Natural language search query." },
      {
        name: "limit",
        type: "integer",
        note: "Maximum memories to return. Defaults to 5, and anything above 100 is clamped to 100.",
      },
      {
        name: "format",
        type: '"markdown" | "toon" | "json"',
        options: ["markdown", "toon", "json"],
        note: "markdown, the default, is prompt-ready text. json returns structured items instead.",
      },
      {
        name: "context_ids",
        type: "string[]",
        note: "Narrows: results are restricted to these contexts.",
      },
      {
        name: "boost_context_ids",
        type: "string[]",
        note: "Widens: also pulls in memories linked to these contexts.",
      },
      {
        name: "context_types",
        type: "object",
        note: "Filter by type. Keys are type names, values are arrays of context names.",
      },
      {
        name: "sources",
        type: "string[]",
        note: 'Filter by provenance tier, for example ["verified", "tool"].',
      },
      {
        name: "expand_depth",
        type: "integer",
        note: "How many levels of links to follow. Defaults to 1.",
      },
    ],
    returns:
      'A rendered string by default. With `format: "json"` you get `items` instead of `memories`.',
    sample: { graph_id: "acme", query: "what theme do they like?", limit: 5 },
    response:
      '{\n  "memories": "- Prefers dark mode across all surfaces\\n- Asked for denser tables in reports",\n  "items_found": 2\n}',
    errors: COMMON,
  },
  {
    slug: "deep-recall",
    group: "Memories",
    name: "Deep recall",
    method: "POST",
    path: "/v1/memories/deep-recall",
    scope: "memory.read",
    summary: "One call for questions a single search cannot answer.",
    description:
      "Walks the graph rather than matching once, then answers in prose with the evidence behind it. Check `coverage` and `fallback` before trusting the summary: both shapes still return one, and both still cost you.",
    params: [
      { name: "graph_id", type: "string", required: true, note: "Which graph to walk." },
      {
        name: "question",
        type: "string",
        required: true,
        note: 'One focused question. Not a conversation, and not three questions joined by "and also".',
      },
      {
        name: "context_ids",
        type: "string[]",
        note: "Contexts you already believe are relevant, to start the walk from.",
      },
    ],
    returns:
      "`summary` in prose, `facts` as the evidence, and `coverage` saying whether the walk finished.",
    sample: { graph_id: "acme", question: "What did we decide about churn, and why?" },
    response:
      '{\n  "summary": "Churn was capped at 4% for Q3 …",\n  "facts": [ … ],\n  "coverage": "full",\n  "fallback": false\n}',
    errors: COMMON,
  },
  {
    slug: "store-an-event",
    group: "Events",
    name: "Store an event",
    method: "POST",
    path: "/v1/events",
    scope: "memory.write",
    summary: "Write one thing your app learned.",
    description:
      "Address it with a stable `context_id` in `type:name` form so repeated mentions of the same thing accrete on one node and can be reinforced or corrected later.",
    params: [
      { name: "graph_id", type: "string", required: true, note: "Which graph to write to." },
      {
        name: "event_kind",
        type: "enum",
        required: true,
        options: ["fact", "knowledge", "action", "decision", "observation", "feedback"],
        note: "What sort of memory this is.",
      },
      {
        name: "context_id",
        type: "string",
        note: "The stable address, in `type:name` form, for example `preference:dark_mode`.",
      },
      {
        name: "source",
        type: "enum",
        options: [
          "policy",
          "verified",
          "tool",
          "document",
          "user",
          "assistant",
          "derived",
          "system",
        ],
        note: "Provenance, which sets how far the memory is trusted. The ladder runs from policy down to system.",
      },
      {
        name: "payload",
        type: "object",
        field: "prose",
        note: "The memory itself. Put a concise natural-language statement in `payload.data`: that is the text search matches on.",
      },
      {
        name: "related_to",
        type: "string[]",
        note: "Associated context ids, in `type:name` form.",
      },
      { name: "extends", type: "string[]", note: "Contexts this memory adds detail to." },
      {
        name: "reinforces",
        type: "string[]",
        note: "Contexts this memory supports with new evidence.",
      },
      { name: "contradicts", type: "string[]", note: "Contexts this memory conflicts with." },
    ],
    returns: "The stored memory's id.",
    sample: {
      graph_id: "acme",
      context_id: "preference:dark_mode",
      event_kind: "fact",
      source: "user",
      payload: { data: "Prefers dark mode across all surfaces" },
    },
    response: '{\n  "locus_id": "L9f3a1c42e7b85d10",\n  "context_id": "preference:dark_mode"\n}',
    errors: COMMON,
  },
  {
    slug: "send-an-observation",
    group: "Review",
    name: "Send an observation",
    method: "POST",
    path: "/v1/awareness/observe",
    scope: "memory.write",
    summary: "Propose a memory instead of writing one.",
    description:
      "An observation is not a write with a flag on it. What comes back is an id, not a memory: the engine distils a statement from the payload and a person approves or rejects it before anything is stored.",
    params: [
      {
        name: "graph_id",
        type: "string",
        required: true,
        note: "Which graph the finding would be filed in.",
      },
      {
        name: "source",
        type: "enum",
        required: true,
        options: ["policy", "verified", "tool", "turn"],
        note: "Where this came from. `derived` is refused: the engine never re-observes its own output.",
      },
      {
        name: "payload",
        type: "string | object",
        required: true,
        field: "prose",
        note: "The raw observation, stored verbatim. Capped at 64KB; whole documents belong to ingest.",
      },
      {
        name: "stream",
        type: "string",
        note: "A name that keeps concurrent workflows apart. Capped at 256 bytes.",
      },
      {
        name: "observed_at",
        type: "integer",
        note: "When the observed thing happened, in unix seconds. No earlier than 2020, no more than a day ahead.",
      },
    ],
    returns: "`observation_id`, with a 202. Nothing is stored yet.",
    sample: {
      graph_id: "acme",
      source: "turn",
      payload: "user: we should never deploy on Fridays\\nassistant: noted",
    },
    response: '{\n  "observed": true,\n  "observation_id": "obs_7f2a9c"\n}',
    errors: [
      ...COMMON,
      {
        status: 429,
        code: "RATE_LIMITED",
        note: "The graph hit its daily observation cap. It accepts again once the UTC day rolls.",
      },
    ],
  },
  {
    slug: "list-contexts",
    group: "Contexts",
    name: "List contexts",
    method: "GET",
    path: "/v1/contexts/:graph_id",
    scope: "memory.read",
    summary: "Discover the context ids a graph already holds.",
    description:
      "Useful before writing, so a new memory lands on an existing node rather than creating a near-duplicate one letter apart.",
    params: [
      {
        name: "graph_id",
        type: "string",
        required: true,
        note: "In the path. Which graph to list.",
      },
      {
        name: "context_type",
        type: "string",
        note: "Filter to one type, for example `fact` or `constraint`.",
      },
      {
        name: "context_name",
        type: "string",
        note: "Filter to one name. With `context_type`, an exact match.",
      },
      { name: "limit", type: "integer", note: "Maximum to return. Defaults to 100." },
      { name: "page", type: "integer", note: "Which page to read. Defaults to 0." },
    ],
    returns: "The contexts, with how many memories each one holds.",
    sample: { graph_id: "acme" },
    response:
      '{\n  "contexts": [\n    { "context_id": "preference:dark_mode", "count": 3 }\n  ],\n  "total": 1\n}',
    errors: COMMON,
  },
  {
    slug: "delete-a-memory",
    group: "Memories",
    name: "Delete a memory",
    method: "DELETE",
    path: "/v1/locus/:graph_id/:locus_id",
    scope: "memory.write",
    summary: "Remove one memory and its links.",
    description:
      "The narrowest of the removal calls. It takes one memory, not a context and not a graph, and it is reversible: nothing here is a hard delete.",
    params: [
      {
        name: "graph_id",
        type: "string",
        required: true,
        note: "In the path. Which graph the memory is in.",
      },
      {
        name: "locus_id",
        type: "string",
        required: true,
        note: "In the path. The exact memory, for example `L9f3a1c42e7b85d10`.",
      },
    ],
    returns: "Confirmation, with the id that was removed.",
    sample: { graph_id: "acme", locus_id: "L9f3a1c42e7b85d10" },
    response: '{\n  "deleted": true,\n  "locus_id": "L9f3a1c42e7b85d10"\n}',
    errors: [
      ...COMMON,
      { status: 404, code: "NOT_FOUND", note: "No memory with that id in this graph." },
    ],
  },
];

export const API_GROUPS = [...new Set(ENDPOINTS.map((e) => e.group))];

export function endpointBySlug(slug: string): Endpoint | undefined {
  return ENDPOINTS.find((e) => e.slug === slug);
}
