import Link from "next/link";
import { DocsSearch } from "@/components/docs/search";
import { GithubMark, LocusMark, XMark } from "@/components/site/marks";
import { ThemeSwitch } from "@/components/site/theme-switch";

/**
 * The header and footer every page on the docs host wears.
 *
 * Shared components rather than a layout, because the landing page owns the
 * gradient the header sits on: a layout would have to paint it for routes that
 * do not want it.
 *
 * The header is sticky, and translucent so the gradient and the tape read
 * through it as they pass under. `supports-[backdrop-filter]` drops it to a
 * more opaque background where blur is unavailable, because a 70% panel with
 * nothing behind it is unreadable rather than subtle.
 *
 * The bar itself is full-bleed so the border and the blur reach both edges; the
 * row inside it takes the same measure as the page, which is what puts the
 * wordmark on the same line as the left edge of the content.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/55">
      <div className="px-6">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <span className="grid size-7 place-items-center rounded-md bg-foreground text-background">
              <LocusMark className="size-5" />
            </span>
            LocusGraph
            <span className="text-soft">docs</span>
          </Link>
          <nav className="flex items-center gap-4">
            <DocsSearch />
            <a
              href="https://www.locusgraph.com"
              className="text-sm font-medium text-soft hover:text-foreground"
            >
              Website
            </a>
            <a
              href="https://github.com/fnLog0"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub organisation"
              className="text-soft hover:text-foreground"
            >
              <GithubMark />
            </a>
            <a
              href="https://x.com/effortlesslabs"
              target="_blank"
              rel="noreferrer"
              aria-label="Follow on X"
              className="text-soft hover:text-foreground"
            >
              <XMark />
            </a>
            <ThemeSwitch />
          </nav>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line/60">
      <div className="px-6">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-center py-6 text-sm text-faint">
          Made with care by{" "}
          <a
            href="https://www.effortlesslabs.xyz"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-soft hover:text-foreground"
          >
            Effortless Labs
          </a>
        </div>
      </div>
    </footer>
  );
}
