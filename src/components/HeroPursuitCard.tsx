import { Layers, Hash, Shield, Landmark, MapPin, DollarSign, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

/**
 * Static hero opportunity card — a faithful render of HE Pursuit's real decision card.
 * No animation; used as the hero's right-column visual.
 */

const IDENTITY = [
  { Icon: Layers, text: '541611 — Administrative Management an...' },
  { Icon: Hash, text: 'Outreach' },
  { Icon: Shield, text: 'Total Small Business Set-Aside (FAR 19.5)' },
  { Icon: Landmark, text: 'DEPT OF THE ARMY' },
];

const WHY = [
  'NAICS code closely matches the requirement',
  'Strong alignment with this agency',
  'Scope language aligns well with your profile',
  'Work location matches your operating area',
  'Contract value fits your target range',
];

export default function HeroPursuitCard() {
  return (
    <div className="relative w-full max-w-[620px] mx-auto">
      {/* soft cyan glow behind the card */}
      <div className="absolute inset-0 bg-[#00c3ff]/8 blur-2xl -z-10 rounded-[3rem]" />

      <div className="he-animated-border relative isolate rounded-2xl border border-[#1e2d4a] bg-[#0b1120] p-5 shadow-2xl">

        {/* Header */}
        <div className="flex items-start gap-3 pb-4 border-b border-[#1e2d4a]">
          <div className="w-12 h-12 rounded-full border border-[#2a3a5c] bg-gradient-to-b from-[#13203a] to-[#0b1120] flex items-center justify-center shrink-0">
            <div className="w-9 h-9 rounded-full border border-[#b58500]/50 flex items-center justify-center bg-[#b58500]/10">
              <Landmark size={15} className="text-[#d4a017]" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[13.5px] font-black text-white leading-snug line-clamp-2">
              Right-of-Entry (ROE) Management &amp; Outreach, Guam &amp; Commonwealth of the Northern Mariana Islands (CNMI), for t...
            </h3>
            <p className="text-[10px] font-bold text-[#8b9bb4] uppercase tracking-wide mt-1">Dept of the Army</p>
            <p className="text-[11px] text-[#6b7a93] leading-snug mt-0.5">Administrative Management and General Management Consulting Services</p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide bg-[#0a2a3a] border border-[#15506a] text-[#5cc7e8]">
              Combined Synopsis / Solicitation
            </span>
          </div>
          <div className="shrink-0 flex flex-col items-end pt-0.5">
            <div className="flex items-baseline">
              <span className="text-5xl font-black tabular-nums leading-none tracking-tighter text-white">82</span>
              <span className="text-2xl font-black text-[#8b9bb4]">%</span>
            </div>
            <div className="flex flex-col items-end mt-1.5">
              <div className="h-[3px] w-14 rounded bg-[#4ade80] mb-1" />
              <span className="text-[13px] font-bold text-[#4ade80]">Strong Fit</span>
            </div>
            <span className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#d4a017]">
              <Clock size={11} /> Due Jun 5, 2026
            </span>
          </div>
        </div>

        {/* Body — two columns */}
        <div className="flex gap-5 pt-4">
          {/* Left */}
          <div className="flex-1 min-w-0 space-y-4">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-2.5">Contract Identity</h4>
              <div className="space-y-2">
                {IDENTITY.map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <Icon size={13} className="text-[#00c3ff] shrink-0" />
                    <span className="text-[12px] text-[#cdd9ea] truncate">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-2.5">Operational Fit</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <MapPin size={13} className="text-[#00c3ff] shrink-0" />
                  <span className="text-[12px] text-[#6b7a93] italic">Not disclosed — low risk if remote-eligible</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <DollarSign size={13} className="text-[#00c3ff] shrink-0" />
                  <span className="text-[12px] text-[#6b7a93] italic">Not posted — request pre-sol estimate</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={13} className="text-[#d4a017] shrink-0" />
                  <span className="text-[12px] text-[#d4a017]">Due Jun 5, 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="w-[48%] border-l border-[#1e2d4a] pl-5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-2.5">Recommendation</h4>
            <div className="flex gap-2 mb-3">
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#06261A] border border-[#0A402B] text-[13px] font-black text-white">
                <CheckCircle2 size={14} className="text-[#4ade80]" /> GO
              </span>
              <span className="flex items-center px-3 py-2 rounded-lg bg-[#0f1a2e] border border-[#1e2d4a] text-[11px] font-bold text-[#8b9bb4]">
                Strong Evidence
              </span>
            </div>
            <p className="text-[11.5px] text-[#a0b2c8] leading-relaxed mb-3">
              Recommend full pursuit analysis. Strong alignment across key evaluation dimensions.
            </p>

            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-2.5">Why this scored 82%</h4>
            <div className="space-y-2">
              {WHY.map((w) => (
                <div key={w} className="flex items-start gap-2">
                  <CheckCircle2 size={12} className="text-[#4ade80] shrink-0 mt-0.5" />
                  <span className="text-[11.5px] text-white leading-snug">{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-[#1e2d4a] pt-4 mt-4">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold text-[#6b7a93]">May 20, 2026</span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#8b9bb4]">
              <ArrowRight size={12} className="-rotate-45" /> SAM.gov
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1e2d4a] text-[#8b9bb4] text-[11px] font-bold">
              <span className="rotate-90">⚑</span> Bookmark
            </span>
            <span className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#00c3ff] text-[#030B17] text-[12px] font-black shadow-[0_0_26px_rgba(0,195,255,0.35)]">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#030B17] flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-[#030B17]" />
              </span>
              Start Pursuit
            </span>
          </div>
        </div>
        <p className="text-center text-[10.5px] text-[#6b7a93] mt-3">Run the full bid/no-bid workflow.</p>
      </div>
    </div>
  );
}
