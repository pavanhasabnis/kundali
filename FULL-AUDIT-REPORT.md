# Bhaagyavedh SEO Audit Report

**Date:** 2026-04-16
**URL:** https://bhaagyavedh.com (audited via localhost:6630)
**Business Type:** Local Service / Vedic Astrology Platform (Hybrid: Online + Local)

---

## Executive Summary

### Overall SEO Health Score: 78/100

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Technical SEO | 22% | 88/100 | 19.4 |
| Content Quality | 23% | 70/100 | 16.1 |
| On-Page SEO | 20% | 65/100 | 13.0 |
| Schema / Structured Data | 10% | 80/100 | 8.0 |
| Performance (CWV) | 10% | 65/100 | 6.5 |
| AI Search Readiness | 10% | 90/100 | 9.0 |
| Images | 5% | 40/100 | 2.0 |
| **Total** | **100%** | | **78.0** |

### Top 5 Critical Issues
1. **Missing OG image & apple-touch-icon** — `og-image.png` and `apple-touch-icon.png` do not exist; all social sharing previews are broken (404)
2. **All 10 page titles exceed 60 characters** (79–111 chars) — Google truncates them in SERPs
3. **No `next/image` used anywhere** — no WebP/AVIF conversion, no lazy loading, no responsive images
4. **Duplicate H1 on homepage** — loader component has a second `<h1>` tag
5. **`HinduTemple` is not a valid Schema.org type** — Google ignores this structured data on all temple detail pages

### Top 5 Quick Wins
1. Create `og-image.png` (1200x630) and `apple-touch-icon.png` (180x180) in `public/logos/`
2. Shorten title tags to under 60 characters on all pages
3. Change homepage loader `<h1>` to `<p>` or `<span>`
4. Change `HinduTemple` schema to `PlaceOfWorship`
5. Add `loading="lazy"` to below-fold images and `fetchpriority="high"` to navbar logo

---

## Technical SEO — 88/100

### Crawlability
| Check | Status | Details |
|-------|--------|---------|
| robots.txt | PASS | Properly blocks `/api/`, `/admin`, `/account`, `/login`, `/kundli/result` |
| Sitemap | PASS | 162 URLs in `sitemap.xml`, auto-generated with correct priorities |
| Sitemap reference | PASS | `robots.txt` points to `https://bhaagyavedh.com/sitemap.xml` |
| Canonical tags | PASS | All pages have correct canonical URLs to production domain |
| Hreflang | PASS | `mr`, `en`, and `x-default` hreflang tags present |
| HTML lang | PASS | `lang="en"` — correct for English-first search ranking |

### Indexability
| Check | Status | Details |
|-------|--------|---------|
| Meta robots | PASS | All pages: `index, follow` |
| Googlebot | PASS | All pages: `max-video-preview:-1, max-image-preview:large, max-snippet:-1` |
| Noindex pages | PASS | No accidental noindex found |

### Security Headers
| Header | Status | Value |
|--------|--------|-------|
| X-Frame-Options | PASS | `DENY` |
| X-Content-Type-Options | PASS | `nosniff` |
| Referrer-Policy | PASS | `strict-origin-when-cross-origin` |
| Permissions-Policy | PASS | `camera=(), microphone=(), geolocation=()` |
| X-DNS-Prefetch-Control | PASS | `on` |
| HSTS | PASS | `max-age=63072000; includeSubDomains; preload` |
| Content-Security-Policy | MISSING | No CSP header configured |

### Issues Found
| Severity | Issue | Location |
|----------|-------|----------|
| Medium | `favicon.ico` returns 404 | Browsers auto-request `/favicon.ico`; only SVG favicon is configured |
| Medium | No Content-Security-Policy header | `next.config.ts` |
| Low | `typescript.ignoreBuildErrors: true` | `next.config.ts:5` — type errors ship silently |

---

## Content Quality — 70/100

### E-E-A-T Assessment
| Signal | Status | Details |
|--------|--------|---------|
| Author attribution | PARTIAL | Organization-only; no named person/astrologer |
| Contact information | PASS | Phone, email, address clearly shown |
| About/credentials | MISSING | No "About Us" page with team bios or credentials |
| Published dates | PASS | Blog posts have `datePublished` |
| Content depth | GOOD | Most pages have substantial bilingual content |

### Thin Content Pages
| Page | Issue |
|------|-------|
| `/contact` | Under 100 words of crawlable text — needs FAQ or service descriptions |
| `/graha-sthiti` | Mostly a data table with ~2 sentences of copy — needs astrological context |

### Duplicate Content Issues
| Issue | Details |
|-------|---------|
| Yatra category canonical bug | All `/yatra/[category]` pages share canonical URL `https://bhaagyavedh.com/yatra` — tells Google they are duplicates of the main yatra page |
| Yatra category title | All category pages share the same title "Yatra Packages — तीर्थयात्रा पॅकेज" instead of unique per-category titles |

### Duplicate H1
| Page | Issue | File |
|------|-------|------|
| Homepage | Two `<h1>` tags — one in loader (`भाग्यवेध`), one in hero section | `home-client.tsx:171, 240` |

---

## On-Page SEO — 65/100

### Title Tags — ALL TOO LONG
| Page | Chars | Title |
|------|-------|-------|
| `/` | 80 | Bhaagyavedh — भाग्यवेध \| Free Horoscope Today, Kundli Maker & Vedic Astrology |
| `/kundli` | 93 | Too long — bilingual + brand suffix pattern |
| `/rashifal` | 96 | Too long |
| `/matching` | 87 | Too long |
| `/panchang` | 96 | Too long |
| `/blog` | 99 | Too long |
| `/temples` | 111 | Too long |
| `/yatra` | 106 | Too long |
| `/consultation` | 94 | Too long |
| `/pooja-services` | 100 | Too long |
| `/contact` | 79 | Too long |

**Recommendation:** Stay under 60 characters. Drop redundant brand suffix (Google auto-appends site name). Use English-first for primary visibility.

### Meta Descriptions — 7/10 TOO LONG
| Page | Chars | Status |
|------|-------|--------|
| `/kundli` | 181 | TOO LONG (max 160) |
| `/rashifal` | 183 | TOO LONG |
| `/matching` | 182 | TOO LONG |
| `/panchang` | 183 | TOO LONG |
| `/blog` | 157 | OK |
| `/temples` | 181 | TOO LONG |
| `/yatra` | 136 | OK |
| `/consultation` | 192 | TOO LONG |
| `/pooja-services` | 183 | TOO LONG |
| `/contact` | 133 | OK |

### Heading Structure
| Page | H1 Count | Status |
|------|----------|--------|
| `/` (homepage) | 2 | FAIL — duplicate H1 |
| All other pages | 1 each | PASS |

### Blog Post Issues
| Issue | Details |
|-------|---------|
| Empty keywords | Blog post at `/blog/2026-04-15-saturn-s-sade-sati...` has `keywords: ""` (empty) |

### Internal Linking Gaps
| Missing from Footer | Impact |
|---------------------|--------|
| `/pooja-services` | Reduced crawl depth and PageRank |
| `/temples` | Reduced crawl depth and PageRank |
| `/yatra` | Reduced crawl depth and PageRank |

---

## Schema / Structured Data — 80/100

### Homepage Schemas (4 total — GOOD)
- Organization (with address, contact, language)
- WebSite (with SearchAction)
- ProfessionalService (local business)
- SiteNavigationElement

### Page-Level Schema Coverage
| Page | Schemas | Status |
|------|---------|--------|
| `/kundli` | Service, Breadcrumb, FAQ | PASS |
| `/rashifal` | Service, Breadcrumb, FAQ | PASS |
| `/matching` | Service, Breadcrumb, FAQ | PASS |
| `/panchang` | Service, Breadcrumb | PASS |
| `/consultation` | Service+Offer, Breadcrumb, FAQ | PASS |
| `/pooja-services` | Service+AggregateOffer, Breadcrumb | PASS (missing FAQ) |
| `/yatra` | Service, Breadcrumb | PASS (missing FAQ) |
| `/blog` | Blog, Breadcrumb | PASS |
| `/blog/[slug]` | Article, Breadcrumb, FAQ (conditional) | PASS |
| `/temples` | ItemList, Breadcrumb, FAQ | PASS |
| `/temples/[id]` | HinduTemple, Breadcrumb | FAIL — invalid type |
| `/contact` | ProfessionalService, Breadcrumb | PASS |
| `/muhurat` | NONE | FAIL |
| `/calendar` | NONE | FAIL |
| `/graha-sthiti` | NONE | FAIL |
| `/compare` | NONE | FAIL |

### Schema Validation Issues
| Severity | Issue | File |
|----------|-------|------|
| Critical | `HinduTemple` is not a valid Schema.org type — use `PlaceOfWorship` | `temples/[id]/temple-detail-client.tsx:64` |
| High | `Article` should be `BlogPosting` for blog posts | `json-ld.tsx:172` |
| Medium | `organizationSchema.sameAs` is empty array — populate or remove | `json-ld.tsx:36` |
| Medium | `localBusinessSchema` missing `@id` for entity linking | `json-ld.tsx:55` |
| Low | `articleSchema` author is Organization, not Person — weaker E-E-A-T | `json-ld.tsx:179` |

---

## Performance (CWV) — 65/100

### Font Loading
| Check | Status | Details |
|-------|--------|---------|
| font-display: swap | PASS | Outfit font loaded via `next/font/google` with `display: "swap"` |
| Font preload | PASS | Woff2 font is preloaded via `<link rel="preload">` |

### Image Optimization
| Check | Status | Details |
|-------|--------|---------|
| next/image usage | FAIL | Zero files use `next/image` — all raw `<img>` tags |
| Image formats config | FAIL | No `images` block in `next.config.ts` — no AVIF, no remotePatterns |
| LCP optimization | FAIL | Navbar logo (LCP candidate) has no `fetchpriority="high"` |
| Lazy loading | FAIL | Below-fold images have no `loading="lazy"` |

### Code Splitting
| Check | Status | Details |
|-------|--------|---------|
| Dynamic imports | FAIL | No `dynamic()` imports — all components statically imported |
| Suspense boundaries | PARTIAL | Only used in kundli result page |

### Render-Blocking Resources
| Check | Status |
|-------|--------|
| External CSS | PASS — Tailwind processed at build time |
| Synchronous scripts | PASS — no blocking scripts |
| Third-party scripts | PASS — no third-party scripts detected |

---

## AI Search Readiness — 90/100

### AI Crawler Accessibility
| Check | Status | Details |
|-------|--------|---------|
| llms.txt | PASS | Well-structured file at `/llms.txt` with all services listed |
| robots.txt AI bots | PASS | No AI crawlers blocked (no Disallow for GPTBot, etc.) |
| Structured data | PASS | Rich JSON-LD on most pages |
| Clean HTML structure | PASS | Semantic headings, clear content sections |

### Citability
| Check | Status | Details |
|-------|--------|---------|
| Definitive statements | PASS | Service descriptions are clear and citable |
| Bilingual content | PASS | Both English and Marathi — wide AI training coverage |
| NAP consistency | PASS | Same name, address, phone across all schemas |

### Missing for Perfect Score
- No `llms-full.txt` with detailed service specifications
- No author bio pages for E-E-A-T signals

---

## Images — 40/100

### Missing Image Files
| File | Referenced In | Impact |
|------|---------------|--------|
| `public/logos/og-image.png` | layout.tsx, all page OG tags | ALL social sharing previews broken (404) |
| `public/logos/apple-touch-icon.png` | layout.tsx:96 | iOS home screen icon broken |

### Image Tag Issues
| File | Line | Issue |
|------|------|-------|
| `nav-bar.tsx` | 65 | Logo `<img>` — LCP candidate, needs `fetchpriority="high"` |
| `nav-bar.tsx` | 93 | User avatar `alt=""` — empty alt |
| `footer.tsx` | 18 | Logo — no `loading="lazy"` |
| `account/account-client.tsx` | 207 | User avatar `alt=""` — empty alt |
| `admin/admin-client.tsx` | 468 | User avatar `alt=""` — empty alt |
| `admin/admin-client.tsx` | 842 | Package thumbnail `alt=""` — needs descriptive alt |

### No next/image Component
All images use raw `<img>` tags. Missing benefits:
- No WebP/AVIF automatic conversion
- No responsive srcset generation
- No built-in lazy loading
- No layout shift prevention (no width/height)

---

## Issue Summary

| Priority | Count | Category |
|----------|-------|----------|
| Critical | 5 | Missing OG image, titles too long, no next/image, duplicate H1, invalid HinduTemple schema |
| High | 6 | Meta descriptions too long, yatra canonical bug, missing schemas (4 pages), missing footer links |
| Medium | 7 | Article vs BlogPosting, empty sameAs, missing @id, no CSP header, favicon.ico 404, thin content (2 pages), empty blog keywords |
| Low | 4 | No dynamic imports, no Suspense boundaries, author as Person, llms-full.txt |
| **Total** | **22** | |
