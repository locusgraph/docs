import type { Metadata } from "next";
import Link from "next/link";
import { AgentPrompt } from "@/components/site/agent-prompt";
import { ProductMark } from "@/components/site/product-mark";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { Tape } from "@/components/site/tape";
import { pagesOf, treesFor } from "@/lib/site/docs-nav";
import { iconForHref } from "@/lib/site/icons";
import { PRODUCT_INFO, PRODUCTS } from "@/lib/site/products";
import { pageMeta } from "@/lib/site/seo";

/**
 * The docs host root.
 *
 * A page, not a redirect: the host serves several sections, so there is no
 * single intro to send a reader to. Redirecting would pick a winner and hand
 * everyone else a bounce.
 *
 * Ready sections get a card with a way in — the first few pages of each, pulled
 * from the nav so the links cannot drift. Sections that are not ready are one
 * quiet line at the bottom rather than four dimmed cards competing with the two
 * that work.
 */
export const metadata: Metadata = pageMeta({
  title: "Docs | LocusGraph Docs",
  description:
    "What it learned, and what it cost: two things an AI app loses. LocusGraph keeps the first, Spendgraph accounts for the second.",
  path: "/",
});

const live = PRODUCTS.filter((product) => PRODUCT_INFO[product].ready);
const soon = PRODUCTS.filter((product) => !PRODUCT_INFO[product].ready);

export default function DocsHome() {
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(42,120,214,0.07),transparent_70%)] dark:bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(57,135,229,0.09),transparent_70%)]">
      <SiteHeader />

      <main className="flex-1 px-6 pt-10 pb-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* The accent falls on the two losses, not on the product names: the
              names mean nothing to a reader who has not met them, and the
              losses are what they recognise. */}
          <h1 className="text-balance text-5xl font-semibold leading-[1.06] tracking-tighter sm:text-6xl">
            <span className="text-s1">What it learned</span>. And{" "}
            <span className="text-s1">what it cost</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-[52ch] text-pretty text-lg text-soft">
            Two things an AI app loses. LocusGraph keeps the first, Spendgraph accounts for the
            second.
          </p>
          <div className="mt-7 flex justify-center">
            <AgentPrompt />
          </div>
        </div>

        <Tape />

        <div className="mx-auto mt-10 grid w-full max-w-4xl gap-4 md:grid-cols-2">
          {live.map((product) => {
            const { title, blurb } = PRODUCT_INFO[product];
            const entries = treesFor(product).flatMap(pagesOf).slice(0, 3);

            return (
              <section
                key={product}
                className="flex flex-col rounded-2xl border border-line bg-surface p-6"
              >
                <Link href={`/${product}`} className="group no-underline">
                  <span className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-foreground text-background">
                      <ProductMark product={product} className="size-5" />
                    </span>
                    <span className="text-lg font-semibold tracking-tight">{title}</span>
                    <span
                      aria-hidden
                      className="ml-auto text-faint transition group-hover:translate-x-0.5 group-hover:text-soft"
                    >
                      →
                    </span>
                  </span>
                </Link>

                <p className="mt-3 text-pretty text-sm text-soft">{blurb}</p>

                <ul className="mt-5 space-y-1 border-t border-line pt-4">
                  {entries.map((entry) => {
                    const Icon = iconForHref(entry.href);
                    return (
                      <li key={entry.href}>
                        <Link
                          href={entry.href}
                          className="-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-soft no-underline transition hover:bg-ghost hover:text-foreground"
                        >
                          <Icon className="size-4 shrink-0 text-faint" aria-hidden />
                          {entry.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        {soon.length > 0 ? (
          <p className="mx-auto mt-8 max-w-4xl text-center text-sm text-faint">
            {soon.map((product, i) => (
              <span key={product}>
                {i > 0 ? " · " : null}
                {PRODUCT_INFO[product].title}
              </span>
            ))}{" "}
            are on the way.{" "}
            <a
              href="mailto:nasim@effortlesslabs.xyz?subject=Early%20access"
              className="text-soft hover:text-foreground"
            >
              ask for early access
            </a>
            .
          </p>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
