import { Eye, CheckCircle2, AlertTriangle } from 'lucide-react';

/**
 * Static "what you get back" preview for the analyzer hero — the FALLBACK.
 * The hero prefers a real cached analysis rendered by AnalyzerOpportunityCard;
 * this stands in when the server has no fresh analysis for the current sample
 * notice (rotated pick, cold cache), so the hero is never empty.
 *
 * Purpose: paid and organic traffic lands on a bare input field with no idea what
 * the tool returns. This shows the shape of the real verdict before the click.
 *
 * Honesty rules this component follows:
 *  - No invented notice, agency, or ID — it previews the OUTPUT STRUCTURE, not a
 *    fake record. The only numbers shown are illustrative and labelled as such.
 *  - Every string is copied verbatim from AnalyzerOpportunityCard's band / DIM_DESC
 *    maps, and the scored dimensions match its DIMS list, so the preview cannot
 *    drift into promising language or coverage the real card never emits.
 *  - Deliberately subordinate to the real card: smaller score, no CTA, no hover
 *    lift, and the page unmounts it the moment a real result exists, so the screen
 *    never carries two decision objects at once.
 *
 * Type floor: nothing here renders below 14px (UI_SCORECARD category 7).
 */

// The two column labels are locked to the same height so their first evidence rows
// share a baseline. Only 1024-1279px wraps 'Watch Before Pursuing' to two lines; above
// the max-w-7xl cap both fit on one line, so the reserve is released at xl.
//
// The five dimensions the public scorer actually emits — mirrors DIMS in
// AnalyzerOpportunityCard.tsx. Keep in sync with it, not with the app-side scorer.
const SCORED_ON = ['Capability', 'Keywords', 'Set-Aside', 'Agency', 'Timing'];

export default function AnalyzerOutputPreview() {
  return (
    <div className="rounded-2xl border border-[#1e2d4a] bg-[#0b1120] p-5 shadow-2xl">

      {/* Header label lives in the hero wrapper, which also labels the live card. */}

      {/* ── Score ── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="block text-sm font-bold uppercase tracking-wider text-[#8b9bb4]">Pursuit Fit</span>
          <div className="leading-none mt-1.5">
            <span className="text-4xl font-black tabular-nums tracking-tight text-white">73</span>
            <span className="text-base font-bold text-[#8b9bb4]"> / 100</span>
          </div>
        </div>
        <div className="text-right">
          <div className="w-16 h-1 bg-[#1e2d4a] rounded-full overflow-hidden ml-auto">
            <div className="h-full rounded-full bg-[#00c3ff]" style={{ width: '73%' }} />
          </div>
          <span className="block text-sm font-bold text-[#00c3ff] mt-1.5">Moderate Fit</span>
        </div>
      </div>

      {/* ── Decision band ── */}
      <div
        className="mt-4 rounded-xl border px-4 py-3 flex items-start justify-between gap-4"
        style={{ background: '#00c3ff10', borderColor: '#00c3ff40' }}
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#00c3ff1f' }}>
            <Eye size={18} strokeWidth={2.5} className="text-[#00c3ff]" />
          </div>
          <div className="min-w-0">
            <span className="block text-sm font-headline font-black tracking-[0.1em] uppercase text-[#00c3ff]">
              Worth Reviewing
            </span>
            <p className="font-body text-sm text-white leading-snug mt-1">
              Solid potential. Verify the weaker dimensions before committing resources.
            </p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold uppercase tracking-wider text-[#8b9bb4]">Confidence</p>
          <p className="text-sm font-bold text-white mt-0.5 whitespace-nowrap">Strong evidence</p>
        </div>
      </div>

      {/* ── Why it fits / watch before pursuing ── */}
      <div className="mt-4 border-t border-[#1e2d4a] pt-4 flex gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold uppercase tracking-wider text-[#8b9bb4] min-h-10 xl:min-h-0 mb-2">Why It Fits</p>
          <div className="space-y-2.5">
            {[
              'NAICS code closely matches the requirement',
              'Set-aside type aligns with this profile',
            ].map(label => (
              <div key={label} className="flex items-start gap-2.5">
                <CheckCircle2 size={14} className="text-[#4ade80] shrink-0 mt-1" />
                <span className="text-sm font-semibold text-white leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-0 border-l border-[#1e2d4a] pl-4">
          <p className="text-sm font-bold uppercase tracking-wider text-[#8b9bb4] min-h-10 xl:min-h-0 mb-2">Watch Before Pursuing</p>
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={14} className="text-[#f5a623] shrink-0 mt-1" />
            <span className="text-sm text-[#cbd5e1] leading-snug">Tight timeline may strain pursuit resources</span>
          </div>
        </div>
      </div>

      {/* ── What the score is built from — the dimensions as first-class objects,
             not a claim buried in the disclaimer. ── */}
      <div className="mt-4 border-t border-[#1e2d4a] pt-4">
        <p className="text-sm font-bold uppercase tracking-wider text-[#8b9bb4] mb-2.5">Scored On</p>
        <div className="flex flex-wrap gap-1.5">
          {SCORED_ON.map(dim => (
            <span
              key={dim}
              className="inline-flex items-center px-2 py-0.5 rounded border border-[#1e2d4a] bg-[#060e1c] text-sm text-[#cbd5e1]"
            >
              {dim}
            </span>
          ))}
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <p className="mt-4 border-t border-[#1e2d4a] pt-4 text-sm text-[#8b9bb4] font-body leading-relaxed">
        Illustrative sample. A live result adds the notice details, the scored breakdown,
        and a link to the notice on SAM.gov.
      </p>
    </div>
  );
}
