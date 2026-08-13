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
import { FAQPageSchema } from '../components/SchemaOrg';
import { API_BASE } from '../lib/api';
import { track } from '../lib/analytics';

// ── FAQ (visible section + FAQPage schema for search/AI answer engines) ───────

const ANALYZER_FAQ = [
  {
    q: 'What is the SAM.gov Notice Analyzer?',
    a: 'A free tool that reads a live SAM.gov notice and returns a plain-English summary of what it asks for, who appears eligible to bid, and what gaps or blockers to check before committing proposal hours. No account is required.',
  },
  {
    q: 'Does it write proposals or generate FAR citations?',
    a: 'No. It analyzes notices to support bid/no-bid decisions. It does not write proposal content and it does not generate FAR citations. Verify any regulatory references against the source notice.',
  },
  {
    q: 'Can I use it on sources sought and presolicitation notices?',
    a: 'Yes. Paste any live SAM.gov notice link, including sources sought and presolicitation notices. Early-stage notices are often the best time to check fit, before the requirements harden.',
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SamGovNoticeAnalyzer() {
  const [input, setInput]             = useState(SAMPLE_NOTICE_URL);
  const [isExample, setIsExample]     = useState(true);
  const [loading, setLoading]         = useState(false);
  const [result, setResult]           = useState<AnalysisResult | null>(null);
  const [error, setError]             = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string>('it_software');

  useEffect(() => { track('public_analyzer_page_viewed'); }, []);

  // Swap the fallback pre-fill for the server's current sample pick. Only while
  // the field is still untouched — never clobber something the visitor typed.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/public/analyze/sample`);
        if (!res.ok) return;
        const j = await res.json() as { notice_id?: string };
        if (!cancelled && j.notice_id && /^[0-9a-f]{32}$/.test(j.notice_id)) {
          setInput(prev => prev === SAMPLE_NOTICE_URL ? sampleUrlFor(j.notice_id!) : prev);
        }
      } catch { /* fallback pre-fill stands */ }
    })();
    return () => { cancelled = true; };
  }, []);

  async function handleAnalyze(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setRateLimited(false);
    setResult(null);

    const trimmed = input.trim();
    if (!trimmed) { setError('Paste a Notice ID or SAM.gov URL.'); return; }

    const parsedFromUrl = trimmed.includes('sam.gov');
    track('public_analyzer_input_submitted', { parsed_from_url: parsedFromUrl, example: isExample });

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
      setSelectedProfile(defaultKey);
      setLoading(false);

      const defScore = data.profiles?.[defaultKey]?.match_score ?? 0;
      const scoreBand = defScore >= 70 ? 'high' : defScore >= 40 ? 'medium' : 'low';
      track('public_analyzer_result_rendered', {
        notice_id:      data.noticeId,
        recommendation: data.profiles?.[defaultKey]?.recommendation,
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
        <meta name="description" content="Paste any SAM.gov Notice ID or URL. Get an instant screening read — match score, gaps, and top decision factors — in seconds. Free, no account required." />
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
      <section className="pt-32 pb-10 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
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
            <label htmlFor="notice-input" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-2 font-label">
              SAM.gov Notice ID or URL
            </label>
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
                  className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#00c3ff]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] transition-colors placeholder:text-[#8b9bb4]"
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
                  <>Analyze<ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
            {isExample && (
              <p className="text-xs text-[#00c3ff] font-body mt-3 flex items-start gap-2">
                <Sparkles className="w-3 h-3 shrink-0 mt-0.5" strokeWidth={2} />
                <span>
                  <span className="font-bold">Example notice loaded</span> — a real Forest Service renovation solicitation. Hit{' '}
                  <span className="font-bold">Analyze</span> to see a live read, or{' '}
                  <button
                    type="button"
                    onClick={() => { setInput(''); setIsExample(false); document.getElementById('notice-input')?.focus(); }}
                    className="underline hover:text-white transition-colors font-semibold"
                  >
                    clear it and paste your own
                  </button>.
                </span>
              </p>
            )}
            <p className="text-xs text-[#8b9bb4] font-body mt-3">
              Find the Notice ID on any SAM.gov opportunity page — or just paste the full URL.
              No login required for an initial assessment.
            </p>

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
                      to="/signup/"
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
              const activeMeta = meta.find(m => m.key === activeKey);
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

              return (
                <>
                  {/* ── Two cards, full width, separated ─────────────────────── */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5 items-stretch">

                    {/* Left: Opportunity card (matches the in-app card) */}
                    <div className="flex flex-col">
                      <AnalyzerOpportunityCard
                        opportunity={opportunity}
                        score={sel}
                        onTrack={event => track(event, { notice_id: result.noticeId, profile: activeKey })}
                      />
                    </div>

                    {/* Right: comparison context + how-it-works + unlock */}
                    <div className="flex flex-col h-full">
                      <div className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] shadow-2xl overflow-hidden flex flex-col h-full">

                        {/* Comparison header */}
                        <div className="px-5 pt-5 pb-4 border-b border-[#1e2d4a]">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/30 flex items-center justify-center shrink-0">
                              <Info size={11} className="text-[#00c3ff]" strokeWidth={2.5} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#00c3ff] font-label">You're comparing against</span>
                          </div>
                          <p className="text-base font-black text-white font-headline mb-1">{activeMeta?.label || 'Sample business'}</p>
                          <p className="text-sm text-[#a0b2c8] font-body leading-relaxed">{activeMeta?.blurb}</p>
                          {result.summary && (
                            <p className="text-sm text-[#8b9bb4] font-body leading-relaxed mt-3 pt-3 border-t border-[#1e2d4a]">
                              {result.summary}
                            </p>
                          )}
                        </div>

                        {/* Steps */}
                        <div className="px-5 py-4 flex-1 flex flex-col justify-between gap-3">
                          {([
                            { Icon: Download,    title: 'Notice Data Extracted',  body: 'We pulled the live notice from SAM.gov — requirements, timeline, NAICS, and set-aside.' },
                            { Icon: Cpu,         title: 'Scored vs. Profile',     body: 'The same engine that powers HE Pursuit scored this notice against the selected sample profile.' },
                            { Icon: BarChart2,   title: 'Dimension Breakdown',    body: 'Every factor — capability, set-aside, agency, timing — contributes to the match score.' },
                            { Icon: ShieldCheck, title: 'Switch to See Impact',   body: 'Change the profile below to see how certifications and industry move the score.' },
                          ] as const).map(({ Icon: StepIcon, title, body }, i) => (
                            <div key={title} className="flex items-start gap-3 group/step">
                              <div className="w-8 h-8 rounded-lg bg-[#0f1a2e] border border-[#1e2d4a] flex items-center justify-center shrink-0 relative overflow-visible">
                                <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-0 group-hover/step:opacity-20 transition-opacity duration-300 rounded-lg" />
                                <StepIcon size={14} className="text-[#00c3ff] relative z-10" strokeWidth={2} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white font-headline leading-snug">{i + 1}. {title}</p>
                                <p className="text-sm text-[#8b9bb4] font-body leading-snug mt-0.5">{body}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Unlock CTA */}
                        <div className="border-t border-[#1e2d4a]">
                          <Link
                            to="/signup/?promo=fall2026"
                            onClick={() => track('public_analyzer_unlock_cta_clicked', { notice_id: result.noticeId })}
                            className="flex items-center gap-3 px-5 py-4 hover:bg-[#0f1a2e] transition-colors duration-300 group/unlock"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#00c3ff]/10 border border-[#00c3ff]/30 flex items-center justify-center shrink-0">
                              <Lock size={14} className="text-[#00c3ff]" strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[#00c3ff] font-headline">Score against your real profile</p>
                              <p className="text-sm text-[#8b9bb4] font-body leading-snug">Create a free account to score every notice against your actual NAICS, certifications, and past performance. The Fall Bid Clarity Pass gives 2 months of any paid plan free. Offer ends November 30.</p>
                            </div>
                            <ChevronRight size={15} className="text-[#00c3ff] shrink-0 group-hover/unlock:translate-x-0.5 transition-transform duration-200" />
                          </Link>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* ── Profile selector + disclosure (follows the verdict) ───── */}
                  <div className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] shadow-2xl p-4 md:p-5 mt-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/30 flex items-center justify-center shrink-0">
                        <Info size={11} className="text-[#00c3ff]" strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#00c3ff] font-label">
                        Comparing against a sample business
                      </span>
                    </div>
                    <p className="text-sm text-[#a0b2c8] font-body leading-relaxed mb-4">
                      A match score only means something against a business profile. Pick the sample profile
                      closest to your company — the score and breakdown update instantly. These are illustrative
                      profiles, <span className="text-white font-semibold">not eligibility determinations</span>.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {meta.map(m => {
                        const isActive = m.key === activeKey;
                        const pscore = result.profiles?.[m.key]?.match_score ?? 0;
                        return (
                          <button
                            key={m.key}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => {
                              setSelectedProfile(m.key);
                              track('public_analyzer_profile_changed', { notice_id: result.noticeId, profile: m.key });
                            }}
                            className={`text-left rounded-xl border p-3 transition-all duration-300 ${
                              isActive
                                ? 'border-[#00c3ff]/60 bg-[#00c3ff]/5 shadow-[0_0_24px_rgba(0,195,255,0.1)]'
                                : 'border-[#1e2d4a] bg-[#060e1c] hover:border-[#00c3ff]/30 hover:bg-[#0f1a2e]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className={`text-sm font-bold font-headline leading-tight ${isActive ? 'text-white' : 'text-[#a0b2c8]'}`}>
                                {m.label}
                              </span>
                              <span className="text-sm font-black tabular-nums shrink-0" style={{ color: isActive ? '#00c3ff' : '#8b9bb4' }}>
                                {pscore}%
                              </span>
                            </div>
                            <p className="text-sm text-[#8b9bb4] font-body leading-snug line-clamp-2">{m.blurb}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })()}
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
                body: 'Get a clear read — from Strong Go to No-Go — plus the factors behind it, based on opportunity-level signals, not your company profile.',
              },
              {
                Icon: FileText,
                title: 'No account needed',
                body: 'Free and anonymous. 3 free analyses per hour. Upgrade to run unlimited pursuits with personalized analysis across your full pipeline.',
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

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <FAQPageSchema items={ANALYZER_FAQ} />
      <section className="py-16 px-6 relative" aria-label="Frequently asked questions">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-10 tracking-tight">
            Common questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ANALYZER_FAQ.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-xl bg-[#0b1120] border border-[#1e2d4a] p-6 shadow-2xl hover:border-[#00c3ff]/30 transition-all duration-300"
              >
                <p className="text-white font-bold font-headline text-base mb-3">{q}</p>
                <p className="text-sm text-[#a0b2c8] font-body leading-relaxed">{a}</p>
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
            Create a free account to score notices against your real business profile — and upgrade
            to run full pursuits when you're ready. No credit card required.
          </p>
          <Link
            to="/signup/"
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
