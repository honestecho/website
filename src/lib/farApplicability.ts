// The agency x FAR part applicability engine behind /far-overhaul/.
// Inputs are the user's picks (one agency, any business focuses); outputs are the
// impacts that match the business focus, each with the reasons it matched and, per FAR
// part it touches, the adoption evidence for that agency. Model text binds an agency only
// through its own class deviation, but a listing is evidence, not proof of scope or date:
// the wording below says "listed" and sends readers to the deviation itself.
// Everything here reads src/content/far-overhaul.json; nothing is inferred beyond it.

import data from '../content/far-overhaul.json';

type RawData = typeof data;
// JSON imports type an all-null field as `null`; widen the ones the weekly job may fill.
type Widen<T, K extends keyof T> = Omit<T, K> & { [P in K]: string | null };
export type Part = Widen<RawData['parts'][number], 'finalRule' | 'finalRuleEffective' | 'finalRuleUrl' | 'nextStepDate' | 'farCase' | 'proposedRule' | 'commentsClosed' | 'proposedRuleUrl' | 'modelText' | 'modelTextUpdated' | 'nextStep' | 'note'>;
export type FarData = Omit<RawData, 'parts'> & { parts: Part[] };
export type Impact = FarData['impacts'][number];
export type Agency = FarData['agencies'][number];
export type Focus = 'small-business' | 'commercial' | 'services' | 'construction' | 'tech';

export const FAR = data as FarData;

export const FOCUS_LABELS: Record<Focus, string> = {
  'small-business': 'Small Business / Set-Asides',
  commercial: 'Commercial Products & Services',
  services: 'Professional Services',
  construction: 'Construction',
  tech: 'Technology & R&D',
};

// Chips shown first; every other agency is reachable through the full list.
export const FEATURED_AGENCIES = ['DoD', 'VA', 'GSA', 'DHS', 'HHS'].filter(s => data.agencies.some(a => a.short === s));

export const partByNumber = (n: number): Part | undefined => FAR.parts.find(p => p.part === n);
export const agencyByShort = (s: string | null | undefined): Agency | undefined => (s ? FAR.agencies.find(a => a.short === s) : undefined);
export const LIVE_PARTS = FAR.parts.filter(p => p.status !== 'reserved');

type DodDeviation = { deviation: string; revision: number; effective: string | null; url: string };
export const dodDeviationFor = (part: number): DodDeviation | undefined =>
  (FAR.dfars.byPart as Record<string, DodDeviation>)[String(part)];

// Parts the deviation guide does not track by agency, as recorded in the data with its source.
export const UNTRACKED_PARTS = new Set<number>(FAR.adoptionCoverage.untrackedParts);

export const finalInEffect = (p: Part | undefined): boolean =>
  !!p && p.status === 'final-rule' && !!p.finalRuleEffective && p.finalRuleEffective <= FAR.verifiedOn;

export type Listing = 'final-rule' | 'listed' | 'dod-list' | 'not-listed' | 'not-tracked';

export interface PartApplicability {
  part: number;
  title: string;
  listing: Listing;
  dodDeviation?: DodDeviation;
}

export function partApplicability(agency: Agency, part: number): PartApplicability {
  const p = partByNumber(part);
  const dod = agency.short === 'DoD' ? dodDeviationFor(part) : undefined;
  const listing: Listing = finalInEffect(p) ? 'final-rule'
    : agency.parts.includes(part) ? 'listed'
    : dod ? 'dod-list'
    : UNTRACKED_PARTS.has(part) ? 'not-tracked'
    : 'not-listed';
  return { part, title: p?.title ?? `Part ${part}`, listing, dodDeviation: dod };
}

/** Parts with adoption evidence for an agency, counted one way everywhere on the page. */
export const evidenceCount = (agency: Agency): number =>
  LIVE_PARTS.map(p => partApplicability(agency, p.part).listing).filter(l => l === 'listed' || l === 'dod-list' || l === 'final-rule').length;

export interface ImpactMatch {
  impact: Impact;
  matches: boolean;
  why: string[];
  parts: PartApplicability[];
}

const partList = (ps: PartApplicability[]) => ps.map(p => `Part ${p.part}`).join(', ');

export function matchImpact(impact: Impact, agency: Agency | null, focus: Focus[]): ImpactMatch {
  // The rules are governmentwide, so the agency never hides an impact; it adds evidence.
  const hits = focus.filter(f => (impact.focus as string[]).includes(f));
  const matches = focus.length === 0 || hits.length > 0;
  const why: string[] = [];
  if (hits.length) {
    why.push(`You picked ${hits.map(f => FOCUS_LABELS[f]).join(' and ')}. Who this reaches: ${impact.whoItHits}`);
  }
  const parts = agency ? [...new Set(impact.farParts)].map(n => partApplicability(agency, n)) : [];
  if (agency && parts.length) {
    const by = (l: Listing) => parts.filter(p => p.listing === l);
    const final = by('final-rule'), listed = by('listed'), dod = by('dod-list'), missing = by('not-listed'), untracked = by('not-tracked');
    if (final.length) why.push(`${partList(final)}: a final rule is in effect.`);
    if (listed.length) why.push(`${agency.short} has a class deviation listed for ${partList(listed)}. Check the deviation's text, scope and effective date.`);
    if (dod.length) why.push(`DoD's DFARS deviation list includes ${partList(dod)}. Check the deviation's text and effective date.`);
    if (missing.length) why.push(`No ${agency.short} deviation for ${partList(missing)} is listed in the FAR Council's guide. That doesn't prove there is none; check ${agency.short}'s own deviation page.`);
    if (untracked.length) why.push(`The FAR Council's guide doesn't list agency deviations for ${partList(untracked)}.`);
  }
  if (impact.status.toLowerCase().includes('proposed rule')) {
    why.push('The formal rule is still proposed. Until a final rule takes effect, the FAR itself is unchanged.');
  }
  return { impact, matches, why, parts };
}

export function matchAll(agency: Agency | null, focus: Focus[]): ImpactMatch[] {
  return FAR.impacts.map(i => matchImpact(i, agency, focus));
}

// Dates in the data are ISO days. Format in UTC so the prerendered HTML and the
// browser agree regardless of the visitor's time zone.
export function fmtDate(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }): string {
  if (!iso) return 'No date announced';
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' });
}
