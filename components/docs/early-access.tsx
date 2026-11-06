import { Button } from "@locusgraph/components";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";

/**
 * The early-access call to action.
 *
 * One component rather than a mailto repeated across pages: the address appears
 * once in the source, so changing it is one edit rather than a grep. The
 * subject is prefilled with the section's name so a reply lands with the
 * context already attached.
 */
export function EarlyAccess({
  product = "LocusGraph",
  className,
}: {
  product?: string;
  className?: string;
}) {
  const href = `mailto:nasim@effortlesslabs.xyz?subject=${encodeURIComponent(
    `Early access: ${product}`
  )}`;

  return (
    <aside
      className={`not-prose my-6 not-typeset border border-border bg-card px-5 py-4 ${className ?? ""}`}
    >
      <p className="text-sm font-medium">Get early access</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {product} is not generally available yet. Tell us what you are building and we will get you
        in.
      </p>
      <Button asChild className="mt-3 rounded-full no-underline">
        <a href={href}>
          nasim@effortlesslabs.xyz
          <ArrowRightIcon weight="bold" aria-hidden />
        </a>
      </Button>
    </aside>
  );
}
