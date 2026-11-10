// Deep-dive pages, one per FAR part: src/content/far-parts/part-N.json -> /far-overhaul/part-N/.
// The comparison in each file is fixed text dated `comparedOn`; live status (model text,
// proposed and final rule, agency listings) comes from far-overhaul.json, which the weekly
// job keeps current. Adding a part is adding its file (prerender picks it up too).

import { partByNumber } from './farApplicability';

export type ChangeType = 'removed' | 'narrowed' | 'expanded' | 'moved-to-guidance' | 'unchanged-but-reworded' | 'new';

export interface PartChange {
  id: string; topic: string; subpart: string; before: string; after: string;
  changeType: ChangeType; whatItMeans: string; whoItHits: string;
  confidence: 'high' | 'medium' | 'low'; sourceUrls: string[];
}

export interface PartDeepDive {
  part: number;
  title: string;
  comparedOn: string;
  headline: string;
  subhead: string;
  description: string;
  shortVersion: string[];
  codified: { fac: string; effective: string | null; sourceUrl: string };
  modelTextUpdates: { date: string; what: string; sourceUrl: string }[];
  dod?: { deviation: string; signed: string | null; effective: string | null; revisionDate: string | null; revisionSummary: string; sourceUrl: string };
  changes: PartChange[];
  unchanged: { topic: string; detail: string; currentCite?: string; rfoCite?: string; sourceUrls: string[] }[];
  actions: { action: string; changeId: string }[];
  agencyDates: { agency: string; short: string; date: string; basis: 'effective' | 'signature' | 'first date in memo'; sourceUrl: string }[];
  faq: { q: string; a: string }[];
  sources: { name: string; url: string }[];
}

const files = import.meta.glob<PartDeepDive>('../content/far-parts/part-*.json', { eager: true, import: 'default' });

export const PART_PAGES: Record<number, PartDeepDive> = Object.fromEntries(
  Object.values(files).map(p => [p.part, p]),
);

export const partPagePath = (n: number) => `/far-overhaul/part-${n}/`;
export const hasPartPage = (n: number) => n in PART_PAGES;

export function partPageBySlug(slug: string | undefined): PartDeepDive | undefined {
  const m = slug?.match(/^part-(\d+)$/);
  return m ? PART_PAGES[+m[1]] : undefined;
}

/** Status events in the tracker data dated after the comparison was written. */
export function newerThanComparison(dd: PartDeepDive): string[] {
  const p = partByNumber(dd.part);
  if (!p) return [];
  const out: string[] = [];
  if (p.modelTextUpdated && p.modelTextUpdated > dd.comparedOn) out.push('the model text was updated');
  if (p.proposedRule && p.proposedRule > dd.comparedOn) out.push('a proposed rule was published');
  if (p.finalRule && p.finalRule > dd.comparedOn) out.push('a final rule was published');
  return out;
}

export const CHANGE_LABEL: Record<ChangeType, { label: string; cls: string }> = {
  narrowed: { label: 'Narrowed', cls: 'border-[#f5b942]/60 text-[#f5b942]' },
  removed: { label: 'Removed', cls: 'border-[#ff8a8a]/60 text-[#ff8a8a]' },
  expanded: { label: 'Expanded', cls: 'border-[#00c3ff]/60 text-[#00c3ff]' },
  new: { label: 'New', cls: 'border-[#00c3ff]/60 text-[#00c3ff]' },
  'moved-to-guidance': { label: 'Moved to Guidance', cls: 'border-[#5b8cff]/60 text-[#9db7ff]' },
  'unchanged-but-reworded': { label: 'Same Rule, New Words', cls: 'border-[#2a3b5c] text-[#a0b2c8]' },
};
