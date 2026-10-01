/**
 * Send every documented sample to the live API and compare the shape of each
 * answer with the example stored beside it.
 *
 *   pnpm replay                       # print the report
 *   pnpm replay --report report.md    # and write it to a file
 *
 * Reads `LOCUSGRAPH_API_KEY`, `LOCUSGRAPH_GRAPH_ID` and `SPENDGRAPH_API_KEY`
 * from the environment, or from `.env` when run locally. Exits `1` when any
 * endpoint diverged, which is what the scheduled workflow files an issue on.
 * The order, the ids and the comparison are in `lib/api/replay.ts`.
 */
import { writeFileSync } from "node:fs";
import {
  API_KEY_ENV,
  API_KEY_HEADER,
  ENDPOINTS,
  type Endpoint,
  endpointBySlug,
} from "../lib/api/endpoints";
import {
  type Found,
  STEPS,
  type Step,
  shapeDiff,
  shapeOf,
  WRITTEN_CONTEXTS,
} from "../lib/api/replay";
import { requestFor } from "../lib/api/samples";

try {
  process.loadEnvFile?.(".env");
} catch {
  // No `.env` in CI. The workflow sets the same names from secrets.
}

const env = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
};

const GRAPH = env("LOCUSGRAPH_GRAPH_ID");

interface Result {
  readonly endpoint: Endpoint;
  readonly outcome: "matched" | "diverged" | "not checked" | "skipped";
  readonly detail?: string;
  readonly expected?: unknown;
  readonly actual?: unknown;
}

const parse = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

async function send(endpoint: Endpoint, body: Record<string, unknown>, upload?: Step["upload"]) {
  const { url, method, payload } = requestFor(endpoint, body);
  const header = API_KEY_HEADER[endpoint.product];
  const key = { [header.name]: header.value(env(API_KEY_ENV[endpoint.product])) };

  let init: RequestInit;
  if (upload) {
    // `fetch` writes the multipart boundary into Content-Type itself.
    const form = new FormData();
    for (const [k, v] of Object.entries(payload ?? {})) form.append(k, String(v));
    form.append(upload.field, new Blob([upload.text], { type: "text/markdown" }), upload.name);
    init = { method, headers: key, body: form };
  } else {
    init = {
      method,
      headers: { ...key, ...(payload ? { "Content-Type": "application/json" } : {}) },
      body: payload ? JSON.stringify(payload) : undefined,
    };
  }

  const res = await fetch(url, init);
  return { status: res.status, ok: res.ok, data: parse(await res.text()) };
}

/**
 * The sample as written, pointed at the replay graph and the ids found so far.
 *
 * Spendgraph's samples name a project, `prod`, and a key reads only the one it
 * is pinned to, answering `403 project_not_accessible` for any other. Leaving
 * the field out means "the key's own", which is the project the run is in.
 */
function bodyFor(endpoint: Endpoint, fill: Record<string, unknown>): Record<string, unknown> {
  const { project: _, ...rest } = endpoint.sample;
  const sample: Record<string, unknown> =
    endpoint.product === "spendgraph" ? rest : { ...endpoint.sample };
  if (endpoint.product === "locusgraph" && "graph_id" in sample) sample.graph_id = GRAPH;
  return { ...sample, ...fill };
}

/** Ids the run has found, shared with the clean-up that follows it. */
const found: Found = {};

const lg = (slug: string) => {
  const endpoint = endpointBySlug("locusgraph", slug);
  if (!endpoint) throw new Error(`locusgraph/${slug} is not in endpoints.json`);
  return endpoint;
};

/** Every memory in the replay graph, across as many pages as it takes. */
async function memoryIds(): Promise<string[]> {
  const ids: string[] = [];
  for (let page = 0; ; page++) {
    const { data } = await send(lg("list-memories"), { graph_id: GRAPH, page });
    const body = (data as { data?: { locuses?: { locus_id: string }[]; total?: number } }).data;
    const locuses = body?.locuses ?? [];
    ids.push(...locuses.map((l) => l.locus_id));
    if (locuses.length === 0 || ids.length >= (body?.total ?? 0)) return ids;
  }
}

async function run(): Promise<Result[]> {
  const results: Result[] = ENDPOINTS.filter((e) => e.skip).map((endpoint) => ({
    endpoint,
    outcome: "skipped" as const,
    detail: endpoint.skip,
  }));

  for (const step of STEPS) {
    const endpoint = endpointBySlug(step.product, step.slug);
    if (!endpoint) throw new Error(`${step.product}/${step.slug} is not in endpoints.json`);

    const missing = (step.needs ?? []).filter((id) => !(id in found));
    if (missing.length > 0) {
      results.push({
        endpoint,
        outcome: "not checked",
        detail: `no ${missing.join(" or ")} turned up earlier in the run`,
      });
      continue;
    }

    for (const setup of step.before ?? []) {
      const other = endpointBySlug(step.product, setup.slug);
      if (!other) throw new Error(`${step.product}/${setup.slug} is not in endpoints.json`);
      await send(other, bodyFor(other, setup.body));
    }

    const answer = await send(endpoint, bodyFor(endpoint, step.fill?.(found) ?? {}), step.upload);
    Object.assign(found, step.keep?.(answer.data) ?? {});

    const expected = shapeOf(parse(endpoint.response));
    const actual = shapeOf(answer.data);

    if (!answer.ok) {
      const said = typeof answer.data === "string" ? answer.data : JSON.stringify(answer.data);
      results.push({
        endpoint,
        outcome: "diverged",
        detail: `answered ${answer.status}: ${said.slice(0, 300)}`,
        expected,
        actual,
      });
      continue;
    }

    const diff = shapeDiff(expected, actual);
    results.push(
      diff.length === 0
        ? { endpoint, outcome: "matched" }
        : { endpoint, outcome: "diverged", detail: diff.join("\n"), expected, actual }
    );
  }

  return results;
}

/**
 * Leave the graph as the run found it, whatever the run concluded.
 *
 * Forgetting the contexts the samples name is not enough: an ingested document
 * and an observation each write memories under contexts the engine chooses.
 * So every memory that was not there before the run is deleted, once the
 * ingest job has stopped writing, or its memories would land after the
 * clean-up and count as the graph's own on the next run. A memory that was
 * there before the run is never touched.
 */
async function cleanUp(before: Set<string>) {
  if (found.job_id) {
    for (let tries = 0; tries < 30; tries++) {
      const { data } = await send(lg("read-an-ingest-job"), { job_id: found.job_id });
      if ((data as { data?: { status?: string } }).data?.status !== "processing") break;
      await new Promise((done) => setTimeout(done, 3000));
    }
  }

  for (const locus_id of await memoryIds()) {
    if (!before.has(locus_id)) await send(lg("delete-a-memory"), { graph_id: GRAPH, locus_id });
  }
  for (const [context_type, context_name] of WRITTEN_CONTEXTS) {
    await send(lg("forget-a-context"), { graph_id: GRAPH, context_type, context_name });
  }
}

function report(results: Result[]): string {
  const name = (r: Result) => `\`${r.endpoint.product}/${r.endpoint.slug}\``;
  const by = (outcome: Result["outcome"]) => results.filter((r) => r.outcome === outcome);
  const diverged = by("diverged");
  const lines = [
    `${by("matched").length} matched, ${diverged.length} diverged, ` +
      `${by("not checked").length} not checked, ${by("skipped").length} skipped.`,
    "",
  ];

  if (diverged.length > 0) {
    lines.push("## Diverged", "");
    for (const r of diverged) {
      lines.push(
        `### ${name(r)}`,
        "",
        `\`${r.endpoint.method} ${r.endpoint.path}\``,
        "",
        "```",
        r.detail ?? "",
        "```",
        "",
        "<details><summary>Expected shape, then actual</summary>",
        "",
        "```json",
        JSON.stringify(r.expected, null, 2),
        "```",
        "",
        "```json",
        JSON.stringify(r.actual, null, 2),
        "```",
        "",
        "</details>",
        ""
      );
    }
  }

  for (const outcome of ["not checked", "skipped"] as const) {
    const these = by(outcome);
    if (these.length === 0) continue;
    lines.push(`## ${outcome[0].toUpperCase()}${outcome.slice(1)}`, "");
    for (const r of these) lines.push(`- ${name(r)}: ${r.detail}`);
    lines.push("");
  }

  return lines.join("\n");
}

const before = new Set(await memoryIds());
const results = await run().finally(() => cleanUp(before));
const text = report(results);
console.log(text);

const to = process.argv.indexOf("--report");
if (to !== -1 && process.argv[to + 1]) writeFileSync(process.argv[to + 1], text);

process.exit(results.some((r) => r.outcome === "diverged") ? 1 : 0);
