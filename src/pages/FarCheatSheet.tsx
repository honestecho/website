import { useEffect, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import FarListSignup from '../components/FarListSignup';
import { BreadcrumbListSchema } from '../components/SchemaOrg';
import { track } from '../lib/analytics';
import { FAR, LIVE_PARTS, UNTRACKED_PARTS, evidenceCount, fmtDate, partApplicability } from '../lib/farApplicability';
import { CHANGE_LABEL, PART_PAGES, type ChangeType } from '../lib/farParts';
import NotFound from './NotFound';

// Printable FAR 2.0 cheat sheets, one component with one config per sheet
// (/far-overhaul/cheat-sheets/<slug>/). Light "paper" so they print well (Aaron, 2026-11-10;
// comp: Mojo/Categories/3_Honest_Echo/business/far-cheat-sheets/). Every fact comes from
// far-overhaul.json or far-parts/part-N.json as-is, so the sheets update with the weekly
// tracker run. This file holds layout and the sheets' own labels only.

const BASE = '/far-overhaul/cheat-sheets/';

// Light-paper tag colours per change type (the dark pages use CHANGE_LABEL's own classes).
const TAG: Record<ChangeType, string> = {
  new: 'bg-[#00c3ff] text-[#0b1120] border-[#00c3ff]',
  expanded: 'bg-[#dff6ff] text-[#0b1120] border-[#dff6ff]',
  narrowed: 'bg-[#dff6ff] text-[#0b1120] border-[#dff6ff]',
  removed: 'bg-[#eef1f5] text-[#0b1120] border-[#eef1f5]',
  'unchanged-but-reworded': 'bg-white text-[#0b1120] border-[#00c3ff]',
  'moved-to-guidance': 'bg-[#e3e8f3] text-[#0b1120] border-[#e3e8f3]',
};

const tag = 'self-start inline-flex items-center justify-center text-center px-2 py-1.5 rounded-lg border-[1.5px] text-[12px] leading-tight font-extrabold tracking-wide uppercase font-label w-[112px] shrink-0';
const outlinePill = 'inline-flex items-center px-2 py-0.5 rounded-full border border-slate-400 bg-white text-[12px] text-[#334155] font-body font-medium whitespace-nowrap';
const box = 'self-start w-4 h-4 mt-0.5 shrink-0 rounded-[3px] border-2 border-[#00a7db]';

type Sheet = { slug: string; title: string; short: string; description: string; status: string; body: ReactNode; actions?: string[] };

function part19Sheet(): Sheet | null {
  const dd = PART_PAGES[19];
  if (!dd) return null;
  return {
    slug: 'part-19',
    short: 'Part 19 before/after',
    title: 'FAR Part 19, rewritten: what changed for small business',
    description: `All ${dd.changes.length} Part 19 changes in the FAR overhaul on one printable sheet: what changed, what it means, and what to do now.`,
    status: `${dd.codified.effective ? `Codified in FAC ${dd.codified.fac}, effective ${fmtDate(dd.codified.effective)}` : `FAC ${dd.codified.fac}`} · Comparison: ${fmtDate(dd.comparedOn)} · Checked: ${fmtDate(FAR.verifiedOn)}`,
    body: (
      <ol className="divide-y divide-[#00a7db]/40">
        {dd.changes.map(c => (
          <li key={c.id} className="py-2.5 flex gap-3.5 break-inside-avoid">
            <span className={`${tag} ${TAG[c.changeType]}`}>{CHANGE_LABEL[c.changeType].label}</span>
            <div className="min-w-0 border-l-2 border-[#00c3ff] pl-3">
              <p className="font-headline font-extrabold text-[#0b1120] text-[17px] leading-[1.2]">
                {c.topic}
                {c.confidence !== 'high' && <span className={`${outlinePill} ml-2 align-middle`}>{c.confidence} confidence</span>}
              </p>
              <p className="text-[14px] leading-[1.35] text-[#1e293b] font-body mt-1"><span className="font-bold text-[#0b1120]">What it means:</span> {c.whatItMeans}</p>
            </div>
          </li>
        ))}
      </ol>
    ),
    actions: dd.actions.map(a => a.action),
  };
}

function agencySheet(): Sheet {
  const tracked = LIVE_PARTS.filter(p => !UNTRACKED_PARTS.has(p.part));
  const rows = FAR.agencies
    .map(a => ({ a, n: evidenceCount(a), missing: tracked.filter(p => partApplicability(a, p.part).listing === 'not-listed').map(p => p.part) }))
    .sort((x, y) => y.n - x.n || x.a.name.localeCompare(y.a.name));
  // Agencies with every tracked part get one block; the rest keep a row each.
  const full = rows.filter(r => r.n === tracked.length).sort((x, y) => x.a.short.localeCompare(y.a.short));
  const partial = rows.filter(r => r.n < tracked.length);
  return {
    slug: 'agency-adoption',
    short: 'Adoption by agency',
    title: 'FAR 2.0 adoption by agency',
    description: `Which of ${FAR.agencies.length} agencies have posted FAR overhaul class deviations, and for how many FAR parts, on one printable sheet.`,
    status: `${FAR.adoptionRule.text} Checked ${fmtDate(FAR.verifiedOn)} against the acquisition.gov deviation guide.`,
    body: (
      <>
        {full.length > 0 && (
          <div className="mb-4 rounded-lg border-[1.5px] border-[#00a7db] px-4 py-3 break-inside-avoid">
            <p className="font-headline font-extrabold text-[#0b1120] text-[17px] leading-[1.2]">Class deviations listed for all {tracked.length} tracked parts: {full.length} agencies</p>
            <p className="text-[14px] leading-[1.45] text-[#1e293b] font-body mt-1.5">{full.map(({ a }) => a.short).join(' · ')}</p>
          </div>
        )}
        <p className="font-label font-bold text-[12px] tracking-[0.14em] uppercase text-[#64748b] mb-1">Fewer than {tracked.length} tracked parts listed</p>
        <ul className="columns-1 sm:columns-2 print:columns-2 gap-x-8">
          {partial.map(({ a, n, missing }) => (
            <li key={a.short} className="py-1.5 border-b border-[#00a7db]/30 break-inside-avoid">
              <p className="flex items-baseline justify-between gap-3">
                <span className="font-headline font-bold text-[#0b1120] text-[14px] leading-snug min-w-0">{a.name} <span className="text-[#64748b] font-body font-normal">({a.short})</span></span>
                <span className={`font-label font-extrabold text-[14px] text-[#0b1120] whitespace-nowrap shrink-0 tabular-nums ${n < tracked.length ? 'underline decoration-[#00a7db] decoration-2 underline-offset-4' : ''}`}>{n} of {tracked.length}</span>
              </p>
              {missing.length > 0 && missing.length < tracked.length && (
                <p className="text-[13px] leading-snug text-[#475569] font-body mt-0.5">None listed for {missing.length === 1 ? 'Part' : 'Parts'} {missing.join(', ')}</p>
              )}
              {missing.length === tracked.length && <p className="text-[13px] leading-snug text-[#475569] font-body mt-0.5">None listed</p>}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[13px] leading-snug text-[#334155] font-body">
          Counts are FAR parts with a class deviation listed for that agency{FAR.agencies.some(a => a.short === 'DoD') ? ", or on DoD's DFARS deviation list for DoD" : ''}, out of the {tracked.length} parts the guide tracks by agency.
          {UNTRACKED_PARTS.size > 0 && ` Parts ${[...UNTRACKED_PARTS].sort((x, y) => x - y).join(' and ')} are not listed by agency in the guide.`} No listing doesn't prove there is no deviation; check the agency's own page.
        </p>
      </>
    ),
  };
}

function checklistSheet(): Sheet {
  return {
    slug: 'bid-checklist',
    short: 'FAR 2.0 bid checklist',
    title: `FAR 2.0 bid checklist: the ${FAR.impacts.length} biggest impacts`,
    description: `The ${FAR.impacts.length} biggest FAR overhaul impacts for contractors, each with what to do now, as a printable checklist.`,
    status: `Honest Echo's ranking (our judgment) · Checked ${fmtDate(FAR.verifiedOn)} against acquisition.gov, the Federal Register and DoD's deviation list`,
    body: (
      <ol className="divide-y divide-[#00a7db]/40">
        {FAR.impacts.map(i => (
          <li key={i.rank} className="py-2.5 grid grid-cols-[18px_30px_1fr] gap-x-2 break-inside-avoid">
            <span className={`${box} mt-1`} aria-hidden="true" />
            <span className="font-headline font-black text-[#00a7db] text-[17px] leading-[1.2] text-right">{i.rank}.</span>
            <div className="min-w-0">
              <p className="font-headline font-extrabold text-[#0b1120] text-[17px] leading-[1.2]">{i.title}</p>
              <p className="text-[14px] leading-[1.35] text-[#1e293b] font-body mt-1"><span className="font-bold text-[#0b1120]">Do this now:</span> {i.doNow}</p>
              <p className="text-[13px] leading-snug text-[#64748b] font-body mt-1.5">{i.parts.join(', ')} · Who it hits: {i.whoItHits}</p>
            </div>
          </li>
        ))}
      </ol>
    ),
  };
}

export const CHEAT_SHEETS = (): Sheet[] => [part19Sheet(), agencySheet(), checklistSheet()].filter((s): s is Sheet => !!s);

function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <img src="/he-logo-mark-light.png" alt="" className={small ? 'h-6 w-auto' : 'h-11 w-auto'} />
      <span className="flex flex-col">
        <span className={`font-headline font-black tracking-tighter leading-none ${small ? 'text-sm' : 'text-2xl'}`}>
          <span className="text-[#0b1120]">Honest </span><span className="text-[#00a7db]">Echo</span>
        </span>
        {!small && <span className="font-label text-[10px] text-[#64748b] tracking-[0.2em] uppercase mt-1">Know Before You Bid</span>}
      </span>
    </span>
  );
}

const PRINT_CSS = `
@media print {
  @page { size: letter; margin: 0.4in; }
  html, body { background: #fff !important; }
  .min-h-screen { min-height: 0 !important; }
  nav, footer, .no-print, [aria-hidden="true"].fixed { display: none !important; }
  main { padding: 0 !important; }
  .far-sheet { box-shadow: none !important; border: 0 !important; margin: 0 !important; padding: 0 !important; max-width: none !important; zoom: 0.8; }
  .far-sheet-page { padding: 0 !important; }
}`;

export default function FarCheatSheet() {
  const { sheet: slug } = useParams();
  const sheets = CHEAT_SHEETS();
  const s = sheets.find(x => x.slug === slug);
  useEffect(() => { if (s) track('far_cheatsheet_viewed', { sheet: s.slug }); }, [s?.slug]);
  if (!s) return <NotFound />;
  const path = `${BASE}${s.slug}/`;
  const url = `https://honestecho.com${path}`;

  const print = () => { track('far_cheatsheet_printed', { sheet: s.slug }); window.print(); };

  return (
    <>
      <Helmet>
        <title>{`${s.title} (printable) | Honest Echo`}</title>
        <meta name="description" content={s.description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={s.title} />
        <meta property="og:description" content={s.description} />
        <meta property="og:image" content="https://honestecho.com/og-image.jpg" />
        <style>{PRINT_CSS}</style>
      </Helmet>
      <BreadcrumbListSchema items={[{ name: 'Home', path: '/' }, { name: 'FAR Overhaul Tracker', path: '/far-overhaul/' }, { name: s.short, path }]} />

      <div className="far-sheet-page pt-10 pb-16 px-4 sm:px-6">
        <div className="no-print max-w-[8.5in] mx-auto mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link to="/far-overhaul/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#a0b2c8] hover:text-white font-body"><ArrowLeft className="w-4 h-4" /> FAR Overhaul Tracker</Link>
          <div className="flex flex-wrap gap-2">
            {sheets.filter(x => x.slug !== s.slug).map(x => (
              <Link key={x.slug} to={`${BASE}${x.slug}/`} className="px-3 py-1.5 rounded-lg border border-[#1e2d4a] text-sm text-[#c9d5e3] hover:border-[#00c3ff]/50 font-body">{x.short}</Link>
            ))}
            <button type="button" onClick={print} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#00c3ff] text-[#030B17] text-sm font-bold font-headline"><Printer className="w-4 h-4" /> Print or save as PDF</button>
          </div>
        </div>

        <article className="far-sheet max-w-[8.5in] mx-auto bg-white text-[#0b1120] rounded-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] p-6 sm:p-10">
          <header className="flex items-center gap-4">
            <Wordmark />
            <span className="flex-1 h-px bg-[#00c3ff]" aria-hidden="true" />
            <span className="hidden sm:inline-flex print:inline-flex px-2.5 py-1 rounded-full border border-[#0b1120] text-[10px] font-bold tracking-[0.18em] uppercase font-label">FAR 2.0 cheat sheet</span>
          </header>
          <h1 className="font-headline font-black text-[#0b1120] text-2xl sm:text-[28px] leading-tight tracking-tight mt-6">{s.title}</h1>
          <p className="mt-3 rounded-md bg-[#e6f8ff] px-3 py-2 text-[13px] leading-snug text-[#334155] font-body">{s.status}</p>

          <div className="mt-4">{s.body}</div>

          {s.actions && s.actions.length > 0 && (
            <section className="mt-6 rounded-xl border-[1.5px] border-[#00a7db] overflow-hidden break-inside-avoid">
              <h2 className="bg-[#e6f8ff] px-4 py-2 font-headline font-extrabold text-[#00a7db] text-[22px]">Do this now</h2>
              <ul className="px-4 py-3 space-y-2">
                {s.actions.map(a => (
                  <li key={a} className="flex gap-2.5 text-[14px] leading-[1.35] text-[#0b1120] font-body"><span className={box} aria-hidden="true" />{a}</li>
                ))}
              </ul>
            </section>
          )}

          <footer className="mt-6 pt-3 border-t border-[#00c3ff] flex flex-col sm:flex-row print:flex-row sm:items-center justify-between gap-2">
            <span className="flex items-center gap-2.5 text-[12px] text-[#475569] font-body"><Wordmark small /><span className="flex flex-col leading-tight"><span>honestecho.com/far-overhaul</span><span className="font-semibold text-[#0b1120]">Free FAR 2.0 Monday email</span></span></span>
            <span className="text-[12px] text-[#64748b] font-body">Our reading, not legal advice. Check the solicitation&rsquo;s clause list.</span>
          </footer>
        </article>

        <div className="no-print max-w-[8.5in] mx-auto mt-8">
          <FarListSignup placement={`cheatsheet-${s.slug}`} watch={s.slug === 'part-19' ? { agencies: [], parts: [19] } : null} />
        </div>
      </div>
    </>
  );
}
