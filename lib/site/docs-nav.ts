import { ENDPOINTS } from "../api/endpoints";
import type { Product } from "./products";

/**
 * One way in, not thirty-seven.
 *
 * The API reference has a sidebar of its own, so listing every endpoint here
 * too would bury the guides under the thing a reader reaches for second. This
 * is the door; `components/api/api-sidebar.tsx` is what is behind it.
 */
const API_NAV_ITEMS: DocsLink[] = [
  {
    title: "API reference",
    href: `/locusgraph/api/${ENDPOINTS[0].slug}`,
    blurb: "Every endpoint a key reaches, with a playground on each one.",
  },
];

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

/**
 * LocusGraph's own pages, above the groups.
 *
 * Untitled on purpose: the sidebar header already names the section, so a group
 * label reading "LocusGraph" directly beneath it says the same word twice.
 */
const LOCUSGRAPH: DocsTree = {
  title: "",
  href: "/locusgraph/overview",
  blurb: "A memory that lasts, for the things your app learns.",
  sections: [
    {
      title: "Start here",
      items: [
        {
          title: "Overview",
          href: "/locusgraph/overview",
          blurb: "What LocusGraph stores, and what it gives back",
        },
        {
          title: "Quickstart",
          href: "/locusgraph/quickstart",
          blurb: "Store a memory and search it back, in ten lines",
        },
        {
          title: "Concepts",
          href: "/locusgraph/concepts",
          blurb: "Graphs, contexts, memories and event kinds",
        },
      ],
    },
  ],
};

/**
 * What people actually build with it.
 *
 * Placed before the reference because a reader deciding whether this fits their
 * problem should not have to learn the API first to find out. Each page is a
 * wiring guide — which calls, in what order, and what to name things — and
 * links into the reference for the detail.
 */
const LG_USE_CASES: DocsTree = {
  title: "Use cases",
  href: "/locusgraph/use-cases/preferences",
  blurb: "Wiring guides for the shapes this gets used in most.",
  sections: [
    {
      title: "Remembering people",
      items: [
        {
          title: "User preferences",
          href: "/locusgraph/use-cases/preferences",
          blurb: "What someone likes, surviving the end of the session",
        },
        {
          title: "Conversation history",
          href: "/locusgraph/use-cases/conversations",
          blurb: "Carrying what was said into the next conversation",
        },
      ],
    },
    {
      title: "Remembering work",
      items: [
        {
          title: "Agent skills",
          href: "/locusgraph/use-cases/agent-skills",
          blurb: "What worked, what failed, and what not to try again",
        },
        {
          title: "Team knowledge",
          href: "/locusgraph/use-cases/team-knowledge",
          blurb: "A shared graph, with a human deciding what is kept",
        },
        {
          title: "Documents",
          href: "/locusgraph/use-cases/documents",
          blurb: "Ingesting a file, and recalling from it later",
        },
      ],
    },
    {
      title: "Shape of your app",
      items: [
        {
          title: "Multi-tenant",
          href: "/locusgraph/use-cases/multi-tenant",
          blurb: "One graph per customer, and where the boundary sits",
        },
      ],
    },
  ],
};

/**
 * The groups below are the interface, and only the interface.
 *
 * Each page answers three questions and stops: what you send, what comes back,
 * and what can go wrong. How a result was ranked, what a finding was judged
 * against, when a memory decays — none of that is a caller's business, and all
 * of it is the product. The engine's own README documents the mechanisms; this
 * host documents the contract.
 */
const LG_CLIENT: DocsTree = {
  title: "Client",
  href: "/locusgraph/client/install",
  blurb: "Installing the SDK, connecting it, and what it throws.",
  sections: [
    {
      title: "Setting up",
      items: [
        {
          title: "Install",
          href: "/locusgraph/client/install",
          blurb: "@locusgraph/client, and your first call",
        },
        {
          title: "Connecting",
          href: "/locusgraph/client/connecting",
          blurb: "Server URL, agent secret, and the graph you pin to",
        },
      ],
    },
    {
      title: "Reference",
      items: [
        {
          title: "Errors",
          href: "/locusgraph/client/errors",
          blurb: "What throws, what retries, and what never will",
        },
        {
          title: "Types",
          href: "/locusgraph/client/types",
          blurb: "Every shape the client exports",
        },
        {
          title: "Limits",
          href: "/locusgraph/client/limits",
          blurb: "Payload caps, batch ceilings and rate limits, in one place",
        },
        {
          title: "Versioning",
          href: "/locusgraph/client/versioning",
          blurb: "What moves, what stays, and what to pin",
        },
      ],
    },
  ],
};

const LG_REMEMBER: DocsTree = {
  title: "Remember",
  href: "/locusgraph/remember/store",
  blurb: "Writing what your app learns, one event or a thousand.",
  sections: [
    {
      title: "Writing",
      items: [
        {
          title: "Store an event",
          href: "/locusgraph/remember/store",
          blurb: "One call, and what it needs from you",
        },
        {
          title: "Event kinds",
          href: "/locusgraph/remember/event-kinds",
          blurb: "The kinds you can send, and what each one means",
        },
        {
          title: "Sources",
          href: "/locusgraph/remember/sources",
          blurb: "Where a memory came from, and how far it is trusted",
        },
      ],
    },
    {
      title: "Writing more at once",
      items: [
        {
          title: "Batch and transactions",
          href: "/locusgraph/remember/batch",
          blurb: "Many events per call, and the one that is all-or-nothing",
        },
        {
          title: "Deleting",
          href: "/locusgraph/remember/deleting",
          blurb: "Removing a memory, a context, or everything hanging off one",
        },
      ],
    },
  ],
};

const LG_RECALL: DocsTree = {
  title: "Recall",
  href: "/locusgraph/recall/search",
  blurb: "Searching memory by meaning, and reading what comes back.",
  sections: [
    {
      title: "Searching",
      items: [
        {
          title: "Search memories",
          href: "/locusgraph/recall/search",
          blurb: "Ask in your own words, get ranked memories",
        },
        {
          title: "Query options",
          href: "/locusgraph/recall/options",
          blurb: "Narrowing a search, and how many to take",
        },
        {
          title: "Reading a result",
          href: "/locusgraph/recall/results",
          blurb: "Every field on a returned memory",
        },
      ],
    },
    {
      title: "Going deeper",
      items: [
        {
          title: "Deep recall",
          href: "/locusgraph/recall/deep-recall",
          blurb: "One call for questions a single search cannot answer",
        },
      ],
    },
  ],
};

const LG_CONTEXTS: DocsTree = {
  title: "Contexts",
  href: "/locusgraph/contexts/overview",
  blurb: "Grouping memories, and the links between those groups.",
  sections: [
    {
      title: "Organising",
      items: [
        {
          title: "Contexts and memories",
          href: "/locusgraph/contexts/overview",
          blurb: "What a context is, and what belongs in one",
        },
        {
          title: "Link and unlink",
          href: "/locusgraph/contexts/linking",
          blurb: "Relating one context to another",
        },
        {
          title: "Browse",
          href: "/locusgraph/contexts/browsing",
          blurb: "Listing contexts, and walking their relationships",
        },
      ],
    },
    {
      title: "Loose ends",
      items: [
        {
          title: "Forward references",
          href: "/locusgraph/contexts/resolving",
          blurb: "Naming something before it exists, and resolving it later",
        },
      ],
    },
  ],
};

const LG_REVIEW: DocsTree = {
  title: "Review",
  href: "/locusgraph/review/observe",
  blurb: "Proposing memories, and deciding which ones are kept.",
  sections: [
    {
      title: "Proposing",
      items: [
        {
          title: "Send an observation",
          href: "/locusgraph/review/observe",
          blurb: "Offer something for review rather than storing it outright",
        },
      ],
    },
    {
      title: "Deciding",
      items: [
        {
          title: "The inbox",
          href: "/locusgraph/review/inbox",
          blurb: "What is waiting on a person, and why it is there",
        },
        {
          title: "Approve or reject",
          href: "/locusgraph/review/decisions",
          blurb: "Acting on a finding, and what happens next",
        },
      ],
    },
  ],
};

const LG_ENTERPRISE: DocsTree = {
  title: "Enterprise",
  href: "/locusgraph/enterprise/security",
  blurb: "Running LocusGraph at company scale.",
  sections: [
    {
      title: "Trust",
      items: [
        {
          title: "Security",
          href: "/locusgraph/enterprise/security",
          blurb: "Isolation, credentials, and what the design refuses",
        },
        {
          title: "Data residency",
          href: "/locusgraph/enterprise/data-residency",
          blurb: "Where memories live, and what leaves on a model call",
        },
      ],
    },
    {
      title: "Operating it",
      items: [
        {
          title: "SSO and access",
          href: "/locusgraph/enterprise/sso",
          blurb: "How people sign in, and how programs authenticate",
        },
        {
          title: "Deployment",
          href: "/locusgraph/enterprise/deployment",
          blurb: "Managed, or on your own infrastructure",
        },
        {
          title: "Support and SLAs",
          href: "/locusgraph/enterprise/support",
          blurb: "What the platform tells you, and how to reach a person",
        },
      ],
    },
  ],
};

const LG_GRAPHS: DocsTree = {
  title: "Graphs",
  href: "/locusgraph/graphs/create",
  blurb: "The container everything is stored in, and who can reach it.",
  sections: [
    {
      title: "Managing a graph",
      items: [
        {
          title: "Create a graph",
          href: "/locusgraph/graphs/create",
          blurb: "Making one, and listing the ones you have",
        },
        {
          title: "Settings",
          href: "/locusgraph/graphs/settings",
          blurb: "What you can change after it exists",
        },
      ],
    },
    {
      title: "Access",
      items: [
        {
          title: "API keys",
          href: "/locusgraph/graphs/keys",
          blurb: "Minting a key, and what one key reaches",
        },
        {
          title: "Access and transfer",
          href: "/locusgraph/graphs/access",
          blurb: "Sharing a graph, and handing it over",
        },
      ],
    },
  ],
};

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
  blurb: "One prompt, one schema, one priced reply, including the tries that failed.",
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

/**
 * The sidebar order, bottom up.
 *
 * `sdk` first because everything speaks to the app through it. Then `llms`,
 * which calls a provider, then `prompt`, which decides the wording, then
 * `stage`, which is those two plus a schema and a retry. `tools`, `graph` and
 * `harness` build on that, `vigil` parks a run, `evals` scores what came back,
 * and `cli` drives the lot from a terminal.
 *
 * `content/spendgraph/overview.mdx` lists the same ten in the same order. Two
 * orders that disagree read as no order at all.
 */
/**
 * The API reference, generated from `lib/api/endpoints.ts` rather than written.
 *
 * It sits in the nav beside the written groups because a reader looking for an
 * endpoint does not care which of the two produced the page. The manifest does
 * not know these pages, so `tests/nav.test.ts` exempts `/api/` from the check
 * that every href has a manifest entry: that check exists to catch a page the
 * manifest forgot, and these were never its to remember.
 */
const LG_API: DocsTree = {
  title: "API",
  href: "/locusgraph/api/search-memories",
  blurb: "Every endpoint a key reaches, with a playground on each one.",
  sections: [
    {
      title: "Reference",
      items: API_NAV_ITEMS,
    },
  ],
};

const SPENDGRAPH_TREES: DocsTree[] = [
  SPENDGRAPH,
  SDK,
  LLMS,
  PROMPT,
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
  locusgraph: [
    LOCUSGRAPH,
    LG_USE_CASES,
    LG_CLIENT,
    LG_REMEMBER,
    LG_RECALL,
    LG_CONTEXTS,
    LG_REVIEW,
    LG_GRAPHS,
    LG_API,
    LG_ENTERPRISE,
  ],
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
  const trees = treesFor(productOf(pathname));

  /**
   * A tree that lists the page owns it, whatever the path looks like.
   *
   * `baseOf` reads the first three segments, which is right for a tree under
   * its own folder, `/spendgraph/evals/...`, and wrong for one whose pages sit
   * directly under the product. There the base came out as the first page's
   * own path, `/spendgraph/overview`, so its siblings matched no tree at all:
   * the header fell back to "Docs" and the footer lost its prev and next.
   */
  const listed = trees.find((tree) => pagesOf(tree).some((item) => item.href === pathname));
  if (listed) return listed;

  return trees.find((tree) => pathname === baseOf(tree) || pathname.startsWith(`${baseOf(tree)}/`));
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
