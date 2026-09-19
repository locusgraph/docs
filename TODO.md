# TODO

What is left, roughly in the order it unblocks other work. The SEO items keep
the Sl numbers from `handbook/SEO-SOURCE.md`.

## Done

- **`app/robots.ts`** and **`app/sitemap.ts`**: Sl 6. The sitemap is generated
  from the manifest, so the two cannot drift. 116 URLs
- **Canonicals and meta descriptions**: `pageMeta` in `lib/site/seo.ts`,
  resolved against `metadataBase` in `app/layout.tsx`
- **Title template**: `{Page} | LocusGraph Docs`, Sl 11
- **Custom domain**: the site serves `docs.locusgraph.com`, and every canonical
  names that host
- **Search**: a palette over an index built from the manifest, 113 pages
- **LocusGraph section**: 40 pages across nine groups, `ready: true`

### The root is a page, not a redirect

Sl 6 says the root should 301 to an intro. That was written when the docs were
one product. This host serves several sections, so redirecting would pick a
winner and bounce everyone else. The root is an indexable index instead.

## Ship-blocking

- [x] **Social card.** `app/opengraph-image.tsx` draws it at build with
      `next/og`, so there is no binary in the repo and the card carries the
      site's own tokens. 119 of 120 pages emit it; the exception is the global
      error page, which has no metadata
- [ ] **Submit the sitemap.** `https://docs.locusgraph.com/sitemap.xml` in the
      existing Search Console property, per Sl 6. Do not submit app sitemaps
- [ ] **`doc.locusgraph.com` still points at Vercel.** A CNAME to
      `vercel-dns-017.com` holds the name, which is why this host is `docs.`.
      Redirect `doc.` here once that is untangled, so the spec's hostname and
      any existing links still resolve

## Correctness

- [x] **Tests.** 207 of them, in `pre-push`: nav reachability, nav against the
      manifest, dead internal links, page metadata, and the human-voice
      character rules over both prose and interface copy

## Content

- [ ] **Spendgraph prose was never swept.** The human-voice pass covered
      `content/` only. 66 of its 73 pages live in `node_modules` and still carry
      em dashes and ellipses
- [ ] **BrainStorm**: 0 pages, `ready: false`
- [ ] **Locus Skill**: 0 pages, `ready: false`, still on the lucide `Workflow`
      placeholder in `components/site/product-mark.tsx`
- [ ] **Spendgraph has no figures.** LocusGraph has 12 pages with diagrams;
      Spendgraph has none. Its package pages cannot take MDX components, so this
      needs the diagrams to live in the packages or the pages to move local

## Packages

- [ ] **npm is a version behind.** `@spendgraph/sdk` and eight others serve
      0.7.0 while the source tree is 0.8.0; only `vigil` and `config` are
      current. Publishing 0.8.0 and running `pnpm update` levels the rendered
      docs with the code they describe, and refreshes the search index with them
- [ ] **`workflows` and `examples` have no section.** Both are packages with
      READMEs and no `docs/` folder, so nothing here renders them

## Build and tooling

- [ ] **`sharp` build script is blocked.** pnpm reads `onlyBuiltDependencies`
      from `pnpm-workspace.yaml` and still refuses; `pnpm rebuild sharp` refuses
      too. It wants `pnpm approve-builds`, which is interactive. Only affects
      Next image optimisation
- [ ] **`pnpm run deploy:cf` collides with pnpm's own command.** It fails with
      `ERR_PNPM_INVALID_DEPLOY_TARGET` and needs `pnpm run deploy:cf`. Renaming the
      script to `deploy:cf` removes the trap before CI finds it
- [x] **Apple icon.** `app/apple-icon.tsx`, drawn the same way. iOS ignores
      SVG for home-screen bookmarks and falls back to a screenshot without it

## Known rough edges

- [x] **`toc.tsx` warning resolved.** The rule was wrong: `pathname` is the
      effect's re-run key, not a value it reads, and taking the suggested fix
      would leave the outline showing the previous page's headings. Suppressed
      with the reason on the line
- [ ] **Section roots are thin.** `/{product}` lists its groups and nothing else
