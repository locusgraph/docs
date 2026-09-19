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
 * Every parameter is copied from the engine, never inferred: the shapes come
 * from the MCP catalogue's JSON Schemas, which are the same descriptors the
 * server advertises, and the numbers from the request parser beside the route.
 * A field nobody can point at in the engine does not go in here.
 *
 * The data itself is `endpoints.json`, not a literal in this file. Both the app
 * and `scripts/build-docs-artifacts.mjs` need it, and that script cannot import
 * TypeScript: it was reading this file with a regex, which reached the summary
 * and nothing else, so every endpoint in `llms-full.txt` was a stub with no
 * parameters, no errors and no response. JSON is the one shape both can read.
 */

import spec from "./endpoints.json";

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

export const ENDPOINTS: readonly Endpoint[] = spec as readonly Endpoint[];

export const API_GROUPS = [...new Set(ENDPOINTS.map((e) => e.group))];

export function endpointBySlug(slug: string): Endpoint | undefined {
  return ENDPOINTS.find((e) => e.slug === slug);
}
