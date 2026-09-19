import { Fig } from "@/components/docs/figure";

/**
 * Figures for the three Spendgraph pages this host owns.
 *
 * Separate from `spendgraph-diagrams.tsx`, which the packages reference. These
 * belong to `content/spendgraph/`, so they move with that content and carry no
 * coupling to anything published.
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

/**
 * The gap the whole section is about: what the dashboard says against what the
 * run spent, with the missing rows drawn as the difference rather than
 * described underneath it.
 */
export function TheGap() {
  // Widths are the receipt's own prices at 4,255px to the dollar, so the bars
  // are the numbers rather than an impression of them. The two calls nothing
  // reports are drawn last rather than in run order: the point is the size of
  // the difference, and interleaving them makes the bracket a lie.
  const reported = [
    { label: "triage", w: 17 },
    { label: "brief", w: 21 },
    { label: "decompose", w: 38 },
    { label: "review", w: 115 },
    { label: "answer", w: 64 },
  ];
  const unreported = [
    { label: "brief · retry", w: 26 },
    { label: "review · second pass", w: 119 },
  ];

  const shown = reported.reduce((n, r) => n + r.w, 0);
  const hidden = unreported.reduce((n, r) => n + r.w, 0);
  const X = 20;

  return (
    <Fig caption="Two of the seven calls are the ones nothing reports, and they are a third of the bill.">
      <svg
        viewBox="0 0 640 200"
        className="w-full"
        role="img"
        aria-label="Reported cost against actual cost"
      >
        <title>Reported cost against actual cost</title>
        <defs>
          <pattern
            id="gap-hatch"
            width="5"
            height="5"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="5" className="stroke-s1" strokeWidth="2" />
          </pattern>
        </defs>

        <text x={X} y="26" className={`${LABEL} text-faint`}>
          what the dashboard says
        </text>
        <rect x={X} y="36" width={shown} height="24" rx="4" className="fill-ghost" />
        <text x={X + shown + 10} y="53" className={`${MONO} text-foreground`}>
          $0.061
        </text>

        <text x={X} y="98" className={`${LABEL} text-faint`}>
          what the run spent
        </text>
        {
          [...reported, ...unreported].reduce<{ x: number; out: React.ReactNode[] }>(
            (acc, r, i) => {
              const isHidden = i >= reported.length;
              acc.out.push(
                <rect
                  key={r.label}
                  x={acc.x}
                  y="108"
                  width={r.w - 2}
                  height="24"
                  rx="4"
                  className={isHidden ? "fill-[url(#gap-hatch)]" : "fill-ghost"}
                />
              );
              acc.x += r.w;
              return acc;
            },
            { x: X, out: [] }
          ).out
        }
        <text x={X + shown + hidden + 10} y="125" className={`${MONO} text-s1`}>
          $0.094
        </text>

        <path
          d={`M ${X + shown} 140 L ${X + shown} 152 L ${X + shown + hidden - 2} 152 L ${X + shown + hidden - 2} 140`}
          className="stroke-line"
          strokeWidth="1.5"
          fill="none"
        />
        <text x={X + shown + hidden / 2} y="170" textAnchor="middle" className={`${MONO} text-s1`}>
          $0.032
        </text>
        <text x={X} y="192" className={`${LABEL} text-faint`}>
          a retry and a send-back, each folded into the call that caused it
        </text>
      </svg>
    </Fig>
  );
}

/**
 * Where the receipt comes from: the retry sitting outside the thing that
 * records, which is the one decision the rest of the design follows from.
 */
export function ReceiptsStack() {
  return (
    <Fig caption="Each layer hands back what it spent, so the receipts add up instead of being reconstructed afterwards.">
      <svg
        viewBox="0 0 640 250"
        className="w-full"
        role="img"
        aria-label="Each layer keeps its own receipt"
      >
        <title>Each layer keeps its own receipt</title>
        <defs>
          <Arrow id="rs-a" />
        </defs>

        <rect x="20" y="24" width="300" height="122" rx="10" className="fill-ghost" />
        <text x="34" y="44" className={`${MONO} text-s1`}>
          stage
        </text>
        {[
          { y: 66, step: "pull the wording", pkg: "prompt" },
          { y: 92, step: "send it with a schema", pkg: "llms" },
          { y: 118, step: "wrong shape? ask again", pkg: "a second rollout" },
        ].map((r) => (
          <g key={r.step}>
            <text x="34" y={r.y} className={`${LABEL} text-foreground`}>
              {r.step}
            </text>
            <text x="306" y={r.y} textAnchor="end" className={`${MONO} text-faint`}>
              {r.pkg}
            </text>
          </g>
        ))}

        <path
          d="M 330 85 L 400 85"
          className="stroke-line"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#rs-a)"
        />
        <rect x="408" y="62" width="212" height="46" rx="8" className="fill-ghost" />
        <text x="514" y="82" textAnchor="middle" className={`${MONO} text-foreground`}>
          {"{ data, usage, pricing }"}
        </text>
        <text x="514" y="98" textAnchor="middle" className={`${LABEL} text-faint`}>
          the price is in the return value
        </text>

        <rect x="20" y="164" width="300" height="66" rx="10" className="fill-ghost" />
        <text x="34" y="184" className={`${MONO} text-s1`}>
          graph
        </text>
        <text x="34" y="206" className={`${LABEL} text-foreground`}>
          walks nodes, stops to ask a person,
        </text>
        <text x="34" y="221" className={`${LABEL} text-foreground`}>
          resumes at the node that asked
        </text>

        <path
          d="M 330 197 L 400 197"
          className="stroke-line"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#rs-a)"
        />
        <rect x="408" y="174" width="212" height="46" rx="8" className="fill-ghost" />
        <text x="514" y="194" textAnchor="middle" className={`${MONO} text-foreground`}>
          a rollout
        </text>
        <text x="514" y="210" textAnchor="middle" className={`${LABEL} text-faint`}>
          every step, every price
        </text>
      </svg>
    </Fig>
  );
}

/**
 * The two credentials, which the concepts page had as an ASCII block. Drawn
 * because the point is what each one cannot reach, and a gap is easier to see
 * than to read.
 */
export function TwoCredentials() {
  return (
    <Fig caption="An API key never reaches the four on the right. That is deliberate: one of them mints API keys.">
      <svg
        viewBox="0 0 640 196"
        className="w-full"
        role="img"
        aria-label="What each credential reaches"
      >
        <title>What each credential reaches</title>
        <defs>
          <Arrow id="tc-a" />
        </defs>

        {[
          {
            y: 46,
            cred: "sg_…",
            note: "an API key",
            reaches: ["usage", "stats", "events", "prompts", "tools"],
            gate: "read and write, in the one pinned project",
          },
          {
            y: 136,
            cred: "session / sgc_…",
            note: "a signed-in user",
            reaches: ["keys", "projects", "pricing", "credentials"],
            gate: "gated server-side, no API-key path at all",
          },
        ].map((row) => (
          <g key={row.cred}>
            <rect x="20" y={row.y - 20} width="150" height="40" rx="8" className="fill-ghost" />
            <text x="95" y={row.y - 3} textAnchor="middle" className={`${MONO} text-s1`}>
              {row.cred}
            </text>
            <text x="95" y={row.y + 12} textAnchor="middle" className={`${LABEL} text-faint`}>
              {row.note}
            </text>

            <path
              d={`M 178 ${row.y} L 214 ${row.y}`}
              className="stroke-line"
              strokeWidth="1.5"
              fill="none"
              markerEnd="url(#tc-a)"
            />

            {
              row.reaches.reduce<{ x: number; out: React.ReactNode[] }>(
                (acc, name) => {
                  const w = name.length * 6.6 + 18;
                  acc.out.push(
                    <g key={name}>
                      <rect
                        x={acc.x}
                        y={row.y - 15}
                        width={w}
                        height="30"
                        rx="6"
                        className="fill-ghost"
                      />
                      <text
                        x={acc.x + w / 2}
                        y={row.y + 4}
                        textAnchor="middle"
                        className={`${MONO} text-foreground`}
                      >
                        {name}
                      </text>
                    </g>
                  );
                  acc.x += w + 8;
                  return acc;
                },
                { x: 222, out: [] }
              ).out
            }

            <text x="222" y={row.y + 34} className={`${LABEL} text-faint`}>
              {row.gate}
            </text>
          </g>
        ))}
      </svg>
    </Fig>
  );
}

/**
 * The whole stack on one page: what sits on what, and the three that never
 * run in the request.
 *
 * Drawn as a stack rather than a flow because the question it answers is
 * "which of these do I need", and the answer is "everything below the line you
 * stop at". A flow chart would say the order things happen, which is not the
 * thing people get wrong.
 */
export function TheStack() {
  const W = 420;
  const rows = [
    {
      y: 24,
      name: "harness",
      blurb: "the seven shapes, already wired",
      href: "refine · route · chain · parallel · orchestrate · loop · cascade",
    },
    {
      y: 84,
      name: "graph",
      blurb: "nodes and edges you wire yourself",
      href: "when it is not one of the seven",
    },
    {
      y: 144,
      name: "stage",
      blurb: "one prompt, one schema, one priced reply",
      href: "retries a wrong shape, and bills the failed try",
    },
  ];

  const parts = [
    { name: "prompt", blurb: "wording, versioned" },
    { name: "llms", blurb: "one shape back" },
    { name: "tools", blurb: "your code, callable" },
  ];

  const aside = [
    { y: 24, name: "vigil", blurb: "parks a long run" },
    { y: 98, name: "evals", blurb: "scores it after" },
    { y: 172, name: "cli", blurb: "from a terminal" },
  ];

  return (
    <Fig caption="Everything rests on the SDK. Take any layer and you take the ones under it, which is why the SDK alone is a two-minute install.">
      <svg viewBox="0 0 640 316" className="w-full" role="img" aria-label="What sits on what">
        <title>What sits on what</title>
        <defs>
          <Arrow id="tsk-a" />
        </defs>

        {rows.map((row) => (
          <g key={row.name}>
            <rect x="20" y={row.y} width={W} height="48" rx="8" className="fill-ghost" />
            <text x="36" y={row.y + 21} className={`${MONO} text-s1`}>
              {row.name}
            </text>
            <text x="110" y={row.y + 21} className={`${LABEL} text-foreground`}>
              {row.blurb}
            </text>
            <text x="36" y={row.y + 38} className={`${LABEL} text-faint`}>
              {row.href}
            </text>
          </g>
        ))}

        {parts.map((part, i) => {
          const w = (W - 16) / 3;
          const x = 20 + i * (w + 8);
          return (
            <g key={part.name}>
              <rect x={x} y="204" width={w} height="44" rx="8" className="fill-ghost" />
              <text x={x + 12} y="224" className={`${MONO} text-s1`}>
                {part.name}
              </text>
              <text x={x + 12} y="240" className={`${LABEL} text-faint`}>
                {part.blurb}
              </text>
            </g>
          );
        })}

        <rect x="20" y="260" width={W} height="44" rx="8" className="fill-ghost" />
        <text x="36" y="280" className={`${MONO} text-s1`}>
          sdk
        </text>
        <text x="110" y="280" className={`${LABEL} text-foreground`}>
          the only thing that speaks to the app
        </text>
        <text x="36" y="296" className={`${LABEL} text-faint`}>
          every layer above reports its spend through here
        </text>

        <path
          d="M 462 296 L 462 30"
          className="stroke-line"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#tsk-a)"
        />
        <text
          x="450"
          y="164"
          textAnchor="middle"
          transform="rotate(-90 450 164)"
          className={`${LABEL} text-faint`}
        >
          built on
        </text>

        {aside.map((one) => (
          <g key={one.name}>
            <rect
              x="476"
              y={one.y}
              width="152"
              height="52"
              rx="8"
              className="fill-ghost"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            <text x="490" y={one.y + 22} className={`${MONO} text-foreground`}>
              {one.name}
            </text>
            <text x="490" y={one.y + 38} className={`${LABEL} text-faint`}>
              {one.blurb}
            </text>
          </g>
        ))}
        <text x="552" y="244" textAnchor="middle" className={`${LABEL} text-faint`}>
          not in the
        </text>
        <text x="552" y="258" textAnchor="middle" className={`${LABEL} text-faint`}>
          request path
        </text>
      </svg>
    </Fig>
  );
}
