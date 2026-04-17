# honestecho.com — SEO Roadmap

**Audit Score:** 68/100 (C) — April 2026  
**Sub-scores:** Technical 45 · Content 85 · Architecture 80 · Cross-Page 75 · Social/Schema 90

---

## Priority Order

| Priority | Item | Impact | Effort | Status |
|----------|------|--------|--------|--------|
| 1 | Generate sitemap.xml | High | 15 min | ✅ Sprint 1 |
| 2 | Fix og:image (og-image.png → pursuit-overview.png) | High | 15 min | ✅ Sprint 1 |
| 3 | Strengthen page titles + meta descriptions | High | 30 min | ✅ Sprint 1 |
| 4 | JSON-LD Organization + SoftwareApplication schema | High | 1 hr | ✅ Sprint 1 |
| 5 | JSON-LD FAQPage schema | Medium | 30 min | ✅ Sprint 1 |
| 6 | Cloudflare `_headers` security headers | Low | 15 min | ✅ Sprint 1 |
| 7 | Static pre-rendering (SSG) | Critical | 4–8 hrs | ✅ Sprint 2 |
| 8 | LSI keyword expansion — SAM.gov, GovWin alternative content | Medium | Ongoing | ✅ Sprint 3 |
| 9 | Comparison/landing pages (GovWin alt, GovTribe alt) | High | 2 hrs ea | ✅ Sprint 4 |

---

## Sprint 1 — Quick Wins (Complete)

All zero-risk, high-confidence improvements that require no architectural changes.

### 1. sitemap.xml
- All 9 indexable pages with correct priority/changefreq
- Excludes: `/welcome`, `/app`, `/pursuit`, `/platform`, `/consulting` (redirects/noindex)
- Referenced by existing `robots.txt` — was returning 404

### 2. og:image Fix
- All pages referenced `og-image.png` which did not exist in `public/`
- Changed to `pursuit-overview.png` — the actual product screenshot

### 3. Meta Tag Strengthening
| Page | Change |
|---|---|
| Home | Title: `Honest Echo` → `Honest Echo — GovCon Bid/No-Bid Intelligence for Small Contractors` |
| About | Added "SAM.gov", "government contracting" to description |
| FAQ | Added Twitter card tags (was missing) |
| All | Consistent `og:image` pointing to existing asset |

### 4. JSON-LD Schema (`SchemaOrg` component)
- `Organization` — name, url, logo, description, contactPoint — rendered on all pages via `App.tsx`
- `SoftwareApplication` — rendered on Home + Pricing with pricing info
- Addresses 0% schema coverage from audit

### 5. FAQPage Schema
- Added to `FAQ.tsx` covering all 9 main accordion questions
- Enables Google rich results (expandable FAQ in SERP)

### 6. Cloudflare `_headers`
- `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- Addresses security header gaps from audit

---

## Sprint 2 — Pre-rendering (Planned)

**The critical issue:** React SPA serves `<div id="root"></div>` to crawlers. Google must execute JS to see content. This delays indexing and limits ranking.

**Approach:** Custom prerender script using `react-dom/server` + `StaticRouter`.

```
scripts/
  prerender.ts   # Build-time script — renders each route to HTML, injects into dist/index.html copies
```

Build pipeline change:
```json
"build": "tsc -b && vite build && node scripts/prerender.js"
```

**Routes to pre-render:** `/`, `/pricing`, `/about`, `/contact`, `/faq`, `/security`, `/terms`, `/privacy`, `/signup`

**Risk:** Medium — requires testing that Cloudflare Pages serves the pre-rendered `.html` files correctly alongside the SPA fallback.

**Expected impact:** Fastest path from 68 → 85+ score. Unlocks full indexability.

---

## Sprint 3 — Keyword Expansion (Ongoing)

Target semantic clusters currently thin on the site:

| Cluster | Target Terms | Current Coverage |
|---|---|---|
| Discovery | "SAM.gov opportunities", "SAM.gov search" | Minimal |
| Competitive | "GovWin alternative", "GovTribe alternative" | None |
| Workflow | "capture management software", "govcon CRM" | None |
| Decision | "bid/no-bid decision framework", "go/no-go decision" | Good |

**Actions:**
- Expand Home hero copy to include "SAM.gov" explicitly
- Add "SAM.gov" to About meta description and body copy
- Expand FAQ with SAM.gov and competitor comparison questions

---

## Sprint 4 — Comparison Landing Pages

Each page targets a high-intent, low-competition keyword:

| Page | Target Keyword | Intent |
|---|---|---|
| `/vs-govwin` | "GovWin alternative for small business" | Commercial |
| `/vs-govtribe` | "GovTribe alternative govcon" | Commercial |
| `/sam-gov-opportunity-analysis` | "SAM.gov opportunity analysis tool" | Informational |

These are the highest long-term organic traffic plays. Each page follows the existing 2-column card grid template.

---

## Audit Baseline (April 2026)

| Category | Score | Notes |
|---|---|---|
| Technical | 45/100 | CSR only, no sitemap, no schema |
| Content | 85/100 | Strong headings, good meta tags |
| Architecture | 80/100 | Clean URL structure, no orphans |
| Cross-Page | 75/100 | Minor cannibalization risk |
| Social/Schema | 90/100 | OG tags present, Twitter partial |
| **Overall** | **68/100** | |

**Post Sprint 1 estimated score: ~78/100**  
**Post Sprint 2 (pre-rendering) estimated score: ~88/100**
