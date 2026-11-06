"use client";

import {
  Button,
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Kbd,
  Toggle,
} from "@locusgraph/components";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
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
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        onMouseEnter={() => void load()}
        aria-label="Search the docs"
        className="w-8 justify-start bg-surface font-sans font-normal text-muted-foreground shadow-none hover:bg-surface/80 sm:w-56"
      >
        <MagnifyingGlassIcon weight="bold" aria-hidden />
        <span className="hidden sm:inline">Search the docs</span>
        <Kbd className="ml-auto hidden sm:inline-flex">⌘K</Kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-xl" showCloseButton={false}>
          <DialogHeader className="sr-only">
            <DialogTitle>Search the docs</DialogTitle>
            <DialogDescription>
              Find a page by its title, its headings or its text.
            </DialogDescription>
          </DialogHeader>
          {/* `shouldFilter` off because MiniSearch has already ranked the
              results; cmdk filtering them again would throw that order away. */}
          <Command shouldFilter={false} className="[&_[cmdk-input]]:h-12 [&_[cmdk-item]]:py-2">
            <div className="flex items-center gap-2 border-b border-border pr-2">
              <div className="min-w-0 flex-1 [&_[data-slot=command-input-wrapper]]:border-0">
                <CommandInput
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search the docs"
                />
              </div>
              {section ? (
                <Toggle
                  size="sm"
                  pressed={scoped}
                  onPressedChange={setScoped}
                  className="shrink-0 text-xs"
                >
                  This section
                </Toggle>
              ) : null}
            </div>

            <CommandList className="max-h-[56vh] p-1">
              {loading ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Loading the index
                </p>
              ) : null}

              {!loading && query.trim().length >= 2 && results.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Nothing matches <span className="text-foreground">{query}</span>
                </p>
              ) : null}

              {results.map((hit) => {
                const Icon = iconForHref(hit.id);
                return (
                  <CommandItem
                    key={hit.id}
                    value={hit.id}
                    onSelect={() => go(hit.id)}
                    className="items-start gap-3"
                  >
                    <Icon className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2">
                        <span className="truncate text-sm font-medium">{hit.title}</span>
                        <span className="shrink-0 text-xs text-faint">{hit.section}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                        {hit.description}
                      </span>
                    </span>
                  </CommandItem>
                );
              })}
            </CommandList>

            <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
              <span>
                <Kbd>Enter</Kbd> to open
              </span>
              <Link href="/" className="hover:text-foreground" onClick={() => setOpen(false)}>
                All documentation
              </Link>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
