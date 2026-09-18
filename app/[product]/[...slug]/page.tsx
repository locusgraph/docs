import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DOCS } from "@/lib/site/docs-manifest";
import { isProduct, PRODUCTS } from "@/lib/site/products";
import { pageMeta } from "@/lib/site/seo";

/**
 * One doc page, for any section, on one route.
 *
 * The product is the first path segment because the docs host is shared: three
 * sections document a page called `overview`, and a flat namespace makes the
 * second one to ship a rename of the first. A slug the manifest does not know
 * is a 404 rather than a page rendered on demand — the set is known at build
 * time, and a doc outside the manifest is a doc nobody wrote.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.flatMap((product) =>
    Object.keys(DOCS[product]).map((slug) => ({ product, slug: slug.split("/") }))
  );
}

// `params` is a Promise in this version of Next — awaited in both the metadata
// function and the page, per app/api-reference/file-conventions/dynamic-routes.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string; slug: string[] }>;
}): Promise<Metadata> {
  const { product, slug } = await params;
  const path = slug.join("/");
  const load = isProduct(product) ? DOCS[product][path] : undefined;
  if (!load) return { title: "Not found | LocusGraph Docs", robots: { index: false } };

  const { meta } = await load();
  return pageMeta({ ...meta, path: `/${product}/${path}` });
}

export default async function Doc({
  params,
}: {
  params: Promise<{ product: string; slug: string[] }>;
}) {
  const { product, slug } = await params;
  const load = isProduct(product) ? DOCS[product][slug.join("/")] : undefined;
  if (!load) notFound();

  const { default: Prose } = await load();
  return <Prose />;
}
