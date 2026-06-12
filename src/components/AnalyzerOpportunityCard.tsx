import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, CheckCircle2, AlertTriangle, XCircle, Eye, ExternalLink, ArrowRight,
  MapPin, DollarSign, Layers, Hash, Shield, Landmark, Clock, Sparkles, ChevronDown,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ── Contract ────────────────────────────────────────────────────────────────
// This component is a faithful port of the dashboard OpportunityCard. It renders
// from the SAME dimension_scores contract the real card consumes, so the public
// analyzer card matches the in-app card byte-for-byte. Keep DIMS / DEFAULT_WEIGHTS
// / computeLiveScore / DIM_DESC in sync with dashboard/src/components/OpportunityCard.tsx.

export interface AnalyzerProfileScore {
  match_score: number;
  dimension_scores: Record<string, number>;
  reasons: string[];
  recommendation: 'GO' | 'CONDITIONAL_GO' | 'NO_BID';
}

export interface AnalyzerOpportunity {
  noticeId: string;
  title: string;
  agency: string;
  naics: string | null;
  setAside: string | null;
  dueDate: string | null;
  maturity: string | null;
}

// 8 dimensions — order drives both the left info rows and the right bar rows.
// max = hardcoded DB cap; default weight = max (total=100), so the weighted
// formula reduces to a plain sum (identical to the dashboard).
const DIMS: { key: string; weightKey: string; Icon: LucideIcon; tip: string; max: number }[] = [
  { key: 'naics',            weightKey: 'naics',        Icon: Layers,    tip: 'Capability Fit', max: 20 },
  { key: 'keywords',         weightKey: 'keywords',     Icon: Hash,      tip: 'Keyword Fit',    max: 10 },
  { key: 'set_aside',        weightKey: 'set_aside',    Icon: Shield,    tip: 'Set-Aside Fit',  max: 15 },
  { key: 'agency',           weightKey: 'agency',       Icon: Landmark,  tip: 'Agency Fit',     max: 10 },
  { key: 'geo',              weightKey: 'geographic',   Icon: MapPin,    tip: 'Geographic Fit', max: 10 },
  { key: 'value',            weightKey: 'dollar_value', Icon: DollarSign,tip: 'Value Fit',      max: 10 },
  { key: 'timing',           weightKey: 'timing',       Icon: Clock,     tip: 'Timing Fit',     max: 10 },
  { key: 'past_performance', weightKey: 'synergy',      Icon: Sparkles,  tip: 'Synergy Bonus',  max: 15 },
];

const DEFAULT_WEIGHTS: Record<string, number> = {
  naics: 20, keywords: 10, set_aside: 15, agency: 10,
  geographic: 10, dollar_value: 10, timing: 10, synergy: 15,
};

const DIM_DESC: Record<string, { pos: string; neg: string }> = {
  naics:            { pos: 'NAICS code closely matches the requirement',        neg: 'NAICS suggests specialized experience may be needed'   },
  keywords:         { pos: 'Scope language aligns well with this profile',      neg: 'Opportunity likely requires deeper qualification review' },
  set_aside:        { pos: 'Set-aside type aligns with this profile',           neg: 'Set-aside may affect eligibility'                       },
  agency:           { pos: 'Strong alignment with this agency',                 neg: 'Limited prior activity with this agency'                },
  geo:              { pos: 'Work location matches the operating area',          neg: 'Geographic scope may fall outside the area'             },
  value:            { pos: 'Contract value fits the target range',              neg: 'Contract value is outside the typical range'            },
  timing:           { pos: 'Response window allows a quality response',         neg: 'Tight timeline may strain pursuit resources'            },
  past_performance: { pos: 'Past-performance synergy assumed for this sample profile', neg: 'Limited past performance signal'                 },
};

function computeLiveScore(dimensionScores: Record<string, number>, scoringWeights?: Record<string, number>): number {
  if (!dimensionScores || Object.keys(dimensionScores).length === 0) return 0;
  const w = { ...DEFAULT_WEIGHTS, ...scoringWeights };
  const totalWeight = Object.values(w).reduce((a, b) => a + b, 0);
  if (totalWeight <= 0) return 0;
  const weightedSum = DIMS.reduce((sum, dim) => {
    const pts = dimensionScores[dim.key] ?? 0;
    const weight = w[dim.weightKey] ?? dim.max;
    return sum + (pts / dim.max) * weight;
  }, 0);
  return Math.round((weightedSum / totalWeight) * 100);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function agencyAbbr(name: string): string {
  return name.split(/[\s.]+/).filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 4);
}
function agencyDisplay(name: string): string {
  return name.split('.').pop()?.trim() || name;
}

// Small cyan icon with glow-on-hover — matches the dashboard card's RowIcon.
function RowIcon({ Icon, tip }: { Icon: LucideIcon; tip: string }) {
  return (
    <div className="relative group/icon shrink-0 w-5 h-5 flex items-center justify-center cursor-default" title={tip}>
      <div className="absolute inset-0 bg-[#00c3ff] rounded blur-sm opacity-0 group-hover/icon:opacity-30 transition-opacity duration-200" />
      <Icon size={13} className="relative z-10 text-[#00c3ff] group-hover/icon:drop-shadow-[0_0_6px_rgba(56,189,248,0.9)] transition-all duration-200" />
    </div>
  );
}

function dueInfo(dateStr: string | null): { label: string; color: string; past: boolean } {
  if (!dateStr) return { label: '', color: '#4ade80', past: false };
  const d = new Date(dateStr);
  const now = Date.now();
  const past = d.getTime() < now;
  const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const daysLeft = past ? -1 : Math.ceil((d.getTime() - now) / 86_400_000);
  const color = past ? '#f87171' : daysLeft < 7 ? '#f5a623' : daysLeft <= 60 ? '#8b9bb4' : '#4ade80';
  return { label, color, past };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AnalyzerOpportunityCard({ opportunity, score, onTrack }: {
  opportunity: AnalyzerOpportunity;
  score: AnalyzerProfileScore;
  onTrack?: (event: string) => void;
}) {
  const opp = opportunity;
  const dimension_scores = score.dimension_scores || {};
  // Backend match_score is canonical (it's what the profile selector shows);
  // recompute from dimensions only as a fallback so the two never disagree.
  const computed = Number.isFinite(score.match_score)
    ? Math.round(score.match_score)
    : computeLiveScore(dimension_scores);
  const abbr = agencyAbbr(opp.agency);
  const agency = agencyDisplay(opp.agency);
  const due = dueInfo(opp.dueDate);

  const chip = 'text-sm';
  const gapText = 'text-sm text-[#8b9bb4] italic';
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [confidenceOpen, setConfidenceOpen] = useState(false);

  // Row content — same copy/empty-states as the dashboard OpportunityCard.
  const rowContent: Record<string, React.ReactNode> = {
    naics: opp.naics
      ? <span className={`${chip} inline-flex items-center overflow-hidden max-w-full`}>
          <span className="font-mono text-[#00c3ff] shrink-0 whitespace-nowrap">{opp.naics}</span>
        </span>
      : <span className={gapText}>No NAICS — verify scope manually</span>,

    keywords: (() => {
      const pts = dimension_scores.keywords;
      if (pts == null) return <span className={gapText}>Not scored — review scope</span>;
      const max = DIMS.find(d => d.key === 'keywords')?.max ?? 10;
      return pts / max >= 0.5
        ? <span className={`${chip} text-[#00c3ff] overflow-hidden text-ellipsis whitespace-nowrap max-w-full`}>Scope language aligns</span>
        : <span className={gapText}>Weak keyword match — review scope</span>;
    })(),

    set_aside: opp.setAside
      ? <span className={`${chip} text-[#00c3ff] overflow-hidden text-ellipsis whitespace-nowrap max-w-full`} title={opp.setAside}>{opp.setAside}</span>
      : <span className="text-sm text-white/70">Open competition</span>,

    agency: <span className={`${chip} text-[#00c3ff] whitespace-nowrap overflow-hidden text-ellipsis max-w-full inline-block`}>{agency}</span>,

    // The public analyze response carries no place-of-performance or contract-value
    // fields end-to-end (the scorer uses them server-side only), so these rows are
    // honest gap text rather than hardcoded assumptions about the notice.
    geo:   <span className={gapText}>Not included in this notice's data — check SAM.gov</span>,
    value: <span className={gapText}>Not included in this notice's data — check SAM.gov</span>,

    timing: due.label
      ? <span className={`${chip} inline-flex items-center gap-1.5 whitespace-nowrap`} style={{ color: due.color }}>
          <Calendar size={11} />
          {due.past ? 'Expired' : 'Due'} {due.label}
        </span>
      : <span className={gapText}>No deadline — monitor for solicitation</span>,

    past_performance: (() => {
      const pts = dimension_scores.past_performance ?? null;
      if (pts === null || pts === undefined) return <span className={gapText}>Not scored</span>;
      const cfg =
        pts >= 15 ? { color: '#4ade80', bg: 'bg-[#06261A]', border: 'border-[#0A402B]', label: 'Strong Fit'   } :
        pts >= 10 ? { color: '#00c3ff', bg: 'bg-[#001e2d]', border: 'border-[#003a50]', label: 'Moderate Fit' } :
        pts >= 5  ? { color: '#f5a623', bg: 'bg-[#2A2000]', border: 'border-[#4A3800]', label: 'Weak Fit'     } :
                    { color: '#8b9bb4', bg: 'bg-[#0f1a2e]', border: 'border-[#1e2d4a]', label: 'No Signal'    };
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${cfg.bg} ${cfg.border}`} style={{ color: cfg.color }}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
          {cfg.label}
        </span>
      );
    })(),
  };

  // Fit band (5-band scheme) — identical to dashboard.
  const fit = computed >= 90 ? { label: 'Excellent Fit', color: '#4ade80' }
    : computed >= 80 ? { label: 'Strong Fit',   color: '#4ade80' }
    : computed >= 65 ? { label: 'Moderate Fit', color: '#00c3ff' }
    : computed >= 50 ? { label: 'Weak Fit',     color: '#f5a623' }
    :                  { label: 'Poor Fit',     color: '#f87171' };

  // Top scoring factors — 2 strongest + 3 weakest, deduped (dashboard logic).
  const scored = DIMS.map(dim => ({ dim, pct: (dimension_scores[dim.key] ?? 0) / dim.max }));
  const byDesc = [...scored].sort((a, b) => b.pct - a.pct);
  const byAsc  = [...scored].sort((a, b) => a.pct - b.pct);
  const factors: typeof scored = [];
  const seen = new Set<string>();
  [...byDesc.slice(0, 2), ...byAsc.slice(0, 3)].forEach(f => {
    if (!seen.has(f.dim.key)) { seen.add(f.dim.key); factors.push(f); }
  });

  // Credibility gate: a terminal/non-biddable notice type (awarded, J&A, etc.)
  // or a past-due deadline must never render a score-derived "pursue" verdict.
  // Token list mirrors the api-server non-biddable filter.
  const NON_BIDDABLE_RE = /award|justification|j&a|j\s*&\s*a|intent to bundle|sale of surplus/i;
  const notBiddable = (opp.maturity != null && NON_BIDDABLE_RE.test(opp.maturity)) || due.past;

  // 5-band decision derived from score (no workflow override on the public card).
  const derivedDecision = computed >= 90 ? 'STRONG_GO'
    : computed >= 80 ? 'GO'
    : computed >= 65 ? 'REVIEW'
    : computed >= 50 ? 'CAUTION'
    : 'NO_GO';

  const decisionCfg: { Icon: LucideIcon; classes: string; label: string } =
    notBiddable                     ? { Icon: XCircle,       classes: 'bg-white/5 border-[#8b9bb4]/40 text-[#8b9bb4]',       label: 'NOT BIDDABLE' }
    : derivedDecision === 'STRONG_GO' ? { Icon: CheckCircle2,  classes: 'bg-[#4ade80]/15 border-[#4ade80]/40 text-[#4ade80]', label: 'STRONG GO' }
    : derivedDecision === 'GO'      ? { Icon: CheckCircle2,  classes: 'bg-[#4ade80]/10 border-[#4ade80]/30 text-[#4ade80]', label: 'GO' }
    : derivedDecision === 'REVIEW'  ? { Icon: Eye,           classes: 'bg-[#00c3ff]/10 border-[#00c3ff]/30 text-[#00c3ff]', label: 'REVIEW' }
    : derivedDecision === 'CAUTION' ? { Icon: AlertTriangle, classes: 'bg-[#f5a623]/10 border-[#f5a623]/30 text-[#f5a623]', label: 'CAUTION' }
    :                                 { Icon: XCircle,       classes: 'bg-[#f87171]/10 border-[#f87171]/30 text-[#f87171]', label: 'NO-GO' };
  const DecisionIcon = decisionCfg.Icon;

  // Confidence rating — signal strength, not score magnitude (dashboard algorithm).
  let strongDimCount = 0;
  let totalDimCount = 0;
  for (const dim of DIMS) {
    const raw = dimension_scores[dim.key];
    if (raw == null) continue;
    totalDimCount++;
    if (raw / dim.max >= 0.5) strongDimCount++;
  }
  const confidenceRating = totalDimCount > 0
    ? Math.max(1, Math.min(10, Math.round((strongDimCount / totalDimCount) * 10)))
    : 1;
  const confidenceLabel = confidenceRating >= 8 ? 'Strong evidence'
    : confidenceRating >= 5 ? 'Solid'
    : confidenceRating >= 3 ? 'Mixed signal'
    : 'Thin evidence';

  const actionText = notBiddable
    ? 'This notice is awarded/closed — no longer open for response.'
    : derivedDecision === 'STRONG_GO'
    ? 'Top-tier match. Strongest alignment across capability, eligibility, and timing — pursue without hesitation.'
    : derivedDecision === 'GO'
    ? 'Recommend full pursuit analysis. Strong alignment across key evaluation dimensions.'
    : derivedDecision === 'REVIEW'
    ? 'Solid potential, but worth a closer look. Verify the weaker dimensions before committing.'
    : derivedDecision === 'CAUTION'
    ? 'Proceed with caution. Verify eligibility and capability gaps before committing.'
    : 'Profile alignment is insufficient to justify investment for this sample business.';

  const w = { ...DEFAULT_WEIGHTS };

  const renderRows = (keys: readonly string[]) =>
    keys.map(key => {
      const dim = DIMS.find(d => d.key === key)!;
      return (
        <div key={key} className="h-7 flex items-center gap-3 min-w-0">
          <RowIcon Icon={dim.Icon} tip={dim.tip} />
          <div className="flex-1 min-w-0 flex items-center overflow-hidden">{rowContent[key]}</div>
        </div>
      );
    });

  return (
    <div className="group/card rounded-2xl border border-[#1e2d4a] bg-[#0b1120] flex flex-col p-6 h-full transition-all duration-500 relative overflow-hidden hover:-translate-y-1 hover:border-[#00c3ff]/40 hover:shadow-[0_10px_40px_-5px_rgba(0,195,255,0.12)]">
      <div className="absolute inset-x-0 top-0 h-[2px] pointer-events-none transition-opacity duration-500 opacity-0 group-hover/card:opacity-100 rounded-t-2xl"
        style={{ background: 'linear-gradient(to right, transparent, rgba(0,195,255,0.4), transparent)' }} />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.04)_0%,transparent_60%)]" />

      {/* ── HEADER ── */}
      <div className="relative z-10 flex items-start gap-4 w-full mb-3">
        {/* Agency badge */}
        <div className="w-14 h-14 rounded-xl border border-[#1e2d4a] bg-[#0f1a2e] flex items-center justify-center shrink-0 relative overflow-visible" title={opp.agency}>
          <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-0 group-hover/card:opacity-15 transition-opacity duration-500 rounded-xl scale-125" />
          <span className="text-xs font-black tracking-wider text-[#00c3ff] relative z-10 transition-all duration-500 group-hover/card:scale-105 group-hover/card:drop-shadow-[0_0_12px_rgba(0,195,255,0.4)]">{abbr}</span>
        </div>

        {/* Title + agency + maturity badge */}
        <div className="flex-1 min-w-0 flex flex-col gap-1 min-h-[120px]">
          <h3 className="text-[17px] font-headline font-black text-white leading-snug line-clamp-2" title={opp.title}>
            {opp.title || 'Untitled notice'}
          </h3>
          <span className="text-sm font-bold text-[#8b9bb4] uppercase tracking-wider line-clamp-1" title={opp.agency}>{agency}</span>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            <span className="px-1.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-[#5b8cff]/10 text-[#5b8cff] border border-[#5b8cff]/30">
              {opp.maturity || 'Notice type unavailable'}
            </span>
          </div>
        </div>

        {/* Score + fit bar + breakdown tooltip + due */}
        <div className="shrink-0 flex flex-col items-end">
          <div className="relative group/score">
            <button
              type="button"
              aria-expanded={breakdownOpen}
              aria-label="Toggle score breakdown"
              onClick={() => setBreakdownOpen(o => !o)}
              className="cursor-pointer bg-transparent border-0 p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] rounded inline-flex items-center gap-1"
            >
              <span className="text-[40px] font-black tabular-nums leading-none tracking-tight text-white">
                {computed}<span className="text-xl tracking-normal opacity-50">%</span>
              </span>
              {Object.keys(dimension_scores).length > 0 && (
                <ChevronDown
                  size={14}
                  className={`text-[#8b9bb4] shrink-0 transition-transform duration-200 ${breakdownOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              )}
            </button>
            {Object.keys(dimension_scores).length > 0 && (
              <div className={`absolute right-0 top-full mt-2 z-50 w-52 bg-[#0b1120] border border-[#1e2d4a] rounded-xl p-3 shadow-2xl transition-opacity duration-200 ${breakdownOpen ? 'opacity-100' : 'opacity-0 group-hover/score:opacity-100 pointer-events-none'}`}
                style={{ boxShadow: '0 0 0 1px rgba(0,195,255,0.08), 0 8px 32px rgba(0,0,0,0.6)' }}>
                <p className="text-xs font-bold uppercase tracking-widest text-[#8b9bb4] mb-2">Score Breakdown</p>
                <div className="space-y-1.5">
                  {DIMS.map(dim => {
                    const pts = dimension_scores[dim.key] ?? 0;
                    const weight = w[dim.weightKey] ?? dim.max;
                    const contrib = Math.round((pts / dim.max) * weight);
                    const pct = pts / dim.max;
                    return (
                      <div key={dim.key} className="flex items-center gap-2">
                        <span className="text-xs text-[#8b9bb4] w-20 truncate shrink-0">{dim.tip}</span>
                        <div className="flex-1 h-1.5 bg-[#1e2d4a] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct >= 0.7 ? 'bg-[#4ade80]' : pct >= 0.35 ? 'bg-[#00c3ff]' : 'bg-[#334155]'}`}
                            style={{ width: `${Math.max(pct * 100, pts > 0 ? 4 : 0)}%` }} />
                        </div>
                        <span className="text-xs font-bold tabular-nums text-white w-5 text-right shrink-0">{contrib}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-[#1e2d4a] mt-2 pt-2 flex justify-between items-center">
                  <span className="text-xs text-[#8b9bb4]">Total</span>
                  <span className="text-xs font-black text-white">{computed}%</span>
                </div>
              </div>
            )}
          </div>
          <div className="w-16 h-1 bg-[#1e2d4a] rounded-full overflow-hidden mt-1.5">
            <div className="h-full rounded-full" style={{ width: `${computed}%`, background: fit.color }} />
          </div>
          <span className="text-xs font-bold mt-0.5" style={{ color: fit.color }}>{fit.label}</span>
          {due.label ? (
            <span className="mt-2 text-xs font-semibold tabular-nums flex items-center gap-1 whitespace-nowrap" style={{ color: due.color }}>
              <Calendar size={10} />
              {due.past ? 'Expired' : 'Due'} {due.label}
            </span>
          ) : (
            <span className="mt-2 text-xs text-[#8b9bb4]">Not Available</span>
          )}
        </div>
      </div>

      {/* ── MIDDLE: grouped rows (left) + recommendation panel (right) ── */}
      <div className="mb-5 flex flex-col md:flex-row gap-6 w-full border-t border-[#1e2d4a] pt-4 relative z-10">
        {/* Left: Contract Identity + Operational Fit */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#8b9bb4] mb-2">Contract Identity</p>
            <div className="space-y-[9px]">{renderRows(['naics', 'keywords', 'set_aside', 'agency'])}</div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#8b9bb4] mb-2">Operational Fit</p>
            <div className="space-y-[9px]">{renderRows(['geo', 'value', 'timing'])}</div>
          </div>
        </div>

        {/* Right: Recommendation + factors */}
        <div className="flex-1 border-l border-[#1e2d4a] pl-5 flex flex-col gap-3">
          <p className="text-sm font-bold uppercase tracking-wider text-[#8b9bb4]">Recommendation</p>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`md:min-w-[170px] inline-flex items-center justify-center gap-2 px-3 py-1 rounded-lg border text-sm font-headline font-black tracking-[0.12em] uppercase whitespace-nowrap shrink-0 ${decisionCfg.classes}`}>
                <DecisionIcon size={14} strokeWidth={2.5} />
                {decisionCfg.label}
              </span>
              <button
                type="button"
                aria-expanded={confidenceOpen}
                onClick={() => setConfidenceOpen(o => !o)}
                className="md:min-w-[170px] inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-[#1e2d4a] text-sm font-bold tracking-[0.12em] uppercase text-[#a0b2c8] shrink-0 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
                title={`Confidence ${confidenceRating}/10 — ${strongDimCount} of ${totalDimCount} scoring dimensions hit at least 50% of their max. Measures how substantiated the ${computed}% match score is, not the magnitude.`}
              >
                {confidenceLabel}
                <ChevronDown
                  size={12}
                  className={`shrink-0 transition-transform duration-200 ${confidenceOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </div>
            {confidenceOpen && (
              <p className="font-body text-xs text-[#8b9bb4] leading-snug rounded-lg border border-[#1e2d4a] bg-[#0f1a2e] px-3 py-2">
                Confidence {confidenceRating}/10 — {strongDimCount} of {totalDimCount} scoring dimensions hit at least 50% of their max.
                Measures how substantiated the {computed}% match score is, not the magnitude.
              </p>
            )}
            <p className="font-body text-sm text-white leading-snug">{actionText}</p>
          </div>

          <div className="mt-2">
            <p className="text-sm font-bold uppercase tracking-wider text-[#8b9bb4] mb-2.5">Why this scored {computed}%</p>
            <div className="space-y-2.5">
              {factors.map(({ dim, pct }) => {
                const isPos = pct >= 0.5;
                const label = DIM_DESC[dim.key]?.[isPos ? 'pos' : 'neg'] ?? dim.tip;
                return (
                  <div key={dim.key} className="flex items-start gap-2">
                    {isPos
                      ? <CheckCircle2  size={13} className="text-[#4ade80] shrink-0 mt-0.5" />
                      : <AlertTriangle size={13} className="text-[#f5a623] shrink-0 mt-0.5" />
                    }
                    <span className={`text-sm leading-snug ${isPos ? 'font-semibold text-white' : 'font-normal text-[#8b9bb4]'}`}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: action bar ── */}
      <div className="relative z-10 w-full border-t border-[#1e2d4a] pt-4 mt-auto flex items-center justify-between gap-3 flex-wrap">
        <a
          href={`https://sam.gov/opp/${encodeURIComponent(opp.noticeId)}/view`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onTrack?.('analyzer_card_sam_clicked')}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-headline font-bold text-sm bg-transparent border border-transparent text-[#8b9bb4] hover:text-[#00c3ff] hover:bg-[#0b1120] transition-all duration-300"
        >
          <ExternalLink size={14} />
          SAM.gov
        </a>
        <Link
          to="/signup/"
          onClick={() => onTrack?.('analyzer_card_pursue_clicked')}
          className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-lg font-headline font-bold text-sm bg-[#00c3ff] text-[#030B17] shadow-[0_0_15px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
        >
          {notBiddable ? 'Find Open Opportunities' : 'Pursue This'}
          <ArrowRight size={14} />
        </Link>
      </div>
      <p className="w-full text-center text-xs text-[#8b9bb4] mt-3 pb-1">Score shown for the selected sample profile — run the full workflow on your own profile.</p>
    </div>
  );
}
