/**
 * `@spendgraph/config` ships plain `.mjs` with no types.
 *
 * Only the vitest entry is imported from TypeScript here, so only that one
 * needs declaring. The shapes match what `vitest/config` accepts, which is what
 * `defineConfig` is handed.
 */
declare module "@spendgraph/config/vitest" {
  import type { UserConfig } from "vitest/config";

  export function appTests(importMetaUrl: string, overrides?: UserConfig): UserConfig;
  export function packageTests(overrides?: UserConfig): UserConfig;
}
