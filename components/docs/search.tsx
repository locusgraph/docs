"use client";

import { Command } from "cmdk";
import MiniSearch, { type SearchResult } from "minisearch";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { iconForHref } from "@/lib/site/icons";

interface Doc {
  id: string;
  product: string;
  section: string;
  title: string;
  description: string;
  headings: string;
  body: string;
}

/**
 * Search over every page, in the browser.
 *
 * The index is a static file built from the manifest, so it cannot describe a
 * page that does not exist. Nothing is fetched until the palette is opened for
 * the first time: 113 pages is 283 KB of JSON, which is cheap on demand and
 * wasteful on every page load.
 *
 * MiniSearch does prefix and fuzzy matching, so `retreive` still finds
 * `retrieveMemories`. Fields are weighted because a word in a title says more
 * about a page than the same word buried in its body.
 */
function build(docs: Doc[]) {
  const index = new MiniSearch<Doc>({
    fields: ["title", "headings", "description", "body"],
    storeFields: ["title", "description", "section", "product"],
    searchOptions: {
      prefix: true,
      fuzzy: 0.2,
      boost: { title: 5, headings: 3, description: 2 },
    },
  });
  index.addAll(docs);
  return index;
}

export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<MiniSearch<Doc> | null>(null);
  const [loading, setLoading] = useState(false);
  const [scoped, setScoped] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const section = pathname.split("/")[1] ?? "";
  const loaded = useRef(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const load = useCallback(async () => {
    if (loaded.current) return;
    loaded.current = true;
    setLoading(true);
    try {
      const res = await fetch("/search-index.json");
      setIndex(build((await res.json()) as Doc[]));
    } catch {
      // A failed index leaves the palette empty rather than broken; the sidebar
      // is still there, and retrying is closing and reopening.
      loaded.current = false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  const results = useMemo(() => {
    if (!index || query.trim().length < 2) return [];
    const hits = index.search(query) as (SearchResult & Doc)[];
    const wanted = scoped ? hits.filter((h) => h.product === section) : hits;
    return (wanted.length > 0 ? wanted : hits).slice(0, 12);
  }, [index, query, scoped, section]);

  const go = (id: string) => {
    setOpen(false);
    setQuery("");
    router.push(id);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onMouseEnter={() => void load()}
        className="flex items-center gap-2 rounded-md border border-line px-2 py-1 text-sm text-faint transition hover:bg-ghost hover:text-soft"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden font-mono text-[11px] text-faint sm:inline">⌘K</kbd>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Search the documentation"
        shouldFilter={false}
        className="fixed inset-0 z-50 grid place-items-start justify-center pt-[12vh]"
      >
        {/* A button rather than a div with a click handler: dismissing is an
            action, and this way it is one for a keyboard and a screen reader
            too. `cursor-default` keeps it from advertising itself as a target. */}
        <button
          type="button"
          aria-label="Close search"
          onClick={() => setOpen(false)}
          className="fixed inset-0 cursor-default bg-background/70 backdrop-blur-sm"
        />

        <div className="relative w-[min(92vw,640px)] overflow-hidden rounded-xl border border-line bg-surface shadow-2xl">
          <div className="flex items-center gap-2 border-b border-line px-4">
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search the docs"
              className="flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-faint"
            />
            {section ? (
              <button
                type="button"
                onClick={() => setScoped((v) => !v)}
                className={`shrink-0 rounded-md px-2 py-1 text-xs transition ${
                  scoped ? "bg-ghost text-foreground" : "text-faint hover:text-soft"
                }`}
              >
                This section
              </button>
            ) : null}
          </div>

          <Command.List className="max-h-[56vh] overflow-y-auto p-2">
            {loading ? (
              <p className="px-3 py-6 text-center text-sm text-faint">Loading the index</p>
            ) : null}

            {!loading && query.trim().length >= 2 && results.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-faint">
                Nothing matches <span className="text-soft">{query}</span>
              </p>
            ) : null}

            {results.map((hit) => {
              const Icon = iconForHref(hit.id);
              return (
                <Command.Item
                  key={hit.id}
                  value={hit.id}
                  onSelect={() => go(hit.id)}
                  className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 data-[selected=true]:bg-ghost"
                >
                  <Icon className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="truncate text-sm font-medium">{hit.title}</span>
                      <span className="shrink-0 text-xs text-faint">{hit.section}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-soft">
                      {hit.description}
                    </span>
                  </span>
                </Command.Item>
              );
            })}
          </Command.List>

          <div className="flex items-center justify-between border-t border-line px-4 py-2 text-xs text-faint">
            <span>
              <kbd className="font-mono">Enter</kbd> to open
            </span>
            <Link href="/" className="hover:text-soft" onClick={() => setOpen(false)}>
              All documentation
            </Link>
          </div>
        </div>
      </Command.Dialog>
    </>
  );
}
