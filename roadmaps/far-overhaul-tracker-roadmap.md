# FAR Overhaul Tracker: 30-day roadmap

Started 2026-11-02. Page: `/far-overhaul/`, titled "FAR Overhaul Tracker (FAR 2.0)".

## Promise
Honest Echo tells federal contractors which acquisition rules are changing, whether those changes apply to the agencies they sell to, and what to do about it. The public tracker brings people in. The agency filter is what makes it useful. Monitoring is what brings them back. The clause check links back to Pursuit.

## Decisions (Aaron, 2026-11-02)
| Decision | Pick |
|---|---|
| Scope | FAR + DFARS |
| URL / title | `/far-overhaul/`, "FAR Overhaul Tracker (FAR 2.0)" |
| Weekly update | Auto-publish everything, for this one job only. |
| Outside review (pasted 2026-11-02) | Adopted as the full 30-day plan |
| Top 10 trends | Kept, de-duplicated against the impacts; each trend carries a sourced number or example |
| Search | Prerendered HTML, a sitemap lastmod that follows the data file, Article + FAQPage + Dataset schema, Search Console indexing request |

## Data rules (apply to every week)
- Every fact has a .gov source URL and a verified-on date.
- A date the government has not announced reads "No date announced". It is never estimated.
- Status is shown in four separate layers: model text published, agency adopted (class deviation), proposed rule, final rule. Model text applies to an agency only after that agency adopts it.
- Interpretation ("what it means for you") is labeled as Honest Echo's reading. It is never presented as regulatory text.

## Week 1: a public tracker people can trust
- Comp v2 approved, then the page built to match it.
- Real counts only. No "illustrative data" on the live page.
- "What matters this week" lists real, dated changes, each with a source.
- Agency × FAR part adoption matrix.
- Weekly job: a fenced headless run writes staging data, a fixed script checks it (sources, dates, schema), then commit, build, deploy, and a live check.
- **Done when:** the page is live, indexed in Search Console, and has survived one unattended weekly run that deployed and verified.

## Week 2: filtering by agency and business type
- "Check my impact" filter with no login: pick agency and business type, and the impacts are filtered with per-agency status.
- FAR part detail pages, starting with Part 19 (Small Business) as the pilot deep page. Each part page is indexable.
- Old-vs-new comparison for the pilot part, with interpretation kept separate from official text.
- **Done when:** the Part 19 page is a better answer than reading acquisition.gov.

## Week 3: repeat visits — BUILT 2026-11-10 on `feat/far-list` (HE-Pursuit + website), not deployed: email list, watch picks, Monday digest; send gated on Aaron
- Free watchlist: email plus chosen agencies and parts, stored in HE-Pursuit Supabase (an additive migration; green under the HE prod carve-out).
- Weekly alert email built on `email-shell.js`. It sends only when something changed for that watchlist.
- **Gate (red):** turning on the send is Aaron's tap. Growth emails stay inert until he enables them.
- Instrument with first-party events: agency selected, change inspected, watchlist joined.

## Week 4: does anyone pay?
- Offer a paid monitoring pilot to engaged watchlist users. The test prices from the review ($19 / $49 / $149) are hypotheses, not decisions.
- **Gate (red):** any price, plan or Stripe change is Aaron's tap. Site = pricing truth.
- Success is measured by agency selections, inspected changes, watchlist joins and actual payments. Page views alone don't count.

## Out of scope until the data says otherwise
~~Ads spend to drive traffic to this page. The page has to earn search traffic first.~~ Superseded 2026-11-10: Aaron, "let's go after far 2.0." The Google Ads credit adds a `far_overhaul` ad group (HE lane `d-20261110-far2`).
