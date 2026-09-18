import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { isValidElement } from "react";
import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";

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
    h2: ({ children }) => <Heading as="h2">{children}</Heading>,
    h3: ({ children }) => <Heading as="h3">{children}</Heading>,
    pre: ({ children, ...props }) => {
      const filename = (props as { "data-filename"?: string })["data-filename"];
      return (
        <CodeBlock filename={filename} {...props}>
          {children}
        </CodeBlock>
      );
    },
    a: ({ href, children, ...props }) =>
      href?.startsWith("/") ? (
        <Link href={href} {...props}>
          {children}
        </Link>
      ) : (
        <a href={href} rel="noreferrer" {...props}>
          {children}
        </a>
      ),
    Callout,
    ...components,
  };
}
