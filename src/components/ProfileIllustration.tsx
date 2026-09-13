import { Crosshair, Check, HelpCircle } from 'lucide-react';

/**
 * Static render of HE Pursuit's Scoring Alignment Check (the profile reading a
 * new account confirms after onboarding), used on the home page beside
 * "How Pursuit works". Shows what a user inputs (step 01) and the first likely
 * match it produces (step 02). Illustrative values.
 */

const PROFILE: { label: string; value: string; sub?: string }[] = [
  { label: 'You sell',     value: 'Custom Computer Programming Services · Computer Systems Design Services · Other Computer Related Services', sub: '541511 · 541512 · 541519' },
  { label: 'What you do',  value: 'Zero Trust · Cybersecurity · Cloud Migration · Systems Integration · Identity Management +12' },
  { label: 'To',           value: 'DoD · VA · DHS' },
  { label: 'Competing as', value: 'SDVOSB · Small Business' },
  { label: 'Where',        value: 'Nationwide' },
  { label: 'Deal size',    value: '$250K – $5M' },
];

const MATCH = {
  score: 84,
  title: 'Zero Trust Support Services',
  agency: 'Veterans Affairs',
  reasons: [
    'NAICS 541512 is one of your primary codes',
    'Set-aside matches a certification you hold',
    'Your keywords appear in this notice',
  ],
};

export default function ProfileIllustration() {
  return (
    <div
      className="relative rounded-2xl border border-[#1e2d4a] bg-[#0b1120] overflow-hidden"
      style={{ boxShadow: '0 6px 24px rgba(0,0,0,0.5)' }}
      aria-label="Illustration of the Scoring Alignment Check"
    >
      <div className="absolute inset-x-0 top-0 h-px pointer-events-none bg-gradient-to-r from-transparent via-[#00c3ff]/40 to-transparent" />

      {/* Header */}
      <div className="flex items-start gap-3 px-5 pt-5 pb-4">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 bg-[#00c3ff]/[.12]">
          <Crosshair size={17} className="text-[#00c3ff]" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="text-[17px] sm:text-lg font-headline font-black text-white leading-tight flex items-center gap-1.5">
            Scoring Alignment Check <HelpCircle size={13} className="text-[#64748b]" />
          </p>
          <p className="text-xs text-[#8b9bb4] mt-0.5">Is this how you want Honest Echo to look for work? Every score starts from this reading of your company.</p>
        </div>
      </div>

      {/* Profile reading — what the user inputs */}
      <dl className="px-5 pb-4 space-y-3 max-sm:space-y-4">
        {PROFILE.map(row => (
          <div key={row.label} className="grid grid-cols-[88px_minmax(0,1fr)] sm:grid-cols-[112px_minmax(0,1fr)] gap-x-4 sm:gap-x-3 items-baseline">
            <dt className="text-[10px] font-bold uppercase tracking-[.08em] text-[#8b9bb4]">{row.label}</dt>
            <dd className="min-w-0">
              <p className="text-[13px] font-semibold text-white leading-[1.3] sm:leading-snug">{row.value}</p>
              {row.sub && <p className="text-[12px] text-[#00c3ff] mt-0.5 tabular-nums">{row.sub}</p>}
            </dd>
          </div>
        ))}
      </dl>

      {/* One likely match */}
      <div className="border-t border-[#1e2d4a] px-5 pt-4 pb-4">
        <p className="text-[10px] font-bold uppercase tracking-[.08em] text-[#4ade80]">Likely match</p>
        <p className="text-xs text-[#64748b] mt-0.5 mb-3">Illustrative values. If this doesn't look like work you'd chase, adjust the reading above.</p>
        <div className="rounded-md border border-[#1e2d4a]/70 p-4">
          <div className="flex items-start gap-3">
            <span className="shrink-0 inline-flex items-center justify-center min-w-[40px] h-7 px-2 rounded-md border border-[#4ade80]/40 bg-[#4ade80]/[.08] text-sm font-bold text-[#4ade80] tabular-nums">{MATCH.score}</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-snug">{MATCH.title}</p>
              <p className="text-[11px] uppercase tracking-wide text-[#8b9bb4] mt-0.5">{MATCH.agency}</p>
            </div>
          </div>
          <ul className="mt-3 space-y-1.5">
            {MATCH.reasons.map(r => (
              <li key={r} className="flex items-start gap-2 text-[13px] text-[#cdd9ea]">
                <Check size={13} className="text-[#4ade80] shrink-0 mt-0.5" strokeWidth={2.5} />
                {r}
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-[#1e2d4a] flex items-center gap-2 text-[11px] text-[#64748b] opacity-60">
            Would you pursue this?
            <span className="px-2.5 py-0.5 rounded border border-[#2a3a5c] text-[#cdd9ea] font-semibold">Yes</span>
            <span className="px-2.5 py-0.5 rounded border border-[#2a3a5c] text-[#cdd9ea] font-semibold">No</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#1e2d4a] px-5 py-3.5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <p className="flex items-center gap-2 text-xs min-w-0">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded border border-[#4ade80]/50 bg-[#4ade80]/[.10] shrink-0"><Check size={12} className="text-[#4ade80]" strokeWidth={3} /></span>
          <span className="font-semibold text-[#4ade80]">Reading confirmed</span>
          <span className="text-[#8b9bb4] truncate max-sm:hidden">· your feed scores against this profile</span>
        </p>
        <span className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border border-[#1e2d4a] text-white">Adjust profile</span>
      </div>
    </div>
  );
}
