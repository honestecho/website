import { useState, useEffect } from 'react';
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
  Pause,
  Loader2,
  Sparkles,
  FileText,
  ShieldCheck,
  Building2,
  Calendar,
  Hash,
  Tag,
  ScrollText,
} from 'lucide-react';

// ── API base ─────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'https://pursuit.honestecho.com/api';

// ── Types ────────────────────────────────────────────────────────────────────

type TriageSuggestion = 'continue' | 'caution' | 'not_actionable' | 'stop';

interface AnalysisResult {
  rfi_title: string;
  issuing_agency: string;
  notice_type: string;
  rfi_reference_number: string;
  due_date: string;
  naics_codes: string;
  set_aside_indicated: string;
  purpose_of_rfi: string;
  ai_triage_suggestion: TriageSuggestion | string;
  ai_triage_reason: string;
}

// ── Triage styling helper ────────────────────────────────────────────────────

function triageStyle(suggestion: string) {
  const s = (suggestion || '').toLowerCase();
  if (s === 'continue') {
    return {
      label: 'Continue',
      Icon: CheckCircle2,
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_40px_rgba(16,185,129,0.12)]',
    };
  }
  if (s === 'caution') {
    return {
      label: 'Caution',
      Icon: AlertTriangle,
      border: 'border-amber-500/40',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_40px_rgba(245,158,11,0.10)]',
    };
  }
  if (s === 'stop') {
    return {
      label: 'Stop',
      Icon: XCircle,
      border: 'border-red-500/40',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      glow: 'shadow-[0_0_40px_rgba(239,68,68,0.10)]',
    };
  }
  // not_actionable or unknown
  return {
    label: 'Not actionable',
    Icon: Pause,
    border: 'border-[#1e2d4a]',
    bg: 'bg-[#8b9bb4]/10',
    text: 'text-[#a0b2c8]',
    glow: '',
  };
}

// ── Small field row ──────────────────────────────────────────────────────────

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  const displayed = value && value.trim() ? value : 'Not stated';
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#1e2d4a] last:border-b-0">
      <div className="w-8 h-8 flex-shrink-0 rounded-md bg-[#0d1827] border border-[#1e2d4a] flex items-center justify-center">
        <Icon size={15} className="text-[#00c3ff]" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold text-[#8b9bb4] uppercase tracking-widest font-label mb-0.5">
          {label}
        </div>
        <div className="text-sm text-white font-body break-words">{displayed}</div>
      </div>
    </div>
  );
}

// ── Result card skeleton ─────────────────────────────────────────────────────

function ResultSkeleton() {
  return (
    <div className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] p-6 md:p-8 shadow-2xl animate-pulse">
      <div className="h-6 w-24 bg-[#152033] rounded mb-4" />
      <div className="h-7 w-3/4 bg-[#152033] rounded mb-3" />
      <div className="h-4 w-1/2 bg-[#152033] rounded mb-6" />
      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#152033]" />
            <div className="h-4 bg-[#152033] rounded flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SamGovNoticeAnalyzer() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [noticeId, setNoticeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  // Email capture
  const [showEmail, setShowEmail] = useState(false);
  const [leadEmail, setLeadEmail] = useState('');
  const [leadHoneypot, setLeadHoneypot] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadLoading, setLeadLoading] = useState(false);

  // 2-second reveal of email capture after a result
  useEffect(() => {
    if (!result) {
      setShowEmail(false);
      return;
    }
    const t = setTimeout(() => setShowEmail(true), 2000);
    return () => clearTimeout(t);
  }, [result]);

  async function handleAnalyze(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setRateLimited(false);
    setResult(null);
    setNoticeId(null);
    setLeadSubmitted(false);

    const trimmed = input.trim();
    if (!trimmed) {
      setError('Paste a Notice ID or SAM.gov URL.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/public/notice-analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notice_id: trimmed }),
      });

      const body = await res.json().catch(() => ({}));

      if (res.status === 429) {
        setRateLimited(true);
        setError(
          body?.message ||
            "You've hit the free analysis limit. Sign up free to keep going — no credit card required.",
        );
        setLoading(false);
        return;
      }

      if (!res.ok || !body?.success) {
        setError(body?.message || "We couldn't analyze that notice. Try again in a moment.");
        setLoading(false);
        return;
      }

      setResult(body.result as AnalysisResult);
      // Derive a cache-friendly notice id from the input for the lead capture
      const urlMatch = trimmed.match(/sam\.gov\/opp\/([0-9a-fA-F]{20,})/);
      const hexMatch = trimmed.match(/\b([0-9a-fA-F]{32})\b/);
      setNoticeId((urlMatch?.[1] || hexMatch?.[1] || '').toLowerCase() || null);
      setLoading(false);
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.");
      setLoading(false);
    }
  }

  async function handleLead(e: FormEvent) {
    e.preventDefault();
    setLeadError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail.trim())) {
      setLeadError('Please enter a valid email address.');
      return;
    }

    setLeadLoading(true);
    try {
      const res = await fetch(`${API_BASE}/public/sandbox-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: leadEmail.trim(),
          notice_id: noticeId || undefined,
          honeypot: leadHoneypot || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setLeadError(body?.message || 'Something went wrong. Please try again.');
        setLeadLoading(false);
        return;
      }
      setLeadSubmitted(true);
      setLeadLoading(false);
    } catch {
      setLeadError("We couldn't reach the server. Try again in a moment.");
      setLeadLoading(false);
    }
  }

  const triage = result ? triageStyle(result.ai_triage_suggestion) : null;

  return (
    <>
      <Helmet>
        <title>Free SAM.gov Notice Analyzer — HE Pursuit</title>
        <meta
          name="description"
          content="Paste any SAM.gov Notice ID or URL and get an instant AI-generated triage read in 60 seconds. Free, no signup required. Powered by HE Pursuit's Phase 1 analysis."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/tools/sam-gov-notice-analyzer" />
        <meta property="og:title" content="Free SAM.gov Notice Analyzer — HE Pursuit" />
        <meta
          property="og:description"
          content="Paste any SAM.gov Notice ID and get a structured triage read — title, agency, type, set-aside, deadline, and a go/caution/stop recommendation — in 60 seconds."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free SAM.gov Notice Analyzer — HE Pursuit" />
        <meta
          name="twitter:description"
          content="Paste any SAM.gov Notice ID and get a structured triage read in 60 seconds. Free, no signup."
        />
      </Helmet>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-10 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
            <Sparkles className="w-3 h-3 text-[#00c3ff]" />
            <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">
              Free tool · No signup
            </span>
          </div>

          <h1 className="font-headline font-black text-5xl md:text-6xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            Analyze any SAM.gov notice in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c3ff] to-[#5b8cff]">
              60 seconds.
            </span>
          </h1>

          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body mb-8 max-w-2xl">
            Paste a Notice ID or SAM.gov URL. We'll pull the notice, extract the key fields, and
            give you a structured triage read — continue, caution, not actionable, or stop — so you
            can decide whether to spend another minute on it.
          </p>

          {/* ── Input card ───────────────────────────────────────────────── */}
          <form
            onSubmit={handleAnalyze}
            className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] p-5 md:p-6 shadow-2xl"
            noValidate
          >
            <label className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-2 font-label">
              SAM.gov Notice
            </label>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b9bb4] pointer-events-none"
                  strokeWidth={2}
                />
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Notice ID or SAM.gov URL"
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
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    Analyze
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-[#8b9bb4] font-body mt-3">
              Example: <span className="text-[#a0b2c8] font-mono">https://sam.gov/opp/…</span> or a
              32-character Notice ID. Results cached for 24 hours.
            </p>

            {error && !loading && (
              <div
                className={`mt-4 flex items-start gap-3 rounded-lg border p-3.5 ${
                  rateLimited
                    ? 'border-amber-500/40 bg-amber-500/10'
                    : 'border-red-500/40 bg-red-500/10'
                }`}
              >
                <AlertCircle
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    rateLimited ? 'text-amber-400' : 'text-red-400'
                  }`}
                  strokeWidth={2}
                />
                <div className="flex-1">
                  <p className="text-sm text-white font-body">{error}</p>
                  {rateLimited && (
                    <Link
                      to="/signup"
                      className="inline-flex items-center gap-1.5 mt-2 text-sm font-bold text-[#00c3ff] hover:text-white transition-colors"
                    >
                      Start free <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ── Result card ────────────────────────────────────────────────────── */}
      {(loading || result) && (
        <section className="pb-6 px-6 relative">
          <div className="max-w-4xl mx-auto relative z-10">
            {loading && !result && <ResultSkeleton />}

            {result && triage && (
              <div
                className={`rounded-2xl bg-[#0b1120] border ${triage.border} p-6 md:p-8 shadow-2xl ${triage.glow}`}
              >
                {/* Triage badge */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${triage.bg} ${triage.border} border mb-5`}
                >
                  <triage.Icon size={14} className={triage.text} strokeWidth={2.5} />
                  <span
                    className={`text-xs font-bold uppercase tracking-widest font-label ${triage.text}`}
                  >
                    {triage.label}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-headline font-black text-2xl md:text-3xl text-white mb-2 tracking-tight leading-tight">
                  {result.rfi_title || 'Untitled notice'}
                </h2>
                <p className="text-[#a0b2c8] text-sm font-body mb-6">
                  {result.issuing_agency || 'Agency not stated'}
                  {result.notice_type ? ` · ${result.notice_type}` : ''}
                </p>

                {/* Triage reason callout */}
                {result.ai_triage_reason && (
                  <div
                    className={`rounded-lg ${triage.bg} border ${triage.border} p-4 mb-6 flex items-start gap-3`}
                  >
                    <triage.Icon
                      size={16}
                      className={`${triage.text} mt-0.5 flex-shrink-0`}
                      strokeWidth={2}
                    />
                    <div>
                      <div
                        className={`text-[10px] font-bold uppercase tracking-widest font-label mb-1 ${triage.text}`}
                      >
                        AI triage reason
                      </div>
                      <p className="text-sm text-white font-body leading-relaxed">
                        {result.ai_triage_reason}
                      </p>
                    </div>
                  </div>
                )}

                {/* Structured fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <Field
                    icon={Hash}
                    label="Reference Number"
                    value={result.rfi_reference_number}
                  />
                  <Field icon={Building2} label="Issuing Agency" value={result.issuing_agency} />
                  <Field icon={FileText} label="Notice Type" value={result.notice_type} />
                  <Field icon={Calendar} label="Response Deadline" value={result.due_date} />
                  <Field icon={Tag} label="NAICS Code(s)" value={result.naics_codes} />
                  <Field
                    icon={ShieldCheck}
                    label="Set-Aside"
                    value={result.set_aside_indicated}
                  />
                </div>

                {/* Purpose */}
                {result.purpose_of_rfi && (
                  <div className="mt-6 pt-6 border-t border-[#1e2d4a]">
                    <div className="flex items-center gap-2 mb-2">
                      <ScrollText size={14} className="text-[#00c3ff]" strokeWidth={2} />
                      <span className="text-[10px] font-bold text-[#8b9bb4] uppercase tracking-widest font-label">
                        Purpose
                      </span>
                    </div>
                    <p className="text-sm text-white font-body leading-relaxed">
                      {result.purpose_of_rfi}
                    </p>
                  </div>
                )}

                {/* Upsell footer */}
                <div className="mt-7 pt-6 border-t border-[#1e2d4a] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <p className="text-xs text-[#8b9bb4] font-body max-w-md">
                    This is Phase 1 of HE Pursuit's 5-phase workflow. Sign up free to unlock
                    eligibility, strategic fit, effort scoring, and a final bid/no-bid
                    recommendation.
                  </p>
                  <Link
                    to="/signup"
                    className="px-6 py-3 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_30px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    Unlock full analysis
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Email capture (appears 2s after result) ────────────────────────── */}
      {result && showEmail && (
        <section className="pb-16 px-6 relative">
          <div className="max-w-4xl mx-auto relative z-10">
            {!leadSubmitted ? (
              <form
                onSubmit={handleLead}
                className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] p-6 md:p-7 shadow-2xl"
                noValidate
              >
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  <div className="flex-1">
                    <h3 className="font-headline font-black text-lg text-white mb-1.5 tracking-tight">
                      Want this emailed to you — plus 4 more phases?
                    </h3>
                    <p className="text-sm text-[#a0b2c8] font-body">
                      We'll send a PDF of this analysis and show you what Phase 2–5 look like. No
                      spam, unsubscribe anytime.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    {/* honeypot */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={leadHoneypot}
                      onChange={e => setLeadHoneypot(e.target.value)}
                      className="absolute -left-[9999px] w-px h-px opacity-0"
                      aria-hidden="true"
                    />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@yourcompany.com"
                      value={leadEmail}
                      onChange={e => setLeadEmail(e.target.value)}
                      className="bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors placeholder:text-[#8b9bb4] min-w-[240px]"
                    />
                    <button
                      type="submit"
                      disabled={leadLoading}
                      className="px-5 py-3 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {leadLoading ? 'Sending…' : 'Send me the PDF'}
                    </button>
                  </div>
                </div>
                {leadError && (
                  <p className="text-sm text-red-400 font-body mt-3">{leadError}</p>
                )}
              </form>
            ) : (
              <div className="rounded-2xl bg-[#0b1120] border border-[#00c3ff]/40 p-6 md:p-7 shadow-[0_0_40px_rgba(0,195,255,0.10)] flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/40 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={20} className="text-[#00c3ff]" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-headline font-black text-white text-base mb-1">
                    Got it — we'll be in touch.
                  </h3>
                  <p className="text-sm text-[#a0b2c8] font-body">
                    Check your inbox shortly. Ready to run this on your own pipeline?{' '}
                    <Link to="/signup" className="text-[#00c3ff] hover:text-white transition-colors">
                      Create a free account.
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── How it works / trust ───────────────────────────────────────────── */}
      <section className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-3 tracking-tight">
            What this tool does — and what it doesn't.
          </h2>
          <p className="text-[#a0b2c8] font-body mb-10 max-w-2xl">
            This is a public sandbox version of HE Pursuit's Phase 1 triage. It gives a fast
            structured read on any SAM.gov notice. The full workflow adds eligibility, strategic
            fit, effort scoring, and a final bid/no-bid recommendation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: 'Structured extraction',
                body: 'We pull the key fields — title, agency, type, reference number, deadline, NAICS, and set-aside — directly from the SAM.gov notice and any linked attachments.',
              },
              {
                icon: ShieldCheck,
                title: 'AI triage in 60 seconds',
                body: 'Claude reads the full description and flags whether the notice looks actionable, risky, informational-only, or not worth chasing.',
              },
              {
                icon: FileText,
                title: 'No signup, rate-limited',
                body: 'Anonymous and free. Limited to a few analyses per hour so we can keep it free for everyone. Upgrade any time to run unlimited pursuits.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl bg-[#0b1120] border border-[#1e2d4a] p-6 hover:border-[#00c3ff]/40 transition-colors"
              >
                <div className="w-11 h-11 rounded-lg bg-[#0d1827] border border-[#1e2d4a] flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#00c3ff]" strokeWidth={2} />
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
