import Link from "next/link";
import type * as React from "react";

/**
 * `next/link` in the shape the LocusGraph shell asks for.
 *
 * The shell takes any component that renders an anchor from `href`, so client
 * navigation and prefetching work in the header and sidebar the same as
 * anywhere else on the host.
 */
export function NextLink({ href, ...props }: React.ComponentProps<"a"> & { href: string }) {
  return <Link href={href} {...props} />;
}
