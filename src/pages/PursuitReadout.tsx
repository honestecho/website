import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Filter,
  Ban,
  Compass,
  Scale,
  Gavel,
} from 'lucide-react';
import FlyIn from '../components/FlyIn';
import { API_ORIGIN } from '../lib/api';
import { track } from '../lib/analytics';

// ── Attribution ───────────────────────────────────────────────────────────────
// getAttribution isn't exported from lib/analytics, so read the same
// sessionStorage key defensively. Missing/malformed → empty strings.
function readAttribution(): { src: string; gclid: string } {
  try {
    const stored = sessionStorage.getItem('he_attribution');
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const rec = parsed as Record<string, unknown>;
        return {
          src:   typeof rec.src === 'string' ? rec.src : '',
          gclid: typeof rec.gclid === 'string' ? rec.gclid : '',
        };
      }
    }
  } catch { /* attribution is best-effort — never block the form */ }
  return { src: '', gclid: '' };
}

// ── Static content ────────────────────────────────────────────────────────────

const SET_ASIDE_OPTIONS = [
  '8(a)',
  'SDVOSB / VOSB',
  'WOSB / EDWOSB',
  'HUBZone',
  'Small business (no certification)',
] as const;

const TEAM_SIZE_OPTIONS = ['1–5', '6–25', '26–100', '100+'] as const;

const DECIDE_STEPS = [
  { Icon: Filter,  title: 'Triage',         body: 'Is this real, funded, and current?' },
  { Icon: Ban,     title: 'Eligibility',    body: 'Hard disqualifiers first: set-aside fit, certifications, clearances, facility requirements.' },
  { Icon: Compass, title: 'Strategy',       body: 'Does it fit what you actually do — not just your NAICS?' },
  { Icon: Scale,   title: 'Effort vs. win', body: 'Proposal cost against realistic win probability.' },
  { Icon: Gavel,   title: 'Decision',       body: 'PURSUE or SKIP, with reasoning you can put in front of leadership.' },
] as const;

const TRUST_BULLETS = [
  'We work from a thin capability profile — NAICS codes, set-asides, keywords. Facts already public in your SAM registration.',
  'We never ask for your proposals, pricing, win themes, or pipeline. Nothing here requires an upload.',
  'Your data is never used to train AI models, and never sold. Delete it any time by asking.',
  'You get the decision and the reasoning behind it. What you do with it stays yours.',
] as const;

// Shared field styles (matches the Analyzer input treatment)
const inputClass =
  'w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00c3ff]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] transition-colors placeholder:text-[#8b9bb4]';
const labelClass =
  'block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-2 font-label';

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PursuitReadout() {
  const [email, setEmail]           = useState('');
  const [companyName, setCompany]   = useState('');
  const [whatYouDo, setWhatYouDo]   = useState('');
  const [naics, setNaics]           = useState('');
  const [setAsides, setSetAsides]   = useState<string[]>([]);
  const [geography, setGeography]   = useState('');
  const [teamSize, setTeamSize]     = useState('');
  const [uei, setUei]               = useState('');
  const [honeypot, setHoneypot]     = useState('');

  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [submitted, setSubmitted]   = useState(false);

  useEffect(() => { track('pursuit_readout_page_viewed'); }, []);

  function toggleSetAside(option: string) {
    setSetAsides(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) { setError('Enter your work email.'); return; }
    if (!whatYouDo.trim()) { setError('Tell us what your company does — a sentence or two is plenty.'); return; }

    const { src, gclid } = readAttribution();

    setLoading(true);
    try {
      const res = await fetch(`${API_ORIGIN}/api/public/readout-request`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:        email.trim(),
          company_name: companyName.trim(),
          what_you_do:  whatYouDo.trim(),
          naics:        naics.trim(),
          set_asides:   setAsides.join(', '),
          geography:    geography.trim(),
          team_size:    teamSize,
          uei:          uei.trim(),
          src,
          gclid,
          honeypot,
        }),
      });
      const body: { message?: string } = await res.json().catch(() => ({}));

      if (res.status === 400) {
        setError(body?.message || 'Something looks off with that submission. Please check the form and try again.');
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError('Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setLoading(false);
      track('pursuit_readout_submitted');
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Free Pursuit Readout | 3 Federal Opportunities Worth Your Time | Honest Echo</title>
        <meta name="description" content="Tell us what your company does. Get a reasoned shortlist of 3 federal opportunities worth pursuing — vetted for hidden disqualifiers — plus one near-miss. Free — no account required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/tools/pursuit-readout" />
        <meta property="og:title" content="Free Pursuit Readout | 3 Federal Opportunities Worth Your Time | Honest Echo" />
        <meta property="og:description" content="Tell us what your company does. Get a reasoned shortlist of 3 federal opportunities worth pursuing — vetted for hidden disqualifiers — plus one near-miss. Free — no account required." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Pursuit Readout | 3 Federal Opportunities Worth Your Time | Honest Echo" />
        <meta name="twitter:description" content="Tell us what your company does. Get a reasoned shortlist of 3 federal opportunities worth pursuing — vetted for hidden disqualifiers — plus one near-miss. Free — no account required." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
      </Helmet>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-10 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
            <Sparkles className="w-3 h-3 text-[#00c3ff]" />
            <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">
              Free · No account required
            </span>
          </div>

          <h1 className="font-headline font-black text-5xl md:text-6xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            The 3 opportunities actually worth your pursuit time
          </h1>
          <p className="font-headline font-black text-2xl md:text-3xl text-[#00c3ff] mb-5 tracking-tight leading-snug">
            Vetted for hidden disqualifiers. Reasoned. Defensible.
          </p>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-3xl">
            Tell us what your company does — it takes about 60 seconds. Within 48 hours you get a reasoned shortlist: three live federal opportunities worth pursuing, and one that looks right for you but isn't — so you can see how we think. Free.
          </p>
        </div>
      </section>

      {/* ── Form ───────────────────────────────────────────────────────────── */}
      <section className="pb-16 px-6 relative">
        <div className="max-w-3xl mx-auto relative z-10">
          {submitted ? (
            <div className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] p-8 md:p-10 shadow-2xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-30 rounded-full scale-150"></div>
                  <Mail className="w-5 h-5 text-[#00c3ff] relative z-10" strokeWidth={2} />
                </div>
                <h2 className="font-headline font-black text-white text-2xl tracking-tight pt-1.5">
                  Your readout is on the way
                </h2>
              </div>
              <p className="text-[#a0b2c8] text-base font-body leading-relaxed">
                We're reviewing live SAM.gov opportunities against your profile now. Expect your shortlist within 48 hours — check your inbox.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] p-6 md:p-8 shadow-2xl"
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="readout-email" className={labelClass}>
                    Work email <span className="text-[#00c3ff]">*</span>
                  </label>
                  <input
                    id="readout-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="readout-company" className={labelClass}>
                    Company name <span className="normal-case font-semibold text-[#8b9bb4]">(optional)</span>
                  </label>
                  <input
                    id="readout-company"
                    type="text"
                    value={companyName}
                    onChange={e => setCompany(e.target.value)}
                    autoComplete="organization"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="readout-what" className={labelClass}>
                  What does your company do? <span className="text-[#00c3ff]">*</span>
                </label>
                <textarea
                  id="readout-what"
                  value={whatYouDo}
                  onChange={e => setWhatYouDo(e.target.value)}
                  rows={4}
                  required
                  placeholder={'Plain English is fine — "IT helpdesk and network support for federal agencies, mostly mid-Atlantic."'}
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div>
                  <label htmlFor="readout-naics" className={labelClass}>
                    Primary NAICS <span className="normal-case font-semibold text-[#8b9bb4]">(optional)</span>
                  </label>
                  <input
                    id="readout-naics"
                    type="text"
                    value={naics}
                    onChange={e => setNaics(e.target.value)}
                    placeholder="e.g. 541512"
                    autoComplete="off"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="readout-team" className={labelClass}>
                    Team size
                  </label>
                  <select
                    id="readout-team"
                    value={teamSize}
                    onChange={e => setTeamSize(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select…</option>
                    {TEAM_SIZE_OPTIONS.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>

              <fieldset className="mt-5">
                <legend className={labelClass}>Set-asides</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SET_ASIDE_OPTIONS.map(option => {
                    const checked = setAsides.includes(option);
                    return (
                      <label
                        key={option}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-all duration-300 ${
                          checked
                            ? 'border-[#00c3ff]/60 bg-[#00c3ff]/5'
                            : 'border-[#1e2d4a] bg-[#060e1c] hover:border-[#00c3ff]/30'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSetAside(option)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            checked ? 'bg-[#00c3ff] border-[#00c3ff]' : 'border-[#1e2d4a] bg-[#0b1120]'
                          }`}
                        >
                          {checked && <CheckCircle2 className="w-3 h-3 text-[#030B17]" strokeWidth={3} />}
                        </span>
                        <span className={`text-sm font-body ${checked ? 'text-white' : 'text-[#a0b2c8]'}`}>
                          {option}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div>
                  <label htmlFor="readout-geo" className={labelClass}>
                    Where can you perform? <span className="normal-case font-semibold text-[#8b9bb4]">(optional)</span>
                  </label>
                  <input
                    id="readout-geo"
                    type="text"
                    value={geography}
                    onChange={e => setGeography(e.target.value)}
                    placeholder="e.g. VA/MD/DC, or remote nationwide"
                    autoComplete="off"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="readout-uei" className={labelClass}>
                    UEI <span className="normal-case font-semibold text-[#8b9bb4]">(optional)</span>
                  </label>
                  <input
                    id="readout-uei"
                    type="text"
                    value={uei}
                    onChange={e => setUei(e.target.value)}
                    autoComplete="off"
                    className={inputClass}
                  />
                  <p className="text-xs text-[#8b9bb4] font-body mt-2">
                    Optional — speeds up eligibility checks.
                  </p>
                </div>
              </div>

              {/* Honeypot — hidden from real users, filled only by bots */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="readout-website">Website</label>
                <input
                  id="readout-website"
                  name="website"
                  type="text"
                  value={honeypot}
                  onChange={e => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {error && !loading && (
                <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-[#1e2d4a] bg-[#060e1c] p-4">
                  <div className="relative shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                    <div className="absolute inset-0 blur-sm rounded-full opacity-25 bg-[#f87171]" />
                    <AlertCircle className="w-4 h-4 relative z-10 text-[#f87171]" strokeWidth={2} />
                  </div>
                  <p className="text-sm font-semibold text-white font-body">{error}</p>
                </div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Sending…</>
                  ) : (
                    <>Send me my shortlist<ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
                <p className="text-xs text-[#8b9bb4] font-body mt-3">
                  No account. No credit card. One email with your readout — that's it.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── Sample readout ─────────────────────────────────────────────────── */}
      <section className="pb-16 px-6 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <FlyIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
              <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">
                Sample readout — redacted
              </span>
            </div>

            <div className="space-y-5">
              {/* Entry A — PURSUE */}
              <div className="rounded-2xl bg-[#0b1120] border border-[#00c3ff]/30 p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/50 to-transparent rounded-t-2xl"></div>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                  <h3 className="font-headline font-bold text-white text-lg tracking-tight leading-snug">
                    IT Support Services — [Agency redacted] · $1.2M · SDVOSB set-aside
                  </h3>
                  <span className="inline-flex items-center self-start px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/40 text-xs font-black text-[#00c3ff] tracking-widest uppercase whitespace-nowrap shrink-0">
                    Pursue
                  </span>
                </div>
                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">
                  Requirements match your core capability. Incumbent's contract expired without renewal — genuine competition. Section L asks for three past-performance references sized under $2M; that favors small primes. No clearance wall, no facility requirement.
                </p>
              </div>

              {/* Entry B — SKIP */}
              <div className="rounded-2xl bg-[#0b1120] border border-amber-500/30 p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent rounded-t-2xl"></div>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                  <h3 className="font-headline font-bold text-white text-lg tracking-tight leading-snug">
                    Enterprise Software Modernization — [Agency redacted] · $890K · Small-business set-aside
                  </h3>
                  <span className="inline-flex items-center self-start px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-xs font-black text-amber-400 tracking-widest uppercase whitespace-nowrap shrink-0">
                    Skip — looks right, isn't
                  </span>
                </div>
                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">
                  Right NAICS, right size, right agency. But buried in Section C: a senior developer certification with 10+ years of federal acquisition experience and an active Top Secret clearance — a combination almost nobody holds. You'd have found it on hour six of proposal work. We flag it in minute one.
                </p>
              </div>
            </div>

            <p className="text-sm text-[#8b9bb4] font-body mt-5">
              Every readout cites the actual solicitation sections the verdict rests on.
            </p>
          </FlyIn>
        </div>
      </section>

      {/* ── How we decide ──────────────────────────────────────────────────── */}
      <section className="pb-16 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <FlyIn>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-8 tracking-tight">
              How we decide
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {DECIDE_STEPS.map(({ Icon, title, body }, i) => (
                <div
                  key={title}
                  className="rounded-xl bg-[#0b1120] border border-[#1e2d4a] p-5 hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 group"
                >
                  <div className="w-9 h-9 flex items-center justify-center relative overflow-visible mb-3">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-50 transition-opacity duration-500 rounded-full scale-150" />
                    <Icon size={16} className="text-[#00c3ff] relative z-10" strokeWidth={2} />
                  </div>
                  <p className="font-headline font-black text-white text-base mb-1.5 leading-snug">
                    {i + 1}. {title}
                  </p>
                  <p className="text-sm text-[#8b9bb4] font-body leading-snug">{body}</p>
                </div>
              ))}
            </div>
          </FlyIn>
        </div>
      </section>

      {/* ── Trust block ────────────────────────────────────────────────────── */}
      <section className="pb-16 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <FlyIn>
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 md:p-12 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <ShieldCheck className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <h2 className="font-headline font-black text-white text-2xl md:text-3xl tracking-tight pt-0.5">
                  Your pipeline is your alpha. We're designed to never need it.
                </h2>
              </div>
              <ul className="space-y-3">
                {TRUST_BULLETS.map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm md:text-base text-[#a0b2c8] font-body leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#00c3ff] shrink-0 mt-1" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FlyIn>
        </div>
      </section>

      {/* ── Footer strip ───────────────────────────────────────────────────── */}
      <section className="pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <p className="text-sm text-[#8b9bb4] font-body text-center border-t border-[#1e2d4a] pt-8">
            Honest Echo is a woman-owned, veteran-owned small business. We are not affiliated with, or endorsed by, any government agency.
          </p>
        </div>
      </section>
    </>
  );
}
