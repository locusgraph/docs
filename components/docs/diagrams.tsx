import { Fig } from "@/components/docs/figure";

/**
 * The diagrams the LocusGraph pages use.
 *
 * Inline SVG rather than an image: it inherits the theme through `currentColor`
 * and the colour tokens, stays sharp at any size, and the text in it is real
 * text — selectable, searchable, and readable by a screen reader through the
 * `<title>` each one carries.
 *
 * Every diagram is drawn in its own viewBox and scaled to the column width, so
 * the coordinates below are a fixed grid rather than pixels on anyone's screen.
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

/** What goes in, what comes back, and the gap in between. */
export function MemoryFlow() {
  return (
    <Fig caption="You write what happened. You ask in your own words. The two never have to match.">
      <svg viewBox="0 0 640 210" className="w-full" role="img" aria-label="The memory round trip">
        <title>The memory round trip</title>
        <defs>
          <Arrow id="mf-a" />
        </defs>

        <text x="78" y="20" textAnchor="middle" className={`${LABEL} text-soft`}>
          your app
        </text>
        <text x="470" y="20" textAnchor="middle" className={`${LABEL} text-soft`}>
          LocusGraph
        </text>
        <line x1="20" y1="30" x2="136" y2="30" className="stroke-line" strokeWidth="1" />
        <line x1="340" y1="30" x2="600" y2="30" className="stroke-line" strokeWidth="1" />

        {/* write */}
        <rect x="20" y="52" width="230" height="44" rx="8" className="fill-ghost" />
        <text x="36" y="72" className={`${LABEL} text-soft`}>
          learns something
        </text>
        <text x="36" y="88" className={`${MONO} text-foreground`}>
          "the user prefers dark mode"
        </text>
        <line
          x1="262"
          y1="74"
          x2="336"
          y2="74"
          className="stroke-line"
          strokeWidth="1.5"
          markerEnd="url(#mf-a)"
        />
        <rect x="348" y="52" width="252" height="44" rx="8" className="fill-ghost" />
        <text x="364" y="72" className={`${LABEL} text-soft`}>
          stored under a name
        </text>
        <text x="364" y="88" className={`${MONO} text-s1`}>
          preference:dark_mode
        </text>

        {/* the wait */}
        <line
          x1="474"
          y1="104"
          x2="474"
          y2="128"
          className="stroke-line"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        <text x="490" y="121" className={`${LABEL} text-faint`}>
          three days later
        </text>

        {/* read */}
        <rect x="20" y="140" width="230" height="44" rx="8" className="fill-ghost" />
        <text x="36" y="160" className={`${LABEL} text-soft`}>
          asks in plain words
        </text>
        <text x="36" y="176" className={`${MONO} text-foreground`}>
          "what theme do they like?"
        </text>
        <line
          x1="262"
          y1="162"
          x2="336"
          y2="162"
          className="stroke-line"
          strokeWidth="1.5"
          markerEnd="url(#mf-a)"
        />
        <rect x="348" y="140" width="252" height="44" rx="8" className="fill-ghost" />
        <text x="364" y="160" className={`${LABEL} text-soft`}>
          found by meaning
        </text>
        <text x="364" y="176" className={`${MONO} text-s1`}>
          preference:dark_mode
        </text>
      </svg>
    </Fig>
  );
}

/** One context, its memories, and the contexts it reaches. */
export function ContextGraph() {
  return (
    <Fig caption="Contexts are the handles. Memories hang beneath them. Links connect one handle to another.">
      <svg viewBox="0 0 640 230" className="w-full" role="img" aria-label="A context graph">
        <title>A context graph</title>
        <defs>
          <Arrow id="cg-a" />
        </defs>

        {/* root context */}
        <rect x="20" y="96" width="120" height="34" rx="8" className="fill-ghost" />
        <text x="80" y="117" textAnchor="middle" className={`${MONO} text-foreground`}>
          user:alice
        </text>

        {/* edges out */}
        <path
          d="M 140 106 C 180 106 180 56 216 56"
          className="stroke-line"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#cg-a)"
        />
        <text x="152" y="72" className={`${LABEL} text-faint`}>
          extends
        </text>
        <path
          d="M 140 120 C 180 120 180 182 216 182"
          className="stroke-line"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#cg-a)"
        />
        <text x="146" y="166" className={`${LABEL} text-faint`}>
          related_to
        </text>

        {/* two contexts */}
        <rect x="228" y="38" width="172" height="34" rx="8" className="fill-ghost" />
        <text x="314" y="59" textAnchor="middle" className={`${MONO} text-s1`}>
          preference:dark_mode
        </text>
        <rect x="228" y="164" width="172" height="34" rx="8" className="fill-ghost" />
        <text x="314" y="185" textAnchor="middle" className={`${MONO} text-s1`}>
          project:billing_ui
        </text>

        {/* memories under the first */}
        <line
          x1="400"
          y1="55"
          x2="436"
          y2="55"
          className="stroke-line"
          strokeWidth="1.5"
          markerEnd="url(#cg-a)"
        />
        <rect x="448" y="26" width="172" height="30" rx="6" className="fill-ghost" />
        <text x="460" y="45" className={`${LABEL} text-soft`}>
          "asked for dark mode"
        </text>
        <rect x="448" y="62" width="172" height="30" rx="6" className="fill-ghost" />
        <text x="460" y="81" className={`${LABEL} text-soft`}>
          "light theme hurts at night"
        </text>
        <text x="448" y="110" className={`${LABEL} text-faint`}>
          two memories, one context
        </text>
      </svg>
    </Fig>
  );
}

/** Experience against the conclusions drawn from it. */
export function ExperienceVsConclusion() {
  const rows = [
    ["the user prefers dark mode", "user seems design-conscious, values aesthetics"],
    ["the deploy failed on the migration step", "the team has recurring infra challenges"],
  ];
  return (
    <figure className="not-prose my-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
      <div className="bg-surface px-5 py-4">
        <p className="text-xs font-medium tracking-wide text-s1 uppercase">Experience</p>
        <p className="mt-1 text-sm text-faint">one thing. first-hand. still true in a year.</p>
        <ul className="mt-4 space-y-3">
          {rows.map(([a]) => (
            <li key={a} className="font-mono text-sm text-foreground">
              “{a}”
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-surface px-5 py-4">
        <p className="text-xs font-medium tracking-wide text-faint uppercase">Not experience</p>
        <p className="mt-1 text-sm text-faint">
          a conclusion about things. true until the next one.
        </p>
        <ul className="mt-4 space-y-3">
          {rows.map(([, b]) => (
            <li key={b} className="font-mono text-sm text-soft line-through decoration-faint">
              “{b}”
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

/** The four steps of the quickstart. */
export function QuickstartSteps() {
  const steps = [
    ["install", "npm install @locusgraph/client"],
    ["connect", "server url · agent secret · graph id"],
    ["remember", "storeEvent(…)"],
    ["recall", "retrieveMemories(…)"],
  ];
  return (
    <figure className="not-prose my-6 overflow-hidden rounded-xl border border-line bg-surface">
      <ol className="divide-y divide-line">
        {steps.map(([name, what], i) => (
          <li key={name} className="flex items-center gap-4 px-5 py-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full border border-line font-mono text-xs text-faint">
              {i + 1}
            </span>
            <span className="w-24 shrink-0 text-sm font-medium">{name}</span>
            <span className="truncate font-mono text-sm text-soft">{what}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/** Stored one way, asked another, found anyway. */
export function MeaningMatch() {
  return (
    <Fig caption="No shared words. Found anyway: the two mean the same thing.">
      <svg viewBox="0 0 640 150" className="w-full" role="img" aria-label="Matching by meaning">
        <title>Matching by meaning</title>
        <defs>
          <Arrow id="mm-a" />
        </defs>

        <text x="20" y="34" className={`${LABEL} text-faint`}>
          stored
        </text>
        <rect x="86" y="16" width="290" height="32" rx="8" className="fill-ghost" />
        <text x="100" y="37" className={`${MONO} text-foreground`}>
          "the user prefers dark mode"
        </text>

        <text x="20" y="84" className={`${LABEL} text-faint`}>
          asked
        </text>
        <rect x="86" y="66" width="290" height="32" rx="8" className="fill-ghost" />
        <text x="100" y="87" className={`${MONO} text-foreground`}>
          "what theme do they like?"
        </text>

        <path
          d="M 386 32 C 440 32 440 82 386 82"
          className="stroke-line"
          strokeWidth="1.5"
          fill="none"
        />
        <line
          x1="432"
          y1="57"
          x2="486"
          y2="57"
          className="stroke-line"
          strokeWidth="1.5"
          markerEnd="url(#mm-a)"
        />
        <text x="498" y="53" className={`${LABEL} text-s1`}>
          matched
        </text>
        <text x="498" y="69" className={`${LABEL} text-faint`}>
          by meaning
        </text>

        <line x1="86" y1="118" x2="376" y2="118" className="stroke-line" strokeDasharray="3 4" />
        <text x="86" y="138" className={`${LABEL} text-faint`}>
          shared words: none
        </text>
      </svg>
    </Fig>
  );
}

/** Graph holds contexts, contexts hold memories. */
export function ConceptTree() {
  return (
    <Fig caption="One graph. Many contexts. Many memories under each, and links between contexts.">
      <svg viewBox="0 0 640 220" className="w-full" role="img" aria-label="Graph, context, memory">
        <title>Graph, context, memory</title>

        {/* graph */}
        <rect
          x="16"
          y="16"
          width="608"
          height="188"
          rx="12"
          className="fill-none stroke-line"
          strokeDasharray="4 4"
        />
        <text x="32" y="38" className={`${LABEL} text-faint`}>
          Graph: one isolated memory space
        </text>

        {/* context A */}
        <rect x="40" y="56" width="190" height="32" rx="8" className="fill-ghost" />
        <text x="54" y="77" className={`${MONO} text-s1`}>
          preference:dark_mode
        </text>

        {/* memories */}
        <line x1="70" y1="88" x2="70" y2="176" className="stroke-line" strokeWidth="1" />
        {["asked for dark mode", "light theme hurts at night", "set theme to dark"].map((m, i) => (
          <g key={m}>
            <line
              x1="70"
              y1={112 + i * 28}
              x2="88"
              y2={112 + i * 28}
              className="stroke-line"
              strokeWidth="1"
            />
            <text x="96" y={116 + i * 28} className={`${LABEL} text-soft`}>
              “{m}”
            </text>
          </g>
        ))}
        <text x="40" y="196" className={`${LABEL} text-faint`}>
          memories
        </text>

        {/* context B */}
        <rect x="400" y="56" width="190" height="32" rx="8" className="fill-ghost" />
        <text x="414" y="77" className={`${MONO} text-s1`}>
          user:alice
        </text>
        <line
          x1="400"
          y1="72"
          x2="238"
          y2="72"
          className="stroke-line"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <text x="272" y="64" className={`${LABEL} text-faint`}>
          linked
        </text>
      </svg>
    </Fig>
  );
}

/** What the two halves of a context name are for. */
export function SlugAnatomy() {
  return (
    <Fig caption="The type groups it. The slug is the filing location. Pick one spelling and keep it.">
      <svg
        viewBox="0 0 640 120"
        className="w-full"
        role="img"
        aria-label="Anatomy of a context name"
      >
        <title>Anatomy of a context name</title>
        <text x="150" y="46" className="fill-current font-mono text-[22px] text-foreground">
          preference
        </text>
        <text x="288" y="46" className="fill-current font-mono text-[22px] text-faint">
          :
        </text>
        <text x="300" y="46" className="fill-current font-mono text-[22px] text-s1">
          dark_mode
        </text>

        <path d="M 150 60 L 150 74 L 278 74 L 278 60" className="stroke-line" fill="none" />
        <text x="214" y="94" textAnchor="middle" className={`${LABEL} text-faint`}>
          type: the family it belongs to
        </text>

        <path d="M 300 60 L 300 74 L 440 74 L 440 60" className="stroke-line" fill="none" />
        <text x="370" y="94" textAnchor="middle" className={`${LABEL} text-faint`}>
          slug: the exact thing
        </text>
      </svg>
    </Fig>
  );
}

/** The trust ladder, ordered, without the numbers. */
export function TrustLadder() {
  const rungs = [
    ["policy", "an organizational mandate"],
    ["verified", "authoritative, validated"],
    ["tool", "reliable tool output"],
    ["document", "a published source, a file"],
    ["user", "the person said so"],
    ["assistant", "the model inferred it"],
    ["derived", "second-hand synthesis"],
    ["system", "system-generated"],
  ];
  return (
    <figure className="not-prose my-6 overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-5 py-2.5">
        <span className="text-xs font-medium tracking-wide text-faint uppercase">More trusted</span>
        <span className="text-xs font-medium tracking-wide text-faint uppercase">↓</span>
      </div>
      <ol className="divide-y divide-line">
        {rungs.map(([name, what], i) => (
          <li key={name} className="flex items-baseline gap-4 px-5 py-2">
            <span
              className="h-1.5 w-12 shrink-0 rounded-full bg-s1"
              style={{ opacity: 1 - i * 0.1 }}
            />
            <span className="w-24 shrink-0 font-mono text-sm text-foreground">{name}</span>
            <span className="text-sm text-soft">{what}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/** The four relationships a write can declare. */
export function LinkTypes() {
  const links = [
    ["extends", "a more specific detail of", "hierarchy"],
    ["related_to", "associated with", "lateral"],
    ["reinforces", "strengthens", "agreement"],
    ["contradicts", "conflicts with, supersedes", "disagreement"],
  ];
  return (
    <figure className="not-prose my-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
      {links.map(([name, means, kind]) => (
        <div key={name} className="bg-surface px-5 py-4">
          <p className="font-mono text-sm text-s1">{name}</p>
          <p className="mt-1 text-sm text-soft">{means}</p>
          <p className="mt-2 text-xs tracking-wide text-faint uppercase">{kind}</p>
        </div>
      ))}
    </figure>
  );
}

/** What a chunking pipeline returns against what ingest returns. */
export function ChunkVsStatement() {
  return (
    <Fig caption="A chunk is a slice of a page. A statement is a thing the document said.">
      <svg
        viewBox="0 0 640 150"
        className="w-full"
        role="img"
        aria-label="Chunking against ingesting"
      >
        <title>Chunking against ingesting</title>
        <defs>
          <Arrow id="cv-a" />
        </defs>

        {[
          { y: 30, label: "chunking", mid: "400-token slices", end: "the nearest slices" },
          { y: 100, label: "ingesting", mid: "statements it makes", end: "the ones that answer" },
        ].map((row) => (
          <g key={row.label}>
            <text x="20" y={row.y + 5} className={`${LABEL} text-faint`}>
              {row.label}
            </text>
            <rect x="96" y={row.y - 14} width="92" height="28" rx="6" className="fill-ghost" />
            <text x="142" y={row.y + 4} textAnchor="middle" className={`${MONO} text-foreground`}>
              document
            </text>
            <line
              x1="196"
              y1={row.y}
              x2="240"
              y2={row.y}
              className="stroke-line"
              strokeWidth="1.5"
              markerEnd="url(#cv-a)"
            />
            <rect x="250" y={row.y - 14} width="168" height="28" rx="6" className="fill-ghost" />
            <text x="334" y={row.y + 4} textAnchor="middle" className={`${LABEL} text-soft`}>
              {row.mid}
            </text>
            <line
              x1="426"
              y1={row.y}
              x2="470"
              y2={row.y}
              className="stroke-line"
              strokeWidth="1.5"
              markerEnd="url(#cv-a)"
            />
            <text x="482" y={row.y + 4} className={`${LABEL} text-s1`}>
              {row.end}
            </text>
          </g>
        ))}
      </svg>
    </Fig>
  );
}

/** Two graphs holding the same names and reaching nothing of each other's. */
export function GraphIsolation() {
  const rows = ["policy:deploys", "user:alice", "project:billing"];
  return (
    <Fig caption="The same context names in two graphs. No query crosses the gap.">
      <svg viewBox="0 0 640 190" className="w-full" role="img" aria-label="Two isolated graphs">
        <title>Two isolated graphs</title>

        {[
          { x: 40, name: "graph: acme" },
          { x: 360, name: "graph: globex" },
        ].map((g) => (
          <g key={g.name}>
            <rect
              x={g.x}
              y="20"
              width="240"
              height="150"
              rx="10"
              className="fill-none stroke-line"
              strokeDasharray="4 4"
            />
            <text x={g.x + 16} y="42" className={`${MONO} text-soft`}>
              {g.name}
            </text>
            {rows.map((r, i) => (
              <text key={r} x={g.x + 16} y={70 + i * 26} className={`${MONO} text-s1`}>
                {r}
              </text>
            ))}
          </g>
        ))}

        <line
          x1="300"
          y1="30"
          x2="300"
          y2="160"
          className="stroke-line"
          strokeWidth="1"
          strokeDasharray="2 5"
        />
        <text x="320" y="182" textAnchor="middle" className={`${LABEL} text-faint`}>
          no relationship
        </text>
      </svg>
    </Fig>
  );
}

/** The two ways into a graph, and what each promises. */
export function TwoDoors() {
  return (
    <Fig caption="One writes. The other proposes, and waits for a person.">
      <svg
        viewBox="0 0 640 130"
        className="w-full"
        role="img"
        aria-label="storeEvent against observe"
      >
        <title>storeEvent against observe</title>
        <defs>
          <Arrow id="td-a" />
        </defs>

        {[
          { y: 34, call: "storeEvent", end: "in the graph, immediately", tone: "text-s1" },
          { y: 96, call: "observe", end: "a finding, waiting on a person", tone: "text-soft" },
        ].map((row) => (
          <g key={row.call}>
            <rect x="20" y={row.y - 16} width="150" height="32" rx="8" className="fill-ghost" />
            <text x="95" y={row.y + 4} textAnchor="middle" className={`${MONO} text-foreground`}>
              {row.call}
            </text>
            <line
              x1="182"
              y1={row.y}
              x2="250"
              y2={row.y}
              className="stroke-line"
              strokeWidth="1.5"
              markerEnd="url(#td-a)"
            />
            <text x="264" y={row.y + 4} className={`${LABEL} ${row.tone}`}>
              {row.end}
            </text>
          </g>
        ))}
      </svg>
    </Fig>
  );
}

/** The two multi-write calls, split by guarantee rather than by size. */
export function BatchVsTransaction() {
  const cards = [
    {
      call: "storeEventsBatch",
      headline: "each item stands alone",
      detail: "One result per item. A rejection takes nothing else with it.",
    },
    {
      call: "transaction",
      headline: "all of them, or none",
      detail: "One bad operation returns 400 and writes nothing at all.",
    },
  ];
  return (
    <figure className="not-prose my-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
      {cards.map((c) => (
        <div key={c.call} className="bg-surface px-5 py-4">
          <p className="font-mono text-sm text-s1">{c.call}</p>
          <p className="mt-2 text-sm font-medium">{c.headline}</p>
          <p className="mt-1 text-sm text-soft">{c.detail}</p>
        </div>
      ))}
    </figure>
  );
}

/** How much each removal call takes with it. */
export function RemovalLevels() {
  const levels = [
    { call: "deleteLocus", takes: "One memory, and its links", width: "22%" },
    {
      call: "forgetContext",
      takes: "A context, its links, and any memory it was the last thread holding",
      width: "58%",
    },
    { call: "archive", takes: "A whole graph, reversibly. There is no hard delete", width: "100%" },
  ];
  return (
    <figure className="not-prose my-6 overflow-hidden rounded-xl border border-line bg-surface">
      <ol className="divide-y divide-line">
        {levels.map((l) => (
          <li key={l.call} className="px-5 py-3.5">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-sm text-foreground">{l.call}</span>
              <span className="text-right text-sm text-soft">{l.takes}</span>
            </div>
            <div className="mt-2 h-1 w-full rounded-full bg-ghost">
              <div className="h-1 rounded-full bg-s1" style={{ width: l.width }} />
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
