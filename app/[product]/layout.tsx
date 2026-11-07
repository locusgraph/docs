import { DocsShell } from "@locusgraph/components";
import { DocsHeader } from "@/components/docs/docs-header";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocsTrail } from "@/components/docs/docs-trail";
import { PageNav } from "@/components/docs/page-nav";
import { Toc } from "@/components/docs/toc";

/**
 * The shell every page inside a section renders in: the LocusGraph docs shell,
 * with a sticky header, the section's pages on the left and the outline on the
 * right. The page scrolls on the window, which is what the outline watches.
 *
 * It lives at `[product]` rather than at the root so the host index keeps the
 * landing layout: a reader who has not picked a section yet has no sidebar to
 * show.
 *
 * `data-section` carries the product, and is the only hook the per-section
 * accent in `globals.css` needs. Nothing reads it in JavaScript, so a section
 * with no accent of its own simply keeps the default.
 *
 * `docs-article` is the hook a page needs to widen the shell. A reference page
 * carrying `data-wide` wants the whole width and its own right-hand column, so
 * globals.css drops the article's cap and hides the outline for that page only,
 * with `:has()` rather than a prop, because this is a server component that
 * never sees which page rendered inside it.
 */
export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ product: string }>;
}) {
  const { product } = await params;

  return (
    <div data-section={product}>
      <DocsShell header={<DocsHeader />} sidebar={<DocsSidebar />} aside={<Toc />}>
        <article className="docs-article typeset locus-typeset-docs mx-auto max-w-3xl">
          <DocsTrail />
          {children}
          <PageNav />
        </article>
      </DocsShell>
    </div>
  );
}
