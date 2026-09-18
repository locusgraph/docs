import type { Metadata } from "next";
import Link from "next/link";
import { ProductMark } from "@/components/site/product-mark";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { PRODUCT_INFO, PRODUCTS } from "@/lib/site/products";

/**
 * The page for a URL this host does not serve.
 *
 * `noindex` on purpose: a 404 that is indexable competes with the pages that
 * exist, and a crawler that has found one has already been told the status.
 * It offers every section rather than a bare apology — a reader who mistyped a
 * path is one click from the right one.
 */
export const metadata: Metadata = {
  title: "Not found | LocusGraph Docs",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(42,120,214,0.07),transparent_70%)] dark:bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(57,135,229,0.09),transparent_70%)]">
      <SiteHeader />

      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-sm tracking-[0.2em] text-faint uppercase">404</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tighter sm:text-5xl">
            This page is not on this host
          </h1>
          <p className="mx-auto mt-4 max-w-[52ch] text-pretty text-lg text-soft">
            The address may have changed, or it may belong somewhere else. Marketing pages live on
            locusgraph.com, and each product signs in on its own subdomain.
          </p>
        </div>

        <div className="mx-auto mt-10 grid w-full max-w-3xl gap-3 sm:grid-cols-2">
          {PRODUCTS.filter((product) => PRODUCT_INFO[product].ready).map((product) => (
            <Link
              key={product}
              href={`/${product}`}
              className="group rounded-xl border border-line bg-surface px-5 py-4 no-underline transition hover:bg-ghost"
            >
              <span className="flex items-center justify-between text-base font-medium">
                <span className="flex items-center gap-2.5">
                  <span className="grid size-7 shrink-0 place-items-center rounded-md bg-foreground text-background">
                    <ProductMark product={product} className="size-5" />
                  </span>
                  {PRODUCT_INFO[product].title}
                </span>
                <span
                  aria-hidden
                  className="text-faint transition group-hover:translate-x-0.5 group-hover:text-soft"
                >
                  →
                </span>
              </span>
              <span className="mt-1 block text-sm text-soft">{PRODUCT_INFO[product].blurb}</span>
            </Link>
          ))}
        </div>

        <p className="mx-auto mt-8 text-center text-sm text-faint">
          <Link href="/" className="text-soft hover:text-foreground">
            All documentation
          </Link>
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
