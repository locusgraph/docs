import type { Metadata } from "next";
import Link from "next/link";
import { ProductMark } from "@/components/site/product-mark";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { PRODUCT_INFO, PRODUCTS } from "@/lib/site/products";
import { pageMeta } from "@/lib/site/seo";

/**
 * The docs host root.
 *
 * A page, not a redirect: the host serves four sections, so there is no single
 * intro to send a reader to. Redirecting here would pick a winner and hand
 * everyone else a bounce. It is also the one URL the whole host canonicalises
 * to, so it stays indexable and lists every section it owns.
 */
export const metadata: Metadata = pageMeta({
  title: "Docs | LocusGraph Docs",
  description: "Documentation for LocusGraph, Spendgraph, BrainStorm and Locus Skill.",
  path: "/",
});

export default function DocsHome() {
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(42,120,214,0.07),transparent_70%)] dark:bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(57,135,229,0.09),transparent_70%)]">
      <SiteHeader />

      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-balance text-5xl font-semibold leading-[1.06] tracking-tighter sm:text-6xl">
            Everything LocusGraph ships, <span className="text-s1">written down</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-[52ch] text-pretty text-lg text-soft">
            Four sections on one host. Start where the work is — each one carries its own reference,
            guides and API surface.
          </p>
        </div>

        <div className="mx-auto mt-12 grid w-full max-w-3xl gap-3 sm:grid-cols-2">
          {PRODUCTS.map((product) => {
            const { title, blurb, ready } = PRODUCT_INFO[product];
            const face = (
              <>
                <span className="flex items-center justify-between text-base font-medium">
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`grid size-7 shrink-0 place-items-center rounded-md ${
                        ready ? "bg-foreground text-background" : "bg-ghost text-faint"
                      }`}
                    >
                      <ProductMark product={product} className="size-5" />
                    </span>
                    {title}
                  </span>
                  {ready ? (
                    <span
                      aria-hidden
                      className="text-faint transition group-hover:translate-x-0.5 group-hover:text-soft"
                    >
                      →
                    </span>
                  ) : (
                    <span className="rounded-full border border-line px-2 py-0.5 text-xs text-faint">
                      Soon
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-sm text-soft">{blurb}</span>
              </>
            );

            // A section that is not ready renders as plain markup rather than a
            // disabled link: an anchor with no href is not focusable and
            // announces nothing, and one that is focusable but inert is worse.
            return ready ? (
              <Link
                key={product}
                href={`/${product}`}
                className="group rounded-xl border border-line bg-surface px-5 py-4 no-underline transition hover:bg-ghost"
              >
                {face}
              </Link>
            ) : (
              <div
                key={product}
                aria-disabled="true"
                title={`${title} docs are not published yet`}
                className="cursor-not-allowed rounded-xl border border-line border-dashed px-5 py-4 opacity-55"
              >
                {face}
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-faint">
          Docs only. Product pages live on{" "}
          <a href="https://www.locusgraph.com" className="text-soft hover:text-foreground">
            locusgraph.com
          </a>
          ; each app signs in on its own subdomain.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
