import { appTests } from "@spendgraph/config/vitest";
import { defineConfig } from "vitest/config";

export default defineConfig(appTests(import.meta.url));
