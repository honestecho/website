import {
  Eye, AlertTriangle, CheckCircle2, Calendar, Clock, Landmark,
  FileText, Layers, Shield, ArrowRight, ExternalLink, Bookmark, Sparkles,
} from 'lucide-react';

/**
 * Static hero opportunity card — a faithful render of HE Pursuit's real decision card.
 * No animation on the content; the spinning cyan perimeter comes from `he-animated-border`.
 * Used as the hero's right-column visual.
 */

const WHY = [
  'NAICS 541519 is one of your primary codes — award-proven match',
  'SDVOSB set-aside matches your certification',
  'Early stage — time to shape the requirement before the RFP',
  '"Encryption" appears in the title',
];

// grid fills row-by-row → order so left col = Posted/Due/Agency, right col = Type/NAICS/Set-Aside
const DETAILS: { Icon: typeof Calendar; label: string; value: string; accent?: boolean }[] = [
  { Icon: Calendar, label: 'Posted',      value: 'Jun 12, 2026' },
  { Icon: FileText, label: 'Notice Type', value: 'Sources Sought' },
  { Icon: Clock,    label: 'Due',         value: 'Jun 23, 2026' },
  { Icon: Layers,   label: 'NAICS',       value: '541519 — Other Computer Related Services', accent: true },
  { Icon: Landmark, label: 'Agency',      value: 'VETERANS AFFAIRS, DEPARTMENT OF' },
  { Icon: Shield,   label: 'Set-Aside',   value: 'SDVOSB — Service-Disabled Veteran-Owned …', accent: true },
];

export default function HeroPursuitCard() {
  return (
    <div className="relative w-full max-w-[620px] mx-auto">
      {/* soft cyan glow behind the card */}
      <div className="absolute inset-0 bg-[#00c3ff]/8 blur-2xl -z-10 rounded-[3rem]" />

      <div className="he-animated-border relative isolate rounded-2xl border border-[#1e2d4a] bg-[#0b1120] p-5 shadow-2xl">

        {/* ── Header ── */}
        <div className="flex items-start gap-3 pb-4 border-b border-[#1e2d4a]">
          {/* Agency seal */}
          <div className="w-12 h-12 rounded-full border border-[#2a3a5c] bg-gradient-to-b from-[#13203a] to-[#0b1120] flex items-center justify-center shrink-0">
            <div className="w-9 h-9 rounded-full border border-[#b58500]/50 flex items-center justify-center bg-[#b58500]/10">
              <Landmark size={15} className="text-[#d4a017]" />
            </div>
          </div>

          {/* Title + agency + badges */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-black text-white leading-snug">Zero Trust Encryption RFI</h3>
            <p className="text-[10px] font-bold text-[#8b9bb4] uppercase tracking-wide mt-1">Veterans Affairs, Department Of</p>
            <p className="text-[11px] text-[#8b9bb4] leading-snug mt-0.5">Other Computer Related Services</p>
            <div className="flex items-center gap-2 flex-wrap mt-2.5">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide bg-[#0a2a3a] border border-[#15506a] text-[#5cc7e8]">
                Sources Sought
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide bg-[#2a1f00] border border-[#5a4500] text-[#d4a017]">
                <Clock size={9} /> Due Jun 23, 2026
              </span>
            </div>
          </div>

          {/* Score */}
          <div className="shrink-0 flex flex-col items-end pt-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4]">Pursuit Fit</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-5xl font-black tabular-nums leading-none tracking-tighter text-white">73</span>
              <span className="text-lg font-bold text-[#8b9bb4]">/ 100</span>
            </div>
            <span className="text-[12px] font-bold text-[#d4a017] mt-1.5">Moderate Fit</span>
          </div>
        </div>

        {/* ── Recommendation band ── */}
        <div className="mt-4 rounded-xl border border-[#1e2d4a] bg-[#0d1526] px-4 py-3 flex items-start justify-between gap-4">
          <div className="flex items-start gap-2.5 min-w-0">
            <Eye size={16} className="text-[#00c3ff] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[12px] font-black uppercase tracking-wide text-[#00c3ff] leading-none mb-1.5">Worth Reviewing</p>
              <p className="text-[12px] text-[#cdd9ea] leading-snug">Solid potential. Verify agency alignment before committing resources.</p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-0.5">Confidence</p>
            <p className="text-[12px] font-bold text-white whitespace-nowrap">Strong evidence</p>
          </div>
        </div>

        {/* ── Body — two columns ── */}
        <div className="flex gap-5 pt-4">
          {/* Why it fits */}
          <div className="flex-1 min-w-0">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-2.5">Why It Fits</h4>
            <div className="space-y-2">
              {WHY.map((w) => (
                <div key={w} className="flex items-start gap-2">
                  <CheckCircle2 size={12} className="text-[#4ade80] shrink-0 mt-0.5" />
                  <span className="text-[11.5px] text-[#cdd9ea] leading-snug">{w}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Watch before pursuing */}
          <div className="w-[42%] border-l border-[#1e2d4a] pl-5 flex flex-col">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-2.5">Watch Before Pursuing</h4>
            <div className="flex items-start gap-2">
              <AlertTriangle size={12} className="text-[#d4a017] shrink-0 mt-0.5" />
              <span className="text-[11.5px] text-[#a0b2c8] leading-snug">VETERANS AFFAIRS, DEPARTMENT OF is not in your 50 target agencies</span>
            </div>
            <span className="mt-auto pt-3 self-end flex items-center gap-1 text-[11px] font-semibold text-[#00c3ff]">
              Review your profile <ArrowRight size={11} />
            </span>
          </div>
        </div>

        {/* ── Notice details ── */}
        <div className="border-t border-[#1e2d4a] pt-4 mt-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-3">Notice Details</h4>
          <div className="grid grid-cols-2 gap-x-5 gap-y-3.5">
            {DETAILS.map(({ Icon, label, value, accent }) => (
              <div key={label} className="flex items-start gap-2.5 min-w-0">
                <Icon size={13} className="text-[#8b9bb4] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-0.5">{label}</p>
                  <p className={`text-[11.5px] truncate ${accent ? 'text-[#00c3ff]' : 'text-[#cdd9ea]'}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-between items-center border-t border-[#1e2d4a] pt-4 mt-4">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8b9bb4]">
            <ExternalLink size={12} /> View on SAM.gov
          </span>
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1e2d4a] text-[#8b9bb4] text-[11px] font-bold">
              <Bookmark size={13} /> Bookmark
            </span>
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00c3ff] text-[#030B17] text-[12px] font-black shadow-[0_0_26px_rgba(0,195,255,0.35)]">
              <Sparkles size={13} /> Summarize Action
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
