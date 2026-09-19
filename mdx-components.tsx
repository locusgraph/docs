import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { isValidElement } from "react";
import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";
import {
  BatchVsTransaction,
  ChunkVsStatement,
  ConceptTree,
  ContextGraph,
  ExperienceVsConclusion,
  GraphIsolation,
  LinkTypes,
  MeaningMatch,
  MemoryFlow,
  QuickstartSteps,
  RemovalLevels,
  SlugAnatomy,
  TrustLadder,
  TwoDoors,
} from "@/components/docs/diagrams";
import { EarlyAccess } from "@/components/docs/early-access";
import {
  CliOverSdk,
  GraphToRollout,
  OneShapeBack,
  ParkAndResume,
  PromptSources,
  ScoreNotAssert,
  SevenShapes,
  ToolShortlist,
} from "@/components/docs/spendgraph-diagrams";
import {
  ReceiptsStack,
  TheGap,
  TwoCredentials,
} from "@/components/docs/spendgraph-section-diagrams";

/** The Spendgraph dashboard, for the few package links that point at it. */
const SPENDGRAPH_APP = "https://spendgraph.locusgraph.com";
const APP_PATHS = new Set(["/pricing", "/projects", "/keys"]);

/** A package doc's link, in the shape this host serves. */
function docsHref(href: string): string {
  if (href.startsWith("/docs/")) return `/spendgraph${href.slice(5)}`;
  if (APP_PATHS.has(href)) return `${SPENDGRAPH_APP}${href}`;
  return href;
}

function textOf(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) return textOf((node.props as { children?: React.ReactNode }).children);
  return "";
}

function slug(children: React.ReactNode): string {
  return textOf(children)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function Heading({ as: Tag, children }: { as: "h2" | "h3"; children?: React.ReactNode }) {
  const id = slug(children);
  return (
    <Tag id={id} className="group scroll-mt-20">
      <a href={`#${id}`} className="no-underline">
        {children}
        <span className="ml-2 text-faint opacity-0 transition group-hover:opacity-100">#</span>
      </a>
    </Tag>
  );
}

/**
 * What every MDX element in the docs renders as.
 *
 * Next resolves this file by convention, so a page written as plain markdown
 * gets the copy button, the anchored headings and the internal-link handling
 * without importing anything. An author writing a fenced block should not have
 * to know a component exists.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Callout,
    BatchVsTransaction,
    ChunkVsStatement,
    CliOverSdk,
    ConceptTree,
    EarlyAccess,
    ContextGraph,
    ExperienceVsConclusion,
    GraphIsolation,
    GraphToRollout,
    OneShapeBack,
    ParkAndResume,
    PromptSources,
    LinkTypes,
    MeaningMatch,
    MemoryFlow,
    QuickstartSteps,
    ReceiptsStack,
    RemovalLevels,
    ScoreNotAssert,
    SevenShapes,
    SlugAnatomy,
    TheGap,
    TrustLadder,
    ToolShortlist,
    TwoCredentials,
    TwoDoors,
    h2: ({ children }) => <Heading as="h2">{children}</Heading>,
    h3: ({ children }) => <Heading as="h3">{children}</Heading>,
    /**
     * Tables fill the column rather than shrinking to their content.
     *
     * The typeset stylesheet sets `max-width: 100%` and no width, so a table of
     * short cells sits in a narrow box with the prose running past it. The
     * wrapper scrolls rather than squeezing when the columns genuinely do not
     * fit, which is the only case where shrink-to-fit was doing anything
     * useful.
     */
    table: ({ children, ...props }) => (
      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full text-left" {...props}>
          {children}
        </table>
      </div>
    ),
    pre: ({ children, ...props }) => {
      const filename = (props as { "data-filename"?: string })["data-filename"];
      return (
        <CodeBlock filename={filename} {...props}>
          {children}
        </CodeBlock>
      );
    },
    /**
     * A package doc links with the path its own site used, `/docs/...`, which
     * is not the shape this host serves. Rewriting here rather than in the
     * packages keeps them portable: a package should not have to know the URL
     * layout of whatever renders it.
     *
     * A handful point at the dashboard rather than at a doc. Those are a
     * different origin, so they leave as absolute URLs.
     *
     * Local content already writes `/spendgraph/...` and passes through.
     */
    a: ({ href, children, ...props }) =>
      href?.startsWith("/") ? (
        <Link href={docsHref(href)} {...props}>
          {children}
        </Link>
      ) : (
        <a href={href} rel="noreferrer" {...props}>
          {children}
        </a>
      ),
    ...components,
  };
}
