"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@locusgraph/components";
import { CaretUpDownIcon } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import type * as React from "react";
import { ProductMark } from "@/components/site/product-mark";
import { productOf } from "@/lib/site/docs-nav";
import { sectionChoices } from "@/lib/site/docs-shell";

/**
 * The header brand inside a section, as a switcher between sections.
 *
 * The trigger is the brand itself, the mark and name the shell already drew,
 * with a caret to say it opens. The menu is the package's Radix dropdown, which
 * brings the keyboard: Enter or Space opens it, the arrows move, Escape closes
 * it and hands focus back to the trigger. A radio group marks the section being
 * read as checked, which is what a screen reader announces as selected.
 *
 * Two things are set here rather than taken from the package. The panel starts
 * opaque instead of fading in, because mid-fade in dark mode the sidebar reads
 * through it. And the highlighted row uses `border` rather than the package's
 * `accent`: in dark mode `accent` is `#1b1b1d` on a `#18181a` panel, which is
 * no visible change, so arrowing through the list showed nothing.
 *
 * Choosing a row goes to that section's root. The host index is not in the
 * list: the "Docs" crumb at the top of every page is the way back there.
 */
export function SectionSwitcher({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const current = productOf(usePathname());
  const choices = sectionChoices(current);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`${className ?? ""} locus-focus-ring cursor-pointer`}>
        {children}
        <CaretUpDownIcon weight="bold" aria-hidden className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-72 border-border bg-popover data-[state=open]:[--tw-enter-opacity:1]"
      >
        <DropdownMenuRadioGroup
          value={choices.find((choice) => choice.current)?.product ?? ""}
          onValueChange={(value) => {
            const choice = choices.find((item) => item.product === value);
            if (choice) router.push(choice.href);
          }}
        >
          {choices.map((choice) => (
            <DropdownMenuRadioItem
              key={choice.product}
              value={choice.product}
              className="items-start gap-3 py-2 focus:bg-border focus:text-foreground"
            >
              <ProductMark product={choice.product} className="mt-0.5 size-5" />
              <span className="flex flex-col gap-0.5">
                <span className="font-brand font-bold text-foreground">{choice.title}</span>
                <span className="text-xs text-muted-foreground">{choice.blurb}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
