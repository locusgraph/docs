"use client";

import { Check, Copy } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The `<pre>` every fenced code block in MDX becomes.
 *
 * Reads the text back off the rendered DOM rather than taking it as a prop:
 * rehype-pretty-code has already split the source into per-token spans by the
 * time this renders, and reassembling it from children means walking that tree
 * and getting whitespace wrong. `innerText` is what the reader would have
 * selected by hand, which is exactly what the button should copy.
 */
export function CodeBlock({
  children,
  filename,
  ...props
}: React.ComponentPropsWithoutRef<"pre"> & { filename?: string }) {
  const pre = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = pre.current?.innerText;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <figure className="group relative my-5 overflow-hidden rounded-xl border border-line bg-ghost">
      {filename ? (
        <figcaption className="flex items-center border-b border-line px-4 py-2 font-mono text-xs text-soft">
          {filename}
        </figcaption>
      ) : null}
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className={cn(
          "absolute right-2.5 z-10 grid size-7 place-items-center rounded-md border border-line",
          "bg-surface text-soft opacity-0 transition hover:text-foreground",
          "focus-visible:opacity-100 group-hover:opacity-100",
          filename ? "top-11" : "top-2.5"
        )}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
      <pre
        ref={pre}
        className="overflow-x-auto px-4 py-3.5 text-[13px] leading-relaxed [&>code]:bg-transparent"
        {...props}
      >
        {children}
      </pre>
    </figure>
  );
}
