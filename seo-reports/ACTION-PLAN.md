# Bhaagyavedh — SEO Action Plan

**Audit date:** 2026-04-20 · **Health score:** 86/100

Priority legend: **P0** critical (fix now) · **P1** high (this week) · **P2** medium (this month) · **P3** low (backlog)

---

## P0 — Critical

### P0.1 Fix sangrah page payload (1.9 MB, 160 inline scripts)
**Impact:** LCP + INP + TBT on mobile. Likely ranking blocker for `sangrah`/devotional queries.
**Where:** `src/app/[lang]/sangrah/page.tsx` (or equivalent route) + data loader
**Fix:**
1. Run Lighthouse mobile throttled against `/mr/sangrah` — capture LCP/INP/CLS baseline.
2. If the page embeds full item list inline, split to (a) SSR-rendered 20 top items + (b) client-side paginated / infinite-scroll the rest.
3. Move large static arrays out of the component render tree into a separate chunk.
4. Confirm no JSON-LD dump contains per-item `Article` for 50+ items — use `CollectionPage` + `ItemList` with links instead of nested `Article` blocks.

---

## P1 — High (this week)

### P1.1 Deduplicate title brand suffix
**Impact:** Lost SERP real estate. All pages currently end `| भाग्यवेध | Bhaagyavedh भाग्यवेध`.
**Fix:** Pick one — recommend `| Bhaagyavedh भाग्यवेध`. Drop the preceding `| भाग्यवेध`.
**Where:** title-template in root layout / metadata helpers.

### P1.2 Trim long titles
**Impact:** SERP truncation on about + calendar.
**Fix:**
- `/mr/about` current (87c) → `आमच्याबद्दल — भाग्यवेध मराठी ज्योतिष प्लॅटफॉर्म`
- `/mr/calendar` current (90+c) → `हिंदू दिनदर्शिका 2026 — मराठी कॅलेंडर | भाग्यवेध`

### P1.3 Expand thin content on panchang / rashifal / calendar
**Impact:** Thin-content risk flag. Low dwell time signals.
**Fix:** Add 200–300 words explainer + 5-item FAQ per page:
- Panchang: what is तिथी/नक्षत्र/योग/करण/राहू काळ and how to read.
- Rashifal: methodology (ग्रह गोचर), 12 signs descriptor, daily/weekly/monthly links.
- Calendar: month-by-month summary, major festivals 2026.

### P1.4 Generate page-specific OG images
**Impact:** Social CTR + AI visual citations.
**Fix:** 5 Devanagari OG templates (1200×630) with page title + brand watermark:
- kundli, panchang, rashifal, sangrah, yatra
- Optional: per-rashi OG for 12 rashifal pages.
**Where:** Next.js `generateImageMetadata` or `opengraph-image.tsx` per route.

### P1.5 Fix `llms.txt` language declaration
**Impact:** AI crawlers currently told site is bilingual — Hindi content invisible to Claude/ChatGPT/Perplexity.
**Where:** `/public/llms.txt`
**Fix:**
- `## Languages` → add `- Tertiary: Hindi (hi)`
- Update description line: "Bilingual: Marathi and English" → "Trilingual: Marathi, Hindi, and English"
- `## Language URL Patterns` → add `- Hindi: https://bhaagyavedh.com/hi/<path>`

---

## P2 — Medium (this month)

### P2.1 Flesh out panchang H-structure
Add H2 sections: तिथी, नक्षत्र, योग, करण, राहू काळ, गुलिक, यमगंड.

### P2.2 Add CollectionPage / ItemList schema on sangrah
Declare category taxonomy so Google understands the index semantic.

### P2.3 Add AggregateRating schema
If any consultation/pooja reviews exist, add `AggregateRating` on `consultation`, `pooja-services`, `yatra` pages.

### P2.4 Add Content-Security-Policy header (report-only → enforce)
**Where:** `next.config.ts` `headers()` or middleware.
**Phase 1:** `Content-Security-Policy-Report-Only` with `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';`
**Phase 2:** tighten script-src (hashes), remove unsafe-eval, enforce.

### P2.5 Expand FAQ blocks across top pages
Current FAQ on kundli/panchang/rashifal. Add to: about, calendar, terms-of-service (schema drops are OK for terms if genuinely Q&A).

### P2.6 Rashifal 12-sign index
Upgrade from 1 H2 / 0 H3 to 12 H2 per rashi with short teaser + link to deep page.

### P2.7 robots.txt completeness
Add `Disallow: /kundli/result` (currently only `/*/kundli/result` listed).

### P2.8 Add `og:locale` + `og:locale:alternate`
Declare locales on Open Graph so social platforms and AI crawlers pick right share language.
- `og:locale` = `mr_IN` / `hi_IN` / `en_IN` per page
- `og:locale:alternate` = the other two.

---

## P3 — Low / Backlog

### P3.1 Add Person schema for founder / expert
On `/about` and any blog article author byline.

### P3.2 Add hero imagery
Astrology niche benefits from visual (rashi icons already exist under `/rashi-icons-preview`). Use above the fold on /kundli, /panchang, /rashifal.

### P3.3 Add COOP + CORP headers
`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`.

### P3.4 Add ClaimReview / HowTo schema
`HowTo` on kundli-matching ("How to check compatibility") and muhurat ("How to pick auspicious date") pages.

### P3.5 Author bylines on blog
Add `Person` schema + visible byline + "last updated" timestamp.

### P3.6 Lazy-load imagery
Add `loading="lazy"` + `decoding="async"` on below-fold images when imagery expanded.

### P3.7 Set up drift baseline
Run `seo-drift` to snapshot current on-page SEO, then compare on each deploy.

---

## Validation checklist after fixes

- [ ] Lighthouse mobile LCP < 2.5s, INP < 200ms, CLS < 0.1 on `/mr/sangrah`
- [ ] All titles < 60 chars in SERP simulator
- [ ] `/llms.txt` lists 3 languages + hi URL pattern
- [ ] OG image unique per top-level section
- [ ] CSP enforced without blocking legitimate resources
- [ ] `curl -sI /kundli/result` — blocked by robots.txt + `noindex` meta
- [ ] GSC URL inspection green on kundli, panchang, rashifal, sangrah
- [ ] Schema markup validator clean on all top pages
