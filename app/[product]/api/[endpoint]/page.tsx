import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Playground } from "@/components/api/playground";
import { ENDPOINTS, endpointBySlug } from "@/lib/api/endpoints";
import { pageMeta } from "@/lib/site/seo";

/**
 * One endpoint, one page.
 *
 * A literal `api` segment rather than another entry in the manifest: these
 * pages are generated from `lib/api/endpoints.ts` rather than loaded from an
 * `.mdx`, and the manifest's whole job is saying which file a page comes from.
 * Next matches this before `[...slug]` because a literal segment outranks a
 * catch-all, so `/locusgraph/api/search-memories` never reaches the doc route.
 *
 * Only LocusGraph has an API reference today. The route is still keyed on
 * `product` so Spendgraph can take one without moving these URLs.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return ENDPOINTS.map((endpoint) => ({ product: "locusgraph", endpoint: endpoint.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string; endpoint: string }>;
}): Promise<Metadata> {
  const { product, endpoint: slug } = await params;
  const endpoint = endpointBySlug(slug);
  if (!endpoint) return { title: "Not found | LocusGraph Docs", robots: { index: false } };

  return pageMeta({
    title: `${endpoint.name} | LocusGraph API`,
    description: endpoint.summary,
    path: `/${product}/api/${slug}`,
  });
}

export default async function ApiEndpoint({ params }: { params: Promise<{ endpoint: string }> }) {
  const { endpoint: slug } = await params;
  const endpoint = endpointBySlug(slug);
  if (!endpoint) notFound();

  /**
   * The playground sits inline, full width, not in a column of its own.
   *
   * The docs shell already spends its right-hand side on the outline and caps
   * the article at `max-w-3xl`, so a second right column leaves the prose about
   * 220px wide and every parameter note wraps to four lines. A two-column
   * reference needs a wider shell than every other page on this host has, which
   * is a change to `app/[product]/layout.tsx` and therefore to all 113 of them.
   */
  return (
    <div>
      <div className="not-prose mb-4 flex items-center gap-2.5">
        <span className="rounded bg-s1/15 px-2 py-1 font-mono text-[11px] font-medium text-s1">
          {endpoint.method}
        </span>
        <span className="font-mono text-[13px] text-foreground">{endpoint.path}</span>
        <span className="ml-auto text-[11px] text-faint">
          Scope <span className="font-mono text-soft">{endpoint.scope}</span>
        </span>
      </div>

      <h1 className="scroll-mt-20">{endpoint.name}</h1>
      <p className="lead">{endpoint.summary}</p>
      <p>{endpoint.description}</p>

      <div className="not-prose my-7">
        <Playground endpoint={endpoint} />
      </div>

      <h2 id="parameters" className="scroll-mt-20">
        Parameters
      </h2>
      <div className="not-prose overflow-hidden rounded-xl border border-line">
        {endpoint.params.map((param, i) => (
          <div
            key={param.name}
            className={`flex items-baseline gap-3 px-4 py-3 ${
              i < endpoint.params.length - 1 ? "border-b border-line" : ""
            }`}
          >
            <div className="w-32 shrink-0">
              <div className="font-mono text-[12.5px] text-foreground">{param.name}</div>
              <div className="mt-0.5 font-mono text-[10.5px] text-faint">{param.type}</div>
            </div>
            <div className="grow text-[13px] leading-relaxed text-soft">{param.note}</div>
            {param.required ? (
              <span className="shrink-0 text-[10px] font-medium text-s2">required</span>
            ) : null}
          </div>
        ))}
      </div>

      <h2 id="returns" className="scroll-mt-20">
        Returns
      </h2>
      <p>{endpoint.returns}</p>

      <h2 id="when-it-fails" className="scroll-mt-20">
        When it fails
      </h2>
      <div className="not-prose overflow-hidden rounded-xl border border-line">
        {endpoint.errors.map((error, i) => (
          <div
            key={error.status}
            className={`flex items-baseline gap-3 px-4 py-2.5 ${
              i < endpoint.errors.length - 1 ? "border-b border-line" : ""
            }`}
          >
            <span className="w-9 shrink-0 font-mono text-[12px] font-medium text-s2">
              {error.status}
            </span>
            <span className="w-32 shrink-0 font-mono text-[10.5px] text-faint">{error.code}</span>
            <span className="grow text-[13px] leading-relaxed text-soft">{error.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
