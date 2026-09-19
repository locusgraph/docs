import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { localPages, prose } from "./site";

/**
 * The human-voice character rules, enforced rather than remembered.
 *
 * These regressed twice after the content was swept once: first in component
 * strings, then in code comments. Both times the prose passed and the rendered
 * page did not, because the sweep only ever looked at `content/`.
 *
 * Code fences and inline code are exempt. An em dash in an ASCII diagram is not
 * an AI tell, and `` `…Request` `` is an identifier.
 */
const FORBIDDEN: [string, RegExp][] = [
  ["em dash", /—/g],
  ["en dash", /–/g],
  ["ellipsis character", /…/g],
  ["smart quote", /[“”‘’]/g],
  ["emoji", /[\u{1F300}-\u{1FAFF}]/gu],
];

const BUZZWORDS =
  /\b(delve|realm|pivotal|revolutioniz\w*|seamlessly|cutting-edge|game-chang\w*|leverage|utilize|facilitate|synergy|paradigm|holistic|innovative|transformative)\b/gi;

const HEDGING =
  /(it's worth noting|generally speaking|due to the fact|at the end of the day|let's dive in|in this article)/gi;

function offenders(text: string, pattern: RegExp): string[] {
  return [...new Set(text.match(pattern) ?? [])];
}

describe("prose", () => {
  for (const file of localPages()) {
    const body = prose(readFileSync(file, "utf8"));

    it(`${file} uses no AI-telltale characters`, () => {
      for (const [name, pattern] of FORBIDDEN) {
        const hits = offenders(body, pattern);
        expect(hits, `${name} in ${file}: ${hits.join(" ")}`).toEqual([]);
      }
    });

    it(`${file} uses no buzzwords or hedging`, () => {
      expect(offenders(body, BUZZWORDS)).toEqual([]);
      expect(offenders(body, HEDGING)).toEqual([]);
    });
  }
});

/**
 * The same rules where a reader also meets prose: component strings, diagram
 * captions, nav blurbs. Code comments are excluded, since nothing publishes
 * them.
 */
describe("interface copy", () => {
  const files = [
    "app/page.tsx",
    "app/not-found.tsx",
    "components/site/site-chrome.tsx",
    "components/docs/diagrams.tsx",
    "components/docs/early-access.tsx",
    "lib/site/docs-nav.ts",
    "lib/site/products.ts",
    "lib/site/seo.ts",
  ];

  for (const file of files) {
    it(`${file} uses no AI-telltale characters`, () => {
      const stripped = readFileSync(file, "utf8")
        .replace(/\/\*\*[\s\S]*?\*\//g, "") // doc comments
        .replace(/^\s*\/\/.*$/gm, ""); // line comments
      for (const [name, pattern] of FORBIDDEN) {
        const hits = offenders(stripped, pattern);
        expect(hits, `${name} in ${file}: ${hits.join(" ")}`).toEqual([]);
      }
    });
  }
});
