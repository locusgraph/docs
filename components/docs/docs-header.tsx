"use client";

import { LocusGraphMark } from "@locusgraph/brand";
import { DocsNavList, DocsHeader as Header } from "@locusgraph/components";
import { usePathname } from "next/navigation";
import { DocsSearch } from "@/components/docs/search";
import { NextLink } from "@/components/site/next-link";
import { ThemeSwitch } from "@/components/site/theme-switch";
import { productOf } from "@/lib/site/docs-nav";
import { activeHeaderHref, headerLinks, sidebarGroups } from "@/lib/site/docs-shell";

/**
 * The docs bar: the LocusGraph docs header with this host's links in it.
 *
 * The links are the sections, plus the API reference for the section being
 * read. The groups inside a section live in the sidebar, which on a narrow
 * screen the header opens as a sheet, so that sheet carries the same groups.
 */
export function DocsHeader() {
  const pathname = usePathname();
  const product = productOf(pathname);

  return (
    <Header
      brand={{
        name: "LocusGraph",
        product: " docs",
        icon: <LocusGraphMark className="size-5" />,
        href: "/",
      }}
      links={headerLinks(product)}
      activeHref={activeHeaderHref(pathname)}
      linkComponent={NextLink}
      mobileNav={
        <DocsNavList
          groups={sidebarGroups(pathname)}
          activeHref={pathname}
          linkComponent={NextLink}
        />
      }
    >
      <DocsSearch />
      <ThemeSwitch />
    </Header>
  );
}
