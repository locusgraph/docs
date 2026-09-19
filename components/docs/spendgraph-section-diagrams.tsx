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
