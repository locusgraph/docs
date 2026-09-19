import { describe, expect, it } from "vitest";
import { API_BASE, API_KEY_ENV, ENDPOINTS, endpointBySlug } from "../lib/api/endpoints";
import { highlight, type Lang } from "../lib/api/highlight";
import { LANGS, sampleFor } from "../lib/api/samples";

/**
 * The API reference is generated, so the spec is the thing to hold.
 *
 * `lib/site/docs-manifest.ts` does not know these pages: the route reads
 * `lib/api/endpoints.ts` directly. That means the manifest tests say nothing
 * about them, and everything the manifest normally guarantees is asserted here
 * instead.
 */
describe("the endpoint spec", () => {
  it("has a unique slug within each section", () => {
    // Across sections a repeat is fine: they do not share a URL space, and
    // `list-prompts` should not have to dodge a name the other section took.
    for (const product of ["locusgraph", "spendgraph"]) {
      const slugs = ENDPOINTS.filter((e) => e.product === product).map((e) => e.slug);
      expect(new Set(slugs).size, `${product} repeats a slug`).toBe(slugs.length);
    }
  });

  it("finds every endpoint by its slug", () => {
    for (const endpoint of ENDPOINTS) {
      expect(endpointBySlug(endpoint.product, endpoint.slug)).toBe(endpoint);
    }
    expect(endpointBySlug("locusgraph", "nothing-like-this")).toBeUndefined();
  });

  /**
   * Only what a key reaches, per section.
   *
   * LocusGraph's `DEFAULT_KEY_SCOPES` is `["memory.read", "memory.write"]`, so
   * `key.manage`, `graph.admin`, `graph.create` and `analytics.read` are out.
   * Spendgraph gates keys, projects, pricing and credentials on a dashboard
   * session with no API-key path at all, so those are out for the same reason:
   * a reference page for them invites a call that answers 403 to nearly
   * everyone reading it.
   */
  const REACHABLE: Record<string, string[]> = {
    locusgraph: ["memory.read", "memory.write"],
    spendgraph: ["read", "write"],
  };

  it("documents nothing a key cannot reach", () => {
    for (const endpoint of ENDPOINTS) {
      expect(REACHABLE[endpoint.product], `${endpoint.slug} is ${endpoint.scope}`).toContain(
        endpoint.scope
      );
    }
  });

  it("says what each page is for, in one sentence", () => {
    for (const endpoint of ENDPOINTS) {
      expect(endpoint.summary.length, `${endpoint.slug} has no summary`).toBeGreaterThan(20);
      expect(endpoint.summary, `${endpoint.slug} summary runs on`).not.toContain(". ");
      expect(endpoint.params.length, `${endpoint.slug} documents no parameters`).toBeGreaterThan(0);
      expect(endpoint.errors.length, `${endpoint.slug} documents no failures`).toBeGreaterThan(2);
    }
  });

  it("gives every parameter a type and a note", () => {
    for (const endpoint of ENDPOINTS) {
      for (const param of endpoint.params) {
        expect(param.type, `${endpoint.slug}.${param.name} has no type`).toBeTruthy();
        expect(param.note.length, `${endpoint.slug}.${param.name} has no note`).toBeGreaterThan(10);
      }
    }
  });

  it("fills every path parameter from the sample", () => {
    for (const endpoint of ENDPOINTS) {
      for (const [, key] of endpoint.path.matchAll(/:([a-z_]+)/g)) {
        const named = endpoint.params.some((p) => p.name === key);
        expect(named, `${endpoint.slug} has :${key} in its path and no parameter for it`).toBe(
          true
        );
      }
    }
  });
});

/**
 * A sample someone pastes into a terminal has to be the call the page
 * documents. These check the shape rather than the wording: the URL, the
 * method, and that the body reaches every language.
 */
describe("the code samples", () => {
  for (const endpoint of ENDPOINTS) {
    describe(endpoint.slug, () => {
      for (const lang of LANGS) {
        it(lang, () => {
          const body = Object.fromEntries(Object.entries(endpoint.sample).map(([k, v]) => [k, v]));
          const code = sampleFor(endpoint, body, lang);

          expect(code).toContain(API_BASE[endpoint.product].replace("https://", ""));
          expect(code).toContain(API_KEY_ENV[endpoint.product]);
          expect(code, "a path parameter was left unfilled").not.toMatch(/\/:[a-z_]+/);

          const sent = endpoint.sample.query ?? endpoint.sample.question;
          if (typeof sent === "string") expect(code).toContain(sent);
        });
      }
    });
  }

  it("carries an edited value into every language", () => {
    const search = ENDPOINTS.find(
      (e) => e.slug === "search-memories" && e.product === "locusgraph"
    );
    if (!search) throw new Error("search-memories is gone");

    const edited = { ...search.sample, query: "what did we decide about churn?" };
    for (const lang of LANGS) {
      expect(sampleFor(search, edited, lang)).toContain("what did we decide about churn?");
    }
  });
});

/**
 * The scanner is lossless by construction, and this is the check that keeps it
 * so. A dropped character corrupts a sample a reader copies into a terminal,
 * and it looks perfectly fine on the page while doing it.
 */
describe("highlighting", () => {
  const cases: [string, Lang][] = [
    ['curl -X POST "https://x" -d \'{"a": 1}\'', "curl"],
    ['const res = await fetch("https://x");', "node"],
    ['import os\n# a comment\nprint(os.environ["K"])', "python"],
    ["func main() {\n    // a comment\n    return nil\n}", "go"],
    ['{\n  "items_found": 2,\n  "ok": true\n}', "json"],
    ["not sent yet", "plain"],
  ];

  for (const [code, lang] of cases) {
    it(`returns ${lang} unchanged when the tokens are joined`, () => {
      expect(
        highlight(code, lang)
          .map((t) => t.text)
          .join("")
      ).toBe(code);
    });
  }

  it("colours every sample the reference ships", () => {
    for (const endpoint of ENDPOINTS) {
      for (const lang of LANGS) {
        const code = sampleFor(endpoint, endpoint.sample, lang);
        expect(
          highlight(code, lang)
            .map((t) => t.text)
            .join("")
        ).toBe(code);
      }
      expect(
        highlight(endpoint.response, "json")
          .map((t) => t.text)
          .join("")
      ).toBe(endpoint.response);
    }
  });

  it("finds more than one colour in real code", () => {
    const code = sampleFor(ENDPOINTS[0], ENDPOINTS[0].sample, "curl");
    expect(new Set(highlight(code, "curl").map((t) => t.colour)).size).toBeGreaterThan(2);
  });
});

/**
 * The nav is built from the spec, so every endpoint is reachable and the nav
 * cannot point at one that does not exist. `tests/nav.test.ts` skips `/api/`
 * for exactly this reason.
 */
describe("the nav", () => {
  /**
   * The guides sidebar carries one link in, not one per endpoint: the reference
   * has a sidebar of its own, and listing all of them twice would bury the
   * written pages under the thing a reader reaches for second.
   */
  it("has one door into each reference", async () => {
    const { NAV } = await import("../lib/site/docs-nav");
    const hrefs = NAV.locusgraph.flatMap((tree) =>
      tree.sections.flatMap((section) => section.items.map((item) => item.href))
    );
    const api = hrefs.filter((href) => href.startsWith("/locusgraph/api/"));

    expect(api).toHaveLength(1);
    expect(api[0]).toBe(`/locusgraph/api/${ENDPOINTS[0].slug}`);
  });

  it("groups every endpoint for its own sidebar", () => {
    const groups = new Set(ENDPOINTS.map((e) => e.group));
    expect(groups.size).toBeGreaterThan(1);
    for (const endpoint of ENDPOINTS) {
      expect(endpoint.group, `${endpoint.slug} has no group`).toBeTruthy();
    }
  });
});

/**
 * A field the playground renders as a control has to say what the control is.
 *
 * An enum with no `options` becomes a text box the reader has to guess at, and
 * `options` that are not in the documented type is the page disagreeing with
 * itself one line apart.
 */
describe("the playground controls", () => {
  it("gives every enum its values", () => {
    for (const endpoint of ENDPOINTS) {
      for (const param of endpoint.params) {
        if (param.type !== "enum") continue;
        expect(
          param.options,
          `${endpoint.slug}.${param.name} is an enum with no options`
        ).toBeTruthy();
        expect(param.options?.length ?? 0).toBeGreaterThan(1);
      }
    }
  });

  it("defaults an enum to one of its own values", () => {
    for (const endpoint of ENDPOINTS) {
      for (const param of endpoint.params) {
        const seeded = endpoint.sample[param.name];
        if (!param.options || seeded === undefined) continue;
        expect(
          param.options,
          `${endpoint.slug}.${param.name} is seeded off its own list`
        ).toContain(String(seeded));
      }
    }
  });

  it("keeps an object payload an object in every sample", () => {
    const store = ENDPOINTS.find((e) => e.slug === "store-an-event" && e.product === "locusgraph");
    if (!store) throw new Error("store-an-event is gone");

    const payload = store.params.find((p) => p.name === "payload");
    expect(payload?.field, "payload should get a textarea, not a one-line input").toBe("prose");

    for (const lang of LANGS) {
      const code = sampleFor(store, store.sample, lang);
      expect(code, `${lang} quoted the payload object`).not.toContain('"payload": "{');
      expect(code).toContain("Prefers dark mode");
    }
  });
});
