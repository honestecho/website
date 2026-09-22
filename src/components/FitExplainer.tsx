import { CheckCircle2, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';
import { EXAMPLE, WHY, WATCH, DETAILS } from '../lib/exampleReadout';

/**
 * "See why an opportunity fits" — the hero's example readout, opened up into the
 * three things a visitor should read before trusting a score: why it fits, what
 * needs checking, and where the facts came from. Same product typography as
 * HeroPursuitCard; the numbered markers pair with the annotations beside it.
 * Static render of illustrative values — an example readout, not a live notice.
 */

function Marker({ n }: { n: number }) {
  return (
    <span
      className="w-6 h-6 rounded-[50%] bg-[#00c3ff] text-[#030B17] text-[11px] font-black flex items-center justify-center shrink-0 tabular-nums"
      aria-hidden="true"
    >
      {n}
    </span>
  );
}

export default function FitExplainer() {
  return (
    <div className="relative w-full max-w-[620px] mx-auto rounded-2xl border border-[#1e2d4a] bg-[#0b1120] shadow-2xl overflow-hidden">
      {/* Header: the same opportunity the hero shows */}
      <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-[#1e2d4a]">
        <div className="min-w-0">
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide bg-[#111a2e] border border-[#2a3a5c] text-[#8b9bb4]">
            Example readout
          </span>
          <h3 className="mt-2 text-[15px] font-black text-white leading-snug">{EXAMPLE.title}</h3>
          <p className="text-[10px] font-bold text-[#8b9bb4] uppercase tracking-wide mt-1">{EXAMPLE.agency}</p>
        </div>
        <div className="shrink-0 flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4]">Pursuit Fit</span>
          <span className="flex items-baseline gap-1 mt-0.5">
            <span className="text-4xl font-black tabular-nums leading-none tracking-tighter text-white">{EXAMPLE.score}</span>
            <span className="text-base font-bold text-[#8b9bb4]">/ 100</span>
          </span>
          <span className="text-[12px] font-bold text-[#d4a017] mt-1">{EXAMPLE.fitLabel}</span>
        </div>
      </div>

      {/* 1 — Why it fits */}
      <section className="px-5 py-4 border-b border-[#1e2d4a]" aria-label="Why it fits">
        <div className="flex items-center gap-2.5 mb-2.5">
          <Marker n={1} />
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4]">Why It Fits</h4>
        </div>
        <ul className="space-y-2">
          {WHY.map((w) => (
            <li key={w} className="flex items-start gap-2">
              <CheckCircle2 size={13} className="text-[#4ade80] shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-[12px] text-[#cdd9ea] leading-snug">{w}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 2 — What needs checking */}
      <section className="px-5 py-4 border-b border-[#1e2d4a]" aria-label="Watch before pursuing">
        <div className="flex items-center gap-2.5 mb-2.5">
          <Marker n={2} />
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4]">Watch Before Pursuing</h4>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-2 min-w-0">
            <AlertTriangle size={13} className="text-[#d4a017] shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-[12px] text-[#a0b2c8] leading-snug">
              <span className="sr-only">Caution: </span>
              {WATCH}
            </span>
          </div>
          {/* Static render: the product's control, shown muted so it doesn't read as a live action here */}
          <span className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-[#8b9bb4] whitespace-nowrap">
            Review your profile <ArrowRight size={11} aria-hidden="true" />
          </span>
        </div>
      </section>

      {/* 3 — Where it came from */}
      <section className="px-5 py-4" aria-label="Notice details">
        <div className="flex items-center gap-2.5 mb-3">
          <Marker n={3} />
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4]">Notice Details</h4>
        </div>
        {/* One column on phones so values wrap instead of truncating; two columns (product layout) from sm up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3.5">
          {DETAILS.map(({ Icon, label, value, accent }) => (
            <div key={label} className="flex items-start gap-2.5 min-w-0">
              <Icon size={13} className="text-[#8b9bb4] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-0.5">{label}</p>
                <p title={value} className={`text-[12px] sm:truncate ${accent ? 'text-[#00c3ff]' : 'text-[#cdd9ea]'}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
        <span className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-[#8b9bb4]">
          <ExternalLink size={12} aria-hidden="true" /> View on SAM.gov
        </span>
      </section>
    </div>
  );
}
