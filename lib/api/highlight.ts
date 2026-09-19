/**
 * Syntax colours for the API playground, in the theme the rest of the docs use.
 *
 * `next.config.ts` gives rehype-pretty-code `github-dark`, so a fenced block on
 * a guide page is already these colours. Reading them off a rendered page and
 * reusing the values here is what stops the playground looking like a different
 * product from the page it sits on.
 *
 * Shiki is not reachable from a client component, and pulling a highlighter
 * into the bundle to colour four short samples would cost more than the samples
 * weigh. This is a scanner, not a parser: enough for the shapes these samples
 * take, and nothing more.
 */

export const TOKEN = {
  plain: "#e1e4e8",
  keyword: "#f97583",
  string: "#9ecbff",
  number: "#79b8ff",
  fn: "#b392f0",
  comment: "#6a737d",
} as const;

export type Lang = "curl" | "node" | "python" | "go" | "json" | "plain";

export interface Token {
  readonly text: string;
  readonly colour: string;
}

const WORDS: Record<string, readonly string[]> = {
  curl: ["curl"],
  node: ["import", "from", "const", "await", "new", "async", "return", "export", "let"],
  python: ["import", "from", "print", "def", "return", "as", "with", "for", "in"],
  go: ["func", "var", "return", "if", "err", "nil", "map", "string", "any", "package"],
  json: ["true", "false", "null"],
  plain: [],
};

/**
 * Lossless by construction: every branch consumes exactly what it matched and
 * the fallback takes one character, so joining the tokens returns the input.
 * `tests/api.test.ts` holds that, because a scanner that drops a character
 * corrupts a sample someone pastes into a terminal and looks fine doing it.
 */
export function highlight(code: string, lang: Lang): Token[] {
  const words = WORDS[lang] ?? [];
  const out: Token[] = [];
  let plain = "";

  const flush = () => {
    if (plain) {
      out.push({ text: plain, colour: TOKEN.plain });
      plain = "";
    }
  };
  const push = (text: string, colour: string) => {
    flush();
    out.push({ text, colour });
  };

  let i = 0;
  while (i < code.length) {
    const rest = code.slice(i);
    const comment = lang === "python" || lang === "curl" ? /^#[^\n]*/ : /^\/\/[^\n]*/;

    let m = rest.match(comment);
    if (m) {
      push(m[0], TOKEN.comment);
      i += m[0].length;
      continue;
    }

    m = rest.match(/^"(?:[^"\\\n]|\\.)*"?|^'(?:[^'\\\n]|\\.)*'?/);
    if (m && m[0].length > 1) {
      push(m[0], TOKEN.string);
      i += m[0].length;
      continue;
    }

    if (lang === "curl") {
      m = rest.match(/^-[A-Za-z]\b/);
      if (m) {
        push(m[0], TOKEN.keyword);
        i += m[0].length;
        continue;
      }
    }

    m = rest.match(/^\b\d+(?:\.\d+)?\b/);
    if (m) {
      push(m[0], TOKEN.number);
      i += m[0].length;
      continue;
    }

    m = rest.match(/^[A-Za-z_$][A-Za-z0-9_$]*/);
    if (m) {
      const word = m[0];
      if (words.includes(word)) push(word, TOKEN.keyword);
      else if (/^\s*\(/.test(rest.slice(word.length))) push(word, TOKEN.fn);
      else plain += word;
      i += word.length;
      continue;
    }

    plain += code[i];
    i += 1;
  }

  flush();
  return out;
}
