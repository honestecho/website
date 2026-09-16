import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, CheckCircle2, AlertTriangle, XCircle, Eye, ExternalLink, ArrowRight,
  Layers, Hash, Shield, Landmark, Clock, Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ── Contract ────────────────────────────────────────────────────────────────
// Faithful port of the dashboard OpportunityCard's decision-first layout, so the
// public analyzer card matches the in-app search card. Renders from the SAME
// dimension_scores contract. Keep DIMS / DEFAULT_WEIGHTS / computeLiveScore /
// DIM_DESC in sync with dashboard/src/components/OpportunityCard.tsx.
// Public-card differences (by design): no Bookmark / Start Pursuit / Summarize
// actions (those need an account); the one CTA is a signup conversion. The
// analyzer response carries no place-of-performance, contract value, posted
// date, or AI signals, so those are handled as honest gaps, not assumptions.

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

// These maxes MUST match the server scorer (migrations/096_route_recommendation.sql)
// and the PUBLIC_SCORE_DIMS set in api-server.js — they drive the hover breakdown,
// the "Why It Fits" / "Watch Before Pursuing" split, and the confidence label, all of
// which sit under a headline number the server computed. They were previously out of
// sync (naics 20 vs 25, set_aside 15 vs 17, agency 10 vs 5) and listed geo, value and
// a past_performance/synergy dimension the public scorer never emits, so the panels
// disagreed with the number above them.
//
// geo and value are deliberately absent: the public path has no data for either and
// the server now excludes them from the score entirely (see api-server.js).
const DIMS: { key: string; weightKey: string; Icon: LucideIcon; tip: string; max: number }[] = [
  { key: 'naics',     weightKey: 'naics',     Icon: Layers,   tip: 'Capability Fit', max: 25 },
  { key: 'keywords',  weightKey: 'keywords',  Icon: Hash,     tip: 'Keyword Fit',    max: 10 },
  { key: 'set_aside', weightKey: 'set_aside', Icon: Shield,   tip: 'Set-Aside Fit',  max: 17 },
  { key: 'agency',    weightKey: 'agency',    Icon: Landmark, tip: 'Agency Fit',     max: 5  },
  { key: 'timing',    weightKey: 'timing',    Icon: Clock,    tip: 'Timing Fit',     max: 10 },
];

// Weights mirror the DIMS maxes, so the fallback computeLiveScore below reproduces
// the server's earned/67 arithmetic exactly instead of diverging from it.
const DEFAULT_WEIGHTS: Record<string, number> = {
  naics: 25, keywords: 10, set_aside: 17, agency: 5, timing: 10,
};

const DIM_DESC: Record<string, { pos: string; neg: string }> = {
  naics:            { pos: 'NAICS code closely matches the requirement',        neg: 'NAICS suggests specialized experience may be needed'    },
  keywords:         { pos: 'Scope language aligns well with this profile',      neg: 'Opportunity likely requires deeper qualification review' },
  set_aside:        { pos: 'The set-aside matches this profile', neg: 'Set-aside may affect eligibility'                       },
  agency:           { pos: 'Strong alignment with this agency',                 neg: 'Limited prior activity with this agency'                },
  timing:           { pos: 'The deadline leaves enough time to prepare a strong response', neg: 'Tight timeline may strain pursuit resources'            },
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
function agencyDisplay(name: string): string {
  return name.split('.').pop()?.trim() || name;
}

// Agency logo + abbreviation — mirrors the dashboard's agencyUtils so the public
// card shows the same icon (e.g. DHA → DoD seal). Assets live in /public/agency-icons.
function getAgencyLogoUrl(agency: string): string | null {
  const a = agency.toUpperCase();
  if (a.includes('NAVY') || a.includes('NAVAL')) return '/agency-icons/navy.svg';
  if (a.includes('AIR FORCE') || a.includes('SPACE FORCE')) return '/agency-icons/airforce.svg';
  if (a.includes('ARMY')) return '/agency-icons/army.svg';
  if (a.includes('MARINE')) return '/agency-icons/marines.png';
  if (a.includes('COAST GUARD')) return '/agency-icons/coastguard.svg';
  if (a.includes('NASA') || a.includes('AERONAUTICS')) return '/agency-icons/nasa.svg';
  if (a.includes('VETERAN') || / VA[. ]/.test(a) || a === 'VA') return '/agency-icons/va.svg';
  if (a.includes('HOMELAND') || a.includes('DHS')) return '/agency-icons/dhs.svg';
  // DEFENSE before HEALTH: "DEFENSE HEALTH AGENCY (DHA)" is DoD, not HHS.
  if (a.includes('DEFENSE') || a.includes('DOD')) return '/agency-icons/dod.svg';
  if (a.includes('HEALTH') || a.includes('HHS')) return '/agency-icons/hhs.svg';
  if (a.includes('GENERAL SERVICES') || a.includes('GSA')) return '/agency-icons/gsa.png';
  return null;
}
function getAgencyAbbr(agency: string): string {
  const a = agency.toUpperCase();
  if (a.includes('NAVY') || a.includes('NAVAL')) return 'DON';
  if (a.includes('AIR FORCE') || a.includes('SPACE FORCE')) return 'DAF';
  if (a.includes('ARMY')) return 'USA';
  if (a.includes('MARINE')) return 'USMC';
  if (a.includes('COAST GUARD')) return 'USCG';
  if (a.includes('NASA')) return 'NASA';
  if (a.includes('VETERAN') || / VA[. ]/.test(a)) return 'VA';
  if (a.includes('HOMELAND') || a.includes('DHS')) return 'DHS';
  if (a.includes('DEFENSE') || a.includes('DOD')) return 'DOD';
  if (a.includes('HEALTH') || a.includes('HHS')) return 'HHS';
  if (a.includes('GSA')) return 'GSA';
  const words = agency.trim().split(/[\s.]+/).filter(w => w.length > 2);
  return words.slice(0, 3).map(w => w[0].toUpperCase()).join('') || agency[0]?.toUpperCase() || '?';
}
function AgencyIcon({ agency }: { agency: string }) {
  const url = getAgencyLogoUrl(agency);
  const abbr = getAgencyAbbr(agency);
  const [failed, setFailed] = useState(false);
  if (!url || failed) {
    return <span className="text-xs font-black tracking-wider text-[#00c3ff]">{abbr}</span>;
  }
  return <img src={url} alt={abbr} className="w-8 h-8 sm:w-11 sm:h-11 object-contain" onError={() => setFailed(true)} />;
}

const MATURITY_DISPLAY: Record<string, string> = {
  'Presolicitation': 'Pre-Solicitation Notice',
  'Combined Synopsis/Solicitation': 'Combined Synopsis / Solicitation',
  'Modification/Amendment': 'Modification / Amendment',
};
function displayMaturity(m: string): string { return MATURITY_DISPLAY[m] ?? m; }

const SET_ASIDE_FULL: Record<string, string> = {
  'SDVOSB': 'Service-Disabled Veteran-Owned Small Business',
  'VOSB': 'Veteran-Owned Small Business',
  'WOSB': 'Women-Owned Small Business',
  'EDWOSB': 'Economically Disadvantaged Women-Owned Small Business',
  '8(a)': '8(a) Business Development Program',
  'HUBZone': 'Historically Underutilized Business Zone',
  'SB': 'Small Business',
};
function abbrevSetAside(raw: string): string {
  const t = raw.toLowerCase();
  if (t.includes('edwosb') || (t.includes('economically disadvantaged') && t.includes('women'))) return 'EDWOSB';
  if (t.includes('sdvosb') || t.includes('service-disabled')) return 'SDVOSB';
  if (t.includes('wosb') || t.includes('women-owned')) return 'WOSB';
  if (t.includes('vosb') || t.includes('veteran-owned')) return 'VOSB';
  if (t.includes('8(a)') || /\b8a\b/.test(t)) return '8(a)';
  if (t.includes('hubzone')) return 'HUBZone';
  if (t.includes('small business') || t.includes('sba')) return 'SB';
  return raw.length > 14 ? `${raw.slice(0, 12)}…` : raw;
}

function dueInfo(dateStr: string | null): { label: string; color: string; past: boolean } {
  if (!dateStr) return { label: '', color: '#4ade80', past: false };
  const d = new Date(dateStr);
  const now = Date.now();
  const past = d.getTime() < now;
  // A date-only deadline arrives as UTC midnight; formatting it in a US zone
  // rolls it back a day (Jan 9 showed as Jan 8 beside a summary saying Jan 9).
  const dateOnly = /T00:00(:00(\.0+)?)?(Z|\+00:00)$/.test(dateStr);
  const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', ...(dateOnly ? { timeZone: 'UTC' } : {}) });
  const daysLeft = past ? -1 : Math.ceil((d.getTime() - now) / 86_400_000);
  const color = past ? '#f87171' : daysLeft < 7 ? '#f5a623' : daysLeft <= 60 ? '#8b9bb4' : '#4ade80';
  return { label, color, past };
}

interface EvidenceRow { key: string; label: string }

// ── Component ─────────────────────────────────────────────────────────────────
export default function AnalyzerOpportunityCard({ opportunity, score, summary, comparedWith, onTrack, variant = 'full' }: {
  opportunity: AnalyzerOpportunity;
  score: AnalyzerProfileScore;
  /** Server-written plain-English summary of the notice; shown in the full card only. */
  summary?: string;
  /** Label of the sample business the score was computed against (full card only). */
  comparedWith?: string;
  onTrack?: (event: string) => void;
  /**
   * 'preview' renders the same card as a subordinate hero sample: no hover lift
   * and no signup CTA, so the hero keeps exactly one primary action. Everything
   * else — score, band, evidence, notice details, provenance link — is identical,
   * because the point of the preview is that it IS the real output.
   */
  variant?: 'full' | 'preview';
}) {
  const isPreview = variant === 'preview';
  const opp = opportunity;
  const dimension_scores = score.dimension_scores || {};
  const computed = Number.isFinite(score.match_score)
    ? Math.round(score.match_score)
    : computeLiveScore(dimension_scores);
  const agency = agencyDisplay(opp.agency);
  const due = dueInfo(opp.dueDate);
  const [breakdownOpen, setBreakdownOpen] = useState(false);



  // Credibility gate: a terminal/non-biddable notice type or a past-due deadline
  // must never render a score-derived "pursue" verdict.
  const NON_BIDDABLE_RE = /award|justification|j&a|j\s*&\s*a|intent to bundle|sale of surplus/i;
  const notBiddable = (opp.maturity != null && NON_BIDDABLE_RE.test(opp.maturity)) || due.past;

  // Confidence = signal strength (how much of the profile actually scored).
  let strongDimCount = 0;
  let totalDimCount = 0;
  for (const dim of DIMS) {
    const raw = dimension_scores[dim.key];
    if (raw == null) continue;
    totalDimCount++;
    if (raw / dim.max >= 0.5) strongDimCount++;
  }
  const confidenceLabel = totalDimCount === 0 ? null
    : strongDimCount / totalDimCount >= 0.8 ? 'Strong evidence'
    : strongDimCount / totalDimCount >= 0.5 ? 'Moderate evidence'
    : 'Limited evidence';

  // ── Decision band ── recommendation derived from the score (no workflow on the
  //    public card). geo/value are absent from DIMS entirely — the server no longer
  //    scores them, so there is nothing to exclude here.
  // The verdict IS the server's recommendation (GO / CONDITIONAL GO / NO-BID) —
  // one vocabulary from the promise on the page to the label on the card.
  type Band = { Icon: LucideIcon; color: string; label: string; reason: string };
  const band: Band = notBiddable
    ? { Icon: XCircle, color: '#8b9bb4', label: 'NOT BIDDABLE', reason: 'This notice is awarded or closed. It is no longer open for response.' }
    : score.recommendation === 'GO' ? { Icon: CheckCircle2, color: '#4ade80', label: 'GO',
        reason: 'This sample business lines up well with the work, agency, deadline, and set-aside. Compare the notice with your own business before deciding to bid.' }
    : score.recommendation === 'CONDITIONAL_GO' ? { Icon: AlertTriangle, color: '#f5a623', label: 'CONDITIONAL GO',
        reason: 'A workable fit for this sample profile, with gaps to check. Confirm the weaker dimensions before committing proposal hours.' }
    :                  { Icon: Eye, color: '#8b9bb4', label: 'NO-BID',
        reason: 'Weak fit for this sample profile. Review only if the opportunity matters strategically.' };
  const BandIcon = band.Icon;

  // ── Evidence vs risk ── built from the scored dimensions.
  const evidenceDims = DIMS;
  const scoredEv = evidenceDims
    .map(d => ({ d, pct: dimension_scores[d.key] != null ? dimension_scores[d.key] / d.max : null }))
    .filter((x): x is { d: typeof evidenceDims[number]; pct: number } => x.pct != null);
  const fits: EvidenceRow[] = scoredEv
    .filter(x => x.pct >= 0.5)
    .sort((a, b) => b.pct - a.pct)
    .map(x => ({ key: x.d.key, label: DIM_DESC[x.d.key]?.pos ?? x.d.tip }));
  const watches: EvidenceRow[] = scoredEv
    .filter(x => x.pct < 0.5)
    .sort((a, b) => a.pct - b.pct)
    .map(x => ({ key: x.d.key, label: DIM_DESC[x.d.key]?.neg ?? x.d.tip }));
  const MAX = 4;

  const w = { ...DEFAULT_WEIGHTS };
  const earnedTotal = Math.round(DIMS.reduce((sum, d) => sum + (dimension_scores[d.key] ?? 0), 0));
  const maxTotal = DIMS.reduce((sum, d) => sum + d.max, 0);

  return (
    <div className={`group/card rounded-xl border border-[#1e2d4a] bg-[#0b1120] flex flex-col h-full relative overflow-hidden ${isPreview ? 'p-4' : 'p-5 sm:p-6'}`}>

      {/* ── HEADER ── */}
      <div className="relative z-10 grid grid-cols-[2.25rem_minmax(0,1fr)] sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center sm:items-start gap-x-3 sm:gap-x-4 gap-y-3 w-full mb-1">
        {/* Agency badge */}
        <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-lg border border-[#1e2d4a] flex items-center justify-center shrink-0 relative overflow-visible" title={opp.agency}>
          <div className="relative z-10">
            <AgencyIcon agency={opp.agency} />
          </div>
        </div>

        {/* Mobile: agency beside the crest, title full-width below. sm+: title → agency → metadata beside the crest. */}
        <span className="sm:hidden text-sm font-semibold text-[#8b9bb4] uppercase tracking-wider min-w-0" title={opp.agency}>{agency}</span>
        <div className="col-span-2 sm:col-span-1 min-w-0 flex flex-col gap-1">
          <h3 className="text-[15px] font-headline font-bold text-white leading-[1.28] sm:line-clamp-3" title={opp.title}>
            {opp.title || 'Untitled notice'}
          </h3>
          <span className="hidden sm:block text-sm font-semibold text-[#8b9bb4] uppercase tracking-wider md:line-clamp-1" title={opp.agency}>{agency}</span>
          <div className="flex items-center gap-1.5 flex-wrap mt-1.5 min-w-0">
            {opp.maturity && (
              <span className="text-xs text-[#8b9bb4] min-w-0 truncate" title={displayMaturity(opp.maturity)}>{displayMaturity(opp.maturity)}</span>
            )}
            {opp.maturity && due.label && <span className="text-xs text-[#475569]" aria-hidden="true">·</span>}
            {due.label && (
              <span className="inline-flex items-center gap-1 text-xs shrink-0" style={{ color: due.past ? due.color : '#a0b2c8' }} title={`Response due ${due.label}`}>
                <Calendar size={11} />
                {due.past ? 'Expired' : `Due ${due.label}`}
              </span>
            )}
          </div>
        </div>

        {/* Right: 100-point fit score (+ hover breakdown in the preview variant only;
            the full card shows the breakdown inline below the verdict) */}
        <div className="col-span-2 sm:col-span-1 sm:col-start-3 shrink-0 flex sm:flex-col items-baseline sm:items-end gap-x-3 text-left sm:text-right relative group/score">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b9bb4]">Pursuit Fit</span>
          <button
            type="button"
            aria-expanded={breakdownOpen}
            aria-label="Toggle score breakdown"
            onClick={() => setBreakdownOpen(o => !o)}
            className="leading-none sm:mt-1 bg-transparent border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] rounded"
          >
            <span className="text-4xl sm:text-[40px] font-black tabular-nums tracking-tight text-white">{computed}</span>
            <span className="text-lg font-bold text-[#8b9bb4]"> / 100</span>
          </button>
          <div className="hidden sm:block w-16 h-1 bg-[#1e2d4a] rounded-full overflow-hidden mt-2">
            <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, computed))}%`, background: band.color }} />
          </div>
          {!isPreview && comparedWith && (
            <p className="hidden sm:block text-xs text-[#8b9bb4] mt-1.5 whitespace-nowrap">Sample profile: <span className="text-[#e2e8f0]">{comparedWith}</span></p>
          )}

          {isPreview && Object.keys(dimension_scores).length > 0 && (
            <div className={`absolute right-0 top-full mt-2 z-50 w-52 bg-[#0b1120] border border-[#1e2d4a] rounded-xl p-3 shadow-2xl transition-opacity duration-200 ${breakdownOpen ? 'opacity-100' : 'opacity-0 group-hover/score:opacity-100 pointer-events-none'}`}
              style={{ boxShadow: '0 0 0 1px rgba(0,195,255,0.08), 0 8px 32px rgba(0,0,0,0.6)' }}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#8b9bb4] mb-2">Score Breakdown</p>
              <div className="space-y-1.5">
                {DIMS.map(dim => {
                  const pts = dimension_scores[dim.key] ?? 0;
                  const weight = w[dim.weightKey] ?? dim.max;
                  const pct = Math.max(0, Math.min(1, pts / dim.max));
                  const contrib = Math.round(pct * weight);
                  return (
                    <div key={dim.key} className="flex items-center gap-2">
                      <span className="text-xs text-[#8b9bb4] w-24 truncate shrink-0">{dim.tip}</span>
                      <div className="flex-1 h-1.5 bg-[#1e2d4a] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pct >= 0.7 ? 'bg-[#4ade80]' : pct >= 0.35 ? 'bg-[#00c3ff]' : 'bg-[#334155]'}`}
                          style={{ width: `${Math.max(pct * 100, pts > 0 ? 4 : 0)}%` }} />
                      </div>
                      <span className="text-xs font-bold tabular-nums text-white w-5 text-right shrink-0">{contrib}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {!isPreview && comparedWith && (
        <p className="sm:hidden relative z-10 text-xs text-[#8b9bb4] mt-2">Sample profile: <span className="text-[#e2e8f0]">{comparedWith}</span></p>
      )}

      {/* ── DECISION BAND ── */}
      <div className={`relative z-10 rounded-xl border px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 ${isPreview ? 'mt-4' : 'mt-5'}`}
        style={{ background: `${band.color}09`, borderColor: `${band.color}2e` }}>
        <div className="flex items-start gap-3 min-w-0">
          <BandIcon size={20} strokeWidth={2.5} className="shrink-0 mt-0.5" style={{ color: band.color }} />
          <div className="min-w-0">
            <span className="block text-sm font-headline font-semibold whitespace-nowrap" style={{ color: band.color }}>{band.label}</span>
            <p className={`font-body text-sm text-white leading-snug mt-1 ${isPreview ? 'line-clamp-3' : ''}`}>{band.reason}</p>
          </div>
        </div>
        {confidenceLabel && (
          <div className="shrink-0 md:text-right pl-8 md:pl-0 cursor-help"
            title={`Confidence = how complete the evidence is, not how good the fit is — ${strongDimCount} of ${totalDimCount} scoring dimensions had data. Separate from the recommendation.`}>
            <p className="text-sm whitespace-nowrap"><span className="text-[#8b9bb4]">Confidence: </span><span className="font-medium text-[#e2e8f0]">{confidenceLabel.replace(' evidence', '')}</span></p>
          </div>
        )}
      </div>

      {/* ── SCORE BREAKDOWN ── the evidence behind the number, in the open */}
      {!isPreview && Object.keys(dimension_scores).length > 0 && (
        <div className="relative z-10 mt-4 border-t border-[#1e2d4a] pt-4">
          <p className="text-xs font-medium text-[#8b9bb4]">Score breakdown</p>
          <p className="text-xs text-[#8b9bb4] tabular-nums mt-1 mb-3">Score: {earnedTotal} of {maxTotal} available points ({computed}/100).</p>
          <div className="grid grid-cols-1 gap-y-2.5 max-w-4xl">
            {DIMS.map(dim => {
              const pts = dimension_scores[dim.key] ?? 0;
              const pct = Math.max(0, Math.min(1, pts / dim.max));
              return (
                <div key={dim.key} className="grid grid-cols-[116px_minmax(0,1fr)_56px] sm:grid-cols-[120px_minmax(180px,1fr)_56px] items-center gap-4 tabular-nums">
                  <span className="text-sm text-[#a0b2c8] truncate">{dim.tip}</span>
                  <div className="h-1.5 bg-[#1e2d4a] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct >= 0.7 ? 'bg-[#4ade80]' : pct >= 0.35 ? 'bg-[#00c3ff]' : 'bg-[#334155]'}`}
                      style={{ width: `${Math.max(pct * 100, pts > 0 ? 4 : 0)}%` }} />
                  </div>
                  <span className="text-sm tabular-nums text-right"><span className="text-[#e2e8f0] font-medium">{Math.round(pts)}</span><span className="text-[#8b9bb4]"> / {dim.max}</span></span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── EVIDENCE vs RISK ── 50/50 split */}
      <div className={`relative z-10 border-t border-[#1e2d4a] grid grid-cols-1 md:grid-cols-2 gap-5 ${isPreview ? 'mt-3 pt-3' : 'mt-4 pt-4 md:mt-5 md:pt-5'}`}>
        <div className="min-w-0 flex flex-col">
          <p className="text-xs font-medium text-[#8b9bb4] mb-2.5">Why it fits</p>
          {fits.length > 0 ? (
            <div className="space-y-2.5">
              {fits.slice(0, MAX).map(row => (
                <div key={row.key} className="flex items-start gap-3">
                  <CheckCircle2 size={13} className="text-[#4ade80]/80 shrink-0 mt-0.5" />
                  <span className={`font-semibold text-white leading-snug line-clamp-2 min-w-0 ${isPreview ? 'text-[13px]' : 'text-sm'}`}>{row.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#94a3b8] leading-snug">No strong positive signals on this notice yet.</p>
          )}
        </div>

        <div className="min-w-0 md:border-l md:border-[#1e2d4a] md:pl-5 flex flex-col">
          <p className="text-xs font-medium text-[#8b9bb4] mb-2.5">Watch before pursuing</p>
          {watches.length > 0 ? (
            <div className="space-y-2.5">
              {watches.slice(0, MAX).map(row => (
                <div key={row.key} className="flex items-start gap-3">
                  <AlertTriangle size={13} className="text-[#f5a623]/90 shrink-0 mt-0.5" />
                  <span className={`text-[#cbd5e1] leading-snug line-clamp-2 min-w-0 ${isPreview ? 'text-[13px]' : 'text-sm'}`}>{row.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <CheckCircle2 size={13} className="text-[#4ade80]/80 shrink-0 mt-0.5" />
              <span className="text-sm text-[#cbd5e1] leading-snug">No major watch-outs found.</span>
            </div>
          )}
        </div>
      </div>

      {/* ── NOTICE DETAILS ── (full card only; the hero preview stays short) */}
      {!isPreview && (
      <div className="relative z-10 border-t border-[#1e2d4a] mt-4 pt-4 md:mt-5 md:pt-5">
        <p className="text-xs font-medium text-[#8b9bb4] mb-3">Notice details</p>
        <div className={`grid grid-cols-2 gap-x-5 sm:gap-x-8 ${isPreview ? 'gap-y-2' : 'gap-y-4'}`}>
          {([
            { label: 'Notice Type', Icon: Hash, node: opp.maturity
                ? <span className="text-sm text-white truncate block" title={displayMaturity(opp.maturity)}>{displayMaturity(opp.maturity)}</span>
                : <span className="text-sm text-[#a0b2c8]">Not stated</span> },
            { label: 'Due', Icon: Clock, node: due.label
                ? <span className="text-sm text-white truncate block">{due.past ? 'Expired' : due.label}</span>
                : <span className="text-sm text-[#a0b2c8]">No deadline set</span> },
            { label: 'NAICS', Icon: Layers, node: opp.naics
                ? <span className="text-sm font-mono text-[#cbd5e1] truncate block" title={opp.naics}>{opp.naics}</span>
                : <span className="text-sm text-[#a0b2c8]">Not stated</span> },
            { label: 'Agency', Icon: Landmark, node:
                <span className="text-sm text-white truncate block" title={opp.agency}>{agency}</span> },
            { label: 'Set-Aside', Icon: Shield, node: (() => {
                const sa = opp.setAside;
                // SAM returns the literal string "No Set aside used" as often as it
                // returns null. Treated as a value it rendered as a cyan "No Set
                // aside…" chip, which reads like a set-aside the bidder must meet.
                if (!sa || /^no set.?aside/i.test(sa.trim())) {
                  return <span className="text-sm text-[#a0b2c8]">Open competition</span>;
                }
                const acr = abbrevSetAside(sa);
                const full = SET_ASIDE_FULL[acr];
                return (
                  <span className="text-sm truncate block" title={full ? `${acr} — ${full}` : sa}>
                    <span className="text-[#cbd5e1]">{acr}</span>
                    {full && <span className="text-white"> — {full}</span>}
                  </span>
                );
              })() },
            { label: 'Notice ID', Icon: Sparkles, node:
                <span className="text-sm font-mono text-[#8b9bb4] break-all block" title={opp.noticeId}>{opp.noticeId}</span> },
          ] as const).map(({ label, Icon, node }) => (
            <div key={label} className={`flex items-start gap-3.5 min-w-0 ${label === 'Set-Aside' || label === 'Notice ID' || label === 'Agency' ? 'col-span-2 sm:col-span-1' : ''}`}>
              <Icon size={13} className="text-[#64748b] shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-[#64748b] leading-none mb-1.5">{label}</p>
                {node}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {!isPreview && summary && (
        <div className="relative z-10 mt-5">
          <p className="text-xs font-medium text-[#8b9bb4] mb-2">Notice summary</p>
          <p className="text-sm text-[#a0b2c8] leading-relaxed max-w-[65ch]">{summary}</p>
        </div>
      )}

      <div className="flex-1 min-h-[1.25rem]" aria-hidden="true" />

      {/* ── FOOTER: SAM.gov link + single signup CTA (no Bookmark / Start Pursuit / Summarize) ── */}
      <div className="relative z-10 w-full border-t border-[#1e2d4a] pt-4 flex items-center justify-between gap-3 flex-wrap">
        <a
          href={`https://sam.gov/opp/${encodeURIComponent(opp.noticeId)}/view`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onTrack?.('analyzer_card_sam_clicked')}
          className="flex items-center gap-1.5 text-xs font-medium text-[#67e8f9] hover:text-[#a5f3fc] transition-colors shrink-0"
        >
          <ExternalLink size={13} /> View on SAM.gov
        </a>
        {!isPreview && (
          <Link
            to="/signup/?promo=fall2026"
            onClick={() => onTrack?.('analyzer_card_signup_clicked')}
            className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-lg font-headline font-bold text-sm bg-[#00c3ff] text-[#030B17] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
          >
            {notBiddable ? 'Find Open Opportunities' : 'Score against my business'}
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
