"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@locusgraph/components";
import { CaretDownIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { NextLink } from "@/components/site/next-link";
import type { DocsTree } from "@/lib/site/docs-nav";
import { groupNav } from "@/lib/site/docs-shell";
import { iconForGroup } from "@/lib/site/icons";

/**
 * Every group in this section, along the header beside the section switcher.
 *
 * The sidebar already lists these, but it lists every page under them too, so
 * jumping from the last CLI page to Prompts means scrolling past forty entries.
 * This is the same set one level up, always in reach.
 *
 * Only three are shown. Spendgraph has ten groups and LocusGraph eight, which
 * at full width crowded the header and at anything narrower scrolled sideways.
 * The rest live behind one "More" menu, and below `xl` the whole row is hidden,
 * since the sidebar sheet carries the same groups there. Which groups land
 * where is `groupNav` in `lib/site/docs-shell.ts`.
 *
 * The menu is drawn the way the section switcher's is: an opaque panel from
 * the first frame, and a highlighted row on `border` rather than `accent`,
 * which in dark mode is too close to the panel to see.
 */
function GroupLink({ tree, current }: { tree: DocsTree; current: boolean }) {
  const Icon = iconForGroup(tree.title);
  return (
    <NextLink
      href={tree.href}
      title={tree.blurb}
      aria-current={current ? "page" : undefined}
      className={`locus-focus-ring flex shrink-0 items-center gap-1.5 px-2 py-1.5 text-sm font-medium transition-colors hover:text-foreground ${
        current ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {Icon ? <Icon weight="bold" className="size-3.5 shrink-0" aria-hidden /> : null}
      {tree.title}
    </NextLink>
  );
}

export function DocsGroupNav() {
  const { shown, rest, current } = groupNav(usePathname());
  if (shown.length === 0) return null;

  return (
    <nav aria-label="Groups" className="hidden min-w-0 items-center gap-0.5 xl:flex">
      {shown.map((tree) => (
        <GroupLink key={tree.href} tree={tree} current={tree === current} />
      ))}

      {rest.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="locus-focus-ring flex shrink-0 cursor-pointer items-center gap-1 px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=open]:text-foreground">
            More
            <span className="text-xs text-faint">{rest.length}</span>
            <CaretDownIcon weight="bold" className="size-3.5" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-72 border-border bg-popover data-[state=open]:[--tw-enter-opacity:1]"
          >
            {rest.map((tree) => {
              const Icon = iconForGroup(tree.title);
              return (
                <DropdownMenuItem
                  key={tree.href}
                  asChild
                  className="cursor-pointer items-start gap-3 py-2 focus:bg-border focus:text-foreground"
                >
                  <NextLink href={tree.href}>
                    {Icon ? (
                      <Icon
                        weight="bold"
                        className="mt-0.5 size-4 text-muted-foreground"
                        aria-hidden
                      />
                    ) : null}
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="font-medium text-foreground">{tree.title}</span>
                      <span className="text-xs text-muted-foreground">{tree.blurb}</span>
                    </span>
                  </NextLink>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </nav>
  );
}
