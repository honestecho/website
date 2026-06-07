import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Users, Share2, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '../lib/api';
import { track } from '../lib/analytics';

// ── Page ─────────────────────────────────────────────────────────────────────

const TEAM_SIZE_OPTIONS = ['2-5', '6-15', '16-50', '50+'] as const;

export default function TeamWaitlist() {
  const [email, setEmail]             = useState('');
  const [companyName, setCompanyName] = useState('');
  const [teamSize, setTeamSize]       = useState<string>('');
  const [useCase, setUseCase]         = useState('');
  const [honeypot, setHoneypot]       = useState(''); // bot trap
  const [loading, setLoading]         = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [error, setError]             = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/public/team-waitlist`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          email:        email.trim(),
          company_name: companyName.trim() || undefined,
          team_size:    teamSize || undefined,
          use_case:     useCase.trim() || undefined,
          honeypot:     honeypot || undefined,
        }),
      });

      if (!res.ok && res.status !== 200) {
        const body = await res.json().catch(() => ({ message: 'Something went wrong. Please try again.' }));
        setError(body.message || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      track('team_waitlist_submitted', { team_size: teamSize || undefined });
      setSubmitted(true);
      setLoading(false);
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Team Waitlist | HE Pursuit</title>
        <meta name="description" content="Team pricing for HE Pursuit is launching soon. Join the waitlist for multi-user workspaces, shared pursuits, and team-level visibility across your government contracting pipeline." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/team-waitlist" />
        <meta property="og:title" content="Team Waitlist — HE Pursuit" />
        <meta property="og:description" content="Team adds multi-user workspaces, shared pursuits, and team-level visibility. Join the waitlist for early access." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Team Waitlist — HE Pursuit" />
        <meta name="twitter:description" content="Team adds multi-user workspaces, shared pursuits, and team-level visibility. Join the waitlist for early access." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
      </Helmet>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]" />
            <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Coming Soon</span>
          </div>

          <h1 className="font-headline font-black text-5xl md:text-6xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            Team pricing is coming. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c3ff] to-[#5b8cff]">Get early access.</span>
          </h1>

          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body mb-8 max-w-2xl">
            Team adds multi-user workspaces, shared pursuits, and team-level visibility across your government contracting pipeline. Join the waitlist — we'll email you when it ships and offer waitlist pricing to early signups.
          </p>

          {/* ── Form ───────────────────────────────────────────────────────── */}
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] p-6 md:p-8 space-y-5 shadow-2xl"
              noValidate
            >
              {/* Honeypot — hidden from humans, catches bots */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                className="absolute -left-[9999px] w-px h-px opacity-0"
                aria-hidden="true"
              />

              <div>
                <label htmlFor="tw-email" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-1.5">
                  Work email
                </label>
                <input
                  id="tw-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@yourcompany.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors placeholder:text-[#8b9bb4]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="tw-company" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-1.5">
                    Company <span className="text-[#8b9bb4] normal-case font-normal tracking-normal">(optional)</span>
                  </label>
                  <input
                    id="tw-company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Acme Federal Services"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors placeholder:text-[#8b9bb4]"
                  />
                </div>

                <div>
                  <label htmlFor="tw-team-size" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-1.5">
                    Team size <span className="text-[#8b9bb4] normal-case font-normal tracking-normal">(optional)</span>
                  </label>
                  <select
                    id="tw-team-size"
                    value={teamSize}
                    onChange={e => setTeamSize(e.target.value)}
                    className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors"
                  >
                    <option value="">Select a range</option>
                    {TEAM_SIZE_OPTIONS.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="tw-usecase" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-1.5">
                  What are you trying to do? <span className="text-[#8b9bb4] normal-case font-normal tracking-normal">(optional)</span>
                </label>
                <input
                  id="tw-usecase"
                  type="text"
                  maxLength={500}
                  placeholder="e.g. Standardize our bid/no-bid process across 8 capture managers"
                  value={useCase}
                  onChange={e => setUseCase(e.target.value)}
                  className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors placeholder:text-[#8b9bb4]"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-400 font-body">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? 'Joining…' : (
                  <>
                    Join the Waitlist
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-xs text-[#8b9bb4] font-body">
                We'll only email you about Team availability. No newsletter, no spam.
              </p>
            </form>
          ) : (
            <div className="rounded-2xl bg-[#0b1120] border border-[#00c3ff]/40 p-8 md:p-10 text-center shadow-[0_0_60px_rgba(0,195,255,0.15)]">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/40 flex items-center justify-center mb-5">
                <CheckCircle2 size={28} className="text-[#00c3ff]" strokeWidth={2} />
              </div>
              <h2 className="font-headline font-black text-2xl md:text-3xl text-white mb-3">You're on the list.</h2>
              <p className="text-[#a0b2c8] font-body mb-6">
                We'll email you when Team is ready — and when the waitlist pricing window opens.
              </p>
              <Link
                to="/pricing#pro"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all"
              >
                Not ready to wait? Start with Pro.
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Feature preview ────────────────────────────────────────────────── */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-3 tracking-tight">
            What Team will include
          </h2>
          <p className="text-[#a0b2c8] font-body mb-10 max-w-2xl">
            Built for small GovCon teams standardizing bid/no-bid decisions across multiple capture managers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: 'Multi-user workspaces',
                body: 'Everyone on your capture team logs in under one account with their own profile, evaluations, and history.',
              },
              {
                icon: Share2,
                title: 'Shared pursuits',
                body: 'Hand off a pursuit from capture to proposal without re-running the analysis. Phase comments and decisions carry across users.',
              },
              {
                icon: BarChart3,
                title: 'Team-level visibility',
                body: 'A dashboard view showing what everyone is pursuing, win-probability trends, and which agencies / NAICS are driving your pipeline.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl bg-[#0b1120] border border-[#1e2d4a] p-6 hover:border-[#00c3ff]/40 transition-colors"
              >
                <div className="w-11 h-11 rounded-lg bg-[#0d1827] border border-[#1e2d4a] flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#00c3ff]" strokeWidth={2} />
                </div>
                <h3 className="font-headline font-black text-white text-lg mb-2">{title}</h3>
                <p className="text-sm text-[#a0b2c8] font-body leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ─────────────────────────────────────────────────────── */}
      <section className="py-12 px-6 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-[#a0b2c8] font-body mb-4">
            Not ready to wait? You can standardize your own bid/no-bid process today with Pro.
          </p>
          <Link
            to="/pricing#pro"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all"
          >
            See Pro pricing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
