import type { Icon } from "@phosphor-icons/react";
import {
  ArrowsLeftRightIcon,
  ArrowsSplitIcon,
  BinaryIcon,
  BookOpenIcon,
  BracketsCurlyIcon,
  BrainIcon,
  BugIcon,
  BuildingsIcon,
  ChatCenteredTextIcon,
  ChecksIcon,
  ClipboardTextIcon,
  ClockCounterClockwiseIcon,
  CloudIcon,
  CompassIcon,
  CubeIcon,
  CurrencyCircleDollarIcon,
  DatabaseIcon,
  EyeIcon,
  FilesIcon,
  FileTextIcon,
  FlagIcon,
  FlowArrowIcon,
  FunnelIcon,
  FunnelSimpleIcon,
  GaugeIcon,
  GearIcon,
  GitBranchIcon,
  GlobeIcon,
  GraphIcon,
  HandshakeIcon,
  HardDrivesIcon,
  HourglassIcon,
  KeyIcon,
  LifebuoyIcon,
  LightningIcon,
  LinkIcon,
  LockIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PackageIcon,
  PaperPlaneTiltIcon,
  PathIcon,
  PlayIcon,
  PlugIcon,
  PulseIcon,
  RepeatIcon,
  RobotIcon,
  ScalesIcon,
  ScrollIcon,
  ShapesIcon,
  ShieldIcon,
  SignpostIcon,
  SlidersHorizontalIcon,
  SquaresFourIcon,
  StackIcon,
  TagIcon,
  TargetIcon,
  TerminalWindowIcon,
  TimerIcon,
  TrayIcon,
  UsersIcon,
  WalletIcon,
  WarningIcon,
  WebhooksLogoIcon,
  WrenchIcon,
} from "@phosphor-icons/react/ssr";

/**
 * One icon per navigation item, resolved the same way everywhere.
 *
 * Keyed on a page's last path segment rather than its full href, because a page
 * called `overview` means the same thing in every section and keying on the
 * whole path would ask each new section to re-register the same entries. The
 * search results, the host index and the section index all read from here, so an
 * item wears one icon wherever it appears.
 */
const PAGE_ICONS: Record<string, Icon> = {
  // Starting points
  overview: CompassIcon,
  quickstart: PlayIcon,
  "getting-started": PlayIcon,
  concepts: BookOpenIcon,
  install: PackageIcon,

  // Client
  connecting: PlugIcon,
  errors: WarningIcon,
  types: BracketsCurlyIcon,
  limits: GaugeIcon,
  credentials: KeyIcon,

  // Writing
  store: PaperPlaneTiltIcon,
  "event-kinds": TagIcon,
  sources: ScalesIcon,
  batch: StackIcon,
  tracking: PulseIcon,
  events: PulseIcon,

  // Reading
  search: MagnifyingGlassIcon,
  options: SlidersHorizontalIcon,
  results: FunnelSimpleIcon,
  "deep-recall": BrainIcon,
  retrieval: MagnifyingGlassIcon,

  // Contexts and links
  linking: LinkIcon,
  browsing: GraphIcon,
  resolving: MapPinIcon,
  wiring: GraphIcon,
  nodes: ShapesIcon,

  // Review
  observe: EyeIcon,
  inbox: TrayIcon,
  decisions: ChecksIcon,
  judge: ScalesIcon,

  // Graphs and admin
  create: ShapesIcon,
  settings: GearIcon,
  keys: KeyIcon,
  access: UsersIcon,
  security: ShieldIcon,
  "data-residency": GlobeIcon,
  sso: LockIcon,
  deployment: CloudIcon,
  support: LifebuoyIcon,

  // Use cases
  preferences: GearIcon,
  conversations: ChatCenteredTextIcon,
  "agent-skills": RobotIcon,
  "team-knowledge": UsersIcon,
  documents: FilesIcon,
  "multi-tenant": BuildingsIcon,

  // Spendgraph: SDK and API
  client: CubeIcon,
  api: WebhooksLogoIcon,
  integrations: PlugIcon,
  budgets: WalletIcon,
  cost: CurrencyCircleDollarIcon,

  // Spendgraph: prompts, models, tools
  fields: BracketsCurlyIcon,
  calling: PaperPlaneTiltIcon,
  caching: ClockCounterClockwiseIcon,
  datasets: DatabaseIcon,
  providers: GlobeIcon,
  streaming: LightningIcon,
  "structured-output": BracketsCurlyIcon,
  tools: WrenchIcon,
  declaring: ScrollIcon,
  selecting: FunnelIcon,
  stored: DatabaseIcon,
  builtins: PackageIcon,
  effects: LightningIcon,
  bus: GraphIcon,
  turns: RepeatIcon,
  bogus: BugIcon,

  // Spendgraph: workflows
  running: PlayIcon,
  pausing: TimerIcon,
  retrying: RepeatIcon,
  refine: TargetIcon,
  route: PathIcon,
  chain: LinkIcon,
  parallel: ArrowsSplitIcon,
  orchestrate: FlowArrowIcon,
  loop: RepeatIcon,
  cascade: GitBranchIcon,
  choosing: SignpostIcon,
  "human-in-the-loop": HandshakeIcon,
  workflows: FlowArrowIcon,
  agents: RobotIcon,
  hosts: HardDrivesIcon,
  failures: WarningIcon,
  testing: ClipboardTextIcon,

  // Spendgraph: evals
  metrics: GaugeIcon,
  criteria: ClipboardTextIcon,
  custom: WrenchIcon,
  deterministic: BinaryIcon,
  "comparing-runs": ArrowsLeftRightIcon,

  // Spendgraph: CLI
  commands: TerminalWindowIcon,
  output: ScrollIcon,
  skills: SquaresFourIcon,
};

/**
 * One icon per group, for the section index.
 *
 * Keyed on the tree's title, which is what the section index renders. A group with no
 * title is the section's own pages and gets no icon of its own.
 */
const GROUP_ICONS: Record<string, Icon> = {
  "Use cases": FlagIcon,
  Client: CubeIcon,
  Remember: PaperPlaneTiltIcon,
  Recall: MagnifyingGlassIcon,
  Contexts: GraphIcon,
  Review: EyeIcon,
  Graphs: ShapesIcon,
  Enterprise: BuildingsIcon,
  SDK: CubeIcon,
  Prompts: ScrollIcon,
  LLMs: RobotIcon,
  Stage: StackIcon,
  Tools: WrenchIcon,
  Graph: GraphIcon,
  Harness: FlowArrowIcon,
  Vigil: HourglassIcon,
  Evals: GaugeIcon,
  CLI: TerminalWindowIcon,
  MCP: PlugIcon,
  API: WebhooksLogoIcon,
};

/** The icon for a page, by its href. Falls back rather than throwing. */
export function iconForHref(href: string): Icon {
  return PAGE_ICONS[href.split("/").pop() ?? ""] ?? FileTextIcon;
}

/** The icon for a group, by its title. `undefined` when the group has none. */
export function iconForGroup(title: string): Icon | undefined {
  return GROUP_ICONS[title];
}

/** Every page segment that has an icon, for the coverage check. */
export const ICON_SEGMENTS = Object.keys(PAGE_ICONS);
