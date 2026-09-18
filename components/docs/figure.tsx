/**
 * The frame every diagram sits in.
 *
 * One wrapper rather than each diagram drawing its own border: the diagrams
 * then agree with each other and with the code blocks beside them, and a change
 * of padding is one edit. `not-prose` keeps the typeset styles off the SVG —
 * without it the prose rules set a margin on the figure and a colour on its
 * text.
 */
export function Fig({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <figure className="not-prose my-6">
      <div className="overflow-x-auto rounded-xl border border-line bg-surface px-4 py-5">
        {children}
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-faint">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
