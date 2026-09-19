"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import type { DocsTree } from "@/lib/site/docs-nav";
import { productOf, treeFor, treesFor } from "@/lib/site/docs-nav";
import { iconForGroup } from "@/lib/site/icons";

/**
 * Every group in this section, along the header.
 *
 * The sidebar already lists these, but it lists every page under them too, so
 * jumping from the last CLI page to Prompts means scrolling past forty entries.
 * This is the same set one level up, always in reach.
 *
 * Only three are shown. Spendgraph has ten groups and LocusGraph eight, which
 * at full width crowded the header and at anything narrower scrolled sideways.
 * The rest live behind one button.
 *
 * Groups with no title are skipped: they are the section's own pages, which the
 * sidebar shows unlabelled at the top and which have no group to name.
 */
const SHOWN = 3;

function GroupLink({ tree, current }: { tree: DocsTree; current: DocsTree | undefined }) {
  const Icon = iconForGroup(tree.title);
  return (
    <Link
      href={tree.href}
      title={tree.blurb}
      aria-current={tree === current ? "page" : undefined}
      className={`flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-sm transition hover:bg-ghost ${
        tree === current ? "font-medium text-foreground" : "text-soft hover:text-foreground"
      }`}
    >
      {Icon ? <Icon className="size-3.5 shrink-0" aria-hidden /> : null}
      {tree.title}
    </Link>
  );
}

export function DocsGroupNav() {
  const pathname = usePathname();
  const groups = treesFor(productOf(pathname)).filter((tree) => tree.title);
  const current = treeFor(pathname);

  if (groups.length === 0) return null;

  // The group being read is always one of the three, even when it sits tenth in
  // the list. Otherwise the header says nothing about where you are.
  let shown = groups.slice(0, SHOWN);
  if (current?.title && !shown.includes(current)) {
    shown = [current, ...groups.filter((t) => t !== current).slice(0, SHOWN - 1)];
  }
  const rest = groups.filter((tree) => !shown.includes(tree));

  return (
    <nav className="flex min-w-0 items-center gap-1">
      {shown.map((tree) => (
        <GroupLink key={tree.href} tree={tree} current={current} />
      ))}

      {rest.length > 0 ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-sm text-soft transition hover:bg-ghost hover:text-foreground data-[state=open]:bg-ghost">
            More
            <span className="text-xs text-faint">{rest.length}</span>
            <ChevronDown className="size-3.5 transition data-[state=open]:rotate-180" aria-hidden />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 min-w-56 overflow-hidden rounded-xl border border-line bg-surface p-1 shadow-xl"
            >
              {rest.map((tree) => {
                const Icon = iconForGroup(tree.title);
                return (
                  <DropdownMenu.Item key={tree.href} asChild>
                    <Link
                      href={tree.href}
                      className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm no-underline outline-none data-[highlighted]:bg-ghost"
                    >
                      {Icon ? (
                        <Icon className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
                      ) : null}
                      <span className="min-w-0">
                        <span className="block font-medium">{tree.title}</span>
                        <span className="mt-0.5 block text-xs text-soft">{tree.blurb}</span>
                      </span>
                    </Link>
                  </DropdownMenu.Item>
                );
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ) : null}
    </nav>
  );
}
