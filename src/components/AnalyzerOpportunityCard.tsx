import { Link } from 'react-router-dom';
import {
  Layers, Hash, Shield, Landmark, MapPin, DollarSign, Calendar,
  CheckCircle2, AlertTriangle, XCircle, ExternalLink, ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type Recommendation = 'GO' | 'CONDITIONAL_GO' | 'NO_BID';

interface AnalyzerResult {
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function agencyAbbr(name: string): string {
  return name.split(/[\s.]+/).filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 4);
}

function agencyDisplay(name: string): string {
  return name.split('.').pop()?.trim() || name;
}

// Due date — same 4-tier color logic as the production OpportunityCard:
//   red expired · amber <7d · strong-grey 7–60d · green >60d / none
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

// Small cyan icon with glow-on-hover — matches the production card's RowIcon.
function RowIcon({ Icon, tip }: { Icon: LucideIcon; tip: string }) {
  return (
    <div className="relative group/icon shrink-0 w-5 h-5 flex items-center justify-center cursor-default" title={tip}>
      <div className="absolute inset-0 bg-[#00c3ff] rounded blur-sm opacity-0 group-hover/icon:opacity-30 transition-opacity duration-200" />
      <Icon size={13} className="relative z-10 text-[#00c3ff] group-hover/icon:drop-shadow-[0_0_6px_rgba(56,189,248,0.9)] transition-all duration-200" />
    </div>
  );
}

// Row groups — mirror the production card: Contract Identity + Operational Fit.
const IDENTITY_ROWS = [
  { key: 'naics',    Icon: Layers,   tip: 'Capability Fit' },
  { key: 'keywords', Icon: Hash,     tip: 'Keyword Fit'    },
  { key: 'setaside', Icon: Shield,   tip: 'Set-Aside Fit'  },
  { key: 'agency',   Icon: Landmark, tip: 'Agency Fit'     },
] as const;
const OPERATIONAL_ROWS = [
  { key: 'geo',    Icon: MapPin,     tip: 'Geographic Fit' },
  { key: 'value',  Icon: DollarSign, tip: 'Value Fit'      },
  { key: 'timing', Icon: Calendar,   tip: 'Timing Fit'     },
] as const;

// Decision banner — same tinted-pill family + labels as the production card.
const DEC: Record<Recommendation, { Icon: LucideIcon; classes: string; label: string }> = {
  GO:             { Icon: CheckCircle2,  classes: 'bg-[#4ade80]/10 border-[#4ade80]/30 text-[#4ade80]', label: 'GO'             },
  CONDITIONAL_GO: { Icon: AlertTriangle, classes: 'bg-[#f5a623]/10 border-[#f5a623]/30 text-[#f5a623]', label: 'CONDITIONAL GO' },
  NO_BID:         { Icon: XCircle,       classes: 'bg-[#f87171]/10 border-[#f87171]/30 text-[#f87171]', label: 'NO-GO'          },
};

const ACTION_TEXT: Record<Recommendation, string> = {
  GO:             'Recommend full pursuit analysis. Strong alignment across key evaluation dimensions.',
  CONDITIONAL_GO: 'Proceed with caution. Verify eligibility and capability gaps before committing.',
  NO_BID:         'Do not pursue. Profile alignment is insufficient to justify investment.',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AnalyzerOpportunityCard({ result, onTrack }: {
  result: AnalyzerResult;
  onTrack?: (event: string) => void;
}) {
  // Row values render as plain colored text (pills removed in production 2026-05-20).
  const chip    = 'text-sm';
  const gapText = 'text-sm text-[#4a6080] italic';
  const due     = dueInfo(result.dueDate);
  const dec     = DEC[result.recommendation] ?? DEC.CONDITIONAL_GO;
  const DecisionIcon = dec.Icon;
  const abbr    = agencyAbbr(result.agency);
  const agency  = agencyDisplay(result.agency);

  // Fit band under the score — same 5-band scheme as the production card.
  const fit = result.score >= 90 ? { label: 'Excellent Fit', color: '#4ade80' }
    : result.score >= 80 ? { label: 'Strong Fit',   color: '#4ade80' }
    : result.score >= 65 ? { label: 'Moderate Fit', color: '#00c3ff' }
    : result.score >= 50 ? { label: 'Weak Fit',     color: '#f5a623' }
    :                      { label: 'Poor Fit',     color: '#f87171' };

  // Synthesize factors: inject score-based positives so GO cards aren't all warnings.
  const syntheticPositives: string[] =
    result.recommendation === 'GO'
      ? ['Strong overall fit for this opportunity', 'Score indicates a pursue signal']
      : result.recommendation === 'CONDITIONAL_GO'
      ? ['Opportunity has notable fit signals']
      : [];
  const warningDrivers = result.drivers.slice(0, 5 - syntheticPositives.length);
  const factors = [
    ...syntheticPositives.map(label => ({ label, pos: true })),
    ...warningDrivers.map(label => ({ label, pos: false })),
  ];

  // Row content — same copy/empty-states as the production OpportunityCard.
  const rowContent: Record<string, ReactNode> = {
    naics: result.naics
      ? <span className={`${chip} inline-flex items-center overflow-hidden max-w-full`}>
          <span className="font-mono text-[#00c3ff] shrink-0 whitespace-nowrap">{result.naics}</span>
        </span>
      : <span className={gapText}>No NAICS — verify scope manually</span>,

    keywords: <span className={gapText}>No keyword match — review scope</span>,

    setaside: result.setAside
      ? <span className={`${chip} text-[#00c3ff] overflow-hidden text-ellipsis whitespace-nowrap max-w-full`} title={result.setAside}>{result.setAside}</span>
      : <span className="text-sm text-white/70">Open competition</span>,

    agency: <span className={`${chip} text-[#00c3ff] whitespace-nowrap overflow-hidden text-ellipsis max-w-full inline-block`}>{agency}</span>,

    geo:   <span className={gapText}>Not disclosed — low risk if remote-eligible</span>,
    value: <span className={gapText}>Not posted — request pre-sol estimate</span>,

    timing: due.label
      ? <span className={`${chip} inline-flex items-center gap-1.5 whitespace-nowrap`} style={{ color: due.color }}>
          <Calendar size={11} />
          {due.past ? 'Expired' : 'Due'} {due.label}
        </span>
      : <span className={gapText}>No deadline — monitor for solicitation</span>,
  };

  const renderRows = (rows: readonly { key: string; Icon: LucideIcon; tip: string }[]) =>
    rows.map(row => (
      <div key={row.key} className="h-7 flex items-center gap-3 min-w-0">
        <RowIcon Icon={row.Icon} tip={row.tip} />
        <div className="flex-1 min-w-0 flex items-center overflow-hidden">
          {rowContent[row.key]}
        </div>
      </div>
    ));

  return (
    <div className="group/card rounded-2xl border border-[#1e2d4a] bg-[#0b1120] flex flex-col p-6 transition-all duration-500 relative overflow-hidden hover:-translate-y-1 hover:border-[#00c3ff]/40 hover:shadow-[0_10px_40px_-5px_rgba(0,195,255,0.12)]">
      <div className="absolute inset-x-0 top-0 h-[2px] pointer-events-none transition-opacity duration-500 opacity-0 group-hover/card:opacity-100 rounded-t-2xl"
        style={{ background: 'linear-gradient(to right, transparent, rgba(0,195,255,0.4), transparent)' }} />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.04)_0%,transparent_60%)]" />

      {/* ── HEADER ── */}
      <div className="relative z-10 flex items-start gap-4 w-full mb-3">

        {/* Agency badge */}
        <div className="w-14 h-14 rounded-xl border border-[#1e2d4a] bg-[#0f1a2e] flex items-center justify-center shrink-0 relative overflow-visible" title={result.agency}>
          <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-0 group-hover/card:opacity-15 transition-opacity duration-500 rounded-xl scale-125" />
          <span className="text-xs font-black tracking-wider text-[#00c3ff] relative z-10 transition-all duration-500 group-hover/card:scale-105 group-hover/card:drop-shadow-[0_0_12px_rgba(0,195,255,0.4)]">{abbr}</span>
        </div>

        {/* Title + agency + maturity badge */}
        <div className="flex-1 min-w-0 flex flex-col gap-1 min-h-[120px]">
          <h3 className="text-[17px] font-headline font-black text-white leading-snug line-clamp-2" title={result.title}>
            {result.title || 'Untitled notice'}
          </h3>
          <span className="text-sm font-bold text-[#8b9bb4] uppercase tracking-wider line-clamp-1" title={result.agency}>{agency}</span>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            <span className="px-1.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-[#5b8cff]/10 text-[#5b8cff] border border-[#5b8cff]/30">
              Solicitation
            </span>
          </div>
        </div>

        {/* Score + fit bar + date */}
        <div className="shrink-0 flex flex-col items-end">
          <span className="text-[40px] font-black tabular-nums leading-none tracking-tight text-white">
            {result.score}<span className="text-xl tracking-normal opacity-50">%</span>
          </span>
          <div className="w-16 h-1 bg-[#1e2d4a] rounded-full overflow-hidden mt-1.5">
            <div className="h-full rounded-full" style={{ width: `${result.score}%`, background: fit.color }} />
          </div>
          <span className="text-xs font-bold mt-0.5" style={{ color: fit.color }}>{fit.label}</span>
          {due.label ? (
            <span className="mt-2 text-xs font-semibold tabular-nums flex items-center gap-1 whitespace-nowrap" style={{ color: due.color }}>
              <Calendar size={10} />
              {due.past ? 'Expired' : 'Due'} {due.label}
            </span>
          ) : (
            <span className="mt-2 text-xs text-[#4a6080]">Not Available</span>
          )}
        </div>
      </div>

      {/* ── MIDDLE: grouped rows (left) + recommendation panel (right) ── */}
      <div className="mb-5 flex flex-col md:flex-row gap-6 w-full border-t border-[#1e2d4a] pt-4 relative z-10">

        {/* Left: Contract Identity + Operational Fit */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#8b9bb4] mb-2">Contract Identity</p>
            <div className="space-y-[9px]">{renderRows(IDENTITY_ROWS)}</div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#8b9bb4] mb-2">Operational Fit</p>
            <div className="space-y-[9px]">{renderRows(OPERATIONAL_ROWS)}</div>
          </div>
        </div>

        {/* Right: Recommendation + factors */}
        <div className="flex-1 border-l border-[#1e2d4a] pl-5 flex flex-col gap-3">
          <p className="text-sm font-bold uppercase tracking-wider text-[#8b9bb4]">Recommendation</p>

          <div className="flex flex-col gap-2">
            <span className={`min-w-[170px] self-start inline-flex items-center justify-center gap-2 px-3 py-1 rounded-lg border text-sm font-headline font-black tracking-[0.12em] uppercase whitespace-nowrap ${dec.classes}`}>
              <DecisionIcon size={14} strokeWidth={2.5} />
              {dec.label}
            </span>
            <p className="font-body text-sm text-white leading-snug">{result.summary || ACTION_TEXT[result.recommendation]}</p>
          </div>

          <div className="mt-2">
            <p className="text-sm font-bold uppercase tracking-wider text-[#8b9bb4] mb-2.5">Why this scored {result.score}%</p>
            <div className="space-y-2.5">
              {factors.map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  {f.pos
                    ? <CheckCircle2  size={13} className="text-[#4ade80] shrink-0 mt-0.5" />
                    : <AlertTriangle size={13} className="text-[#f5a623] shrink-0 mt-0.5" />
                  }
                  <span className={`text-sm leading-snug ${f.pos ? 'font-semibold text-white' : 'font-normal text-[#94a3b8]'}`}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: action bar ── */}
      <div className="relative z-10 w-full border-t border-[#1e2d4a] pt-4 mt-auto flex items-center justify-between gap-3 flex-wrap">
        <a
          href={`https://sam.gov/opp/${result.noticeId}/view`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onTrack?.('analyzer_card_sam_clicked')}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-headline font-bold text-sm bg-transparent border border-transparent text-[#8b9bb4] hover:text-[#00c3ff] hover:bg-[#0b1120] transition-all duration-300"
        >
          <ExternalLink size={14} />
          SAM.gov
        </a>
        <Link
          to="/signup"
          onClick={() => onTrack?.('analyzer_card_pursue_clicked')}
          className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-lg font-headline font-bold text-sm bg-[#00c3ff] text-[#030B17] shadow-[0_0_15px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          Pursue This
          <ArrowRight size={14} />
        </Link>
      </div>
      <p className="w-full text-center text-xs text-[#8b9bb4] mt-3 pb-1">Run the full bid/no-bid workflow.</p>
    </div>
  );
}
