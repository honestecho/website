# honestecho.com Pre-Login UI/UX Review — Scored to 100

> ## REVISION — 2026-06-12 PM (founder attestations + fix-pack SHIPPED)
>
> **Founder attestations (Aaron, 2026-06-12):** Honest Echo is a woman-owned, disabled-veteran-owned business (About-page claim STANDS — consider upgrading the wording to "disabled-veteran-owned," it's the stronger true claim). Testimonials are real. Per these attestations the proof-cap on Home (testimonials) and the About risk flag are **lifted**; "Win more contracts." and the vs-GovWin price positioning were left as-is at the founder's direction (text changes limited to product-contradicting discrepancies).
>
> **Fix-pack SHIPPED (commit `81cab7a` → CF Pages):** all discrepancy copy fixes (Pricing "Priority processing" removed, analyzer free-tier promise, signup verify-state, FAQ↔Pricing free-plan contradiction, Security share-claim, Home mislink), nav rework (Sign In ghost / Start Free primary / Free Analyzer link / active states), hero CTAs + comparison tables on all 3 SEO landers, mobile pricing table (sticky column + swipe hint — Pro reachable at 390), sample-profile analyzer deployed with non-biddable gating, full a11y floor sweep (text sizes, contrast, focus rings, aria, tap-able tooltips), token sweep, FlyIn reduced-motion guard, trailing-slash internal links, vs-page de-clone, sitemap lastmod. Codex-reviewed, 6 findings fixed.
>
> **Backend (commit `4a664f5` → Render):** Sentry "Not allowed by CORS" fixed — `*.he-website.pages.dev` allowed; disallowed origins no longer throw/500.
>
> **Revised hard-cap status:** Security/Pricing/Analyzer/Signup-verify caps cleared by the shipped fixes; Home cap cleared by attestation. Post-fix scores to be confirmed by a re-score pass against prod.
>
> **2026-06-12 PM2:** Beta banner SHIPPED — BETA100 (100% off) strip on /pricing above the plan cards (`b0be3ea`). Remaining items moved to the LATER backlog at the bottom of this file.

---

## RE-SCORE — 2026-06-12 PM (measured against post-fix prod)

Fresh prod captures (scroll-through, 1440 + 390), one full-scorecard pass per Tier-1 page:

| Page | Before | **After** | Band | What's still capping it |
|---|---|---|---|---|
| Home | 71 | **81** | good | ≤85 cap: "Win More" tile (unprovable outcome promise — founder-accepted) |
| Pricing | 69 | **90** | **ships** | proof artifact, banner stack |
| Signup | 76 | **84** | good | ≤85 cap: "Win more contracts." headline (founder-accepted) |
| Analyzer | 70 | **85** | good | 12px rail copy (fixed in round 2), sample-notice chip (L8) |
| vs-GovWin | 63 | **89** | good | mobile table column (fixed in round 2), card redundancy |
| vs-GovTribe | 73 | **88** | good | mobile table (fixed in round 2), product screenshot (L6) |
| SamGovAnalysis | 68 | **90** | **ships** | customer proof (L6), mobile screenshot crop |
| Security | 62 | **87** | good | provider/infra card (fixed in round 2), funnel-return link (fixed in round 2) |

**Tier-1 average: 69 → 87 measured**, with round-2 polish (`e1227ad`, shipped after the measurement) addressing the analyzer a11y cap, both vs-page mobile tables, Security's infra card + funnel link, the floating mid-CTA, beta-price card sub-lines, and signup focus/resend gaps — estimated post-round-2 average **~90**.

**The honest 100/100 answer:** the rubric caps any page carrying an unprovable outcome promise at 85. Home and Signup keep their "Win" phrasing by founder decision, so those two pages mathematically cannot pass 85 while it stands. The remaining distance everywhere else is mostly **proof artifacts** (L6 — one real permissioned customer quote or usage number placed on Pricing/vs-pages/SamGovAnalysis) plus minor judgment items. One-line swaps if the caps should go: Home tile "Win More" → "Decide Faster"; Signup h1 "Win more contracts." → "Know before you bid."

---

## LATER backlog (parked, not forgotten)

| # | Item | Why parked | Trigger to revisit |
|---|---|---|---|
| L1 | Signup field trim: drop confirm-password + phone (6→4 fields) | Changes data collection — Aaron's call | Next signup-conversion pass / funnel review |
| L2 | Terms/Privacy section anchors + slim TOC | Nice-to-have on noindex-adjacent pages | Next legal-page touch |
| L3 | About wording: "veteran-owned" → "disabled-veteran-owned" (stronger true claim) | Copy nuance, cert-term sensitivity | Aaron's nod |
| L4 | GSC: Request Indexing on the 8 money pages | Manual, Search Console — only Aaron can | Now (5 minutes in GSC) |
| L5 | 12 "discovered – not indexed" pages | New-domain crawl patience; internal-link + de-dup fixes shipped | Re-check GSC in 2–3 weeks |
| L6 | Proof artifacts on Pricing / vs-pages (testimonial or real number near the cards) | Needs a real permissioned quote/number chosen by Aaron | When beta customers produce one |
| L7 | "Just ChatGPT?" objection FAQ on Home/Pricing | New copy — **company voice** (was "founder voice preferred" — corrected 2026-07-15, no-personal-brand override) | Next copy pass |
| L8 | Analyzer "try an example" chip with a live notice ID | Needs a stable, real, open notice ID to hardcode/rotate | When a good evergreen example exists |
| L9 | `npm audit` / dependency pass + og:url trailing-slash alignment | Cosmetic/maintenance | Next housekeeping |

*Reviewed: 2026-06-12 · Target: LIVE PRODUCTION · Rubric: [WEBSITE_SCORECARD.md](../../Honest%20Echo%20SaaS%20Design%20System/doctrine/WEBSITE_SCORECARD.md) (new, adapted from UI_SCORECARD + MARKETING_SCORECARD)*
*Process: 8 Tier-1 pages × 3 perspectives (ux-product-designer / visual-design-reviewer / conversion-copywriter; +govcon-workflow-expert on the analyzer), 6 Tier-2 single-pass QA, shared nav/footer reviewed once. 46 prod screenshots at 390/1366/1440/1920 in `uiux-review-2026-06-12/screenshots/`. Findings adjudicated; key claims spot-verified live.*

---

## Live-verified facts (these shaped the scoring)

1. **FlyIn is NOT blanking pages for real users.** Scripted scroll-through at 390: zero elements left at opacity-0. The giant voids in every full-page capture are the no-scroll render path — which is still what reduced-motion users, no-JS/SEO snapshots, print, and fast anchor-jumps can hit. Scored as a robustness/a11y risk, not "users see blank pages."
2. **Footer 390 "LEGAL clip" does NOT reproduce** under true mobile emulation (390×844, DPR 2): no horizontal overflow, Terms link fully visible, footer wraps to 2 columns. Downgraded to a watch item.
3. **"See How It Works" → `/pricing` mislink is real** (verified in live DOM). Label promises education, delivers a paywall page.
4. **Analyzer sample-profile experience is NOT deployed** — prod has only the notice-ID input (the migration-062 sample-profile work is local-only).

---

## Scoreboard (worst first)

| Page | Conv /20 | Hier /15 | Buyer /15 | Polish /15 | Proof /15 | Inter /10 | A11y /10 | **TOTAL** | Hard caps |
|---|---|---|---|---|---|---|---|---|---|
| /security | 12 | 10 | 10 | 10 | **7** | 6 | **7** | **62** | ≤85 — "never share your data" is false w/ subprocessors; 12px body notes |
| /vs-govwin | 13 | 10 | **7** | 11 | **7** | 7 | 8 | **63** | ≤85 — price-led positioning (banned: "compete on judgment, not price"); unsourced "$10,000/year" competitor claim |
| /sam-gov-opportunity-analysis | 13 | 10 | 11 | 10 | 9 | 7 | 8 | **68** | — |
| /pricing | 16 | 12 | 11 | 11 | **7** | 7 | **5** | **69** | ≤85 — "Priority processing" not found in product; 390 hides the Pro tier |
| /tools/sam-gov-notice-analyzer | 16 | 12 | 11 | 10 | **7** | 8 | **6** | **70** | ≤85 — CTA promises Free-tier pursuit tracking; Free = 0 pursuits |
| / (Home) | 16 | 11 | 12 | 11 | **7** | 7 | **7** | **71** | ≤85 — testimonial provenance ("Priya S." is a renamed attribution); 10px pills |
| /vs-govtribe | 14 | 10 | 12 | 12 | 10 | 7 | 8 | **73** | — |
| /about *(Tier 2)* | — | — | — | — | — | — | — | **75** | **VERIFY: "woman-owned, veteran-owned"** — if unsubstantiated this is a serious GovCon credibility/legal issue |
| /signup | 17 | 13 | 12 | 12 | **7** | 8 | **7** | **76** | ≤85 — "Win more contracts." unprovable; AA contrast fail on terms microcopy |
| /faq *(Tier 2)* | — | — | — | — | — | — | — | **77** | Free-tier answers contradict /pricing |
| /terms + /privacy *(Tier 2)* | — | — | — | — | — | — | — | **78** | 12px legal body text |
| /contact *(Tier 2)* | — | — | — | — | — | — | — | **83** | — |
| /team-waitlist *(Tier 2)* | — | — | — | — | — | — | — | **88** | — |
| /404 *(Tier 2)* | — | — | — | — | — | — | — | **88** | — |
| Shared nav | — | — | — | — | — | — | — | ~82 | — |
| Shared footer | — | — | — | — | — | — | — | ~84 | — |

**Tier-1 average: 69/100. Tier-2 average: 81/100.** Band: "usable but not premium" on the money pages. Nothing ships at 90+ today; **6 of 8 Tier-1 pages are hard-capped at ≤85 by claims that fail claims-&-proof** — meaning no amount of visual polish gets them to 100 until the copy is fixed.

---

## Cross-cutting fixes (fix once, lift everywhere)

These recover more points than any single-page fix. Ordered by leverage.

### X1 — Clear the six hard-cap claims (copy edits, ~1 day, unblocks five pages' ceiling)
| Page | Claim | Fix |
|---|---|---|
| Home [Home.tsx:94-112](../src/pages/Home.tsx) | Testimonials Keith L. / Matt S. / "Priya S." (renamed from "Aaron S.") | Verify real + permissioned and log proof-register rows, OR relabel as design-partner/beta feedback, OR cut to a section that doesn't claim customers |
| Signup [Signup.tsx:162](../src/pages/Signup.tsx) | "Win more contracts." | Replace with the messaging-map line: "Stop chasing bad-fit bids. Know before you bid." (CONVERSION_PLAYBOOK explicitly bans win promises) |
| Pricing [Pricing.tsx:125](../src/pages/Pricing.tsx) | "Priority processing" (Pro card + table) — no such feature found in the product repo | Delete the bullet/row, or build/name what it actually means |
| Analyzer [SamGovNoticeAnalyzer.tsx:474-477](../src/pages/SamGovNoticeAnalyzer.tsx) | "track pursuits across all 5 phases — without paying until you see the value" — Free = 0 pursuits | Rewrite: "Create a free account to score notices against your real profile — upgrade to run full pursuits. No card required." |
| vs-GovWin [VsGovWin.tsx](../src/pages/VsGovWin.tsx) hero + og meta | "$10,000/year data platform" stated as fact; page leads on price (banned positioning) | Hedge to "a five-figure market-intelligence subscription" / cite published reports; re-lead with judgment ("GovWin gives you data. HE Pursuit gives you a decision."), demote price to card 5 |
| Security [Security.tsx:24](../src/pages/Security.tsx) | "We do not sell, rent, or share your data" — false as written (Supabase/Render/Cloudflare/AI API subprocessors) | "We do not sell or rent your data. We share it only with the service providers that run the platform — never with other customers or advertisers." Must match the Privacy Policy |

Also verify before relying on them: About's **"woman-owned, veteran-owned"** ([About.tsx:148](../src/pages/About.tsx)); Security's **"users cannot view data from other accounts"** (known watch items: `opportunity_changes` RLS USING(true), `opportunity_descriptions` tenant isolation); Signup's "pursuit history" scoring claim.

### X2 — FlyIn: visible by default, animate as enhancement ([FlyIn.tsx](../src/components/FlyIn.tsx))
Content currently mounts `opacity-0 translate-y-10` and waits for IntersectionObserver. Make content visible by default; apply the hidden/animate classes only when JS + observer are live, and gate behind `matchMedia('(prefers-reduced-motion)')` / `motion-safe:`. Fixes: reduced-motion users, no-JS/SEO snapshots, print, full-page captures. Touches Home, Pricing, both /vs pages, SamGovAnalysis, Security, FAQ, About — every Polish/Interaction score on those pages assumes this lands.

### X3 — Nav/CTA architecture ([Navbar.tsx](../src/components/layout/Navbar.tsx))
- Cyan-filled "Launch App" competes with every page's primary CTA (worst on /signup and the analyzer) and points cold traffic at login. Demote to ghost "Sign In"; add cyan **"Start Free" → /signup** as the nav primary (or suppress the nav CTA on /signup and the analyzer).
- Add **"Free Analyzer"** to nav links — the site's lowest-risk conversion path is unreachable from chrome.
- Active state: switch to `NavLink` + `aria-current="page"`.
- `aria-expanded` on the hamburger; cyan `focus-visible` rings on nav links/CTA.

### X4 — Above-fold CTAs on the SEO landers
/vs-govwin, /vs-govtribe, /sam-gov-opportunity-analysis all have **zero CTA until page bottom**. Add a hero CTA pair on each — primary: "Analyze a SAM.gov notice — free, no signup" (doctrine: analyzer-paste > signup), secondary: Start Free. Repeat mid-page after the strongest section.

### X5 — Accessibility floor sweep (releases the A11y cap on 6 pages)
- `text-xs` (12px) body copy → `text-sm`: Security notes (:143,188), Pricing table cells/legend, Terms/Privacy notes, About footnotes, signup legal microcopy.
- `text-[10px]` pills (Home :397,418) → `text-xs`.
- Contrast: analyzer gap-text `#4a6080` (≈2.9:1) → `#8b9bb4`; Contact placeholders `placeholder-[#1e2d4a]` (≈1.4:1); signup terms `#64748b`.
- Cyan `:focus-visible` ring on all inputs/CTAs (signup, analyzer, waitlist, 404, nav); `aria-expanded` on FAQ accordions.
- Hover-only tooltips (analyzer score breakdown, confidence) → tap/click disclosure.

### X6 — Token discipline
The `bg-blue-900/20 border-blue-700/30 text-blue-200` eyebrow-badge trio appears on Home, Pricing, both /vs pages, SamGovAnalysis, About, TeamWaitlist; plus stray greys (`#4a6080`, `#64748b`, `#334155`), `#fbbf24` bullets (About), arbitrary `delay-[450ms]`/`text-[4rem]`. Map once to documented tokens, sweep all pages.

### X7 — Kill the card soup, especially on comparison pages
Six identical prose cards on /vs-govwin, /vs-govtribe, SamGovAnalysis, Security (7), Home sections. The two comparison pages **never render an actual comparison** — add a scannable HE-vs-X table (price / job / output / team size / time-to-decision) ending with an honest "choose them if…" row; demote cards to supporting detail. SamGovAnalysis should present its six cards as the numbered 5-phase workflow it secretly is.

### X8 — Cross-page consistency (trust)
- FAQ says Free lets you "evaluate opportunities"; Pricing says Free = screening only ([FAQ.tsx:30,122,139](../src/pages/FAQ.tsx)).
- Analyzer copy promises "GO / CONDITIONAL GO / NO-BID" but the card renders STRONG GO/GO/REVIEW/CAUTION/NO-GO — pick one taxonomy.
- The Appian "Based on Real Events" block is verbatim-identical on both /vs pages (SEO duplicate-content + reads templated). Keep one, write a GovTribe-specific story for the other.
- "fewer than twenty LinkedIn results" (both /vs pages) — recast as a dated anecdote or soften.

---

## Per-page path to 100 (Tier 1, worst first)

### /security — 62 → 100
1. X1 fix ("share" claim) + verify RLS isolation claims before asserting "cannot view." *(releases ≤85 cap)*
2. Lead with the page's strongest absent fact: **HE Pursuit ingests only public SAM.gov data** — retitle the buried last card "Data Sensitivity & CUI," promote to position 1-2 ([Security.tsx:61-63](../src/pages/Security.tsx)).
3. "At a glance" strip under hero (Public data only · Encrypted · No AI training · security@) then reorder cards by diligence priority; fix the orphaned 5th card.
4. Name the subprocessor stack (Cloudflare, Supabase, Render, AI provider) + encryption standards + "Last reviewed" date — "trusted cloud providers" is unverifiable.
5. Link the dead-end contacts (support@ :54, "contact us" :63) and add one closing CTA band.
6. X5 (12px notes), strip false hover affordances/icon glow, hero `max-w-3xl`.

### /vs-govwin — 63 → 100
1. X1 (price-led positioning + unsourced pricing). *(releases cap)*
2. X4 hero CTA + X7 comparison table with "pick GovWin if you're a prime with a capture team" row (resolves the card-2/card-6 contradiction).
3. Promote "SAM.gov is free / you may not need GovWin" from last to featured; merge card 5 into 2/3.
4. X8 (LinkedIn anecdote, shared Appian block), X2, X6; hero `max-w-3xl` at 1920; remove hover glow on non-link cards.

### /sam-gov-opportunity-analysis — 68 → 100
1. X4: analyzer CTA in hero + after card 5 (intent peak); analyzer-first, signup secondary.
2. X7: restructure cards as the numbered 5-phase pipeline; lead with the Go/Conditional-Go/No-Bid payoff card.
3. Add proof: product screenshot (`pursuit-overview.png` already exists as og:image) + the verified "~5-second readout" number; soften the unsourced "most common reason" stat; add a proof-register row for "minutes."
4. X2, X6; hero `max-w-3xl`; one persona lead-line + "just ChatGPT?" answer near the CTA.

### /pricing — 69 → 100
1. X1 ("Priority processing"). *(releases cap)*
2. **Mobile comparison table**: at 390 only Free+Starter are visible — Pro (the sold tier) is unreachable with zero scroll affordance ([Pricing.tsx:362-392](../src/pages/Pricing.tsx), `min-w-[640px]`). Stack to per-tier accordions below `sm`, or sticky feature column + edge fade + "swipe" hint. *(releases the A11y cap)*
3. Tier CTAs drop intent — pass `?plan=starter|pro` to /signup.
4. "Find your fit" cards restate taglines (Do-Not-Do: cards with no job) — replace with persona routing or cut; fix section-4 header pattern; outline-style the "Coming Soon" badge (currently identical to "Recommended"); give Pro 2-3 inherited highlights ("Everything in Starter, unlimited").
5. Beta lever missing: pricing charges full freight while beta onboards via 100%-off coupon — add the beta banner if the marketing push is live.
6. Define "pursuit" once near the cards; fix "Per-pursuit" cell; near-invisible `#2a3a4e` X marks → "—" in `#8b9bb4` + aria-label; analyzer secondary link ("Not sure? Score a notice free"); X2/X5/X6.

### /tools/sam-gov-notice-analyzer — 70 → 100
1. X1 (free-tier CTA promise). *(releases cap)*
2. **GovCon credibility gate:** un-biddable notices (Award/J&A) can render "STRONG GO — Pursue This" ([AnalyzerOpportunityCard.tsx](../src/components/AnalyzerOpportunityCard.tsx) `derivedDecision`) — add terminal-type/past-deadline override → grey "NOT BIDDABLE — Awarded/Closed"; fix `maturity || 'Solicitation'` mislabel (:256); drive the hardcoded "No keyword match" row off `dimension_scores.keywords` (:127) — it currently contradicts the factors panel on the same card.
3. Align the band taxonomy (X8) — copy promises GO/CONDITIONAL GO/NO-BID, card renders a 5-band scheme.
4. Cold-visitor path: "Try an example →" chip that fills a live notice ID + where-to-find-an-ID helper (practitioners paste solicitation numbers, not 32-hex IDs).
5. Result-card pill overflow at 390 (`min-w-[170px]` + `flex-nowrap`, :330) → wrap; X5 (gap-text contrast, hover tooltips, focus rings); `animate-pulse` skeleton → he-skeleton; name the cap ("3 free analyses per hour") in copy + 429 message; deploy the sample-profile experience (built, local-only); X6.

### / (Home) — 71 → 100
1. X1 (testimonials). *(releases cap)*
2. Fix "See How It Works" → /pricing mislink ([Home.tsx:249](../src/pages/Home.tsx)) — relabel or retarget (live-verified).
3. Rewrite "Win More" tile (:73) → "Decide Faster — a documented go/no-go you can defend"; consider analyzer as the hero primary (doctrine: lowest-risk first).
4. Hero demo card names a real Army solicitation with a past due date ([HeroPursuitCard.tsx:40,58](../src/components/HeroPursuitCard.tsx)) — fictionalize per doctrine ("never name a real buyer or live solicitation"), rolling future date.
5. Add "Is this just ChatGPT?" FAQ (:456-472); dedupe the back-to-back "WHY HE PURSUIT" eyebrows (:183,238 — first becomes "THE PROBLEM"); section intros `max-w-4xl` (150+ char lines at 1440+); X2/X5 (10px pills, filmstrip text-xs)/X6; normalize section rhythm; trailing-period nit (:208).

### /vs-govtribe — 73 → 100
1. X8: replace the cloned Appian block with a GovTribe-specific story ("you found it in GovTribe — now decide").
2. X4 hero analyzer CTA; X7 comparison strip; lead with the Go/Conditional-Go/No-Bid card (buried 4th).
3. Hedge "GovTribe research can take hours" (unsourced competitor-workflow claim) and "Most small contractors…" (opinion as fact); add persona lead line.
4. Add one product proof (verdict-card screenshot); X2/X5/X6; hero `max-w-3xl`.

### /signup — 76 → 100
1. X1 ("Win more contracts."). *(releases cap)*
2. Fix the verify-state lie: "head straight to your dashboard and set up your first pursuit" — Free = 0 pursuits ([Signup.tsx:383-392](../src/pages/Signup.tsx)) → "score your first SAM.gov notice." (This is also the beta-coupon activation moment.)
3. Mobile gets zero pitch (`hidden lg:flex` :160) — render headline + one-liner above the card below lg; delete the off-brand Zap pseudo-logo (:195-201).
4. Form friction: drop confirm-password + phone (6→4 fields); inline per-field errors + `aria-describedby` + focus-to-error (currently one error, far from the field); remove `autoFocus` below lg (pops the keyboard, buries the Google path).
5. X3 (nav CTA competes directly above the form); X5 (terms microcopy contrast, focus rings, eye-toggle aria-labels); trust line near CTA ("Analyzes public SAM.gov data only" + /security link); same-tab "Sign in" (:363); unify control heights; what-happens-next microcopy.

---

## Tier-2 quick lists

- **/about (75):** verify or remove "woman-owned, veteran-owned" (:148) — highest-risk claim on the site if unsubstantiated; swap `#fbbf24`/`#bfdbfe` tokens (:91,155); de-stuff "government contracting opportunities" ×7; give the founder story lead weight; normalize card-2 heading, remove fake hover affordances (:195).
- **/faq (77):** fix the Free-plan contradiction with /pricing (:30,122,139); add a closing Start-Free/analyzer band (:406); "Team launching soon — join the waitlist" (:139); `aria-expanded`/`aria-controls` on accordions (:236,379); class nits (:250).
- **/terms + /privacy (78):** 12px legal text → text-sm (Terms :163,183; Privacy :178); single-column reading flow or numbered sections; section anchors + slim TOC; strip hover glow; align Privacy's orphan Contact card.
- **/contact (83):** placeholder contrast (:139-154); form above Email/Location at 390 (`flex-col-reverse`); h1→h4 heading skip (:97,111); aria-invalid/describedby on errors; mark optional fields.
- **/team-waitlist (88):** X6 badge tokens (:81-87,179); cyan focus rings; use-case input → textarea (:167-175); grey placeholder state on the select; one trust line under the form.
- **/404 (88):** add "Try the free analyzer →" + "See pricing →" quiet links (:31-34); "ERROR 404" eyebrow; X6 tokens; focus-visible on the CTA.

---

## Suggested fix order (points recovered × traffic importance)

1. **X1 hard-cap claims sweep** — copy-only, removes the ≤85 ceiling from 5 of 8 money pages + the About verification. Biggest single unlock.
2. **X3 nav + X4 SEO-lander hero CTAs** — conversion architecture; every entry page gains a next step.
3. **Pricing mobile table + signup form fixes** — the two highest-intent surfaces' worst defects.
4. **X2 FlyIn robustness** — one component; lifts Polish/Interaction/A11y on 7 pages and fixes SEO/reduced-motion rendering.
5. **X5 a11y floor sweep + X6 token sweep** — mechanical; releases A11y caps site-wide.
6. **X7 comparison tables + card-soup restructures** — the structural work that moves vs-pages/SamGovAnalysis/Security from "good" to premium.
7. **Analyzer GovCon credibility pack** (non-biddable gating, taxonomy, example chip, sample-profile deploy) — the tool is the brand's proof; it must never recommend pursuing an awarded contract.

Re-score after each wave; 90+ everywhere requires waves 1-5, 100 requires all seven plus a final `/ui-qa` pass per page at the four widths.

---

*Screenshot evidence: `roadmaps/uiux-review-2026-06-12/screenshots/` (46 files). Hard-cap rule: any claims-&-proof failure caps Proof at 7/15 and the page at 85 total — those pages cannot reach 100 by design until the claim is fixed.*
