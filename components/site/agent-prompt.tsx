"use client";

import { Check, Copy, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { ClaudeMark, CodexMark, CursorMark, VsCodeMark } from "@/components/docs/client-marks";

/**
 * One pill on the landing page: the prompt that points an agent at these docs.
 *
 * Everything it names already exists. `/llms.txt` maps all 118 pages, and every
 * page has a `.md` twin, so an agent handed this can fetch what it needs rather
 * than being told about documentation it cannot read.
 *
 * The logos are decoration. At 14px inside a button with one obvious action
 * nobody tries to click them, and they say "your editor" faster than a longer
 * label would — which is why the label does not repeat it.
 */
const PROMPT = `Use LocusGraph for durable memory in this project, and Spendgraph to know what each model call costs.

Documentation index for models: https://docs.locusgraph.com/llms.txt
Any page as markdown: append .md to its URL
Whole corpus in one request: https://docs.locusgraph.com/llms-full.txt

Start here:
  https://docs.locusgraph.com/locusgraph/quickstart.md
  https://docs.locusgraph.com/spendgraph/getting-started.md

LocusGraph also speaks MCP at https://api.locusgraph.com/mcp, which is the
better route if this editor can connect to a remote MCP server:
  https://docs.locusgraph.com/locusgraph/mcp/connecting.md`;

type State = "idle" | "copying" | "done" | "failed";

const LABEL: Record<State, string> = {
  idle: "Start with an agent",
  copying: "Copying…",
  done: "Copied",
  failed: "Could not copy",
};

const MARKS = [
  { key: "claude", Mark: ClaudeMark },
  { key: "cursor", Mark: CursorMark },
  { key: "vscode", Mark: VsCodeMark },
  { key: "codex", Mark: CodexMark },
];

export function AgentPrompt() {
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    if (state !== "done" && state !== "failed") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const copy = async () => {
    setState("copying");
    try {
      await navigator.clipboard.writeText(PROMPT);
      setState("done");
    } catch {
      // Throws outside a secure context and in some embedded webviews. Saying
      // so beats a button that appears to do nothing.
      setState("failed");
    }
  };

  const Icon = { idle: Copy, copying: Copy, done: Check, failed: TriangleAlert }[state];

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={copy}
        disabled={state === "copying"}
        className="flex items-center gap-3 rounded-full border border-line bg-surface py-1.5 pr-3 pl-2 transition-colors hover:border-soft/40 hover:bg-ghost disabled:opacity-70"
      >
        <span className="flex items-center">
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
        {/* Fixed width, so the hero does not twitch as the label changes. */}
        <span className="w-[10.5rem] text-left text-sm font-medium text-foreground">
          {LABEL[state]}
        </span>
        <Icon
          className={`size-4 shrink-0 ${state === "done" ? "text-s3" : ""} ${
            state === "failed" ? "text-s2" : "text-faint"
          } ${state === "copying" ? "animate-pulse" : ""}`}
        />
      </button>
      <p className="m-0 text-xs text-faint">Copies a prompt that points your agent at the docs</p>
    </div>
  );
}
