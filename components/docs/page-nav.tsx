"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { neighbours } from "@/lib/site/docs-nav";

/**
 * Previous and next, in sidebar order.
 *
 * A page split into twelve loses the one thing a single long page gave away
 * free: knowing what comes after. This puts it back, and is why the reading
 * order lives in one file rather than in each page's head.
 */
export function PageNav() {
  const { prev, next } = neighbours(usePathname());
  if (!prev && !next) return null;

  return (
    <nav className="not-typeset mt-14 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="group border border-border bg-card px-4 py-3 transition-colors hover:bg-muted"
        >
          <span className="flex items-center gap-1.5 text-xs text-faint">
            <ArrowLeftIcon weight="bold" className="size-3" aria-hidden />
            Previous
          </span>
          <span className="mt-0.5 block text-sm font-medium">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group border border-border bg-card px-4 py-3 text-right transition-colors hover:bg-muted sm:col-start-2"
        >
          <span className="flex items-center justify-end gap-1.5 text-xs text-faint">
            Next
            <ArrowRightIcon weight="bold" className="size-3" aria-hidden />
          </span>
          <span className="mt-0.5 block text-sm font-medium">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
