import Link from "next/link";
import { GithubMark, LocusMark, XMark } from "@/components/site/marks";
import { ThemeSwitch } from "@/components/site/theme-switch";

/**
 * The header and footer every page on the docs host wears.
 *
 * Shared components rather than a layout, because the landing page owns the
 * gradient the header sits on — a layout would have to paint it for routes
 * that do not want it.
 */
export function SiteHeader() {
  return (
    <header className="flex items-center justify-between px-7 py-5">
      <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight">
        <span className="grid size-7 place-items-center rounded-md bg-foreground text-background">
          <LocusMark className="size-5" />
        </span>
        LocusGraph
        <span className="text-soft">docs</span>
      </Link>
      <nav className="flex items-center gap-4">
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
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="flex items-center justify-center px-6 py-6 text-sm text-faint">
      <span>
        Made with care by{" "}
        <a
          href="https://www.effortlesslabs.xyz"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-soft hover:text-foreground"
        >
          Effortless Labs
        </a>
      </span>
    </footer>
  );
}
