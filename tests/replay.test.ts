import { describe, expect, it } from "vitest";
import { ENDPOINTS, endpointBySlug } from "../lib/api/endpoints";
import { STEPS, shapeDiff, shapeOf } from "../lib/api/replay";

/**
 * The daily replay is only as good as its coverage. An endpoint added to
 * `endpoints.json` and to no step would never be sent, and the report would
 * stay green about it forever.
 */
describe("the replay plan", () => {
  it("sends every endpoint, or says why it does not", () => {
    const planned = new Set(STEPS.map((s) => `${s.product}/${s.slug}`));
    const unplanned = ENDPOINTS.filter((e) => !e.skip && !planned.has(`${e.product}/${e.slug}`));
    expect(
      unplanned.map((e) => `${e.product}/${e.slug}`),
      "add a step in lib/api/replay.ts, or a skip reason in endpoints.json"
    ).toEqual([]);
  });

  it("sends nothing it has been told to skip", () => {
    const skipped = STEPS.filter((s) => endpointBySlug(s.product, s.slug)?.skip);
    expect(skipped.map((s) => s.slug)).toEqual([]);
  });

  it("names only endpoints that exist, in its steps and its set-up calls", () => {
    for (const step of STEPS) {
      expect(endpointBySlug(step.product, step.slug), step.slug).toBeDefined();
      for (const setup of step.before ?? []) {
        expect(endpointBySlug(step.product, setup.slug), setup.slug).toBeDefined();
      }
    }
  });

  it("sends each endpoint once", () => {
    const keys = STEPS.map((s) => `${s.product}/${s.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("finds every id a step needs in a step before it", () => {
    // `keep` runs on an answer, so this checks the declared order rather than
    // the values: a step that needs `prompt` must come after one that keeps it.
    const keeps: Record<string, string[]> = {
      "store-an-event": ["locus_id"],
      "list-unresolved": ["unresolved"],
      "read-the-inbox": ["finding", "other_finding"],
      "ingest-a-document": ["job_id"],
      "create-a-prompt": ["prompt", "version"],
      "list-runs": ["run"],
      "create-a-tool": ["tool", "tool_name"],
    };
    const have = new Set<string>();
    for (const step of STEPS) {
      for (const id of step.needs ?? []) expect(have, `${step.slug} needs ${id}`).toContain(id);
      for (const id of keeps[step.slug] ?? []) have.add(id);
    }
  });
});

describe("comparing shapes", () => {
  const same = (a: unknown, b: unknown) => shapeDiff(shapeOf(a), shapeOf(b));

  it("ignores values", () => {
    expect(same({ id: "a", n: 1 }, { id: "b", n: 2 })).toEqual([]);
  });

  it("names a key the answer dropped and one it added", () => {
    expect(same({ stored: 1 }, { accepted: 1 })).toEqual([
      "$.stored: missing from the answer",
      "$.accepted: not in the example",
    ]);
  });

  it("names a changed type, down to the leaf", () => {
    expect(same({ data: { n: 1 } }, { data: { n: "1" } })).toEqual([
      "$.data.n: expected number, got string",
    ]);
  });

  it("compares the first item of a list", () => {
    expect(same({ items: [{ a: 1 }] }, { items: [{ a: 1, b: 2 }] })).toEqual([
      "$.items[0].b: not in the example",
    ]);
  });

  it("lets an empty list match any list", () => {
    expect(same({ items: [] }, { items: [{ a: 1 }] })).toEqual([]);
    expect(same({ items: [{ a: 1 }] }, { items: [] })).toEqual([]);
  });

  it("treats null as nullable on either side", () => {
    expect(same({ v: null }, { v: "pv_1" })).toEqual([]);
    expect(same({ v: "pv_1" }, { v: null })).toEqual([]);
  });

  it("tells an object from a list", () => {
    expect(same({ v: [] }, { v: {} })).toEqual(["$.v: expected an array, got an object"]);
  });
});
