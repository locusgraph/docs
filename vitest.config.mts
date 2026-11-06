import { appTests } from "@locusgraph/config/vitest";
import { defineConfig } from "vitest/config";

export default defineConfig(appTests(import.meta.url));
