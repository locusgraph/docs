# TODO

What is left. The SEO items keep the Sl numbers from `handbook/SEO-SOURCE.md`.

Finished work is not listed here. It is in the code, in `CLAUDE.md` for the
things that bite, and in `git log` for the rest.

## Tomorrow, 2026-09-20

In this repo:

- [ ] **Breadcrumbs do not collapse on a narrow screen.** Flagged while building
      the API reference and never built
- [ ] **`/locusgraph/client/errors` needs one more sentence once #28 lands.** It
      now says a later write to a context takes the place of what was there, and
      stops short of saying how to avoid that, because `scope` is the answer and
      no caller can set it yet

Waiting on the engine, tracked in `locusgraph/engine`:

- [ ] **#28, `scope` reaches no caller.** `POST /v1/events` and MCP
      `store_event` both drop it, so a context holds one memory in practice.
      Nothing in `locusgraph/docs#2` can be written until this lands, because
      the only honest instruction today is to attach links with different
      prefixes
- [ ] **#27, an overwrite reports `recorded`.** A write that replaced a memory
      is indistinguishable from one that stored a new one. Separate from #28 and
      worth fixing first, since it costs data today
- [ ] **PR #21, observe path hardening**, and **PR #22, the rename to
      `engine`.** Both open against `dev`

Once #28 lands, `locusgraph/docs#2` is twelve pages. Three are a straight edit
once `scope` is documented. `count` on `/locusgraph/api/list-contexts`,
`min_refs` on `/locusgraph/api/walk-a-graph` and `min count` on
`/locusgraph/contexts/browsing` count scopes rather than memories, and whether
that stays described as memories is a product call, not a docs one.

Elsewhere:

- [ ] **Publish `@spendgraph/*` 0.8.3.** Needs `vault run`, which only you can
      start

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
