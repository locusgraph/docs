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

1. The `.mdx` file — in the package it documents, or `content/<product>/`
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

Most Spendgraph pages live in `node_modules/@spendgraph/<pkg>/docs/`. Editing
one there changes an installed dependency and is lost on the next install. The
source is the package's own repository; this host only renders what is
installed.

A page that belongs to no package goes in `content/<product>/` instead.

## Adding a section

`PRODUCTS` in `lib/site/products.ts` is the single list. A new entry needs a
title, a blurb and a `ready` flag, plus a key in both `DOCS` and `NAV` — the
records are typed `Record<Product, …>`, so TypeScript names whichever one is
missing.

`ready: false` keeps the section off the host index while its routes stay live.

## Styling

Colours, typography and spacing come from `@spendgraph/config/css/theme.css`.
Use the tokens — `line`, `soft`, `faint`, `surface`, `ghost`, `s1`,
`background`, `foreground` — rather than Tailwind's palette, or the docs stop
matching the products.

Dark mode is a `.dark` class on `<html>`, set by `next-themes`. Anything using
`prefers-color-scheme` directly will disagree with the toggle.

## Two things that bite

**`transpilePackages`.** `next.config.ts` lists every `@spendgraph/*` package.
Loaders stop at the `node_modules` edge, so without the list every package page
fails with `Unknown module type` on a `.mdx` file. A new package needs adding
there as well as to the manifest.

**Canonical host.** `SITE_URL` in `lib/site/seo.ts` is `https://docs.locusgraph.com`,
and `metadataBase` in `app/layout.tsx` resolves every relative canonical against
it. Pointing it at a product subdomain would canonicalise these pages onto a
host that is deliberately `noindex`.
