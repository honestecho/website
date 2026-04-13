import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, X, Minus, ChevronDown } from 'lucide-react';

// ─── Comparison table data ────────────────────────────────────────────────────

type CellValue = 'included' | 'limited' | 'unlimited' | 'none' | 'optional';

interface Feature {
  category: string;
  name: string;
  free: CellValue;
  starter: CellValue;
  pro: CellValue;
  team: CellValue;
}

const features: Feature[] = [
  // Core Access
  { category: 'Core Access', name: 'Search opportunities',   free: 'included', starter: 'included', pro: 'included',   team: 'included'  },
  { category: 'Core Access', name: 'Save pursuits',          free: 'limited',  starter: 'limited',  pro: 'unlimited',  team: 'unlimited' },
  { category: 'Core Access', name: 'Opportunity summaries',  free: 'included', starter: 'included', pro: 'included',   team: 'included'  },
  { category: 'Core Access', name: 'Pursuits (max)',         free: 'limited',  starter: 'limited',  pro: 'unlimited',  team: 'unlimited' },
  { category: 'Core Access', name: 'Phase 1 — RFI triage',  free: 'included', starter: 'included', pro: 'included',   team: 'included'  },
  // Eligibility & Analysis
  { category: 'Eligibility & Analysis', name: 'Phase 2 — AI eligibility review', free: 'none', starter: 'included', pro: 'included', team: 'included' },
  { category: 'Eligibility & Analysis', name: 'Document parsing',                free: 'none', starter: 'included', pro: 'included', team: 'included' },
  { category: 'Eligibility & Analysis', name: 'Disqualifier detection',          free: 'none', starter: 'included', pro: 'included', team: 'included' },
  { category: 'Eligibility & Analysis', name: 'Requirements extraction',         free: 'none', starter: 'included', pro: 'included', team: 'included' },
  { category: 'Eligibility & Analysis', name: 'Strategic & effort scoring',      free: 'none', starter: 'included', pro: 'included', team: 'included' },
  // Decisions & Export
  { category: 'Decisions & Export', name: 'Go / Conditional Go / No-Bid',    free: 'none', starter: 'included', pro: 'included', team: 'included' },
  { category: 'Decisions & Export', name: 'Decision tracking & history',      free: 'none', starter: 'included', pro: 'included', team: 'included' },
  { category: 'Decisions & Export', name: 'PDF Decision Package export',      free: 'none', starter: 'none',     pro: 'included', team: 'included' },
  // Team / Admin
  { category: 'Team / Admin', name: 'Multiple users',            free: 'none', starter: 'none', pro: 'none', team: 'included' },
  { category: 'Team / Admin', name: 'Shared pursuits',           free: 'none', starter: 'none', pro: 'none', team: 'included' },
  { category: 'Team / Admin', name: 'Priority parsing',          free: 'none', starter: 'none', pro: 'none', team: 'included' },
  { category: 'Team / Admin', name: 'Export capabilities',       free: 'none', starter: 'none', pro: 'included', team: 'included' },
  // Support
  { category: 'Support',      name: 'Help center',               free: 'included', starter: 'included', pro: 'included',  team: 'included' },
  { category: 'Support',      name: 'Email support',             free: 'none',     starter: 'included', pro: 'included',  team: 'included' },
  { category: 'Support',      name: 'Response time',             free: 'none',     starter: 'limited',  pro: 'limited',   team: 'included' },
  { category: 'Support',      name: 'Onboarding assistance',     free: 'none',     starter: 'none',     pro: 'optional',  team: 'included' },
];

const categories = [...new Set(features.map(f => f.category))];

function Cell({ value }: { value: CellValue }) {
  if (value === 'included')  return <Check className="w-5 h-5 text-[#00c3ff] mx-auto" strokeWidth={2.5} />;
  if (value === 'unlimited') return <span className="text-[#00c3ff] text-sm font-bold">Unlimited</span>;
  if (value === 'limited')   return <Minus className="w-4 h-4 text-[#8b9bb4] mx-auto" strokeWidth={2} />;
  if (value === 'optional')  return <span className="text-[#8b9bb4] text-xs font-body">Optional</span>;
  return <X className="w-4 h-4 text-[#2a3a4e] mx-auto" strokeWidth={2} />;
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: 'What does the Free plan include?',
    a: 'Free gives you search, scoring, and Phase 1 RFI triage for up to 10 pursuits. It\'s designed to let you explore the platform before committing. Phases 2–5 require a paid plan.',
  },
  {
    q: 'What is the difference between Starter and Pro?',
    a: 'Starter ($99/mo) covers the full 5-phase workflow for up to 25 pursuits — ideal for solo contractors who are just getting started. Pro ($199/mo) removes the pursuit limit and adds PDF Decision Package export, making it the right choice for active teams running multiple bids at once.',
  },
  {
    q: 'When should I upgrade to Team?',
    a: 'Team ($299/mo) is for multi-user capture teams. Upgrade when you need shared pursuits, collaboration across users, priority parsing, and up to 5 seats.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. You can start on the Free plan and evaluate HE Pursuit before upgrading. No credit card required to get started.',
  },
  {
    q: 'Do I need a credit card to get started?',
    a: 'No. The Free plan requires only your email address. A credit card is only needed when you upgrade to a paid plan.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. You can cancel your subscription at any time from your account settings. No notice period, no lock-in.',
  },
  {
    q: 'What counts as a pursuit?',
    a: 'A pursuit is a government contract opportunity you save and work through inside HE Pursuit — from initial triage through eligibility, scoring, and the final bid/no-bid decision. Free: 10 pursuits. Starter: 25 pursuits. Pro and Team: unlimited.',
  },
  {
    q: 'Can I upload solicitation documents?',
    a: 'Yes. Starter, Pro, and Team plans support document-based Phase 2 analysis including eligibility review and disqualifier detection.',
  },
  {
    q: 'Is HE Pursuit built for small GovCon teams?',
    a: 'Yes. HE Pursuit is designed for small contractors, proposal teams, and capture teams that need faster, more structured bid/no-bid decisions.',
  },
  {
    q: 'What support is available at each tier?',
    a: 'Free: help center only. Starter: 48-hour email response. Pro: 24-hour email response. Team: 12-hour response plus onboarding assistance.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Pricing | Honest Echo</title>
        <meta name="description" content="Simple 4-tier pricing for small GovCon teams. Free/$0, Starter/$99, Pro/$199, Team/$299. Start free, unlock full eligibility and decision workflows, scale to multi-user collaboration." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/pricing" />
        <meta property="og:title" content="HE Pursuit Pricing — Free, Starter, Pro, Team" />
        <meta property="og:description" content="Start free. Upgrade to $99 Starter, $199 Pro, or $299 Team as your pursuit volume grows. Full AI bid/no-bid workflow at every paid tier." />
        <meta property="og:image" content="https://honestecho.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HE Pursuit Pricing — Free, Starter, Pro, Team" />
        <meta name="twitter:description" content="Start free. Upgrade to $99 Starter, $199 Pro, or $299 Team as your pursuit volume grows. Full AI bid/no-bid workflow at every paid tier." />
        <meta name="twitter:image" content="https://honestecho.com/og-image.png" />
      </Helmet>

      {/* ── SECTION 1 — Hero ─────────────────────────────────────────────── */}
      <section className="pt-24 pb-4 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Pricing</span>
          </div>
          <h1 className="font-headline font-black text-2xl md:text-3xl text-white mb-2 tracking-tight leading-tight">
            Start free. Scale when you're ready.
          </h1>
          <p className="text-[#a0b2c8] text-sm leading-relaxed font-body">
            Test HE Pursuit free. Upgrade for deeper analysis, decision support, and team workflows.
          </p>
        </div>
      </section>

      {/* ── SECTION 2 — Pricing Cards ────────────────────────────────────── */}
      <section className="pb-8 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">

            {/* Free */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <h3 className="font-headline text-xl font-bold text-white mb-1">Free</h3>
              <p className="text-xs text-[#8b9bb4] mb-4 font-body">Test the workflow</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white font-headline">$0</span>
              </div>
              <ul className="space-y-2 text-sm text-[#a0b2c8] mb-3 flex-grow font-body">
                {['Search SAM.gov opportunities', '10 pursuits / Phase 1 triage', 'Saved searches & nightly alerts'].map(f => (
                  <li key={f} className="flex gap-3 items-start">
                    <Check className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[#8b9bb4] font-body mb-5">No credit card required.</p>
              <Link to="/signup" className="block w-full py-3 text-center border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline text-sm">
                Start Free
              </Link>
            </div>

            {/* Starter */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <h3 className="font-headline text-xl font-bold text-white mb-1">Starter</h3>
              <p className="text-xs text-[#8b9bb4] mb-4 font-body">For solo contractors</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white font-headline">$99</span>
                <span className="text-[#8b9bb4] text-sm font-body">/mo</span>
              </div>
              <ul className="space-y-2 text-sm text-[#a0b2c8] mb-6 flex-grow font-body">
                {['25 pursuits', 'Full Phase 2–5 AI workflow', 'Eligibility & disqualifier review', 'Strategic & effort scoring', 'Go/No-Go decision tracking'].map(f => (
                  <li key={f} className="flex gap-3 items-start">
                    <Check className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full py-3 text-center border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline text-sm">
                Start Starter
              </Link>
            </div>

            {/* Pro — highlighted */}
            <div className="bg-[#0b1120] border border-[#00c3ff]/50 rounded-2xl p-6 flex flex-col shadow-[0_0_60px_rgba(0,195,255,0.12)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/60 to-transparent rounded-t-2xl"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.06)_0%,transparent_65%)] pointer-events-none"></div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-headline text-xl font-bold text-white">Pro</h3>
                <span className="text-[10px] font-bold text-[#030B17] bg-[#00c3ff] px-2 py-0.5 rounded-full uppercase tracking-widest font-label">Most Popular</span>
              </div>
              <p className="text-xs text-[#8b9bb4] mb-4 font-body">For small contractors & proposal teams</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white font-headline">$199</span>
                <span className="text-[#8b9bb4] text-sm font-body">/mo</span>
              </div>
              <ul className="space-y-2 text-sm text-[#a0b2c8] mb-6 flex-grow font-body relative z-10">
                {['Unlimited pursuits', 'Everything in Starter', 'PDF Decision Package export', '24hr email support'].map(f => (
                  <li key={f} className="flex gap-3 items-start">
                    <Check className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full py-3 text-center bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_30px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline relative z-10 text-sm">
                Start Pro
              </Link>
            </div>

            {/* Team */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <h3 className="font-headline text-xl font-bold text-white mb-1">Team</h3>
              <p className="text-xs text-[#8b9bb4] mb-4 font-body">For multi-user capture teams</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-black text-white font-headline">$299</span>
                <span className="text-[#8b9bb4] text-sm font-body">/mo</span>
              </div>
              <p className="text-xs text-[#8b9bb4] font-body mb-4">Per workspace · Up to 5 users</p>
              <ul className="space-y-2 text-sm text-[#a0b2c8] mb-6 flex-grow font-body">
                {['Everything in Pro', 'Up to 5 user seats', 'Shared pursuit pipeline', 'Priority parsing', '12hr support + onboarding'].map(f => (
                  <li key={f} className="flex gap-3 items-start">
                    <Check className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="block w-full py-3 text-center border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline text-sm">
                Talk to the Team
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── FRAMING STRIP — Most teams start here ───────────────────────── */}
      <section className="pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0b1120]/60 border border-[#1e2d4a] rounded-2xl px-8 py-6 grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#1e2d4a]">
            <div className="py-4 md:py-0 md:px-5 first:pt-0 last:pb-0 md:first:pl-0 md:last:pr-0">
              <p className="text-xs font-label uppercase tracking-widest text-[#00c3ff] mb-1">Free</p>
              <p className="text-white font-headline font-bold text-sm">Test the workflow</p>
              <p className="text-[#8b9bb4] text-xs font-body mt-1">Search and explore before committing.</p>
            </div>
            <div className="py-4 md:py-0 md:px-5">
              <p className="text-xs font-label uppercase tracking-widest text-[#00c3ff] mb-1">Starter</p>
              <p className="text-white font-headline font-bold text-sm">Run the full decision workflow</p>
              <p className="text-[#8b9bb4] text-xs font-body mt-1">25 pursuits through all 5 phases.</p>
            </div>
            <div className="py-4 md:py-0 md:px-5">
              <p className="text-xs font-label uppercase tracking-widest text-[#00c3ff] mb-1">Pro — most popular</p>
              <p className="text-white font-headline font-bold text-sm">Unlimited pursuits + PDF export</p>
              <p className="text-[#8b9bb4] text-xs font-body mt-1">No limits. Decision Package ready.</p>
            </div>
            <div className="py-4 md:py-0 md:px-5">
              <p className="text-xs font-label uppercase tracking-widest text-[#00c3ff] mb-1">Team</p>
              <p className="text-white font-headline font-bold text-sm">Share across your capture team</p>
              <p className="text-[#8b9bb4] text-xs font-body mt-1">Multi-user workflows, shared pipeline.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — Plan Fit ─────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Plan Fit</span>
            </div>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight mb-4 max-w-2xl mx-auto">
              Choose the plan that matches how your team pursues work.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                plan: 'Free',
                copy: 'Best for solo users who want to test the workflow, evaluate early opportunities, and see how HE Pursuit fits their process — before spending a dollar.',
              },
              {
                plan: 'Starter',
                copy: 'Best for individual contractors who need the full AI workflow on a limited number of active pursuits. Full eligibility, scoring, and decisions — up to 25 at a time.',
              },
              {
                plan: 'Pro',
                copy: 'Best for small proposal teams running multiple active bids. Unlimited pursuits, PDF Decision Package exports, and 24-hour support. The workhorse tier.',
              },
              {
                plan: 'Team',
                copy: 'Best for multi-user capture teams that need shared visibility, 5 seats, priority document parsing, and fast support with onboarding guidance.',
              },
            ].map(({ plan, copy }) => (
              <div key={plan} className="bg-[#0b1120]/60 border border-[#1e2d4a] rounded-2xl p-8 group hover:border-[#00c3ff]/30 transition-all duration-300">
                <h3 className="font-headline font-black text-xl text-white mb-3">{plan}</h3>
                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — Comparison Table ─────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Compare Plans</span>
            </div>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight mb-4">
              See exactly what changes at each tier.
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#1e2d4a]">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-[#1e2d4a] bg-[#0b1120]">
                  <th className="text-left px-6 py-4 text-[#8b9bb4] font-label uppercase tracking-widest text-xs w-2/5">Feature</th>
                  <th className="px-4 py-4 text-center text-white font-headline font-bold text-sm">Free</th>
                  <th className="px-4 py-4 text-center text-white font-headline font-bold text-sm">Starter</th>
                  <th className="px-4 py-4 text-center font-headline font-bold text-sm">
                    <span className="text-[#00c3ff]">Pro</span>
                  </th>
                  <th className="px-4 py-4 text-center text-white font-headline font-bold text-sm">Team</th>
                </tr>
              </thead>
              <tbody className="bg-[#080f1c]">
                {categories.map(cat => (
                  <>
                    <tr key={cat} className="border-t border-[#1e2d4a] bg-[#0b1120]/80">
                      <td colSpan={5} className="px-6 py-3 text-xs font-bold text-[#00c3ff] uppercase tracking-widest font-label">{cat}</td>
                    </tr>
                    {features.filter(f => f.category === cat).map(f => (
                      <tr key={f.name} className="border-t border-[#1e2d4a]/60 hover:bg-[#0d1625] transition-colors">
                        <td className="px-6 py-4 text-[#a0b2c8] font-body">{f.name}</td>
                        <td className="px-4 py-4 text-center"><Cell value={f.free} /></td>
                        <td className="px-4 py-4 text-center"><Cell value={f.starter} /></td>
                        <td className="px-4 py-4 text-center bg-[#00c3ff]/[0.03]"><Cell value={f.pro} /></td>
                        <td className="px-4 py-4 text-center"><Cell value={f.team} /></td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-6 mt-5 px-1">
            <div className="flex items-center gap-2 text-xs text-[#8b9bb4] font-body">
              <Check className="w-4 h-4 text-[#00c3ff]" strokeWidth={2.5} /> Included
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8b9bb4] font-body">
              <Minus className="w-4 h-4 text-[#8b9bb4]" strokeWidth={2} /> Limited / varies
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8b9bb4] font-body">
              <X className="w-4 h-4 text-[#2a3a4e]" strokeWidth={2} /> Not included
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — FAQ ──────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">FAQ</span>
            </div>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight mb-4">
              Questions before you choose a plan?
            </h2>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#0d1828] transition-colors duration-200 group"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-white font-bold font-headline pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#00c3ff] shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                    strokeWidth={2}
                  />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-out ${openFaq === i ? 'max-h-48' : 'max-h-0'}`}>
                  <p className="px-6 pb-5 text-[#a0b2c8] text-sm font-body leading-relaxed border-t border-[#1e2d4a] pt-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — Final CTA ────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Ready to Start</span>
          </div>
          <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-5 tracking-tight">
            Choose your plan and start evaluating opportunities faster.
          </h2>
          <p className="text-[#a0b2c8] text-lg mb-10 leading-relaxed font-body max-w-xl mx-auto">
            Start free, upgrade when you need deeper decision support, or talk to us about Team access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline">
              Start Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline">
              Talk to the Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
