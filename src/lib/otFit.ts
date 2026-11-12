// OT fit check (2026-11-12, lane decision d-20261112-otpause): the OT Radar page
// answers "which of these fit me?" before it asks for an email. The answer is
// computed here, in the browser, from the hand-checked list: no scoring API, so it
// is instant and has no daily cap.
//
// A notice's kind of work comes from its SAM.gov NAICS code (added to each row of
// src/content/ot-radar-notices.json; a refresh must carry it), or, where SAM gives
// none, from words in its title. One notice can be two kinds (a medical prototype
// is Medical and Research). The reason shown says which of the two it rests on,
// so a visitor never reads a title guess as a code match.

export type Work = 'construction' | 'research' | 'medical' | 'equipment' | 'services';

export const WORK: { key: Work; label: string; noun: string }[] = [
  { key: 'construction', label: 'Construction & facilities', noun: 'construction and facilities' },
  { key: 'research',     label: 'Research & prototypes',     noun: 'research and prototype' },
  { key: 'medical',      label: 'Medical & health',          noun: 'medical and health' },
  { key: 'equipment',    label: 'Equipment & manufacturing', noun: 'equipment and manufacturing' },
  { key: 'services',     label: 'Services & logistics',      noun: 'services and logistics' },
];

export const workLabel = (w: Work) => WORK.find(o => o.key === w)!.label;
export const workNoun = (w: Work) => WORK.find(o => o.key === w)!.noun;

// NAICS prefixes. Every rule that matches applies, so a code can give two kinds.
const NAICS_RULES: { prefix: string; work: Work }[] = [
  { prefix: '23',     work: 'construction' },
  { prefix: '5612',   work: 'construction' },  // facilities support services
  { prefix: '5617',   work: 'construction' },  // services to buildings
  { prefix: '5413',   work: 'research' },      // engineering services
  { prefix: '5417',   work: 'research' },      // scientific R&D
  { prefix: '334510', work: 'medical' },       // electromedical instruments
  { prefix: '334517', work: 'medical' },       // irradiation apparatus
  { prefix: '3391',   work: 'medical' },       // medical equipment and supplies
  { prefix: '3254',   work: 'medical' },       // pharmaceuticals
  { prefix: '62',     work: 'medical' },       // health care
  { prefix: '31',     work: 'equipment' },
  { prefix: '32',     work: 'equipment' },
  { prefix: '33',     work: 'equipment' },
  { prefix: '42',     work: 'services' },
  { prefix: '48',     work: 'services' },
  { prefix: '49',     work: 'services' },
  { prefix: '532',    work: 'services' },
  { prefix: '5614',   work: 'services' },
  { prefix: '5619',   work: 'services' },
  { prefix: '562',    work: 'services' },
];

// Only where the notice has no NAICS code.
const TITLE_RULES: { re: RegExp; work: Work }[] = [
  { re: /\b(construct\w*|renovat\w*|facilit(y|ies) maintenance|hvac|barracks|dorm\w*|design-build)\b/i, work: 'construction' },
  { re: /\b(prototype|research|r&d)\b/i, work: 'research' },
  { re: /\b(medical|health|clinical|wound|ultrasound)\b/i, work: 'medical' },
  { re: /\b(inventory|logistics|refuse|rental)\b/i, work: 'services' },
];

// A medical device code is also equipment; an R&D code on a medical title is also medical.
const MEDICAL_TITLE = /\b(medical|wound|ultrasound|ocular|clinical|trials?|health)\b/i;

export function worksForNaics(naics: string | null | undefined): Work[] {
  if (!naics) return [];
  return [...new Set(NAICS_RULES.filter(r => naics.startsWith(r.prefix)).map(r => r.work))];
}

export interface FitNotice { title: string; naics?: string | null }

export interface Fit { works: Work[]; fromTitle: boolean }

export function noticeFit(n: FitNotice): Fit {
  const byCode = worksForNaics(n.naics);
  if (byCode.length) {
    const works = new Set(byCode);
    if (MEDICAL_TITLE.test(n.title)) works.add('medical');
    return { works: [...works], fromTitle: false };
  }
  return { works: [...new Set(TITLE_RULES.filter(r => r.re.test(n.title)).map(r => r.work))], fromTitle: true };
}

// The question the visitor answered: a kind of work they picked, or their company's
// primary NAICS code from SBA's Small Business Search.
export type FitQuery =
  | { source: 'work'; work: Work }
  | { source: 'company'; name: string; naics: string; naicsTitle: string | null; works: Work[] };

// The one line under a row that says why it is on the list, or null if it isn't.
export function fitReason(n: FitNotice, q: FitQuery): string | null {
  if (q.source === 'company' && n.naics && n.naics === q.naics) {
    return `Same NAICS code as your company (${n.naics})`;
  }
  const fit = noticeFit(n);
  const wanted = q.source === 'work' ? [q.work] : q.works;
  const hit = wanted.find(w => fit.works.includes(w));
  if (!hit) return null;
  const kind = workLabel(hit);
  return fit.fromTitle ? `${kind} work named in the title` : `${kind} work (NAICS ${n.naics})`;
}
