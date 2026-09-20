import {
  Activity,
  AlertTriangle,
  ArrowLeftRight,
  Binary,
  Blocks,
  BookOpen,
  Bot,
  Box,
  Boxes,
  Braces,
  Brain,
  Bug,
  Building2,
  CheckCheck,
  CircleDollarSign,
  ClipboardCheck,
  Cloud,
  Compass,
  Database,
  Eye,
  FileStack,
  FileText,
  Filter,
  Gauge,
  GitBranch,
  Globe,
  Handshake,
  History,
  Hourglass,
  Inbox,
  KeyRound,
  Layers,
  LifeBuoy,
  Link2,
  ListFilter,
  Lock,
  type LucideIcon,
  MessageSquare,
  Milestone,
  Network,
  Package,
  Play,
  Plug,
  Repeat,
  Route,
  Scale,
  ScrollText,
  Search,
  Send,
  Server,
  Settings,
  Shield,
  Signpost,
  SlidersHorizontal,
  Split,
  Tags,
  Target,
  Terminal,
  Timer,
  Users,
  Wallet,
  Waypoints,
  Webhook,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";

/**
 * One icon per navigation item, resolved the same way everywhere.
 *
 * Keyed on a page's last path segment rather than its full href, because a page
 * called `overview` means the same thing in every section and keying on the
 * whole path would ask each new section to re-register the same entries. The
 * sidebar, the header group nav and the section index all read from here, so an
 * item wears one icon wherever it appears.
 */
const PAGE_ICONS: Record<string, LucideIcon> = {
  // Starting points
  overview: Compass,
  quickstart: Play,
  "getting-started": Play,
  concepts: BookOpen,
  install: Package,

  // Client
  connecting: Plug,
  errors: AlertTriangle,
  types: Braces,
  limits: Gauge,
  credentials: KeyRound,

  // Writing
  store: Send,
  "event-kinds": Tags,
  sources: Scale,
  batch: Layers,
  tracking: Activity,
  events: Activity,

  // Reading
  search: Search,
  options: SlidersHorizontal,
  results: ListFilter,
  "deep-recall": Brain,
  retrieval: Search,

  // Contexts and links
  linking: Link2,
  browsing: Network,
  resolving: Waypoints,
  wiring: Network,
  nodes: Boxes,

  // Review
  observe: Eye,
  inbox: Inbox,
  decisions: CheckCheck,
  judge: Scale,

  // Graphs and admin
  create: Boxes,
  settings: Settings,
  keys: KeyRound,
  access: Users,
  security: Shield,
  "data-residency": Globe,
  sso: Lock,
  deployment: Cloud,
  support: LifeBuoy,

  // Use cases
  preferences: Settings,
  conversations: MessageSquare,
  "agent-skills": Bot,
  "team-knowledge": Users,
  documents: FileStack,
  "multi-tenant": Building2,

  // Spendgraph — SDK and API
  client: Box,
  api: Webhook,
  integrations: Plug,
  budgets: Wallet,
  cost: CircleDollarSign,

  // Spendgraph — prompts, models, tools
  fields: Braces,
  calling: Send,
  caching: History,
  datasets: Database,
  providers: Globe,
  streaming: Zap,
  "structured-output": Braces,
  tools: Wrench,
  declaring: ScrollText,
  selecting: Filter,
  stored: Database,
  builtins: Package,
  effects: Zap,
  bus: Network,
  turns: Repeat,
  bogus: Bug,

  // Spendgraph — workflows
  running: Play,
  pausing: Timer,
  retrying: Repeat,
  refine: Target,
  route: Route,
  chain: Link2,
  parallel: Split,
  orchestrate: Workflow,
  loop: Repeat,
  cascade: GitBranch,
  choosing: Signpost,
  "human-in-the-loop": Handshake,
  workflows: Workflow,
  agents: Bot,
  hosts: Server,
  failures: AlertTriangle,
  testing: ClipboardCheck,

  // Spendgraph — evals
  metrics: Gauge,
  criteria: ClipboardCheck,
  custom: Wrench,
  deterministic: Binary,
  "comparing-runs": ArrowLeftRight,

  // Spendgraph — CLI
  commands: Terminal,
  output: ScrollText,
  skills: Blocks,
};

/**
 * One icon per group, for the header nav and the section index.
 *
 * Keyed on the tree's title, which is what the header renders. A group with no
 * title is the section's own pages and gets no icon of its own.
 */
const GROUP_ICONS: Record<string, LucideIcon> = {
  "Use cases": Milestone,
  Client: Box,
  Remember: Send,
  Recall: Search,
  Contexts: Network,
  Review: Eye,
  Graphs: Boxes,
  Enterprise: Building2,
  SDK: Box,
  Prompts: ScrollText,
  LLMs: Bot,
  Stage: Layers,
  Tools: Wrench,
  Graph: Network,
  Harness: Workflow,
  Vigil: Hourglass,
  Evals: Gauge,
  CLI: Terminal,
  MCP: Plug,
  API: Webhook,
};

/** The icon for a page, by its href. Falls back rather than throwing. */
export function iconForHref(href: string): LucideIcon {
  return PAGE_ICONS[href.split("/").pop() ?? ""] ?? FileText;
}

/** The icon for a group, by its title. `undefined` when the group has none. */
export function iconForGroup(title: string): LucideIcon | undefined {
  return GROUP_ICONS[title];
}

/** Every page segment that has an icon, for the coverage check. */
export const ICON_SEGMENTS = Object.keys(PAGE_ICONS);
