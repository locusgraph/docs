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

- [x] **Spendgraph prose swept.** The human-voice rules now cover the package
      pages too, at source, in the spendgraph repo. Visible here once 0.8.0 is
      published
- [x] **Spendgraph has figures.** Eight, in
      `components/docs/spendgraph-diagrams.tsx`, one on each package's opening
      page. A package page may reference a component it does not ship, so these
      live here and the packages name them; `tests/components.test.ts` holds
      that seam. Visible here once 0.8.0 is published

## Packages

- [x] **npm is level at 0.8.1.** All eleven packages, published and installed
      here, so the rendered docs match the code they describe. The four SDK
      pages that were kept locally now come from `@spendgraph/sdk/docs/`, and
      `content/spendgraph/` is down to the three pages that belong to no
      package: overview, getting-started, concepts
- [x] **`workflows` and `examples` need no section.** Both are `private: true`,
      so neither publishes anything new and neither is meant to be documented
      here. `workflows` 0.2.0 to 0.6.0 are still on npm from before that flag,
      and stay there
- [x] **`@spendgraph/workflows` 0.6.0 stays up, undeprecated.** Decided
      2026-09-19: the package may be worth shipping again, and a deprecation
      notice on every install is the wrong signal for something that is only
      paused. Versions 0.2.0 to 0.6.0 remain public and installable; the package
      is `private: true` in the repo, so nothing new publishes until that
      changes. Revisit only if it is abandoned for good

## Build and tooling

- [x] **`sharp` builds.** It never needed `pnpm approve-builds`. pnpm 12 reads
      `allowBuilds` from `pnpm-workspace.yaml`, and ours held the placeholder
      text `set this to true or false` rather than booleans, which is what
      failed every install with `ERR_PNPM_IGNORED_BUILDS`. Now `sharp: true`,
      `esbuild: false`, `workerd: false`

### pnpm 12 withholds a fresh release

`minimumReleaseAge` refuses a version published in the last day. Good against a
compromised release, wrong for packages we cut ourselves: these docs and the
code they describe ship in the same hour, so the gate only delays our own work.
`minimumReleaseAgeExclude` is scoped to `'@spendgraph/*'`; everything else keeps
the wait. Before that it held one-off entries per version, which had to be
edited on every release.
- [x] **Deploy script renamed to `deploy:cf`.** The old name `deploy` collided
      with pnpm's own command and failed with `ERR_PNPM_INVALID_DEPLOY_TARGET`
- [x] **Apple icon.** `app/apple-icon.tsx`, drawn the same way. iOS ignores
      SVG for home-screen bookmarks and falls back to a screenshot without it

## Known rough edges

- [x] **`toc.tsx` warning resolved.** The rule was wrong: `pathname` is the
      effect's re-run key, not a value it reads, and taking the suggested fix
      would leave the outline showing the previous page's headings. Suppressed
      with the reason on the line
- [x] **Section roots rebuilt.** The section's own pages first, then one card
      per group with its blurb and page count, and a line saying how much is
      there. The old page flattened every tree's sections, so Spendgraph showed
      "Start here" twice and rendered all 73 pages as one wall

## Deferred

Both sections exist as routes and stay off the host index while `ready: false`.
The landing page already points anyone who finds them at early access.

- **BrainStorm**: 0 pages. Needs source material before anything can be written
- **Locus Skill**: 0 pages, and still on the lucide `Workflow` placeholder in
  `components/site/product-mark.tsx`. Needs its own mark as well as content
