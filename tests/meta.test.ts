import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { localPages } from "./site";

/**
 * Every page carries the summary the route turns into metadata.
 *
 * Without it the page renders and its `<title>` falls back to something
 * generic, which is the kind of thing nobody sees until a link is shared.
 */
describe("page metadata", () => {
  for (const file of localPages()) {
    it(`${file} exports a title and a description`, () => {
      const body = readFileSync(file, "utf8");
      expect(body.startsWith("export const meta = {"), "no meta export").toBe(true);

      const title = body.match(/title:\s*"((?:[^"\\]|\\.)*)"/)?.[1];
      const description = body.match(/description:\s*\n?\s*"((?:[^"\\]|\\.)*)"/)?.[1];

      expect(title, "no title").toBeTruthy();
      expect(description, "no description").toBeTruthy();
      // Long enough to say something, short enough for a search result.
      expect(description?.length ?? 0).toBeGreaterThan(40);
      expect(description?.length ?? 0).toBeLessThan(260);
    });
  }
});
