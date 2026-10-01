# TODO

What is left. The SEO items keep the Sl numbers from `handbook/SEO-SOURCE.md`.

Finished work is not listed here. It is in the code, in `CLAUDE.md` for the
things that bite, and in `git log` for the rest.

## Tomorrow

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

## Keep the reference honest

`.github/workflows/replay.yml` replays every documented sample each morning and
opens an issue when an answer's shape stops matching its example. How it runs
is in `lib/api/replay.ts`; `pnpm replay` runs it locally from `.env`.

- [ ] **Two Spendgraph API bugs, filed 2026-10-01.** Raised in the spendgraph
      repo, so the fixes land there. `update-a-prompt` refuses a body without
      `projectId` with `409 project_immutable`, though the field is optional
      (fnLog0/spendgraph#31). The reference marks `projectId` required until
      then, so its sample works today; once #31 ships, make it optional again.
      Reusing an archived tool's name answers `500` (fnLog0/spendgraph#32)
- [ ] **Five Spendgraph endpoints are still unverified**, because they need a
      provider key on the account: `run-a-prompt`, `run-an-assay`, and the three
      that depend on a run existing. Their examples come from the zod schemas in
      the spendgraph repo, not from a call

## Open

Needs someone with an account this machine does not have.

- [ ] **Remove `doc.locusgraph.com` from the old Vercel project**, now that the
      name points at this worker and redirects here (moved 2026-10-01). Delete
      its entry in the `_vercel` TXT record too, and only that one: the record
      also verifies `app.`, `design.` and the apex

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
