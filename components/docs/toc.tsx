"use client";

import { OnThisPage, type PageSection } from "@locusgraph/components";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * "On this page", read off the rendered headings.
 *
 * Scanning the DOM rather than threading a table of contents out of MDX: the
 * headings already carry the ids the anchor links use, so the page is its own
 * source of truth and a new doc needs no extra export to appear here.
 *
 * Keyed on the path, so the outline's own idea of the active heading starts
 * over on every page rather than carrying across a client navigation.
 */
export function Toc() {
  const pathname = usePathname();
  const [sections, setSections] = useState<PageSection[]>([]);

  // `pathname` is not read inside, and it is the point: dropping it, which is
  // what the rule suggests, leaves the outline showing the previous page's
  // headings after a client-side navigation.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run key
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const article = document.querySelector(".docs-article");
      if (!article) return;
      setSections(
        [...article.querySelectorAll("h2[id], h3[id]")].map((el) => ({
          id: el.id,
          title: el.textContent?.replace(/#$/, "").trim() ?? "",
          nested: el.tagName === "H3",
        }))
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  if (sections.length < 2) return null;
  return <OnThisPage key={pathname} sections={sections} />;
}
