/**
 * Marks for the MCP clients, so a reader finds their own by shape.
 *
 * Simplified monochrome glyphs drawn here rather than each vendor's brand
 * asset: the official files are not ours to redistribute, and an `<img>` per
 * logo would be four network requests on a page that otherwise makes none.
 * They identify the product being named, which is what a mark beside a config
 * block is for, and they carry no claim of endorsement.
 *
 * `currentColor` throughout, so each one takes the colour of the text it sits
 * beside and works in both themes without a second copy.
 */

export function ClaudeMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1.6l2.05 5.9 5.9-2.05-4.2 4.5 4.2 4.5-5.9-2.05L12 18.3l-2.05-5.9-5.9 2.05 4.2-4.5-4.2-4.5 5.9 2.05L12 1.6Z" />
      <path d="M12 19.9l1.2 2.5h-2.4l1.2-2.5Z" />
    </svg>
  );
}

export function CursorMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.6 20.6 7.3v9.4L12 21.4 3.4 16.7V7.3L12 2.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 12v9.4L20.6 16.7V7.3L12 12Z" fill="currentColor" fillOpacity="0.55" />
      <path
        d="M3.4 7.3 12 12l8.6-4.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VsCodeMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.6 1.8 9.9 9.1 5.6 5.9 3.6 6.9l3.5 5.1-3.5 5.1 2 1 4.3-3.2 7.7 7.3 3.3-1.6V3.4l-3.3-1.6Zm.4 5.1v10.2l-5.5-5.1 5.5-5.1Z" />
    </svg>
  );
}

export function CodexMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9.3 8.6 6.4 12l2.9 3.4M14.7 8.6 17.6 12l-2.9 3.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** One row: the mark, the client's name, and where its config lives. */
export function Client({
  mark,
  name,
  where,
}: {
  mark: "claude" | "cursor" | "vscode" | "codex";
  name: string;
  where: string;
}) {
  const Mark = { claude: ClaudeMark, cursor: CursorMark, vscode: VsCodeMark, codex: CodexMark }[
    mark
  ];

  return (
    <div className="not-prose mt-6 mb-2 flex items-center gap-2.5">
      <span className="grid size-7 shrink-0 place-items-center rounded-md border border-line bg-surface text-soft">
        <Mark />
      </span>
      <span className="font-medium text-[15px] text-foreground">{name}</span>
      <span className="font-mono text-[11.5px] text-faint">{where}</span>
    </div>
  );
}
