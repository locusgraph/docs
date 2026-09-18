"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Entry {
  id: string;
  text: string;
  depth: 2 | 3;
}

/**
 * "On this page", read off the rendered headings.
 *
 * Scanning the DOM rather than threading a table of contents out of MDX: the
 * headings already carry the ids the anchor links use, so the page is its own
 * source of truth and a new doc needs no extra export to appear here.
 */
export function Toc() {
  const pathname = usePathname();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const scroller = document.querySelector<HTMLElement>("[data-docs-scroll]");
    const article = document.querySelector("article");
    if (!scroller || !article) return;

    let found: Entry[] = [];
    // two ids, not one: a scroll landing before the scan would otherwise cancel
    // the scan and leave the outline permanently empty — which is what Next's
    // scroll restoration does on a fresh navigation
    let scanFrame = 0;
    let measureFrame = 0;

    const measure = () => {
      const top = scroller.getBoundingClientRect().top + 96;
      let current = found[0]?.id ?? "";
      for (const entry of found) {
        const el = document.getElementById(entry.id);
        if (el && el.getBoundingClientRect().top <= top) current = entry.id;
      }
      setActive(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(measureFrame);
      measureFrame = requestAnimationFrame(measure);
    };

    scanFrame = requestAnimationFrame(() => {
      found = [...article.querySelectorAll("h2[id], h3[id]")].map((el) => ({
        id: el.id,
        text: el.textContent?.replace(/#$/, "").trim() ?? "",
        depth: el.tagName === "H2" ? (2 as const) : (3 as const),
      }));
      setEntries(found);
      measure();
    });

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(scanFrame);
      cancelAnimationFrame(measureFrame);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  if (entries.length < 2) return null;

  return (
    // `self-start` is load-bearing: a flex item stretches to its container by
    // default, leaving a sticky child nothing to travel within
    <aside className="sticky top-0 hidden h-fit w-56 shrink-0 self-start py-1 xl:block">
      <nav className="max-h-[calc(100svh-9rem)] overflow-y-auto">
        <p className="px-2.5 pb-2 text-xs font-medium uppercase tracking-wider text-faint">
          On this page
        </p>
        <ul className="grid gap-0.5 text-sm">
          {entries.map((entry) => (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                className={cn(
                  "block rounded-md py-1 pr-2 transition",
                  entry.depth === 3 ? "pl-6" : "pl-2.5",
                  active === entry.id
                    ? "font-medium text-foreground"
                    : "text-soft hover:text-foreground"
                )}
              >
                {entry.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
