import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { treesFor } from "@/lib/site/docs-nav";
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

  const { title, blurb } = PRODUCT_INFO[product];
  const trees = treesFor(product);

  return (
    <>
      <h1>{title}</h1>
      <p>{blurb}</p>

      {trees.length === 0 ? (
        <p className="not-prose rounded-xl border border-line bg-surface px-5 py-4 text-sm text-soft">
          No chapters published yet. Pages appear here as this section&apos;s manifest fills.
        </p>
      ) : null}

      {trees.map((tree) =>
        tree.sections.map((section) => (
          <section key={`${tree.title}-${section.title}`}>
            <h2>{section.title}</h2>
            <div className="not-prose my-5 grid gap-2 sm:grid-cols-2">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-line px-4 py-3 no-underline transition hover:bg-ghost"
                >
                  <span className="block text-sm font-medium">{item.title}</span>
                  {item.blurb ? (
                    <span className="mt-0.5 block text-sm text-soft">{item.blurb}</span>
                  ) : null}
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
