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

const DIMS: { key: string; weightKey: string; Icon: LucideIcon; tip: string; max: number }[] = [
  { key: 'naics',            weightKey: 'naics',        Icon: Layers,    tip: 'Capability Fit', max: 20 },
  { key: 'keywords',         weightKey: 'keywords',     Icon: Hash,      tip: 'Keyword Fit',    max: 10 },
  { key: 'set_aside',        weightKey: 'set_aside',    Icon: Shield,    tip: 'Set-Aside Fit',  max: 15 },
  { key: 'agency',           weightKey: 'agency',       Icon: Landmark,  tip: 'Agency Fit',     max: 10 },
  { key: 'geo',              weightKey: 'geographic',   Icon: Clock,     tip: 'Geographic Fit', max: 10 },
  { key: 'value',            weightKey: 'dollar_value', Icon: Clock,     tip: 'Value Fit',      max: 10 },
  { key: 'timing',           weightKey: 'timing',       Icon: Clock,     tip: 'Timing Fit',     max: 10 },
  { key: 'past_performance', weightKey: 'synergy',      Icon: Sparkles,  tip: 'Synergy Bonus',  max: 15 },
];

const DEFAULT_WEIGHTS: Record<string, number> = {
  naics: 20, keywords: 10, set_aside: 15, agency: 10,
  geographic: 10, dollar_value: 10, timing: 10, synergy: 15,
};

const DIM_DESC: Record<string, { pos: string; neg: string }> = {
  naics:            { pos: 'NAICS code closely matches the requirement',        neg: 'NAICS suggests specialized experience may be needed'    },
  keywords:         { pos: 'Scope language aligns well with this profile',      neg: 'Opportunity likely requires deeper qualification review' },
  set_aside:        { pos: 'Set-aside type aligns with this profile',           neg: 'Set-aside may affect eligibility'                       },
  agency:           { pos: 'Strong alignment with this agency',                 neg: 'Limited prior activity with this agency'                },
  timing:           { pos: 'Response window allows a quality response',         neg: 'Tight timeline may strain pursuit resources'            },
  past_performance: { pos: 'Past-performance synergy assumed for this sample',  neg: 'Limited past performance signal'                        },
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
  const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const daysLeft = past ? -1 : Math.ceil((d.getTime() - now) / 86_400_000);
  const color = past ? '#f87171' : daysLeft < 7 ? '#f5a623' : daysLeft <= 60 ? '#8b9bb4' : '#4ade80';
  return { label, color, past };
}

interface EvidenceRow { key: string; label: string }

// ── Component ─────────────────────────────────────────────────────────────────
export default function AnalyzerOpportunityCard({ opportunity, score, onTrack }: {
  opportunity: AnalyzerOpportunity;
  score: AnalyzerProfileScore;
  onTrack?: (event: string) => void;
}) {
  const opp = opportunity;
  const dimension_scores = score.dimension_scores || {};
  const computed = Number.isFinite(score.match_score)
    ? Math.round(score.match_score)
    : computeLiveScore(dimension_scores);
  const abbr = agencyAbbr(opp.agency);
  const agency = agencyDisplay(opp.agency);
  const due = dueInfo(opp.dueDate);
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  const chipBase = 'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border whitespace-nowrap';

  // Fit band (rule 2 + 3): 100-point score, not a percentage.
  const fit = computed >= 90 ? { label: 'Excellent Fit', color: '#4ade80' }
    : computed >= 80 ? { label: 'Strong Fit',   color: '#4ade80' }
    : computed >= 65 ? { label: 'Moderate Fit', color: '#00c3ff' }
    : computed >= 50 ? { label: 'Weak Fit',     color: '#f5a623' }
    :                  { label: 'Poor Fit',     color: '#f87171' };

  // Credibility gate: a terminal/non-biddable notice type or a past-due deadline
  // must never render a score-derived "pursue" verdict.
  const NON_BIDDABLE_RE = /award|justification|j&a|j\s*&\s*a|intent to bundle|sale of surplus/i;
  const notBiddable = (opp.maturity != null && NON_BIDDABLE_RE.test(opp.maturity)) || due.past;

  // Confidence = signal strength (how much of the profile actually scored).
  let strongDimCount = 0;
  let totalDimCount = 0;
  for (const dim of DIMS) {
    if (dim.key === 'geo' || dim.key === 'value') continue; // no data on the public notice — don't penalize
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
  //    public card). geo/value carry no data end-to-end, so they're excluded from
  //    the evidence read rather than scored as misses.
  type Band = { Icon: LucideIcon; color: string; label: string; reason: string };
  const band: Band = notBiddable
    ? { Icon: XCircle, color: '#8b9bb4', label: 'NOT BIDDABLE', reason: 'This notice is awarded or closed. It is no longer open for response.' }
    : computed >= 90 ? { Icon: CheckCircle2, color: '#4ade80', label: 'STRONG CANDIDATE',
        reason: 'Top-tier match. Strong alignment across capability, eligibility, and timing. Recommend running the full pursuit analysis.' }
    : computed >= 80 ? { Icon: CheckCircle2, color: '#4ade80', label: 'STRONG CANDIDATE',
        reason: 'Strong alignment across the key evaluation dimensions. Recommend running the full pursuit analysis.' }
    : computed >= 65 ? { Icon: Eye, color: '#00c3ff', label: 'WORTH REVIEWING',
        reason: 'Solid potential. Verify the weaker dimensions before committing resources.' }
    : computed >= 50 ? { Icon: AlertTriangle, color: '#f5a623', label: 'REVIEW WITH CAUTION',
        reason: 'Mixed signals. Confirm eligibility and capability gaps before investing pursuit time.' }
    :                  { Icon: Eye, color: '#8b9bb4', label: 'LOW PRIORITY',
        reason: 'Profile alignment is weak for this sample. Review only if the opportunity is strategically important.' };
  const BandIcon = band.Icon;

  // ── Evidence vs risk ── built from scored dimensions only (geo/value excluded:
  //    the public notice carries no place-of-performance or value data).
  const evidenceDims = DIMS.filter(d => d.key !== 'geo' && d.key !== 'value');
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

  return (
    <div className="group/card rounded-2xl border border-[#1e2d4a] bg-[#0b1120] flex flex-col p-6 h-full transition-all duration-500 relative overflow-hidden hover:-translate-y-1 hover:border-[#00c3ff]/40 hover:shadow-[0_10px_40px_-5px_rgba(0,195,255,0.12)]">
      <div className="absolute inset-x-0 top-0 h-[2px] pointer-events-none transition-opacity duration-500 opacity-0 group-hover/card:opacity-100 rounded-t-2xl"
        style={{ background: 'linear-gradient(to right, transparent, rgba(0,195,255,0.4), transparent)' }} />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.04)_0%,transparent_60%)]" />

      {/* ── HEADER ── */}
      <div className="relative z-10 flex items-start gap-4 w-full mb-1">
        {/* Agency badge */}
        <div className="w-14 h-14 rounded-xl border border-[#1e2d4a] bg-[#0f1a2e] flex items-center justify-center shrink-0 relative overflow-visible" title={opp.agency}>
          <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-0 group-hover/card:opacity-15 transition-opacity duration-500 rounded-xl scale-125" />
          <span className="text-xs font-black tracking-wider text-[#00c3ff] relative z-10 transition-all duration-500 group-hover/card:scale-105 group-hover/card:drop-shadow-[0_0_12px_rgba(0,195,255,0.4)]">{abbr}</span>
        </div>

        {/* Title → agency → metadata chips */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <h3 className="text-[17px] font-headline font-black text-white leading-snug truncate" title={opp.title}>
            {opp.title || 'Untitled notice'}
          </h3>
          <span className="text-sm font-bold text-[#8b9bb4] uppercase tracking-wider line-clamp-1" title={opp.agency}>{agency}</span>
          <div className="flex items-center gap-1.5 flex-nowrap mt-1.5 min-w-0">
            {opp.maturity && (
              <span className={`${chipBase} bg-[#5b8cff]/10 text-[#5b8cff] border-[#5b8cff]/30 min-w-0 truncate`} title={displayMaturity(opp.maturity)}>
                {displayMaturity(opp.maturity)}
              </span>
            )}
            {due.label && (
              <span className={`${chipBase} ml-auto shrink-0`} style={{ color: due.color, borderColor: `${due.color}55` }} title={`Response due ${due.label}`}>
                <Calendar size={11} />
                {due.past ? 'Expired' : `Due ${due.label}`}
              </span>
            )}
          </div>
        </div>

        {/* Right: 100-point fit score + hover breakdown */}
        <div className="shrink-0 flex flex-col items-end text-right relative group/score">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b9bb4]">Pursuit Fit</span>
          <button
            type="button"
            aria-expanded={breakdownOpen}
            aria-label="Toggle score breakdown"
            onClick={() => setBreakdownOpen(o => !o)}
            className="leading-none mt-1 bg-transparent border-0 p-0 cursor-help focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] rounded"
          >
            <span className="text-[40px] font-black tabular-nums tracking-tight text-white">{computed}</span>
            <span className="text-lg font-bold text-[#8b9bb4]"> / 100</span>
          </button>
          <div className="w-16 h-1 bg-[#1e2d4a] rounded-full overflow-hidden mt-2">
            <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, computed))}%`, background: fit.color }} />
          </div>
          <span className="text-xs font-bold mt-1" style={{ color: fit.color }}>{fit.label}</span>

          {Object.keys(dimension_scores).length > 0 && (
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

      {/* ── DECISION BAND ── */}
      <div className="relative z-10 mt-5 rounded-xl border px-4 py-3 flex items-center justify-between gap-4"
        style={{ background: `${band.color}10`, borderColor: `${band.color}40` }}>
        <div className="flex items-start gap-3 min-w-0">
          <div className="relative shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5" style={{ background: `${band.color}1f` }}>
            <BandIcon size={18} strokeWidth={2.5} style={{ color: band.color }} />
          </div>
          <div className="min-w-0">
            <span className="block text-sm font-headline font-black tracking-[0.1em] uppercase whitespace-nowrap" style={{ color: band.color }}>{band.label}</span>
            <p className="font-body text-sm text-white leading-snug mt-1 line-clamp-2 min-h-[2.5rem]">{band.reason}</p>
          </div>
        </div>
        {confidenceLabel && (
          <div className="shrink-0 text-right cursor-help"
            title={`Confidence = how complete the evidence is, not how good the fit is — ${strongDimCount} of ${totalDimCount} scoring dimensions had data. Separate from the recommendation.`}>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8b9bb4]">Confidence</p>
            <p className="text-sm font-bold text-white mt-0.5 whitespace-nowrap">{confidenceLabel}</p>
          </div>
        )}
      </div>

      {/* ── EVIDENCE vs RISK ── 50/50 split */}
      <div className="relative z-10 mt-5 border-t border-[#1e2d4a] pt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="min-w-0 flex flex-col">
          <p className="text-sm font-bold uppercase tracking-wider text-[#8b9bb4] mb-2.5">Why It Fits</p>
          {fits.length > 0 ? (
            <div className="space-y-2.5">
              {fits.slice(0, MAX).map(row => (
                <div key={row.key} className="flex items-start gap-3">
                  <CheckCircle2 size={14} className="text-[#4ade80] shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-white leading-snug line-clamp-2 min-w-0">{row.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#94a3b8] leading-snug">No strong positive signals on this notice yet.</p>
          )}
        </div>

        <div className="min-w-0 md:border-l md:border-[#1e2d4a] md:pl-5 flex flex-col">
          <p className="text-sm font-bold uppercase tracking-wider text-[#8b9bb4] mb-2.5">Watch Before Pursuing</p>
          {watches.length > 0 ? (
            <div className="space-y-2.5">
              {watches.slice(0, MAX).map(row => (
                <div key={row.key} className="flex items-start gap-3">
                  <AlertTriangle size={14} className="text-[#f5a623] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#cbd5e1] leading-snug line-clamp-2 min-w-0">{row.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <CheckCircle2 size={14} className="text-[#4ade80] shrink-0 mt-0.5" />
              <span className="text-sm text-[#cbd5e1] leading-snug">No blocking concerns identified for this sample.</span>
            </div>
          )}
        </div>
      </div>

      {/* ── NOTICE DETAILS ── */}
      <div className="relative z-10 mt-5 border-t border-[#1e2d4a] pt-5">
        <p className="text-sm font-bold uppercase tracking-wider text-[#8b9bb4] mb-4">Notice Details</p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {([
            { label: 'Notice Type', Icon: Hash, node: opp.maturity
                ? <span className="text-sm text-white truncate block" title={displayMaturity(opp.maturity)}>{displayMaturity(opp.maturity)}</span>
                : <span className="text-sm text-[#a0b2c8]">Not stated</span> },
            { label: 'Due', Icon: Clock, node: due.label
                ? <span className="text-sm text-white truncate block">{due.past ? 'Expired' : due.label}</span>
                : <span className="text-sm text-[#a0b2c8]">No deadline set</span> },
            { label: 'NAICS', Icon: Layers, node: opp.naics
                ? <span className="text-sm font-mono text-[#00c3ff] truncate block" title={opp.naics}>{opp.naics}</span>
                : <span className="text-sm text-[#a0b2c8]">Not stated</span> },
            { label: 'Agency', Icon: Landmark, node:
                <span className="text-sm text-white truncate block" title={opp.agency}>{agency}</span> },
            { label: 'Set-Aside', Icon: Shield, node: (() => {
                const sa = opp.setAside;
                if (!sa) return <span className="text-sm text-[#a0b2c8]">Open competition</span>;
                const acr = abbrevSetAside(sa);
                const full = SET_ASIDE_FULL[acr];
                return (
                  <span className="text-sm truncate block" title={full ? `${acr} — ${full}` : sa}>
                    <span className="text-[#00c3ff]">{acr}</span>
                    {full && <span className="text-white"> — {full}</span>}
                  </span>
                );
              })() },
            { label: 'Notice ID', Icon: Sparkles, node:
                <span className="text-sm font-mono text-[#8b9bb4] truncate block" title={opp.noticeId}>{opp.noticeId}</span> },
          ] as const).map(({ label, Icon, node }) => (
            <div key={label} className="flex items-start gap-3.5 min-w-0">
              <Icon size={14} className="text-[#8b9bb4] shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8b9bb4] leading-none mb-1.5">{label}</p>
                {node}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[1.25rem]" aria-hidden="true" />

      {/* ── FOOTER: SAM.gov link + single signup CTA (no Bookmark / Start Pursuit / Summarize) ── */}
      <div className="relative z-10 w-full border-t border-[#1e2d4a] pt-5 flex items-center justify-between gap-3 flex-wrap">
        <a
          href={`https://sam.gov/opp/${encodeURIComponent(opp.noticeId)}/view`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onTrack?.('analyzer_card_sam_clicked')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#8b9bb4] hover:text-[#00c3ff] transition-colors shrink-0"
        >
          <ExternalLink size={13} /> View on SAM.gov
        </a>
        <Link
          to="/signup/?promo=summer2026"
          onClick={() => onTrack?.('analyzer_card_signup_clicked')}
          className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-lg font-headline font-bold text-sm bg-[#00c3ff] text-[#030B17] shadow-[0_0_15px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
        >
          {notBiddable ? 'Find Open Opportunities' : 'Score Your Own Profile'}
          <ArrowRight size={14} />
        </Link>
      </div>
      <p className="w-full text-center text-xs text-[#8b9bb4] mt-3 pb-1">Score shown for the selected sample profile. Run the full workflow on your own profile.</p>
    </div>
  );
}
