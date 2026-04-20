import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  ShieldCheck,
  Gauge,
  TrendingUp,
  FileText,
  Building2,
  Calendar,
  Hash,
  Tag,
  Sparkles,
  Loader2,
  Link2Off,
  AlertCircle,
} from 'lucide-react';

// ── API base ─────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'https://pursuit.honestecho.com/api';

// ── Snapshot shape (matches api-server.js assembleShareSnapshot) ────────────

interface Snapshot {
  shared_at: string;
  company: { name: string | null };
  opportunity: {
    rfi_title: string | null;
    issuing_agency: string | null;
    notice_type: string | null;
    reference_number: string | null;
    due_date: string | null;
    naics_codes: string | null;
    set_aside: string | null;
    purpose: string | null;
  };
  phase1: { triage_status: string | null };
  phase2: {
    eligibility_status: string | null;
    disqualifier_count: number;
    disqualifier_summary: string[];
    requirement_count: number;
    top_requirement_categories: string[];
  };
  phase3: {
    strategic_value: string | null;
    strategic_total: number | null;
  };
  phase4: {
    overall_effort: string | null;
    win_probability: string | null;
    effort_total: number | null;
  };
  phase5: {
    decision: string | null;
    rationale: string | null;
  };
}

type FetchState =
  | { kind: 'loading' }
  | { kind: 'ok'; snapshot: Snapshot; createdAt: string }
  | { kind: 'error'; reason: 'not_found' | 'revoked' | 'expired' | 'rate_limited' | 'server_error' };

// ── Decision styling ─────────────────────────────────────────────────────────

function decisionStyle(decision: string | null) {
  const d = (decision || '').toUpperCase();
  if (d === 'GO') {
    return {
      label: 'Pursue',
      Icon: CheckCircle2,
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_60px_rgba(16,185,129,0.15)]',
    };
  }
  if (d === 'CONDITIONAL_GO') {
    return {
      label: 'Conditionally Pursue',
      Icon: AlertTriangle,
      border: 'border-amber-500/40',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_60px_rgba(245,158,11,0.12)]',
    };
  }
  if (d === 'WATCH') {
    return {
      label: 'Watch',
      Icon: Eye,
      border: 'border-sky-500/40',
      bg: 'bg-sky-500/10',
      text: 'text-sky-400',
      glow: 'shadow-[0_0_60px_rgba(14,165,233,0.12)]',
    };
  }
  if (d === 'NO_GO') {
    return {
      label: 'No-Go',
      Icon: XCircle,
      border: 'border-red-500/40',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      glow: 'shadow-[0_0_60px_rgba(239,68,68,0.12)]',
    };
  }
  return {
    label: 'Decision pending',
    Icon: FileText,
    border: 'border-[#1e2d4a]',
    bg: 'bg-[#8b9bb4]/10',
    text: 'text-[#a0b2c8]',
    glow: '',
  };
}

// ── Small labeled row ────────────────────────────────────────────────────────

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number | null | undefined;
}) {
  const displayed = value === null || value === undefined || value === '' ? 'Not stated' : String(value);
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

// ── Summary stat block ───────────────────────────────────────────────────────

function StatBlock({
  icon: Icon,
  label,
  value,
  sub,
  tone = 'neutral',
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string | null;
  tone?: 'neutral' | 'good' | 'warn' | 'bad';
}) {
  const toneMap = {
    neutral: 'text-[#a0b2c8]',
    good:    'text-emerald-400',
    warn:    'text-amber-400',
    bad:     'text-red-400',
  };
  return (
    <div className="rounded-xl bg-[#0b1120] border border-[#1e2d4a] p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={13} className="text-[#8b9bb4]" strokeWidth={2} />
        <span className="text-[10px] font-bold text-[#8b9bb4] uppercase tracking-widest font-label">
          {label}
        </span>
      </div>
      <p className={`text-lg font-bold font-headline leading-tight ${toneMap[tone]}`}>{value}</p>
      {sub && <p className="text-xs text-[#8b9bb4] mt-1 font-body">{sub}</p>}
    </div>
  );
}

function eligibilityTone(v: string | null): 'good' | 'warn' | 'bad' | 'neutral' {
  if (v === 'eligible') return 'good';
  if (v === 'eligible_with_caution') return 'warn';
  if (v === 'likely_disqualified') return 'bad';
  return 'neutral';
}
function eligibilityLabel(v: string | null): string {
  if (!v) return 'Not set';
  return v
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
function strategicTone(v: string | null): 'good' | 'warn' | 'bad' | 'neutral' {
  if (v === 'high') return 'good';
  if (v === 'medium') return 'warn';
  if (v === 'low') return 'bad';
  return 'neutral';
}
function effortTone(v: string | null): 'good' | 'warn' | 'bad' | 'neutral' {
  if (v === 'low') return 'good';
  if (v === 'moderate') return 'warn';
  if (v === 'high' || v === 'very_high') return 'bad';
  return 'neutral';
}
function winTone(v: string | null): 'good' | 'warn' | 'bad' | 'neutral' {
  if (v === 'high') return 'good';
  if (v === 'medium') return 'warn';
  if (v === 'low') return 'bad';
  return 'neutral';
}
function titleCase(v: string | null): string {
  if (!v) return 'Not set';
  return v
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SharedPackage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<FetchState>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!token || !/^[A-Za-z0-9]{22}$/.test(token)) {
        setState({ kind: 'error', reason: 'not_found' });
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/public/shared/${token}`);
        const body = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.status === 200 && body?.success) {
          setState({ kind: 'ok', snapshot: body.snapshot as Snapshot, createdAt: body.created_at });
          return;
        }
        const reason =
          body?.reason === 'revoked' ? 'revoked' :
          body?.reason === 'expired' ? 'expired' :
          body?.reason === 'rate_limited' ? 'rate_limited' :
          res.status === 429 ? 'rate_limited' :
          res.status === 410 ? 'revoked' :
          res.status === 404 ? 'not_found' :
          'server_error';
        setState({ kind: 'error', reason });
      } catch {
        if (cancelled) return;
        setState({ kind: 'error', reason: 'server_error' });
      }
    }
    load();
    return () => { cancelled = true; };
  }, [token]);

  // ── Error states ────────────────────────────────────────────────────────────
  if (state.kind === 'error') {
    const messages: Record<string, { title: string; body: string; Icon: React.ElementType }> = {
      not_found: {
        title: "We couldn't find that link.",
        body: 'It may have been revoked or mistyped.',
        Icon: Link2Off,
      },
      revoked: {
        title: 'The owner has disabled this link.',
        body: 'If you need access, contact them directly.',
        Icon: Link2Off,
      },
      expired: {
        title: 'This link has expired.',
        body: 'If you need access, ask the owner for a new link.',
        Icon: AlertCircle,
      },
      rate_limited: {
        title: 'Too many views from your location.',
        body: 'Try again in an hour.',
        Icon: AlertCircle,
      },
      server_error: {
        title: 'Something went wrong.',
        body: "We couldn't load this page right now. Try refreshing in a moment.",
        Icon: AlertCircle,
      },
    };
    const m = messages[state.reason] || messages.server_error;
    return (
      <>
        <Helmet>
          <title>Shared Decision Package · HE Pursuit</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <section className="pt-24 pb-20 px-6">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#0b1120] border border-[#1e2d4a] flex items-center justify-center mb-5">
              <m.Icon size={24} className="text-[#00c3ff]" strokeWidth={2} />
            </div>
            <h1 className="font-headline font-black text-3xl md:text-4xl text-white mb-3 tracking-tight">
              {m.title}
            </h1>
            <p className="text-[#a0b2c8] font-body mb-8">{m.body}</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Visit honestecho.com
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </>
    );
  }

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (state.kind === 'loading') {
    return (
      <>
        <Helmet>
          <title>Shared Decision Package · HE Pursuit</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <section className="pt-28 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8b9bb4] uppercase tracking-widest mb-8">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00c3ff]" />
              Loading decision package…
            </div>
            <div className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] p-6 md:p-8 animate-pulse">
              <div className="h-6 w-32 bg-[#152033] rounded mb-4" />
              <div className="h-8 w-3/4 bg-[#152033] rounded mb-3" />
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
          </div>
        </section>
      </>
    );
  }

  // ── Success render ─────────────────────────────────────────────────────────
  const { snapshot, createdAt } = state;
  const decision = decisionStyle(snapshot.phase5.decision);

  const sharedDate = new Date(createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      <Helmet>
        <title>
          {snapshot.opportunity.rfi_title
            ? `${snapshot.opportunity.rfi_title} · Decision Package · HE Pursuit`
            : 'Decision Package · HE Pursuit'}
        </title>
        <meta name="robots" content="noindex, nofollow" />
        {token && (
          <link rel="canonical" href={`https://honestecho.com/p/${token}`} />
        )}
      </Helmet>

      {/* ── Shared banner ──────────────────────────────────────────────────── */}
      <section className="pt-28 pb-6 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#0d1827] border border-[#1e2d4a] flex items-center justify-center">
              <Sparkles size={13} className="text-[#00c3ff]" />
            </div>
            <p className="text-xs text-[#8b9bb4] font-body">
              <span className="font-bold text-white">Decision Package</span>
              {snapshot.company.name && (
                <>
                  {' · '}
                  <span className="text-[#a0b2c8]">{snapshot.company.name}</span>
                </>
              )}
              {' · '}
              <span className="text-[#a0b2c8]">Shared {sharedDate}</span>
            </p>
          </div>
          <Link
            to="/"
            className="text-xs text-[#8b9bb4] hover:text-[#00c3ff] font-body transition-colors"
          >
            Powered by HE Pursuit →
          </Link>
        </div>
      </section>

      {/* ── Opportunity card ───────────────────────────────────────────────── */}
      <section className="pb-6 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] p-6 md:p-8 shadow-2xl">
            <h1 className="font-headline font-black text-2xl md:text-3xl text-white mb-2 tracking-tight leading-tight">
              {snapshot.opportunity.rfi_title || 'Untitled opportunity'}
            </h1>
            <p className="text-[#a0b2c8] text-sm font-body mb-6">
              {snapshot.opportunity.issuing_agency || 'Agency not stated'}
              {snapshot.opportunity.notice_type ? ` · ${snapshot.opportunity.notice_type}` : ''}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <Field icon={Hash}        label="Reference Number" value={snapshot.opportunity.reference_number} />
              <Field icon={Building2}   label="Issuing Agency"   value={snapshot.opportunity.issuing_agency} />
              <Field icon={FileText}    label="Notice Type"      value={snapshot.opportunity.notice_type} />
              <Field icon={Calendar}    label="Response Deadline" value={snapshot.opportunity.due_date} />
              <Field icon={Tag}         label="NAICS Code(s)"     value={snapshot.opportunity.naics_codes} />
              <Field icon={ShieldCheck} label="Set-Aside"         value={snapshot.opportunity.set_aside} />
            </div>

            {snapshot.opportunity.purpose && (
              <div className="mt-6 pt-6 border-t border-[#1e2d4a]">
                <div className="text-[10px] font-bold text-[#8b9bb4] uppercase tracking-widest font-label mb-2">
                  Purpose
                </div>
                <p className="text-sm text-white font-body leading-relaxed">
                  {snapshot.opportunity.purpose}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Final recommendation ───────────────────────────────────────────── */}
      <section className="pb-6 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className={`rounded-2xl bg-[#0b1120] border ${decision.border} p-6 md:p-8 ${decision.glow}`}
          >
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${decision.bg} ${decision.border} border mb-5`}
            >
              <decision.Icon size={14} className={decision.text} strokeWidth={2.5} />
              <span
                className={`text-xs font-bold uppercase tracking-widest font-label ${decision.text}`}
              >
                Final Recommendation
              </span>
            </div>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-3 tracking-tight leading-tight">
              {decision.label}
            </h2>
            {snapshot.phase5.rationale && (
              <p className="text-[#a0b2c8] font-body leading-relaxed max-w-2xl">
                {snapshot.phase5.rationale}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Summary blocks ─────────────────────────────────────────────────── */}
      <section className="pb-6 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xs font-bold text-[#8b9bb4] uppercase tracking-widest font-label mb-3">
            Analysis Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBlock
              icon={ShieldCheck}
              label="Eligibility"
              value={eligibilityLabel(snapshot.phase2.eligibility_status)}
              sub={
                snapshot.phase2.disqualifier_count > 0
                  ? `${snapshot.phase2.disqualifier_count} disqualifier flag${
                      snapshot.phase2.disqualifier_count === 1 ? '' : 's'
                    }`
                  : 'No disqualifier flags'
              }
              tone={eligibilityTone(snapshot.phase2.eligibility_status)}
            />
            <StatBlock
              icon={TrendingUp}
              label="Strategic Fit"
              value={titleCase(snapshot.phase3.strategic_value)}
              sub={
                snapshot.phase3.strategic_total !== null
                  ? `Score: ${snapshot.phase3.strategic_total}/21`
                  : null
              }
              tone={strategicTone(snapshot.phase3.strategic_value)}
            />
            <StatBlock
              icon={Gauge}
              label="Effort"
              value={titleCase(snapshot.phase4.overall_effort)}
              sub={null}
              tone={effortTone(snapshot.phase4.overall_effort)}
            />
            <StatBlock
              icon={TrendingUp}
              label="Win Probability"
              value={titleCase(snapshot.phase4.win_probability)}
              sub={null}
              tone={winTone(snapshot.phase4.win_probability)}
            />
          </div>

          {/* Requirements roll-up */}
          {snapshot.phase2.requirement_count > 0 && (
            <div className="mt-4 rounded-xl bg-[#0b1120] border border-[#1e2d4a] p-5">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={13} className="text-[#8b9bb4]" strokeWidth={2} />
                <span className="text-[10px] font-bold text-[#8b9bb4] uppercase tracking-widest font-label">
                  Requirements
                </span>
              </div>
              <p className="text-sm text-white font-body">
                <span className="font-bold">{snapshot.phase2.requirement_count}</span>{' '}
                requirements identified
                {snapshot.phase2.top_requirement_categories.length > 0 && (
                  <>
                    {' '}— top categories:{' '}
                    <span className="text-[#a0b2c8]">
                      {snapshot.phase2.top_requirement_categories.join(', ')}
                    </span>
                  </>
                )}
              </p>
            </div>
          )}

          {/* Disqualifier summary */}
          {snapshot.phase2.disqualifier_summary.length > 0 && (
            <div className="mt-4 rounded-xl bg-[#0b1120] border border-amber-500/30 p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={13} className="text-amber-400" strokeWidth={2} />
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-label">
                  Eligibility Flags
                </span>
              </div>
              <ul className="text-sm text-[#a0b2c8] font-body space-y-1">
                {snapshot.phase2.disqualifier_summary.map(d => (
                  <li key={d} className="flex gap-2">
                    <span className="text-amber-400">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ── About the analysis ─────────────────────────────────────────────── */}
      <section className="py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-[#0b1120] border border-[#00c3ff]/30 p-6 md:p-8 shadow-[0_0_40px_rgba(0,195,255,0.08)]">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h3 className="font-headline font-black text-xl md:text-2xl text-white mb-2 tracking-tight">
                  Analyze your own SAM.gov opportunity — free.
                </h3>
                <p className="text-[#a0b2c8] font-body">
                  This decision package was generated by HE Pursuit in under 3 minutes. Paste any
                  SAM.gov Notice ID or URL into the free analyzer and see the same structured
                  triage on your own opportunity.
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
                <Link
                  to="/tools/sam-gov-notice-analyzer"
                  className="px-6 py-3 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_30px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Try the free analyzer
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Create a free account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-[#8b9bb4] font-body">
            Powered by{' '}
            <Link to="/" className="text-[#00c3ff] hover:text-white transition-colors">
              HE Pursuit
            </Link>
            {' · '}
            <Link to="/" className="text-[#8b9bb4] hover:text-[#00c3ff] transition-colors">
              honestecho.com
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
