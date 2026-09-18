import { AlertTriangle, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  note: { icon: Info, ring: "border-line", tint: "text-soft" },
  warn: { icon: AlertTriangle, ring: "border-amber-500/30", tint: "text-amber-600" },
  trap: { icon: TriangleAlert, ring: "border-red-500/30", tint: "text-red-600" },
} as const;

/**
 * A boxed aside, for the three things worth interrupting a reader over.
 *
 * `trap` is the one that earns its keep: a rule that is deliberate, surprising,
 * and expensive to learn from a wrong dashboard three weeks later.
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
  const { icon: Icon, ring, tint } = TONES[tone];
  return (
    <aside className={cn("my-5 rounded-xl border bg-ghost/60 px-4 py-3.5", ring)}>
      <div className="flex gap-3">
        <Icon className={cn("mt-0.5 size-4 shrink-0", tint)} />
        <div className="min-w-0 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&>p]:text-sm">
          {title ? <p className={cn("mb-1 font-medium", tint)}>{title}</p> : null}
          {children}
        </div>
      </div>
    </aside>
  );
}
