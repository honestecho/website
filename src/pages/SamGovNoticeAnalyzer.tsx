import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  Search,
  AlertCircle,
  Loader2,
  FileText,
  ShieldCheck,
  BarChart2,
} from 'lucide-react';
import AnalyzerOpportunityCard from '../components/AnalyzerOpportunityCard';
import AnalyzerOutputPreview from '../components/AnalyzerOutputPreview';
import { FAQPageSchema } from '../components/SchemaOrg';
import { API_BASE } from '../lib/api';
import { track } from '../lib/analytics';

// ── FAQ (visible section + FAQPage schema for search/AI answer engines) ───────

const ANALYZER_FAQ = [
  {
    q: 'What is the SAM.gov Notice Analyzer?',
    a: 'It gives you a quick first-pass read on a SAM.gov notice: fit score, verdict, key details, strengths, and watch-outs. You can use it without an account.',
  },
  {
    q: 'Will it write my proposal or give legal advice?',
    a: 'No. It helps you decide whether the opportunity deserves a closer look; it does not write proposals or provide legal advice.',
  },
  {
    q: 'Can I use it on sources sought and presolicitation notices?',
    a: 'Yes. You can screen sources sought and presolicitation notices before the final solicitation is posted.',
  },
  {
    q: 'Can this replace my bid/no-bid checklist or decision matrix?',
    a: 'No. Use it for an initial screen, then check eligibility, competition, delivery demands, and the cost of pursuing the bid.',
  },
  {
    q: 'Will it tell me whether to prime or subcontract?',
    a: 'No. That decision depends on your capacity, partners, and the solicitation requirements.',
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────

type Recommendation = 'GO' | 'CONDITIONAL_GO' | 'NO_BID';

interface ProfileScore {
  match_score: number;
  dimension_scores: Record<string, number>;
  reasons: string[];
  recommendation: Recommendation;
}

interface ProfileMeta {
  key: string;
  label: string;
  blurb: string;
}

interface AnalysisResult {
  noticeId: string;
  title: string;
  agency: string;
  dueDate: string | null;
  setAside: string | null;
  naics: string | null;
  maturity: string | null;
  summary: string;
  defaultProfile: string;
  profiles: Record<string, ProfileScore>;
  profileMeta: ProfileMeta[];
}

// The sample card renders a cached analysis straight from the server. `as
// AnalysisResult` is compile-time only, so if the scorer's shape ever drifts
// from the card's — it already has twice — an unchecked payload throws during
// render and takes the page down. Validate every field the card touches; a
// payload that fails falls back to the static preview.
const isStr = (v: unknown): v is string => typeof v === 'string';
const isNullableStr = (v: unknown) => v === null || typeof v === 'string';
const isNum = (v: unknown) => typeof v === 'number' && Number.isFinite(v);
const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

function isProfileScore(v: unknown): v is ProfileScore {
  return isObj(v)
    && isNum(v.match_score)
    && isObj(v.dimension_scores) && Object.values(v.dimension_scores).every(isNum)
    && Array.isArray(v.reasons) && v.reasons.every(isStr)
    && (v.recommendation === 'GO' || v.recommendation === 'CONDITIONAL_GO' || v.recommendation === 'NO_BID');
}

function isAnalysisResult(v: unknown): v is AnalysisResult {
  return isObj(v)
    && [v.noticeId, v.title, v.agency, v.summary, v.defaultProfile].every(isStr)
    && [v.dueDate, v.setAside, v.naics, v.maturity].every(isNullableStr)
    && Array.isArray(v.profileMeta)
    && v.profileMeta.every(m => isObj(m) && [m.key, m.label, m.blurb].every(isStr))
    && isObj(v.profiles) && Object.values(v.profiles).every(isProfileScore)
    && isProfileScore(v.profiles[v.defaultProfile as string]);
}


// ── Skeleton ──────────────────────────────────────────────────────────────────

function ResultSkeleton() {
  return (
    <div className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] p-6 md:p-8 shadow-2xl animate-pulse">
      <div className="h-4 w-24 bg-[#152033] rounded mb-3" />
      <div className="h-7 w-3/4 bg-[#152033] rounded mb-6" />
      <div className="flex items-center gap-6 mb-6">
        <div className="h-14 w-16 bg-[#152033] rounded" />
        <div className="w-px h-14 bg-[#152033]" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-28 bg-[#152033] rounded-full" />
          <div className="h-4 w-full bg-[#152033] rounded" />
        </div>
      </div>
      <div className="border-t border-[#1e2d4a] pt-5 space-y-3">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 bg-[#152033] rounded" />
            <div className="h-4 flex-1 bg-[#152033] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Experiment P-B: sample-notice pre-fill ───────────────────────────────────
// Pre-load a real, known-good SAM.gov notice so a first-time visitor sees a full
// result in one click instead of hunting for a Notice ID (measured: 105 analyzer
// views → 2 submissions before this). Durable: this notice is stored in our
// `opportunities` table, so /public/analyze scores it from our own DB/cache even
// after it closes on SAM.gov. Rotate the example by swapping this single id.
//
// Pick the replacement so it scores WELL against the public personas (migration
// 094): the old GPO IT notice (541511, no set-aside) floored every persona at an
// identical 25/85 = 29% "Poor Fit", because 094 dropped the only IT persona. A
// good example needs (a) a NAICS one persona matches exactly, (b) a set-aside,
// (c) a title keyword hit, and (d) 45+ days of runway — past the deadline the
// card hard-flips to NOT BIDDABLE. This one scores 74 (GO) for
// building_construction vs 39-44 for the other seven, so the persona selector
// actually demonstrates that the profile changes the answer.
// FALLBACK ONLY — the live sample id now comes from GET /public/analyze/sample,
// which picks a current, well-spread notice from the corpus so the demo can
// never expire. This constant is the last-resort pre-fill when that request
// fails, and it does go stale (this one closes 2026-10-08).
const SAMPLE_NOTICE_ID  = '9c73de6224ab4a8ea88dfbb60e8d085f';
const SAMPLE_NOTICE_URL = `https://sam.gov/opp/${SAMPLE_NOTICE_ID}/view`;
const sampleUrlFor = (id: string) => `https://sam.gov/opp/${id}/view`;

// "Example loaded: a live U.S. Army solicitation" — agency + notice type, which a
// contractor recognises; a clipped title or a UUID confirms nothing.
const AGENCY_SHORT: [RegExp, string][] = [
  [/AIR FORCE/i, 'U.S. Air Force'], [/\bARMY\b/i, 'U.S. Army'], [/\bNAVY\b|NAVAL/i, 'U.S. Navy'],
  [/VETERANS/i, 'VA'], [/HOMELAND/i, 'DHS'], [/GENERAL SERVICES|\bGSA\b/i, 'GSA'], [/DEFENSE/i, 'DoD'],
  [/INTERIOR/i, 'Interior'], [/AGRICULTURE/i, 'USDA'], [/HEALTH AND HUMAN/i, 'HHS'], [/ENERGY/i, 'DOE'],
];
function exampleLabel(r: { agency: string; maturity: string | null }): string {
  const agency = AGENCY_SHORT.find(([re]) => re.test(r.agency))?.[1]
    ?? r.agency.split('.').pop()!.trim().toLowerCase().replace(/\b([a-z])/g, m => m.toUpperCase());
  const type = (r.maturity || 'Notice').replace('Combined Synopsis/Solicitation', 'Solicitation');
  return `${agency} · ${type}`;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SamGovNoticeAnalyzer() {
  // ?notice=<32 hex> — the list-browse page (/government-contracts-for-bid/…)
  // hands a chosen notice straight in. Initial state stays query-independent so
  // a hard load of the handoff URL hydrates cleanly against the prerendered
  // form; the handoff is applied in an effect after mount (before the sample
  // swap below can resolve, so it is never clobbered) and analysed once — the
  // visitor already clicked "Analyze fit", a second click here is a step they
  // did not ask for.
  const { search } = useLocation();
  const handoffId = (() => {
    const v = new URLSearchParams(search).get('notice') || '';
    return /^[0-9a-fA-F]{32}$/.test(v) ? v.toLowerCase() : null;
  })();
  // The list scores every row against one sample business; open on that same
  // business so the number the visitor clicked is the number they land on.
  const handoffProfile = new URLSearchParams(search).get('profile') || '';
  const handoffRan = useRef<string | null>(null);
  const [input, setInput]             = useState(SAMPLE_NOTICE_URL);
  const [isExample, setIsExample]     = useState(true);
  const [loading, setLoading]         = useState(false);
  const [result, setResult]           = useState<AnalysisResult | null>(null);
  const [error, setError]             = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  // Empty until the visitor picks — the render guard falls through to the
  // server's defaultProfile (best-scoring persona). Do not seed a real key here:
  // it would pin the initial render to that persona for every notice.
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  // A real, cached analysis of the current sample notice, used as the hero
  // preview so the visitor sees actual output — not a mock — before clicking.
  // null until it arrives (or if the server has no fresh cache row), in which
  // case the static structural preview stands in.
  const [sampleResult, setSampleResult] = useState<AnalysisResult | null>(null);
  const resultRef = useRef<HTMLElement | null>(null);

  // The result is the point of the page: once it exists, bring it into view
  // (the form sits above and would otherwise leave the verdict below the fold).
  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [result]);

  useEffect(() => { track('public_analyzer_page_viewed'); }, []);

  // Swap the fallback pre-fill for the server's current sample pick. Only while
  // the field is still untouched — never clobber something the visitor typed.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/public/analyze/sample?full=1`);
        if (!res.ok) return;
        const j = await res.json() as { notice_id?: string; result?: unknown };
        if (cancelled) return;
        if (j.notice_id && /^[0-9a-f]{32}$/.test(j.notice_id)) {
          setInput(prev => prev === SAMPLE_NOTICE_URL ? sampleUrlFor(j.notice_id!) : prev);
        }
        // Only trust a payload that can actually render a card, and only if it
        // describes the same notice the hero just pre-filled — otherwise the
        // input and the card would show two different opportunities.
        if (isAnalysisResult(j.result) && j.result.noticeId === j.notice_id) {
          setSampleResult(j.result);
        }
      } catch { /* fallback pre-fill stands */ }
    })();
    return () => { cancelled = true; };
  }, []);

  // Apply + auto-run the handed-off notice once per id (never during prerender —
  // effects do not run there, so the static HTML stays a plain form; the ref
  // makes StrictMode's dev double-invoke and re-renders idempotent).
  useEffect(() => {
    if (!handoffId || handoffRan.current === handoffId) return;
    handoffRan.current = handoffId;
    setInput(sampleUrlFor(handoffId));
    setIsExample(false);
    void runAnalyze(sampleUrlFor(handoffId), 'list');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handoffId]);

  function handleAnalyze(e: FormEvent) {
    e.preventDefault();
    void runAnalyze(input, 'form');
  }

  async function runAnalyze(value: string, source: 'form' | 'list') {
    setError(null);
    setRateLimited(false);
    setResult(null);

    const trimmed = value.trim();
    if (!trimmed) { setError('Paste a Notice ID or SAM.gov URL.'); return; }

    const parsedFromUrl = trimmed.includes('sam.gov');
    // A handed-off notice is never the example, even though the state flip
    // that clears isExample has not flushed yet when this runs from the effect.
    track('public_analyzer_input_submitted', { parsed_from_url: parsedFromUrl, example: source === 'list' ? false : isExample, source });

    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/public/analyze`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ input: trimmed, mode: 'public_general' }),
      });
      const body = await res.json().catch(() => ({}));

      if (res.status === 429) {
        setRateLimited(true);
        setError("You've used your 3 free analyses this hour. A free account removes the wait.");
        track('public_analyzer_rate_limit_hit');
        setLoading(false);
        return;
      }
      if (res.status === 400 || body?.error === 'invalid_input') {
        setError('Invalid Notice ID or URL. Try a 32-character hex ID or a full sam.gov/opp/… URL.');
        track('public_analyzer_invalid_input');
        setLoading(false);
        return;
      }
      if (res.status === 404 || body?.error === 'not_found') {
        setError("We couldn't find that notice. Check the ID and try again.");
        track('public_analyzer_notice_not_found');
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const data = body as AnalysisResult;
      const defaultKey = data.defaultProfile || data.profileMeta?.[0]?.key || 'it_software';
      // Guard the response contract: without usable profile scores the result
      // section renders nothing, so surface a recoverable error instead.
      if (!data.profiles || !data.profiles[defaultKey]) {
        setError("We analyzed the notice but couldn't produce a score. Please try again.");
        setLoading(false);
        return;
      }
      setResult(data);
      // What the visitor sees first — the list's sample business on a handoff.
      const shownKey = source === 'list' && data.profiles[handoffProfile] ? handoffProfile : defaultKey;
      setSelectedProfile(shownKey);
      setLoading(false);

      const defScore = data.profiles?.[shownKey]?.match_score ?? 0;
      const scoreBand = defScore >= 70 ? 'high' : defScore >= 40 ? 'medium' : 'low';
      track('public_analyzer_result_rendered', {
        notice_id:      data.noticeId,
        recommendation: data.profiles?.[shownKey]?.recommendation,
        profile:        shownKey,
        score_band:     scoreBand,
        parsed_from_url: parsedFromUrl,
        source,
      });
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
      setLoading(false);
    }
  }


  // The sample-output preview exists only to explain the tool before the first
  // click. Once a real analysis is running or rendered, it unmounts so the screen
  // never shows an illustrative verdict beside a real one.
  const showPreview = !loading && !result;

  return (
    <>
      <Helmet>
        <title>Free SAM.gov Notice Analyzer — HE Pursuit</title>
        <meta name="description" content="Paste any SAM.gov Notice ID or URL for an instant screening read — match score, gaps, and top decision factors. Free, no account required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/tools/sam-gov-notice-analyzer" />
        <meta property="og:title" content="Free SAM.gov Notice Analyzer — HE Pursuit" />
        <meta property="og:description" content="Paste any SAM.gov Notice ID and get an instant screening read — match score, gaps, and top decision factors — in seconds." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free SAM.gov Notice Analyzer — HE Pursuit" />
        <meta name="twitter:description" content="Instant screening read for any SAM.gov notice — match score, gaps, decision factors. Free, no signup required." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
      </Helmet>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-6 pb-6 lg:pb-10 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
        <div className={showPreview ? 'grid grid-cols-1 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] items-start gap-8' : ''}>
        <div className={showPreview ? 'min-w-0' : ''}>
          <p className="text-xs font-medium text-[#a0b2c8] font-body mb-3"><span className="text-[#00c3ff]">Free</span> tool · No account required</p>

          <h1 className="font-headline font-black text-5xl md:text-6xl lg:text-[56px] lg:leading-[1.04] text-white mb-5 tracking-tighter leading-tight">
            Analyze a SAM.gov notice{' '}
            <span className="text-[#00c3ff] whitespace-nowrap">in seconds.</span>
          </h1>

          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body mb-8 max-w-2xl">
            Paste a live SAM.gov notice to get a free score, verdict, and explanation. Start with a sample business, or create a free profile for a score based on your company.
          </p>

          {/* ── Input card ───────────────────────────────────────────────── */}
          <form
            onSubmit={handleAnalyze}
            className="rounded-xl bg-[#0b1120] border border-[#1e2d4a] p-5"
            noValidate
          >
            <label htmlFor="notice-input" className="block text-xs font-semibold text-[#a0b2c8] font-label">
              SAM.gov notice URL
            </label>
            {isExample && (
              <p className="text-xs text-[#a0b2c8] font-body mt-1 mb-2">Live example: <span className="text-white">{sampleResult ? exampleLabel(sampleResult) : 'a SAM.gov notice, refreshed daily'}</span></p>
            )}
            {!isExample && <div className="mb-2" />}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b9bb4] pointer-events-none" strokeWidth={2} />
                <input
                  id="notice-input"
                  type="text"
                  value={input}
                  onChange={e => { setInput(e.target.value); if (isExample) setIsExample(false); }}
                  onFocus={e => { if (isExample) e.currentTarget.select(); }}
                  placeholder="Paste SAM.gov Notice ID or URL"
                  autoComplete="off"
                  title={input}
                  aria-label={`SAM.gov notice URL: ${input}`}
                  className={`w-full bg-[#060e1c] border border-[#1e2d4a] rounded-lg pl-11 pr-4 py-3.5 truncate focus:outline-none focus:border-[#00c3ff]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] transition-colors placeholder:text-[#8b9bb4] ${isExample ? 'text-xs font-mono text-[#8b9bb4]' : 'text-sm text-white'}`}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3.5 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Analyzing…</>
                ) : (
                  <>{isExample ? 'Analyze example' : 'Analyze notice'}<ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
            {isExample ? (
              <p className="mt-3">
                <button
                  type="button"
                  onClick={() => { const el = document.getElementById('notice-input') as HTMLInputElement | null; el?.focus(); el?.select(); }}
                  className="text-sm text-[#67e8f9] hover:text-white transition-colors font-body"
                >
                  Paste your own notice URL instead.
                </button>
              </p>
            ) : (
              <p className="text-sm text-[#8b9bb4] font-body mt-3">
                {input.trim() ? 'Ready to analyze this SAM.gov notice.' : 'Paste the full SAM.gov URL, or the 32-character Notice ID from any opportunity page.'}
              </p>
            )}

            {error && !loading && (
              <div role="alert" className="mt-4 flex items-start gap-3 rounded-xl border border-[#1e2d4a] bg-[#0b1120] p-4">
                <div className="relative shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                  <div className={`absolute inset-0 blur-sm rounded-full opacity-25 ${rateLimited ? 'bg-[#00c3ff]' : 'bg-[#f87171]'}`} />
                  <AlertCircle className={`w-4 h-4 relative z-10 ${rateLimited ? 'text-[#00c3ff]' : 'text-[#f87171]'}`} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white font-body">{error}</p>
                  {rateLimited && (
                    <Link
                      to="/signup/?promo=fall2026"
                      className="inline-flex items-center gap-1.5 mt-2.5 px-4 py-1.5 border border-[#00c3ff]/60 text-[#00c3ff] text-sm font-bold rounded-lg hover:bg-[#00c3ff]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
                    >
                      Start free <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </form>

          {/* ── Trust cues: mechanism, not social proof ──────────────────── */}
          <ul className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2 mt-4">
            {([
              { Icon: Search,      text: 'Pulls the live notice from SAM.gov' },
              { Icon: ShieldCheck, text: 'Uses Honest Echo’s pursuit-fit scoring model' },
              { Icon: BarChart2,   text: 'Shows the score breakdown and reasons' },
            ] as const).map(({ Icon: CueIcon, text }) => (
              <li key={text} className="flex items-center gap-2 text-sm text-[#8b9bb4] font-body">
                <CueIcon size={15} className="text-[#00c3ff] shrink-0" strokeWidth={2} />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {showPreview && (() => {
          // The real card needs room: below 1280 the hero column is narrow enough
          // that its agency chip, band reason and evidence rows all clamp. So the
          // live card renders at xl+, and 1024-1279 gets the compact structural
          // preview instead. (1280 is also where max-w-7xl caps, so the xl column
          // width is identical at 1280, 1440 and 1920.)
          const structural = (
            <>
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <span className="text-xs font-semibold uppercase tracking-[.06em] text-[#8b9bb4] font-label">
                  Example result
                </span>
                <span className="text-xs text-[#8b9bb4] font-body">Every notice returns this</span>
              </div>
              <AnalyzerOutputPreview />
            </>
          );

          const live = sampleResult && (
            <>
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <span className="text-xs font-semibold uppercase tracking-[.06em] text-[#8b9bb4] font-label">
                  Live example result
                </span>
                <span className="text-xs text-[#8b9bb4] font-body">Refreshed daily</span>
              </div>
              <AnalyzerOpportunityCard
                variant="preview"
                opportunity={{
                  noticeId: sampleResult.noticeId,
                  title:    sampleResult.title,
                  agency:   sampleResult.agency,
                  naics:    sampleResult.naics,
                  setAside: sampleResult.setAside,
                  dueDate:  sampleResult.dueDate,
                  maturity: sampleResult.maturity,
                }}
                score={sampleResult.profiles[sampleResult.defaultProfile]}
              />
              <p className="mt-3 text-sm text-[#8b9bb4] font-body leading-relaxed">
                Scored against the{' '}
                <span className="text-white font-semibold">
                  {sampleResult.profileMeta?.find(m => m.key === sampleResult.defaultProfile)?.label || 'sample'}
                </span>{' '}
                sample profile. Paste your own notice above to run it live.
              </p>
            </>
          );

          return (
            <div className="hidden lg:block min-w-0">
              {live ? (
                <>
                  <div className="hidden xl:block">{live}</div>
                  <div className="xl:hidden">{structural}</div>
                </>
              ) : structural}
            </div>
          );
        })()}

        </div>
        </div>
      </section>

      {/* ── Result ─────────────────────────────────────────────────────────── */}
      {(loading || result) && (
        <section ref={resultRef} className="pb-6 px-6 relative scroll-mt-24">
          <div className="max-w-7xl mx-auto relative z-10">

            {loading && !result && <ResultSkeleton />}

            {result && (() => {
              const meta = result.profileMeta || [];
              // Always resolve to a profile that actually has a score (guards against
              // a partial backend result where the requested/default key is missing).
              const activeKey = result.profiles?.[selectedProfile]
                ? selectedProfile
                : result.profiles?.[result.defaultProfile]
                ? result.defaultProfile
                : Object.keys(result.profiles || {})[0] || '';
              const sel = result.profiles?.[activeKey];
              if (!sel) return null;

              const opportunity = {
                noticeId: result.noticeId,
                title:    result.title,
                agency:   result.agency,
                naics:    result.naics,
                setAside: result.setAside,
                dueDate:  result.dueDate,
                maturity: result.maturity,
              };

              const personaSelect = (
                <select
                  id="persona-select"
                  value={activeKey}
                  onChange={e => {
                    setSelectedProfile(e.target.value);
                    track('public_analyzer_profile_changed', { notice_id: result.noticeId, profile: e.target.value });
                  }}
                  className="h-9 w-full bg-[#060e1c] border border-[#1e2d4a] text-white text-sm font-body rounded-md px-2.5 pr-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
                >
                  {meta.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
                </select>
              );

              return (
                <>
                  <AnalyzerOpportunityCard
                    opportunity={opportunity}
                    score={sel}
                    summary={result.summary}
                    comparedWith={meta.find(m => m.key === activeKey)?.label}
                    onTrack={event => track(event, { notice_id: result.noticeId, profile: activeKey })}
                  />

                  {/* ── Sample business used for this score ── */}
                  <div className="rounded-xl bg-[#0b1120] border border-[#1e2d4a] p-4 md:p-5 mt-5">
                    <div className="grid grid-cols-1 md:grid-cols-[352px_minmax(0,1fr)] gap-x-8 gap-y-3 md:items-center">
                      <div>
                        <label htmlFor="persona-select" className="block text-xs font-medium text-[#8b9bb4] font-body mb-1.5">Sample business profile</label>
                        {personaSelect}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-[#a0b2c8] font-body leading-relaxed">Choose another sample to recalculate this result.</p>
                        <p className="text-sm text-[#8b9bb4] font-body leading-relaxed mt-0.5">{meta.find(m => m.key === activeKey)?.blurb}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#64748b] font-body mt-3">Treat this as a first screen, not an eligibility decision.</p>
                  </div>
                </>
              );
            })()}
          </div>
        </section>
      )}

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="py-16 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="font-headline font-black text-2xl md:text-3xl text-white mb-2 tracking-tight">
            How the analyzer works
          </h2>
          <p className="text-[#a0b2c8] font-body mb-8 max-w-2xl text-sm md:text-base leading-relaxed">
            See whether a notice is worth a closer look. Use a sample profile for a quick screen, or create
            your own for a result based on your business.
          </p>

          <div className="rounded-xl border border-[#1e2d4a]/80 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1e2d4a]/80">
            {([
              {
                Icon: Search,
                title: 'Instant notice lookup',
                body: 'Pulls the live notice from SAM.gov — agency, deadline, NAICS, set-aside, and the full description.',
              },
              {
                Icon: ShieldCheck,
                title: 'A quick bid/no-bid read',
                body: 'See GO, CONDITIONAL GO, or NO-BID, plus the factors behind the result. Example scores use the sample business you select.',
              },
              {
                Icon: FileText,
                title: 'No account needed',
                body: 'Analyze up to three notices per hour without an account. Create a free profile for more analyses and scores based on your business.',
              },
            ] as const).map(({ Icon: CardIcon, title, body }) => (
              <div key={title} className="px-6 py-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <CardIcon size={16} className="text-[#00c3ff] shrink-0" strokeWidth={2} />
                  <h3 className="font-headline font-bold text-white text-base">{title}</h3>
                </div>
                <p className="text-sm text-[#a0b2c8] font-body leading-6">{body}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-[#8b9bb4] font-body leading-6 max-w-3xl">
            <span className="text-white font-semibold">How scoring works. </span>
            The score considers capability, keywords, set-aside, agency, and timing. It is a first screen,
            not an eligibility decision.
          </p>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <FAQPageSchema items={ANALYZER_FAQ} />
      <section className="pb-16 px-6 relative" aria-label="Frequently asked questions">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="font-headline font-black text-2xl md:text-3xl text-white mb-6 tracking-tight">
            Common questions
          </h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-12 border-t border-[#1e2d4a]/80">
            {ANALYZER_FAQ.map(({ q, a }, i) => (
              <div key={q} className={`py-5 border-b border-[#1e2d4a]/80 ${i === ANALYZER_FAQ.length - 1 ? 'md:col-span-2 md:max-w-2xl' : ''}`}>
                <dt className="text-white font-semibold font-headline text-base mb-1.5">{q}</dt>
                <dd className="text-sm text-[#a0b2c8] font-body leading-6">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <section className="pb-16 px-6 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10 rounded-xl border border-[#1e2d4a] bg-[#0b1120] px-6 py-7">
          <h2 className="font-headline font-black text-2xl md:text-3xl text-white mb-3 tracking-tight">
            See how this notice fits your business.
          </h2>
          <p className="text-[#a0b2c8] font-body mb-5 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Create a free profile to score notices against your capabilities, NAICS codes, certifications, and past performance.
          </p>
          <Link
            to="/signup/?promo=fall2026"
            className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-[#00c3ff]/70 text-[#00c3ff] font-bold rounded-lg hover:bg-[#00c3ff]/10 transition-colors"
          >
            Create a free profile
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
