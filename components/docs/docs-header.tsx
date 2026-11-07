"use client";

import { DocsNavList, DocsHeader as Header } from "@locusgraph/components";
import { usePathname } from "next/navigation";
import type * as React from "react";
import { DocsSearch } from "@/components/docs/search";
import { SectionSwitcher } from "@/components/docs/section-switcher";
import { NextLink } from "@/components/site/next-link";
import { ProductMark } from "@/components/site/product-mark";
import { ThemeSwitch } from "@/components/site/theme-switch";
import { productOf } from "@/lib/site/docs-nav";
import { activeHeaderHref, headerBrand, headerLinks, sidebarGroups } from "@/lib/site/docs-shell";

/**
 * Inside a section the brand opens the section switcher rather than linking
 * anywhere. The shell always draws its brand as a link through `linkComponent`,
 * so the brand is given a href no real link uses, and `HeaderLink` swaps in the
 * switcher when it sees it. The mark and name keep the shell's own layout.
 */
const SWITCHER = "#switch-section";

function HeaderLink({
  href,
  className,
  children,
  ...props
}: React.ComponentProps<typeof NextLink>) {
  if (href === SWITCHER) return <SectionSwitcher className={className}>{children}</SectionSwitcher>;
  return (
    <NextLink href={href} className={className} {...props}>
      {children}
    </NextLink>
  );
}

/**
 * The docs bar: the LocusGraph docs header with this host's links in it.
 *
 * The brand is the section's own mark and name, so a reader always knows which
 * product they are in, and it opens the switcher to the other sections. The
 * only link is the section's API reference. The groups inside a section live in
 * the sidebar, which on a narrow screen the header opens as a sheet, so that
 * sheet carries the same groups.
 */
export function DocsHeader() {
  const pathname = usePathname();
  const product = productOf(pathname);
  const brand = headerBrand(product);

  return (
    <Header
      brand={{
        name: brand.name,
        icon: <ProductMark product={brand.product ?? "locusgraph"} className="size-5" />,
        href: brand.product ? SWITCHER : brand.href,
      }}
      links={headerLinks(product)}
      activeHref={activeHeaderHref(pathname)}
      linkComponent={HeaderLink}
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
