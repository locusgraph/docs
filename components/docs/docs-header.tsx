"use client";

import { usePathname } from "next/navigation";
import { DocsGroupNav } from "@/components/docs/docs-group-nav";
import { DocsSearch } from "@/components/docs/search";
import { ThemeSwitch } from "@/components/site/theme-switch";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { endpointBySlug } from "@/lib/api/endpoints";
import { pagesOf, productOf, treeFor } from "@/lib/site/docs-nav";
import { isProduct, PRODUCT_INFO } from "@/lib/site/products";

/**
 * The docs bar, matching the dashboard's.
 *
 * It names the section rather than the tree, because on this host the section
 * is the thing a reader navigated into — the tree is an implementation detail
 * of how the sidebar is grouped.
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
    ? endpointBySlug(pathname.split("/api/")[1] ?? "")
    : undefined;

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-line px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h2 className="text-sm font-medium">
        {info ? (
          <>
            <span className="text-soft">{info.title}</span>
            <span className="mx-1.5 text-line">/</span>
          </>
        ) : null}
        {endpoint?.name ?? page?.title ?? "Docs"}
      </h2>
      <div className="ml-auto flex min-w-0 items-center gap-2">
        <DocsSearch />
        <DocsGroupNav />
        <Separator orientation="vertical" className="h-4" />
        <ThemeSwitch />
      </div>
    </header>
  );
}
