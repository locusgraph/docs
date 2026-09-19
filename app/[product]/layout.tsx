import { DocsHeader } from "@/components/docs/docs-header";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { PageNav } from "@/components/docs/page-nav";
import { Toc } from "@/components/docs/toc";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/**
 * The shell every page inside a section renders in.
 *
 * It lives at `[product]` rather than at the root so the host index keeps the
 * landing layout: a reader who has not picked a section yet has no sidebar to
 * show.
 *
 * `data-docs-scroll` marks the scrolling element, because the page scrolls
 * inside the inset rather than on the window — which is what the table of
 * contents has to watch to know where the reader is.
 *
 * `data-section` carries the product, and is the only hook the per-section
 * accent in `globals.css` needs. Nothing reads it in JavaScript, so a section
 * with no accent of its own simply keeps the default.
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
    <SidebarProvider data-section={product}>
      <DocsSidebar />
      <SidebarInset className="h-svh overflow-hidden md:h-[calc(100svh-1rem)]">
        <DocsHeader />
        {/* not `flex`: a flex scroll container stretches its row to the visible
            height rather than the content height, and the sticky outline inside
            then has nowhere to travel and scrolls away with the prose */}
        <div
          data-docs-scroll
          className="no-scrollbar w-full flex-1 overflow-y-auto px-6 pt-7 pb-8 lg:px-8"
        >
          {/* `docs-body` and `docs-article` are the two hooks a page needs to
              widen the shell. A reference page carrying `data-wide` wants the
              whole width and its own right-hand column, so globals.css drops the
              article's cap and hides the outline for that page only, with
              `:has()` rather than a prop, because the layout is a server
              component that never sees which page rendered inside it. */}
          <div className="docs-body mx-auto flex w-full max-w-5xl gap-10">
            <article className="docs-article typeset typeset-docs min-w-0 max-w-3xl flex-1">
              {children}
              <PageNav />
            </article>
            <Toc />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
