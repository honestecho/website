import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, AlertCircle } from 'lucide-react';
import { API_BASE } from '../lib/api';
import { track } from '../lib/analytics';
import { BreadcrumbListSchema, ItemListSchema } from '../components/SchemaOrg';

// ── List-browse TEST page (grill 2026-09-12) ──────────────────────────────────
// fall26_search: 25 of 29 attributed paid clicks typed list-browse queries
// ("list of government contracts for bid", "open government contracts") and
// bounced off the story homepage. This page is the test of that demand: one
// live list, three filters, two instrumented clicks. Success is pre-declared —
// 10 of the first 100 matched visits click "Analyze fit" (a title click leaves
// for SAM.gov and is reported separately; changed 2026-09-18). Every row
// carries an example match score so the page shows what Honest Echo does, not
// only a list. It is not a search product: no accounts, saved filters, alerts,
// or other NAICS.

const NAICS = '236220';
// The page shows only the contracts closing soonest, then hands off to the
// home page: five rows prove the list and the score; the pitch does the rest
// (Aaron, 2026-09-18).
const TOP_N = 5;
const PAGE_PATH = '/government-contracts-for-bid/construction/';

type SetAsideKey = 'sb' | 'sdvosb' | 'wosb' | '8a' | 'hubzone' | 'vosb' | 'isbee';
type NoticeType = 'Solicitation' | 'Presolicitation' | 'Sources Sought';
// "For bid" defaults to what is actually open for proposals; presolicitations
// and sources sought are upcoming / market research and opt-in (Codex, 2026-09-16).
type TypeFilter = 'open' | 'upcoming' | 'all';
const NO_STATE = '__none__';

interface Notice {
  notice_id: string;
  title: string;
  agency: string | null;
  posted_date: string;
  response_deadline: string;
  set_aside_key: SetAsideKey;
  set_aside_label: string;
  notice_type: NoticeType;
  place_of_performance: string | null;
  pop_state: string | null;
  sam_url: string;
  // Scored server-side against one sample business; null when scoring failed.
  fit?: { score: number } | null;
}

interface ListPayload {
  naics: string;
  generated_at: string;
  count: number;
  notices: Notice[];
  stale?: boolean;   // server could not refresh; this is its last good copy
  fit_profile?: { key: string; label: string } | null;
}

const SET_ASIDE_FILTERS: { key: SetAsideKey | 'all'; label: string }[] = [
  { key: 'all',     label: 'All set-asides' },
  { key: 'sb',      label: 'Total Small Business' },
  { key: 'sdvosb',  label: 'SDVOSB' },
  { key: 'wosb',    label: 'WOSB' },
  { key: '8a',      label: '8(a)' },
  { key: 'hubzone', label: 'HUBZone' },
  { key: 'vosb',    label: 'VOSB' },
  { key: 'isbee',   label: 'Indian SB' },
];

const TYPE_FILTERS: { key: TypeFilter; label: string }[] = [
  { key: 'open',     label: 'Open solicitations' },
  { key: 'upcoming', label: 'Early-stage notices' },
  { key: 'all',      label: 'All notice types' },
];
const matchesType = (n: Notice, t: TypeFilter) =>
  t === 'all' || (t === 'open' ? n.notice_type === 'Solicitation' : n.notice_type !== 'Solicitation');

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
function isNotice(v: unknown): v is Notice {
  return isObj(v)
    && typeof v.notice_id === 'string'
    && typeof v.title === 'string'
    && typeof v.posted_date === 'string'
    && typeof v.response_deadline === 'string'
    && typeof v.set_aside_key === 'string'
    && typeof v.set_aside_label === 'string'
    && typeof v.notice_type === 'string'
    && typeof v.sam_url === 'string';
}
function isListPayload(v: unknown): v is ListPayload {
  return isObj(v) && Array.isArray(v.notices) && v.notices.every(isNotice) && typeof v.generated_at === 'string';
}

// Build-time seed. scripts/prerender.js fetches the list, applies the deadline
// floor itself, and hands the same object to the server render (globalThis) and
// the browser (an inline window.__HE_LIST__ before the bundle) — so the rows are
// in the static HTML for crawlers and hydration sees identical input. No
// Date.now() filtering here: a floor applied twice against two different clocks
// would produce two different row sets and break hydration. The effect below
// still refetches live data on mount, which is what a visitor ends up seeing.
const seedPayload = (): ListPayload | null => {
  const v = (globalThis as { __HE_LIST__?: unknown }).__HE_LIST__;
  return isListPayload(v) ? v : null;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
// Deadlines are instants; show the visitor's local time + zone next to the
// date so the date and the "days left" count are read against the same clock.
// "EDT"/"EST" → "ET": the daylight flag is noise to a contractor reading a deadline.
const zoneName = (s: string) => s.replace(/\b([ECMPAH])[SD]T\b/, '$1T');
const fmtDue = (iso: string) => {
  const d = new Date(iso);
  const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const time = zoneName(d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).replace(':00 ', ' '));
  return `${day} at ${time}`;
};
const fmtUpdated = (iso: string) =>
  zoneName(new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }));
// SAM prefixes titles with a PSC/class code ("Z--", "Y1DA--"); it is noise in
// a heading and worse in structured data.
const cleanTitle = (t: string) => t.replace(/^[A-Z0-9]{1,4}--\s*/, '');
const daysLeft = (iso: string) => Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 864e5));

// SAM shouts agency names and inverts some ("INTERIOR, DEPARTMENT OF THE").
// The big buyers get the name a contractor uses; the rest get title case.
const AGENCY_NAMES: Record<string, string> = {
  'DEPT OF THE AIR FORCE': 'U.S. Air Force',
  'DEPT OF THE ARMY': 'U.S. Army',
  'DEPT OF THE NAVY': 'U.S. Navy',
  'DEPT OF DEFENSE': 'Dept. of Defense',
  'DEFENSE LOGISTICS AGENCY': 'Defense Logistics Agency',
  'VETERANS AFFAIRS, DEPARTMENT OF': 'Dept. of Veterans Affairs',
  'GENERAL SERVICES ADMINISTRATION': 'GSA',
  'HOMELAND SECURITY, DEPARTMENT OF': 'Dept. of Homeland Security',
  'AGRICULTURE, DEPARTMENT OF': 'Dept. of Agriculture',
  'INTERIOR, DEPARTMENT OF THE': 'Dept. of the Interior',
  'ENERGY, DEPARTMENT OF': 'Dept. of Energy',
  'JUSTICE, DEPARTMENT OF': 'Dept. of Justice',
  'TRANSPORTATION, DEPARTMENT OF': 'Dept. of Transportation',
  'HEALTH AND HUMAN SERVICES, DEPARTMENT OF': 'Dept. of Health and Human Services',
  'COMMERCE, DEPARTMENT OF': 'Dept. of Commerce',
  'TREASURY, DEPARTMENT OF THE': 'Dept. of the Treasury',
  'STATE, DEPARTMENT OF': 'Dept. of State',
  'LABOR, DEPARTMENT OF': 'Dept. of Labor',
  'EDUCATION, DEPARTMENT OF': 'Dept. of Education',
};
function agencyCase(s: string | null): string {
  if (!s) return '';
  const known = AGENCY_NAMES[s.trim().toUpperCase()];
  if (known) return known;
  const inv = s.match(/^(.+?),\s*(DEPARTMENT OF THE|DEPARTMENT OF|DEPT OF THE|DEPT OF)$/i);
  const ordered = inv ? `${inv[2]} ${inv[1]}` : s;
  return ordered
    .toLowerCase()
    .replace(/\b([a-z])/g, m => m.toUpperCase())
    .replace(/\b(Of|The|And|For)\b/g, m => m.toLowerCase());
}

export default function ContractsForBidConstruction() {
  const [payload, setPayload] = useState<ListPayload | null>(seedPayload);
  const [failed, setFailed] = useState(false);
  const [setAside, setSetAside] = useState<SetAsideKey | 'all'>('all');
  const [type, setType] = useState<TypeFilter>('open');
  const [state, setState] = useState<string>('all');
  // Seeded first render? Then a failed live refresh must not replace visible
  // rows with the error panel — the build-time list is still the best we have.
  const hadSeed = useRef(payload !== null);

  useEffect(() => {
    let cancelled = false;
    const t0 = performance.now();
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/public/opportunities/list?naics=${NAICS}`);
        const j: unknown = res.ok ? await res.json() : null;
        if (cancelled) return;
        if (isListPayload(j)) {
          // The copy may have sat in the CDN/browser cache; hold the advertised
          // 48-hour floor here too before anything is shown.
          const floor = Date.now() + 48 * 3600e3;
          j.notices = j.notices.filter(n => new Date(n.response_deadline).getTime() >= floor);
          setPayload(j);
          // fetch_ms = request start to list-in-hand (the only route-to-list
          // number available on SPA navigation); since_nav_ms = document age,
          // which IS navigation-to-list on a hard landing — and paid traffic
          // lands hard. The readout's validity gate (>=95% of eligible visits
          // see a non-empty list within 3s of landing) reads since_nav_ms; an
          // empty payload is its own event so it can never pass as "loaded".
          const timing = { fetch_ms: Math.round(performance.now() - t0), since_nav_ms: Math.round(performance.now()) };
          track(j.notices.length ? 'list_loaded' : 'list_empty', { naics: NAICS, count: j.notices.length, shown: Math.min(j.notices.length, TOP_N), scored: j.notices.filter(n => n.fit).length, stale: j.stale === true, ...timing });
        } else {
          if (!hadSeed.current) setFailed(true);
          track('list_load_failed', { naics: NAICS, status: res.status });
        }
      } catch {
        if (cancelled) return;
        if (!hadSeed.current) setFailed(true);
        track('list_load_failed', { naics: NAICS, status: 0 });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const rows = useMemo(() => {
    const all = payload?.notices ?? [];
    return all
      .filter(n => setAside === 'all' || n.set_aside_key === setAside)
      .filter(n => matchesType(n, type))
      .filter(n => state === 'all' || (state === NO_STATE ? !n.pop_state : n.pop_state === state))
      .sort((a, b) => (new Date(a.response_deadline).getTime() - new Date(b.response_deadline).getTime()) || a.notice_id.localeCompare(b.notice_id));
  }, [payload, setAside, type, state]);

  // States present in the live data, so the dropdown never offers an empty pick.
  const states = useMemo(() => {
    const seen = new Map<string, number>();
    for (const n of payload?.notices ?? []) {
      const k = n.pop_state ?? NO_STATE;
      seen.set(k, (seen.get(k) ?? 0) + 1);
    }
    const named = [...seen.entries()].filter(([k]) => k !== NO_STATE).sort(([a], [b]) => a.localeCompare(b));
    return { named, none: seen.get(NO_STATE) ?? 0 };
  }, [payload]);

  const filters = { set_aside: setAside, notice_type: type, state };
  const clickProps = (n: Notice, position: number) => ({
    notice_id: n.notice_id,
    position,
    set_aside_key: n.set_aside_key,
    notice_type: n.notice_type,
    days_left: daysLeft(n.response_deadline),
    fit_score: n.fit?.score ?? null,
    filters,
  });
  const fitProfile = payload?.fit_profile ?? null;
  const analyzeHref = (n: Notice) =>
    `/tools/sam-gov-notice-analyzer/?notice=${n.notice_id}${fitProfile && n.fit ? `&profile=${fitProfile.key}` : ''}`;
  const filtered = setAside !== 'all' || type !== 'open' || state !== 'all';
  const resetFilters = () => { setSetAside('all'); setType('open'); setState('all'); };
  const showAll = () => { setSetAside('all'); setType('all'); setState('all'); };

  const total = payload?.notices.length ?? 0;
  const loading = !payload && !failed;

  return (
    <>
      <Helmet>
        <title>Open Government Construction Contracts for Bid (NAICS 236220)</title>
        <meta name="description" content="Open small-business set-aside construction contracts for bid — live NAICS 236220 notices from SAM.gov with due dates and a free fit check." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://honestecho.com${PAGE_PATH}`} />
        <meta property="og:title" content="Open Small Business Set-Aside Construction Contracts — Live from SAM.gov" />
        <meta property="og:description" content="Open NAICS 236220 set-aside notices from SAM.gov, due dates and a free fit check for each." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Open Small Business Set-Aside Construction Contracts — Live from SAM.gov" />
        <meta name="twitter:description" content="Open NAICS 236220 set-aside notices from SAM.gov, due dates and a free fit check for each." />
      </Helmet>

      <BreadcrumbListSchema
        items={[
          { name: 'Honest Echo', path: '/' },
          { name: 'Open government construction contracts', path: PAGE_PATH },
        ]}
      />
      {payload && rows.length > 0 && (
        <ItemListSchema
          name="Open government construction contracts (NAICS 236220)"
          items={rows.slice(0, TOP_N).map(n => ({ name: cleanTitle(n.title), url: n.sam_url }))}
        />
      )}

      {/* Hero — deliberately short: the list is the page. The navbar is sticky
          and in flow, so no clearance padding here. */}
      <section className="pt-5 md:pt-6 pb-1 px-6 relative">
        <div className="max-w-[1080px] mx-auto relative z-10">
          <p className="mb-2 text-sm font-semibold text-[#00c3ff] font-body">Open work · Free fit check</p>
          <h1 className="font-headline font-black text-[30px] leading-[1.08] md:text-[2.5rem] md:leading-tight text-white mb-2 tracking-tighter">
            Open government construction contracts
          </h1>
          <p className="text-[#a0b2c8] text-base leading-relaxed font-body max-w-3xl mt-2">
            Live from SAM.gov, sorted by deadline. Each contract shows an example fit score. Select See why for the reasons, then run the same check for your business. Free.
          </p>
          {(loading || failed) && (
            <p className="text-sm text-[#8b9bb4] font-body mt-2" aria-live="polite">
              {loading ? 'Loading live notices…' : 'Live notices unavailable right now.'}
            </p>
          )}
        </div>
      </section>

      {/* Filters + list */}
      <section className="pb-10 px-6">
        <div className="max-w-[1080px] mx-auto">
          {/* Filters: pills on md+, native selects on mobile (four ragged pill
              lines on a 390px screen pushed the first contract past 800px). */}
          <div className="mt-3 flex flex-col gap-y-1 md:gap-y-1.5 mb-2">
            <FilterRow
              label="Set-aside"
              options={SET_ASIDE_FILTERS}
              value={setAside}
              onChange={k => { setSetAside(k); track('list_filter_changed', { filter: 'set_aside', value: k }); }}
            />
            <FilterRow
              label="Notice type"
              options={TYPE_FILTERS}
              value={type}
              onChange={k => { setType(k); track('list_filter_changed', { filter: 'notice_type', value: k }); }}
            />
            <div className={FILTER_ROW_CLASS}>
              <label htmlFor="state-filter" className="text-xs font-medium text-[#8b9bb4] font-body whitespace-nowrap">Location</label>
              <select
                id="state-filter"
                value={state}
                disabled={!payload}
                onChange={e => { setState(e.target.value); track('list_filter_changed', { filter: 'state', value: e.target.value }); }}
                className={SELECT_CLASS}
              >
                <option value="all">All states</option>
                {states.named.map(([st, n]) => <option key={st} value={st}>{st} ({n})</option>)}
                {states.none > 0 && <option value={NO_STATE}>Location not listed ({states.none})</option>}
              </select>
            </div>
          </div>

          {payload && (
            <p className="mt-1 mb-2 text-sm text-[#94a3b8] font-body leading-5" suppressHydrationWarning>
              {rows.length > TOP_N
                ? <>Showing <span className="text-white font-semibold tabular-nums">{TOP_N}</span> of <span className="text-white font-semibold tabular-nums">{rows.length}</span> open contracts, nearest deadlines first</>
                : <><span className="text-white font-semibold tabular-nums">{rows.length}</span> open contract{rows.length === 1 ? '' : 's'}</>}
              {' · '}
              {payload.stale ? `Last successful update ${fmtDate(payload.generated_at)} ${fmtUpdated(payload.generated_at)}` : `Updated ${fmtUpdated(payload.generated_at)}`}
              {filtered && (
                <> · <button type="button" onClick={resetFilters} className="underline hover:text-white transition-colors">Reset filters</button></>
              )}
              <span className="block mt-0.5 text-xs leading-5 text-[#7c8ba1]">Only contracts with at least 48 hours left. Sole-source and special notices excluded.</span>
            </p>
          )}

          {fitProfile && (
            <>
              <p className="md:hidden mt-3 mb-3 border-l-2 border-[#00c3ff]/70 pl-3 text-sm text-[#cbd5e1] font-body leading-5">
                <span className="font-semibold text-white">Example score.</span> Based on one sample renovation contractor, <span className="font-semibold text-white">not your business.</span>
              </p>
              <ol className="hidden md:grid grid-cols-3 mt-3 mb-3 rounded-lg border border-[#1e2d4a]/80 divide-x divide-[#1e2d4a]/80 text-sm font-body leading-5">
                {[
                  ['1', 'Example score', 'Based on one sample renovation contractor, not your business.'],
                  ['2', 'See why', 'See what raised or lowered the score.'],
                  ['3', 'Check your fit', 'Use your business details for free.'],
                ].map(([k, head, body]) => (
                  <li key={k} className="px-4 py-2.5 flex gap-3">
                    <span className="text-[#00c3ff]/70 font-semibold tabular-nums">{k}</span>
                    <span className="text-[#94a3b8]"><span className="text-white font-semibold">{head}.</span> {body}</span>
                  </li>
                ))}
              </ol>
            </>
          )}

          <div className="rounded-xl bg-[#071321]/85 backdrop-blur-[1px] border border-[#1e2d4a] overflow-hidden">
            {loading && <ListSkeleton />}

            {failed && (
              <div role="alert" className="p-8 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#f87171] shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <p className="text-white font-semibold font-body">We couldn&apos;t load live notices.</p>
                  <p className="text-sm text-[#a0b2c8] font-body mt-1">
                    Try again in a minute, or search NAICS 236220 directly on{' '}
                    <a href="https://sam.gov/search/?index=opp&naics=236220" target="_blank" rel="noopener noreferrer" className="underline text-[#00c3ff] hover:text-white transition-colors">SAM.gov</a>.
                  </p>
                </div>
              </div>
            )}

            {payload && rows.length === 0 && (
              <div className="p-8">
                <p className="text-white font-semibold font-body">No open notices match those filters.</p>
                <button type="button" onClick={showAll} className="text-sm text-[#00c3ff] underline hover:text-white transition-colors mt-1 font-body">
                  Show all {total}
                </button>
              </div>
            )}

            {payload && rows.length > 0 && (
              <ol className="divide-y divide-[#1e2d4a]/80">
                {rows.slice(0, TOP_N).map((n, i) => {
                  const dl = daysLeft(n.response_deadline);
                  return (
                    <li key={n.notice_id} className="px-4 md:px-6 py-4 md:py-[18px] grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_19rem] gap-2 md:gap-6 hover:bg-white/[0.015] transition-colors">
                      <div className="min-w-0">
                        <a
                          href={n.sam_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => track('list_notice_clicked', clickProps(n, i + 1))}
                          title="View notice on SAM.gov"
                          className="group inline [overflow-wrap:anywhere] text-white font-headline font-semibold text-base md:text-[17px] leading-snug hover:text-[#00c3ff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] rounded"
                        >
                          {cleanTitle(n.title)}
                          <ExternalLink aria-label="Opens on SAM.gov" className="hidden sm:inline-block ml-1.5 w-4 h-4 align-baseline text-[#64748b] group-hover:text-[#00c3ff]" strokeWidth={2} />
                        </a>
                        <p className="text-sm text-[#a3b2c6] font-body mt-1 leading-5">
                          {agencyCase(n.agency)}
                          {' · '}
                          {n.place_of_performance ?? <span className="text-[#8b9bb4]">Location not listed</span>}
                        </p>
                        <p className="mt-1 text-[13px] leading-5 text-[#8293aa] font-body" suppressHydrationWarning>
                          {n.set_aside_label}
                          {type !== 'open' && <> · {n.notice_type}</>}
                          {' · '}Posted {fmtDate(n.posted_date)}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0 text-left md:text-right md:justify-self-end md:self-center md:w-full md:border-l md:border-[#1e2d4a]/80 md:pl-6">
                        <p className="text-sm font-body whitespace-nowrap tabular-nums" suppressHydrationWarning>
                          <span className="text-[#cbd5e1]">Due {fmtDue(n.response_deadline)}</span>
                          <span className="text-[#64748b]"> · </span>
                          <span className={`text-[13px] font-medium ${dl <= 3 ? 'text-[#fbbf24]' : 'text-[#94a3b8]'}`}>{dl} day{dl === 1 ? '' : 's'} left</span>
                        </p>
                        <div className="mt-2 md:mt-2.5 grid grid-cols-[minmax(0,1fr)_auto] max-[350px]:grid-cols-1 md:flex md:justify-end items-center gap-3 md:gap-4">
                          {n.fit && (
                            <span className="text-[13px] text-[#94a3b8] font-body whitespace-nowrap tabular-nums">
                              Sample contractor: <span className="text-white font-semibold">{n.fit.score}/100</span>
                            </span>
                          )}
                          <Link
                            to={analyzeHref(n)}
                            onClick={() => track('list_analyze_clicked', clickProps(n, i + 1))}
                            className="inline-flex items-center gap-1.5 py-1.5 rounded-lg border text-[#00c3ff] text-sm font-semibold bg-[#00c3ff]/10 border-[#00c3ff]/70 hover:bg-[#00c3ff]/[0.16] hover:border-[#00c3ff] justify-center min-h-11 md:min-h-10 px-4 transition-colors whitespace-nowrap font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
                          >
                            {n.fit ? 'See why' : 'Analyze fit'} <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            {/* Hand-off to the home page: the list's own footer, not a separate banner */}
            {payload && rows.length > 0 && (
              <div className="border-t-2 border-[#00c3ff]/30 bg-[#00c3ff]/[0.06] px-4 py-6 md:px-6 md:py-9 md:flex md:items-center md:gap-10">
                <div className="min-w-0 max-w-2xl">
                  <h2 className="font-headline font-bold text-white text-xl leading-7 md:text-[22px] tracking-tight">
                    See which contracts fit before you spend days on a proposal.
                  </h2>
                  <p className="mt-2 text-sm md:text-[15px] text-[#a0b2c8] font-body leading-6 max-w-2xl">
                    Honest Echo checks each notice against your business and shows what matches, what needs a closer look, and what could rule it out.
                  </p>
                </div>
                <Link
                  to="/"
                  onClick={() => track('list_home_clicked', { shown: Math.min(rows.length, TOP_N), total: rows.length, filters })}
                  className="mt-4 md:mt-0 w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2 min-h-12 md:min-h-11 px-5 rounded-lg bg-[#00c3ff] text-[#030B17] font-headline font-bold text-sm hover:bg-[#33cfff] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030B17] focus-visible:ring-[#00c3ff]"
                >
                  See how fit checking works <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* What this is — static copy, prerendered */}
      <section className="mt-2 md:mt-4 pb-14 px-6">
        <div className="max-w-[1080px] mx-auto rounded-xl border border-[#1e2d4a]/80 grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#1e2d4a]/80">
          <div className="px-6 py-4">
            <h2 className="font-headline font-bold text-white text-sm tracking-tight mb-1">What&apos;s included</h2>
            <p className="text-[#a0b2c8] text-sm leading-6 font-body">
              Small-business construction contracts published on SAM.gov. Every contract has at least 48 hours left and falls under NAICS 236220.
            </p>
            <p className="text-[#8b9bb4] text-[13px] leading-5 font-body mt-1.5">Honest Echo is not affiliated with SAM.gov or the U.S. government.</p>
          </div>
          <div className="px-6 py-4">
            <h2 className="font-headline font-bold text-white text-sm tracking-tight mb-1">Notice types</h2>
            <p className="text-[#a0b2c8] text-sm leading-6 font-body">
              Open solicitations are accepting bids now. Early-stage notices cover upcoming projects, including requests for qualifications.
            </p>
          </div>
          <div className="px-6 py-4">
            <h2 className="font-headline font-bold text-white text-sm tracking-tight mb-1">Understand the score</h2>
            <p className="text-[#a0b2c8] text-sm leading-6 font-body">
              Each score is for the sample contractor, not your business. Select See why to view the reasons, then run the same check for your business. Free, no account required.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

// Mobile: each filter is one full-width row with its own divider (the row
// carries the line, not the control). Desktop: aligned label column, plain
// text choices, and only the location select keeps an outline.
const FILTER_ROW_CLASS = 'grid grid-cols-[5.5rem_1fr] md:grid-cols-[6rem_1fr] items-center gap-x-3 min-h-8 md:min-h-0 border-b md:border-0 border-[#1e2d4a]/80';
const SELECT_CLASS = 'h-8 md:h-7 w-full md:w-64 bg-transparent border-0 md:border border-[#1e2d4a]/60 text-[#a0b2c8] text-xs font-body rounded-none md:rounded-md px-0 md:px-2.5 pr-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] disabled:opacity-50';

function FilterRow<K extends string>({ label, options, value, onChange }: {
  label: string;
  options: { key: K; label: string }[];
  value: K;
  onChange: (k: K) => void;
}) {
  const id = `filter-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className={FILTER_ROW_CLASS} role="group" aria-label={label}>
      <label htmlFor={id} className="text-xs font-medium text-[#8b9bb4] font-body whitespace-nowrap">{label}</label>
      {/* mobile: one native select */}
      <select id={id} value={value} onChange={e => onChange(e.target.value as K)} className={`md:hidden ${SELECT_CLASS}`}>
        {options.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
      </select>
      {/* md+: quiet pills; only the selected one carries colour */}
      <div className="hidden md:flex flex-wrap items-center gap-x-4 gap-y-1">
        {options.map(o => {
          const active = o.key === value;
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.key)}
              className={`h-6 px-0.5 text-xs font-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] rounded-sm ${
                active
                  ? 'text-[#f1f5f9] font-medium shadow-[inset_0_-1.5px_0_#00c3ff]'
                  : 'text-[#94a3b8] hover:text-[#e2e8f0]'
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <ul className="divide-y divide-[#1e2d4a] animate-pulse" aria-hidden="true">
      {[0, 1, 2, 3, 4].map(i => (
        <li key={i} className="px-4 md:px-6 py-4 md:py-[18px] grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_19rem] gap-2 md:gap-6">
          <div className="space-y-3">
            <div className="h-5 w-3/4 bg-[#152033] rounded" />
            <div className="h-4 w-1/2 bg-[#152033] rounded" />
            <div className="h-3.5 w-48 bg-[#152033] rounded" />
          </div>
          <div className="flex flex-col items-start gap-2">
            <div className="h-4 w-40 bg-[#152033] rounded" />
            <div className="h-4 w-36 bg-[#152033] rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}
