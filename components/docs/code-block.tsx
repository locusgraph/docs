"use client";

import { Button } from "@locusgraph/components";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
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
 *
 * Square and ruled, on the LocusGraph surface, with the package `Button` for
 * the copy action, so a code block here matches one in the products.
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
    <figure className="not-typeset group relative my-5 overflow-hidden border border-border bg-card">
      {filename ? (
        <figcaption className="flex items-center border-b border-border bg-muted px-4 py-2 font-mono text-xs text-muted-foreground">
          {filename}
        </figcaption>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size="icon-xs"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className={cn(
          "absolute right-2.5 z-10 bg-card opacity-0 focus-visible:opacity-100 group-hover:opacity-100",
          filename ? "top-11" : "top-2.5"
        )}
      >
        {copied ? <CheckIcon weight="bold" aria-hidden /> : <CopyIcon weight="bold" aria-hidden />}
      </Button>
      <pre
        ref={pre}
        className="overflow-x-auto px-4 py-3.5 font-mono text-code [&>code]:bg-transparent"
        {...props}
      >
        {children}
      </pre>
    </figure>
  );
}
