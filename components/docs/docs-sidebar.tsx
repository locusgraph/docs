"use client";

import { DocsSidebar as Sidebar } from "@locusgraph/components";
import { usePathname } from "next/navigation";
import { NextLink } from "@/components/site/next-link";
import { sidebarGroups } from "@/lib/site/docs-shell";

/**
 * The section's pages, or on an API page its endpoints.
 *
 * Which of the two is decided in `sidebarGroups` rather than by giving `/api`
 * its own layout: a nested layout wraps its parent rather than replacing it, so
 * swapping the sidebar in the route tree would mean moving those pages out from
 * under the shell they share.
 */
export function DocsSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar groups={sidebarGroups(pathname)} activeHref={pathname} linkComponent={NextLink} />
  );
}
