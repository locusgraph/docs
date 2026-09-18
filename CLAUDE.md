# spendgraph

Next.js 16 on Cloudflare Workers (OpenNext) with a D1 database. One app, four
surfaces: landing page, public docs, the dashboard, and `/api/v1`.

## This is not the Next.js you know

Version 16 has breaking changes — APIs, conventions and file structure may all
differ from what you remember. Read the relevant guide in
`node_modules/next/dist/docs/` before writing code, and heed deprecations.

## Money

Every cost is an integer in micro-USD (µ$1 = $0.000001). Never floats, so sums
stay exact. SQLite has no decimal type; temperature is stored ×100 for the same
reason.

## D1 and SQLite limits

No regex. No `ALTER` of a foreign key or constraint. 100 bound parameters per
statement (`D1_MAX_BOUND_PARAMS`). `db.batch()` is the only transaction — use it
whenever two writes must land together.

## Comments

Don't write them. A comment explaining what code does is a sign the code needs
a better name, a smaller function, or a named constant — write that instead.

The one exception is TSDoc on an exported symbol, saying what it is for a
caller who will never read the body. Keep it to a line or two. No inline `//`
notes, no rationale essays, no history, no restating the next line.

Examples carry no comments at all; anything worth saying goes in a README
beside them.

## Explaining

Answer with a diagram where one fits. ASCII, fenced, showing what moves between
what — the mechanism, not a picture of the sentence. Then the fewest words that
make it read.

Prose is the fallback, not the default. A paragraph that could have been four
boxes and an arrow is a paragraph nobody finishes.

## Commands

```sh
pnpm install                # pnpm, not npm — handbook/BUILDING.md
pnpm run dev                # local, with the D1 binding
pnpm run verify             # static, types, scenarios, and all three suites
pnpm run check              # biome — lint, format and import order
pnpm run typecheck          # tsc --noEmit, the app only
pnpm run packages:typecheck # and their tests — handbook/VERIFYING.md
pnpm run bdd                # cucumber, the app's behaviour contracts
pnpm run packages:bdd       # each package's own, beside its source
pnpm test                   # vitest, root
pnpm run test:runner        # runner/tests, after building
pnpm run packages:test      # the packages, whose tests sit beside their source
pnpm run mutate             # stryker, over lib/spend and lib/pricing
pnpm run lint:biome         # biome lint alone, without the formatter
pnpm run fix                # biome, safe autofixes + import order
pnpm run format             # biome formatter, writes
pnpm run db:migrate:local   # local D1, the app's — handbook/DATABASE.md
pnpm run db:migrate:remote  # production — before deploying, never after
pnpm run deploy             # opennext build + wrangler deploy
```

## The rest

Each of these is one subject, read when you are on it. None of them repeat what
is above.

| | |
| --- | --- |
| [PACKAGES.md](handbook/PACKAGES.md) | what each package is for, and the boundary the published ones keep |
| [DATABASE.md](handbook/DATABASE.md) | migrations, and the two databases behind one script name |
| [VERIFYING.md](handbook/VERIFYING.md) | what green means, and what it does not |
| [GIT.md](handbook/GIT.md) | commit messages, and the hooks that check them |
| [BUILDING.md](handbook/BUILDING.md) | pnpm, and why a fresh tree cannot deploy the worker |
| [PUBLISH.md](handbook/PUBLISH.md) | putting the packages on npm, which is not a one-liner |
| [SEO.md](handbook/SEO.md) | what this site owes the crawlers, and what is out of scope |

`.claude/skills/ts-correctness-gate` is the protocol for changing code here:
contract first, cheap gates before expensive reasoning, every bug pinned as a
check. handbook/VERIFYING.md is the short version.
