import { useState, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowRight, ArrowUpRight, Building2, CheckCircle2, ChevronRight } from 'lucide-react';
import RelatedGuides from '../components/RelatedGuides';
import { BreadcrumbListSchema, FAQPageSchema, ldJson } from '../components/SchemaOrg';
import { track } from '../lib/analytics';
import { FAR, agencyByShort, dodDeviationFor, finalInEffect, fmtDate, partByNumber } from '../lib/farApplicability';
import { CHANGE_LABEL, newerThanComparison, partPageBySlug, partPagePath, type PartChange, type PartDeepDive } from '../lib/farParts';
import NotFound from './NotFound';

// One deep-dive page per FAR part, from src/content/far-parts/part-N.json. Facts live in
// that file and in far-overhaul.json (live status, kept current weekly); this is layout only.

const card = 'bg-[#0b1120] border border-[#1e2d4a] rounded-2xl';
const pill = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-widest uppercase font-label';
const chip = 'inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold font-body border';
const SHOWN_CHANGES = 6;
const SHOWN_DATES = 10;

function Source({ href, label = 'Source' }: { href: string; label?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-[#00c3ff] hover:text-white transition-colors font-body">
      {label} <ArrowUpRight className="w-3.5 h-3.5" />
    </a>
  );
}

function H2({ id, children, sub }: { id?: string; children: ReactNode; sub?: string }) {
  return (
    <div id={id} className="scroll-mt-24 mb-6">
      <h2 className="font-headline font-black text-white text-3xl md:text-4xl tracking-tight">{children}</h2>
      {sub && <p className="text-[#a0b2c8] font-body mt-2 max-w-3xl leading-relaxed">{sub}</p>}
    </div>
  );
}

// Host + path, so a reader can tell the current-FAR link from the rewrite's before clicking.
function sourceLabel(u: string) {
  try {
    const x = new URL(u);
    if (x.pathname.startsWith('/far-overhaul')) return 'Rewritten text';
    if (x.pathname.startsWith('/far/')) return 'Current FAR';
    if (x.hostname.endsWith('ecfr.gov')) return 'SBA rule (eCFR)';
    if (x.hostname.endsWith('acq.osd.mil')) return 'DoD deviation';
    if (x.pathname.includes('practitioner_albums')) return 'Practitioner Album';
    if (x.hostname.endsWith('federalregister.gov')) return 'Federal Register';
    return x.hostname.replace(/^www\./, '');
  } catch { return 'Source'; }
}

function ChangeCard({ c }: { c: PartChange }) {
  const t = CHANGE_LABEL[c.changeType];
  return (
    <article id={c.id} className={`${card} overflow-hidden scroll-mt-24`}>
      <div className="p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <h3 className="font-headline font-bold text-white text-lg md:text-xl tracking-tight min-w-0">{c.topic}</h3>
          <div className="flex flex-wrap gap-2 sm:justify-end min-w-0">
            {c.confidence !== 'high' && <span className={`${pill} border border-[#2a3b5c] text-[#a0b2c8]`} title="Our read rests on what the text leaves out or on a source we could not fully reconcile. Check the sources.">{c.confidence} confidence</span>}
            <span className={`${pill} border ${t.cls}`}>{t.label}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 md:divide-x md:divide-[#1e2d4a]">
          <div className="md:pr-6 min-w-0">
            <p className="text-xs font-label uppercase tracking-widest text-[#8b9bb4] mb-1.5">Current FAR</p>
            <p className="text-sm text-[#c9d5e3] font-body leading-relaxed">{c.before}</p>
          </div>
          <div className="md:pl-6 min-w-0">
            <p className="text-xs font-label uppercase tracking-widest text-[#00c3ff] mb-1.5">Rewritten Part {c.subpart.split('.')[0]}</p>
            <p className="text-sm text-white font-body leading-relaxed">{c.after}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-[#1e2d4a] border-l-4 border-l-[#00c3ff] bg-[#00c3ff]/5 px-5 md:px-6 py-4">
        <p className="text-sm font-body"><span className="font-bold text-white">What it means for you</span> <span className="text-[#8b9bb4]">(our reading)</span></p>
        <p className="text-sm text-white font-body leading-relaxed mt-1">{c.whatItMeans}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
          <span className="text-xs text-[#8b9bb4] font-body">Who it hits: <span className="text-[#c9d5e3]">{c.whoItHits}</span></span>
          {c.sourceUrls.map(u => <Source key={u} href={u} label={sourceLabel(u)} />)}
        </div>
      </div>
    </article>
  );
}

function AgencyCheck({ dd }: { dd: PartDeepDive }) {
  // Every agency the tracker or this page knows about, by short name.
  const names = new Map<string, string>();
  FAR.agencies.forEach(a => names.set(a.short, a.name));
  dd.agencyDates.forEach(a => { if (!names.has(a.short)) names.set(a.short, a.agency); });
  const options = [...names.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  const [short, setShort] = useState(names.has('DoD') ? 'DoD' : options[0]?.[0] ?? '');
  const dated = dd.agencyDates.find(a => a.short === short);
  const listed = !!agencyByShort(short)?.parts.includes(dd.part);
  // DoD reads the live weekly record (DoD's DFARS list), never the frozen comparison file.
  const dod = short === 'DoD' ? dodDeviationFor(dd.part) ?? null : null;
  const live = partByNumber(dd.part);
  const final = finalInEffect(live);
  const name = names.get(short) ?? short;
  const asOf = FAR.verifiedOn;

  // Three honest states: in effect (an effective date that has passed, or a final rule),
  // adopted but its effective date not shown (signed, dated, scheduled or only listed),
  // and unknown (nothing listed: absence of a listing proves nothing).
  let status: ReactNode;
  let href: string = FAR.layers.agencyAdoption.sourceUrl;
  let tone: 'effective' | 'pending' | 'unknown' = 'pending';
  if (final && live) {
    tone = 'effective';
    status = <>A final rule for Part {dd.part} {live.finalRuleEffective && <>took effect {fmtDate(live.finalRuleEffective)} and </>}applies to every agency's new solicitations.</>;
    href = live.finalRuleUrl ?? href;
  } else if (dod) {
    tone = dod.effective && dod.effective <= asOf ? 'effective' : 'pending';
    status = <>{name}: class deviation {dod.deviation}{dod.revision > 0 && `, Revision ${dod.revision}`}{dod.effective && (dod.effective <= asOf ? `, in effect since ${fmtDate(dod.effective)}` : `, scheduled to take effect ${fmtDate(dod.effective)}`)}{dod.listed && `; current version dated ${fmtDate(dod.listed)}`} (DoD's DFARS deviation list).</>;
    href = dod.url;
  } else if (dated) {
    href = dated.sourceUrl;
    if (dated.basis === 'effective') {
      tone = dated.date <= asOf ? 'effective' : 'pending';
      status = <>{name}: class deviation {dated.date <= asOf ? 'in effect since' : 'scheduled to take effect'} {fmtDate(dated.date)}.</>;
    } else {
      status = <>{name}: class deviation {dated.basis === 'signature' ? 'signed' : 'dated'} {fmtDate(dated.date)}{dated.basis === 'first date in memo' && ' (the first date in the memo)'}. Its effective date isn't recorded here; open the memo.</>;
    }
  } else if (listed) {
    status = <>{name}: a class deviation is listed in the FAR Council's guide. Its date isn't recorded here; open the deviation.</>;
  } else {
    tone = 'unknown';
    status = <>{name}: no Part {dd.part} deviation is listed in the FAR Council's guide, so this tracker can't confirm whether the agency has adopted the rewrite. Check the agency's deviation page and the solicitation's clauses.</>;
  }
  const dot = tone === 'effective' ? 'bg-emerald-400' : tone === 'pending' ? 'border-2 border-[#f5b942]' : 'border border-[#8b9bb4]';

  return (
    <div className={`${card} p-6 md:p-8`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <h2 className="font-headline font-bold text-white text-2xl tracking-tight flex items-center gap-3"><Building2 className="w-6 h-6 text-[#00c3ff] shrink-0" />Is it in effect at my agency?</h2>
        <label className="sr-only" htmlFor="far-part-agency">Agency</label>
        <select id="far-part-agency" value={short} onChange={e => { setShort(e.target.value); track('far_part_agency_selected', { part: dd.part, agency: e.target.value }); }}
          className="w-full md:w-auto max-w-full min-w-0 bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]">
          {options.map(([s, n]) => <option key={s} value={s}>{n}</option>)}
        </select>
      </div>
      <p className="flex items-start gap-3 text-white font-body" aria-live="polite">
        <span className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} aria-hidden="true" />
        <span>{status} <Source href={href} /></span>
      </p>
      <p className="text-sm text-[#8b9bb4] font-body mt-3">
        {final
          ? `A final rule is in effect for Part ${dd.part}; the rewritten text is now the FAR.`
          : `Until a final rule takes effect, the rewritten text applies only where an agency has adopted it by class deviation, and an awarded contract keeps its clauses until it is modified. As of ${fmtDate(dd.comparedOn)}, the official FAR still showed the current Part ${dd.part} (${dd.codified.fac}).`}
      </p>
    </div>
  );
}

export default function FarPartPage() {
  const { slug } = useParams();
  const dd = partPageBySlug(slug);
  if (!dd) return <NotFound />;
  return <PartBody dd={dd} />;
}

function PartBody({ dd }: { dd: PartDeepDive }) {
  const live = partByNumber(dd.part);
  const path = partPagePath(dd.part);
  const url = `https://honestecho.com${path}`;
  const title = `FAR Part ${dd.part} Rewritten: What Changed for ${dd.title} (FAR Overhaul)`;
  const newer = newerThanComparison(dd);
  const first = dd.changes.slice(0, SHOWN_CHANGES);
  const rest = dd.changes.slice(SHOWN_CHANGES);
  const dates = [...dd.agencyDates].sort((a, b) => a.date.localeCompare(b.date) || a.agency.localeCompare(b.agency));
  const [allDates, setAllDates] = useState(false);
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: dd.description,
    datePublished: '2026-11-10',
    dateModified: FAR.verifiedOn > dd.comparedOn ? FAR.verifiedOn : dd.comparedOn,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: 'Honest Echo LLC', url: 'https://honestecho.com' },
    publisher: { '@type': 'Organization', name: 'Honest Echo LLC', url: 'https://honestecho.com', logo: { '@type': 'ImageObject', url: 'https://honestecho.com/he-logo.png' } },
    about: [{ '@type': 'Thing', name: `FAR Part ${dd.part}` }, { '@type': 'Thing', name: 'Revolutionary FAR Overhaul' }],
  };

  const statusChips = live ? [
    { on: !!live.modelText, text: live.modelText ? `Model text: ${fmtDate(live.modelText)}${live.modelTextUpdated ? `, updated ${fmtDate(live.modelTextUpdated)}` : ''}` : 'Model text: not yet published' },
    { on: !!live.proposedRule, text: live.proposedRule ? `Proposed rule: ${fmtDate(live.proposedRule)}` : 'Proposed rule: not yet published' },
    { on: !!live.finalRule, text: live.finalRule ? `Final rule: ${fmtDate(live.finalRule)}` : 'Final rule: no date announced' },
  ] : [];

  return (
    <>
      <Helmet>
        <title>{`${title} | Honest Echo`}</title>
        <meta name="description" content={dd.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={`FAR Part ${dd.part}, rewritten: what changed for ${dd.title.toLowerCase()}`} />
        <meta property="og:description" content={dd.description} />
        <meta property="og:image" content="https://honestecho.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`FAR Part ${dd.part}, rewritten`} />
        <meta name="twitter:description" content={dd.description} />
        <meta name="twitter:image" content="https://honestecho.com/og-image.jpg" />
        <script type="application/ld+json">{ldJson(article)}</script>
      </Helmet>
      <FAQPageSchema items={dd.faq} />
      <BreadcrumbListSchema items={[{ name: 'Home', path: '/' }, { name: 'FAR Overhaul Tracker', path: '/far-overhaul/' }, { name: `Part ${dd.part}`, path }]} />

      {/* Hero */}
      <section className="pt-24 pb-10 px-6 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#00c3ff]/10 via-transparent to-transparent blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-[#8b9bb4] font-body mb-6">
            <Link to="/far-overhaul/" className="hover:text-white">FAR Overhaul Tracker</Link>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="text-white" aria-current="page">Part {dd.part}</span>
          </nav>
          <span className={`${pill} bg-[#00c3ff]/10 border border-[#00c3ff]/20 text-[#00c3ff] mb-6`}>FAR Part {dd.part} · {dd.title}</span>
          <h1 className="font-headline font-black text-4xl md:text-6xl lg:text-7xl text-white tracking-tighter leading-[1.05] drop-shadow-2xl max-w-5xl">{dd.headline}</h1>
          <p className="text-[#a0b2c8] text-lg md:text-xl leading-relaxed font-body max-w-3xl mt-6">{dd.subhead}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {statusChips.map(s => <span key={s.text} className={`${chip} ${s.on ? 'border-[#00c3ff]/50 text-[#00c3ff] bg-[#00c3ff]/5' : 'border-dashed border-[#2a3b5c] text-[#a0b2c8]'}`}>{s.text}</span>)}
          </div>
          <p data-verified={FAR.verifiedOn} className="flex items-center gap-2 text-sm text-[#c9d5e3] font-body mt-5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
            Status verified {fmtDate(FAR.verifiedOn)}. Comparison written {fmtDate(dd.comparedOn)} from acquisition.gov.
          </p>
          {newer.length > 0 && (
            <p role="status" className="mt-4 flex items-start gap-2 rounded-xl border border-[#f5b942]/40 bg-[#f5b942]/10 px-4 py-3 text-sm text-[#f5d58a] font-body max-w-3xl">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              Since this comparison was written, {newer.join(' and ')}. The status above is current; read the comparison below with that in mind.
            </p>
          )}
        </div>
      </section>

      <section className="pb-10 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className={`${card} p-6 md:p-8`}>
            <h2 className="font-headline font-black text-white text-2xl md:text-3xl tracking-tight mb-5">The short version</h2>
            <ol className="space-y-4">
              {dd.shortVersion.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="w-8 h-8 shrink-0 rounded-full border-2 border-[#00c3ff] text-[#00c3ff] font-headline font-black flex items-center justify-center" aria-hidden="true">{i + 1}</span>
                  <span className="text-white text-base md:text-lg font-body leading-relaxed pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <AgencyCheck dd={dd} />
        </div>
      </section>

      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <H2 id="changes" sub={`${dd.changes.length} changes that matter to small contractors, most consequential first. Section cites are in the text; every change links to both versions.`}>What changed</H2>
          <div className="space-y-4">
            {first.map(c => <ChangeCard key={c.id} c={c} />)}
          </div>
          {rest.length > 0 && (
            <details className="group mt-4" onToggle={e => { if ((e.currentTarget as HTMLDetailsElement).open) track('far_part_all_changes', { part: dd.part }); }}>
              <summary className="list-none cursor-pointer inline-flex items-center gap-2 text-sm font-semibold text-[#00c3ff] hover:text-white font-body">
                <span className="group-open:hidden">Show all {dd.changes.length} changes</span><span className="hidden group-open:inline">Show fewer</span>
                <ArrowRight className="w-4 h-4 group-open:rotate-90 transition-transform" aria-hidden="true" />
              </summary>
              <div className="space-y-4 mt-4">{rest.map(c => <ChangeCard key={c.id} c={c} />)}</div>
            </details>
          )}
        </div>
      </section>

      {dd.unchanged.length > 0 && (
        <section className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <H2 id="unchanged" sub="Worth knowing before you rework anything.">What did not change</H2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dd.unchanged.map(u => (
                <div key={u.topic} className={`${card} p-5 flex gap-3`}>
                  <CheckCircle2 className="w-5 h-5 text-[#00c3ff] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="min-w-0">
                    <h3 className="font-headline font-bold text-white text-base tracking-tight">{u.topic}</h3>
                    <p className="text-sm text-[#a0b2c8] font-body leading-relaxed mt-1">{u.detail}</p>
                    {u.sourceUrls[0] && <div className="mt-2"><Source href={u.sourceUrls[0]} label={sourceLabel(u.sourceUrls[0])} /></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {dd.actions.length > 0 && (
        <section className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <H2 id="actions">What to do now</H2>
            <ol className={`${card} divide-y divide-[#1e2d4a]`}>
              {dd.actions.map((a, i) => (
                <li key={a.action} className="flex flex-col sm:flex-row sm:items-start gap-3 p-5">
                  <span className="w-8 h-8 shrink-0 rounded-full border-2 border-[#00c3ff] text-[#00c3ff] font-headline font-black flex items-center justify-center" aria-hidden="true">{i + 1}</span>
                  <span className="flex-1 text-sm md:text-base text-white font-body leading-relaxed sm:pt-1">{a.action}</span>
                  <a href={`#${a.changeId}`} className="text-sm font-semibold text-[#00c3ff] hover:text-white font-body whitespace-nowrap sm:pt-1.5"
                    onClick={() => {
                      // A change folded under "Show all" needs its <details> open before the jump.
                      const el = document.getElementById(a.changeId);
                      const d = el?.closest('details');
                      if (d && !d.open) d.open = true;
                    }}>See the change</a>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {dates.length > 0 && (
        <section className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <H2 id="adoption" sub={`Dates read from each agency's Part ${dd.part} class deviation. "Basis" says which date the memo gives.`}>Agency adoption dates for Part {dd.part}</H2>
            <div className={`${card} overflow-x-auto`}>
              {/* One table so every row keeps its column headers; extra rows stay in the HTML, hidden. */}
              <table className="w-full min-w-[560px] text-sm font-body text-left">
                <caption className="sr-only">Part {dd.part} class deviation dates by agency</caption>
                <thead className="text-xs uppercase tracking-widest text-[#8b9bb4] font-label">
                  <tr><th scope="col" className="px-5 py-3">Agency</th><th scope="col" className="px-5 py-3">Date</th><th scope="col" className="px-5 py-3">Basis</th><th scope="col" className="px-5 py-3">Source</th></tr>
                </thead>
                <tbody id="far-part-dates" className="divide-y divide-[#1e2d4a] text-[#c9d5e3]">
                  {dates.map((a, i) => <DateRow key={a.short} a={a} hidden={!allDates && i >= SHOWN_DATES} />)}
                </tbody>
              </table>
              {dates.length > SHOWN_DATES && (
                <button type="button" aria-expanded={allDates} aria-controls="far-part-dates" onClick={() => setAllDates(v => !v)}
                  className="w-full text-left border-t border-[#1e2d4a] px-5 py-3 text-sm font-semibold text-[#00c3ff] hover:text-white font-body">
                  {allDates ? 'Show fewer' : `Show all ${dates.length} agencies`}
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline font-bold text-white text-3xl tracking-tight text-center mb-8">Part {dd.part} questions, answered</h2>
          <div className="space-y-3">
            {dd.faq.map(f => (
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
            <h2 className="font-headline font-bold text-white text-xl tracking-tight mb-3">Sources and method</h2>
            <p className="text-sm text-[#a0b2c8] font-body leading-relaxed mb-4">
              Each change compares the current FAR Part {dd.part} with the FAR Council's rewritten model text, read on {fmtDate(dd.comparedOn)}. "What it means for you" is Honest Echo's reading, not regulatory text or legal advice. Changes marked medium confidence rest on what the rewrite leaves out, or on an SBA rule we could not fully reconcile; check the sources before relying on them. The status line at the top updates weekly with the tracker.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {dd.sources.map(s => <li key={s.url}><Source href={s.url} label={s.name} /></li>)}
            </ul>
          </div>
        </div>
      </section>

      <RelatedGuides current={path} />

      <section className="py-8 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`${card} p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-[#00c3ff]/30 shadow-[0_0_60px_rgba(0,195,255,0.08)]`}>
            <div>
              <h2 className="font-headline font-black text-white text-2xl md:text-3xl tracking-tight">Will Part {dd.part}'s rewrite change your next bid?</h2>
              <p className="text-[#a0b2c8] font-body mt-2">Check the notice before you commit. Paste a SAM.gov notice and get a fit score and a bid/no-bid read in minutes.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link to="/tools/sam-gov-notice-analyzer/" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline">
                Analyze a notice, free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/far-overhaul/" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all font-headline">
                Back to the tracker
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function DateRow({ a, hidden }: { a: PartDeepDive['agencyDates'][number]; hidden: boolean }) {
  return (
    <tr hidden={hidden}>
      <td className="px-5 py-3 text-white">{a.agency}</td>
      <td className="px-5 py-3 whitespace-nowrap">{fmtDate(a.date)}</td>
      <td className="px-5 py-3 capitalize">{a.basis}</td>
      <td className="px-5 py-3"><Source href={a.sourceUrl} label="Memo" /></td>
    </tr>
  );
}
