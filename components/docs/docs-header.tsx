"use client";

import { LocusGraphMark } from "@locusgraph/brand";
import { DocsNavList, DocsHeader as Header } from "@locusgraph/components";
import { usePathname } from "next/navigation";
import { DocsSearch } from "@/components/docs/search";
import { NextLink } from "@/components/site/next-link";
import { ProductMark } from "@/components/site/product-mark";
import { ThemeSwitch } from "@/components/site/theme-switch";
import { productOf } from "@/lib/site/docs-nav";
import { activeHeaderHref, headerBrand, headerLinks, sidebarGroups } from "@/lib/site/docs-shell";

/**
 * The docs bar: the LocusGraph docs header with this host's links in it.
 *
 * The brand is the section's own mark and name, so a reader always knows which
 * product they are in, and it leads back to that section's root. The only link
 * is the section's API reference. The groups inside a section live in the
 * sidebar, which on a narrow screen the header opens as a sheet, so that sheet
 * carries the same groups.
 */
export function DocsHeader() {
  const pathname = usePathname();
  const product = productOf(pathname);
  const brand = headerBrand(product);

  return (
    <Header
      brand={{
        name: brand.name,
        product: " docs",
        icon: brand.product ? (
          <ProductMark product={brand.product} className="size-5" />
        ) : (
          <LocusGraphMark className="size-5" />
        ),
        href: brand.href,
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
