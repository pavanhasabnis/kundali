# Bhaagyavedh SEO Action Plan

**Generated:** 2026-04-16 | **Current Score:** 78/100

---

## Critical — Fix Immediately (5 issues)

### 1. Create missing OG image and apple-touch-icon
- **Impact:** All social sharing previews (Facebook, Twitter/X, WhatsApp, LinkedIn) show broken/blank image
- **Files:** Create `public/logos/og-image.png` (1200x630px) and `public/logos/apple-touch-icon.png` (180x180px)
- **Effort:** Low — design + export

### 2. Shorten all title tags to under 60 characters
- **Impact:** Google truncates all 10 page titles in SERPs — users see cut-off text
- **Files:** `src/app/layout.tsx`, `src/lib/seo.ts`, and individual page metadata exports
- **Effort:** Medium — rewrite 10+ title strings
- **Tip:** Drop the bilingual duplication and brand suffix from titles; Google auto-appends site name

### 3. Fix duplicate H1 on homepage
- **Impact:** Two H1 tags confuse search engines about the main topic
- **File:** `src/app/home-client.tsx:171` — change loader `<h1>भाग्यवेध</h1>` to `<p>` or `<span>`
- **Effort:** Low — single line change

### 4. Fix invalid `HinduTemple` schema type
- **Impact:** Google ignores all structured data on temple detail pages (50+ pages)
- **File:** `src/app/temples/[id]/temple-detail-client.tsx:64` — change to `PlaceOfWorship`
- **Effort:** Low — single string change

### 5. Migrate critical images to `next/image`
- **Impact:** No WebP/AVIF conversion, no lazy loading, no responsive images, poor LCP
- **Files:** `src/app/nav-bar.tsx:65` (priority — LCP element), `src/app/footer.tsx:18`
- **Effort:** Medium — requires adding `images` config to `next.config.ts` and updating imports

---

## High — Fix Within 1 Week (6 issues)

### 6. Shorten meta descriptions to under 160 characters
- **Impact:** 7/10 pages have truncated descriptions in SERPs
- **Files:** Individual page metadata in `src/lib/seo.ts` or page-level metadata exports
- **Effort:** Medium — rewrite 7 description strings

### 7. Fix yatra category canonical & title bug
- **Impact:** All `/yatra/[category]` pages share one canonical URL — Google treats them as duplicates
- **File:** `src/app/yatra/[category]/page.tsx` — convert to `generateMetadata()` with dynamic canonical per category
- **Effort:** Medium

### 8. Add structured data to Muhurat page
- **File:** `src/app/muhurat/muhurat-client.tsx`
- **Add:** `serviceSchema` + `breadcrumbSchema` + `faqSchema`
- **Effort:** Low

### 9. Add structured data to Calendar page
- **File:** `src/app/calendar/calendar-client.tsx`
- **Add:** `serviceSchema` + `breadcrumbSchema`
- **Effort:** Low

### 10. Add structured data to Graha Sthiti page
- **File:** `src/app/graha-sthiti/graha-sthiti-client.tsx`
- **Add:** `serviceSchema` + `breadcrumbSchema`
- **Effort:** Low

### 11. Add missing footer links
- **File:** `src/app/footer.tsx`
- **Add links to:** `/pooja-services`, `/temples`, `/yatra`
- **Effort:** Low

---

## Medium — Fix Within 1 Month (7 issues)

### 12. Change Article schema to BlogPosting
- **File:** `src/components/json-ld.tsx:172`
- **Change:** `"@type": "Article"` to `"@type": "BlogPosting"`
- **Effort:** Low

### 13. Populate or remove empty `sameAs` array
- **File:** `src/components/json-ld.tsx:36`
- **Action:** Add social profile URLs or remove the field
- **Effort:** Low

### 14. Add `@id` to localBusinessSchema
- **File:** `src/components/json-ld.tsx:55`
- **Add:** `"@id": "https://bhaagyavedh.com/#business"`
- **Effort:** Low

### 15. Add Content-Security-Policy header
- **File:** `next.config.ts`
- **Effort:** Medium — requires testing all inline scripts/styles

### 16. Create favicon.ico fallback
- **Action:** Generate ICO from existing SVG favicon or add a redirect
- **Effort:** Low

### 17. Enrich thin content pages
- **Pages:** `/contact` (add FAQ/service context), `/graha-sthiti` (add astrological explanations)
- **Effort:** Medium

### 18. Fix empty blog post keywords
- **Issue:** Some blog posts have `keywords: ""` (empty string)
- **Effort:** Low — add relevant keywords to blog post metadata

---

## Low — Backlog (4 issues)

### 19. Add dynamic imports for heavy components
- **Files:** `temples-client.tsx`, `kundli-client.tsx`, `pooja-services-client.tsx`
- **Effort:** Medium

### 20. Add Suspense boundaries for code splitting
- **Effort:** Medium

### 21. Add Person author to article schema
- **File:** `src/components/json-ld.tsx:179`
- **Effort:** Low — but requires named author info

### 22. Create llms-full.txt
- **Action:** Extended version of llms.txt with detailed service specifications
- **Effort:** Low

---

## Score Improvement Projection

| Action | Score Impact |
|--------|-------------|
| Fix Critical issues (1-5) | +8 points → 86/100 |
| Fix High issues (6-11) | +5 points → 91/100 |
| Fix Medium issues (12-18) | +4 points → 95/100 |
| Fix Low issues (19-22) | +2 points → 97/100 |
