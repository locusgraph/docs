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
if (!existsSync("public/llms.txt") || !existsSync("public/locusgraph/concepts.md")) {
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

  /**
   * llmstxt.org: an H1, then an optional blockquote, then non-heading markdown,
   * then file lists delimited by **H2**. H3 was used to nest groups under each
   * product until this test was written; it is allowed only inside `Optional`,
   * where the heading names the group the links came from.
   */
  it("opens the way the format asks", () => {
    const lines = map.split("\n");
    expect(lines[0]?.startsWith("# ")).toBe(true);

    const blockquote = lines.findIndex((line) => line.startsWith("> "));
    const firstSection = lines.findIndex((line) => line.startsWith("## "));
    expect(blockquote).toBeGreaterThan(0);
    expect(blockquote).toBeLessThan(firstSection);
    expect(lines.slice(1, firstSection).filter((line) => line.startsWith("#"))).toEqual([]);
  });

  it("delimits its file lists on H2", () => {
    // H3 is allowed only under `Optional`, where it names the group the links
    // were lifted from. Anywhere above that is a heading inside a file list.
    const optional = map.indexOf("\n## Optional");
    const above = optional === -1 ? map : map.slice(0, optional);
    expect(above.split("\n").filter((line) => line.startsWith("### "))).toEqual([]);
    expect(map.split("\n").filter((line) => line.startsWith("## ")).length).toBeGreaterThan(2);
  });

  it("gives every item a link and a note", () => {
    for (const line of map.split("\n").filter((one) => one.startsWith("- "))) {
      expect(line, `${line} is not [name](url): note`).toMatch(
        /^- \[[^\]]+\]\(https:\/\/[^)]+\): .+$/
      );
    }
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

/**
 * The format recommends a clean markdown copy of each page at the same path
 * with `.md` appended. Without them an agent following a link from the map
 * downloads the whole page shell to read a few hundred words.
 */
describe("the .md pages", () => {
  it("exists for every page the manifest serves", () => {
    for (const section of READY) {
      for (const slug of pages(section)) {
        expect(existsSync(`public/${section}/${slug}.md`), `${section}/${slug}.md is missing`).toBe(
          true
        );
      }
    }
  });

  it("keeps the code samples that the search index drops", () => {
    const concepts = readFileSync("public/locusgraph/concepts.md", "utf8");
    expect(concepts).toContain("```typescript");
    expect(concepts).toContain("client.storeEvent");
  });

  it("leaves no jsx or module syntax outside a code fence", () => {
    for (const section of READY) {
      for (const slug of pages(section)) {
        const prose = readFileSync(`public/${section}/${slug}.md`, "utf8")
          .split(/(```[\s\S]*?```)/g)
          .filter((_, i) => i % 2 === 0)
          .join("");
        expect(prose, `${section}/${slug}.md still has an import`).not.toMatch(/^import /m);
        expect(prose, `${section}/${slug}.md still has a component tag`).not.toMatch(
          /<\/?[A-Z][A-Za-z]*/
        );
        expect(prose, `${section}/${slug}.md still has its meta export`).not.toContain(
          "export const meta"
        );
      }
    }
  });
});
