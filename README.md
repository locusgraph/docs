<p align="center">
  <img src="./public/banner.svg" alt="spendgraph — know what every token costs" width="100%">
</p>

<p align="center">
  <a href="https://spendgraph.locusgraph.com/docs"><strong>Docs</strong></a> ·
  <a href="https://spendgraph.locusgraph.com/docs/sdk/quickstart">Quickstart</a> ·
  <a href="https://www.npmjs.com/org/spendgraph">npm</a>
</p>

---

Report the tokens an LLM call consumed and spendgraph prices them, stores the
cost in integer micro-USD, and shows you where the money went. Counts only —
no prompt or response text leaves your app.

Above that sit eight more packages for building the app that spends the money:
prompts, model calls, tools, graphs, workflows and evals, each usable on its
own.

```ts
import Anthropic from "@anthropic-ai/sdk";
import { SpendGraph } from "@spendgraph/sdk";

const meter = new SpendGraph({ apiKey: process.env.SPENDGRAPH_API_KEY, baseUrl });
const anthropic = meter.wrap(new Anthropic());
```

That is the whole integration. Usage is read off each reply and reported for
you; spend appears on the dashboard within seconds.

## Docs

| | |
| --- | --- |
| [SDK](https://spendgraph.locusgraph.com/docs/sdk/quickstart) | Report what your app spends on models, and read it back |
| [Prompts](https://spendgraph.locusgraph.com/docs/prompt/overview) | Pull a stored prompt or write one in code, and record what it cost |
| [LLMs](https://spendgraph.locusgraph.com/docs/llms/overview) | Call any provider, get one shape back |
| [Tools](https://spendgraph.locusgraph.com/docs/tools/overview) | Declare a tool once, offer the right few |
| [Graph](https://spendgraph.locusgraph.com/docs/graph/overview) | Wire nodes into a graph, run it, get a rollout |
| [Harness](https://spendgraph.locusgraph.com/docs/harness/overview) | The seven shapes an LLM app takes |
| [Evals](https://spendgraph.locusgraph.com/docs/evals/getting-started) | Score model output, and tell a real change from noise |
| [CLI](https://spendgraph.locusgraph.com/docs/cli/overview) | Drive the dashboard from a terminal |

## Packages

| | |
| --- | --- |
| [`@spendgraph/sdk`](./packages/sdk) | the API, and the wire types the others share |
| [`@spendgraph/prompt`](./packages/prompt) | stored and custom prompts, rendering, rollouts |
| [`@spendgraph/llms`](./packages/llms) | reading a provider reply, driving a provider client |
| [`@spendgraph/tools`](./packages/tools) | declaring tools, selecting a shortlist, recording a turn |
| [`@spendgraph/graph`](./packages/graph) | nodes, edges, and a run that comes back as a rollout |
| [`@spendgraph/harness`](./packages/harness) | the seven workflows, and `streamed()` to watch one run |
| [`@spendgraph/stage`](./packages/stage) | one prompt, one schema, one priced reply |
| [`@spendgraph/evals`](./packages/evals) | scoring rollouts |
| [`@spendgraph/vigil`](./packages/vigil) | parking a run on an agent that takes hours, and resuming it |
| [`@spendgraph/workflows`](./packages/workflows) | ready-made workflows assembled from the rest |
| [`@spendgraph/cli`](./packages/cli) | `sg`, driving the dashboard from a terminal |

## How the money works

Every cost is an **integer in micro-USD** (µ$1 = $0.000001), so sums stay exact
and no float ever rounds a bill.

Events are priced at ingest from a catalogue that syncs daily from
[LiteLLM's community pricing file](https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json)
— thousands of models across 100+ providers. A price you set by hand always
wins over the sync. Cache reads and writes bill at their own rates, and a model
with no published cache rate bills them at its input rate rather than at zero.

A model spendgraph has never seen is stored at $0 and flagged, never dropped.

## Local development

```sh
npm install
npm run db:migrate:local
npm run dev
```

Sign-in needs a GitHub OAuth app — set `AUTH_GITHUB_ID` and
`AUTH_GITHUB_SECRET` in `.env.local` with callback
`http://localhost:3000/api/auth/callback/github`.

```sh
npm test          # vitest
npm run lint:biome # biome, must be clean
npm run fix       # biome, safe autofixes and import order
```

## Layout

```
app/            landing, /docs, the dashboard, /api/v1
lib/            db, cost engine, pricing sync, auth
drizzle/        schema and migrations
packages/       the nine published packages
tests/          the root suite, grouped by what it exercises
cloudflare/     a folder per worker — the app's entrypoint, and both wrangler configs
```

One Next.js app on a single Cloudflare Worker with a D1 database, serving four
surfaces: the landing page, public docs, the dashboard, and the REST API.

## License

Apache-2.0. Built by [Effortless Labs](https://www.effortlesslabs.xyz).
