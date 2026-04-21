import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  Search,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Sparkles,
  FileText,
  ShieldCheck,
  Building2,
  Calendar,
  Tag,
  Lock,
  ChevronRight,
} from 'lucide-react';

// ── API ───────────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'https://he-pursuit-api.onrender.com/api';

// ── Types ─────────────────────────────────────────────────────────────────────

type Recommendation = 'GO' | 'CONDITIONAL_GO' | 'NO_BID';

interface AnalysisResult {
  noticeId: string;
  title: string;
  agency: string;
  dueDate: string | null;
  score: number;
  recommendation: Recommendation;
  drivers: string[];
  summary: string;
  setAside?: string;
  naics?: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

const REC_CONFIG: Record<Recommendation, { label: string; color: string; bg: string; border: string; glow: string }> = {
  GO: {
    label: 'GO',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/40',
    glow: 'shadow-[0_0_40px_rgba(16,185,129,0.12)]',
  },
  CONDITIONAL_GO: {
    label: 'CONDITIONAL GO',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/40',
    glow: 'shadow-[0_0_40px_rgba(245,158,11,0.10)]',
  },
  NO_BID: {
    label: 'NO-BID',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/40',
    glow: 'shadow-[0_0_40px_rgba(239,68,68,0.10)]',
  },
};

const REC_ICON: Record<Recommendation, typeof CheckCircle2> = {
  GO: CheckCircle2,
  CONDITIONAL_GO: AlertTriangle,
  NO_BID: XCircle,
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ResultSkeleton() {
  return (
    <div className="rounded-2xl bg-[rgba(11,17,32,0.55)] backdrop-blur-[16px] backdrop-saturate-[140%] border border-[rgba(255,255,255,0.06)] p-6 md:p-8 shadow-2xl animate-pulse">
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
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<AnalysisResult | null>(null);
  const [error, setError]       = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  async function handleAnalyze(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setRateLimited(false);
    setResult(null);

    const trimmed = input.trim();
    if (!trimmed) { setError('Paste a Notice ID or SAM.gov URL.'); return; }

    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/public/analyze`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ input: trimmed }),
      });
      const body = await res.json().catch(() => ({}));

      if (res.status === 429) {
        setRateLimited(true);
        setError("You've hit the free analysis limit. Sign up free to keep going — no credit card required.");
        setLoading(false);
        return;
      }
      if (res.status === 400 || body?.error === 'invalid_input') {
        setError('Invalid Notice ID or URL. Try a 32-character hex ID or a full sam.gov/opp/… URL.');
        setLoading(false);
        return;
      }
      if (res.status === 404 || body?.error === 'not_found') {
        setError("We couldn't find that notice on SAM.gov. Check the ID and try again.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("Something went wrong. Please try again in a moment.");
        setLoading(false);
        return;
      }

      setResult(body as AnalysisResult);
      setLoading(false);
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
      setLoading(false);
    }
  }

  const cfg  = result ? (REC_CONFIG[result.recommendation] ?? REC_CONFIG.CONDITIONAL_GO) : null;
  const Icon = result ? (REC_ICON[result.recommendation]   ?? AlertTriangle) : null;

  return (
    <>
      <Helmet>
        <title>Free SAM.gov Notice Analyzer — HE Pursuit</title>
        <meta name="description" content="Paste any SAM.gov Notice ID or URL. Get an instant bid/no-bid recommendation, match score, and top decision factors in seconds. Free, no account required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/tools/sam-gov-notice-analyzer" />
        <meta property="og:title" content="Free SAM.gov Notice Analyzer — HE Pursuit" />
        <meta property="og:description" content="Paste any SAM.gov Notice ID and get an instant bid/no-bid recommendation, match score, and top decision factors in seconds." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free SAM.gov Notice Analyzer — HE Pursuit" />
        <meta name="twitter:description" content="Instant bid/no-bid recommendation for any SAM.gov notice. Free, no signup required." />
      </Helmet>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-16 pb-10 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
            <Sparkles className="w-3 h-3 text-[#00c3ff]" />
            <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">
              Free tool · No account required
            </span>
          </div>

          <h1 className="font-headline font-black text-5xl md:text-6xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            Should you bid on this?{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c3ff] to-[#5b8cff]">
              Find out in 60 seconds.
            </span>
          </h1>

          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body mb-8 max-w-2xl">
            Paste a Notice ID or SAM.gov URL. Get a match score, bid/no-bid recommendation, and the
            top factors driving the decision — before you spend another minute on it.
          </p>

          {/* ── Input card ───────────────────────────────────────────────── */}
          <form
            onSubmit={handleAnalyze}
            className="rounded-2xl bg-[rgba(11,17,32,0.55)] backdrop-blur-[16px] backdrop-saturate-[140%] border border-[rgba(255,255,255,0.06)] p-5 md:p-6 shadow-2xl"
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
                  placeholder="Paste Notice ID or sam.gov/opp/… URL"
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
              3 free analyses per hour · Results cached 24 hours · No account needed
            </p>

            {error && !loading && (
              <div className={`mt-4 flex items-start gap-3 rounded-lg border p-3.5 ${rateLimited ? 'border-amber-500/40 bg-amber-500/10' : 'border-red-500/40 bg-red-500/10'}`}>
                <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${rateLimited ? 'text-amber-400' : 'text-red-400'}`} strokeWidth={2} />
                <div className="flex-1">
                  <p className="text-sm text-white font-body">{error}</p>
                  {rateLimited && (
                    <Link to="/signup" className="inline-flex items-center gap-1.5 mt-2 text-sm font-bold text-[#00c3ff] hover:text-white transition-colors">
                      Start free <ArrowRight className="w-3.5 h-3.5" />
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
          <div className="max-w-4xl mx-auto relative z-10 flex flex-col gap-4">

            {loading && !result && <ResultSkeleton />}

            {result && cfg && Icon && (
              <>
                {/* SECTION 1+2 — Decision + Drivers */}
                <div className={`rounded-2xl bg-[#0b1120] border ${cfg.border} p-6 md:p-8 shadow-2xl ${cfg.glow}`}>

                  {/* Title / agency */}
                  <p className="text-[10px] font-bold uppercase tracking-widest font-label text-[#8b9bb4] mb-1.5">
                    {result.agency || 'Agency not stated'}
                  </p>
                  <h2 className="font-headline font-black text-xl md:text-2xl text-white mb-6 tracking-tight leading-tight">
                    {result.title || 'Untitled notice'}
                  </h2>

                  {/* Score + Recommendation + Summary */}
                  <div className="flex items-start gap-5 flex-wrap">
                    <div className="text-center shrink-0 min-w-[64px]">
                      <div className={`text-5xl font-black ${cfg.color} font-headline leading-none tabular-nums`}>
                        {result.score}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4] mt-1">% Match</div>
                    </div>

                    <div className="hidden sm:block w-px h-14 bg-[#1e2d4a] shrink-0" />

                    <div className="flex-1 min-w-[200px]">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${cfg.bg} ${cfg.border} mb-2`}>
                        <Icon size={12} className={cfg.color} strokeWidth={2.5} />
                        <span className={`text-xs font-bold uppercase tracking-widest font-label ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-sm text-[#a0b2c8] font-body leading-relaxed">{result.summary}</p>
                    </div>
                  </div>

                  {/* Divider → Drivers */}
                  {result.drivers.length > 0 && (
                    <div className="border-t border-[#1e2d4a] mt-6 pt-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest font-label text-[#8b9bb4] mb-3">
                        Why this recommendation
                      </p>
                      <div className="flex flex-col gap-2.5 mb-3">
                        {result.drivers.map((driver, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded bg-[#0A1D3A] border border-[#1e2d4a] flex items-center justify-center text-[10px] font-bold text-[#4a7ab5] shrink-0">
                              {i + 1}
                            </div>
                            <span className="text-sm text-[#a0b2c8] font-body">{driver}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-[#4a7ab5] font-body">
                        These factors determine whether an opportunity is worth pursuing.
                      </p>
                    </div>
                  )}
                </div>

                {/* SECTION 3 — Key Signals */}
                <div className="rounded-2xl bg-[rgba(11,17,32,0.55)] backdrop-blur-[16px] backdrop-saturate-[140%] border border-[rgba(255,255,255,0.06)] px-6 py-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest font-label text-[#8b9bb4] mb-4">
                    Key Signals
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {([
                      { Icon: Building2,  label: 'Agency',    value: result.agency   || '—' },
                      { Icon: Calendar,   label: 'Due Date',  value: result.dueDate  || '—' },
                      { Icon: ShieldCheck,label: 'Set-Aside', value: result.setAside || '—' },
                      { Icon: Tag,        label: 'NAICS',     value: result.naics    || '—' },
                    ] as const).map(({ Icon: FieldIcon, label, value }) => (
                      <div key={label}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <FieldIcon size={11} className="text-[#00c3ff]" strokeWidth={2} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4] font-label">{label}</span>
                        </div>
                        <div className="text-sm text-white font-body">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 4 — Locked Insight */}
                <div className="rounded-2xl border border-[#1e2d4a] overflow-hidden relative">

                  {/* Blurred preview rows */}
                  <div className="bg-[#0b1120] p-6 blur-[3px] select-none pointer-events-none">
                    <p className="text-[10px] font-bold uppercase tracking-widest font-label text-[#8b9bb4] mb-4">
                      Full Qualification Analysis
                    </p>
                    <div className="flex flex-col gap-3">
                      {[
                        { label: 'Eligibility Check',  badge: '❌  Potential Issue',   cls: 'text-red-400 bg-red-500/10 border-red-500/30' },
                        { label: 'Disqualifiers',       badge: '⚠️  2 Flags Detected', cls: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
                        { label: 'Requirements',        badge: '📄  Extracted',         cls: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
                      ].map(({ label, badge, cls }) => (
                        <div key={label} className="flex items-center justify-between p-3 rounded-lg bg-[#060f1e] border border-[#1e2d4a]">
                          <span className="text-sm text-[#a0b2c8] font-body">{label}</span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cls}`}>{badge}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120]/50 via-[#0b1120]/88 to-[#0b1120] flex flex-col items-center justify-center px-6 py-8 text-center">

                    <div className="w-10 h-10 rounded-xl bg-[#00c3ff]/10 border border-[#00c3ff]/30 flex items-center justify-center mb-4">
                      <Lock size={18} className="text-[#00c3ff]" strokeWidth={2} />
                    </div>

                    <h3 className="font-headline font-black text-white text-xl tracking-tight mb-2">
                      This opportunity has deeper qualification risks
                    </h3>
                    <p className="text-sm text-[#8b9bb4] font-body mb-3">Unlock full analysis to see:</p>

                    <ul className="text-sm text-[#a0b2c8] font-body mb-6 space-y-1.5 text-left">
                      {[
                        'Eligibility risks that could disqualify your bid',
                        'Missing requirements that impact your chances',
                        'Effort vs. return analysis before you commit',
                      ].map(item => (
                        <li key={item} className="flex items-center gap-2">
                          <ChevronRight size={12} className="text-[#00c3ff] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <Link
                      to="/signup"
                      className="w-full max-w-sm px-6 py-3.5 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_30px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-3"
                    >
                      Create Free Account to Unlock Full Analysis
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <a
                      href="https://pursuit.honestecho.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#8b9bb4] hover:text-white transition-colors font-body mb-4"
                    >
                      Already have an account? Sign in
                    </a>

                    <p className="text-xs text-[#4a7ab5] font-body">
                      Takes less than 30 seconds. No credit card required.
                    </p>
                  </div>
                </div>

                {/* What happens next? */}
                <div className="rounded-xl bg-[#060e1c] border border-[#1e2d4a] px-6 py-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#4a7ab5] font-label mb-1">
                    What happens next?
                  </p>
                  <p className="text-sm text-[#a0b2c8] font-body leading-relaxed">
                    If you unlock full analysis, you'll see whether this opportunity is truly worth pursuing before committing proposal resources.
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-3 tracking-tight">
            What this tool does — and what it doesn't.
          </h2>
          <p className="text-[#a0b2c8] font-body mb-10 max-w-2xl">
            This is a public preview of HE Pursuit's Phase 1 qualification. It gives a fast,
            decision-ready read on any SAM.gov notice. The full workflow adds eligibility, strategic
            fit, effort scoring, and a final bid/no-bid recommendation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {([
              {
                Icon: Search,
                title: 'Instant notice lookup',
                body: 'We pull the live notice from SAM.gov and extract agency, deadline, NAICS, set-aside, and the full opportunity description.',
              },
              {
                Icon: ShieldCheck,
                title: 'Bid/no-bid decision',
                body: 'You get a GO, CONDITIONAL GO, or NO-BID recommendation — with the specific factors driving it — in plain language.',
              },
              {
                Icon: FileText,
                title: 'No account needed',
                body: 'Free and anonymous. Limited to a few analyses per hour. Upgrade any time to run unlimited pursuits across your full pipeline.',
              },
            ] as const).map(({ Icon: CardIcon, title, body }) => (
              <div
                key={title}
                className="rounded-xl bg-[rgba(11,17,32,0.55)] backdrop-blur-[16px] backdrop-saturate-[140%] border border-[rgba(255,255,255,0.06)] p-6 hover:border-[#00c3ff]/40 transition-colors group"
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
        <div className="max-w-3xl mx-auto text-center relative z-10">
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
