import { Link } from 'react-router-dom';
import {
  Layers, Hash, Shield, Landmark, MapPin, DollarSign, Clock, Sparkles,
  CheckCircle2, AlertTriangle, ExternalLink, ArrowRight,
} from 'lucide-react';

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

const SET_ASIDE_ABBREV: [RegExp, string][] = [
  [/sdvosb|service.disabled veteran/i,           'SDVOSB'],
  [/edwosb|economically disadvantaged w[oa]men/i, 'EDWOSB'],
  [/wosb|w[oa]men.owned/i,                        'WOSB'],
  [/vosb|veteran.owned/i,                         'VOSB'],
  [/hubzone/i,                                    'HUBZone'],
  [/8\(a\)/i,                                     '8(a)'],
  [/small business/i,                             'SB'],
];
function abbrevSetAside(s: string): string {
  for (const [re, abbr] of SET_ASIDE_ABBREV) if (re.test(s)) return abbr;
  return s;
}

function dueInfo(dateStr: string | null): { label: string; color: string; past: boolean } {
  if (!dateStr) return { label: '', color: '#8b9bb4', past: false };
  const d = new Date(dateStr);
  const now = Date.now();
  const past = d.getTime() < now;
  const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const daysLeft = past ? -1 : Math.ceil((d.getTime() - now) / 86_400_000);
  const color = past || daysLeft < 7 ? '#f87171' : daysLeft <= 21 ? '#fbbf24' : '#4ade80';
  return { label, color, past };
}

// ── Row icon — matches design system glow pattern ────────────────────────────

function RowIcon({ Icon, tip }: { Icon: React.ElementType; tip: string }) {
  return (
    <div className="relative group/icon shrink-0 w-5 h-5 flex items-center justify-center cursor-default" title={tip}>
      <div className="absolute inset-0 bg-[#00c3ff] rounded blur-sm opacity-0 group-hover/icon:opacity-30 transition-opacity duration-200" />
      <Icon size={13} className="relative z-10 text-[#00c3ff] group-hover/icon:drop-shadow-[0_0_6px_rgba(0,195,255,0.9)] transition-all duration-200" />
    </div>
  );
}

// ── Rows config ───────────────────────────────────────────────────────────────

const ROWS = [
  { key: 'naics',    Icon: Layers,    tip: 'Capability Fit'  },
  { key: 'keywords', Icon: Hash,      tip: 'Keywords'        },
  { key: 'setaside', Icon: Shield,    tip: 'Set-Aside Fit'   },
  { key: 'agency',   Icon: Landmark,  tip: 'Agency'          },
  { key: 'geo',      Icon: MapPin,    tip: 'Geographic Fit'  },
  { key: 'value',    Icon: DollarSign,tip: 'Contract Value'  },
  { key: 'timing',   Icon: Clock,     tip: 'Timing'          },
  { key: 'synergy',  Icon: Sparkles,  tip: 'Synergy'         },
] as const;

// ── Decision config ───────────────────────────────────────────────────────────

const DEC: Record<Recommendation, { bg: string; border: string; text: string; label: string }> = {
  GO:             { bg: 'bg-[#06261A]', border: 'border-[#0A402B]', text: 'text-[#4ade80]',  label: 'GO'             },
  CONDITIONAL_GO: { bg: 'bg-[#2A2000]', border: 'border-[#4A3800]', text: 'text-[#fbbf24]',  label: 'CONDITIONAL GO' },
  NO_BID:         { bg: 'bg-[#2A0505]', border: 'border-[#4A0A0A]', text: 'text-[#f87171]',  label: 'NO-BID'         },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AnalyzerOpportunityCard({ result, onTrack }: {
  result: AnalyzerResult;
  onTrack?: (event: string) => void;
}) {
  const chip    = 'px-2.5 py-1 bg-[#0f1a2e] rounded-lg text-sm border border-[#1e2d4a]';
  const gapText = 'text-sm text-[#4a6080] italic';
  const due     = dueInfo(result.dueDate);
  const dec     = DEC[result.recommendation] ?? DEC.CONDITIONAL_GO;
  const abbr    = agencyAbbr(result.agency);
  const agency  = agencyDisplay(result.agency);

  // Synthesize factors: inject score-based positives so GO cards aren't all warnings
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

  // Row content
  const rowContent: Record<string, React.ReactNode> = {
    naics: result.naics
      ? <span className={`${chip} inline-flex items-center gap-1.5 overflow-hidden max-w-full`}>
          <span className="font-mono text-[#00c3ff] shrink-0 whitespace-nowrap">{result.naics}</span>
        </span>
      : <span className={gapText}>Not specified</span>,

    keywords: <span className={gapText}>No matches</span>,

    setaside: result.setAside
      ? <span className={`${chip} text-[#00c3ff]`}>{abbrevSetAside(result.setAside)}</span>
      : <span className="text-sm text-white/70">Open competition</span>,

    agency: <span className={`${chip} text-[#00c3ff] whitespace-nowrap overflow-hidden text-ellipsis max-w-full inline-block`}>{agency}</span>,

    geo:    <span className={gapText}>Not disclosed</span>,
    value:  <span className={gapText}>Not disclosed</span>,

    timing: due.label
      ? <span className={`${chip} inline-flex items-center gap-1.5 whitespace-nowrap`} style={{ color: due.color }}>
          <Clock size={11} />
          {due.past ? 'Expired' : 'Due'} {due.label}
        </span>
      : <span className={gapText}>No deadline set</span>,

    synergy: (() => {
      const score = result.score;
      const cfg =
        score >= 75 ? { color: '#4ade80', bg: 'bg-[#06261A]', border: 'border-[#0A402B]', label: 'Strong Fit'   } :
        score >= 55 ? { color: '#00c3ff', bg: 'bg-[#001e2d]', border: 'border-[#003a50]', label: 'Moderate Fit' } :
        score >= 35 ? { color: '#fbbf24', bg: 'bg-[#2A2000]', border: 'border-[#4A3800]', label: 'Weak Fit'     } :
                      { color: '#64748b', bg: 'bg-[#0f1a2e]', border: 'border-[#1e2d4a]', label: 'No Signal'    };
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.border}`} style={{ color: cfg.color }}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
          {cfg.label}
        </span>
      );
    })(),
  };

  return (
    <div className="group/card rounded-2xl border border-[#1e2d4a] bg-[#0b1120] flex flex-col p-6 transition-all duration-500 relative overflow-hidden hover:-translate-y-1 hover:border-[#00c3ff]/40 hover:shadow-[0_10px_40px_-5px_rgba(0,195,255,0.12)]">
      <div className="absolute inset-x-0 top-0 h-[2px] pointer-events-none transition-opacity duration-500 opacity-0 group-hover/card:opacity-100 rounded-t-2xl"
        style={{ background: 'linear-gradient(to right, transparent, rgba(0,195,255,0.4), transparent)' }} />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.04)_0%,transparent_60%)]" />

      {/* ── HEADER ── */}
      <div className="relative z-10 flex items-start gap-4 w-full mb-5">

        {/* Agency badge */}
        <div className="w-14 h-14 rounded-xl border border-[#1e2d4a] bg-[#0f1a2e] flex items-center justify-center shrink-0 relative overflow-visible" title={result.agency}>
          <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-0 group-hover/card:opacity-30 transition-opacity duration-500 rounded-xl scale-125" />
          <span className="text-xs font-black tracking-wider text-[#00c3ff] relative z-10 group-hover/card:drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] transition-all duration-500">{abbr}</span>
        </div>

        {/* Title + agency + maturity badge */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <h3 className="text-[17px] font-headline font-black text-white leading-snug line-clamp-2">
            {result.title || 'Untitled notice'}
          </h3>
          <span className="text-sm font-semibold text-white/70">{agency}</span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-1.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-[#120E00] text-[#fbbf24] border border-[#2A2000]">
              Solicitation
            </span>
            <span className={`px-1.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide border ${dec.bg} ${dec.border} ${dec.text}`}>
              {dec.label}
            </span>
          </div>
        </div>

        {/* Score + date */}
        <div className="shrink-0 flex flex-col items-end">
          <span className="text-[40px] font-black tabular-nums leading-none tracking-tight text-white">
            {result.score}<span className="text-xl tracking-normal opacity-50">%</span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-white/60 mt-0.5">Match Score</span>
          {due.label && (
            <span className="text-xs font-semibold tabular-nums flex items-center gap-1 mt-2 whitespace-nowrap" style={{ color: due.color }}>
              <Clock size={10} />
              {due.past ? 'Expired' : 'Due'} {due.label}
            </span>
          )}
        </div>
      </div>

      {/* ── MIDDLE: icon rows (left) + recommendation panel (right) ── */}
      <div className="mb-5 flex gap-6 w-full border-t border-[#1e2d4a] pt-5 relative z-10">

        {/* Left: icon rows */}
        <div className="flex-1 min-w-0 space-y-[9px]">
          {ROWS.map(row => (
            <div key={row.key} className="h-7 flex items-center gap-3 min-w-0">
              <RowIcon Icon={row.Icon} tip={row.tip} />
              <div className="flex-1 min-w-0 flex items-center overflow-hidden">
                {rowContent[row.key]}
              </div>
            </div>
          ))}
        </div>

        {/* Right: recommendation + factors */}
        <div className="shrink-0 w-64 border-l border-[#1e2d4a] pl-5 flex flex-col gap-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4]">Recommendation</p>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${dec.bg} ${dec.border} self-center`}>
            <CheckCircle2 size={13} className={dec.text} />
            <span className={`text-xs font-black uppercase tracking-wider ${dec.text}`}>{dec.label}</span>
          </div>
          <div className="border-t border-[#1e2d4a] pt-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-2.5">Why this scored {result.score}%</p>
            <div className="space-y-2.5">
              {factors.map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  {f.pos
                    ? <CheckCircle2  size={13} className="text-[#4ade80] shrink-0 mt-0.5" />
                    : <AlertTriangle size={13} className="text-[#fbbf24] shrink-0 mt-0.5" />
                  }
                  <span className={`text-xs font-semibold leading-snug ${f.pos ? 'text-white' : 'text-[#94a3b8]'}`}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: action bar ── */}
      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[#1e2d4a] gap-3 flex-wrap">
        <a
          href={`https://sam.gov/opp/${result.noticeId}/view`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onTrack?.('analyzer_card_sam_clicked')}
          className="flex items-center gap-1.5 text-sm text-[#8b9bb4] hover:text-[#00c3ff] transition-colors font-body"
        >
          <ExternalLink size={13} />
          View on SAM.gov
        </a>
        <Link
          to="/signup"
          onClick={() => onTrack?.('analyzer_card_pursue_clicked')}
          className="inline-flex items-center gap-2 px-5 py-2 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg text-sm shadow-[0_0_20px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Pursue This
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
