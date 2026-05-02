import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  Search,
  AlertCircle,
  Loader2,
  Sparkles,
  FileText,
  ShieldCheck,
  Lock,
  ChevronRight,
  Info,
  BarChart2,
  Download,
  Cpu,
} from 'lucide-react';
import AnalyzerOpportunityCard from '../components/AnalyzerOpportunityCard';

// ── API ───────────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'https://he-pursuit-api.onrender.com/api';

// ── Analytics ─────────────────────────────────────────────────────────────────

const ANALYTICS_API = 'https://he-pursuit-api.onrender.com/api/analytics/track';

function getAnonId(): string {
  const KEY = 'he_anon_id';
  try {
    let id = localStorage.getItem(KEY);
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(KEY, id); }
    return id;
  } catch { return 'unknown'; }
}

function track(event: string, props: Record<string, unknown> = {}) {
  if (import.meta.env.DEV) { console.debug('[analytics]', event, props); return; }
  try {
    fetch(ANALYTICS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: [{ event_name: event, anonymous_id: getAnonId(), page: window.location.pathname, properties: props, source: 'website' }] }),
      keepalive: true,
    }).catch(() => {});
  } catch { /* non-fatal */ }
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Recommendation = 'GO' | 'CONDITIONAL_GO' | 'NO_BID';

interface AnalysisResult {
  mode: string;
  noticeId: string;
  title: string;
  agency: string;
  dueDate: string | null;
  setAside: string | null;
  naics: string | null;
  score: number;
  recommendation: Recommendation;
  drivers: string[];
  summary: string;
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SamGovNoticeAnalyzer() {
  const [input, setInput]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [result, setResult]           = useState<AnalysisResult | null>(null);
  const [error, setError]             = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  useEffect(() => { track('public_analyzer_page_viewed'); }, []);

  async function handleAnalyze(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setRateLimited(false);
    setResult(null);

    const trimmed = input.trim();
    if (!trimmed) { setError('Paste a Notice ID or SAM.gov URL.'); return; }

    const parsedFromUrl = trimmed.includes('sam.gov');
    track('public_analyzer_input_submitted', { parsed_from_url: parsedFromUrl });

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
        setError("You've reached the public analysis limit. Create a free account to continue.");
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
      setResult(data);
      setLoading(false);

      const scoreBand = data.score >= 70 ? 'high' : data.score >= 40 ? 'medium' : 'low';
      track('public_analyzer_result_rendered', {
        notice_id:      data.noticeId,
        recommendation: data.recommendation,
        score_band:     scoreBand,
        parsed_from_url: parsedFromUrl,
      });
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
      setLoading(false);
    }
  }


  return (
    <>
      <Helmet>
        <title>Free SAM.gov Notice Analyzer — HE Pursuit</title>
        <meta name="description" content="Paste any SAM.gov Notice ID or URL. Get an instant bid/no-bid recommendation, match score, and top decision factors in seconds. Free, no account required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/tools/sam-gov-notice-analyzer" />
        <meta property="og:title" content="Free SAM.gov Notice Analyzer — HE Pursuit" />
        <meta property="og:description" content="Paste any SAM.gov Notice ID and get an instant bid/no-bid recommendation, match score, and top decision factors in seconds." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free SAM.gov Notice Analyzer — HE Pursuit" />
        <meta name="twitter:description" content="Instant bid/no-bid recommendation for any SAM.gov notice. Free, no signup required." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
      </Helmet>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-10 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
            <Sparkles className="w-3 h-3 text-[#00c3ff]" />
            <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">
              Free tool · No account required
            </span>
          </div>

          <h1 className="font-headline font-black text-5xl md:text-6xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            Analyze a SAM.gov Notice{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c3ff] to-[#5b8cff]">
              in Seconds.
            </span>
          </h1>

          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body mb-8 max-w-2xl">
            Get a general assessment first. Add your company profile for a personalized bid/no-bid evaluation.
          </p>

          {/* ── Input card ───────────────────────────────────────────────── */}
          <form
            onSubmit={handleAnalyze}
            className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] p-5 md:p-6 shadow-2xl"
            noValidate
          >
            <label className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-2 font-label">
              SAM.gov Notice ID or URL
            </label>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b9bb4] pointer-events-none" strokeWidth={2} />
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Paste SAM.gov Notice ID or URL"
                  autoComplete="off"
                  className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors placeholder:text-[#8b9bb4]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3.5 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Analyzing…</>
                ) : (
                  <>Analyze<ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
            <p className="text-xs text-[#8b9bb4] font-body mt-3">
              No login required for an initial assessment.
            </p>

            {error && !loading && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#1e2d4a] bg-[#0b1120] p-4">
                <div className="relative shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                  <div className={`absolute inset-0 blur-sm rounded-full opacity-25 ${rateLimited ? 'bg-[#00c3ff]' : 'bg-[#f87171]'}`} />
                  <AlertCircle className={`w-4 h-4 relative z-10 ${rateLimited ? 'text-[#00c3ff]' : 'text-[#f87171]'}`} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white font-body">{error}</p>
                  {rateLimited && (
                    <Link
                      to="/signup"
                      className="inline-flex items-center gap-1.5 mt-2.5 px-4 py-1.5 bg-[#00c3ff] text-[#030B17] text-xs font-black rounded-lg shadow-[0_0_20px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Start free <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ── Result ─────────────────────────────────────────────────────────── */}
      {(loading || result) && (
        <section className="pb-6 px-6 relative">
          <div className="max-w-[960px] mx-auto relative z-10">

            {loading && !result && <ResultSkeleton />}

            {result && (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-stretch">

                {/* ── Left: Opportunity card ───────────────────────────────── */}
                <div className="flex flex-col">
                  <AnalyzerOpportunityCard
                    result={result}
                    onTrack={event => track(event, { notice_id: result.noticeId })}
                  />
                </div>

                {/* ── Right: What Happened panel ───────────────────────────── */}
                <div className="flex flex-col h-full">
                  <div className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] shadow-2xl overflow-hidden flex flex-col h-full">

                    {/* Header */}
                    <div className="px-5 pt-5 pb-4 border-b border-[#1e2d4a]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/30 flex items-center justify-center shrink-0">
                          <Info size={11} className="text-[#00c3ff]" strokeWidth={2.5} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#00c3ff] font-label">What Happened</span>
                      </div>
                      <p className="text-sm text-[#a0b2c8] font-body leading-relaxed">
                        We analyzed this opportunity using open source data from SAM.gov and applied our initial evaluation model.
                      </p>
                    </div>

                    {/* Steps */}
                    <div className="px-5 py-4 flex-1 flex flex-col justify-between gap-3">
                      {([
                        { Icon: Download,   title: 'Notice Data Extracted',  body: 'We pulled key details including requirements, timeline, NAICS codes, and set-aside information.' },
                        { Icon: Cpu,        title: 'Initial Evaluation Run', body: 'Our algorithm compared this opportunity against thousands of government patterns and best practices.' },
                        { Icon: BarChart2,  title: 'Score Calculation',      body: 'We scored the opportunity across core factors that influence bid/no-bid decisions.' },
                        { Icon: ShieldCheck,title: 'Insights Generated',     body: 'We identified key strengths, potential risks, and what to review before deciding.' },
                      ] as const).map(({ Icon: StepIcon, title, body }, i) => (
                        <div key={title} className="flex items-start gap-3 group/step">
                          <div className="w-8 h-8 rounded-lg bg-[#0f1a2e] border border-[#1e2d4a] flex items-center justify-center shrink-0 relative overflow-visible">
                            <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-0 group-hover/step:opacity-20 transition-opacity duration-300 rounded-lg" />
                            <StepIcon size={14} className="text-[#00c3ff] relative z-10" strokeWidth={2} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white font-headline leading-snug">{i + 1}. {title}</p>
                            <p className="text-xs text-[#8b9bb4] font-body leading-snug mt-0.5">{body}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Unlock CTA */}
                    <div className="border-t border-[#1e2d4a]">
                      <Link
                        to="/signup"
                        onClick={() => track('public_analyzer_unlock_cta_clicked', { notice_id: result.noticeId })}
                        className="flex items-center gap-3 px-5 py-4 hover:bg-[#0f1a2e] transition-colors duration-300 group/unlock"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#00c3ff]/10 border border-[#00c3ff]/30 flex items-center justify-center shrink-0">
                          <Lock size={14} className="text-[#00c3ff]" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#00c3ff] font-headline">Unlock Full Analysis</p>
                          <p className="text-xs text-[#8b9bb4] font-body leading-snug">Create a free account to see disqualifiers, requirements, and eligibility analysis.</p>
                        </div>
                        <ChevronRight size={15} className="text-[#00c3ff] shrink-0 group-hover/unlock:translate-x-0.5 transition-transform duration-200" />
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </section>
      )}

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-3 tracking-tight">
            What this tool does — and what it doesn't.
          </h2>
          <p className="text-[#a0b2c8] font-body mb-10 max-w-2xl">
            This is a general assessment of any SAM.gov notice based on opportunity-level signals.
            It is not a personalized evaluation. The full HE Pursuit workflow adds eligibility checks,
            strategic fit, effort scoring, and a company-specific bid/no-bid recommendation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {([
              {
                Icon: Search,
                title: 'Instant notice lookup',
                body: 'Pull the live notice from SAM.gov and extract agency, deadline, NAICS, set-aside, and the full description automatically.',
              },
              {
                Icon: ShieldCheck,
                title: 'General bid/no-bid read',
                body: 'Get a GO, CONDITIONAL GO, or NO-BID signal — with the top factors driving it — based on opportunity-level signals, not your company profile.',
              },
              {
                Icon: FileText,
                title: 'No account needed',
                body: 'Free and anonymous. Limited analyses per hour. Upgrade to run unlimited pursuits with personalized analysis across your full pipeline.',
              },
            ] as const).map(({ Icon: CardIcon, title, body }) => (
              <div
                key={title}
                className="rounded-xl bg-[#0b1120] border border-[#1e2d4a] p-6 shadow-2xl hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 group"
              >
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible mb-4">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-50 transition-opacity duration-500 rounded-full scale-150" />
                  <CardIcon size={18} className="text-[#00c3ff] relative z-10" strokeWidth={2} />
                </div>
                <h3 className="font-headline font-black text-white text-lg mb-2">{title}</h3>
                <p className="text-sm text-[#a0b2c8] font-body leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-4 tracking-tight">
            Ready to run this on your whole pipeline?
          </h2>
          <p className="text-[#a0b2c8] font-body mb-8 max-w-xl mx-auto">
            Create a free account and track pursuits across all 5 phases — without paying until you
            see the value.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Start Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
