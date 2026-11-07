"use client";

import { Breadcrumbs } from "@locusgraph/components";
import { usePathname } from "next/navigation";
import { NextLink } from "@/components/site/next-link";
import { trailFor } from "@/lib/site/docs-shell";

/**
 * Where this page sits, above its title.
 *
 * Narrow screens keep the last crumb and drop the rest, which the sidebar
 * sheet already lists.
 */
export function DocsTrail() {
  return (
    <div className="not-typeset mb-6">
      <Breadcrumbs items={trailFor(usePathname())} linkComponent={NextLink} />
    </div>
  );
}
