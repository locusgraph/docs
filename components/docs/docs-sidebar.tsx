"use client";

import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProductMark } from "@/components/site/product-mark";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { pagesOf, productOf, treesFor } from "@/lib/site/docs-nav";
import { iconForHref } from "@/lib/site/icons";
import { isProduct, PRODUCT_INFO } from "@/lib/site/products";

export function DocsSidebar() {
  const pathname = usePathname();
  const product = productOf(pathname);
  const trees = treesFor(product);
  const info = isProduct(product) ? PRODUCT_INFO[product] : undefined;

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href={`/${product}`}>
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-foreground text-background">
                  {isProduct(product) ? (
                    <ProductMark product={product} />
                  ) : (
                    <FileText className="size-4" />
                  )}
                </span>
                <span className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-semibold tracking-tight">
                    {info?.title ?? "LocusGraph"}
                  </span>
                  <span className="truncate text-xs text-soft">Documentation</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {trees.map((tree) => (
          <SidebarGroup key={tree.href}>
            {tree.title ? <SidebarGroupLabel>{tree.title}</SidebarGroupLabel> : null}
            <SidebarGroupContent>
              <SidebarMenu>
                {pagesOf(tree).map((item) => {
                  const Icon = iconForHref(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          <Icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        {trees.length === 0 ? (
          <SidebarGroup>
            <SidebarGroupContent className="px-2 py-1 text-sm text-faint">
              No chapters yet.
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="All docs">
              <Link href="/">
                <ArrowLeft />
                <span>All docs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
