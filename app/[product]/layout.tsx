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
 */
export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
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
          <div className="mx-auto flex w-full max-w-5xl gap-10">
            <article className="typeset typeset-docs min-w-0 max-w-3xl flex-1">
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
