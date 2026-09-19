import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EarlyAccess } from "@/components/docs/early-access";
import { pagesOf, treesFor } from "@/lib/site/docs-nav";
import { iconForGroup, iconForHref } from "@/lib/site/icons";
import { isProduct, PRODUCT_INFO, PRODUCTS } from "@/lib/site/products";
import { pageMeta } from "@/lib/site/seo";

/**
 * A section's docs root: `/locusgraph`, `/spendgraph`, `/locus-skill`.
 *
 * Its own page rather than a redirect into the first chapter, so the section
 * has one indexable, linkable entry point that outlives whatever the first
 * chapter happens to be called this quarter.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ product }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string }>;
}): Promise<Metadata> {
  const { product } = await params;
  if (!isProduct(product)) {
    return { title: "Not found | LocusGraph Docs", robots: { index: false } };
  }

  const { title, blurb } = PRODUCT_INFO[product];
  return pageMeta({ title: `${title} | LocusGraph Docs`, description: blurb, path: `/${product}` });
}

export default async function ProductDocs({ params }: { params: Promise<{ product: string }> }) {
  const { product } = await params;
  if (!isProduct(product)) notFound();

  const { title, blurb, ready } = PRODUCT_INFO[product];
  const trees = treesFor(product);

  // The section's own pages have no group name; everything else does. Splitting
  // them is what stops two groups both called "Start here" rendering as two
  // identical headings, which is what a flattened list produced.
  const own = trees.filter((tree) => !tree.title).flatMap(pagesOf);
  const groups = trees.filter((tree) => tree.title);
  const total = trees.flatMap(pagesOf).length;

  return (
    <>
      <h1>{title}</h1>
      <p>{blurb}</p>

      {ready ? null : <EarlyAccess product={title} />}

      {total === 0 ? (
        <p className="not-prose rounded-xl border border-line bg-surface px-5 py-4 text-sm text-soft">
          No chapters published yet. Pages appear here as this section&apos;s manifest fills.
        </p>
      ) : null}

      {own.length > 0 ? (
        <div className="not-prose my-6 grid gap-2 sm:grid-cols-2">
          {own.map((item) => {
            const Icon = iconForHref(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-line bg-surface px-4 py-3 no-underline transition hover:bg-ghost"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Icon className="size-4 shrink-0 text-soft" aria-hidden />
                  {item.title}
                </span>
                {item.blurb ? (
                  <span className="mt-0.5 block text-sm text-soft">{item.blurb}</span>
                ) : null}
              </Link>
            );
          })}
        </div>
      ) : null}

      {groups.length > 0 ? (
        <>
          <h2>
            Everything else
            <span className="ml-3 align-middle text-sm font-normal text-faint">
              {total} pages in {groups.length} groups
            </span>
          </h2>

          {/* One card per group rather than every page. Spendgraph has 73 pages
              across 20 trees, and listing them all turns the section root into a
              wall nobody reads. The sidebar is there for the full set. */}
          <div className="not-prose my-6 grid gap-2 sm:grid-cols-2">
            {groups.map((tree) => {
              const count = pagesOf(tree).length;
              // The group's own icon, the one the header nav wears. Resolving
              // from `tree.href` would take the icon of whichever page happens
              // to be first, so SDK would wear a quickstart glyph.
              const Icon = iconForGroup(tree.title) ?? iconForHref(tree.href);
              return (
                <Link
                  key={tree.href}
                  href={tree.href}
                  className="group rounded-xl border border-line px-4 py-3 no-underline transition hover:bg-ghost"
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Icon className="size-4 shrink-0 text-soft" aria-hidden />
                      {tree.title}
                    </span>
                    <span className="shrink-0 text-xs text-faint">{count}</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-soft">{tree.blurb}</span>
                </Link>
              );
            })}
          </div>
        </>
      ) : null}
    </>
  );
}
