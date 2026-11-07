"use client";

import { CheckIcon, CopyIcon, WarningIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { ClaudeMark, CodexMark, CursorMark, VsCodeMark } from "@/components/docs/client-marks";
import { AGENT_PROMPTS, type PromptProduct } from "@/lib/site/agent-prompts";
import { PRODUCT_INFO } from "@/lib/site/products";

/**
 * A card's "Start with an agent" button: copies the prompt for that card's
 * product, from `lib/site/agent-prompts.ts`.
 *
 * It sits inside the card but outside the card's links, so it is a button on
 * its own and never a button inside an anchor.
 *
 * The logos are decoration. At 14px inside a button with one obvious action
 * nobody tries to click them, and they say "your editor" faster than a longer
 * label would, which is why the label does not repeat it.
 */
type State = "idle" | "copying" | "done" | "failed";

const LABEL: Record<State, string> = {
  idle: "Start with an agent",
  copying: "Copying",
  done: "Copied",
  failed: "Could not copy",
};

const MARKS = [
  { key: "claude", Mark: ClaudeMark },
  { key: "cursor", Mark: CursorMark },
  { key: "vscode", Mark: VsCodeMark },
  { key: "codex", Mark: CodexMark },
];

export function AgentPrompt({ product }: { product: PromptProduct }) {
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    if (state !== "done" && state !== "failed") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const copy = async () => {
    setState("copying");
    try {
      await navigator.clipboard.writeText(AGENT_PROMPTS[product]);
      setState("done");
    } catch {
      // Throws outside a secure context and in some embedded webviews. Saying
      // so beats a button that appears to do nothing.
      setState("failed");
    }
  };

  const Icon = { idle: CopyIcon, copying: CopyIcon, done: CheckIcon, failed: WarningIcon }[state];

  return (
    <div className="flex min-w-0 max-w-full flex-col items-start gap-1.5">
      <button
        type="button"
        onClick={copy}
        disabled={state === "copying"}
        className="locus-focus-ring flex max-w-full min-w-0 items-center gap-3 rounded-full border border-line bg-surface py-1.5 pr-3 pl-2 transition-colors hover:border-soft/40 hover:bg-ghost disabled:opacity-70"
      >
        <span className="flex shrink-0 items-center">
          {MARKS.map(({ key, Mark }, i) => (
            <span
              key={key}
              // Overlapping, so four marks cost the width of about two and a
              // half. The ring is the background colour, which is what keeps
              // the one behind from bleeding into the one in front.
              className="grid size-6 place-items-center rounded-full bg-background text-soft ring-1 ring-line"
              style={{ marginLeft: i === 0 ? 0 : "-0.4rem", zIndex: MARKS.length - i }}
            >
              <Mark />
            </span>
          ))}
        </span>
        {/* Fixed width from `sm` up, so the card does not twitch as the label
            changes. Below that it gives way instead: at 360px the fixed width
            plus the card's padding was wider than the screen. */}
        <span className="min-w-0 truncate text-left text-sm font-medium text-foreground sm:w-[10.5rem]">
          {LABEL[state]}
        </span>
        {/* Two of these sit on one page, so the visible label alone gives
            both the same name. This tells them apart for a screen reader
            without changing what a sighted reader sees. */}
        <span className="sr-only"> for {PRODUCT_INFO[product].title}</span>
        <Icon
          aria-hidden
          weight="bold"
          className={`size-4 shrink-0 ${state === "done" ? "text-s3" : ""} ${
            state === "failed" ? "text-s2" : "text-faint"
          } ${state === "copying" ? "animate-pulse" : ""}`}
        />
      </button>
      {/* The outcome, announced on its own. A live region on the button read
          its whole name again, logos and all, every time the label changed. */}
      <span role="status" className="sr-only">
        {state === "done" || state === "failed" ? LABEL[state] : ""}
      </span>
      <p className="m-0 text-xs text-faint">
        Copies a prompt that points your agent at the {PRODUCT_INFO[product].title} docs
      </p>
    </div>
  );
}
