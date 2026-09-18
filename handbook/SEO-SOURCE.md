# Nasim fix: LocusGraph parent + product SEO

**Date:** 2026-08-26  
**Owner:** Nasim  
**Lock:** parent marketing on www · product articles on www · apps on subdomains (noindex)

---

## 1. Product structure (any new product)

Every LocusGraph product uses the **same four surfaces**. Do not invent a fifth public URL.

| # | Surface | URL pattern | Index? | Purpose |
|---:|---|---|---|---|
| A | Product page | `https://www.locusgraph.com/{product}` | **Yes** | Marketing / landing |
| B | Product articles | `https://www.locusgraph.com/{product}-articles/{slug}` | **Yes** | SEO content for that product |
| C | Product app / login | `https://{product}.locusgraph.com/` | **No** | App shell, auth, product UI |
| D | Shared (not per-product) | see §2 | Mixed | Company, docs, IDE, API |

**Slug rules**

- `{product}` = lowercase kebab: `brainstorm`, `spendgraph`, `fnmoa`
- Articles folder = `{product}-articles` (always hyphen + `articles`)
- Article URL = `/{product}-articles/{slug}` (no articles on the app host)

**Checklist when launching a new product**

1. Create www **product page** `/{product}` (index)
2. Create www **articles collection** under `/{product}-articles/` (index when first article ships)
3. Stand up `{product}.locusgraph.com` for login/app (**noindex**)
4. Homepage / nav: marketing → www path; “Open app / Login” → subdomain only
5. Add product page + article URLs to the **www sitemap** (§3)
6. Do **not** put marketing or articles on the subdomain

**Current products**

| Product | A · Page | B · Articles | C · App |
|---|---|---|---|
| BrainStorm | `/brainstorm` | `/brainstorm-articles/{slug}` | `brainstorm.locusgraph.com` |
| Spendgraph | `/spendgraph` | `/spendgraph-articles/{slug}` (not started) | `spendgraph.locusgraph.com` |
| Fnmoa | not live | not live | not live |

**BrainStorm live example**

- Page: `https://www.locusgraph.com/brainstorm`
- Articles: `https://www.locusgraph.com/brainstorm-articles/…`
- App: `https://brainstorm.locusgraph.com` (noindex)

---

## 2. Shared hosts (not a “product”)

| Host | Role | Index? |
|---|---|---|
| `www.locusgraph.com` | Company + all product pages + all product articles | **Yes** |
| `locusgraph.com` (apex) | Redirect → www | Redirect only |
| `doc.locusgraph.com` | Shared product docs | **Yes** (own sitemap) |
| `app.locusgraph.com` | Shared IDE | **No** |
| `pressroom.locusgraph.com` | Shell today | **No** |
| `api.locusgraph.com` | API | **No** |

---

## 3. Sitemap structure (Framer + docs)

### www (Framer) — one auto sitemap

Framer builds and updates **one** file on Publish:

`https://www.locusgraph.com/sitemap.xml`

It already includes company pages, product pages (`/brainstorm`), and product articles (`/brainstorm-articles/*`). That is the plan. Do not hand-edit it. Do not split it.

**Operator steps**

1. Product page = normal Framer page: `/{product}` (index on)
2. Product articles = CMS (or pages) under `/{product}-articles/{slug}` (index on)
3. **Publish** after new articles (sitemap refreshes on Publish)
4. In GSC submit only: `https://www.locusgraph.com/sitemap.xml`
5. To drop a URL from the sitemap: turn off “Show in search engines” / noindex on that page, then Publish

**What should end up in that file**

| Include | Example |
|---|---|
| Company pages | `/`, `/pricing`, legal, `/blog/*` if indexed |
| Product pages | `/brainstorm`, `/spendgraph` |
| Product articles | `/brainstorm-articles/{slug}`, … |

**Keep out of the Framer sitemap** (by not hosting them on www, or noindex)

- App / login hosts (`brainstorm.locusgraph.com`, etc.)
- `app.*`, `api.*`, `pressroom.*`
- `doc.locusgraph.com` URLs (separate host)

### Docs host — its own sitemap

`https://doc.locusgraph.com/sitemap.xml` (Vocs/docs stack, not Framer). Submit separately in GSC.

### App / login hosts

Noindex. Do not submit a sitemap in GSC. Prefer `Disallow: /` in robots.txt and no `Sitemap:` line.

### robots.txt

**www** (Framer default is fine):

```text
User-agent: *
Allow: /

Sitemap: https://www.locusgraph.com/sitemap.xml
```

**doc:**

```text
User-agent: *
Allow: /

Sitemap: https://doc.locusgraph.com/sitemap.xml
```

**App example:**

```text
User-agent: *
Disallow: /
```

### Google Search Console

www GSC is already in use (exports exist under `growthos/seoos/output/25thAug/`). No “set up GSC from scratch” task.

When docs sitemap from §3 / Sl 6 is live: submit `https://doc.locusgraph.com/sitemap.xml` in the existing property. Do not submit app/login sitemaps.

---

## 4. Task list

Present execution only (live hosts / live gaps).

| Sl | Issue | Issue type | Fix | Steps to fix |
|---:|---|---|---|---|
| 1 | BrainStorm **app** (`brainstorm.locusgraph.com`) can appear in Google | Indexation | Keep app out of Google | 1) `noindex` meta on all app routes. 2) Prefer `X-Robots-Tag: noindex`. 3) Optional: `Disallow: /` in app `robots.txt`. 4) `/sitemap.xml` = real XML or 404 (not SPA HTML). |
| 2 | Main IDE (`app.locusgraph.com`) is indexable | Indexation | Hide IDE from Google | 1) `noindex` on all routes. 2) `X-Robots-Tag: noindex`. 3) Optional `Disallow: /` in robots.txt. |
| 3 | Pressroom (`pressroom.locusgraph.com`) is a thin indexable shell | Indexation | Hide from Google now | 1) `noindex` (+ header) on all routes. 2) Optional `Disallow: /`. 3) `/sitemap.xml` = real XML or 404 (not SPA HTML). |
| 4 | API (`api.locusgraph.com`) is crawlable | Indexation | Block crawling | 1) `robots.txt` → `Disallow: /`. 2) `X-Robots-Tag: noindex`. |
| 5 | Spendgraph has **two** public stories: `www/spendgraph` and `spendgraph.locusgraph.com` | Duplicate / IA | www = marketing; subdomain = login only | 1) Index only `www…/spendgraph`. 2) App subdomain **noindex**. 3) Move or 301 subdomain marketing → www `/spendgraph`. 4) Homepage: marketing → www; login → subdomain. |
| 6 | Docs (`doc.locusgraph.com`) hard for Google to crawl | Docs SEO | Proper docs crawl setup | 1) `robots.txt` Allow. 2) `sitemap.xml`. 3) Root **301/308** to intro (not JS). 4) Canonicals + meta descriptions. |
| 7 | `brainstorm.locusgraph.com/sitemap.xml` and `pressroom.locusgraph.com/sitemap.xml` return **200 + HTML** (SPA shell), not XML | Technical | Stop fake sitemaps on those two app hosts | 1) Open both URLs and confirm `Content-Type` is HTML today. 2) Change hosting so `/sitemap.xml` returns **404** (preferred for noindex apps) **or** a real empty/minimal XML sitemap. 3) Never serve the React/Vite app HTML for `/sitemap.xml`. 4) `app.locusgraph.com/sitemap.xml` already 404s — leave it. |
| 8 | Homepage (`https://www.locusgraph.com/`) CTAs incomplete vs model | IA | Marketing → www path; Login → product subdomain | **Where today:** homepage links `./brainstorm`, `./spendgraph`, `doc.locusgraph.com`, `app.locusgraph.com`. **Gap:** no Open app / Login to `https://brainstorm.locusgraph.com` or `https://spendgraph.locusgraph.com`. **Fix:** 1) Keep marketing links on www paths. 2) Add login/app CTAs to those two subdomains. 3) Do not point marketing CTAs at app hosts. |
| 9 | BrainStorm product page does not link into articles | Content IA | Wire `/brainstorm` → `/brainstorm-articles/*` | **Where:** `https://www.locusgraph.com/brainstorm` has **0** links to `/brainstorm-articles/`. Articles themselves are already on www (13 URLs in sitemap). **Fix:** 1) Add natural links/section from `/brainstorm` into `/brainstorm-articles/…`. 2) Re-publish Framer. 3) Spot-check one article URL still only on www (not on `brainstorm.locusgraph.com`). |
| 10 | `www…/spendgraph` missing from Framer sitemap | Sitemap | Indexable product pages must appear in `sitemap.xml` | **Where:** `https://www.locusgraph.com/sitemap.xml` has `/brainstorm` + 13 `/brainstorm-articles/*`, but **no** `/spendgraph`. Cause: `https://www.locusgraph.com/spendgraph` is `noindex`. **Fix:** 1) After Sl 5 makes www Spendgraph the marketing page, turn indexing **on** for that page. 2) Publish. 3) Confirm `https://www.locusgraph.com/spendgraph` appears in sitemap. 4) Re-check sitemap in existing GSC after publish (www property already active). |
| 11 | Doc titles noisy | On-page | Clean title template | Vocs/theme: `{Page} \| LocusGraph Docs`. |
| 12 | Spendgraph `robots.txt` duplicate blocks | Hygiene | One clean robots file | Dedupe `User-agent: *`; re-fetch. |

---

## 5. Priority

1. **Sl 1–4** — noindex apps / IDE / pressroom / API  
2. **Sl 5 + 8 + 9** — Spendgraph dual URL + homepage CTAs + BrainStorm articles check  
3. **Sl 6–7 + 10** — docs + SPA sitemaps + spendgraph in www sitemap  
4. **Sl 11–12** — polish  

---

## 6. Done when

- [ ] Live app hosts (`brainstorm`, `app`, `pressroom`, `api`) are **noindex** (or Disallow)
- [ ] Spendgraph: one indexed marketing URL on www; subdomain is login/noindex
- [ ] BrainStorm articles only on `www…/brainstorm-articles/*` and in www sitemap
- [ ] Doc robots + sitemap + root 301 + canonicals
- [ ] Homepage CTAs match marketing vs login
- [ ] After docs sitemap exists (Sl 6): submit it in existing GSC; do not submit app sitemaps

## Out of scope

- Future launches (Fnmoa, new article sections) — use §1 when building; not in §4
- www Framer article **body** QA (hub links, footer H1, etc.) → `growthos/seoos/output/25thAug/`

## One-line summary

Each product = www page + www `/{product}-articles` + noindex app subdomain. **www sitemap** lists marketing + articles; **doc sitemap** lists docs; **apps never get a sitemap in GSC**.
