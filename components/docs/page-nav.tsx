"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
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
    <nav className="mt-14 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="group rounded-xl border border-line px-4 py-3 transition hover:bg-ghost"
        >
          <span className="flex items-center gap-1.5 text-xs text-faint">
            <ArrowLeft className="size-3" />
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
          className="group rounded-xl border border-line px-4 py-3 text-right transition hover:bg-ghost sm:col-start-2"
        >
          <span className="flex items-center justify-end gap-1.5 text-xs text-faint">
            Next
            <ArrowRight className="size-3" />
          </span>
          <span className="mt-0.5 block text-sm font-medium">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
