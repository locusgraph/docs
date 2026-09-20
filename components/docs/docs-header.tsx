"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DocsGroupNav } from "@/components/docs/docs-group-nav";
import { DocsSearch } from "@/components/docs/search";
import { ThemeSwitch } from "@/components/site/theme-switch";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { endpointBySlug, endpointsFor } from "@/lib/api/endpoints";
import { pagesOf, productOf, treeFor } from "@/lib/site/docs-nav";
import { isProduct, PRODUCT_INFO } from "@/lib/site/products";

/**
 * The docs bar, matching the dashboard's.
 *
 * The trail runs from the host index down to the page: every level is a link
 * except the last, which is where you are. It used to be two levels of plain
 * text, so the header named the section without offering a way back to it.
 *
 * On an API page the third level is "API reference" rather than the endpoint's
 * resource group: `Memories` and `Contexts` group the sidebar and have no page
 * of their own, and a crumb that goes nowhere is worse than one less crumb.
 *
 * `\u203a` rather than `/`, because these pages are full of paths: a `/` in the
 * header beside `/v1/memories` in the body reads as part of the path rather
 * than as the trail describing it.
 *
 * Narrow screens keep the last crumb and drop the rest. The full trail plus the
 * search button plus the group nav is around 800px of bar, so on a phone all of
 * it used to run off the right edge and take the search button with it. The
 * levels it drops are the ones the sidebar behind the trigger already lists.
 *
 * The group nav hides below `xl`, the same width the outline hides at: three
 * group links and the More button are another 440px, and the sidebar is the way
 * to those pages when the header has no room for them.
 */
export function DocsHeader() {
  const pathname = usePathname();
  const product = productOf(pathname);
  const info = isProduct(product) ? PRODUCT_INFO[product] : undefined;
  const tree = treeFor(pathname);
  const page = tree ? pagesOf(tree).find((item) => item.href === pathname) : undefined;

  /**
   * An endpoint page is generated, so the nav has no item to read its name off:
   * the guides sidebar carries one link into the reference, not one per
   * endpoint. Without this the breadcrumb on all thirty-seven of them says
   * "Docs".
   */
  const endpoint = pathname.includes("/api/")
    ? endpointBySlug(product, pathname.split("/api/")[1] ?? "")
    : undefined;

  /**
   * The group level is the tree the page sits in, which carries an `href` to its
   * own first page. A tree with no title is the section's own pages, and has no
   * crumb of its own: "LocusGraph / Overview" already says it.
   */
  const group = endpoint
    ? { label: "API reference", href: `/${product}/api/${endpointsFor(product)[0]?.slug ?? ""}` }
    : tree?.title
      ? { label: tree.title, href: tree.href }
      : undefined;

  const trail: { label: string; href?: string }[] = [
    { label: "Docs", href: "/" },
    ...(info ? [{ label: info.title, href: `/${product}` }] : []),
    // Kept even when its own href is this page, so the first page of a group
    // does not lose a level the others have. The link is dropped below rather
    // than the crumb, because a crumb that points at the page you are on is a
    // link that does nothing.
    ...(group ? [group.href === pathname ? { label: group.label } : group] : []),
    { label: endpoint?.name ?? page?.title ?? "Docs" },
  ];

  const crumbs = trail.map((crumb, i) => ({
    ...crumb,
    href: i === trail.length - 1 ? undefined : crumb.href,
    last: i === trail.length - 1,
  }));

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-line px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex items-center gap-1.5 text-sm font-medium">
          {crumbs.map((crumb) => (
            <li
              key={crumb.href ?? crumb.label}
              className={`min-w-0 items-center gap-1.5 ${crumb.last ? "flex" : "hidden sm:flex"}`}
            >
              {crumb.href ? (
                <Link href={crumb.href} className="truncate text-soft hover:text-foreground">
                  {crumb.label}
                </Link>
              ) : (
                <span className="truncate" aria-current="page">
                  {crumb.label}
                </span>
              )}
              {crumb.last ? null : (
                <span aria-hidden="true" className="text-line">
                  {"\u203a"}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <DocsSearch />
        <div className="hidden items-center gap-2 xl:flex">
          <DocsGroupNav />
          <Separator orientation="vertical" className="h-4" />
        </div>
        <ThemeSwitch />
      </div>
    </header>
  );
}
