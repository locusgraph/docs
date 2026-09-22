# TODO

What is left. The SEO items keep the Sl numbers from `handbook/SEO-SOURCE.md`.

Finished work is not listed here. It is in the code, in `CLAUDE.md` for the
things that bite, and in `git log` for the rest.

## Tomorrow

In this repo:

- [ ] **Breadcrumbs do not collapse on a narrow screen.** Flagged while building
      the API reference and never built

What the engine settled, 2026-09-22:

- **`scope` is gone.** A context holds one memory, by design rather than by
  accident, so `locusgraph/docs#2` is answered: there is nothing to document,
  and the pages that would have explained how to put two memories under one
  context now explain `replace: true` instead
- **An overwrite no longer reports `recorded`.** A write says `created`,
  `unchanged`, `replaced` or `filtered`, and changing what a context holds is
  refused with a `409` unless it asks
- **Four response fields were renamed**, and the pages that showed them are
  updated: `event_id` to `locus_id`, `kind` to `value`, `relevance` to
  `confidence`, `score` to `match_score`

Elsewhere:

- [ ] **Publish `@spendgraph/*` 0.8.3.** Needs `vault run`, which only you can
      start

## Keep the reference honest

Every example in `lib/api/endpoints.json` was checked against the live API on
2026-09-22, and nothing stops it drifting again. The corpus test only asserts
that a field is present, never that the API still answers that way.

- [ ] **A daily job that replays the samples.** Read `endpoints.json`, send each
      documented sample to the real API, and compare the **shape** of the answer
      to the stored example: same keys, same nesting, same types, never the
      values, because ids and timestamps change every run. Report a divergence
      as one issue naming the endpoint, the expected shape and the actual one.
      GitHub Actions on a cron in this repo is enough, with
      `LOCUSGRAPH_API_KEY`, `LOCUSGRAPH_GRAPH_ID` and `SPENDGRAPH_API_KEY` as
      secrets. Two things to decide first: the write endpoints need a scratch
      graph or they leave junk in a real one daily, and `deep-recall`,
      `run-a-prompt` and `run-an-assay` spend real money per run, so they want a
      `skip` flag on the endpoint rather than a run every morning

What this would have caught the day it broke, all of it found by hand instead:
the Spendgraph pages documenting `Authorization: Bearer` when the API takes
`x-api-key` and answers `401` to everything else, `usage-summary` documenting
`{costMicros, calls}` when the answer is `{current, previous, pricing}`, three
request samples that the API refuses with a `400` or `422`, and the event
vocabulary changing from `UserFeedback` to `user` under the examples.

- [ ] **Five Spendgraph endpoints are still unverified**, because they need a
      provider key on the account: `run-a-prompt`, `run-an-assay`, and the three
      that depend on a run existing. Their examples come from the zod schemas in
      the spendgraph repo, not from a call

## Open

Both need someone with an account this machine does not have.

- [ ] **Submit the sitemap.** `https://docs.locusgraph.com/sitemap.xml`, in the
      existing Search Console property, per Sl 6. Do not submit app sitemaps
- [ ] **`doc.locusgraph.com` still points at Vercel.** A CNAME to
      `vercel-dns-017.com` holds the name, which is why this host is `docs.`.
      Redirect `doc.` here once that is untangled, so the spec's hostname and
      any links already written against it still resolve

## Deferred

Both exist as routes and stay off the host index while `ready: false`. The
landing page points anyone who finds them at early access.

- **BrainStorm**: 0 pages. Needs source material before anything can be written
- **Locus Skill**: 0 pages, and still on the lucide `Workflow` placeholder in
  `components/site/product-mark.tsx`. Needs its own mark as well as content

## Decisions worth not relitigating

**The root is a page, not a redirect.** Sl 6 says the root should 301 to an
intro. That was written when the docs were one product. This host serves several
sections, so redirecting would pick a winner and bounce everyone else. The root
is an indexable index instead.

**`@spendgraph/workflows` stays up, undeprecated.** Versions 0.2.0 to 0.6.0 are
public on npm from before the package was made private. Deprecating them was
considered and declined on 2026-09-19: the package may be worth shipping again,
and a notice on every install is the wrong signal for something only paused. The
reasoning is in the spendgraph repo, in `handbook/PUBLISH.md`.
