/**
 * What the daily replay sends, in what order, and how it judges the answer.
 *
 * Every example in `endpoints.json` was checked against the live API once, by
 * hand, and nothing stopped it drifting after that. `scripts/replay-samples.ts`
 * sends each documented sample again and compares the shape of what comes back
 * with the stored example: the same keys, the same nesting, the same types.
 * Never the values, because ids and timestamps change every run.
 *
 * The samples cannot be sent as written. They name a graph called `acme` and
 * ids like `pr_123` that exist nowhere, so each step here says which fields to
 * fill from the run so far, and which ids to keep from its own answer for the
 * steps after it. A step whose id never turned up is reported as not checked
 * rather than sent with a placeholder, because a `404` for `pr_123` says
 * nothing about the endpoint.
 */
import type { Endpoint } from "./endpoints";

/** Ids collected as the run goes, keyed by what they are. */
export type Found = Record<string, string>;

export interface Step {
  readonly product: Endpoint["product"];
  readonly slug: string;
  /** Ids this step cannot be sent without. */
  readonly needs?: readonly string[];
  /** Fields to replace in the sample, from what the run has found. */
  readonly fill?: (found: Found) => Record<string, unknown>;
  /** Ids to keep from this step's answer. */
  readonly keep?: (data: unknown) => Found;
  /**
   * Calls sent first and not judged, for a step that needs something in place.
   * Each is another endpoint's slug in the same section and the body to send.
   */
  readonly before?: readonly { readonly slug: string; readonly body: Record<string, unknown> }[];
  /**
   * What to send for an endpoint's file fields. The sample names a file, like
   * `handbook.pdf`, that no runner has on disk, so the replay sends this in its
   * place, under this name, for every field `endpoints.json` marks as a file.
   */
  readonly upload?: { readonly name: string; readonly text: string };
}

const at = (data: unknown, ...path: (string | number)[]): string | undefined => {
  let here: unknown = data;
  for (const key of path) {
    if (here === null || typeof here !== "object") return undefined;
    here = (here as Record<string | number, unknown>)[key];
  }
  return typeof here === "string" ? here : undefined;
};

const kept = (entries: Record<string, string | undefined>): Found =>
  Object.fromEntries(Object.entries(entries).filter(([, v]) => v !== undefined)) as Found;

/**
 * LocusGraph, in an order where each write lands on a graph that can take it.
 *
 * `store-a-batch` and `store-an-event` both write `preference:dark_mode` with
 * different text, and a context holds one memory, so the second would answer
 * `409`. `forget-a-context` sits between them for that reason, and doubles as
 * its own check. `delete-a-memory` goes last because everything before it
 * reads the memory it deletes.
 */
const LOCUSGRAPH: Step[] = [
  { product: "locusgraph", slug: "list-event-kinds" },
  { product: "locusgraph", slug: "list-graphs" },
  { product: "locusgraph", slug: "read-a-graph" },
  { product: "locusgraph", slug: "read-a-graph-shape" },
  { product: "locusgraph", slug: "store-a-batch" },
  { product: "locusgraph", slug: "forget-a-context" },
  {
    product: "locusgraph",
    slug: "store-an-event",
    keep: (data) => kept({ locus_id: at(data, "data", "locus_id") }),
  },
  {
    product: "locusgraph",
    slug: "read-a-memory",
    needs: ["locus_id"],
    fill: (found) => ({ locus_id: found.locus_id }),
  },
  { product: "locusgraph", slug: "list-memories" },
  { product: "locusgraph", slug: "list-memories-in-a-context" },
  { product: "locusgraph", slug: "list-memories-under-one-context" },
  { product: "locusgraph", slug: "read-a-context" },
  { product: "locusgraph", slug: "look-up-a-context" },
  { product: "locusgraph", slug: "look-up-contexts-in-bulk" },
  { product: "locusgraph", slug: "search-memories" },
  { product: "locusgraph", slug: "list-contexts" },
  { product: "locusgraph", slug: "list-events" },
  { product: "locusgraph", slug: "list-rejected-events" },
  { product: "locusgraph", slug: "run-a-transaction" },
  {
    product: "locusgraph",
    slug: "link-two-contexts",
    // Both ends must exist before a link between them is accepted.
    before: ["person:alice", "org:acme"].map((context_id) => ({
      slug: "store-an-event",
      body: {
        context_id,
        event_kind: "fact",
        payload: { data: `Replay fixture for ${context_id}` },
      },
    })),
  },
  { product: "locusgraph", slug: "read-relationships" },
  { product: "locusgraph", slug: "walk-a-context" },
  { product: "locusgraph", slug: "walk-a-graph" },
  { product: "locusgraph", slug: "unlink-two-contexts" },
  {
    product: "locusgraph",
    slug: "resolve-a-context",
    needs: ["locus_id"],
    fill: (found) => ({ locus_id: found.locus_id }),
  },
  {
    product: "locusgraph",
    slug: "resolve-in-bulk",
    needs: ["locus_id"],
    fill: (found) => ({ resolutions: [{ context_id: "person:alice", locus_id: found.locus_id }] }),
  },
  {
    product: "locusgraph",
    slug: "list-unresolved",
    keep: (data) => kept({ unresolved: at(data, "data", "context_ids", 0) }),
  },
  {
    product: "locusgraph",
    slug: "read-unresolved",
    needs: ["unresolved"],
    fill: (found) => ({ context_id: found.unresolved }),
  },
  { product: "locusgraph", slug: "send-an-observation" },
  {
    product: "locusgraph",
    slug: "read-the-inbox",
    keep: (data) =>
      kept({
        finding:
          at(data, "data", "findings", 0, "id") ?? at(data, "data", "findings", 0, "finding_id"),
        other_finding:
          at(data, "data", "findings", 1, "id") ?? at(data, "data", "findings", 1, "finding_id"),
      }),
  },
  { product: "locusgraph", slug: "list-findings" },
  {
    product: "locusgraph",
    slug: "approve-a-finding",
    needs: ["finding"],
    fill: (found) => ({ finding_id: found.finding }),
  },
  {
    product: "locusgraph",
    slug: "reject-a-finding",
    needs: ["other_finding"],
    fill: (found) => ({ finding_id: found.other_finding }),
  },
  {
    product: "locusgraph",
    slug: "ingest-a-document",
    upload: { name: "replay.md", text: "Deploys stop at 14:00 on Fridays.\n" },
    keep: (data) => kept({ job_id: at(data, "data", "job_id") }),
  },
  {
    product: "locusgraph",
    slug: "read-an-ingest-job",
    needs: ["job_id"],
    fill: (found) => ({ job_id: found.job_id }),
  },
  {
    product: "locusgraph",
    slug: "delete-a-memory",
    needs: ["locus_id"],
    fill: (found) => ({ locus_id: found.locus_id }),
  },
];

/**
 * Spendgraph, built around one prompt and one tool the run creates and then
 * archives. A run only exists after `run-a-prompt`, which costs money and is
 * skipped, so `read-a-run` is checked only when the project already has one.
 */
const SPENDGRAPH: Step[] = [
  { product: "spendgraph", slug: "report-usage" },
  { product: "spendgraph", slug: "list-events" },
  { product: "spendgraph", slug: "list-alerts" },
  { product: "spendgraph", slug: "usage-summary" },
  { product: "spendgraph", slug: "usage-over-time" },
  { product: "spendgraph", slug: "usage-by-model" },
  { product: "spendgraph", slug: "usage-by-key" },
  { product: "spendgraph", slug: "usage-by-tag" },
  { product: "spendgraph", slug: "list-prompts" },
  {
    product: "spendgraph",
    slug: "create-a-prompt",
    keep: (data) =>
      kept({
        prompt: at(data, "prompt", "id"),
        project: at(data, "prompt", "projectId"),
        version: at(data, "prompt", "currentVersionId"),
      }),
  },
  {
    product: "spendgraph",
    slug: "update-a-prompt",
    needs: ["prompt", "project"],
    // The sample's `prj_8c41` stands for the prompt's own project, which only
    // the prompt that `create-a-prompt` made can say.
    fill: (found) => ({ id: found.prompt, projectId: found.project }),
  },
  ...["read-a-prompt", "list-versions"].map(
    (slug): Step => ({
      product: "spendgraph",
      slug,
      needs: ["prompt"],
      fill: (found) => ({ id: found.prompt }),
    })
  ),
  ...["create-a-version", "publish-a-version"].map(
    (slug): Step => ({
      product: "spendgraph",
      slug,
      needs: ["prompt", "version"],
      fill: (found) => ({ id: found.prompt, versionId: found.version }),
    })
  ),
  {
    product: "spendgraph",
    slug: "record-a-rollout",
    needs: ["prompt"],
    // The caller names the rollout, so a fixed one would collide with
    // yesterday's run.
    fill: (found) => ({ id: found.prompt, rolloutId: `ro_replay_${Date.now()}` }),
  },
  ...["list-rollouts", "read-cases", "replace-cases"].map(
    (slug): Step => ({
      product: "spendgraph",
      slug,
      needs: ["prompt"],
      fill: (found) => ({ id: found.prompt }),
    })
  ),
  {
    product: "spendgraph",
    slug: "list-runs",
    keep: (data) => kept({ run: at(data, "runs", 0, "id") }),
  },
  {
    product: "spendgraph",
    slug: "read-a-run",
    needs: ["run"],
    fill: (found) => ({ id: found.run }),
  },
  {
    product: "spendgraph",
    slug: "archive-a-prompt",
    needs: ["prompt"],
    fill: (found) => ({ id: found.prompt }),
  },
  { product: "spendgraph", slug: "list-tools" },
  {
    product: "spendgraph",
    slug: "create-a-tool",
    // A name stays taken after its tool is archived, and a second create with
    // it answers `500`, so each run brings its own.
    fill: () => ({ name: `get_weather_${Date.now()}` }),
    keep: (data) => kept({ tool: at(data, "tool", "id"), tool_name: at(data, "tool", "name") }),
  },
  {
    product: "spendgraph",
    slug: "update-a-tool",
    needs: ["tool", "tool_name"],
    // The sample renames the tool to `get_weather`, which an earlier run holds.
    fill: (found) => ({ id: found.tool, name: found.tool_name }),
  },
  ...["read-a-tool", "archive-a-tool"].map(
    (slug): Step => ({
      product: "spendgraph",
      slug,
      needs: ["tool"],
      fill: (found) => ({ id: found.tool }),
    })
  ),
  { product: "spendgraph", slug: "upload-a-file" },
];

export const STEPS: readonly Step[] = [...LOCUSGRAPH, ...SPENDGRAPH];

/**
 * Contexts the LocusGraph steps write, forgotten after the run whether or not
 * it passed, so the graph is empty again the next morning.
 */
export const WRITTEN_CONTEXTS = [
  ["preference", "dark_mode"],
  ["decision", "use_postgres"],
  ["person", "alice"],
  ["org", "acme"],
] as const;

/**
 * A value reduced to its shape.
 *
 * An array takes the shape of its first element, because the examples hold
 * one representative item, not a census. `null` stands for "nullable, type
 * unknown": the stored examples were captured on a fresh account, where
 * `promptVersionId` and its like were all `null`, and a real answer filling
 * one in is the API working, not drifting.
 */
export function shapeOf(value: unknown): unknown {
  if (value === null) return null;
  if (Array.isArray(value)) return value.length === 0 ? [] : [shapeOf(value[0])];
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, shapeOf(v)])
    );
  }
  return typeof value;
}

/**
 * Where two shapes disagree, as one line per path.
 *
 * An empty array on either side matches any array, since an empty list in the
 * example says nothing about what an item looks like, and an empty answer says
 * nothing about whether the items changed.
 */
export function shapeDiff(expected: unknown, actual: unknown, path = "$"): string[] {
  if (expected === null || actual === null) return [];

  // A leaf's shape is its type name, so two leaves compare as strings.
  const kind = (v: unknown) => (Array.isArray(v) ? "array" : typeof v === "string" ? v : typeof v);
  if (kind(expected) !== kind(actual)) {
    return [`${path}: expected ${describe(expected)}, got ${describe(actual)}`];
  }

  if (Array.isArray(expected) && Array.isArray(actual)) {
    if (expected.length === 0 || actual.length === 0) return [];
    return shapeDiff(expected[0], actual[0], `${path}[0]`);
  }

  if (typeof expected === "object" && typeof actual === "object") {
    const e = expected as Record<string, unknown>;
    const a = actual as Record<string, unknown>;
    const lines: string[] = [];
    for (const key of Object.keys(e)) {
      if (!(key in a)) lines.push(`${path}.${key}: missing from the answer`);
      else lines.push(...shapeDiff(e[key], a[key], `${path}.${key}`));
    }
    for (const key of Object.keys(a)) {
      if (!(key in e)) lines.push(`${path}.${key}: not in the example`);
    }
    return lines;
  }

  return [];
}

function describe(shape: unknown): string {
  if (Array.isArray(shape)) return "an array";
  if (typeof shape === "object") return "an object";
  return String(shape);
}
