import { Alert, AlertDescription, AlertTitle } from "@locusgraph/components";
import { InfoIcon, WarningCircleIcon, WarningIcon } from "@phosphor-icons/react/ssr";

const TONES = {
  note: { icon: InfoIcon, variant: "default" },
  warn: { icon: WarningIcon, variant: "warning" },
  trap: { icon: WarningCircleIcon, variant: "destructive" },
} as const;

/**
 * A boxed aside, for the three things worth interrupting a reader over.
 *
 * `trap` is the one that earns its keep: a rule that is deliberate, surprising,
 * and expensive to learn from a wrong dashboard three weeks later.
 *
 * Drawn with the LocusGraph `Alert`, so a warning here reads the same as one in
 * the products. `not-typeset` keeps the prose styles from restyling its title.
 * Pages in `@spendgraph/docs` take this component from the host, so its props
 * stay as they were.
 */
export function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: keyof typeof TONES;
  title?: string;
  children: React.ReactNode;
}) {
  const { icon: Icon, variant } = TONES[tone];
  return (
    <Alert variant={variant} className="my-5">
      <Icon weight="bold" aria-hidden />
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      <AlertDescription className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </AlertDescription>
    </Alert>
  );
}
