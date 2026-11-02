import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, Building2, CheckCircle2, FileText, Gavel, Layers, ScrollText } from 'lucide-react';
import FlyIn from '../components/FlyIn';
import RelatedGuides from '../components/RelatedGuides';
import { BreadcrumbListSchema, FAQPageSchema, ldJson } from '../components/SchemaOrg';
import { track } from '../lib/analytics';
import {
  FAR, FEATURED_AGENCIES, FOCUS_LABELS, LIVE_PARTS, agencyByShort, dodDeviationFor, evidenceCount, fmtDate, matchAll,
  partApplicability, partByNumber, type Focus, type Listing, type Part,
} from '../lib/farApplicability';

// Content comes from src/content/far-overhaul.json, rewritten by the weekly tracker
// job and gated by scripts/check-far-data.mjs. This file holds layout only: change a
// fact in the JSON, never here. Every count and label below is derived from that file,
// and every list tolerates the weekly job adding or removing entries.

const PATH = '/far-overhaul/';
const URL_ = `https://honestecho.com${PATH}`;
const TITLE = 'FAR Overhaul Tracker (FAR 2.0): Status, Agency Adoption, and Impacts';
const DESC = 'Where the Revolutionary FAR Overhaul stands, part by part: model text, agency class deviations, proposed rules, and final rules. Checked weekly against official sources, with what each change means for your next bid.';

const card = 'bg-[#0b1120] border border-[#1e2d4a] rounded-2xl';
const pill = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-widest uppercase font-label';
const chipBase = 'px-3.5 py-2 rounded-full text-sm font-semibold font-body border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]';
const chipOn = 'bg-[#00c3ff] border-[#00c3ff] text-[#030B17]';
const chipOff = 'bg-transparent border-[#1e2d4a] text-[#c9d5e3] hover:border-[#00c3ff]/50';
const selectCls = 'w-full max-w-full min-w-0 sm:w-auto bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]';

const LISTING_STYLE: Record<Listing, { tile: string; chip: string; label: string }> = {
  'final-rule': { tile: 'bg-white border-white text-[#030B17]', chip: 'bg-white/90 text-[#030B17] border border-white', label: 'final rule in effect' },
  listed: { tile: 'bg-[#00c3ff] border-[#00c3ff] text-[#030B17]', chip: 'bg-[#00c3ff]/15 text-[#00c3ff] border border-[#00c3ff]/40', label: 'deviation listed' },
  'dod-list': { tile: 'bg-[#00c3ff]/60 border-[#00c3ff] text-[#030B17]', chip: 'bg-[#00c3ff]/10 text-[#00c3ff] border border-[#00c3ff]/30', label: "on DoD's DFARS list" },
  'not-listed': { tile: 'border-dashed border-[#2a3b5c] text-[#8b9bb4]', chip: 'border border-dashed border-[#2a3b5c] text-[#8b9bb4]', label: 'none listed' },
  'not-tracked': { tile: 'border-[#2a3b5c] bg-[#1e2d4a]/40 text-[#8b9bb4]', chip: 'border border-[#2a3b5c] bg-[#1e2d4a]/40 text-[#8b9bb4]', label: 'not listed by agency in the guide' },
};

const STATUS_STYLE: Record<string, { tile: string; label: string }> = {
  'final-rule': { tile: 'bg-white text-[#030B17] border-white', label: 'Final rule published' },
  'proposed-rule': { tile: 'bg-[#00c3ff] text-[#030B17] border-[#00c3ff]', label: 'Proposed rule published' },
  'model-text': { tile: 'bg-[#5b8cff] text-[#030B17] border-[#5b8cff]', label: 'Model text only, proposed rule not yet published' },
  reserved: { tile: 'bg-transparent text-[#8b9bb4] border-dashed border-[#2a3b5c]', label: 'Reserved (no content)' },
};
const STATUS_ORDER = ['final-rule', 'proposed-rule', 'model-text', 'reserved'];

function Source({ href, label = 'Official source' }: { href: string; label?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-[#00c3ff] hover:text-white transition-colors font-body">
      {label} <ArrowUpRight className="w-3.5 h-3.5" />
    </a>
  );
}

function Verified() {
  return <span className="text-xs text-[#8b9bb4] font-body">Verified {fmtDate(FAR.verifiedOn, { month: 'short', day: 'numeric' })}</span>;
}

function SectionHead({ id, kicker, title, sub }: { id: string; kicker: string; title: string; sub?: string }) {
  return (
    <div id={id} className="scroll-mt-24 mb-8">
      <span className={`${pill} bg-[#00c3ff]/10 border border-[#00c3ff]/20 text-[#00c3ff] mb-4`}>{kicker}</span>
      <h2 className="font-headline font-black text-white text-3xl md:text-4xl tracking-tight">{title}</h2>
      {sub && <p className="text-[#a0b2c8] font-body mt-3 max-w-3xl leading-relaxed">{sub}</p>}
    </div>
  );
}

function PartStatusDetail({ p }: { p: Part }) {
  const dod = dodDeviationFor(p.part);
  const listing = FAR.agencies.filter(a => a.parts.includes(p.part)).length;
  return (
    <>
      <dl className="space-y-3 text-sm font-body">
        <div><dt className="text-[#8b9bb4]">Status</dt><dd className="text-white">{STATUS_STYLE[p.status]?.label ?? p.status}</dd></div>
        {p.status !== 'reserved' && <>
          <div><dt className="text-[#8b9bb4]">Model text</dt><dd className="text-[#c9d5e3]">{fmtDate(p.modelText)}{p.modelTextUpdated && `, updated ${fmtDate(p.modelTextUpdated)}`}</dd></div>
          <div><dt className="text-[#8b9bb4]">Proposed rule</dt><dd className="text-[#c9d5e3]">
            {p.proposedRule ? <>{p.farCase}, published {fmtDate(p.proposedRule)}{p.commentsClosed && `; comments closed ${fmtDate(p.commentsClosed)}`}</> : <>{p.farCase ? `${p.farCase}: ` : ''}not yet published</>}
          </dd></div>
          {p.finalRule && <div><dt className="text-[#8b9bb4]">Final rule</dt><dd className="text-[#c9d5e3]">Published {fmtDate(p.finalRule)}; {p.finalRuleEffective ? `effective ${fmtDate(p.finalRuleEffective)}` : 'no effective date stated'}</dd></div>}
          <div><dt className="text-[#8b9bb4]">Next step</dt><dd className="text-[#c9d5e3]">{p.nextStep ?? 'No date announced'}</dd></div>
          <div><dt className="text-[#8b9bb4]">Agencies with a deviation listed</dt><dd className="text-[#c9d5e3]">
            {FAR.adoptionCoverage.untrackedParts.includes(p.part) ? 'The guide does not list agency deviations for this part' : `${listing} of ${FAR.agencies.length}`}
          </dd></div>
          {dod && <div><dt className="text-[#8b9bb4]">DoD class deviation</dt><dd className="text-[#c9d5e3]">{dod.deviation}{dod.revision > 0 && `, Revision ${dod.revision}`}{dod.effective && ` (original effective ${fmtDate(dod.effective)})`}</dd></div>}
        </>}
        {p.note && <div><dt className="text-[#8b9bb4]">Note</dt><dd className="text-[#c9d5e3] leading-relaxed">{p.note}</dd></div>}
      </dl>
      <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-[#1e2d4a]">
        <Source href={p.sourceUrl} label="Model text" />
        {p.proposedRuleUrl && <Source href={p.proposedRuleUrl} label="Proposed rule" />}
        {p.finalRuleUrl && <Source href={p.finalRuleUrl} label="Final rule" />}
        {dod && <Source href={dod.url} label="DoD deviation" />}
      </div>
    </>
  );
}

// ── Status: four parallel tracks ────────────────────────────────────────────
function StatusTracks() {
  const L = FAR.layers;
  const tracks = [
    { Icon: FileText, label: 'Model text published', value: `${L.modelText.parts} of ${L.modelText.of}`, caption: 'FAR parts with rewritten text (reserved parts excluded)', href: L.modelText.sourceUrl },
    { Icon: Building2, label: 'Agencies with deviations posted', value: String(L.agencyAdoption.agencies), caption: 'Agencies listed in the FAR Council deviation guide', href: L.agencyAdoption.sourceUrl },
    { Icon: ScrollText, label: 'Proposed rules published', value: `${L.proposedRules.published} of ${L.proposedRules.planned}`, caption: `Covering ${L.proposedRules.parts} parts. ${L.proposedRules.note}.`, href: L.proposedRules.sourceUrl },
    { Icon: Gavel, label: 'Final rules', value: String(L.finalRules.published), caption: L.finalRules.note, href: L.finalRules.sourceUrl },
  ];
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tracks.map(t => (
          <div key={t.label} className={`${card} p-5 md:p-6 flex flex-col min-w-0`}>
            <t.Icon className="w-5 h-5 text-[#00c3ff] drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] mb-3" strokeWidth={2} />
            <span className="text-sm text-[#c9d5e3] font-body">{t.label}</span>
            <span className="font-headline font-black text-white text-3xl md:text-5xl tracking-tight my-2 whitespace-nowrap">{t.value}</span>
            <span className="text-xs text-[#8b9bb4] font-body leading-relaxed flex-1">{t.caption}</span>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-[#1e2d4a]">
              <Verified />
              <Source href={t.href} label="Source" />
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-[#8b9bb4] font-body mt-4">
        These tracks run in parallel, not one after another. Until a final rule takes effect, the rewritten text reaches an agency through its own class deviation.{' '}
        <a href={FAR.adoptionRule.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#00c3ff] hover:text-white">(FAR overhaul FAQ)</a>
      </p>
    </div>
  );
}

// ── What matters this week ───────────────────────────────────────────────────
function ThisWeek() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {FAR.thisWeek.map(c => (
        <FlyIn key={c.title}>
          <article className={`${card} p-6 h-full flex flex-col`}>
            <span className={`${pill} bg-[#00c3ff]/10 border border-[#00c3ff]/20 text-[#00c3ff] self-start mb-4`}>{fmtDate(c.date)}</span>
            <h3 className="font-headline font-bold text-white text-xl tracking-tight mb-4">{c.title}</h3>
            <p className="text-xs font-label uppercase tracking-widest text-[#8b9bb4] mb-1">What changed</p>
            <p className="text-sm text-[#c9d5e3] font-body leading-relaxed mb-4">{c.whatChanged}</p>
            <p className="text-xs font-label uppercase tracking-widest text-[#8b9bb4] mb-1">What it means for you <span className="normal-case tracking-normal">(our reading)</span></p>
            <p className="text-sm text-white font-body leading-relaxed mb-4">{c.meaning}</p>
            <p className="text-xs text-[#8b9bb4] font-body mb-4">
              <span className="text-[#c9d5e3]">Applies to:</span> {c.appliesTo}
              {c.parts.length > 0 && <> <span className="text-[#c9d5e3]">Touches:</span> {c.parts.map(n => `Part ${n}`).join(', ')}</>}
            </p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#1e2d4a]">
              <Source href={c.sourceUrl} />
              <Verified />
            </div>
          </article>
        </FlyIn>
      ))}
    </div>
  );
}

// ── Check my impact + the ranked impacts ─────────────────────────────────────
function ImpactChecker() {
  const [agencyShort, setAgencyShort] = useState<string | null>(null);
  const [focus, setFocus] = useState<Focus[]>([]);
  const agency = agencyByShort(agencyShort) ?? null;
  const results = useMemo(() => matchAll(agency, focus), [agency, focus]);
  const total = results.length;
  const picked = agency !== null || focus.length > 0;
  const shown = results.filter(r => r.matches);
  const hidden = total - shown.length;
  const others = FAR.agencies.filter(a => !FEATURED_AGENCIES.includes(a.short)).sort((a, b) => a.name.localeCompare(b.name));
  const featuredLabel = (name: string) => name.replace(/^Department of (the )?/, '').replace(/^General Services Administration$/, 'GSA');

  const pickAgency = (s: string | null) => {
    setAgencyShort(s);
    if (s) track('far_tracker_agency_selected', { agency: s });
  };
  const toggleFocus = (f: Focus) => {
    const next = focus.includes(f) ? focus.filter(x => x !== f) : [...focus, f];
    setFocus(next);
    track('far_tracker_focus_changed', { focus: next.join(',') });
  };

  if (total === 0) return <p className="text-[#a0b2c8] font-body">No impacts are listed this week.</p>;

  return (
    <>
      <div className={`${card} p-6 md:p-8 mb-8`}>
        <fieldset className="mb-6 min-w-0">
          <legend className="text-sm font-semibold text-white font-body mb-3">I sell to</legend>
          <div className="flex flex-wrap gap-2 min-w-0">
            {FEATURED_AGENCIES.map(s => {
              const a = agencyByShort(s);
              if (!a) return null;
              const on = agencyShort === s;
              return (
                <button key={s} type="button" aria-pressed={on} onClick={() => pickAgency(on ? null : s)} className={`${chipBase} ${on ? chipOn : chipOff}`}>
                  {featuredLabel(a.name)}
                </button>
              );
            })}
            <label className="sr-only" htmlFor="far-agency-other">Another agency</label>
            <select
              id="far-agency-other"
              value={agencyShort && !FEATURED_AGENCIES.includes(agencyShort) ? agencyShort : ''}
              onChange={e => pickAgency(e.target.value || null)}
              className={`${selectCls} sm:rounded-full ${agencyShort && !FEATURED_AGENCIES.includes(agencyShort) ? '!border-[#00c3ff]' : ''}`}
            >
              <option value="">Another agency…</option>
              {others.map(a => <option key={a.short} value={a.short}>{a.name}</option>)}
            </select>
          </div>
        </fieldset>
        <fieldset className="min-w-0">
          <legend className="text-sm font-semibold text-white font-body mb-3">My business</legend>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(FOCUS_LABELS) as Focus[]).map(f => {
              const on = focus.includes(f);
              return (
                <button key={f} type="button" aria-pressed={on} onClick={() => toggleFocus(f)} className={`${chipBase} ${on ? chipOn : chipOff}`}>
                  {FOCUS_LABELS[f]}
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="mt-6 pt-5 border-t border-[#1e2d4a] flex flex-col sm:flex-row sm:items-center justify-between gap-3" aria-live="polite">
          <p className="font-headline font-bold text-white text-xl">
            {focus.length > 0
              ? <><span className="text-[#00c3ff] text-3xl font-black">{shown.length}</span> of {total} top impacts reach your kind of business</>
              : agency
                ? `Showing all ${total} impacts with ${agency.short}'s adoption evidence for each part.`
                : 'Pick an agency and your business to see which changes reach you, and why.'}
          </p>
          {picked && (
            <button type="button" onClick={() => { setAgencyShort(null); setFocus([]); }} className="text-sm font-semibold text-[#8b9bb4] hover:text-white font-body self-start sm:self-auto">
              Clear
            </button>
          )}
        </div>
        {agency && <p className="text-xs text-[#8b9bb4] font-body mt-3">The overhaul's rules are governmentwide, so picking an agency doesn't hide impacts. It adds that agency's deviation evidence to each one.</p>}
      </div>

      <ol className="space-y-3">
        {shown.map(({ impact, why, parts }) => (
          <li key={impact.rank} className={`${card} p-5 md:p-6 group hover:border-[#00c3ff]/40 transition-colors`}>
            <div className="flex gap-4 md:gap-6">
              <span className="font-headline font-black text-4xl md:text-5xl text-transparent [-webkit-text-stroke:1.5px_#00c3ff] w-10 md:w-14 shrink-0 leading-none" aria-hidden="true">{impact.rank}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-headline font-bold text-white text-lg md:text-xl tracking-tight"><span className="sr-only">{impact.rank}. </span>{impact.title}</h3>
                <p className="text-sm text-[#c9d5e3] font-body leading-relaxed mt-2"><span className="text-[#8b9bb4]">What changed: </span>{impact.whatChanged}</p>
                <p className="text-sm text-white font-body leading-relaxed mt-2"><span className="text-[#8b9bb4]">Do this now: </span>{impact.doNow}</p>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {impact.parts.map(p => <span key={p} className="px-2.5 py-1 rounded-md border border-[#1e2d4a] text-xs text-[#c9d5e3] font-body">{p}</span>)}
                  {agency && parts.map(p => (
                    <span key={p.part} className={`px-2.5 py-1 rounded-md text-xs font-semibold font-body ${LISTING_STYLE[p.listing].chip}`}>
                      {agency.short} Part {p.part}: {LISTING_STYLE[p.listing].label}
                    </span>
                  ))}
                </div>
                {picked && why.length > 0 && (
                  <div className="mt-4 rounded-xl bg-[#00c3ff]/5 border border-[#00c3ff]/15 p-4">
                    <p className="text-xs font-label uppercase tracking-widest text-[#00c3ff] mb-2">Why you're seeing this</p>
                    <ul className="space-y-1.5 text-sm text-[#c9d5e3] font-body leading-relaxed list-disc pl-4">
                      {why.map(w => <li key={w}>{w}</li>)}
                    </ul>
                    <p className="text-xs text-[#8b9bb4] font-body mt-3">Relevance alone doesn't mean a new requirement applies to your bid. The solicitation's clause list decides that.</p>
                  </div>
                )}
                {/* Native <details>: the full facts are in the prerendered HTML even while collapsed. */}
                <details className="mt-4" onToggle={e => { if ((e.currentTarget as HTMLDetailsElement).open) track('far_tracker_impact_opened', { rank: impact.rank }); }}>
                  <summary className="text-sm font-semibold text-[#00c3ff] hover:text-white font-body cursor-pointer">Who it hits, status, and source</summary>
                  <dl className="mt-3 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm font-body">
                    <dt className="text-[#8b9bb4]">Who it hits</dt><dd className="text-[#c9d5e3]">{impact.whoItHits}</dd>
                    <dt className="text-[#8b9bb4]">Status</dt><dd className="text-[#c9d5e3]">{impact.status}</dd>
                    <dt className="text-[#8b9bb4]">Why it ranks here</dt><dd className="text-[#c9d5e3]">{impact.rankBasis} <span className="text-[#8b9bb4]">(our judgment)</span></dd>
                    <dt className="text-[#8b9bb4]">Source</dt><dd><Source href={impact.sourceUrl} /></dd>
                  </dl>
                </details>
              </div>
            </div>
          </li>
        ))}
      </ol>
      {focus.length > 0 && hidden > 0 && (
        <p className="text-sm text-[#8b9bb4] font-body mt-4">{hidden} more {hidden === 1 ? 'impact doesn’t' : 'impacts don’t'} match your picks. <button type="button" onClick={() => setFocus([])} className="text-[#00c3ff] hover:text-white font-semibold">Show all {total}</button></p>
      )}
    </>
  );
}

// ── Roadmap: timeline lanes, built from the phases in the data ────────────────
function Timeline() {
  const asOf = FAR.verifiedOn;
  const LANES = [
    { key: 'model', name: 'Model text' },
    { key: 'adoption', name: 'Agency adoption' },
    { key: 'rulemaking', name: 'Proposed rules' },
    { key: 'final', name: 'Final rules' },
  ];
  const laned = FAR.phases.filter(p => p.lane);
  const dodStart = FAR.dfars.effectiveDates[0] ?? null;
  const dates = [asOf, ...laned.flatMap(p => [p.date, p.endDate]), dodStart].filter((d): d is string => !!d).sort();
  const span = (d: string) => Date.parse(d);
  const t0 = span(dates[0]) - 45 * 864e5;
  const t1 = span(dates[dates.length - 1]) + 240 * 864e5;
  const pos = (iso: string) => `${Math.min(100, Math.max(0, ((span(iso) - t0) / (t1 - t0)) * 100))}%`;
  const years: string[] = [];
  for (let y = new Date(t0).getUTCFullYear(); y <= new Date(t1).getUTCFullYear(); y++) for (const m of ['01', '07']) {
    const d = `${y}-${m}-01`;
    if (span(d) > t0 && span(d) < t1) years.push(d);
  }
  const rows = LANES.map(l => {
    const ps = laned.filter(p => p.lane === l.key);
    const bars = ps.filter(p => p.date && p.endDate).map(p => [p.date!, p.endDate!] as [string, string]);
    const dots = ps.filter(p => p.date && !p.endDate).map(p => ({ at: p.date!, label: p.short ?? p.name }));
    if (l.key === 'model') ps.filter(p => p.date && p.endDate).forEach(p => dots.push({ at: p.date!, label: 'First parts' }, { at: p.endDate!, label: 'Last parts' }));
    if (l.key === 'adoption' && dodStart) dots.push({ at: dodStart, label: 'DoD deviations in effect' });
    const pending = ps.filter(p => !p.date).map(p => `${p.short ?? p.name}: no date announced`);
    const tail = l.key === 'adoption' ? 'Ongoing' : pending.join(' · ') || undefined;
    return { ...l, bars, dots, tail };
  });
  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <div className="min-w-[640px]">
        <div className="relative h-6 ml-36 text-xs text-[#8b9bb4] font-body">
          {years.map(y => <span key={y} className="absolute -translate-x-1/2" style={{ left: pos(y) }}>{fmtDate(y, { month: 'short', year: 'numeric' })}</span>)}
        </div>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-36 right-0 pointer-events-none">
            <div className="absolute top-0 bottom-0 border-l border-dashed border-[#00c3ff]" style={{ left: pos(asOf) }}>
              <span className="absolute -top-6 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-[#00c3ff] font-body">As of {fmtDate(asOf, { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
          {rows.map(l => (
            <div key={l.key} className="flex items-center h-16 border-t border-[#1e2d4a]">
              <span className="w-36 shrink-0 text-sm font-semibold text-white font-body">{l.name}</span>
              <div className="relative flex-1 h-full">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-[#1e2d4a]" />
                {l.bars.map(([a, b]) => (
                  <div key={a} className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-[#00c3ff]/70" style={{ left: pos(a), width: `calc(${pos(b)} - ${pos(a)})` }} />
                ))}
                {l.dots.map(d => (
                  <div key={d.at + d.label} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: pos(d.at) }}>
                    <div className="w-3 h-3 rounded-full bg-[#00c3ff] shadow-[0_0_10px_rgba(0,195,255,0.8)]" />
                    <span className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-[#c9d5e3] font-body">{d.label} · {fmtDate(d.at, { month: 'short', year: 'numeric' })}</span>
                  </div>
                ))}
                {l.tail && <span className="absolute top-1/2 -translate-y-1/2 right-0 text-xs italic text-[#8b9bb4] font-body bg-[#0b1120] pl-2">{l.tail}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Roadmap: every FAR part ──────────────────────────────────────────────────
function PartGrid() {
  const fallback = (partByNumber(19) ?? LIVE_PARTS[0] ?? FAR.parts[0])?.part ?? null;
  const [sel, setSel] = useState<number | null>(fallback);
  const p = sel !== null ? partByNumber(sel) : undefined;
  const counts = FAR.parts.reduce<Record<string, number>>((m, x) => ({ ...m, [x.status]: (m[x.status] ?? 0) + 1 }), {});
  if (!FAR.parts.length) return <p className="text-[#a0b2c8] font-body">Part data is unavailable this week.</p>;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
      <div className="min-w-0">
        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4 text-xs text-[#c9d5e3] font-body">
          {STATUS_ORDER.filter(s => counts[s]).map(s => (
            <span key={s} className="inline-flex items-center gap-2"><span className={`w-3 h-3 rounded-sm border ${STATUS_STYLE[s].tile}`} />{STATUS_STYLE[s].label} ({counts[s]})</span>
          ))}
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5">
          {FAR.parts.map(x => (
            <button
              key={x.part}
              type="button"
              aria-pressed={sel === x.part}
              aria-label={`Part ${x.part}, ${x.title}: ${STATUS_STYLE[x.status]?.label ?? x.status}`}
              onClick={() => { setSel(x.part); track('far_tracker_part_opened', { part: x.part }); }}
              className={`aspect-square rounded-lg border text-xs font-bold font-body transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${STATUS_STYLE[x.status]?.tile ?? ''} ${sel === x.part ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0b1120]' : ''}`}
            >
              {x.part}
            </button>
          ))}
        </div>
      </div>
      <div className={`${card} p-6 bg-[#050d1a] min-w-0`} aria-live="polite">
        {p ? <>
          <p className="text-xs font-label uppercase tracking-widest text-[#00c3ff] mb-1">FAR Part {p.part}</p>
          <h3 className="font-headline font-bold text-white text-xl tracking-tight mb-4">{p.title}</h3>
          <PartStatusDetail p={p} />
        </> : <p className="text-sm text-[#8b9bb4] font-body">Pick a part.</p>}
      </div>
    </div>
  );
}

// Every part's facts as one table, so search engines and no-JS readers get all of them.
function PartTable() {
  return (
    <details className="mt-6">
      <summary className="text-sm font-semibold text-[#00c3ff] hover:text-white font-body cursor-pointer">All {FAR.parts.length} parts as a table</summary>
      <div className="overflow-x-auto mt-4">
        <table className="w-full min-w-[640px] text-sm font-body text-left">
          <thead className="text-xs uppercase tracking-widest text-[#8b9bb4] font-label">
            <tr><th className="py-2 pr-4">Part</th><th className="py-2 pr-4">Status</th><th className="py-2 pr-4">Model text</th><th className="py-2 pr-4">Proposed rule</th><th className="py-2">Next step</th></tr>
          </thead>
          <tbody className="divide-y divide-[#1e2d4a] text-[#c9d5e3]">
            {FAR.parts.map(p => (
              <tr key={p.part}>
                <td className="py-2 pr-4 align-top"><a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#00c3ff]">{p.part}. {p.title}</a></td>
                <td className="py-2 pr-4 align-top">{STATUS_STYLE[p.status]?.label ?? p.status}</td>
                <td className="py-2 pr-4 align-top whitespace-nowrap">{p.status === 'reserved' ? '' : fmtDate(p.modelText)}</td>
                <td className="py-2 pr-4 align-top">{p.proposedRule ? <a href={p.proposedRuleUrl ?? p.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#00c3ff]">{fmtDate(p.proposedRule)}</a> : p.status === 'reserved' ? '' : 'Not yet published'}</td>
                <td className="py-2 align-top">{p.nextStep ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

// ── Roadmap: agency x part ───────────────────────────────────────────────────
function AgencyMatrix() {
  const byName = [...FAR.agencies].sort((a, b) => a.name.localeCompare(b.name));
  const [short, setShort] = useState<string | null>((agencyByShort('DoD') ?? byName[0])?.short ?? null);
  const [part, setPart] = useState<number | null>(null);
  const agency = agencyByShort(short);
  if (!agency || !LIVE_PARTS.length) return <p className="text-[#a0b2c8] font-body">Agency adoption data is unavailable this week.</p>;
  const cells = LIVE_PARTS.map(p => partApplicability(agency, p.part));
  const listedCount = evidenceCount(agency);
  const detail = part !== null ? cells.find(c => c.part === part) ?? null : null;
  const ranked = FAR.agencies.map(a => ({ a, n: evidenceCount(a) })).sort((x, y) => y.n - x.n || x.a.name.localeCompare(y.a.name));
  const legend = (Object.keys(LISTING_STYLE) as Listing[]).filter(l => cells.some(c => c.listing === l));
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div className="min-w-0">
        <label htmlFor="far-matrix-agency" className="block sm:inline text-sm font-semibold text-white font-body mb-2 sm:mb-0 sm:mr-3">Agency</label>
        <select id="far-matrix-agency" value={agency.short} onChange={e => { setShort(e.target.value); setPart(null); track('far_tracker_matrix_agency', { agency: e.target.value }); }} className={selectCls}>
          {byName.map(a => <option key={a.short} value={a.short}>{a.name}</option>)}
        </select>
        <p className="text-sm text-[#c9d5e3] font-body mt-4 mb-3">
          <span className="font-headline font-black text-white text-2xl">{listedCount}</span> of {LIVE_PARTS.length} FAR parts have adoption evidence for {agency.short}.
        </p>
        <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5">
          {cells.map(c => (
            <button
              key={c.part}
              type="button"
              aria-pressed={part === c.part}
              aria-label={`Part ${c.part}: ${LISTING_STYLE[c.listing].label}`}
              onClick={() => setPart(c.part)}
              className={`aspect-square rounded-lg text-xs font-bold font-body border focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${LISTING_STYLE[c.listing].tile} ${part === c.part ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0b1120]' : ''}`}
            >
              {c.part}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs text-[#c9d5e3] font-body">
          {legend.map(l => (
            <span key={l} className="inline-flex items-center gap-2"><span className={`w-3 h-3 rounded-sm border ${LISTING_STYLE[l].tile}`} />{LISTING_STYLE[l].label.charAt(0).toUpperCase() + LISTING_STYLE[l].label.slice(1)}</span>
          ))}
        </div>
        <p className="text-xs text-[#8b9bb4] font-body mt-3 leading-relaxed">
          From the FAR Council's deviation guide, checked {fmtDate(FAR.verifiedOn)}{agency.short === 'DoD' ? ", plus DoD's DFARS deviation list" : ''}. {FAR.adoptionCoverage.note} A listing doesn't show the deviation's scope or effective date; open the deviation for those.
        </p>
      </div>
      <div className="space-y-4 min-w-0">
        <div className={`${card} p-5 bg-[#050d1a] min-h-[150px]`} aria-live="polite">
          {detail ? (
            <>
              <p className="text-xs font-label uppercase tracking-widest text-[#00c3ff] mb-1">{agency.short} · FAR Part {detail.part}</p>
              <p className="font-headline font-bold text-white mb-2">{detail.title}</p>
              <p className="text-sm text-[#c9d5e3] font-body">
                {detail.listing === 'final-rule' ? 'A final rule for this part is in effect.'
                  : detail.listing === 'listed' ? `${agency.short} has a class deviation listed for this part. Check its text, scope and effective date.`
                  : detail.listing === 'dod-list' ? "This part is on DoD's DFARS deviation list. Check the deviation's text and effective date."
                  : detail.listing === 'not-tracked' ? FAR.adoptionCoverage.note
                  : `No ${agency.short} deviation for this part is listed in the FAR Council's guide. That doesn't prove there is none; check ${agency.short}'s own deviation page.`}
              </p>
              {detail.dodDeviation && <p className="text-sm text-[#c9d5e3] font-body mt-2">DoD deviation {detail.dodDeviation.deviation}{detail.dodDeviation.revision > 0 && `, Revision ${detail.dodDeviation.revision}`}{detail.dodDeviation.effective && `, original effective ${fmtDate(detail.dodDeviation.effective)}`}.</p>}
              <div className="mt-3"><Source href={detail.dodDeviation?.url ?? FAR.layers.agencyAdoption.sourceUrl} /></div>
            </>
          ) : <p className="text-sm text-[#8b9bb4] font-body">Pick a part to see its status at {agency.short}.</p>}
        </div>
        <div className={`${card} p-5`}>
          <p className="text-xs font-label uppercase tracking-widest text-[#8b9bb4] mb-3">Parts with evidence, by agency</p>
          <ul className="space-y-1.5 max-h-56 overflow-y-auto pr-2">
            {ranked.map(({ a, n }) => (
              <li key={a.short}>
                <button type="button" onClick={() => { setShort(a.short); setPart(null); }} className="w-full flex items-center gap-3 text-left group">
                  <span className={`w-16 shrink-0 text-xs font-semibold font-body truncate ${a.short === agency.short ? 'text-[#00c3ff]' : 'text-[#c9d5e3] group-hover:text-white'}`}>{a.short}</span>
                  <span className="flex-1 h-1.5 rounded-full bg-[#1e2d4a] overflow-hidden"><span className="block h-full bg-[#00c3ff]/70" style={{ width: `${(n / LIVE_PARTS.length) * 100}%` }} /></span>
                  <span className="w-6 text-right text-xs text-[#8b9bb4] font-body">{n}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Upcoming() {
  const rows = [...FAR.upcoming].sort((a, b) => (a.date ?? '9999').localeCompare(b.date ?? '9999'));
  if (!rows.length) return <p className="text-sm text-[#8b9bb4] font-body">No milestones announced.</p>;
  return (
    <ul className="divide-y divide-[#1e2d4a]">
      {rows.map(u => (
        <li key={u.what} className="py-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className={`w-40 shrink-0 text-sm font-semibold font-body ${u.date ? 'text-[#00c3ff]' : 'italic text-[#8b9bb4]'}`}>{fmtDate(u.date)}</span>
          <span className="flex-1 text-sm text-[#c9d5e3] font-body leading-relaxed">{u.what}</span>
          <Source href={u.sourceUrl} label="Source" />
        </li>
      ))}
    </ul>
  );
}

function Trends() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {FAR.trends.map(t => (
        <div key={t.rank} className={`${card} p-5 flex gap-4`}>
          <span className="font-headline font-black text-[#00c3ff] text-lg w-6 shrink-0">{t.rank}</span>
          <div className="min-w-0">
            <h3 className="font-headline font-bold text-white text-base tracking-tight">{t.title}</h3>
            <p className="text-sm text-[#a0b2c8] font-body leading-relaxed mt-1">{t.evidence}</p>
            <div className="mt-2"><Source href={t.sourceUrl} label="Source" /></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FarOverhaulTracker() {
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: TITLE,
      description: DESC,
      datePublished: '2026-11-02',
      dateModified: FAR.verifiedOn,
      mainEntityOfPage: { '@type': 'WebPage', '@id': URL_ },
      author: { '@type': 'Organization', name: 'Honest Echo LLC', url: 'https://honestecho.com' },
      publisher: { '@type': 'Organization', name: 'Honest Echo LLC', url: 'https://honestecho.com', logo: { '@type': 'ImageObject', url: 'https://honestecho.com/he-logo.png' } },
      about: [{ '@type': 'Thing', name: 'Revolutionary FAR Overhaul' }, { '@type': 'Thing', name: 'Federal Acquisition Regulation' }],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'FAR Overhaul status by FAR part and agency',
      description: 'Status of each Federal Acquisition Regulation part under the Revolutionary FAR Overhaul (model deviation text, proposed rule, final rule) and which agencies have posted class deviations, compiled weekly from acquisition.gov, the Federal Register and DoD.',
      url: URL_,
      dateModified: FAR.verifiedOn,
      temporalCoverage: `2025-04-15/${FAR.verifiedOn}`,
      creator: { '@type': 'Organization', name: 'Honest Echo LLC', url: 'https://honestecho.com' },
      isBasedOn: FAR.sources.map(s => s.url),
      isAccessibleForFree: true,
    },
  ];
  const nImpacts = FAR.impacts.length;
  const nTrends = FAR.trends.length;

  return (
    <>
      <Helmet>
        <title>{`${TITLE} | Honest Echo`}</title>
        <meta name="description" content={DESC} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={URL_} />
        <meta property="og:title" content="FAR Overhaul Tracker (FAR 2.0)" />
        <meta property="og:description" content={DESC} />
        <meta property="og:image" content="https://honestecho.com/og-image.jpg" />
        <meta property="article:modified_time" content={FAR.verifiedOn} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAR Overhaul Tracker (FAR 2.0)" />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://honestecho.com/og-image.jpg" />
        {schemas.map(s => <script key={s['@type']} type="application/ld+json">{ldJson(s)}</script>)}
      </Helmet>
      <FAQPageSchema items={FAR.faq} />
      <BreadcrumbListSchema items={[{ name: 'Home', path: '/' }, { name: 'Resources', path: '/resources/' }, { name: 'FAR Overhaul Tracker', path: PATH }]} />

      {/* Hero */}
      <section className="pt-24 pb-10 px-6 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#00c3ff]/10 via-transparent to-transparent blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <span className={`${pill} bg-[#00c3ff]/10 border border-[#00c3ff]/20 text-[#00c3ff] mb-6`}>FAR Overhaul Tracker</span>
          <h1 className="font-headline font-black text-4xl md:text-6xl lg:text-7xl text-white tracking-tighter leading-[1.05] drop-shadow-2xl max-w-5xl">
            The FAR is changing. Know what it means for your <span className="text-[#00c3ff]">next bid.</span>
          </h1>
          <p className="text-[#a0b2c8] text-lg md:text-xl leading-relaxed font-body max-w-3xl mt-6">
            The Revolutionary FAR Overhaul, also called FAR 2.0, is rewriting every part of the Federal Acquisition Regulation. See what has changed, where it already applies, and what to do next.
          </p>
          {/* data-verified is what the weekly job's live check greps for after a deploy. */}
          <p data-verified={FAR.verifiedOn} className="flex items-center gap-2 text-sm text-[#c9d5e3] font-body mt-5">
            <span className="relative flex w-2.5 h-2.5 shrink-0"><span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" /><span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-emerald-400" /></span>
            Verified {fmtDate(FAR.verifiedOn)} against acquisition.gov, the Federal Register, and DoD's deviation list. Checked weekly.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
            <a href="#impact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline">
              Check my impact <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#this-week" className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline">
              Latest changes <ArrowDown className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="pb-16 px-6"><div className="max-w-7xl mx-auto"><StatusTracks /></div></section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHead id="this-week" kicker="This week" title="What matters this week" sub="Real changes from official sources, with what each one means for a contractor." />
          <ThisWeek />
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHead id="impact" kicker="Check my impact" title={`The ${nImpacts} biggest impacts, and which reach you`} sub="Pick the agencies you sell to and the kind of work you do. Every match shows why it matched and what adoption evidence that agency has for each part." />
          <ImpactChecker />
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <SectionHead id="roadmap" kicker="Roadmap" title="What's done, what's next, and when" sub="Every FAR part already has rewritten model text. What's left is the formal rulemaking, and the government has not announced when it finishes." />
          <div className={`${card} p-6 md:p-8`}>
            <h3 className="font-headline font-bold text-white text-xl tracking-tight mb-6 flex items-center gap-2"><Layers className="w-5 h-5 text-[#00c3ff]" />Timeline</h3>
            <Timeline />
          </div>
          <div className={`${card} p-6 md:p-8`}>
            <h3 className="font-headline font-bold text-white text-xl tracking-tight mb-2">All {FAR.parts.length} FAR parts</h3>
            <p className="text-sm text-[#8b9bb4] font-body mb-6">Pick a part for its status, dates, and sources.</p>
            <PartGrid />
            <PartTable />
          </div>
          <div className={`${card} p-6 md:p-8`}>
            <h3 className="font-headline font-bold text-white text-xl tracking-tight mb-2">Agency adoption by FAR part</h3>
            <p className="text-sm text-[#8b9bb4] font-body mb-6">Until a final rule takes effect, the rewritten text reaches an agency through its own class deviation.</p>
            <AgencyMatrix />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            <div className={`${card} p-6 md:p-8 min-w-0`}>
              <h3 className="font-headline font-bold text-white text-xl tracking-tight mb-2">Coming up</h3>
              <Upcoming />
            </div>
            <div className={`${card} p-6 md:p-8 min-w-0`}>
              <span className={`${pill} bg-[#5b8cff]/10 border border-[#5b8cff]/30 text-[#9db7ff] mb-4`}>DFARS (DoD)</span>
              <p className="font-headline font-black text-white text-4xl tracking-tight">{FAR.dfars.deviations}</p>
              <p className="text-sm text-[#c9d5e3] font-body mb-4">DFARS overhaul class deviations, {FAR.dfars.revised} revised at least once. List updated {fmtDate(FAR.dfars.listUpdated)}.</p>
              <p className="text-sm text-[#a0b2c8] font-body leading-relaxed mb-4">{FAR.dfars.summary}{FAR.dfars.effectiveDates.length > 0 && ` Original effective dates: ${FAR.dfars.effectiveDates.map(d => fmtDate(d)).join(', ')}.`}</p>
              <Source href={FAR.dfars.sourceUrl} label="DoD deviation list" />
            </div>
          </div>
        </div>
      </section>

      {nTrends > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Collapsed by default (Aaron, 2026-11-02); <details> keeps it in the prerendered HTML. */}
            <details className="group">
              <summary className="list-none cursor-pointer">
                <SectionHead id="trends" kicker="Trends" title={`${nTrends} trends across the overhaul`} sub="Patterns that show up across the parts, each with the evidence behind it." />
                <span className="inline-flex items-center gap-2 -mt-4 mb-6 text-sm font-semibold text-[#00c3ff] font-body">
                  <span className="group-open:hidden">Show the {nTrends} trends</span><span className="hidden group-open:inline">Hide the trends</span>
                  <ArrowDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                </span>
              </summary>
              <Trends />
            </details>
          </div>
        </section>
      )}

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline font-bold text-white text-3xl tracking-tight text-center mb-8">FAR overhaul questions, answered</h2>
          <div className="space-y-3">
            {FAR.faq.map(f => (
              <details key={f.q} className={`${card} p-6 group`}>
                <summary className="font-headline font-bold text-white text-base cursor-pointer list-none flex justify-between gap-4">
                  {f.q}<span className="text-[#00c3ff] group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
                </summary>
                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className={`${card} p-6 md:p-8`}>
            <h2 className="font-headline font-bold text-white text-xl tracking-tight mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#00c3ff]" />How this tracker works</h2>
            <p className="text-sm text-[#a0b2c8] font-body leading-relaxed mb-4">
              Every week we check the official sources below, update the counts, and log what changed. Every fact links to the government page it came from. Where the government hasn't announced a date, the tracker says "No date announced" rather than guessing. Text marked "our reading" and the impact rankings are Honest Echo's interpretation, not regulatory text or legal advice.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FAR.sources.map(s => <li key={s.url}><Source href={s.url} label={s.name} /></li>)}
            </ul>
            <div className="mt-5 pt-4 border-t border-[#1e2d4a] space-y-2">
              <p className="text-xs font-label uppercase tracking-widest text-[#8b9bb4]">Change log</p>
              {FAR.changelog.map(c => (
                <div key={c.date} className="text-sm font-body">
                  <span className="text-[#00c3ff] font-semibold mr-2">{fmtDate(c.date)}</span>
                  {c.entries.map(e => <span key={e.text} className="text-[#c9d5e3] mr-2">{e.text}</span>)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <RelatedGuides current={PATH} />

      <section className="py-8 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`${card} p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-[#00c3ff]/30 shadow-[0_0_60px_rgba(0,195,255,0.08)]`}>
            <div>
              <h2 className="font-headline font-black text-white text-2xl md:text-3xl tracking-tight">Will a rewritten rule change your next bid?</h2>
              <p className="text-[#a0b2c8] font-body mt-2">Check the notice before you commit. Paste a SAM.gov notice and get a fit score and a bid/no-bid read in minutes.</p>
            </div>
            <Link to="/tools/sam-gov-notice-analyzer/" className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline shrink-0">
              Analyze a notice, free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
