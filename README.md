# LocusGraph Docs

The documentation host for every LocusGraph product, served from one Next.js app
at `doc.locusgraph.com`.

Marketing pages and articles are not here — those live on `www.locusgraph.com`,
and each product signs its users in on its own subdomain. A page on this host is
documentation or it does not belong on this host.

## Running it

```bash
pnpm install
pnpm dev          # http://localhost:3100
```

| Script | What it does |
| --- | --- |
| `pnpm dev` | Next dev server on port 3100 |
| `pnpm build` | Production build |
| `pnpm start` | Serve the build on port 3100 |
| `pnpm lint` | `biome check .` |
| `pnpm typecheck` | `tsc --noEmit` |

Enable the hooks once per clone:

```bash
git config core.hooksPath .githooks
```

`pre-push` runs lint and typecheck before anything leaves the machine.

## URL shape

The docs host is shared, so the product is the first path segment. Two sections
are free to both document a page called `overview`, and the route resolves one
before the other.

```
/                            the index, listing every section
/{product}                   one section's docs root
/{product}/{...slug}         a page
```

`{product}` is the same lowercase-kebab slug the product uses everywhere else:
`locusgraph`, `spendgraph`, `brainstorm`, `locus-skill`.

## Where the pages come from

Two sources, both resolved through `lib/site/docs-manifest.ts`:

1. **Published packages.** Most Spendgraph pages are `.mdx` files inside
   `@spendgraph/<pkg>/docs/`, written beside the code they describe and shipped
   with the package. This host renders whichever version is installed.
2. **Local content.** `content/<product>/**.mdx`, for pages that belong to no
   package — a section overview, or a page that used to be an app route.

Every page exports the summary the route turns into metadata:

```mdx
export const meta = {
  title: "Overview — spendgraph docs",
  description: "One sentence, used for the description and the social card.",
};

# Overview
```

## Adding a page

Three edits, in this order:

1. Write the `.mdx` — in the package it documents, or under `content/<product>/`
2. Register it in `lib/site/docs-manifest.ts` under that product's key
3. Add it to the product's tree in `lib/site/docs-nav.ts`

The nav is the reading order, and it is what the previous/next footer links
walk. A page missing from step 3 is reachable only by typing its URL; a nav
entry missing from step 2 is a dead link. Nothing checks this automatically yet
— see `TODO.md`.

## Layout

```
app/
  page.tsx                   host index — the section cards
  layout.tsx                 root layout, fonts, theme provider, metadataBase
  icon.svg                   favicon, the LocusGraph mark on a dark tile
  [product]/
    layout.tsx               the docs shell: sidebar, header, outline
    page.tsx                 a section's docs root
    [...slug]/page.tsx       one page, resolved through the manifest
components/
  docs/                      sidebar, header, group nav, outline, callout, code
  site/                      marks, product marks, site chrome, theme switch
  ui/                        shadcn primitives
content/                     pages that belong to no package
lib/site/
  products.ts                the sections, their names, and whether they are ready
  docs-nav.ts                the sidebar, per section
  docs-manifest.ts           every page, and how to load it
  seo.ts                     canonical, Open Graph and Twitter tags
```

## Shared configuration

Biome, TypeScript, PostCSS and the CSS tokens all come from
`@spendgraph/config` — the same package the products extend, so the docs look
like the dashboards rather than approximating them.

`next.config.ts` lists every `@spendgraph/*` package in `transpilePackages`.
Without it the MDX loader does not reach a page inside `node_modules`, and each
one fails with `Unknown module type`.

## Sections

| Section | Pages | Listed on the index |
| --- | --- | --- |
| Spendgraph | 73 | Yes |
| LocusGraph | 3 | No — `ready: false` |
| BrainStorm | 0 | No — `ready: false` |
| Locus Skill | 0 | No — `ready: false` |

`ready` lives in `lib/site/products.ts`. Routes exist either way; the flag only
decides whether the host index offers the card as a link.
