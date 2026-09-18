import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import incrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Prerendered pages are served from Workers static assets.
 *
 * Every route here is SSG — `generateStaticParams` walks the manifest and
 * `dynamicParams = false` refuses anything outside it, so nothing revalidates
 * and there is nothing to write back. Without an incremental cache the adapter
 * has nowhere to read the prerendered HTML from and every page 404s; the R2 and
 * KV caches would work too, and both would be a store to provision for data
 * that never changes between deploys.
 */
export default defineCloudflareConfig({ incrementalCache });
