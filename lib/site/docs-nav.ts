import type { Product } from "./products";

export interface DocsLink {
  title: string;
  href: string;
  /** One line, shown on the section index and nowhere else. */
  blurb?: string;
}

export interface DocsSection {
  title: string;
  items: DocsLink[];
}

export interface DocsTree {
  title: string;
  href: string;
  blurb: string;
  sections: DocsSection[];
}

const LOCUSGRAPH: DocsTree = {
  title: "LocusGraph",
  href: "/locusgraph/overview",
  blurb: "The graph the products are built on.",
  sections: [
    {
      title: "Start here",
      items: [
        {
          title: "Overview",
          href: "/locusgraph/overview",
          blurb: "What LocusGraph is, and how these docs are laid out",
        },
        {
          title: "Getting started",
          href: "/locusgraph/getting-started",
          blurb: "Where to begin, depending on why you are here",
        },
      ],
    },
    {
      title: "Reference",
      items: [
        {
          title: "Concepts",
          href: "/locusgraph/concepts",
          blurb: "The vocabulary the rest of the docs assumes",
        },
      ],
    },
  ],
};

/**
 * The pages that describe spendgraph itself rather than one package.
 *
 * Its title is empty on purpose: the sidebar already names the section in its
 * header, so a group label reading "Spendgraph" directly beneath it says the
 * same word twice.
 */
const SPENDGRAPH: DocsTree = {
  title: "",
  href: "/spendgraph/overview",
  blurb: "Ten packages on one foundation, and which of them you need.",
  sections: [
    {
      title: "Start here",
      items: [
        {
          title: "Overview",
          href: "/spendgraph/overview",
          blurb: "The ten packages, and how they compose",
        },
        {
          title: "Getting started",
          href: "/spendgraph/getting-started",
          blurb: "Which package to reach for, by what you are doing",
        },
        {
          title: "Concepts",
          href: "/spendgraph/concepts",
          blurb: "The vocabulary the packages share",
        },
      ],
    },
  ],
};

const SDK: DocsTree = {
  title: "SDK",
  href: "/spendgraph/sdk/quickstart",
  blurb: "Report what your app spends on models, and read it back.",
  sections: [
    {
      title: "Start here",
      items: [
        {
          title: "Quickstart",
          href: "/spendgraph/sdk/quickstart",
          blurb: "Two minutes to your first tracked call",
        },
        { title: "Tracking", href: "/spendgraph/sdk/tracking", blurb: "wrap, track and flush" },
      ],
    },
    {
      title: "The API",
      items: [
        {
          title: "The client",
          href: "/spendgraph/sdk/client",
          blurb: "Spendgraph, and the two halves it reaches",
        },
        {
          title: "Errors and retries",
          href: "/spendgraph/sdk/errors",
          blurb: "What throws, what retries, what never will",
        },
        {
          title: "HTTP API",
          href: "/spendgraph/sdk/api",
          blurb: "Ingest, stats, events, CSV export",
        },
      ],
    },
    {
      title: "Wiring it in",
      items: [
        {
          title: "Integrations",
          href: "/spendgraph/sdk/integrations",
          blurb: "LangChain, LangGraph, Vercel AI",
        },
      ],
    },
    {
      title: "Operating it",
      items: [
        {
          title: "Budgets and alerts",
          href: "/spendgraph/sdk/budgets",
          blurb: "Thresholds, webhooks, what never happens",
        },
      ],
    },
  ],
};

const EVALS: DocsTree = {
  title: "Evals",
  href: "/spendgraph/evals/getting-started",
  blurb: "Score model output, and tell a real change from noise.",
  sections: [
    {
      title: "Start here",
      items: [
        {
          title: "Getting started",
          href: "/spendgraph/evals/getting-started",
          blurb: "One number in five minutes",
        },
        {
          title: "Datasets",
          href: "/spendgraph/evals/datasets",
          blurb: "Where cases come from, and splits",
        },
      ],
    },
    {
      title: "Metrics",
      items: [
        {
          title: "Choosing one",
          href: "/spendgraph/evals/metrics",
          blurb: "What do you want to check?",
        },
        {
          title: "Deterministic",
          href: "/spendgraph/evals/metrics/deterministic",
          blurb: "Free, instant, no judge",
        },
        {
          title: "You write the criteria",
          href: "/spendgraph/evals/metrics/criteria",
          blurb: "checklist, rubric, geval",
        },
        {
          title: "Retrieval",
          href: "/spendgraph/evals/metrics/retrieval",
          blurb: "RAG: grounded, and complete",
        },
        {
          title: "Writing a metric",
          href: "/spendgraph/evals/metrics/custom",
          blurb: "defineMetric, the registry, and skipping",
        },
      ],
    },
    {
      title: "Going further",
      items: [
        {
          title: "The judge",
          href: "/spendgraph/evals/judge",
          blurb: "Wiring a model, cost, trusting it",
        },
        {
          title: "Comparing runs",
          href: "/spendgraph/evals/comparing-runs",
          blurb: "Did the change help? CI gates",
        },
      ],
    },
  ],
};

const HARNESS: DocsTree = {
  title: "Harness",
  href: "/spendgraph/harness/overview",
  blurb: "The seven shapes an LLM app takes, with the pricing already attached.",
  sections: [
    {
      title: "Start here",
      items: [
        {
          title: "Overview",
          href: "/spendgraph/harness/overview",
          blurb: "What a workflow is, and what they all owe you",
        },
        {
          title: "Choosing one",
          href: "/spendgraph/harness/choosing",
          blurb: "Seven shapes, and which fits",
        },
      ],
    },
    {
      title: "The workflows",
      items: [
        { title: "refine", href: "/spendgraph/harness/refine", blurb: "Draft, judge, revise" },
        { title: "route", href: "/spendgraph/harness/route", blurb: "Classify, then dispatch" },
        {
          title: "chain",
          href: "/spendgraph/harness/chain",
          blurb: "Steps in sequence, with gates",
        },
        {
          title: "parallel",
          href: "/spendgraph/harness/parallel",
          blurb: "Sectioning, and voting",
        },
        {
          title: "orchestrate",
          href: "/spendgraph/harness/orchestrate",
          blurb: "A lead decomposes and delegates",
        },
        { title: "loop", href: "/spendgraph/harness/loop", blurb: "Tools until it stops asking" },
        {
          title: "cascade",
          href: "/spendgraph/harness/cascade",
          blurb: "Cheap first, escalate on rejection",
        },
      ],
    },
    {
      title: "Going further",
      items: [
        {
          title: "Human in the loop",
          href: "/spendgraph/harness/human-in-the-loop",
          blurb: "Pause for a person, resume days later",
        },
        {
          title: "Streaming a run",
          href: "/spendgraph/harness/streaming",
          blurb: "Tokens as they arrive",
        },
      ],
    },
  ],
};

const GRAPH: DocsTree = {
  title: "Graph",
  href: "/spendgraph/graph/overview",
  blurb: "Wire nodes into a graph, run it, and get a rollout with every step priced.",
  sections: [
    {
      title: "Start here",
      items: [
        {
          title: "Overview",
          href: "/spendgraph/graph/overview",
          blurb: "Four exports, and the whole thing in one example",
        },
        {
          title: "Nodes",
          href: "/spendgraph/graph/nodes",
          blurb: "One unit of work, typed from its args",
        },
      ],
    },
    {
      title: "Building one",
      items: [
        {
          title: "Wiring",
          href: "/spendgraph/graph/wiring",
          blurb: "Edges, branching, and what compilation refuses",
        },
        {
          title: "Running a graph",
          href: "/spendgraph/graph/running",
          blurb: "Failure, the step ceiling, what comes back",
        },
        {
          title: "Streaming",
          href: "/spendgraph/graph/streaming",
          blurb: "The same run, narrated",
        },
        {
          title: "Pausing",
          href: "/spendgraph/graph/pausing",
          blurb: "Stopping to ask a person, and picking it back up",
        },
      ],
    },
  ],
};

const LLMS: DocsTree = {
  title: "LLMs",
  href: "/spendgraph/llms/overview",
  blurb: "Call any provider, get one shape back, and record what it consumed.",
  sections: [
    {
      title: "Start here",
      items: [
        {
          title: "Overview",
          href: "/spendgraph/llms/overview",
          blurb: "One call, and what is recorded",
        },
        {
          title: "Making a call",
          href: "/spendgraph/llms/calling",
          blurb: "Options, fallbacks, paying for headroom",
        },
      ],
    },
    {
      title: "Going further",
      items: [
        {
          title: "Streaming",
          href: "/spendgraph/llms/streaming",
          blurb: "When usage arrives, and a broken stream",
        },
        { title: "Tools", href: "/spendgraph/llms/tools", blurb: "The loop, and a truncated call" },
        {
          title: "Structured output",
          href: "/spendgraph/llms/structured-output",
          blurb: "One schema, three providers",
        },
        {
          title: "Providers",
          href: "/spendgraph/llms/providers",
          blurb: "Six shapes, and reading a reply yourself",
        },
      ],
    },
  ],
};

const PROMPT: DocsTree = {
  title: "Prompts",
  href: "/spendgraph/prompt/overview",
  blurb: "Pull a stored prompt or write one in code, render it, and record what it cost.",
  sections: [
    {
      title: "Start here",
      items: [
        {
          title: "Overview",
          href: "/spendgraph/prompt/overview",
          blurb: "Two ways in, one prompt",
        },
        {
          title: "Fields",
          href: "/spendgraph/prompt/fields",
          blurb: "Placeholders, types, and history",
        },
      ],
    },
    {
      title: "Running one",
      items: [
        {
          title: "Calling a prompt",
          href: "/spendgraph/prompt/calling",
          blurb: "call, bind, tools, and what is recorded",
        },
        {
          title: "Caching",
          href: "/spendgraph/prompt/caching",
          blurb: "Stale-while-refresh, and both handles",
        },
        {
          title: "Running server-side",
          href: "/spendgraph/prompt/running",
          blurb: "run, sample, runAll, and the ceiling",
        },
        {
          title: "Versions and datasets",
          href: "/spendgraph/prompt/datasets",
          blurb: "The split the server decides, and why",
        },
      ],
    },
  ],
};

const TOOLS: DocsTree = {
  title: "Tools",
  href: "/spendgraph/tools/overview",
  blurb: "Declare a tool once, offer the right few, and record what was called.",
  sections: [
    {
      title: "Start here",
      items: [
        {
          title: "Overview",
          href: "/spendgraph/tools/overview",
          blurb: "A tool, a bus, and a turn",
        },
        {
          title: "Declaring a tool",
          href: "/spendgraph/tools/declaring",
          blurb: "Args, as const, and what is checked at import",
        },
        {
          title: "A stored tool",
          href: "/spendgraph/tools/stored",
          blurb: "Wording in the dashboard, handler in code",
        },
        {
          title: "Effects",
          href: "/spendgraph/tools/effects",
          blurb: "What running one does to the world outside",
        },
      ],
    },
    {
      title: "Using them",
      items: [
        {
          title: "The bus",
          href: "/spendgraph/tools/bus",
          blurb: "Holds, picks, converts, runs \u2014 and nests",
        },
        {
          title: "Selecting",
          href: "/spendgraph/tools/selecting",
          blurb: "The shortlist, and why it is a shortlist",
        },
        {
          title: "A turn",
          href: "/spendgraph/tools/turns",
          blurb: "Offered, called, and what the rollout keeps",
        },
        {
          title: "Builtins",
          href: "/spendgraph/tools/builtins",
          blurb: "Twelve factories, none registered for you",
        },
        {
          title: "Bogus tools",
          href: "/spendgraph/tools/bogus",
          blurb: "Twelve mocks for testing the pipeline, not the provider",
        },
      ],
    },
  ],
};

const STAGE: DocsTree = {
  title: "Stage",
  href: "/spendgraph/stage/overview",
  blurb: "One prompt, one schema, one priced reply — including the tries that failed.",
  sections: [
    {
      title: "Start here",
      items: [
        {
          title: "Overview",
          href: "/spendgraph/stage/overview",
          blurb: "The join between prompt and llms",
        },
        {
          title: "Running a stage",
          href: "/spendgraph/stage/running",
          blurb: "Stored wording, or wording in your repo",
        },
      ],
    },
    {
      title: "Getting an object back",
      items: [
        {
          title: "Retrying",
          href: "/spendgraph/stage/retrying",
          blurb: "Why a failed try is a row on the bill",
        },
      ],
    },
    {
      title: "What it cost",
      items: [
        {
          title: "Cost and usage",
          href: "/spendgraph/stage/cost",
          blurb: "Six token counts, and a price that arrives late",
        },
        {
          title: "Events",
          href: "/spendgraph/stage/events",
          blurb: "started, finished and every failed attempt",
        },
      ],
    },
  ],
};

const CLI: DocsTree = {
  title: "CLI",
  href: "/spendgraph/cli/overview",
  blurb: "Drive the dashboard from a terminal: prompts, tools, keys and spend.",
  sections: [
    {
      title: "Start here",
      items: [
        {
          title: "Overview",
          href: "/spendgraph/cli/overview",
          blurb: "Install, sign in, and the shape",
        },
        {
          title: "Credentials",
          href: "/spendgraph/cli/credentials",
          blurb: "sg login, the layers, and no API key",
        },
      ],
    },
    {
      title: "Using it",
      items: [
        {
          title: "Commands",
          href: "/spendgraph/cli/commands",
          blurb: "Flags, --file, and the groups",
        },
        {
          title: "Output and exit codes",
          href: "/spendgraph/cli/output",
          blurb: "Tables, --json, and 1 against 2",
        },
        {
          title: "Skills for an agent",
          href: "/spendgraph/cli/skills",
          blurb: "The manual, generated from the commands",
        },
      ],
    },
  ],
};

const VIGIL: DocsTree = {
  title: "Vigil",
  href: "/spendgraph/vigil/getting-started",
  blurb: "Call an agent that takes hours without holding a process open for it.",
  sections: [
    {
      title: "Start here",
      items: [
        {
          title: "Getting started",
          href: "/spendgraph/vigil/getting-started",
          blurb: "Park a run, exit, pick it back up",
        },
      ],
    },
    {
      title: "Building it",
      items: [
        {
          title: "Writing an agent",
          href: "/spendgraph/vigil/agents",
          blurb: "The contract, and the field that costs money",
        },
        {
          title: "Into a workflow",
          href: "/spendgraph/vigil/workflows",
          blurb: "A chain gate, a graph node, a loop hook",
        },
      ],
    },
    {
      title: "Running it",
      items: [
        {
          title: "Where it runs",
          href: "/spendgraph/vigil/hosts",
          blurb: "Alarms, crons, timers and queues",
        },
        {
          title: "When it goes wrong",
          href: "/spendgraph/vigil/failures",
          blurb: "Cancels, deadlines, giving up, crashes",
        },
      ],
    },
    {
      title: "Proving it",
      items: [
        {
          title: "Testing",
          href: "/spendgraph/vigil/testing",
          blurb: "A fake agent, and sixteen rules for yours",
        },
      ],
    },
  ],
};

const SPENDGRAPH_TREES: DocsTree[] = [
  SPENDGRAPH,
  SDK,
  PROMPT,
  LLMS,
  STAGE,
  TOOLS,
  GRAPH,
  HARNESS,
  VIGIL,
  EVALS,
  CLI,
];

/**
 * The sidebar, per section.
 *
 * Keyed by product because the docs host is shared: a reader inside
 * `/spendgraph` should not be offered BrainStorm's chapters, and two products
 * are free to both have an `overview`. Order here is reading order, which is
 * also what the previous/next footer links walk.
 */
export const NAV: Record<Product, DocsTree[]> = {
  locusgraph: [LOCUSGRAPH],
  spendgraph: SPENDGRAPH_TREES,
  brainstorm: [],
  "locus-skill": [],
};

/** The product a docs path belongs to. First segment, always. */
export function productOf(pathname: string): string {
  return pathname.split("/")[1] ?? "";
}

/** Every page in a tree, in reading order, with its sections collapsed away. */
export function pagesOf(tree: DocsTree): DocsLink[] {
  return tree.sections.flatMap((section) => section.items);
}

/** Every tree a section shows in its sidebar. */
export function treesFor(product: string): DocsTree[] {
  return NAV[product as Product] ?? [];
}

/** The tree a path belongs to, for picking which sidebar group is open. */
const baseOf = (tree: DocsTree): string => tree.href.split("/").slice(0, 3).join("/");

export function treeFor(pathname: string): DocsTree | undefined {
  return treesFor(productOf(pathname)).find(
    (tree) => pathname === baseOf(tree) || pathname.startsWith(`${baseOf(tree)}/`)
  );
}

/**
 * The pages either side of this one, for the footer links.
 *
 * Reading order is the sidebar's order, which is the only order a reader has
 * any reason to expect. Stops at the edge of a tree rather than running from
 * the last SDK page into the first evals one.
 */
export function neighbours(pathname: string): { prev?: DocsLink; next?: DocsLink } {
  const tree = treeFor(pathname);
  if (!tree) return {};
  const all = pagesOf(tree);
  const at = all.findIndex((item) => item.href === pathname);
  if (at === -1) return {};
  return { prev: all[at - 1], next: all[at + 1] };
}
