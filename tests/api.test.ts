import { describe, expect, it } from "vitest";
import { ENDPOINTS, endpointBySlug } from "../lib/api/endpoints";
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
  it("has a unique slug per endpoint", () => {
    const slugs = ENDPOINTS.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("finds every endpoint by its slug", () => {
    for (const endpoint of ENDPOINTS) {
      expect(endpointBySlug(endpoint.slug)).toBe(endpoint);
    }
    expect(endpointBySlug("nothing-like-this")).toBeUndefined();
  });

  /**
   * The public API is what a key with the default scopes reaches. The engine's
   * `DEFAULT_KEY_SCOPES` is `["memory.read", "memory.write"]`, so an endpoint
   * needing `key.manage`, `graph.admin`, `graph.create` or `analytics.read`
   * documented here would invite a call that answers 403 to nearly everyone.
   */
  it("documents nothing outside the default key scopes", () => {
    for (const endpoint of ENDPOINTS) {
      expect(["memory.read", "memory.write"], `${endpoint.slug} is ${endpoint.scope}`).toContain(
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

          expect(code).toContain("api.locusgraph.com");
          expect(code).toContain("LOCUSGRAPH_API_KEY");
          expect(code, "a path parameter was left unfilled").not.toMatch(/\/:[a-z_]+/);

          const sent = endpoint.sample.query ?? endpoint.sample.question;
          if (typeof sent === "string") expect(code).toContain(sent);
        });
      }
    });
  }

  it("carries an edited value into every language", () => {
    const search = ENDPOINTS.find((e) => e.slug === "search-memories");
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
  it("has a link to every endpoint", async () => {
    const { NAV } = await import("../lib/site/docs-nav");
    const hrefs = NAV.locusgraph.flatMap((tree) =>
      tree.sections.flatMap((section) => section.items.map((item) => item.href))
    );
    for (const endpoint of ENDPOINTS) {
      expect(hrefs, `${endpoint.slug} is not in the nav`).toContain(
        `/locusgraph/api/${endpoint.slug}`
      );
    }
  });
});
