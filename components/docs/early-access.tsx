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
    `Early access — ${product}`
  )}`;

  return (
    <aside
      className={`not-prose my-6 rounded-xl border border-line bg-surface px-5 py-4 ${className ?? ""}`}
    >
      <p className="text-sm font-medium">Get early access</p>
      <p className="mt-1 text-sm text-soft">
        {product} is not generally available yet. Tell us what you are building and we will get you
        in.
      </p>
      <a
        href={href}
        className="mt-3 inline-flex items-center gap-2 rounded-[10px] bg-btn px-4 py-2 text-sm font-medium text-btn-ink no-underline transition hover:opacity-90"
      >
        nasim@effortlesslabs.xyz
        <span aria-hidden>→</span>
      </a>
    </aside>
  );
}
