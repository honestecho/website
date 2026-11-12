import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, CheckCircle2, ChevronDown, ExternalLink, Loader2, Search } from 'lucide-react';
import { API_BASE } from '../lib/api';
import { track, getAttribution } from '../lib/analytics';
import { reportOtrFitResultConversion, reportOtrSubscribeConversion } from '../lib/googleAds';
import { WORK, fitReason, workLabel, worksForNaics, type FitQuery, type Work } from '../lib/otFit';
import { BreadcrumbListSchema, FAQPageSchema, ItemListSchema } from '../components/SchemaOrg';
import radar from '../content/ot-radar-notices.json';

// ── OT Radar (spec: HE-Pursuit/roadmaps/ot-radar/spec.md) ──────────────────────
// 2026-11-12: answer first, email second (lane decision d-20261112-otpause). The
// ad run of 11-02 to 11-11 sent about 12 paid visitors to a page that asked for an
// email up top; none subscribed, and the one who went on to Find My Matches wanted
// an answer. So the page now opens with a fit check: pick a kind of work, or look
// up the company, and the matching open notices show at once with the reason each
// one is there (src/lib/otFit.ts). The Monday-list signup sits beside that answer.
// The explainer, the full list and the FAQ stay below for the organic search the
// page was built for ("other transaction authority", 27,100/mo).
//
// The list is hand-checked, not live: every row and every tag was read off the
// notice text by a person (src/content/ot-radar-notices.json, refreshed weekly,
// each row carrying its SAM.gov NAICS code for the fit check). It is imported at
// build time, so the rows are in the prerendered HTML and no visitor depends on an
// API call to see them. The API calls are the company lookup and the signup.
//
// Copy rules (Codex 2026-10-20): never "every", never "who can compete"; tags
// only when the notice says so; no eligibility conclusion on any row. A fit line
// says which kind of work matched and on what (the NAICS code or the title), never
// that the visitor can win or is eligible.

const PAGE_PATH = '/government-contracts-for-bid/other-transactions/';
// Rows leave the page a day before they close: the build can be a week old by
// the time someone reads it, and a notice closing tonight is not one to start on.
const MIN_LEAD_MS = 24 * 3600e3;
// In the full list, the signup sits after the first few rows (only while no fit
// answer is showing; with an answer, the signup is beside it).
const SIGNUP_AFTER = 5;
// The $49 personalized scan (decided 2026-11-02, a controlled experiment).
const SCAN_URL = 'https://buy.stripe.com/14A14g09DcLb3v38WU5J600';
// A 12-character UEI with at least one digit (same test as Find My Matches).
const UEI_RE = /^(?=.*\d)[A-Z0-9]{12}$/i;

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
  naics?: string | null;
}
const DATA = radar as { checked_at: string; notices: RadarNotice[] };

interface CompanyHit {
  uei: string;
  name: string;
  dba: string | null;
  city: string | null;
  state: string | null;
  naics_primary: string | null;
  naics_title: string | null;
}

const TYPE_FILTERS: { key: TypeFilter; label: string }[] = [
  { key: 'all',        label: 'All' },
  { key: 'ot',         label: 'Other transaction' },
  { key: 'cso',        label: 'CSO' },
  { key: 'consortium', label: 'Consortium request' },
];

const EXPLAINERS = [
  {
    q: 'What is an OT?',
    a: 'An OT is a flexible agreement outside the usual contract, grant or cooperative agreement process. The terms are negotiated, and most rules in the Federal Acquisition Regulation (FAR) don’t apply.',
  },
  {
    q: 'What is a CSO?',
    a: 'A commercial solutions opening invites proposals for commercial products and services. Awards can be fixed-price contracts or, in some cases, OTs.',
  },
  {
    q: 'Do I need a consortium?',
    a: 'For some opportunities, you’ll submit through a consortium and may need to become a member. For others, you can submit directly.',
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
const fmtDay = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const fmtChecked = (ymd: string) =>
  new Date(`${ymd}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
// Calendar days in the viewer's zone, the same zone the due date is shown in,
// so every notice due on Nov 30 says the same number whatever its hour.
const dayNum = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5;
const daysLeft = (iso: string) => Math.max(0, dayNum(new Date(iso)) - dayNum(new Date()));
const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
const titleCase = (s: string) => s.toLowerCase().replace(/\b([a-z])/g, m => m.toUpperCase());

type SubmitState = 'idle' | 'sending' | 'done' | 'error';

export default function OtherTransactions() {
  const [type, setType] = useState<TypeFilter>('all');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submit, setSubmit] = useState<SubmitState>('idle');
  const [banner, setBanner] = useState<'subscribed' | 'unsubscribed' | 'invalid' | null>(null);

  // Fit check
  const [fit, setFit] = useState<FitQuery | null>(null);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [companies, setCompanies] = useState<CompanyHit[] | null>(null);
  const [searchedFor, setSearchedFor] = useState('');
  const [lookupNote, setLookupNote] = useState<string | null>(null);
  const [lookupOpen, setLookupOpen] = useState(false);
  const answerRef = useRef<HTMLElement | null>(null);
  const reportedFit = useRef(false);

  // The app renders with createRoot (no hydration), so filtering on the
  // viewer's clock here is safe; see ContractsForBidConstruction.tsx.
  const live = useMemo(() => {
    const floor = Date.now() + MIN_LEAD_MS;
    return DATA.notices
      .filter(n => new Date(n.response_deadline).getTime() >= floor)
      .sort((a, b) => (new Date(a.response_deadline).getTime() - new Date(b.response_deadline).getTime()) || a.notice_id.localeCompare(b.notice_id));
  }, []);
  const rows = useMemo(() => live.filter(n => type === 'all' || n.type === type), [live, type]);
  const fits = useMemo(
    () => (fit ? live.flatMap(n => { const why = fitReason(n, fit); return why ? [{ n, why }] : []; }) : []),
    [live, fit],
  );

  // Return from the confirm / unsubscribe links in the email.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get('subscribed');
    if (s === '1') setBanner('subscribed');
    else if (s === 'invalid') setBanner('invalid');
    else if (q.get('unsubscribed') === '1') setBanner('unsubscribed');
  }, []);

  // A new answer: record it, and bring it into view if it landed below the fold
  // (on a phone it sits under the question).
  useEffect(() => {
    if (!fit) return;
    track('otr_fit_result_shown', {
      fit_source: fit.source,
      work: fit.source === 'work' ? fit.work : fit.works.join(','),
      naics: fit.source === 'company' ? fit.naics : null,
      fit_count: fits.length,
      open_count: live.length,
    });
    // One Google Ads conversion per page view, however many answers follow.
    if (!reportedFit.current) { reportedFit.current = true; reportOtrFitResultConversion(); }
    const el = answerRef.current;
    if (el && el.getBoundingClientRect().top > window.innerHeight * 0.7) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // fits follows fit; reading it here keeps the event's count in step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fit]);

  function pickWork(w: Work) {
    track('otr_fit_work_picked', { work: w });
    setCompanies(null);
    setLookupNote(null);
    setFit({ source: 'work', work: w });
  }

  function chooseCompany(c: CompanyHit, position: number | null) {
    setCompanies(null);
    setQuery(c.name);
    if (position !== null) track('otr_fit_company_selected', { position });
    if (!c.naics_primary) {
      setLookupNote(`SBA doesn’t list a NAICS code for ${c.name}. Pick your kind of work above.`);
      return;
    }
    setLookupNote(null);
    // SBA names come in capitals; the answer heading reads them back in title case.
    const name = c.name === c.name.toUpperCase() ? titleCase(c.name) : c.name;
    setFit({ source: 'company', name, naics: c.naics_primary, naicsTitle: c.naics_title, works: worksForNaics(c.naics_primary) });
  }

  async function onLookup(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setLookupNote(null);
    setCompanies(null);
    if (q.length < 3) { setLookupNote('Type at least 3 characters of your company name, or your UEI.'); return; }
    const isUei = UEI_RE.test(q);
    track('otr_fit_company_searched', { query_type: isUei ? 'uei' : 'name' });
    setSearching(true);
    try {
      const res = await fetch(`${API_BASE}/public/company-search?q=${encodeURIComponent(q)}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLookupNote(typeof body?.message === 'string' && body.message ? body.message : 'Company lookup isn’t working right now. Pick your kind of work above.');
        track('otr_fit_error', { error: typeof body?.error === 'string' ? body.error : `http_${res.status}` });
        return;
      }
      const hits: CompanyHit[] = Array.isArray(body?.companies) ? body.companies : [];
      setSearchedFor(q);
      // A UEI names one company: use it without a pick.
      const exact = isUei ? hits.find(h => h.uei.toUpperCase() === q.toUpperCase()) : undefined;
      if (exact) chooseCompany(exact, null);
      else setCompanies(hits);
    } catch {
      setLookupNote('We couldn’t reach the server. Pick your kind of work above.');
      track('otr_fit_error', { error: 'network' });
    } finally {
      setSearching(false);
    }
  }

  const clickProps = (n: RadarNotice, position: number, list: 'fit' | 'all') => ({
    notice_id: n.notice_id,
    position,
    row_type: n.type,
    found_in_text: n.found_in_text,
    days_left: daysLeft(n.response_deadline),
    filter: type,
    list,
  });

  async function onSubscribe(e: FormEvent) {
    e.preventDefault();
    if (submit === 'sending') return;
    setSubmit('sending');
    const fitProps = fit
      ? { fit_source: fit.source, fit_work: fit.source === 'work' ? fit.work : fit.works.join(','), fit_count: fits.length }
      : { fit_source: null };
    track('otr_subscribe_submitted', { shown: rows.length, filter: type, ...fitProps });
    try {
      let anonymous_id: string | null = null;
      try { anonymous_id = localStorage.getItem('he_anon_id'); } catch { /* private mode */ }
      // The fit-check answer rides on the first-touch attribution, so the row says
      // which kind of work the subscriber asked about (for a later, matched list).
      const attribution = fit ? { ...getAttribution(), ot_fit: fitProps.fit_work as string } : getAttribution();
      const res = await fetch(`${API_BASE}/public/ot-radar/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, honeypot, anonymous_id, attribution }),
      });
      // The API gives every accepted address the same answer (no existence
      // oracle), so the copy below must be true whether or not an email went out.
      setSubmit(res.ok ? 'done' : 'error');
      // Paid visitors only: the Google tag loads only after an ad click.
      if (res.ok) reportOtrSubscribeConversion();
    } catch {
      setSubmit('error');
    }
  }

  const renderRow = (n: RadarNotice, i: number) => {
    const dl = daysLeft(n.response_deadline);
    return (
      <li key={n.notice_id} className="p-4 md:px-6 md:py-5 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_15rem] gap-2 md:gap-6 hover:bg-white/[0.015] transition-colors">
        <div className="min-w-0">
          <a
            href={n.sam_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('otr_notice_clicked', clickProps(n, i + 1, 'all'))}
            title="View notice on SAM.gov"
            className="group inline [overflow-wrap:anywhere] text-white font-headline font-semibold text-base md:text-[17px] leading-6 hover:text-[#00c3ff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] rounded"
          >
            {n.title}
            <ExternalLink aria-label="Opens on SAM.gov" className="hidden sm:inline-block ml-1.5 w-4 h-4 align-baseline text-[#64748b] group-hover:text-[#00c3ff]" strokeWidth={2} />
          </a>
          <p className="text-sm text-[#a3b2c6] font-body mt-1 leading-5">{n.agency} · {n.office}</p>
          {n.found_in_text && (
            <p className="mt-1 text-sm leading-5 text-[#a0b2c8] font-body" title="The title doesn't say OT or CSO. The notice text does.">Mentions an OT or CSO</p>
          )}
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tags from the notice text">
            {n.tags.map(t => (
              <li key={t} className="px-2 py-0.5 rounded-md border border-white/10 bg-white/[0.03] text-xs leading-5 text-[#cbd5e1] font-body">{t}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4 md:mt-0 flex items-end justify-between gap-3 md:block text-left md:text-right md:justify-self-end md:self-center md:w-full md:border-l md:border-[#1e2d4a]/80 md:pl-6">
          <div>
            <p className="text-sm font-body text-[#e2e8f0] font-semibold whitespace-nowrap tabular-nums">Due {fmtDue(n.response_deadline)}</p>
            <p className={`text-sm font-medium tabular-nums ${dl <= 3 ? 'text-[#fbbf24]' : 'text-[#94a3b8]'}`}>{dl} day{dl === 1 ? '' : 's'} left</p>
          </div>
          <Link
            to={`/tools/sam-gov-notice-analyzer/?notice=${n.notice_id}&src=ot_radar`}
            onClick={() => track('otr_checkfit_clicked', clickProps(n, i + 1, 'all'))}
            className="shrink-0 md:mt-2.5 inline-flex items-center gap-1.5 py-1.5 rounded-lg border text-[#00c3ff] text-sm font-semibold bg-[#00c3ff]/10 border-[#00c3ff]/70 hover:bg-[#00c3ff]/[0.16] hover:border-[#00c3ff] justify-center min-h-11 px-4 transition-colors whitespace-nowrap font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
          >
            Check fit <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </li>
    );
  };

  // The Monday-list form. Beside the fit answer it is a column of the answer
  // panel (the approved comp, 2026-11-12); with no answer showing it is the card
  // inside the full list. Only one is on the page at a time.
  const signupBody = (placement: 'answer' | 'list') => (
    <>
      {submit === 'done' ? (
        <p role="status" className="mt-4 text-sm text-[#e2e8f0] font-body">
          Thanks! Confirm your address using the email we send, and the Monday list starts after that. Already on the list? Nothing changes.
        </p>
      ) : (
        <form onSubmit={onSubscribe} className="mt-5 grid grid-cols-1 gap-3">
          <label htmlFor="otr-email" className="sr-only">Email address</label>
          <input
            id="otr-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="min-h-12 w-full rounded-lg bg-[#060e1c] border border-[#2a3a5a] px-4 text-base text-white placeholder-[#64748b] font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
          />
          {/* Honeypot: hidden from people, filled by bots. */}
          <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={honeypot} onChange={e => setHoneypot(e.target.value)} className="hidden" name="company_website" />
          <button
            type="submit"
            disabled={submit === 'sending'}
            className="h-12 w-full px-6 rounded-lg bg-[#00c3ff] text-[#030B17] font-headline font-bold text-base shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:bg-[#33cfff] transition-colors whitespace-nowrap disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030B17] focus-visible:ring-[#00c3ff]"
          >
            {submit === 'sending' ? 'Sending…' : 'Send me the Monday list'}
          </button>
        </form>
      )}
      {submit === 'error' && <p role="alert" className="mt-2 text-sm text-[#fca5a5] font-body">That didn&rsquo;t go through. Check the address and try again.</p>}
      <p className="mt-3 text-sm leading-6 text-[#8b9bb4] font-body">We&rsquo;ll ask you to confirm your address first. We never sell it.</p>
      {placement === 'list' && SCAN_URL && (
        <p className="mt-5 pt-4 border-t border-[#00c3ff]/20 text-sm leading-6 text-[#a0b2c8] font-body">
          Want notices matched to what you sell?{' '}
          <a
            href={SCAN_URL}
            rel="noopener noreferrer"
            onClick={() => track('otr_scan_clicked', { shown: rows.length, filter: type, placement })}
            className="text-[#00c3ff] underline underline-offset-4 decoration-[#00c3ff]/40 hover:text-white transition-colors"
          >
            Get a personalized opportunity scan for $49
          </a>
          . We email it within two business days.
        </p>
      )}
    </>
  );
  const signupHeading = 'Get new notices every Monday';
  const signupLead = 'This list changes every week. We’ll email you new OT and CSO notices each Monday. Free, and you can unsubscribe anytime.';
  const signupCard = (
    <div id="monday-list" className="my-6 scroll-mt-24 rounded-2xl border-2 border-[#00c3ff]/60 bg-[linear-gradient(135deg,#0d2a40_0%,#0a1c2d_55%,#081626_100%)] shadow-[0_24px_60px_-28px_rgba(0,195,255,0.55)] p-5 md:p-7">
      <h2 className="font-headline font-black text-white text-2xl leading-8 tracking-tight">{signupHeading}</h2>
      <p className="mt-2 text-[#a0b2c8] text-base leading-6 font-body max-w-2xl">{signupLead}</p>
      <div className="max-w-xl">{signupBody('list')}</div>
    </div>
  );

  // One row of the fit answer: numeral, title, agency and the reason, then the
  // due date and the analyzer handoff. Tags stay on the full list below.
  const renderFitRow = (n: RadarNotice, i: number, why: string) => {
    const dl = daysLeft(n.response_deadline);
    return (
      <li key={n.notice_id} className="py-4 grid grid-cols-[2rem_minmax(0,1fr)] md:grid-cols-[2.25rem_minmax(0,1fr)_auto] gap-x-3 md:gap-x-5 gap-y-3 items-start">
        <span className="font-headline font-bold text-base leading-6 text-[#5b8cff] tabular-nums" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
        <div className="min-w-0">
          <a
            href={n.sam_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('otr_notice_clicked', clickProps(n, i + 1, 'fit'))}
            title="View notice on SAM.gov"
            className="[overflow-wrap:anywhere] text-white font-headline font-bold text-base md:text-[17px] leading-6 hover:text-[#00c3ff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] rounded"
          >
            {n.title}
          </a>
          <p className="mt-1 text-sm leading-5 font-body text-[#a3b2c6]">
            {n.agency}
            <span className="hidden sm:inline text-[#51657f]" aria-hidden="true"> | </span>
            <span className="flex sm:inline-flex mt-1 sm:mt-0 items-start gap-1.5 text-[#e2e8f0]">
              <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true" />
              {why}
            </span>
          </p>
        </div>
        <div className="col-start-2 md:col-start-auto flex items-center justify-between md:justify-end gap-5">
          <div className="md:text-left">
            <p className="text-sm font-body text-[#e2e8f0] font-semibold whitespace-nowrap tabular-nums">Due {fmtDay(n.response_deadline)}</p>
            <p className={`text-sm tabular-nums ${dl <= 3 ? 'text-[#fbbf24]' : 'text-[#94a3b8]'}`}>{dl} day{dl === 1 ? '' : 's'} left</p>
          </div>
          <Link
            to={`/tools/sam-gov-notice-analyzer/?notice=${n.notice_id}&src=ot_radar`}
            onClick={() => track('otr_checkfit_clicked', clickProps(n, i + 1, 'fit'))}
            className="inline-flex items-center gap-1.5 min-h-11 text-[15px] font-semibold text-[#00c3ff] hover:text-white transition-colors whitespace-nowrap font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] rounded"
          >
            Check fit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </li>
    );
  };

  const answerHeading = (() => {
    if (!fit) return '';
    const n = fits.length;
    const what = fit.source === 'work' ? `${workLabel(fit.work).toLowerCase()} work` : fit.name;
    if (n === 0) return `No open notices fit ${what} this week`;
    return `${n} open ${plural(n, 'notice fits', 'notices fit')} ${what}`;
  })();
  const companyLine = fit?.source === 'company'
    ? `Matched on NAICS ${fit.naics}${fit.naicsTitle ? ` (${fit.naicsTitle})` : ''}, your primary code in SBA’s Small Business Search.`
    : null;

  return (
    <>
      <Helmet>
        <title>Other Transaction Authority (OTA) Explained, with Open OT and CSO Notices</title>
        <meta name="description" content="See which open OT and CSO notices fit your company, then read what other transactions and commercial solutions openings are and when a consortium is involved. Notices from SAM.gov, checked by hand." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://honestecho.com${PAGE_PATH}`} />
        <meta property="og:title" content="Which OT notices fit your company?" />
        <meta property="og:description" content="Pick the kind of work you do and see the open OT and CSO notices that match, and why. Checked by hand from SAM.gov." />
        <meta property="og:image" content="https://honestecho.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Which OT notices fit your company?" />
        <meta name="twitter:description" content="Pick the kind of work you do and see the open OT and CSO notices that match, and why. Checked by hand from SAM.gov." />
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

      {/* Question: the fit check, centred, over one light source (W14: one glow
          per section). CSS only, no media file: rings of light like an echo. */}
      <section className="relative pt-10 md:pt-16 pb-8 px-4 sm:px-6 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[62%] -translate-x-1/2 -translate-y-1/2 w-[1500px] h-[1100px] opacity-70 [background:repeating-radial-gradient(circle_at_center,rgba(0,195,255,0.10)_0px,rgba(0,195,255,0.10)_1px,transparent_2px,transparent_64px),radial-gradient(circle_at_center,rgba(0,195,255,0.20)_0%,rgba(91,140,255,0.10)_30%,transparent_62%)] [mask-image:radial-gradient(circle_at_center,black_20%,transparent_68%)]"
        />
        <div className="max-w-[1180px] mx-auto relative z-10 text-center">
          {banner && (
            <p role="status" className="mb-5 mx-auto max-w-2xl rounded-lg border border-[#00c3ff]/40 bg-[#030B17]/80 px-4 py-3 text-sm text-[#e2e8f0] font-body">
              {banner === 'subscribed' && 'You’re on the Monday list. The next one goes out Monday morning.'}
              {banner === 'unsubscribed' && 'You’re unsubscribed. No more Monday lists.'}
              {banner === 'invalid' && 'That link has expired or was already used. Sign up again below if you still want the Monday list.'}
            </p>
          )}
          <p className="text-sm md:text-base font-semibold text-[#00c3ff] font-body">Free fit check · No account needed</p>
          <h1 className="mt-3 font-headline font-black text-white text-[40px] leading-[1.04] sm:text-[56px] lg:text-[76px] lg:leading-[1.0] tracking-[-0.04em]">
            Which OT notices<br className="hidden sm:block" /> <span className="he-gradient-text">fit your company?</span>
          </h1>
          <p className="mt-4 text-[#a0b2c8] text-base sm:text-[19px] leading-7 font-body">
            Pick your kind of work. Matches show up right here.
          </p>

          <div
            role="group"
            aria-label="Your kind of work"
            className="mt-8 mx-auto max-w-[1180px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 xl:gap-0 xl:flex xl:rounded-xl xl:border xl:border-[#1e2d4a] xl:bg-[#0b1120] xl:divide-x xl:divide-[#1e2d4a] xl:overflow-hidden"
          >
            {WORK.map(o => {
              const active = fit?.source === 'work' && fit.work === o.key;
              return (
                <button
                  key={o.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => pickWork(o.key)}
                  className={`min-h-12 xl:min-h-14 xl:flex-1 px-4 rounded-lg xl:rounded-none border xl:border-0 text-[15px] xl:text-base xl:whitespace-nowrap font-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00c3ff] ${
                    active
                      ? 'bg-[#00c3ff] border-[#00c3ff] text-[#030B17] font-semibold'
                      : 'bg-[#0b1120] border-[#1e2d4a] text-[#e2e8f0] hover:bg-[#152033] hover:text-white'
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>

          {!lookupOpen ? (
            <p className="mt-4 text-[15px] text-[#a0b2c8] font-body">
              Or{' '}
              <button
                type="button"
                onClick={() => { setLookupOpen(true); track('otr_fit_lookup_opened'); }}
                className="text-[#00c3ff] underline underline-offset-4 decoration-[#00c3ff]/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] rounded"
              >
                look up your company by name or UEI
              </button>
            </p>
          ) : (
            <div className="mt-5 mx-auto max-w-xl text-left">
              <form onSubmit={onLookup} noValidate>
                <label htmlFor="fit-company" className="block text-sm text-[#a0b2c8] font-body mb-2">Company name or UEI</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b9bb4] pointer-events-none" strokeWidth={2} />
                    <input
                      id="fit-company"
                      type="text"
                      autoFocus
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="e.g. Apex Facility Services"
                      autoComplete="organization"
                      disabled={searching}
                      className="min-h-12 w-full bg-[#060e1c] border border-[#1e2d4a] rounded-lg pl-11 pr-4 text-base text-white placeholder:text-[#8b9bb4] font-body focus:outline-none focus:border-[#00c3ff]/60 focus-visible:ring-2 focus-visible:ring-[#00c3ff] disabled:opacity-60"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={searching}
                    className="min-h-12 px-5 rounded-lg border border-[#00c3ff]/70 text-[#00c3ff] font-body font-semibold text-[15px] hover:bg-[#00c3ff]/10 hover:border-[#00c3ff] transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
                  >
                    {searching ? <><Loader2 className="w-4 h-4 animate-spin" />Looking up…</> : 'Check my company'}
                  </button>
                </div>
                <p className="mt-2 text-sm text-[#8b9bb4] font-body">We match on your primary NAICS code in SBA&rsquo;s Small Business Search.</p>
                {lookupNote && !searching && <p role="alert" className="mt-3 text-sm text-[#fcd34d] font-body">{lookupNote}</p>}
              </form>

              {companies && !searching && (
                companies.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-sm text-[#a0b2c8] font-body mb-2">Pick your company ({companies.length} {plural(companies.length, 'result', 'results')} for &ldquo;{searchedFor}&rdquo;):</p>
                    <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {companies.map((c, i) => {
                        const loc = [c.city ? titleCase(c.city) : null, c.state].filter(Boolean).join(', ');
                        return (
                          <li key={c.uei}>
                            <button
                              type="button"
                              onClick={() => chooseCompany(c, i + 1)}
                              className="w-full text-left rounded-lg bg-[#0b1120] border border-[#1e2d4a] p-3 flex items-center gap-3 hover:border-[#00c3ff]/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
                            >
                              <Building2 className="w-4 h-4 text-[#00c3ff] shrink-0" strokeWidth={2} />
                              <span className="min-w-0 flex-1">
                                <span className="block font-body font-semibold text-white text-sm break-words">{c.name}</span>
                                <span className="block text-sm text-[#8b9bb4] font-body break-words">
                                  {[loc, c.naics_primary ? `NAICS ${c.naics_primary}` : null].filter(Boolean).join(' · ')}
                                </span>
                              </span>
                              <ArrowRight className="w-4 h-4 text-[#8b9bb4] shrink-0" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <p role="alert" className="mt-3 text-sm text-[#fcd34d] font-body">
                    We couldn&rsquo;t find &ldquo;{searchedFor}&rdquo; in SBA&rsquo;s Small Business Search. Try your UEI, or pick your kind of work above.
                  </p>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Answer, with the Monday list beside it in the same raised panel.
          Rendered only after a pick, so the prerendered page carries no answer
          it hasn't been asked for. */}
      {fit && (
        <section id="fit-answer" ref={answerRef} className="pb-6 px-4 sm:px-6 scroll-mt-24">
          <div className="max-w-[1180px] mx-auto">
            <div className="relative rounded-[20px] bg-[#0b1120] border border-[#1e2d4a] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_80px_rgba(0,195,255,0.16)] grid grid-cols-1 lg:grid-cols-[minmax(0,66fr)_minmax(0,34fr)]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#00c3ff]/80 to-transparent" />
              <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-4 min-w-0" aria-live="polite">
                <h2 className="font-headline font-black text-white text-[26px] sm:text-[30px] leading-tight tracking-tight [overflow-wrap:anywhere]">{answerHeading}</h2>
                <p className="mt-1.5 text-base text-[#a0b2c8] font-body">
                  We read {live.length} open OT and CSO {plural(live.length, 'notice', 'notices')} by hand. Updated {fmtChecked(DATA.checked_at)}.
                </p>
                {companyLine && <p className="mt-1 text-sm text-[#a0b2c8] font-body">{companyLine}</p>}
                {fits.length > 0 ? (
                  <ol className="mt-3 divide-y divide-[#1e2d4a]">
                    {fits.map(({ n, why }, i) => renderFitRow(n, i, why))}
                  </ol>
                ) : (
                  <p className="mt-4 mb-2 text-base text-[#cbd5e1] font-body leading-6">
                    {fit.source === 'company'
                      ? 'None of the open notices share your primary NAICS code or its kind of work. Try your kind of work above, or browse the full list.'
                      : 'Try another kind of work above, or browse the full list. New notices go up every week.'}
                  </p>
                )}
              </div>
              <div id="monday-list" className="px-5 sm:px-8 py-6 sm:py-8 border-t lg:border-t-0 lg:border-l border-[#1e2d4a] scroll-mt-24">
                <p className="text-[15px] font-semibold text-[#00c3ff] font-body">Next Monday</p>
                <h2 className="mt-1 font-headline font-black text-white text-[26px] leading-tight tracking-tight">{signupHeading}</h2>
                <p className="mt-3 text-base leading-6 text-[#a0b2c8] font-body">{signupLead}</p>
                {signupBody('answer')}
              </div>
            </div>
            <p className="mt-6 text-center">
              <a href="#all-notices" className="text-base font-semibold text-[#00c3ff] underline underline-offset-4 decoration-[#00c3ff]/40 hover:text-white transition-colors font-body">
                See all {live.length} open {plural(live.length, 'notice', 'notices')}
              </a>
            </p>
          </div>
        </section>
      )}

      {/* Explainer: the answer to the search that brings organic visitors here. */}
      <section className="pt-6 pb-2 px-6">
        <div className="max-w-[1180px] mx-auto">
          <h2 className="font-headline font-bold text-white text-2xl md:text-[28px] tracking-tight">Other transaction authority, explained</h2>
          <p className="text-[#a0b2c8] text-base leading-relaxed font-body max-w-3xl mt-2">
            Other transactions (OTs) and commercial solutions openings (CSOs) give agencies different ways to buy products and services. Start with the basics, then browse the public SAM.gov notices we&rsquo;ve read.
          </p>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {EXPLAINERS.map(({ q, a }) => (
              <div key={q} className="rounded-xl bg-[#071321]/85 border border-[#1e2d4a] px-5 py-4">
                <h3 className="font-headline font-bold text-white text-lg tracking-tight mb-1.5">{q}</h3>
                <p className="text-[#a0b2c8] text-base leading-6 font-body">{a}</p>
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

      {/* The full list */}
      <section id="all-notices" className="pt-8 pb-8 px-6 scroll-mt-24">
        <div className="max-w-[1180px] mx-auto">
          <h2 className="font-headline font-bold text-white text-2xl md:text-[28px] tracking-tight">Open OT and CSO notices</h2>
          <div className="mt-1.5 space-y-1 text-sm leading-6 font-body">
            <p className="text-[#cbd5e1]">
              <span className="text-white font-semibold tabular-nums">{live.length}</span> notice{live.length === 1 ? '' : 's'} · Last updated {fmtChecked(DATA.checked_at)}
            </p>
            <p className="text-[#a0b2c8]">We refresh the list about once a week.</p>
          </div>
          <p className="mt-3 mb-5 text-base text-[#a0b2c8] font-body leading-6 max-w-prose">
            We build this list from public SAM.gov notices, reading each one and using its wording for tags. You&rsquo;ll find eligibility details and steps to submit in the notice documents and any linked consortium portal.
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
                  className={`min-h-11 px-4 rounded-full border text-sm font-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] ${
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
                {rows.slice(0, fit ? rows.length : SIGNUP_AFTER).map((n, i) => renderRow(n, i))}
              </ol>
            )}
          </div>
          {!fit && rows.length > 0 && signupCard}
          {!fit && rows.length > SIGNUP_AFTER && (
            <div className="rounded-xl bg-[#071321]/85 border border-[#1e2d4a] overflow-hidden">
              <ol start={SIGNUP_AFTER + 1} className="divide-y divide-[#1e2d4a]/80">
                {rows.slice(SIGNUP_AFTER).map((n, i) => renderRow(n, i + SIGNUP_AFTER))}
              </ol>
            </div>
          )}
          {!fit && rows.length === 0 && signupCard}
        </div>
      </section>

      {/* FAQ — native details/summary: prerendered, keyboard-accessible, no JS. */}
      <section className="pb-14 px-6">
        <div className="max-w-[1180px] mx-auto">
          <div className="mt-8 divide-y divide-[#1e2d4a] border-y border-[#1e2d4a]">
            {FAQS.map(({ id, q, a }) => (
              <details
                key={id}
                id={id}
                className="group py-1"
                onToggle={e => { if ((e.currentTarget as HTMLDetailsElement).open) track('otr_faq_opened', { faq: id }); }}
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none min-h-14 py-4 text-white font-headline font-semibold text-base leading-6 md:text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] rounded">
                  {q}
                  <ChevronDown className="w-5 h-5 text-[#8b9bb4] shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="pb-4 text-[#a0b2c8] text-sm md:text-base leading-7 font-body max-w-4xl">{a}</p>
              </details>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-[#a0b2c8] font-body">
            This guide offers general information, not legal advice. Honest Echo is an independent service, separate from SAM.gov and the U.S. government.
          </p>
        </div>
      </section>
    </>
  );
}
