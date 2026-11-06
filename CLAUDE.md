# Working in this repo

The documentation host for every LocusGraph product. One Next.js app, served at
`docs.locusgraph.com`. Read `README.md` first for the URL shape and the layout.

## Commands

```bash
pnpm dev          # port 3100
pnpm lint         # biome check .
pnpm typecheck    # tsc --noEmit
pnpm test         # vitest run
pnpm build
```

Run `pnpm lint`, `pnpm typecheck` and `pnpm test` before saying a change is
done. `pre-push` runs all three, so a push fails on anything they catch.

## Skills

Prose on this host follows the **human-voice** rules: no em dashes, no smart
quotes, no ellipsis characters, no AI buzzwords or hedging. Code samples and
diagrams are exempt, since a dash in an ASCII figure is not an AI tell.

The skill itself is not in this repo. `.agents/` and `skills-lock.json` are both
gitignored, so each clone fetches what it wants:

```bash
mkdir -p .agents/skills/human-voice
curl -sL -o .agents/skills/human-voice/SKILL.md \
  https://raw.githubusercontent.com/zircote/human-voice/HEAD/skills/human-voice/SKILL.md
```

The rules are written down here so they survive without it.

## Commits

`.githooks/commit-msg` enforces the format, and it is not advisory — a commit
that misses it is rejected:

- `type(folder): what it does`, one line, no body
- Type is one of `feat fix chore docs refactor test build ci perf style revert`
- Scope is a real directory in this repo, or `repo` for repo-wide work
- Description starts lowercase and ends without a period, subject under 100
  characters
- **No trailers.** The hook rejects `Co-Authored-By:` explicitly — a commit is
  authored by whoever ran `git commit`

Enable the hooks with `git config core.hooksPath .githooks`.

## Adding or changing a page

A page is three things that must agree:

1. The `.mdx` file — in `@spendgraph/docs`, or `content/<product>/`
2. An entry in `lib/site/docs-manifest.ts`, under that product's key
3. An entry in the product's tree in `lib/site/docs-nav.ts`

`pnpm test` checks that they agree, along with dead internal links and the
prose rules below. It runs in `pre-push`, so a mismatch cannot reach the remote:

```bash
pnpm test          # once
pnpm test:watch    # while writing
```

Every page must export `meta` with a `title` and a `description`. The route
builds its metadata from it, and `types/mdx.d.ts` is what makes TypeScript
believe the export exists.

## Do not edit package docs here

Every Spendgraph package page lives in `node_modules/@spendgraph/docs/<pkg>/`,
along with the figures it draws with. Editing one there changes an installed
dependency and is lost on the next install. The source is the spendgraph repo,
under `packages/docs/`; this host only renders what is installed, so a change to
a page needs a publish before it appears here.

A page there brings its own figures with an import. The only component it takes
from this host is `Callout`. `tests/components.test.ts` holds that line.

A page that belongs to no package goes in `content/<product>/` instead. Those
take whatever `mdx-components.tsx` registers.

## Adding a section

`PRODUCTS` in `lib/site/products.ts` is the single list. A new entry needs a
title, a blurb and a `ready` flag, plus a key in both `DOCS` and `NAV` — the
records are typed `Record<Product, …>`, so TypeScript names whichever one is
missing.

`ready: false` keeps the section off the host index while its routes stay live.

## Styling

The design is LocusGraph's, from npm. `app/globals.css` imports
`@locusgraph/components/theme.css`, which brings the colour tokens for both
modes, the typeset, and the fonts: IBM Plex Sans for text, IBM Plex Mono for
code, Archivo for headings and the brand. There is no font loader in
`app/layout.tsx`, and none is needed. TypeScript, Biome, PostCSS and Vitest
presets come from `@locusgraph/config`.

Use the theme's tokens rather than Tailwind's palette: `background`, `card`,
`muted`, `foreground`, `muted-foreground`, `faint`, `border`, `primary`. In CSS,
read the `--locus-*` variables. Containers are square; group with ruled lines,
not cards and shadows.

The UI comes from `@locusgraph/components`: the docs shell, header, sidebar,
outline, breadcrumbs, theme toggle, buttons, the search dialog and the alert a
`Callout` draws with. Use a component from there before writing one here, and
read its page on design.locusgraph.com (add `.md` to the path) for its props.
Icons are Phosphor, the set the components use. Marks come from
`@locusgraph/brand`.

Pages in `@spendgraph/docs` were drawn with the old Spendgraph token names:
`line`, `soft`, `ghost`, `btn`, `bad`, `s1` to `s3`. `globals.css` points each
at its LocusGraph value and adds an `@source` for that package, so those pages
render in the LocusGraph theme without a change there. The host's own diagrams
still use them as well; new code uses the theme's names.

Each section has its own accent. `globals.css` sets `--locus-s1` to `--locus-s3`
under `[data-section]`, which the product layout puts on the shell, and uses
`--locus-s1` for prose links and the current page in a nav.

Dark mode is a `.dark` class on `<html>`, set by `next-themes`. Anything using
`prefers-color-scheme` directly will disagree with the toggle.

## Three things that bite

**`transpilePackages`.** `next.config.ts` lists `@spendgraph/docs`. Loaders stop
at the `node_modules` edge, so without it every package page fails with
`Unknown module type` on a `.mdx` file.

**pnpm withholds a fresh release.** `minimumReleaseAge` refuses a version
published in the last day, so a `pnpm update` straight after a publish silently
resolves the previous one. `pnpm-workspace.yaml` excludes `'@spendgraph/*'`,
because these docs and the code they describe ship in the same hour; everything
else keeps the wait. npm's own propagation adds a few minutes on top, and it
lands on the abbreviated packument last, which is the one pnpm asks for — so a
404 from pnpm while `curl` on the package URL says 200 is that, not a mistake.

**Canonical host.** `SITE_URL` in `lib/site/seo.ts` is `https://docs.locusgraph.com`,
and `metadataBase` in `app/layout.tsx` resolves every relative canonical against
it. Pointing it at a product subdomain would canonicalise these pages onto a
host that is deliberately `noindex`.
