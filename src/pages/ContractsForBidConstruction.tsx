import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, AlertCircle, Radar } from 'lucide-react';
import { API_BASE } from '../lib/api';
import { track } from '../lib/analytics';

// ── List-browse TEST page (grill 2026-09-12) ──────────────────────────────────
// fall26_search: 25 of 29 attributed paid clicks typed list-browse queries
// ("list of government contracts for bid", "open government contracts") and
// bounced off the story homepage. This page is the test of that demand: one
// live list, two filters, two instrumented clicks. Success is pre-declared —
// 10 of the first 100 matched visits click a notice or "Analyze fit". It is
// not a search product: no accounts, saved filters, alerts, or other NAICS.

const NAICS = '236220';
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
}

interface ListPayload {
  naics: string;
  generated_at: string;
  count: number;
  notices: Notice[];
  stale?: boolean;   // server could not refresh; this is its last good copy
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
  { key: 'upcoming', label: 'Upcoming: presolicitation & sources sought' },
  { key: 'all',      label: 'All' },
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

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
// Deadlines are instants; show the visitor's local time + zone next to the
// date so the date and the "days left" count are read against the same clock.
const fmtDue = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
const daysLeft = (iso: string) => Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 864e5));

// SAM shouts agency names and inverts some ("INTERIOR, DEPARTMENT OF THE").
function agencyCase(s: string | null): string {
  if (!s) return '';
  const inv = s.match(/^(.+?),\s*(DEPARTMENT OF THE|DEPARTMENT OF|DEPT OF THE|DEPT OF)$/i);
  const ordered = inv ? `${inv[2]} ${inv[1]}` : s;
  return ordered
    .toLowerCase()
    .replace(/\b([a-z])/g, m => m.toUpperCase())
    .replace(/\b(Of|The|And|For)\b/g, m => m.toLowerCase());
}

export default function ContractsForBidConstruction() {
  const [payload, setPayload] = useState<ListPayload | null>(null);
  const [failed, setFailed] = useState(false);
  const [setAside, setSetAside] = useState<SetAsideKey | 'all'>('all');
  const [type, setType] = useState<TypeFilter>('open');
  const [state, setState] = useState<string>('all');

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
          track(j.notices.length ? 'list_loaded' : 'list_empty', { naics: NAICS, count: j.notices.length, stale: j.stale === true, ...timing });
        } else {
          setFailed(true);
          track('list_load_failed', { naics: NAICS, status: res.status });
        }
      } catch {
        if (cancelled) return;
        setFailed(true);
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
    filters,
  });
  const filtered = setAside !== 'all' || type !== 'open' || state !== 'all';
  const resetFilters = () => { setSetAside('all'); setType('open'); setState('all'); };
  const showAll = () => { setSetAside('all'); setType('all'); setState('all'); };

  const total = payload?.notices.length ?? 0;
  const loading = !payload && !failed;

  return (
    <>
      <Helmet>
        <title>Open Small Business Set-Aside Construction Contracts (NAICS 236220) — Live from SAM.gov</title>
        <meta name="description" content="Live list of open small-business set-aside government construction contracts for bid — NAICS 236220 solicitations, presolicitations and sources sought from SAM.gov, with due dates and a free bid/no-bid fit check for each." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://honestecho.com${PAGE_PATH}`} />
        <meta property="og:title" content="Open Small Business Set-Aside Construction Contracts — Live from SAM.gov" />
        <meta property="og:description" content="Open NAICS 236220 set-aside notices from SAM.gov, due dates and a free fit check for each." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Open Small Business Set-Aside Construction Contracts — Live from SAM.gov" />
        <meta name="twitter:description" content="Open NAICS 236220 set-aside notices from SAM.gov, due dates and a free fit check for each." />
      </Helmet>

      {/* Hero — deliberately short: the list is the page */}
      <section className="pt-24 pb-5 px-6 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-4">
            <Radar className="w-3 h-3 text-[#00c3ff]" />
            <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">Live from SAM.gov · NAICS 236220</span>
          </div>
          <h1 className="font-headline font-black text-3xl md:text-[2.6rem] text-white mb-2 tracking-tighter leading-tight drop-shadow-2xl">
            Open small-business construction contracts for bid
          </h1>
          <p className="text-[#a0b2c8] text-base leading-relaxed font-body max-w-3xl">
            Set-aside notices in commercial and institutional building construction, live from SAM.gov, soonest due first. Each row opens the notice on SAM.gov or runs a free fit check.
          </p>
          <p className="text-sm text-[#8b9bb4] font-body mt-2" aria-live="polite">
            {loading && 'Loading live notices…'}
            {failed && 'Live notices unavailable right now.'}
            {payload && `${total} open notices · ${payload.stale ? 'showing last successful update from' : 'updated'} ${new Date(payload.generated_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`}
          </p>
        </div>
      </section>

      {/* Filters + list */}
      <section className="pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-4">
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
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="state-filter" className="text-xs font-bold text-[#8b9bb4] uppercase tracking-widest font-label mr-1">Location</label>
              <select
                id="state-filter"
                value={state}
                disabled={!payload}
                onChange={e => { setState(e.target.value); track('list_filter_changed', { filter: 'state', value: e.target.value }); }}
                className="bg-[#0b1120] border border-[#1e2d4a] text-[#a0b2c8] text-sm font-body rounded-full px-3 py-1.5 pr-8 hover:border-[#00c3ff]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] disabled:opacity-50"
              >
                <option value="all">All states</option>
                {states.named.map(([st, n]) => <option key={st} value={st}>{st} ({n})</option>)}
                {states.none > 0 && <option value={NO_STATE}>Location not provided ({states.none})</option>}
              </select>
            </div>
          </div>

          {payload && (
            <p className="text-xs text-[#8b9bb4] font-body mb-3">
              Showing {rows.length} of {total} live set-aside notices
              {filtered && (
                <> · <button type="button" onClick={resetFilters} className="underline hover:text-white transition-colors">reset filters</button></>
              )}
              <span className="block mt-1">Excludes unrestricted, sole-source and special notices, and anything due within 48 hours.</span>
            </p>
          )}

          <div className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] overflow-hidden shadow-2xl">
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
              <ol className="divide-y divide-[#1e2d4a]">
                {rows.map((n, i) => {
                  const dl = daysLeft(n.response_deadline);
                  return (
                    <li key={n.notice_id} className="p-5 md:px-6 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-8 hover:bg-[#0e1628] transition-colors">
                      <div className="min-w-0">
                        <a
                          href={n.sam_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => track('list_notice_clicked', clickProps(n, i + 1))}
                          className="group inline-flex items-start gap-1.5 text-white font-headline font-bold text-base md:text-lg leading-snug hover:text-[#00c3ff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] rounded"
                        >
                          <span>{n.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-1.5 text-[#8b9bb4] group-hover:text-[#00c3ff]" strokeWidth={2} />
                        </a>
                        <p className="text-sm text-[#a0b2c8] font-body mt-1.5">
                          {agencyCase(n.agency)}
                          {' · '}
                          {n.place_of_performance
                            ? n.place_of_performance
                            : <span className="text-[#8b9bb4] italic">Location not provided</span>}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <Chip>{n.set_aside_label}</Chip>
                          <Chip muted>{n.notice_type}</Chip>
                          <span className="text-xs text-[#8b9bb4] font-body">Posted {fmtDate(n.posted_date)}</span>
                        </div>
                      </div>
                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 md:gap-2 shrink-0">
                        <div className="md:text-right">
                          <p className="text-white font-headline font-bold text-sm">Due {fmtDue(n.response_deadline)}</p>
                          <p className={`text-xs font-body ${dl <= 7 ? 'text-[#fbbf24]' : 'text-[#8b9bb4]'}`}>{dl} day{dl === 1 ? '' : 's'} left</p>
                        </div>
                        <Link
                          to={`/tools/sam-gov-notice-analyzer/?notice=${n.notice_id}`}
                          onClick={() => track('list_analyze_clicked', clickProps(n, i + 1))}
                          className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#00c3ff]/60 text-[#00c3ff] text-sm font-bold rounded-lg hover:bg-[#00c3ff]/10 transition-colors whitespace-nowrap font-headline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
                        >
                          Analyze fit <ArrowRight className="w-4 h-4" />
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

      {/* What this is — static copy, prerendered */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-7">
            <h2 className="font-headline font-bold text-white text-lg tracking-tight mb-2">What&apos;s on this list</h2>
            <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">
              Active SAM.gov notices in NAICS 236220 (Commercial and Institutional Building Construction) competed only among small businesses — total small business, SDVOSB, WOSB/EDWOSB, 8(a), HUBZone, VA veteran-owned and Indian small business set-asides — with at least two days left to respond. Open solicitations show by default; presolicitations and sources sought are one click away. Sole-source, partial, unrestricted and special notices are left out.
            </p>
          </div>
          <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-7">
            <h2 className="font-headline font-bold text-white text-lg tracking-tight mb-2">Solicitation vs. Sources Sought</h2>
            <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">
              A Solicitation is open for proposals now. A Presolicitation says one is coming. A Sources Sought is the agency asking who could do the work — often the best moment to shape the requirement and the set-aside decision before the RFP exists.
            </p>
          </div>
          <div className="bg-[#0b1120] border border-[#00c3ff]/30 rounded-2xl p-7">
            <h2 className="font-headline font-bold text-white text-lg tracking-tight mb-2">A list is not a decision</h2>
            <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-4">
              &ldquo;Analyze fit&rdquo; runs the notice through HE Pursuit&apos;s screening read — eligibility, timing, agency and scope signals — and returns a Go, Conditional Go or No-Bid in seconds. Free, no account.
            </p>
            <Link to="/tools/sam-gov-notice-analyzer/" className="inline-flex items-center gap-2 text-[#00c3ff] font-bold text-sm hover:text-white transition-colors font-headline">
              Analyze any SAM.gov notice <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function FilterRow<K extends string>({ label, options, value, onChange }: {
  label: string;
  options: { key: K; label: string }[];
  value: K;
  onChange: (k: K) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={label}>
      <span className="text-xs font-bold text-[#8b9bb4] uppercase tracking-widest font-label mr-1">{label}</span>
      {options.map(o => {
        const active = o.key === value;
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-body border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] ${
              active
                ? 'bg-[#00c3ff] text-[#030B17] border-[#00c3ff] font-bold'
                : 'bg-[#0b1120] text-[#a0b2c8] border-[#1e2d4a] hover:border-[#00c3ff]/40 hover:text-white'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Chip({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide font-label border ${
      muted ? 'bg-[#152033] text-[#a0b2c8] border-[#1e2d4a]' : 'bg-[#00c3ff]/10 text-[#00c3ff] border-[#00c3ff]/20'
    }`}>
      {children}
    </span>
  );
}

function ListSkeleton() {
  return (
    <ul className="divide-y divide-[#1e2d4a] animate-pulse" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map(i => (
        <li key={i} className="p-5 md:px-6 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-8">
          <div className="space-y-3">
            <div className="h-5 w-3/4 bg-[#152033] rounded" />
            <div className="h-4 w-1/2 bg-[#152033] rounded" />
            <div className="flex gap-2"><div className="h-5 w-28 bg-[#152033] rounded-full" /><div className="h-5 w-20 bg-[#152033] rounded-full" /></div>
          </div>
          <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-2">
            <div className="h-4 w-20 bg-[#152033] rounded" />
            <div className="h-9 w-28 bg-[#152033] rounded-lg" />
          </div>
        </li>
      ))}
    </ul>
  );
}
