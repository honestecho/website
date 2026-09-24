// The guide index. Adding a guide = write the page component, register it here,
// add its path to `routes` in scripts/prerender.js. That is the whole pipeline —
// the manifest feeds /resources, the Article schema on each guide, and the
// cross-links between them, so a new guide is never orphaned the way
// /government-contracts-for-bid/construction/ was.
//
// `published` is the date the page first shipped (its first commit) and does not
// change. There is deliberately no `updated` field: a hand-typed one drifts, and
// the drift is what the sitemap's frozen lastmod already cost us.

export interface Resource {
  path: string;
  title: string;
  /** One sentence, in the page's own words. */
  summary: string;
  /** Uppercase label on the card. */
  kicker: string;
  /** Short label for the footer, where the full title will not fit. */
  navLabel: string;
  published: string;
}

export const RESOURCES: Resource[] = [
  {
    path: '/sources-sought-worth-responding/',
    title: 'Should you respond to that Sources Sought notice?',
    summary:
      'No contract is awarded from a Sources Sought, but the responses decide set-asides and shape requirements before the RFP exists. How to tell a same-week response from a pass.',
    kicker: 'Sources Sought',
    navLabel: 'Sources Sought Guide',
    published: '2026-07-27',
  },
  {
    path: '/sam-gov-hidden-opportunities/',
    title: 'The SAM.gov opportunities its own search hides',
    summary:
      'Search SAM.gov by NAICS code and you never see the notices posted without one — Sources Sought, Special Notices, and draft RFPs, which is where the early, shapeable work lives.',
    kicker: 'SAM.gov search',
    navLabel: 'Hidden Opportunities',
    published: '2026-07-27',
  },
  {
    path: '/sam-gov-recompete-tracking/',
    title: 'See the recompete coming before the RFP does',
    summary:
      'Every federal contract has an end date and most of the work gets solicited again. Tracking expirations in your NAICS lane puts you quarters ahead of the solicitation.',
    kicker: 'Recompetes',
    navLabel: 'Recompete Tracking',
    published: '2026-07-27',
  },
];

export const resourceByPath = (path: string) => RESOURCES.find(r => r.path === path);
