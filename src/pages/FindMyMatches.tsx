import { useState, useEffect, useRef } from 'react';
import type { FormEvent, ChangeEvent, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  Search,
  AlertCircle,
  Loader2,
  FileText,
  Upload,
  CheckCircle2,
  XCircle,
  Calendar,
  ExternalLink,
  Building2,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { API_ORIGIN } from '../lib/api';
import { track } from '../lib/analytics';

// ── Contract (HE Pursuit API: /api/public/company-search + /api/public/matches) ──

interface CompanyHit {
  uei: string;
  name: string;
  dba: string | null;
  city: string | null;
  state: string | null;
  naics_primary: string | null;
  naics_title: string | null;
}

interface Match {
  notice_id: string;
  title: string;
  agency: string | null;
  office: string | null;
  set_aside: string | null;
  naics: string | null;
  maturity: string | null;
  deadline: string | null;
  deadline_text: string | null;
  pop_state: string | null;
  score: number;
  why: string[];
  gaps: string[];
  sam_url: string;
}

interface MatchResult {
  company: {
    name: string;
    uei: string | null;
    source: 'sba_lookup' | 'upload';
    state: string | null;
    city: string | null;
    naics: { code: string; title: string | null }[];
    certifications: string[];
    keywords: string[];
    agencies: string[];
    assumed_small_business?: boolean;
  };
  top: Match[];
  near_miss: (Match & { why_not: string[] }) | null;
  counts: { strong: number; worth_a_look: number; capped: boolean };
  scanned: number | null;
  draft_token: string | null;
}

interface ApiError { status: number; code: string; message: string }

// UEIs are 12 alphanumerics. Requiring a digit keeps a 12-letter company name
// ("Apexservices") from skipping the search; a digit-free UEI still works — it
// goes through search, which resolves UEIs too.
const UEI_RE = /^(?=.*\d)[A-Z0-9]{12}$/i;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const SIGNUP_PATH = '/signup/?promo=FALL2026&from=find-matches';

// Staged progress. The stages are the real order of work on the server; the
// timings are typical, so the last stage holds until the answer arrives.
const STAGES: Record<'uei' | 'upload', { at: number; label: string }[]> = {
  uei: [
    { at: 0,  label: 'Reading your SBA profile…' },
    { at: 3,  label: 'Scanning 5,000+ open federal notices…' },
    { at: 9,  label: 'Checking eligibility and set-asides…' },
    { at: 15, label: 'Picking the ones worth your time…' },
  ],
  upload: [
    { at: 0,  label: 'Reading your capability statement…' },
    { at: 15, label: 'Scanning 5,000+ open federal notices…' },
    { at: 28, label: 'Checking eligibility and set-asides…' },
    { at: 40, label: 'Picking the ones worth your time…' },
  ],
};

// ── Formatting ────────────────────────────────────────────────────────────────

function formatDue(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  // A date-only deadline arrives as UTC midnight; formatting it in a US zone
  // would roll it back a day.
  const dateOnly = /T00:00(:00(\.0+)?)?(Z|\+00:00)$/.test(iso);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
    ...(dateOnly ? { timeZone: 'UTC' } : {}),
  });
}

function formatSetAside(raw: string | null): string {
  if (!raw || /^no set.?aside/i.test(raw.trim())) return 'Open competition';
  return raw.replace(/\s*\(FAR [^)]*\)\s*$/i, '').trim();
}

function titleCase(s: string): string {
  return s.toLowerCase().replace(/\b([a-z])/g, m => m.toUpperCase());
}

function place(city: string | null, state: string | null): string {
  return [city ? titleCase(city) : null, state].filter(Boolean).join(', ');
}

function plural(n: number, one: string, many: string) {
  return n === 1 ? one : many;
}

// Shared with the Analyzer input treatment.
const inputClass =
  'w-full bg-[#060e1c] border border-[#1e2d4a] rounded-lg pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00c3ff]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] transition-colors placeholder:text-[#8b9bb4] disabled:opacity-60';
const primaryBtn =
  'px-6 py-3.5 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]';

// ── Pieces ────────────────────────────────────────────────────────────────────

function ErrorBox({ message, children }: { message: string; children?: ReactNode }) {
  return (
    <div role="alert" className="mt-4 flex items-start gap-3 rounded-xl border border-[#1e2d4a] bg-[#0b1120] p-4">
      <div className="relative shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
        <div className="absolute inset-0 blur-sm rounded-full opacity-25 bg-[#f87171]" />
        <AlertCircle className="w-4 h-4 relative z-10 text-[#f87171]" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white font-body">{message}</p>
        {children}
      </div>
    </div>
  );
}

function Progress({ mode, elapsed }: { mode: 'uei' | 'upload'; elapsed: number }) {
  const stages = STAGES[mode];
  const current = stages.reduce((idx, s, i) => (elapsed >= s.at ? i : idx), 0);
  return (
    <div className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] p-6 md:p-8 shadow-2xl" aria-live="polite">
      <p className="text-xs font-semibold uppercase tracking-[.06em] text-[#8b9bb4] font-label mb-5">
        Finding your matches
      </p>
      <ol className="space-y-3.5">
        {stages.map((s, i) => (
          <li key={s.label} className="flex items-center gap-3">
            {i < current ? (
              <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0" strokeWidth={2} />
            ) : i === current ? (
              <Loader2 className="w-4 h-4 text-[#00c3ff] animate-spin shrink-0" strokeWidth={2} />
            ) : (
              <span className="w-4 h-4 rounded-full border border-[#1e2d4a] shrink-0" aria-hidden="true" />
            )}
            <span className={`text-sm font-body ${i === current ? 'text-white font-semibold' : i < current ? 'text-[#a0b2c8]' : 'text-[#64748b]'}`}>
              {s.label}
            </span>
          </li>
        ))}
      </ol>
      <p className="text-xs text-[#8b9bb4] font-body mt-6">
        {mode === 'upload'
          ? 'Reading a document takes longer — usually under a minute.'
          : 'This usually takes 10–20 seconds.'}
      </p>
    </div>
  );
}

function CompanyCard({ company }: { company: MatchResult['company'] }) {
  const loc = place(company.city, company.state);
  return (
    <div className="rounded-xl bg-[#0b1120] border border-[#1e2d4a] p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[.06em] text-[#8b9bb4] font-label mb-3">
        How we read your company
      </p>
      <h2 className="font-headline font-bold text-white text-lg leading-snug break-words">{company.name}</h2>
      {loc && <p className="text-sm text-[#a0b2c8] font-body mt-0.5">{loc}</p>}

      {company.naics.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-medium text-[#8b9bb4] mb-2">NAICS codes</p>
          <ul className="space-y-1.5">
            {company.naics.map(n => (
              <li key={n.code} className="text-sm font-body leading-snug">
                <span className="font-mono text-[#cbd5e1]">{n.code}</span>
                {n.title && <span className="text-[#a0b2c8]"> — {n.title}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5">
        <p className="text-xs font-medium text-[#8b9bb4] mb-2">Certifications</p>
        {company.certifications.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {company.certifications.map(c => (
              <span key={c} className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/30 text-xs font-bold text-[#00c3ff]">
                {c}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#a0b2c8] font-body">None listed</p>
        )}
      </div>

      {company.keywords.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-medium text-[#8b9bb4] mb-2">Top keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {company.keywords.slice(0, 8).map(k => (
              <span key={k} className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#060e1c] border border-[#1e2d4a] text-xs text-[#cbd5e1]">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-[#1e2d4a]">
        <p className="text-xs text-[#8b9bb4] font-body">
          {company.source === 'upload' ? 'From your capability statement.' : 'From your SBA Small Business Search profile.'}
        </p>
        {company.assumed_small_business && (
          <p className="text-xs text-[#8b9bb4] font-body mt-1">
            Your statement didn't say you're a small business, so we assumed it for the small-business set-asides.
          </p>
        )}
        <p className="text-xs text-[#8b9bb4] font-body mt-1">
          Not quite right? You can correct it after you claim your profile.
        </p>
      </div>
    </div>
  );
}

function MatchCard({ match, rank, strong }: { match: Match; rank: number; strong: boolean }) {
  const due = formatDue(match.deadline_text || match.deadline);
  const agency = [match.agency, match.office].filter(Boolean).join(' · ');
  return (
    <article className="rounded-xl bg-[#0b1120] border border-[#1e2d4a] p-5 sm:p-6 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[.06em] text-[#00c3ff] font-label mb-1.5">{strong ? 'Worth pursuing' : 'Worth a look'} · #{rank}</p>
          <h3 className="font-headline font-bold text-white text-[15px] sm:text-base leading-[1.3] break-words">{match.title}</h3>
          {agency && (
            <p className="text-xs font-semibold text-[#8b9bb4] uppercase tracking-wider mt-1.5 break-words">{agency}</p>
          )}
        </div>
        <div className="shrink-0 flex sm:flex-col items-baseline sm:items-end gap-x-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b9bb4]">Fit</span>
          <span className="leading-none">
            <span className="text-3xl font-black tabular-nums tracking-tight text-white">{Math.round(match.score)}</span>
            <span className="text-base font-bold text-[#8b9bb4]"> / 100</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-x-3 gap-y-1 flex-wrap mt-3 text-xs text-[#a0b2c8] font-body">
        {due && (
          <span className="inline-flex items-center gap-1"><Calendar size={12} className="text-[#8b9bb4]" />Responses due {due}</span>
        )}
        <span className="inline-flex items-center gap-1"><ShieldCheck size={12} className="text-[#8b9bb4]" />{formatSetAside(match.set_aside)}</span>
        {match.naics && <span className="font-mono text-[#8b9bb4]">NAICS {match.naics}</span>}
      </div>

      {match.why.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#1e2d4a]">
          <p className="text-xs font-medium text-[#8b9bb4] mb-2.5">Why it fits</p>
          <ul className="space-y-2">
            {match.why.slice(0, 3).map(w => (
              <li key={w} className="flex items-start gap-3">
                <CheckCircle2 size={13} className="text-[#4ade80]/80 shrink-0 mt-0.5" />
                <span className="text-sm text-white leading-snug">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-[#1e2d4a]">
        <a
          href={match.sam_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#67e8f9] hover:text-[#a5f3fc] transition-colors"
        >
          <ExternalLink size={13} /> View on SAM.gov
        </a>
      </div>
    </article>
  );
}

function NearMissCard({ match }: { match: Match & { why_not: string[] } }) {
  const agency = [match.agency, match.office].filter(Boolean).join(' · ');
  return (
    <article className="rounded-xl bg-[#0b1120] border border-[#f5a623]/30 p-5 sm:p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#f5a623]/50 to-transparent" />
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#f5a623]/10 border border-[#f5a623]/40 text-xs font-black text-[#f5a623] tracking-widest uppercase">
        Looks right — isn’t
      </span>
      <h3 className="font-headline font-bold text-white text-[15px] sm:text-base leading-[1.3] break-words mt-3">{match.title}</h3>
      {agency && (
        <p className="text-xs font-semibold text-[#8b9bb4] uppercase tracking-wider mt-1.5 break-words">{agency}</p>
      )}
      {match.why_not.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#1e2d4a]">
          <p className="text-xs font-medium text-[#8b9bb4] mb-2.5">Why we’d skip it</p>
          <ul className="space-y-2">
            {match.why_not.map(w => (
              <li key={w} className="flex items-start gap-3">
                <XCircle size={13} className="text-[#f5a623]/90 shrink-0 mt-0.5" />
                <span className="text-sm text-[#cbd5e1] leading-snug">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-[#1e2d4a]">
        <a
          href={match.sam_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#67e8f9] hover:text-[#a5f3fc] transition-colors"
        >
          <ExternalLink size={13} /> View on SAM.gov
        </a>
      </div>
    </article>
  );
}

function countLine(r: MatchResult): string {
  const { strong, worth_a_look, capped } = r.counts;
  const worth = `${worth_a_look.toLocaleString('en-US')}${capped ? '+' : ''}`;
  const where = r.scanned ? ` in ${r.scanned.toLocaleString('en-US')} open notices` : ' in open federal notices';
  if (strong > 0 && worth_a_look > 0) return `${strong} strong ${plural(strong, 'match', 'matches')} and ${worth} worth a look${where}.`;
  if (strong > 0) return `${strong} strong ${plural(strong, 'match', 'matches')}${where}.`;
  if (worth_a_look > 0) return `No strong matches yet, and ${worth} worth a look${where}.`;
  return r.scanned ? `We checked ${r.scanned.toLocaleString('en-US')} open notices.` : 'We checked the open federal notices.';
}

function setDraftCookie(token: string) {
  const local = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const domain = local ? '' : 'domain=.honestecho.com; ';
  document.cookie = `he_draft=${encodeURIComponent(token)}; ${domain}path=/; max-age=604800; secure; samesite=lax`;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FindMyMatches() {
  const { search } = useLocation();
  const deepLinkUei = (() => {
    const v = (new URLSearchParams(search).get('uei') || '').trim();
    return /^[A-Z0-9]{12}$/i.test(v) ? v.toUpperCase() : null;
  })();
  const deepLinkRan = useRef<string | null>(null);

  const [query, setQuery]               = useState('');
  const [searching, setSearching]       = useState(false);
  const [companies, setCompanies]       = useState<CompanyHit[] | null>(null);
  const [searchedFor, setSearchedFor]   = useState('');
  const [searchError, setSearchError]   = useState<string | null>(null);

  const [file, setFile]                 = useState<File | null>(null);
  const [fileError, setFileError]       = useState<string | null>(null);

  const [matching, setMatching]         = useState<'uei' | 'upload' | null>(null);
  const [elapsed, setElapsed]           = useState(0);
  const [matchError, setMatchError]     = useState<ApiError | null>(null);
  const [result, setResult]             = useState<MatchResult | null>(null);

  const stageRef  = useRef<HTMLElement | null>(null);
  const uploadRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { track('find_matches_page_viewed'); }, []);

  // Tick the progress stages while a match run is in flight.
  useEffect(() => {
    if (!matching) return;
    setElapsed(0);
    const started = Date.now();
    const id = window.setInterval(() => setElapsed((Date.now() - started) / 1000), 500);
    return () => window.clearInterval(id);
  }, [matching]);

  // Bring the stage (progress → result) into view once it changes.
  useEffect(() => {
    if (matching || result) stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [matching, result]);

  // ?uei= deep link (outreach emails): run once after mount. Effects do not run
  // during prerender, so the static HTML stays a plain form.
  useEffect(() => {
    if (!deepLinkUei || deepLinkRan.current === deepLinkUei) return;
    deepLinkRan.current = deepLinkUei;
    setQuery(deepLinkUei);
    void runMatches({ uei: deepLinkUei }, true);
  }, [deepLinkUei]);

  async function runMatches(input: { uei: string } | { file: File }, deepLink = false) {
    const mode = 'file' in input ? 'upload' : 'uei';
    setMatchError(null);
    setResult(null);
    setMatching(mode);
    try {
      let res: Response;
      if ('file' in input) {
        const form = new FormData();
        form.append('file', input.file);
        res = await fetch(`${API_ORIGIN}/api/public/matches`, { method: 'POST', body: form, signal: AbortSignal.timeout(120_000) });
      } else {
        res = await fetch(`${API_ORIGIN}/api/public/matches`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uei: input.uei }),
          signal: AbortSignal.timeout(120_000),
        });
      }
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const code = typeof body?.error === 'string' ? body.error : `http_${res.status}`;
        const message = typeof body?.message === 'string' && body.message
          ? body.message
          : 'Something went wrong on our side. Please try again.';
        setMatchError({ status: res.status, code, message });
        track('find_matches_error', { error: code });
        return;
      }
      const data = body as MatchResult;
      if (!data?.company || !Array.isArray(data.top)) {
        setMatchError({ status: 500, code: 'bad_response', message: 'Something went wrong on our side. Please try again.' });
        track('find_matches_error', { error: 'bad_response' });
        return;
      }
      setResult(data);
      track('find_matches_result_rendered', {
        source:        data.company.source,
        top_count:     data.top.length,
        has_near_miss: !!data.near_miss,
        strong:        data.counts?.strong ?? 0,
        deep_link:     deepLink,
      });
    } catch (err) {
      const timedOut = err instanceof DOMException && err.name === 'TimeoutError';
      setMatchError({
        status: 0,
        code: timedOut ? 'timeout' : 'network',
        message: timedOut
          ? 'This is taking longer than it should. Please try again in a minute.'
          : "We couldn't reach the server. Check your connection and try again.",
      });
      track('find_matches_error', { error: timedOut ? 'timeout' : 'network' });
    } finally {
      setMatching(null);
    }
  }

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setSearchError(null);
    setCompanies(null);
    if (q.length < 3) { setSearchError('Type at least 3 characters of your company name, or your UEI.'); return; }

    if (UEI_RE.test(q)) {
      track('find_matches_search_submitted', { query_type: 'uei' });
      void runMatches({ uei: q.toUpperCase() });
      return;
    }

    track('find_matches_search_submitted', { query_type: 'name' });
    setResult(null);
    setMatchError(null);
    setSearching(true);
    try {
      const res = await fetch(`${API_ORIGIN}/api/public/company-search?q=${encodeURIComponent(q)}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const code = typeof body?.error === 'string' ? body.error : `http_${res.status}`;
        setSearchError(typeof body?.message === 'string' && body.message ? body.message : 'Search is unavailable right now. Please try again.');
        track('find_matches_error', { error: code });
        return;
      }
      setCompanies(Array.isArray(body?.companies) ? body.companies : []);
      setSearchedFor(q);
    } catch {
      setSearchError("We couldn't reach the server. Check your connection and try again.");
      track('find_matches_error', { error: 'network' });
    } finally {
      setSearching(false);
    }
  }

  function pickCompany(c: CompanyHit, index: number) {
    track('find_matches_company_selected', { position: index + 1 });
    setCompanies(null);
    setQuery(c.name);
    void runMatches({ uei: c.uei });
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    setFileError(null);
    const f = e.target.files?.[0] ?? null;
    e.target.value = '';
    if (!f) return;
    if (!/\.(pdf|docx)$/i.test(f.name)) { setFile(null); setFileError('Upload a PDF or DOCX file.'); return; }
    if (f.size > MAX_UPLOAD_BYTES) { setFile(null); setFileError('That file is over 10 MB. Try a shorter version or a PDF export.'); return; }
    setFile(f);
  }

  function submitUpload() {
    if (!file) return;
    track('find_matches_upload_submitted', { file_type: /\.docx$/i.test(file.name) ? 'docx' : 'pdf' });
    setCompanies(null);
    void runMatches({ file });
  }

  function startOver() {
    setResult(null);
    setMatchError(null);
    setCompanies(null);
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const busy = searching || !!matching;
  const steerToUpload = matchError && (matchError.status === 404 || matchError.status === 502);

  return (
    <>
      <Helmet>
        <title>Find My Matches — Free Federal Opportunity Matches | Honest Echo</title>
        <meta name="description" content="Name your company and see the open federal opportunities worth your pursuit time: three to pursue, one near-miss to skip, and why. Free, no account required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/tools/find-my-matches" />
        <meta property="og:title" content="Find My Matches — Free Federal Opportunity Matches | Honest Echo" />
        <meta property="og:description" content="Name your company. See the three open federal opportunities worth pursuing, plus one that looks right and isn't — and why. Free, no account required." />
        <meta property="og:image" content="https://honestecho.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Find My Matches — Free Federal Opportunity Matches | Honest Echo" />
        <meta name="twitter:description" content="Name your company. See the three open federal opportunities worth pursuing, plus one that looks right and isn't — and why." />
        <meta name="twitter:image" content="https://honestecho.com/og-image.jpg" />
      </Helmet>

      {/* ── Hero + input ───────────────────────────────────────────────────── */}
      <section className="pt-10 md:pt-16 pb-8 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-xs font-medium text-[#a0b2c8] font-body mb-3"><span className="text-[#00c3ff]">Free</span> tool · No account required</p>
          <h1 className="font-headline font-black text-4xl md:text-6xl text-white mb-5 tracking-tighter leading-tight">
            Find the federal opportunities{' '}
            <span className="text-[#00c3ff]">worth your time.</span>
          </h1>
          <p className="text-[#a0b2c8] text-base md:text-lg leading-relaxed font-body mb-8">
            Name your company. We check your public SBA profile against every open federal notice and show you the three worth pursuing, plus one that looks right and isn’t. Know what to pursue, what to kill, and why.
          </p>

          <form onSubmit={handleSearch} className="rounded-xl bg-[#0b1120] border border-[#1e2d4a] p-4 sm:p-5" noValidate>
            <label htmlFor="company-input" className="block text-xs font-semibold text-[#a0b2c8] font-label mb-2">
              Company name or UEI
            </label>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b9bb4] pointer-events-none" strokeWidth={2} />
                <input
                  id="company-input"
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="e.g. Apex Facility Services"
                  autoComplete="organization"
                  disabled={busy}
                  className={inputClass}
                />
              </div>
              <button type="submit" disabled={busy} className={primaryBtn}>
                {searching ? <><Loader2 className="w-4 h-4 animate-spin" />Searching…</> : <>Find my matches<ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
            <p className="text-sm text-[#8b9bb4] font-body mt-3">
              We look you up in SBA’s Small Business Search. Your 12-character UEI goes straight to your matches.
            </p>

            {searchError && !searching && <ErrorBox message={searchError} />}

            {/* Upload */}
            <div className="mt-5 pt-5 border-t border-[#1e2d4a]">
              <p className="text-sm text-white font-body font-semibold">Or upload your capability statement (PDF or DOCX)</p>
              <p className="text-xs text-[#8b9bb4] font-body mt-1">Up to 10 MB. We use the file only to build your profile.</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
                <input
                  ref={uploadRef}
                  id="capability-upload"
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFile}
                  disabled={busy}
                  className="sr-only"
                />
                <label
                  htmlFor="capability-upload"
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0b1120] border border-[#1e2d4a] text-white text-sm font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#00c3ff] ${busy ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <Upload className="w-4 h-4 text-[#00c3ff]" />
                  {file ? 'Choose a different file' : 'Choose a file'}
                </label>
                {file && (
                  <>
                    <span className="inline-flex items-center gap-1.5 text-sm text-[#cbd5e1] font-body min-w-0">
                      <FileText className="w-4 h-4 text-[#8b9bb4] shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </span>
                    <button type="button" onClick={submitUpload} disabled={busy} className={`${primaryBtn} sm:ml-auto py-3`}>
                      Match this file<ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              {fileError && <ErrorBox message={fileError} />}
            </div>
          </form>
        </div>
      </section>

      {/* ── Company picker ─────────────────────────────────────────────────── */}
      {companies && !matching && (
        <section className="pb-8 px-4 sm:px-6 relative">
          <div className="max-w-3xl mx-auto relative z-10">
            {companies.length > 0 ? (
              <>
                <p className="text-sm text-[#a0b2c8] font-body mb-3">
                  Pick your company ({companies.length} {plural(companies.length, 'result', 'results')} for “{searchedFor}”):
                </p>
                <ul className="space-y-2.5">
                  {companies.map((c, i) => {
                    const loc = place(c.city, c.state);
                    return (
                      <li key={c.uei}>
                        <button
                          type="button"
                          onClick={() => pickCompany(c, i)}
                          className="w-full text-left rounded-xl bg-[#0b1120] border border-[#1e2d4a] p-4 flex items-center gap-4 group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
                        >
                          <Building2 className="w-5 h-5 text-[#00c3ff] shrink-0" strokeWidth={2} />
                          <span className="min-w-0 flex-1">
                            <span className="block font-headline font-bold text-white text-sm sm:text-base leading-snug break-words">{c.name}</span>
                            {c.dba && <span className="block text-xs text-[#a0b2c8] font-body mt-0.5 break-words">DBA {c.dba}</span>}
                            <span className="block text-xs text-[#8b9bb4] font-body mt-1 break-words">
                              {[loc, c.naics_title ? `${c.naics_title}${c.naics_primary ? ` (${c.naics_primary})` : ''}` : null].filter(Boolean).join(' · ')}
                            </span>
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#8b9bb4] group-hover:text-[#00c3ff] transition-colors shrink-0" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <p className="text-xs text-[#8b9bb4] font-body mt-3">Not listed? Try your UEI, or upload your capability statement above.</p>
              </>
            ) : (
              <ErrorBox message={`We couldn’t find “${searchedFor}” in SBA’s Small Business Search.`}>
                <p className="text-sm text-[#a0b2c8] font-body mt-1">Try your UEI or a shorter version of the name, or upload your capability statement above.</p>
              </ErrorBox>
            )}
          </div>
        </section>
      )}

      {/* ── Progress / error / result ──────────────────────────────────────── */}
      {(matching || matchError || result) && (
        <section ref={stageRef} className="pb-12 px-4 sm:px-6 relative scroll-mt-24">
          <div className={`${result ? 'max-w-7xl' : 'max-w-3xl'} mx-auto relative z-10`}>
            {matching && <Progress mode={matching} elapsed={elapsed} />}

            {matchError && !matching && (
              <ErrorBox message={matchError.message}>
                {steerToUpload && (
                  <button
                    type="button"
                    onClick={() => uploadRef.current?.click()}
                    className="inline-flex items-center gap-1.5 mt-2.5 px-4 py-1.5 border border-[#00c3ff]/60 text-[#00c3ff] text-sm font-bold rounded-lg hover:bg-[#00c3ff]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
                  >
                    <Upload className="w-4 h-4" /> Upload your capability statement
                  </button>
                )}
              </ErrorBox>
            )}

            {result && !matching && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
                  <div className="min-w-0">
                    <h2 className="font-headline font-black text-2xl md:text-3xl text-white tracking-tight">
                      {result.top.length > 0
                        ? result.counts.strong >= result.top.length
                          ? `${result.top.length === 1 ? 'The one' : `The ${result.top.length}`} worth your pursuit time`
                          : `Your ${result.top.length === 1 ? 'best fit' : `${result.top.length} best fits`} right now`
                        : 'Nothing clears the bar right now'}
                    </h2>
                    <p className="text-sm text-[#a0b2c8] font-body mt-1.5">{countLine(result)}</p>
                  </div>
                  <button type="button" onClick={startOver} className="self-start sm:self-auto text-sm text-[#67e8f9] hover:text-white transition-colors font-body shrink-0">
                    Check another company
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-6 items-start">
                  <CompanyCard company={result.company} />

                  <div className="space-y-4 min-w-0">
                    {result.top.length > 0 ? (
                      result.top.map((m, i) => <MatchCard key={m.notice_id} match={m} rank={i + 1} strong={i < result.counts.strong} />)
                    ) : (
                      <div className="rounded-xl bg-[#0b1120] border border-[#1e2d4a] p-5 sm:p-6">
                        <p className="text-white font-body font-semibold">No open notice clears the bar for your company today.</p>
                        <p className="text-sm text-[#a0b2c8] font-body mt-1.5 leading-relaxed">
                          That’s a real answer, not a glitch: none of the open notices we checked is worth your proposal hours. Claim your profile and we’ll alert you when one is.
                        </p>
                      </div>
                    )}

                    {result.near_miss && <NearMissCard match={result.near_miss} />}

                    {/* ── Claim ── */}
                    <div className="rounded-xl bg-[#0b1120] border border-[#00c3ff]/30 p-5 sm:p-6">
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-[#00c3ff] shrink-0 mt-0.5" strokeWidth={2} />
                        <div className="min-w-0">
                          <p className="font-headline font-bold text-white text-base">
                            {result.top.length > 0 ? 'Keep these, and get the next ones as they post.' : 'Get alerted when one clears the bar.'}
                          </p>
                          <p className="text-sm text-[#a0b2c8] font-body mt-1 leading-relaxed">
                            Your profile is already filled in from what you see here. Claim it with a free account; no card.
                          </p>
                        </div>
                      </div>
                      <Link
                        to={SIGNUP_PATH}
                        onClick={() => {
                          if (result.draft_token) setDraftCookie(result.draft_token);
                          track('find_matches_claim_clicked', { has_draft: !!result.draft_token });
                        }}
                        className="mt-4 w-full sm:w-auto px-6 py-3.5 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
                      >
                        Claim your profile — it’s already filled in
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ── What we use ────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="font-headline font-black text-2xl md:text-3xl text-white mb-2 tracking-tight">
            Three decisions instead of fifty candidates
          </h2>
          <p className="text-[#a0b2c8] font-body mb-8 max-w-2xl text-sm md:text-base leading-relaxed">
            A keyword search hands you every notice that mentions your NAICS code. We rank them against your company and show only the few worth your time.
          </p>
          <div className="rounded-xl border border-[#1e2d4a]/80 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1e2d4a]/80">
            {([
              {
                Icon: Building2,
                title: 'What we read',
                body: 'Your public SBA Small Business Search profile: NAICS codes, certifications, and capabilities. Or the capability statement you upload, which we use only to build your profile.',
              },
              {
                Icon: Search,
                title: 'What we check',
                body: 'Every open federal notice on SAM.gov: the work, the set-aside, the NAICS code, and whether the deadline leaves time to respond.',
              },
              {
                Icon: ShieldCheck,
                title: 'What you get',
                body: 'The three worth pursuing, one that looks right and isn’t, and the reasons for each. A first screen, not an eligibility decision.',
              },
            ] as const).map(({ Icon: CardIcon, title, body }) => (
              <div key={title} className="px-5 sm:px-6 py-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <CardIcon size={16} className="text-[#00c3ff] shrink-0" strokeWidth={2} />
                  <h3 className="font-headline font-bold text-white text-base">{title}</h3>
                </div>
                <p className="text-sm text-[#a0b2c8] font-body leading-6">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer strip ───────────────────────────────────────────────────── */}
      <section className="pb-20 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <p className="text-sm text-[#8b9bb4] font-body text-center border-t border-[#1e2d4a] pt-8">
            Honest Echo is a woman-owned, veteran-owned small business. We are not affiliated with, or endorsed by, any government agency.
          </p>
        </div>
      </section>
    </>
  );
}
