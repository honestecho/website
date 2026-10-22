import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ExternalLink } from 'lucide-react';
import { API_BASE } from '../lib/api';
import { track, getAttribution } from '../lib/analytics';
import { BreadcrumbListSchema, FAQPageSchema, ItemListSchema } from '../components/SchemaOrg';
import radar from '../content/ot-radar-notices.json';

// ── OT Radar, Phase 0 (spec: HE-Pursuit/roadmaps/ot-radar/spec.md §0c) ───────
// Explainer first, list second: Keyword Planner (2026-10-20) found no measurable
// volume for any "OT opportunities" list query, but 27,100/mo for "other
// transaction authority" — so the page answers the definitional search and
// carries the live list under it (Aaron: "Organic-first").
//
// The list is hand-checked, not live: every row and every tag was read off the
// notice text by a person (src/content/ot-radar-notices.json, refreshed weekly).
// It is imported at build time, so the rows are in the prerendered HTML and no
// visitor depends on an API call to see them (Codex 2026-10-20: the construction
// page lost 13 of 63 visitors to failed list loads). The only API call is the
// Monday-list signup.
//
// Copy rules (Codex 2026-10-20): never "every", never "who can compete"; tags
// only when the notice says so; no eligibility conclusion on any row.

const PAGE_PATH = '/government-contracts-for-bid/other-transactions/';
// Rows leave the page a day before they close: the build can be a week old by
// the time someone reads it, and a notice closing tonight is not one to start on.
const MIN_LEAD_MS = 24 * 3600e3;

type RowType = 'ot' | 'cso' | 'consortium';
type TypeFilter = RowType | 'all';
interface RadarNotice {
  notice_id: string;
  solicitation_number: string;
  title: string;
  agency: string;
  office: string;
  type: RowType;
  tags: string[];
  found_in_text: boolean;
  response_deadline: string;
  sam_url: string;
}
const DATA = radar as { checked_at: string; notices: RadarNotice[] };

const TYPE_FILTERS: { key: TypeFilter; label: string }[] = [
  { key: 'all',        label: 'All' },
  { key: 'ot',         label: 'Other transaction' },
  { key: 'cso',        label: 'CSO' },
  { key: 'consortium', label: 'Consortium request' },
];

const EXPLAINERS = [
  {
    q: 'What is an OT?',
    a: 'An agreement that isn’t a contract, grant or cooperative agreement. Most FAR rules don’t apply. DoD prototype OTs use 10 U.S.C. 4022.',
  },
  {
    q: 'What is a CSO?',
    a: 'A commercial solutions opening is a competitive method for buying commercial products and services under 10 U.S.C. 3458. Awards are fixed-price contracts or, in some cases, OTs.',
  },
  {
    q: 'Do I need a consortium?',
    a: 'Sometimes. Many OTs run through consortia, which usually take submissions from members. Others go straight to industry. The notice will tell you which.',
  },
];

const FAQS: { id: string; q: string; a: string }[] = [
  {
    id: 'faq-ot-vs-far',
    q: 'How is an OT different from a FAR contract?',
    a: 'An other transaction isn’t a procurement contract, so the Federal Acquisition Regulation and most procurement statutes don’t apply. The parties negotiate terms such as intellectual property and payment milestones. Under 10 U.S.C. 4022, DoD can award a prototype OT when a nontraditional defense contractor or nonprofit research institution takes a significant part; every significant non-government participant is a small business or nontraditional defense contractor; non-federal parties pay at least one-third of the cost; or a senior procurement official finds exceptional circumstances. If a competed prototype succeeds, it can lead to a follow-on production award without another competition.',
  },
  {
    id: 'faq-2808a',
    q: 'What does 10 U.S.C. 2808a allow?',
    a: 'It lets military departments use transactions other than contracts, grants or cooperative agreements for facility construction and repair. In the notices on this page, the Army Corps of Engineers and NAVFAC pair that authority with delivery methods such as progressive design-build and construction manager at risk.',
  },
  {
    id: 'faq-consortium',
    q: 'How do I join an OT consortium?',
    a: 'Each consortium has its own manager and membership agreement, often with an annual fee. Many consortium solicitations are open only to members. The notice names the consortium, and its website lists the membership terms. Some agencies issue OT solicitations straight to industry. Those notices say consortium membership isn’t required.',
  },
];

const zoneName = (s: string) => s.replace(/\b([ECMPAH])[SD]T\b/, '$1T');
const fmtDue = (iso: string) => {
  const d = new Date(iso);
  const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const time = zoneName(d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).replace(':00 ', ' '));
  return `${day} at ${time}`;
};
const fmtChecked = (ymd: string) =>
  new Date(`${ymd}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const daysLeft = (iso: string) => Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 864e5));

type SubmitState = 'idle' | 'sending' | 'done' | 'error';

export default function OtherTransactions() {
  const [type, setType] = useState<TypeFilter>('all');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submit, setSubmit] = useState<SubmitState>('idle');
  const [banner, setBanner] = useState<'subscribed' | 'unsubscribed' | 'invalid' | null>(null);

  // The app renders with createRoot (no hydration), so filtering on the
  // viewer's clock here is safe; see ContractsForBidConstruction.tsx.
  const live = useMemo(() => {
    const floor = Date.now() + MIN_LEAD_MS;
    return DATA.notices
      .filter(n => new Date(n.response_deadline).getTime() >= floor)
      .sort((a, b) => (new Date(a.response_deadline).getTime() - new Date(b.response_deadline).getTime()) || a.notice_id.localeCompare(b.notice_id));
  }, []);
  const rows = useMemo(() => live.filter(n => type === 'all' || n.type === type), [live, type]);

  // Return from the confirm / unsubscribe links in the email.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get('subscribed');
    if (s === '1') setBanner('subscribed');
    else if (s === 'invalid') setBanner('invalid');
    else if (q.get('unsubscribed') === '1') setBanner('unsubscribed');
  }, []);

  const clickProps = (n: RadarNotice, position: number) => ({
    notice_id: n.notice_id,
    position,
    row_type: n.type,
    found_in_text: n.found_in_text,
    days_left: daysLeft(n.response_deadline),
    filter: type,
  });

  async function onSubscribe(e: FormEvent) {
    e.preventDefault();
    if (submit === 'sending') return;
    setSubmit('sending');
    track('otr_subscribe_submitted', { shown: rows.length, filter: type });
    try {
      let anonymous_id: string | null = null;
      try { anonymous_id = localStorage.getItem('he_anon_id'); } catch { /* private mode */ }
      const res = await fetch(`${API_BASE}/public/ot-radar/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, honeypot, anonymous_id, attribution: getAttribution() }),
      });
      // The API gives every accepted address the same answer (no existence
      // oracle), so the copy below must be true whether or not an email went out.
      setSubmit(res.ok ? 'done' : 'error');
    } catch {
      setSubmit('error');
    }
  }

  return (
    <>
      <Helmet>
        <title>Other Transaction Authority (OTA) Explained, with Open OT and CSO Notices</title>
        <meta name="description" content="What other transactions and commercial solutions openings are, when a consortium is involved, and this week's open OT and CSO notices from SAM.gov, checked by hand." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://honestecho.com${PAGE_PATH}`} />
        <meta property="og:title" content="Other transaction authority, explained" />
        <meta property="og:description" content="OTs and CSOs in plain terms, plus this week's open notices from SAM.gov, checked by hand." />
        <meta property="og:image" content="https://honestecho.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Other transaction authority, explained" />
        <meta name="twitter:description" content="OTs and CSOs in plain terms, plus this week's open notices from SAM.gov, checked by hand." />
      </Helmet>

      <BreadcrumbListSchema
        items={[
          { name: 'Honest Echo', path: '/' },
          { name: 'Other transaction authority, explained', path: PAGE_PATH },
        ]}
      />
      <FAQPageSchema items={[...EXPLAINERS, ...FAQS].map(({ q, a }) => ({ q, a }))} />
      {live.length > 0 && (
        <ItemListSchema
          name="Open OT and CSO notices on SAM.gov"
          items={live.map(n => ({ name: n.title, url: n.sam_url }))}
        />
      )}

      {/* Explainer — the answer to the search that brings people here. */}
      <section className="pt-5 md:pt-6 pb-2 px-6 relative">
        <div className="max-w-[1080px] mx-auto relative z-10">
          {banner && (
            <p role="status" className="mb-4 rounded-lg border border-[#00c3ff]/40 bg-[#00c3ff]/[0.07] px-4 py-3 text-sm text-[#e2e8f0] font-body">
              {banner === 'subscribed' && 'You’re on the Monday list. The next one goes out Monday morning.'}
              {banner === 'unsubscribed' && 'You’re unsubscribed. No more Monday lists.'}
              {banner === 'invalid' && 'That link has expired or was already used. Sign up again below if you still want the Monday list.'}
            </p>
          )}
          <p className="mb-2 text-sm font-semibold text-[#00c3ff] font-body">Other transactions · CSO · Consortium calls</p>
          <h1 className="font-headline font-black text-[30px] leading-[1.08] md:text-[2.75rem] md:leading-tight text-white mb-2 tracking-tighter">
            Other transaction authority, explained
          </h1>
          <p className="text-[#a0b2c8] text-base md:text-lg leading-relaxed font-body max-w-3xl mt-2">
            What OTs and commercial solutions openings are, how they&rsquo;re awarded and which notices are open on SAM.gov this week. Checked by hand.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {EXPLAINERS.map(({ q, a }) => (
              <div key={q} className="rounded-xl bg-[#071321]/85 border border-[#1e2d4a] px-5 py-4">
                <h2 className="font-headline font-bold text-white text-lg tracking-tight mb-1.5">{q}</h2>
                <p className="text-[#a0b2c8] text-sm leading-6 font-body">{a}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm font-body">
            <a href="#faq-2808a" className="text-[#00c3ff] underline underline-offset-4 decoration-[#00c3ff]/40 hover:text-white transition-colors">Construction OTs (10 U.S.C. 2808a)</a>
            <span className="text-[#64748b]"> · </span>
            <a href="#faq-ot-vs-far" className="text-[#00c3ff] underline underline-offset-4 decoration-[#00c3ff]/40 hover:text-white transition-colors">How OT prototype awards work</a>
          </p>
        </div>
      </section>

      {/* The list */}
      <section className="pt-6 pb-8 px-6">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="font-headline font-bold text-white text-2xl md:text-[28px] tracking-tight">Open OT and CSO notices this week</h2>
          <p className="mt-1.5 mb-3 text-sm text-[#94a3b8] font-body leading-6 max-w-4xl">
            <span className="text-white font-semibold tabular-nums">{live.length}</span> open notice{live.length === 1 ? '' : 's'}, checked by hand · Updated {fmtChecked(DATA.checked_at)}.
            {' '}Tags appear only when the notice text says so. We don&rsquo;t make eligibility calls. Review the full solicitation package and any consortium portal.
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-3" role="group" aria-label="Type">
            <span className="text-xs font-medium text-[#8b9bb4] font-body mr-1">Type</span>
            {TYPE_FILTERS.map(o => {
              const active = o.key === type;
              return (
                <button
                  key={o.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => { setType(o.key); track('otr_filter_changed', { filter: 'type', value: o.key }); }}
                  className={`h-8 px-3.5 rounded-full border text-xs font-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] ${
                    active
                      ? 'bg-[#00c3ff] border-[#00c3ff] text-[#030B17] font-semibold'
                      : 'border-[#1e2d4a] text-[#cbd5e1] hover:border-[#00c3ff]/50 hover:text-white'
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-xl bg-[#071321]/85 border border-[#1e2d4a] overflow-hidden">
            {rows.length === 0 ? (
              <div className="p-8">
                <p className="text-white font-semibold font-body">
                  {live.length === 0 ? 'No checked notices are open right now. The next list goes up Monday.' : 'No open notices of that type this week.'}
                </p>
                {live.length > 0 && (
                  <button type="button" onClick={() => setType('all')} className="text-sm text-[#00c3ff] underline hover:text-white transition-colors mt-1 font-body">
                    Show all {live.length}
                  </button>
                )}
              </div>
            ) : (
              <ol className="divide-y divide-[#1e2d4a]/80">
                {rows.map((n, i) => {
                  const dl = daysLeft(n.response_deadline);
                  return (
                    <li key={n.notice_id} className="px-4 md:px-6 py-4 md:py-[18px] grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_15rem] gap-2 md:gap-6 hover:bg-white/[0.015] transition-colors">
                      <div className="min-w-0">
                        <a
                          href={n.sam_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => track('otr_notice_clicked', clickProps(n, i + 1))}
                          title="View notice on SAM.gov"
                          className="group inline [overflow-wrap:anywhere] text-white font-headline font-semibold text-base md:text-[17px] leading-snug hover:text-[#00c3ff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] rounded"
                        >
                          {n.title}
                          <ExternalLink aria-label="Opens on SAM.gov" className="hidden sm:inline-block ml-1.5 w-4 h-4 align-baseline text-[#64748b] group-hover:text-[#00c3ff]" strokeWidth={2} />
                        </a>
                        {n.found_in_text && (
                          <span className="ml-2 text-xs text-[#8b9bb4] font-body whitespace-nowrap" title="The title doesn't say OT or CSO. The notice text does.">Found in notice text</span>
                        )}
                        <p className="text-sm text-[#a3b2c6] font-body mt-1 leading-5">{n.agency} · {n.office}</p>
                        <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Tags from the notice text">
                          {n.tags.map(t => (
                            <li key={t} className="px-2.5 py-0.5 rounded-md border border-[#2a3a5a] text-[12px] leading-5 text-[#cbd5e1] font-body">{t}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-1 md:mt-0 text-left md:text-right md:justify-self-end md:self-center md:w-full md:border-l md:border-[#1e2d4a]/80 md:pl-6">
                        <p className="text-sm font-body text-[#e2e8f0] font-semibold whitespace-nowrap tabular-nums">Due {fmtDue(n.response_deadline)}</p>
                        <p className={`text-[13px] font-medium tabular-nums ${dl <= 3 ? 'text-[#fbbf24]' : 'text-[#94a3b8]'}`}>{dl} day{dl === 1 ? '' : 's'} left</p>
                        <Link
                          to={`/tools/sam-gov-notice-analyzer/?notice=${n.notice_id}&src=ot_radar`}
                          onClick={() => track('otr_checkfit_clicked', clickProps(n, i + 1))}
                          className="mt-2.5 inline-flex items-center gap-1.5 py-1.5 rounded-lg border text-[#00c3ff] text-sm font-semibold bg-[#00c3ff]/10 border-[#00c3ff]/70 hover:bg-[#00c3ff]/[0.16] hover:border-[#00c3ff] justify-center min-h-10 px-4 transition-colors whitespace-nowrap font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
                        >
                          Check fit <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>
      </section>

      {/* Monday list signup */}
      <section className="pb-8 px-6">
        <div className="max-w-[1080px] mx-auto rounded-xl border border-[#1e2d4a] bg-[#0b1626] px-5 md:px-8 py-6 md:py-7">
          <h2 className="font-headline font-bold text-white text-xl md:text-2xl tracking-tight">Get the Monday list of new OT and CSO notices</h2>
          <p className="mt-1 text-[#a0b2c8] text-sm md:text-base font-body">Checked by hand. One free email a week.</p>
          {submit === 'done' ? (
            <p role="status" className="mt-4 text-sm text-[#e2e8f0] font-body">
              Got it. We’ll email you a link to confirm, and the Monday list starts once you do. Already on the list? Nothing changes.
            </p>
          ) : (
            <form onSubmit={onSubscribe} className="mt-4 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-3">
              <label htmlFor="otr-email" className="sr-only">Email</label>
              <input
                id="otr-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-12 rounded-lg bg-[#071321] border border-[#2a3a5a] px-4 text-white placeholder-[#64748b] font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
              />
              {/* Honeypot: hidden from people, filled by bots. */}
              <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={honeypot} onChange={e => setHoneypot(e.target.value)} className="hidden" name="company_website" />
              <button
                type="submit"
                disabled={submit === 'sending'}
                className="h-12 px-6 rounded-lg bg-[#00c3ff] text-[#030B17] font-headline font-bold text-sm hover:bg-[#33cfff] transition-colors whitespace-nowrap disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030B17] focus-visible:ring-[#00c3ff]"
              >
                {submit === 'sending' ? 'Sending…' : 'Send me the Monday list'}
              </button>
            </form>
          )}
          {submit === 'error' && <p role="alert" className="mt-2 text-sm text-[#fca5a5] font-body">That didn&rsquo;t go through. Check the address and try again.</p>}
          <p className="mt-3 text-xs text-[#8b9bb4] font-body">Confirm by email. Unsubscribe anytime. We never sell your email.</p>
        </div>
      </section>

      {/* FAQ — native details/summary: prerendered, keyboard-accessible, no JS. */}
      <section className="pb-14 px-6">
        <div className="max-w-[1080px] mx-auto">
          <div className="divide-y divide-[#1e2d4a] border-y border-[#1e2d4a]">
            {FAQS.map(({ id, q, a }) => (
              <details
                key={id}
                id={id}
                className="group py-1"
                onToggle={e => { if ((e.currentTarget as HTMLDetailsElement).open) track('otr_faq_opened', { faq: id }); }}
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-3.5 text-white font-headline font-semibold text-base md:text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] rounded">
                  {q}
                  <ChevronDown className="w-5 h-5 text-[#8b9bb4] shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="pb-4 text-[#a0b2c8] text-sm md:text-base leading-7 font-body max-w-4xl">{a}</p>
              </details>
            ))}
          </div>
          <p className="mt-4 text-[13px] leading-5 text-[#8b9bb4] font-body">
            General information, not legal advice. Honest Echo isn&rsquo;t affiliated with SAM.gov or the U.S. government.
          </p>
        </div>
      </section>
    </>
  );
}
