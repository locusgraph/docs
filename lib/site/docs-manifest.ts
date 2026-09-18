import type { DocModule } from "./docs-types";
import type { Product } from "./products";

/**
 * Every doc this host serves, and how to load it.
 *
 * The specifiers are literal because a bundler cannot follow an import built
 * from a variable, which is the whole reason this list exists rather than a
 * directory read at request time. Keyed by product first: two sections are free
 * to both ship an `overview`, and the route resolves one before the other.
 *
 * The spendgraph pages load from the published packages, so a doc is written
 * once — beside the code it documents — and this host renders whichever version
 * is installed.
 */
export const DOCS: Record<Product, Record<string, () => Promise<DocModule>>> = {
  locusgraph: {
    concepts: () => import("@/content/locusgraph/concepts.mdx"),
    "getting-started": () => import("@/content/locusgraph/getting-started.mdx"),
    overview: () => import("@/content/locusgraph/overview.mdx"),
  },
  spendgraph: {
    concepts: () => import("@/content/spendgraph/concepts.mdx"),
    "getting-started": () => import("@/content/spendgraph/getting-started.mdx"),
    overview: () => import("@/content/spendgraph/overview.mdx"),
    "cli/commands": () => import("@spendgraph/cli/docs/commands.mdx"),
    "cli/credentials": () => import("@spendgraph/cli/docs/credentials.mdx"),
    "cli/output": () => import("@spendgraph/cli/docs/output.mdx"),
    "cli/overview": () => import("@spendgraph/cli/docs/overview.mdx"),
    "cli/skills": () => import("@spendgraph/cli/docs/skills.mdx"),
    "evals/comparing-runs": () => import("@spendgraph/evals/docs/comparing-runs.mdx"),
    "evals/datasets": () => import("@spendgraph/evals/docs/datasets.mdx"),
    "evals/getting-started": () => import("@spendgraph/evals/docs/getting-started.mdx"),
    "evals/judge": () => import("@spendgraph/evals/docs/judge.mdx"),
    "evals/metrics": () => import("@spendgraph/evals/docs/metrics.mdx"),
    "evals/metrics/criteria": () => import("@spendgraph/evals/docs/metrics/criteria.mdx"),
    "evals/metrics/custom": () => import("@spendgraph/evals/docs/metrics/custom.mdx"),
    "evals/metrics/deterministic": () => import("@spendgraph/evals/docs/metrics/deterministic.mdx"),
    "evals/metrics/retrieval": () => import("@spendgraph/evals/docs/metrics/retrieval.mdx"),
    "graph/nodes": () => import("@spendgraph/graph/docs/nodes.mdx"),
    "graph/overview": () => import("@spendgraph/graph/docs/overview.mdx"),
    "graph/pausing": () => import("@spendgraph/graph/docs/pausing.mdx"),
    "graph/running": () => import("@spendgraph/graph/docs/running.mdx"),
    "graph/streaming": () => import("@spendgraph/graph/docs/streaming.mdx"),
    "graph/wiring": () => import("@spendgraph/graph/docs/wiring.mdx"),
    "harness/cascade": () => import("@spendgraph/harness/docs/cascade.mdx"),
    "harness/chain": () => import("@spendgraph/harness/docs/chain.mdx"),
    "harness/choosing": () => import("@spendgraph/harness/docs/choosing.mdx"),
    "harness/human-in-the-loop": () => import("@spendgraph/harness/docs/human-in-the-loop.mdx"),
    "harness/loop": () => import("@spendgraph/harness/docs/loop.mdx"),
    "harness/orchestrate": () => import("@spendgraph/harness/docs/orchestrate.mdx"),
    "harness/overview": () => import("@spendgraph/harness/docs/overview.mdx"),
    "harness/parallel": () => import("@spendgraph/harness/docs/parallel.mdx"),
    "harness/refine": () => import("@spendgraph/harness/docs/refine.mdx"),
    "harness/route": () => import("@spendgraph/harness/docs/route.mdx"),
    "harness/streaming": () => import("@spendgraph/harness/docs/streaming.mdx"),
    "llms/calling": () => import("@spendgraph/llms/docs/calling.mdx"),
    "llms/overview": () => import("@spendgraph/llms/docs/overview.mdx"),
    "llms/providers": () => import("@spendgraph/llms/docs/providers.mdx"),
    "llms/streaming": () => import("@spendgraph/llms/docs/streaming.mdx"),
    "llms/structured-output": () => import("@spendgraph/llms/docs/structured-output.mdx"),
    "llms/tools": () => import("@spendgraph/llms/docs/tools.mdx"),
    "prompt/caching": () => import("@spendgraph/prompt/docs/caching.mdx"),
    "prompt/calling": () => import("@spendgraph/prompt/docs/calling.mdx"),
    "prompt/datasets": () => import("@spendgraph/prompt/docs/datasets.mdx"),
    "prompt/fields": () => import("@spendgraph/prompt/docs/fields.mdx"),
    "prompt/overview": () => import("@spendgraph/prompt/docs/overview.mdx"),
    "prompt/running": () => import("@spendgraph/prompt/docs/running.mdx"),
    "sdk/api": () => import("@/content/spendgraph/sdk/api.mdx"),
    "sdk/budgets": () => import("@/content/spendgraph/sdk/budgets.mdx"),
    "sdk/integrations": () => import("@/content/spendgraph/sdk/integrations.mdx"),
    "sdk/quickstart": () => import("@/content/spendgraph/sdk/quickstart.mdx"),
    "sdk/client": () => import("@spendgraph/sdk/docs/client.mdx"),
    "sdk/errors": () => import("@spendgraph/sdk/docs/errors.mdx"),
    "sdk/tracking": () => import("@spendgraph/sdk/docs/tracking.mdx"),
    "stage/cost": () => import("@spendgraph/stage/docs/cost.mdx"),
    "stage/events": () => import("@spendgraph/stage/docs/events.mdx"),
    "stage/overview": () => import("@spendgraph/stage/docs/overview.mdx"),
    "stage/retrying": () => import("@spendgraph/stage/docs/retrying.mdx"),
    "stage/running": () => import("@spendgraph/stage/docs/running.mdx"),
    "tools/bogus": () => import("@spendgraph/tools/docs/bogus.mdx"),
    "tools/builtins": () => import("@spendgraph/tools/docs/builtins.mdx"),
    "tools/bus": () => import("@spendgraph/tools/docs/bus.mdx"),
    "tools/declaring": () => import("@spendgraph/tools/docs/declaring.mdx"),
    "tools/effects": () => import("@spendgraph/tools/docs/effects.mdx"),
    "tools/overview": () => import("@spendgraph/tools/docs/overview.mdx"),
    "tools/selecting": () => import("@spendgraph/tools/docs/selecting.mdx"),
    "tools/stored": () => import("@spendgraph/tools/docs/stored.mdx"),
    "tools/turns": () => import("@spendgraph/tools/docs/turns.mdx"),
    "vigil/agents": () => import("@spendgraph/vigil/docs/agents.mdx"),
    "vigil/failures": () => import("@spendgraph/vigil/docs/failures.mdx"),
    "vigil/getting-started": () => import("@spendgraph/vigil/docs/getting-started.mdx"),
    "vigil/hosts": () => import("@spendgraph/vigil/docs/hosts.mdx"),
    "vigil/testing": () => import("@spendgraph/vigil/docs/testing.mdx"),
    "vigil/workflows": () => import("@spendgraph/vigil/docs/workflows.mdx"),
  },
  brainstorm: {},
  "locus-skill": {},
};
