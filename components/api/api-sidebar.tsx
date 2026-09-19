"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { API_BASE, endpointsFor, groupsFor } from "@/lib/api/endpoints";

/**
 * A sidebar of its own for the API reference.
 *
 * Thirty-seven endpoints listed beside the guides would bury them: the written
 * pages are what a reader needs first and there are a third as many. So the two
 * do not share a sidebar. This one lists nothing but endpoints, grouped by the
 * resource they act on, and its footer goes back to the guides rather than to
 * the host index.
 *
 * The method carries the colour rather than an icon. A reader scanning for a
 * write wants to see POST and DELETE at a glance, and a row of identical
 * document icons tells them nothing.
 */
const METHOD_INK: Record<string, string> = {
  GET: "text-s3",
  POST: "text-s1",
  DELETE: "text-s2",
};

export function ApiSidebar({ product }: { product: string }) {
  const pathname = usePathname();
  const endpoints = endpointsFor(product);
  const groups = groupsFor(product);

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href={`/${product}/api/${endpoints[0]?.slug ?? ""}`}>
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-s1 font-mono text-[11px] font-semibold text-background">
                  {"{}"}
                </span>
                <span className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-semibold tracking-tight">
                    API reference
                  </span>
                  <span className="truncate text-xs text-soft">
                    v1 · {API_BASE[product]?.replace("https://", "")}
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel>{group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {endpoints
                  .filter((endpoint) => endpoint.group === group)
                  .map((endpoint) => {
                    const href = `/${product}/api/${endpoint.slug}`;
                    return (
                      <SidebarMenuItem key={endpoint.slug}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === href}
                          tooltip={endpoint.name}
                        >
                          <Link href={href}>
                            <span
                              className={`w-9 shrink-0 font-mono text-[9px] font-semibold ${
                                METHOD_INK[endpoint.method] ?? "text-faint"
                              }`}
                            >
                              {endpoint.method === "DELETE" ? "DEL" : endpoint.method}
                            </span>
                            <span className="truncate">{endpoint.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Back to the guides">
              <Link href={`/${product}`}>
                <ArrowLeft />
                <span>Guides</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
