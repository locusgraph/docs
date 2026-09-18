# TODO

What is open across the packages. Closed items are not kept here — the reasoning
for one is in the commit that closed it, and `git log TODO.md` walks them back.

**6 open · nothing blocking a release · 1 at deploy · 1 in review**

`noesis-plan-chain` is merged, 0.7.0 is published, and #16 and #17 are on
master with the worker deployed. Nothing open fails a run: what is left is
`wikidata` never being the tool a live run picks, a follow-up that inherits the
links but not the findings, a follow-up asking for a write-up researching it
all over again, and multi-select. What #16 and #17 closed is in their commits,
which `git log TODO.md` walks back to. The mockups, the ask shapes and the
loader copy are in **Before Decompose**, pinned in the sidebar:
https://claude.ai/code/artifact/b86adda3-feac-4dfb-b312-357b6fe4f7cb
It is private to whoever published it, so share it from the page before pointing
a teammate at this line.

## Open

### Designed, not built

- [ ] **"Give me an article on that" researches it all over again.** A follow-up
      that asks for the last answer written up should go straight to writing.
      It does not: it runs brief, research, the whole chain, and pays a second
      time for what turn one already found.

      Three things make it do that, and only the first is triage.

      `edge("route", "straight", route === "direct" && !authorNeeded)` — the
      guard added when triage learned `author_needed` — means a question that
      wants a document can never take the direct path. That guard is not wrong
      on its own: `straight` is terminal, `end("straight")`, with no edge to
      `author`, so a run that went there could not write anything. But the two
      together say *any* document costs a full research pass, however much is
      already known.

      `wantsDocument` then requires `compose.accepted`, so `author` is only ever
      reachable after `compose` — which is only reachable after `choose`, which
      is only reachable after `research`. There is no path to `author` that does
      not research first. Teaching triage to say "this one is just a write-up"
      changes nothing while the graph has nowhere for that answer to go.

      And the third is the entry below: a follow-up inherits the links but not
      the findings. Even given a path that skipped research, `author` would have
      no grounds to write from — `documentQuestion` builds on the answer's
      grounds and the run's own findings, and a follow-up has neither. The two
      items are one problem from opposite ends, and neither is fixable alone.

      So the shape is a path, not a field: something like `route → author`
      directly, or `straight → author`, fed by findings carried across runs.
      Worth deciding which before writing any of it.

- [ ] **A monthly allowance is not a price, and nothing tracks one.** Consensus
      bills the plan, not the call: basic paper search — the endpoint
      `paper_search` uses — is free, and what is rationed is 10 Pro messages and
      3 Deep reviews a month. `costOf` speaks micro-USD and cannot say "three
      left until the first of the month", so nothing sees that ceiling coming.
      It cannot be hit today, because only the free endpoint is called; it
      becomes real the moment anything reaches for a Deep review.

      This entry exists because two readers got it wrong the same way. A review
      said Consensus recorded no cost and called it real money reading as free;
      the answer to that was `CONSENSUS_COST_MICROS`, carrying a
      contracted per-search rate. There is no per-search rate. Recording nothing
      for a basic search is correct, and the rate machinery was reverted before
      it shipped. What the reasoning was reaching for is a quota, which is a
      different shape: a count against a period, per provider, read back from
      somewhere — the reply carries no allowance either.

      The one real bug underneath it is fixed and separate. `asking()` returned
      the prose alone, so any cost the wrapped tool reported was dropped, and
      the wrapper declared no `costOf` for one to land on. That affected every
      priced tool behind the wrapper, not only this one.

- [ ] **`wikidata` is never the tool a live run uses.** Three runs of a question
      with an entity leg, an evidence leg and a moving-fact leg, and every one
      came back `found N with web_search, paper_search`. The founding fact was
      answered correctly each time — by `web_search`, which costs more and is
      the wrong instrument for a curated property.

      What is established. The tool works: checked against the live API across
      nine kinds of ask, and three bugs fixed on the way — its description
      advertised `'Cloudflare: founded'` and `'Paris: population'`, neither of
      which returned anything; `matching()` was a strict substring test so
      `founded` never reached `inception`; and the 30-fact cap was applied
      before the narrowing, so asking Paris about population searched only its
      first 30 statements. It also declares `wants: { name: "entity" }` now,
      without which research could never reach it — `asking()` hands over the
      whole sub-question, and Wikidata is searched by name.

      Routing is not obviously the fault either. Decompose named `wikidata` in
      15 of 16 probes: five on the question alone, five with a `<context>`
      block, three on the question as the brief restates it, and two of three on
      the restatement. The one miss was on the restatement — `"the founding
      details of Novo Nordisk"` is vaguer than `"who founded it and in what
      year"`, and the research node passes `subjectOf(...)`, the restatement,
      rather than the question. That is a real effect but one in three, which
      does not explain three live runs out of three.

      What is left to vary: `information_given` and `information_needed`. The
      live path fills both from `briefing()`; every probe above left them empty.
      That is the next thing to test and should have been the first.

      Not urgent. Every leg is answered correctly whichever tool runs, so this
      costs money rather than accuracy — a cheap tool passed over for an
      expensive one. It should not hold a release.

- [ ] **A follow-up inherits the links but not the findings.** The transcript
      carries `sources already read:` and decompose is told to reuse rather
      than re-derive, so the cheapest half is done. What a follow-up does not
      get is the evidence itself, so a question that needs the same fact at
      more depth re-fetches the page it already paid for.

      Planned, not started. An earlier note said this needs a store the `runs`
      table does not have; tracing it says otherwise. `segment.ts` already ends
      an answered run with `memory.observe({ question, answer: claim, grounds
      })`, and `recall` is in `alwaysAsk` and `trusted`, so a carry-over path
      exists and works. It is fed too little and too rarely.

      Three things, in the order they are worth doing.

      **Observe the findings, not the claim.** Each is a `{ question, answer,
      sources }` that was actually looked up, and a sub-question is a far
      better recall key than a whole answer — "the same fact at more depth" is
      a sub-question match, not an answer match.

      **Then observe every run, not only `answered`.** This depends on the
      first and cannot be done alone: an escalated run's claim is contested and
      an abstention has none, so widening the status check while still storing
      the claim would record a guess as a fact. Findings stay true whether or
      not the argument closed, which is what makes keeping a failed run safe.
      Today this is the whole of the loss — the four semaglutide runs measured
      above all escalated, and every one discarded its evidence.

      **Only then consider a table.** `runs` holds metadata and the turns live
      in the durable object, so this means a new table, not a column. It buys
      the wrong index: D1 has no regex and no vector search, so it answers "run
      N's findings" when the question is "the finding relevant to this". That
      is what the graph already does.

      None of it needs a model. `packages/tools` does not depend on `llms` and
      nothing under `memories/` imports one — observe is an HTTP write and
      recall an HTTP read. The cost is one larger write per run and the tool
      call `alwaysAsk` already makes. Resist summarising or deduplicating
      findings before storing them; that is the one step that would need a
      model, and ranking is what the graph is for.

      The hole to size first: `deps.memory` exists only where the project has a
      `graphId`. Without one there is no observe and no recall, so for those
      projects this does not carry over badly — it does not carry over at all.
      Whether that is acceptable decides between feeding `observe` better and
      building a store that works without a graph, and only the second needs
      the table.

- [ ] **Ticking more than one option means answers become plural.** Filed for
      a long time as "`checklist` is the fifth ask shape", which is the wrong
      name for it and is why it never moved.

      The four shapes do one job between them: replace the question with a
      better-specified one. `BriefChoice.subject` is "what research would use
      if this one is picked" — singular on purpose, which is why two ticked
      subjects read as a contradiction rather than a sum. A checklist is not
      disambiguation, it is scoping the work, so putting it beside the four
      makes `subject` mean two things.

      The cost is not the shape. The answer is a string the whole way down —
      `taken()` returns one id, `answered_<at>@<pass>` holds one, `took()`
      compares one, `answerBody` takes one `choice`, and the durable record
      stores one. Multi-select makes every one of those plural, across
      `workflows`, `worker` and the dashboard.

      The decompose overlap is not undecided; the code already settled it.
      `brief.information_needed` is a `string[]` that reaches decompose through
      `briefing.ts`, and a ticked list of parts is exactly that. So a checklist
      seeds decomposition rather than replacing it, and nothing is paid twice —
      seeding is the better half anyway, because a person's list carries no
      `verify_by`, no `done_when` and no tool hint, and decompose writes those.

      Two cheaper things reach most of it. `edit` already hands the person the
      draft to correct, so someone who wants three aspects covered can type
      them today for no code at all. And letting the brief mark an
      `information_needed` entry as required, which decompose must then keep,
      is one field and no wire change. Ranked below the follow-up findings
      above: that one stops re-fetching pages already paid for, this one is a
      nicer control for something `edit` can already say.

### At the next deploy

- [ ] **Gemini spend already stored is over-billed, by up to 81%.** Until
      `ea3d7a4`, the Gemini adapter reported thinking tokens twice — inside
      `outputTokens` and again as `reasoningTokens` — and `computeCostMicros`
      bills the second apart, at the output rate. A reply that spent 82 tokens
      thinking on a 9-token answer was charged for 173. Fixed going forward; the
      rows written before it are not. They are reachable: `reasoningTokens > 0`
      on a Gemini model, through `/api/v1/ingest` and the rollouts route.
      Decide at deploy whether to recompute them or leave them — either is
      defensible, but the number is wrong until someone says so out loud.
      `tests/pricing/thinking-tokens.test.ts` pins what it should have cost.

## In review

- [~] **The playground suggested a model the API refuses.** PR #15.
      `gemini-2.5-pro` answers "no longer available to new users"; the shortlist
      now names `gemini-3.8-flash`, which is what an unasked run defaults to.
      `ListModels` still lists the retired one, so only a call reveals it.

## Not taken, on purpose

Rulings, not tasks. Reopen one only with the evidence that changes it.

- **`DEFAULT_FEEDBACK_PCT` stays at 70.** GEPA splits `D_train` into
  `D_feedback` and `D_pareto` and names no ratio; the only sizing it gives
  points the other way — *"tracking candidates' validation performance accounts
  for majority of GEPA's rollout budget, sample efficiency can be further
  improved by evaluating on a smaller validation set"* — and DSPy's GEPA page
  says to keep as much data as possible in the feedback set. The 20/80 advice
  that looks like it contradicts this is DSPy's guidance for prompt optimizers
  in general, not for GEPA. Reflection is cheap in data; selection is what the
  budget is spent on.

  The naming is what misleads, and `sealed` is the answer: `held_out` is doing
  `D_pareto`'s job, selected on generation after generation, and `sealed` is the
  only slice that plays `D_test`. A final number quoted off `held_out` is
  quoting a slice the search has been choosing against all along.

- **No minimum size for a held-out slice.** `problem()` refuses a slice of zero
  and nothing else. No threshold is defensible without the effect the caller
  wants to detect — the standard sizing formula needs it, and `casesNeeded` is
  where it belongs. `Dataset.resolution()` reports the part that *is*
  arithmetic: `1 / held_out`, the share one case carries, so a 0.02 improvement
  over four held-out cases reads as the impossibility it is.

- **Publishing stays outside the `author` stage.** It returns markdown and image
  urls; `lib/files/render.ts` turns markdown into md, html, txt or pdf after the
  stage returns. A stage that published and then came back malformed would
  publish twice, and `attempting` retries by default.

- **The composer sends on a tap, except where words are the answer.** A tap is
  the answer on every ask whose options are already written down; only `edit`
  holds the pick, because there a box can still change, unpick or override it.
  Held everywhere was one click too many on a gate that cannot be reconsidered
  anyway — the second tap landed on a button nothing had changed.

- **`evals` formats micro-USD itself**, in `runner/report.ts` and
  `assay/loop.ts`. That package has no dependencies at all, deliberately — its
  judge, embedder and runner are all injected for the same reason — and one line
  of `toFixed` is not worth being the thing that gives that up.

- **harness `parallel.merge` and `refine.judge` throw out of the run.** Merge is
  the caller's own pure code; judge should probably become a failed result, but
  that is a behaviour change to decide on its own.
- **graph emits no `node_start`** when a node's `input()` throws.
- **graph `tokensOf` drops a node's own totals** when its nested steps carry
  none, and reports nothing at all for a node returning something that is not a
  `NodeOutcome` — which every noesis node does. `billedIn` reads the `usage`
  inside the step's own output instead; fixing it in `graph` would let that go.
- **harness `chain.resume` budgets `taken` by steps**, not nodes.
