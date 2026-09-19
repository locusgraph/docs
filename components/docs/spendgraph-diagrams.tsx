import { Fig } from "@/components/docs/figure";

/**
 * Figures for the Spendgraph package overviews.
 *
 * Kept apart from `diagrams.tsx`, which serves LocusGraph, so each section's
 * figures can move with its content if the two ever split. Both files are
 * registered the same way in `mdx-components.tsx`.
 *
 * A package page that uses one of these is coupled to this host: the component
 * lives here, not in the package. That is the trade for having figures at all,
 * and it holds while this host is the only thing rendering them.
 */

const LABEL = "fill-current text-[11px]";
const MONO = "fill-current font-mono text-[10.5px]";

function Arrow({ id }: { id: string }) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="9"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" className="fill-line" />
    </marker>
  );
}

/** Two ways to get a prompt, one object out. */
export function PromptSources() {
  return (
    <Fig caption="Both hand back the same Prompt, so nothing downstream knows which it was given.">
      <svg viewBox="0 0 640 150" className="w-full" role="img" aria-label="Two ways in, one prompt">
        <title>Two ways in, one prompt</title>
        <defs>
          <Arrow id="ps-a" />
        </defs>

        {[
          { y: 40, call: "pullPrompt", from: "the dashboard" },
          { y: 106, call: "buildCustomPrompt", from: "your code" },
        ].map((row) => (
          <g key={row.call}>
            <text x="20" y={row.y + 4} className={`${LABEL} text-faint`}>
              {row.from}
            </text>
            <rect x="130" y={row.y - 16} width="184" height="32" rx="8" className="fill-ghost" />
            <text x="222" y={row.y + 4} textAnchor="middle" className={`${MONO} text-foreground`}>
              {row.call}
            </text>
            <path
              d={`M 326 ${row.y} C 380 ${row.y} 380 73 430 73`}
              className="stroke-line"
              strokeWidth="1.5"
              fill="none"
              markerEnd="url(#ps-a)"
            />
          </g>
        ))}

        <rect x="442" y="53" width="120" height="40" rx="8" className="fill-ghost" />
        <text x="502" y="70" textAnchor="middle" className={`${MONO} text-s1`}>
          Prompt
        </text>
        <text x="502" y="85" textAnchor="middle" className={`${LABEL} text-faint`}>
          format · serialize · call
        </text>
      </svg>
    </Fig>
  );
}

/** Any provider in, one shape out, six counts recorded. */
export function OneShapeBack() {
  return (
    <Fig caption="No provider SDK imported. Your client is called by shape, not by name.">
      <svg viewBox="0 0 640 170" className="w-full" role="img" aria-label="Any provider, one shape">
        <title>Any provider, one shape</title>
        <defs>
          <Arrow id="os-a" />
        </defs>

        {["Anthropic", "OpenAI", "anything else"].map((name, i) => (
          <g key={name}>
            <rect x="20" y={24 + i * 46} width="140" height="32" rx="8" className="fill-ghost" />
            <text x="90" y={44 + i * 46} textAnchor="middle" className={`${LABEL} text-soft`}>
              {name}
            </text>
            <path
              d={`M 172 ${40 + i * 46} C 220 ${40 + i * 46} 220 86 262 86`}
              className="stroke-line"
              strokeWidth="1.5"
              fill="none"
              markerEnd="url(#os-a)"
            />
          </g>
        ))}

        <rect x="274" y="62" width="120" height="48" rx="8" className="fill-ghost" />
        <text x="334" y="91" textAnchor="middle" className={`${MONO} text-foreground`}>
          llms
        </text>

        <line
          x1="406"
          y1="86"
          x2="450"
          y2="86"
          className="stroke-line"
          strokeWidth="1.5"
          markerEnd="url(#os-a)"
        />
        <text x="464" y="76" className={`${LABEL} text-s1`}>
          one reply shape
        </text>
        <text x="464" y="96" className={`${LABEL} text-faint`}>
          six token counts, every time
        </text>
      </svg>
    </Fig>
  );
}

/** Declare many, offer few, record what ran. */
export function ToolShortlist() {
  return (
    <Fig caption="Fifty tools is 7,500 tokens spent before anyone types. A model given five picks better.">
      <svg viewBox="0 0 640 130" className="w-full" role="img" aria-label="Declare, offer, record">
        <title>Declare, offer, record</title>
        <defs>
          <Arrow id="ts-a" />
        </defs>

        {[
          { x: 20, w: 150, top: "declare", bottom: "every tool you have" },
          { x: 244, w: 150, top: "offer", bottom: "the right few" },
          { x: 468, w: 152, top: "record", bottom: "what was called" },
        ].map((box, i) => (
          <g key={box.top}>
            <rect x={box.x} y="34" width={box.w} height="52" rx="8" className="fill-ghost" />
            <text
              x={box.x + box.w / 2}
              y="58"
              textAnchor="middle"
              className={`${MONO} text-foreground`}
            >
              {box.top}
            </text>
            <text x={box.x + box.w / 2} y="75" textAnchor="middle" className={`${LABEL} text-soft`}>
              {box.bottom}
            </text>
            {i < 2 ? (
              <line
                x1={box.x + box.w + 12}
                y1="60"
                x2={box.x + box.w + 62}
                y2="60"
                className="stroke-line"
                strokeWidth="1.5"
                markerEnd="url(#ts-a)"
              />
            ) : null}
          </g>
        ))}

        <text x="320" y="110" textAnchor="middle" className={`${LABEL} text-faint`}>
          a model that says it checked the ledger and did not is a claim only the steps disprove
        </text>
      </svg>
    </Fig>
  );
}

/** Nodes and edges in, a priced rollout out. */
export function GraphToRollout() {
  return (
    <Fig caption="Hand-rolled if/await runs fine and leaves nothing behind.">
      <svg
        viewBox="0 0 640 170"
        className="w-full"
        role="img"
        aria-label="A graph, and its rollout"
      >
        <title>A graph, and its rollout</title>
        <defs>
          <Arrow id="gr-a" />
        </defs>

        {[
          { cx: 70, cy: 50 },
          { cx: 170, cy: 50 },
          { cx: 170, cy: 120 },
          { cx: 270, cy: 85 },
        ].map((n, i) => (
          <g key={`${n.cx}-${n.cy}`}>
            <circle cx={n.cx} cy={n.cy} r="17" className="fill-ghost" />
            <text
              x={n.cx}
              y={n.cy + 4}
              textAnchor="middle"
              className={`${MONO} text-foreground`}
            >{`n${i + 1}`}</text>
          </g>
        ))}

        <g className="stroke-line" strokeWidth="1.5" fill="none">
          <line x1="88" y1="50" x2="150" y2="50" markerEnd="url(#gr-a)" />
          <path d="M 84 62 C 120 100 130 118 150 120" markerEnd="url(#gr-a)" />
          <line x1="188" y1="50" x2="250" y2="76" markerEnd="url(#gr-a)" />
          <line x1="188" y1="120" x2="250" y2="94" markerEnd="url(#gr-a)" />
        </g>

        <line
          x1="292"
          y1="85"
          x2="340"
          y2="85"
          className="stroke-line"
          strokeWidth="1.5"
          markerEnd="url(#gr-a)"
        />

        <rect x="352" y="30" width="268" height="110" rx="10" className="fill-ghost" />
        <text x="368" y="52" className={`${LABEL} text-faint`}>
          a rollout
        </text>
        {[
          ["n1", "$0.004"],
          ["n2", "$0.009"],
          ["n4", "$0.015"],
        ].map(([step, cost], i) => (
          <g key={step}>
            <text x="368" y={76 + i * 20} className={`${MONO} text-foreground`}>
              {step}
            </text>
            <text x="588" y={76 + i * 20} textAnchor="end" className={`${MONO} text-s1`}>
              {cost}
            </text>
          </g>
        ))}
      </svg>
    </Fig>
  );
}

/** The seven shapes, and where each one stops. */
export function SevenShapes() {
  const shapes = [
    ["refine", "draft, judge, revise until a bar is met", "a draft"],
    ["route", "classify first, then dispatch to a specialist", "—"],
    ["chain", "steps in sequence, each on the last's output", "a gate"],
    ["parallel", "the same call N times, or N sections at once", "—"],
    ["orchestrate", "a lead decomposes and delegates to workers", "before the workers"],
    ["loop", "tools in a loop until the model stops asking", "before a tool"],
    ["cascade", "try the cheap model, escalate when it will not do", "before a tier"],
  ];
  return (
    <figure className="not-prose my-6 overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-5 py-2.5 text-xs tracking-wide text-faint uppercase">
        <span>The seven</span>
        <span>Pauses at</span>
      </div>
      <ol className="divide-y divide-line">
        {shapes.map(([name, what, pause]) => (
          <li key={name} className="flex items-baseline gap-4 px-5 py-2.5">
            <span className="w-24 shrink-0 font-mono text-sm text-s1">{name}</span>
            <span className="flex-1 text-sm text-soft">{what}</span>
            <span className="shrink-0 text-right text-xs text-faint">
              {pause === "—" ? "-" : pause}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/** Park, let the process die, resume where it stopped. */
export function ParkAndResume() {
  return (
    <Fig caption="The workflow parks, the process exits, and the run picks up where it stopped.">
      <svg viewBox="0 0 640 160" className="w-full" role="img" aria-label="Parking a long run">
        <title>Parking a long run</title>
        <defs>
          <Arrow id="pr-a" />
        </defs>

        <text x="20" y="34" className={`${LABEL} text-faint`}>
          await it
        </text>
        <rect x="120" y="18" width="360" height="30" rx="8" className="fill-ghost" />
        <text x="300" y="38" textAnchor="middle" className={`${LABEL} text-soft`}>
          three hours of held process
        </text>
        <text x="496" y="38" className={`${LABEL} text-bad`}>
          frozen, lost
        </text>

        <text x="20" y="104" className={`${LABEL} text-faint`}>
          park it
        </text>
        <rect x="120" y="88" width="110" height="30" rx="8" className="fill-ghost" />
        <text x="175" y="108" textAnchor="middle" className={`${LABEL} text-soft`}>
          start, park
        </text>
        <line
          x1="242"
          y1="103"
          x2="300"
          y2="103"
          className="stroke-line"
          strokeWidth="1.5"
          strokeDasharray="3 4"
        />
        <text x="312" y="99" className={`${LABEL} text-faint`}>
          process exits
        </text>
        <line
          x1="404"
          y1="103"
          x2="452"
          y2="103"
          className="stroke-line"
          strokeWidth="1.5"
          markerEnd="url(#pr-a)"
        />
        <rect x="464" y="88" width="156" height="30" rx="8" className="fill-ghost" />
        <text x="542" y="108" textAnchor="middle" className={`${LABEL} text-s1`}>
          resumes, answer kept
        </text>

        <text x="120" y="142" className={`${LABEL} text-faint`}>
          minutes or hours later, on whatever isolate is free
        </text>
      </svg>
    </Fig>
  );
}

/** A score plus the sentence that explains it. */
export function ScoreNotAssert() {
  return (
    <figure className="not-prose my-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
      <div className="bg-surface px-5 py-4">
        <p className="text-xs font-medium tracking-wide text-faint uppercase">A unit test</p>
        <p className="mt-2 font-mono text-sm text-soft">expect(out).toBe(expected)</p>
        <p className="mt-2 text-sm text-soft">
          Model output is never equal to anything, so this is skipped or written as a brittle
          <code className="mx-1">includes()</code>
          that breaks on the first reword.
        </p>
      </div>
      <div className="bg-surface px-5 py-4">
        <p className="text-xs font-medium tracking-wide text-s1 uppercase">A score</p>
        <p className="mt-2 font-mono text-sm text-foreground">0.82 · and why</p>
        <p className="mt-2 text-sm text-soft">
          Every check returns a number between 0 and 1 <strong>plus a sentence</strong> saying what
          it saw. A suite mean that slides tells you where to look.
        </p>
      </div>
    </figure>
  );
}

/** One command, one SDK call. */
export function CliOverSdk() {
  return (
    <Fig caption="Base URL, auth, retries and error shapes are decided once, in the SDK.">
      <svg viewBox="0 0 640 120" className="w-full" role="img" aria-label="sg over the SDK">
        <title>sg over the SDK</title>
        <defs>
          <Arrow id="cl-a" />
        </defs>

        <rect x="20" y="36" width="150" height="44" rx="8" className="fill-ghost" />
        <text x="95" y="56" textAnchor="middle" className={`${MONO} text-foreground`}>
          sg
        </text>
        <text x="95" y="72" textAnchor="middle" className={`${LABEL} text-faint`}>
          what to call, how to print
        </text>

        <line
          x1="182"
          y1="58"
          x2="238"
          y2="58"
          className="stroke-line"
          strokeWidth="1.5"
          markerEnd="url(#cl-a)"
        />

        <rect x="250" y="36" width="150" height="44" rx="8" className="fill-ghost" />
        <text x="325" y="56" textAnchor="middle" className={`${MONO} text-s1`}>
          sdk
        </text>
        <text x="325" y="72" textAnchor="middle" className={`${LABEL} text-faint`}>
          the only socket
        </text>

        <line
          x1="412"
          y1="58"
          x2="468"
          y2="58"
          className="stroke-line"
          strokeWidth="1.5"
          markerEnd="url(#cl-a)"
        />

        <rect x="480" y="36" width="140" height="44" rx="8" className="fill-ghost" />
        <text x="550" y="62" textAnchor="middle" className={`${LABEL} text-soft`}>
          the dashboard
        </text>
      </svg>
    </Fig>
  );
}
