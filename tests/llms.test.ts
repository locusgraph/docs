import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { pages, SECTIONS } from "./site";

/**
 * Both files are build output and gitignored, the same as the search index, so
 * a clean checkout has neither. Generating them here rather than committing
 * them keeps the repo free of a quarter of a megabyte that is derived anyway,
 * and has the side effect of testing the generator on every run.
 */
if (!existsSync("public/llms.txt") || !existsSync("public/llms-full.txt")) {
  execFileSync("node", ["scripts/build-docs-artifacts.mjs"], { stdio: "ignore" });
}

/**
 * `llms.txt` and `llms-full.txt` list what the manifest serves.
 *
 * Both are generated in `prebuild` from the same traversal as the search index,
 * so they cannot drift by accident. What this catches is the generator being
 * changed, or run against a tree where a package page could not be read: a page
 * that silently failed to load is a page missing from the map, and nothing else
 * would notice.
 *
 * Only ready sections are listed, the same rule the sitemap follows.
 */
const READY = SECTIONS.filter((section) => section === "locusgraph" || section === "spendgraph");

describe("llms.txt", () => {
  const map = readFileSync("public/llms.txt", "utf8");

  it("opens the way the spec asks", () => {
    expect(map.startsWith("# ")).toBe(true);
    expect(map).toContain("\n> ");
  });

  it("links every page the manifest serves", () => {
    for (const section of READY) {
      for (const slug of pages(section)) {
        expect(map, `${section}/${slug} is missing from llms.txt`).toContain(
          `/${section}/${slug})`
        );
      }
    }
  });

  it("links nothing that is not a page", () => {
    const listed = [...map.matchAll(/\]\(https:\/\/[^/]+\/([a-z-]+)\/([a-z0-9/-]+)\)/g)];
    for (const [, section, slug] of listed) {
      expect(pages(section), `${section}/${slug} is listed but not served`).toContain(slug);
    }
  });

  it("leaves out a section that is not ready", () => {
    expect(map).not.toContain("/brainstorm/");
    expect(map).not.toContain("/locus-skill/");
  });
});

describe("llms-full.txt", () => {
  const full = readFileSync("public/llms-full.txt", "utf8");

  it("carries every page, with its source url", () => {
    for (const section of READY) {
      for (const slug of pages(section)) {
        expect(full, `${section}/${slug} has no entry`).toContain(`/${section}/${slug}\n`);
      }
    }
  });

  it("carries prose, not just headings", () => {
    // A generator that lost its body would still pass the url check above.
    expect(full.length).toBeGreaterThan(100_000);
  });
});
