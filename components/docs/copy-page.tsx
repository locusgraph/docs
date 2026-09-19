"use client";

import { Check, ChevronDown, Code, Copy, TriangleAlert } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Copy this page as Markdown, for pasting into a model.
 *
 * The work was already done: `scripts/build-docs-artifacts.mjs` writes a `.md`
 * beside every page, which is what llmstxt.org asks for. This is the surface
 * over it, so a reader does not have to know the convention exists to use it.
 *
 * It fetches rather than serialising the DOM. The `.md` is the page with its
 * component tags resolved and its code fences intact, and reading it back off
 * the rendered HTML would give something worse than a file already sitting
 * there.
 */
type State = "idle" | "copying" | "done" | "failed";

const LABEL: Record<State, string> = {
  idle: "Copy page",
  copying: "Copying…",
  done: "Copied",
  failed: "Could not copy",
};

export function CopyPage() {
  const pathname = usePathname();
  const [state, setState] = useState<State>("idle");
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // A menu that does not close on an outside click is a menu people close by
  // navigating away from the page.
  useEffect(() => {
    if (!open) return;
    const away = (event: MouseEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  // Back to idle, so the button does not sit reading "Copied" forever.
  useEffect(() => {
    if (state !== "done" && state !== "failed") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const markdown = `${pathname}.md`;

  const copy = async () => {
    setOpen(false);
    setState("copying");
    try {
      const res = await fetch(markdown);
      if (!res.ok) throw new Error(String(res.status));
      await navigator.clipboard.writeText(await res.text());
      setState("done");
    } catch {
      // `navigator.clipboard` throws outside a secure context and in some
      // embedded webviews. Saying so beats a button that does nothing.
      setState("failed");
    }
  };

  const Icon = { idle: Copy, copying: Copy, done: Check, failed: TriangleAlert }[state];

  return (
    <div ref={box} className="not-prose relative shrink-0">
      <div className="flex items-stretch overflow-hidden rounded-lg border border-line bg-surface">
        <button
          type="button"
          onClick={copy}
          disabled={state === "copying"}
          // Sized to the longest label, so the row does not reflow as it changes.
          className="flex w-[9.5rem] items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-soft hover:bg-ghost hover:text-foreground disabled:opacity-70"
        >
          <Icon
            className={`size-3.5 shrink-0 ${state === "copying" ? "animate-pulse" : ""} ${
              state === "done" ? "text-s3" : ""
            } ${state === "failed" ? "text-s2" : ""}`}
          />
          <span className="truncate">{LABEL[state]}</span>
        </button>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="More ways to take this page"
          aria-expanded={open}
          className="border-line border-l px-1.5 text-faint hover:bg-ghost hover:text-foreground"
        >
          <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open ? (
        <div className="absolute right-0 z-20 mt-1.5 w-72 overflow-hidden rounded-xl border border-line bg-surface shadow-lg">
          <button
            type="button"
            onClick={copy}
            className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-ghost"
          >
            <Copy className="mt-0.5 size-3.5 shrink-0 text-faint" />
            <span>
              <span className="block text-[13px] font-medium text-foreground">Copy page</span>
              <span className="block text-[11.5px] text-faint">Copy this page as Markdown</span>
            </span>
          </button>
          <a
            href={markdown}
            className="flex w-full items-start gap-2.5 border-line border-t px-3 py-2.5 no-underline hover:bg-ghost"
          >
            <Code className="mt-0.5 size-3.5 shrink-0 text-faint" />
            <span>
              <span className="block text-[13px] font-medium text-foreground">
                View as Markdown
              </span>
              <span className="block truncate font-mono text-[11px] text-faint">{markdown}</span>
            </span>
          </a>
        </div>
      ) : null}
    </div>
  );
}
