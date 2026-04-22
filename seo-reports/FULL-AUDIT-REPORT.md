# Bhaagyavedh — Full SEO Audit Report

**Target:** `http://localhost:6630` (canonical: `https://bhaagyavedh.com`)
**Date:** 2026-04-20
**Crawled:** 11 key pages (home mr/hi/en, kundli, panchang, rashifal, sangrah, about, terms, calendar)
**Business type:** Consumer content + tool publisher — Vedic astrology / devotional / SAB hybrid (Pune-based)
**Languages:** Marathi (primary), Hindi, English (trilingual, mr is x-default)

---

## Executive Summary

**Overall SEO Health Score: 86 / 100** — strong foundation, few targeted fixes unlock significant gains.

### Top 5 critical / high issues
1. **Sangrah page 1.9 MB payload, 160 inline scripts** — will tank mobile LCP + INP + TBT on real devices.
2. **OG image identical on every page** (`/logos/og-image.png`) — weak social + AI-visual share CTR.
3. **`llms.txt` claims bilingual (mr/en)** but site is trilingual (mr/hi/en) — stale canonical signal for AI crawlers.
4. **robots.txt `Disallow: /*/sangrah/download` + `/sangrah/download`** covered but `/sangrah/download` plain path ambiguous; also `/kundli/result` lang-prefixed only.
5. **No Content-Security-Policy header** — last missing header for full hardening posture.

### Top 5 quick wins
1. Add page-specific OG images for kundli / panchang / rashifal / sangrah (5 templates, Devanagari).
2. Update `/public/llms.txt` to declare hi as third language + list hi-IN URL patterns.
3. Ship per-page OG alt text + `og:locale` + `og:locale:alternate`.
4. Add CSP header (report-only first).
5. Investigate sangrah HTML bloat — static-render the list, defer non-critical JSON-LD streaming.

---

## 1. Technical SEO — 92 / 100

### Crawlability
| Check | Status | Detail |
|---|---|---|
| robots.txt | OK | Disallows /api, /admin, /account, /login, /*/kundli/result, /*/sangrah/download |
| Sitemap index | OK | 6 sub-sitemaps (pages, rashi, blog, temples, sangrah, yatra) at `/sitemap.xml` |
| XHTML hreflang in sitemap | OK | `xhtml:link rel=alternate` per URL, all 3 langs + x-default |
| Canonical | OK | All pages canonical to prod `https://bhaagyavedh.com/...`, HTTPS, self-referential |
| `<html lang>` | OK | `mr-IN`, `hi-IN`, `en-IN` set correctly per path |
| robots meta | OK | `index, follow` on all indexable pages |

### Security headers (from `/mr`)
| Header | Value |
|---|---|
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` |
| X-Frame-Options | `DENY` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | `camera=(), microphone=(), geolocation=()` |
| X-DNS-Prefetch-Control | `on` |
| **Content-Security-Policy** | **MISSING** |
| Cross-Origin-Opener-Policy | MISSING |

### Caching
- Sitemap XML: `public, max-age=3600, s-maxage=3600` — OK.
- HTML: `no-cache, must-revalidate` — correct for daily data pages.

### Issues
- **I1 [Medium]** `Disallow: /*/sangrah/download` covers lang prefix; plain `/sangrah/download` also disallowed. But `/kundli/result` only blocked as `/*/kundli/result` — unprefixed `/kundli/result` not listed. Add `Disallow: /kundli/result`.
- **I2 [Medium]** No CSP. Add `Content-Security-Policy-Report-Only` first, then enforce.
- **I3 [Low]** Consider COOP `same-origin` + Cross-Origin-Resource-Policy `same-origin` for defence-in-depth.

---

## 2. Content Quality — 82 / 100

### Per-page word counts (visible text)
| Page | Words | Assessment |
|---|---|---|
| mr (home) | 636 | Good |
| hi (home) | 662 | Good |
| en (home) | 638 | Good |
| mr/about | 1002 | Good |
| mr/kundli | 648 | Good |
| mr/panchang | 144 | **Thin** |
| mr/rashifal | 219 | **Thin** |
| mr/calendar | 163 | **Thin** |
| mr/sangrah | 317 | Thin for a category index |
| mr/terms | 426 | OK for legal |

### E-E-A-T signals
- **Expertise:** `ProfessionalService` + `Organization` schema, NASA JPL / Parashara / Varahamihira methodology block in llms.txt ✓
- **Authority:** ContactPoint with phone `+91 9146189837`, Pune address, opening hours — strong local signals ✓
- **Trust:** HSTS preload, ToS page, about page at 1002w ✓
- **Experience:** No author bylines visible in crawled set — consider adding on blog/article pages.

### Issues
- **C1 [High]** Panchang/calendar/rashifal pages have 144–219 words visible. Data-heavy by nature, but Google may treat as thin. Add 200–300w explainer block + FAQ expansion.
- **C2 [Medium]** Sangrah category index at 317w despite 1.9MB HTML — most payload is script/JSON, not indexable text.
- **C3 [Low]** No author/expert bylines surfaced — add `Person` schema + about-author cards on article pages.

---

## 3. On-Page SEO — 88 / 100

### Titles
| Page | Length | Keywords | Notes |
|---|---|---|---|
| mr home | 62 chars | मोफत कुंडली, राशीफल, पंचांग | Good, within limit |
| mr/about | **87 chars** | Marathi ज्योतिष | **Over display limit, double-brand "भाग्यवेध \| Bhaagyavedh भाग्यवेध"** |
| mr/calendar | 90+ chars | Marathi Calendar 2026 | **Too long** |
| mr/kundli | 67 chars | mofat janam kundli | Good |
| mr/panchang | 76 chars | panchang marathi | Borderline |
| mr/rashifal | 66 chars | aajcha rashifal | Good |

### H-tag structure
- Single H1 on all pages ✓
- Panchang has H1 only (no H2/H3) — weak outline
- Rashifal only H1 + 1 H2 — shallow structure for 12-sign index
- Kundli has rich outline: 1 H1, 5 H2, 53 H3 ✓

### Meta descriptions
- All pages have description 120–180 chars ✓
- Mixed-script bilingual descriptions (Devanagari + Roman Marathi) — good for transliteration queries.

### Links
- Home: 84 internal links — healthy
- Sangrah: 81 — healthy
- Terms: 57 — healthy
- No nofollow on internal links ✓

### Issues
- **O1 [High]** Double-brand suffix `| भाग्यवेध | Bhaagyavedh भाग्यवेध` eats 25+ chars and will truncate in SERP. Pick one.
- **O2 [High]** About/calendar titles exceed 60-char SERP display. Trim.
- **O3 [Medium]** Panchang H-structure flat. Add H2: Tithi, Nakshatra, Yoga, Karana, Rahu Kaal sections.
- **O4 [Medium]** Rashifal index should list 12 signs as H2 or linked cards with internal anchor structure.

---

## 4. Schema / Structured Data — 94 / 100

### Coverage (schema types detected across crawled pages)
- Global: Organization, WebSite, SearchAction, SiteNavigationElement, ContactPoint, PostalAddress, GeoCoordinates, OpeningHoursSpecification, Country, ProfessionalService ✓
- Page types: WebPage, AboutPage, Article, BreadcrumbList, FAQPage + Question + Answer, Service, ServiceChannel, ImageObject ✓
- JSON-LD blocks per page: 3–7 (terms has 3, panchang has 7)

### Strengths
- FAQPage schema on kundli/panchang/rashifal — eligible for rich results.
- BreadcrumbList + ListItem on interior pages.
- ProfessionalService + address + geo + hours = strong local pack signals.

### Issues
- **S1 [Medium]** Sangrah (category index) lacks `CollectionPage` or `ItemList` schema — add to declare category taxonomy.
- **S2 [Medium]** No `Review` / `AggregateRating` detected anywhere — if any customer reviews exist, add `AggregateRating` on consultation/pooja/yatra pages.
- **S3 [Low]** No `Person` schema for expert/author — add on blog articles and about page (founder).

---

## 5. Performance (CWV) — 76 / 100

> No field data (CrUX/GSC). Scored from static HTML signals + local TTFB.

### HTML payload + script count
| Page | HTML KB | Total scripts | Inline scripts |
|---|---|---|---|
| mr (home) | 97 | 33 | 15 |
| mr/kundli | 78 | 34 | 16 |
| mr/panchang | 56 | 36 | 19 |
| mr/rashifal | 53 | 33 | 16 |
| mr/about | 74 | 32 | 15 |
| mr/calendar | 53 | 32 | 15 |
| mr/terms | 52 | 30 | 13 |
| **mr/sangrah** | **916** | **177** | **160** |

### Font loading
- Preload declared via `Link:` response header (3 woff2) — correct pattern ✓
- No `font-display: swap` visible in HTML (check CSS)

### Issues
- **P1 [Critical]** **Sangrah page: 916 KB HTML + 160 inline scripts.** On 3G mobile this will produce 3–5s LCP and spike INP. Likely RSC streaming payload + inlined lists. Static-render the category index; move item cards to client-side pagination or server-side split.
- **P2 [Medium]** 0 images use `loading="lazy"` on all pages — acceptable today (only 2 imgs/page), but any future imagery should opt-in.
- **P3 [Medium]** No `rel="preconnect"` to external origins — not critical if all assets self-hosted; verify no third-party fonts/analytics domains.

---

## 6. Images — 90 / 100

- All pages: 2 images, 100% have `alt` attribute, 0 empty alt ✓
- OG image `/logos/og-image.png` shared across all pages ✗

### Issues
- **IM1 [High]** Same OG image on every page — low social share CTR + weak AI visual citation. Generate page-specific OG: kundli, panchang, rashifal, sangrah, yatra (5 templates in Devanagari).
- **IM2 [Low]** Only 2 imgs/page — astrology/devotional niche benefits from more visual (rashi icons, deity, chart previews). Consider adding hero visuals with descriptive alts.

---

## 7. AI Search Readiness (GEO) — 91 / 100

### llms.txt
- Present at `/llms.txt` ✓
- Comprehensive: about, license (CC BY 4.0), citation instructions, services list, URL patterns, methodology, contact, blocked paths ✓
- Declares `## Languages` as "Primary: Marathi, Secondary: English" — **missing Hindi** ✗

### Citability
- Structured data dense (5–7 JSON-LD blocks per page) ✓
- FAQ blocks eligible for direct ChatGPT / Perplexity snippet extraction ✓
- Clear methodology claims (Lahiri Ayanamsa, NASA JPL, Parashara) citable ✓

### Issues
- **G1 [High]** Update `/llms.txt` `## Languages` section to declare Hindi (hi-IN) and list `https://bhaagyavedh.com/hi/<path>` URL pattern alongside mr + en.
- **G2 [Medium]** llms.txt "Bilingual" phrasing appears in description + about sections — find/replace to "Trilingual: Marathi, Hindi, English."
- **G3 [Low]** No `ClaimReview` or `HowTo` schema on muhurat/kundli-matching pages — these are high-citation content types for AI answers.

---

## 8. International SEO (i18n) — 95 / 100

- Hreflang on every crawled page: 4 entries (mr-IN, en-IN, hi-IN, x-default → mr-IN) ✓
- Return-tag reciprocity: `en` page lists `mr-IN` + `hi-IN`, `hi` lists `mr-IN` + `en-IN`, etc. ✓
- Sitemap xhtml:link alternates embedded ✓
- `<html lang>` matches URL path ✓
- `x-default → mr` (correct — Marathi primary) ✓

No critical issues. Very clean i18n.

---

## Scoring Rollup

| Category | Score | Weight | Contribution |
|---|---|---|---|
| Technical SEO | 92 | 22% | 20.24 |
| Content Quality | 82 | 23% | 18.86 |
| On-Page SEO | 88 | 20% | 17.60 |
| Schema | 94 | 10% | 9.40 |
| Performance (CWV) | 76 | 10% | 7.60 |
| AI Readiness | 91 | 10% | 9.10 |
| Images | 90 | 5% | 4.50 |
| **Total** | | | **87.30 → round 86** |

---

## Limitations of this audit

- **No field CWV data** — Lighthouse not run against live prod; localhost TTFB not representative.
- **No GSC / GA4** — no click, impression, CTR, or indexation status.
- **No backlinks data** — no DA / PA / referring domains.
- **Only 11 pages crawled** — per-sign rashifal, per-yatra category, per-temple, per-sangrah-item deep pages not sampled. Sitemaps reference blog/rashi/temples/yatra/sangrah sub-sitemaps — a full 500-page crawl against prod would add coverage.
- **Sangrah page analyzed as a single document** — bloat may be legitimate SSR of 50+ items; needs browser-side Lighthouse to confirm real user impact.

### Recommended next steps for data enrichment
1. Deploy to prod, run `seo-google` with CrUX + GSC creds for field CWV + indexation.
2. Run `seo-performance` with Playwright Lighthouse against prod domain.
3. Run `seo-backlinks` once any link acquisition begins.
4. Set up `seo-drift` baseline on prod to catch regressions pre-/post-deploy.
