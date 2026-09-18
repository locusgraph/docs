# TODO

What is left on the docs host, roughly in the order it unblocks other work.
The SEO items trace back to `handbook/SEO-SOURCE.md` and carry its Sl numbers.

## Crawlability — Sl 6

The docs host is meant to be indexed and to carry its own sitemap. Three of the
four pieces do not exist yet.

- [ ] **`app/robots.ts`** — allow everything, and point at the sitemap
- [ ] **`app/sitemap.ts`** — every route the manifest knows about. It is already
      the list of pages, so the sitemap can be generated from it rather than
      maintained by hand
- [ ] **Decide what the root does.** Sl 6 says 301/308 to an intro page, written
      when the docs were one product. The host now serves four sections, so the
      root is an index page instead — redirecting would pick a winner and bounce
      everyone else. Confirm this reading, or implement the redirect
- [x] **Canonicals and meta descriptions** — `pageMeta` in `lib/site/seo.ts`,
      resolved against `metadataBase` in `app/layout.tsx`
- [x] **Title template** — `{Page} | LocusGraph Docs`, Sl 11

Submit `https://doc.locusgraph.com/sitemap.xml` in the existing Search Console
property once the sitemap ships. Do not submit anything for the app subdomains.

## Content

- [ ] **BrainStorm section** — no pages. `ready: false` keeps it off the index
- [ ] **Locus Skill section** — no pages, same
- [ ] **LocusGraph section** — three pages exist (overview, getting started,
      concepts) but the section is still `ready: false`. Either finish it or
      flip the flag in `lib/site/products.ts`
- [ ] **Locus Skill mark** — still the lucide `Workflow` placeholder in
      `components/site/product-mark.tsx`. LocusGraph, Spendgraph and BrainStorm
      have real artwork

## Packages

- [ ] **npm is a version behind.** Nine `@spendgraph/*` packages serve 0.7.0
      while the source tree is at 0.8.0; only `vigil` and `config` are current.
      Publishing 0.8.0 and running `pnpm update` brings the rendered docs level
      with the code they describe
- [ ] **`workflows` and `examples` have no section.** Both are packages with
      READMEs and no `docs/` folder, so nothing here renders them

## Build and tooling

- [ ] **`sharp` build script is blocked.** pnpm reads `onlyBuiltDependencies`
      from `pnpm-workspace.yaml` — `pnpm config get` confirms it — but still
      refuses, and `pnpm rebuild sharp` refuses too. It wants interactive
      approval: run `pnpm approve-builds`. Only affects Next image optimisation
- [ ] **Nothing checks the nav against the manifest.** The cross-check in
      `CLAUDE.md` is a shell one-liner run by hand. It belongs in `pre-push`,
      or in a test
- [ ] **No tests.** `pre-push` runs lint and typecheck only
- [ ] **`app/apple-icon.png`** — 180×180, for iOS home-screen bookmarks. Needs a
      PNG render; `app/icon.svg` covers every other surface

## Known rough edges

- [ ] **`components/docs/toc.tsx:68`** — `useExhaustiveDependencies` warning,
      inherited with the component. The fix is marked unsafe by Biome
- [ ] **No social card.** `pageMeta` emits no `og:image`, because there is no
      `public/` directory and the referenced files did not exist. Add a
      1200×630 `public/opengraph-image.png`, restore the `images` key, and put
      Twitter back to `summary_large_image`
- [ ] **Section roots are thin.** `/{product}` lists its groups and nothing
      else. A section with no pages shows a placeholder card
