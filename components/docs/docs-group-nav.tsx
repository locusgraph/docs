"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { productOf, treeFor, treesFor } from "@/lib/site/docs-nav";

/**
 * Every group in this section, along the header.
 *
 * The sidebar already lists these, but it lists every page under them too — so
 * jumping from the last CLI page to Prompts means scrolling past forty entries.
 * This is the same set at one level up, always in reach.
 *
 * Groups with no title are skipped: they are the section's own pages, which the
 * sidebar shows unlabelled at the top and which have no group to name.
 */
export function DocsGroupNav() {
  const pathname = usePathname();
  const groups = treesFor(productOf(pathname)).filter((tree) => tree.title);
  const current = treeFor(pathname);

  if (groups.length === 0) return null;

  return (
    <nav className="no-scrollbar flex min-w-0 items-center gap-1 overflow-x-auto">
      {groups.map((tree) => (
        <Link
          key={tree.href}
          href={tree.href}
          title={tree.blurb}
          aria-current={tree === current ? "page" : undefined}
          className={`shrink-0 rounded-md px-2 py-1 text-sm transition hover:bg-ghost ${
            tree === current ? "font-medium text-foreground" : "text-soft hover:text-foreground"
          }`}
        >
          {tree.title}
        </Link>
      ))}
    </nav>
  );
}
