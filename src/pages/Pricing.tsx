import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, ShieldCheck, Clock, Ban, Eye, ClipboardList, Rocket, Users } from 'lucide-react';
import FlyIn from '../components/FlyIn';
import Notice, { NoticeCode } from '../components/Notice';
import { SoftwareApplicationSchema } from '../components/SchemaOrg';

// ─── Feature Matrix ───────────────────────────────────────────────────────────

// 'check' | 'none' | 'unlimited' | 'optional' | any string (rendered as text)
type CV = string;

interface Feature { category: string; name: string; free: CV; starter: CV; pro: CV; team: CV; }

const features: Feature[] = [
  // Core Access
  { category: 'Core Access', name: 'Search opportunities',              free: 'check',     starter: 'check',     pro: 'check',     team: 'check'     },
  { category: 'Core Access', name: 'Opportunity summaries',             free: 'check',     starter: 'check',     pro: 'check',     team: 'check'     },
  { category: 'Core Access', name: 'Company profile setup',             free: 'check',     starter: 'check',     pro: 'check',     team: 'check'     },
  { category: 'Core Access', name: 'Bookmark opportunities',            free: '15/mo',     starter: 'unlimited', pro: 'unlimited', team: 'unlimited' },
  { category: 'Core Access', name: 'Opportunity pursuits',              free: '1 trial',   starter: '25/mo',     pro: 'unlimited', team: 'unlimited' },
  { category: 'Core Access', name: 'Saved searches & nightly alerts',   free: 'check',     starter: 'check',     pro: 'check',     team: 'check'     },
  { category: 'Core Access', name: 'Phase 1 — Initial evaluation',      free: '1 trial',   starter: 'check',     pro: 'check',     team: 'check'     },
  // Eligibility & Analysis
  { category: 'Eligibility & Analysis', name: 'Full qualification workflow',  free: 'none', starter: 'check', pro: 'check', team: 'check' },
  { category: 'Eligibility & Analysis', name: 'AI eligibility review',        free: 'none', starter: 'check', pro: 'check', team: 'check' },
  { category: 'Eligibility & Analysis', name: 'Document parsing',             free: 'none', starter: 'check', pro: 'check', team: 'check' },
  { category: 'Eligibility & Analysis', name: 'Disqualifier detection',       free: 'none', starter: 'check', pro: 'check', team: 'check' },
  { category: 'Eligibility & Analysis', name: 'Requirements extraction',      free: 'none', starter: 'check', pro: 'check', team: 'check' },
  { category: 'Eligibility & Analysis', name: 'Strategic & effort scoring',   free: 'none', starter: 'check', pro: 'check', team: 'check' },
  // Decisions & Output
  { category: 'Decisions & Output', name: 'Go / Conditional Go / No-Bid', free: 'none', starter: 'check', pro: 'check', team: 'check' },
  { category: 'Decisions & Output', name: 'Decision tracking & history',   free: 'none', starter: 'Per-pursuit', pro: 'check', team: 'check' },
  { category: 'Decisions & Output', name: 'PDF decision report export',    free: 'none', starter: 'none',  pro: 'check', team: 'check' },
  // Workflow & Visibility
  { category: 'Workflow & Visibility', name: 'Dashboard (pipeline, deadlines)', free: 'none', starter: 'none', pro: 'check', team: 'check' },
  // Team & Admin
  { category: 'Team & Admin', name: 'Multiple users',       free: 'none', starter: 'none', pro: 'none', team: 'check' },
  { category: 'Team & Admin', name: 'Shared pursuits',      free: 'none', starter: 'none', pro: 'none', team: 'check' },
  { category: 'Team & Admin', name: 'Team-level visibility', free: 'none', starter: 'none', pro: 'none', team: 'check' },
  // Support
  { category: 'Support', name: 'Help center',           free: 'check', starter: 'check',    pro: 'check',    team: 'check'    },
  { category: 'Support', name: 'Email support',         free: 'check', starter: 'check',    pro: 'check',    team: 'check'    },
  { category: 'Support', name: 'Faster response time',  free: 'none',  starter: 'none',     pro: 'check',    team: 'check'    },
  { category: 'Support', name: 'Onboarding assistance', free: 'none',  starter: 'Optional', pro: 'Optional', team: 'check'    },
];

const categories = [...new Set(features.map(f => f.category))];

function Cell({ value }: { value: CV }) {
  if (value === 'check')     return <Check className="w-5 h-5 text-[#00c3ff] mx-auto" strokeWidth={2.5} />;
  if (value === 'none')      return <span className="text-[#8b9bb4] text-sm font-body" aria-label="Not included">&mdash;</span>;
  if (value === 'unlimited') return <span className="text-[#00c3ff] text-sm font-bold">Unlimited</span>;
  return <span className="text-[#8b9bb4] text-sm font-body">{value}</span>;
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const faqs = [
  { q: 'Do I need a credit card to start?',               a: 'No. Free requires only your email. A card is only needed when you upgrade to a paid plan.' },
  { q: 'Can I cancel anytime?',                           a: 'Yes. Cancel from your account settings — no notice period, no lock-in.' },
  { q: 'What is the difference between Starter and Pro?', a: 'Starter ($99/mo) gives you the full qualification workflow for up to 25 pursuits per month. Pro ($199/mo) removes limits entirely and adds the dashboard, decision tracking, and PDF export.' },
  { q: 'When should I upgrade to Team?',                  a: 'When more than one person needs to work in the same pipeline. Team adds multiple users, shared pursuits, team-level visibility, and onboarding support. Team is launching soon — join the waitlist from the Team card above and we\'ll reach out with early-access pricing.' },
];

// ─── Pricing cards data ───────────────────────────────────────────────────────

const plans = [
  {
    name: 'Free',
    price: '$0',
    tagline: 'Try the product',
    sub: 'Evaluate opportunities against your business profile',
    highlight: false,
    features: [
      'Create company profile (NAICS, set-aside, preferences)',
      'Search and view opportunities',
      'Basic opportunity summaries',
      'Initial scoring against your profile',
      'One full Phase 1 evaluation included (trial)',
      'Bookmark opportunities (up to 15/month)',
      'Saved searches & nightly alerts',
    ],
    limits: [
      'Phases 2–5 (eligibility → bid decision) require Starter',
      'No deep eligibility or document analysis',
    ],
    cta: 'Start Free',
    ctaTo: '/signup/?plan=free&promo=summer2026',
  },
  {
    name: 'Starter',
    price: '$99',
    tagline: 'Make real bid/no-bid decisions',
    sub: 'Run full pursuits with structured analysis',
    highlight: false,
    includesAbove: 'Everything in Free, plus:',
    features: [
      'Full qualification workflow (all stages)',
      'AI eligibility review',
      'Document parsing',
      'Disqualifier detection',
      'Requirements extraction',
      'Strategic fit and effort scoring',
      'Go / Conditional Go / No-Bid recommendations',
      'Bookmark unlimited opportunities',
      'Up to 25 pursuits per month',
    ],
    cta: 'Select Starter',
    ctaTo: '/signup/?plan=starter&promo=summer2026',
  },
  {
    name: 'Pro',
    price: '$199',
    tagline: 'Run your pursuit process',
    sub: 'Scale decision-making with workflow and tracking',
    highlight: true,
    badge: 'Recommended',
    valueLine: 'Everything in Starter, unlimited',
    includesAbove: 'Everything in Starter, plus:',
    features: [
      'Unlimited opportunity pursuits',
      'Decision tracking and history',
      'Dashboard (pipeline, deadlines, priorities)',
      'Downloadable decision reports (PDF)',
    ],
    cta: 'Select Pro',
    ctaTo: '/signup/?plan=pro&promo=summer2026',
  },
  {
    name: 'Team',
    price: '$299',
    tagline: 'Scale across your team',
    sub: 'Standardize decisions across users',
    highlight: false,
    badge: 'Coming Soon',
    includesAbove: 'Everything in Pro, plus:',
    features: [
      'Multiple users',
      'Shared pursuits',
      'Team-level visibility',
      'Higher usage thresholds',
      'Faster support response',
      'Onboarding assistance',
    ],
    cta: 'Join the Waitlist',
    ctaTo: '/team-waitlist/',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Pricing | Honest Echo</title>
        <meta name="description" content="Simple pricing for small contractors pursuing government contracting opportunities. Start free and qualify in minutes. Upgrade when your team needs deeper analysis and more volume." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/pricing" />
        <meta property="og:title" content="HE Pursuit Pricing — Free, Starter, Pro, Team" />
        <meta property="og:description" content="Start free. Upgrade to $99 Starter, $199 Pro, or $299 Team as your evaluation volume grows." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HE Pursuit Pricing — Free, Starter, Pro, Team" />
        <meta name="twitter:description" content="Start free. Upgrade to $99 Starter, $199 Pro, or $299 Team as your evaluation volume grows." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
      </Helmet>
      <SoftwareApplicationSchema />

      {/* ── SECTION 1 — Hero ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="font-headline font-black text-5xl md:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            Simple pricing for better bid decisions.
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body mb-6">
            HE Pursuit helps you evaluate government contracting opportunities quickly so you can focus on the bids that matter. Start free and qualify opportunities in minutes. Upgrade when your team needs deeper analysis, more volume, and a structured pursuit process.
          </p>
          <p className="text-[#00c3ff] font-body text-xl md:text-2xl font-bold tracking-tight">
            For most small contractors, avoiding just one bad-fit proposal can pay for the platform.
          </p>
        </div>
      </section>

      {/* ── SECTION 2 — Pricing Cards ────────────────────────────────────── */}
      <section className="pb-6 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Summer Bid Clarity Pass offer strip */}
          <Notice label="Summer Offer" className="mb-4">
            <span className="font-bold text-[#00c3ff]">Summer Bid Clarity Pass:</span> get 2 months of Starter or Pro, free. Use code{' '}
            <NoticeCode>SUMMER2026</NoticeCode>{' '}
            at checkout. <span className="font-bold text-[#00c3ff]">Offer ends July 31.</span> Cancel anytime; it renews at the regular price after.
          </Notice>
          <div className="mb-8 rounded-xl border border-[#00c3ff]/30 bg-[#00c3ff]/5 px-6 py-4 text-center">
            <p className="font-headline font-bold text-white text-base md:text-lg tracking-tight">
              Free helps you <span className="text-[#00c3ff]">screen</span> opportunities. Paid plans help you make <span className="text-[#00c3ff]">bid/no-bid decisions</span>.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((plan, i) => (
              <FlyIn key={plan.name} delay={['', 'delay-150', 'delay-300', 'delay-[450ms]'][i]}>
              <div
                id={plan.name.toLowerCase()}
                className={`scroll-mt-24 rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden transition-all duration-300 h-full ${
                  plan.highlight
                    ? 'bg-[#0b1120] border border-[#00c3ff]/50 shadow-[0_0_60px_rgba(0,195,255,0.12)]'
                    : 'bg-[#0b1120] border border-[#1e2d4a] group hover:border-[#00c3ff]/30'
                }`}
              >
                {plan.highlight && (
                  <>
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/60 to-transparent rounded-t-2xl"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.06)_0%,transparent_65%)] pointer-events-none"></div>
                  </>
                )}
                {!plan.highlight && (
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                )}

                {/* Header — min-h ensures price aligns across all cards */}
                <div className="min-h-[6rem]">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-headline text-xl font-bold text-white">{plan.name}</h3>
                    {plan.badge && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-widest font-label shrink-0 ml-2 ${
                        plan.highlight
                          ? 'text-[#030B17] bg-[#00c3ff]'
                          : 'border border-[#8b9bb4]/40 text-[#8b9bb4]'
                      }`}>{plan.badge}</span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-white mb-0.5 font-headline">{plan.tagline}</p>
                  <p className="text-xs text-[#8b9bb4] font-body">{plan.sub}</p>
                </div>

                {/* Price */}
                <div className={`flex items-baseline gap-1 ${(plan.price !== '$0' && plan.name !== 'Team') || ('valueLine' in plan && plan.valueLine) ? 'mb-1' : 'mb-5'}`}>
                  <span className="text-4xl font-black text-white font-headline">{plan.price}</span>
                  {plan.price !== '$0' && <span className="text-[#8b9bb4] text-sm font-body">/mo</span>}
                </div>
                {plan.price !== '$0' && plan.name !== 'Team' && (
                  <p className={`text-[#00c3ff] text-xs font-bold font-body ${'valueLine' in plan && plan.valueLine ? 'mb-1' : 'mb-5'}`}>
                    2 months free with SUMMER2026 · ends July 31
                  </p>
                )}
                {'valueLine' in plan && plan.valueLine && (
                  <p className="text-xs text-[#8b9bb4] font-body mb-5">{plan.valueLine}</p>
                )}

                {/* Features */}
                {plan.includesAbove && (
                  <p className="text-xs text-[#8b9bb4] uppercase tracking-widest font-label mb-3">{plan.includesAbove}</p>
                )}
                <ul className="space-y-2 text-sm text-[#a0b2c8] flex-grow font-body mb-4 relative z-10">
                  {plan.features.map(f => (
                    <li key={f} className="flex gap-2.5 items-start">
                      <Check className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Limits (Free only) */}
                {'limits' in plan && plan.limits && (
                  <ul className="space-y-1.5 text-xs text-[#8b9bb4] font-body mb-4 border-t border-[#1e2d4a] pt-4">
                    {plan.limits.map((l: string) => (
                      <li key={l} className="flex gap-2 items-start">
                        <Ban className="w-3.5 h-3.5 text-[#2a3a4e] shrink-0 mt-0.5" strokeWidth={2} />
                        {l}
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  to={plan.ctaTo}
                  className={`block w-full py-3 text-center font-bold rounded-lg transition-all text-sm font-headline relative z-10 ${
                    plan.highlight
                      ? 'bg-[#00c3ff] text-[#030B17] shadow-[0_0_30px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98]'
                      : 'border border-[#1e2d4a] text-white hover:bg-[#152033] hover:border-[#00c3ff]/40 duration-300'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
              </FlyIn>
            ))}
          </div>

          <p className="text-sm text-[#8b9bb4] font-body text-center mt-6">
            A pursuit = one opportunity run through the full 5-phase bid/no-bid workflow.
          </p>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-8 text-base text-[#8b9bb4] font-body">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center relative overflow-visible shrink-0">
                <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 rounded-full scale-150"></div>
                <ShieldCheck className="w-5 h-5 text-[#00c3ff] relative z-10" strokeWidth={2} />
              </div>
              No credit card required
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center relative overflow-visible shrink-0">
                <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 rounded-full scale-150"></div>
                <Check className="w-5 h-5 text-[#00c3ff] relative z-10" strokeWidth={2.5} />
              </div>
              Start with real opportunities
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center relative overflow-visible shrink-0">
                <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 rounded-full scale-150"></div>
                <Clock className="w-5 h-5 text-[#00c3ff] relative z-10" strokeWidth={2} />
              </div>
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — What You're Paying For ───────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.04)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">What You're Paying For</span>
          </div>
          <h2 className="font-headline font-black text-4xl md:text-5xl xl:text-6xl text-white mb-6 tracking-tighter leading-tight drop-shadow-2xl">
            You're not paying for more data.<br />You're paying for better decisions.
          </h2>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-3xl">
            Most teams already have access to opportunities. The challenge is knowing which ones are worth pursuing.
            HE Pursuit helps you qualify faster, reduce wasted effort, and focus your time where it has the best chance to pay off.
          </p>
        </div>
      </section>

      {/* ── SECTION 4 — Plan Positioning ─────────────────────────────────── */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">Who It's For</span>
            </div>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight">Find your fit.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { plan: 'Free',    desc: 'Just exploring GovCon? Screen live SAM.gov notices at no cost.',                Icon: Eye           },
              { plan: 'Starter', desc: 'Bidding actively on your own? Run the full 5-phase workflow on your real profile.', Icon: ClipboardList },
              { plan: 'Pro',     desc: 'Managing a pipeline? Track decisions across every pursuit, unlimited.',         Icon: Rocket        },
              { plan: 'Team',    desc: 'Running a capture team? Join the waitlist for shared workspaces.',              Icon: Users         },
            ].map(({ plan, desc, Icon }, i) => (
              <FlyIn key={plan} delay={['', 'delay-150', 'delay-300', 'delay-[450ms]'][i]}>
              <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 h-full">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                    <Icon className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                  </div>
                  <p className="text-xs font-label uppercase tracking-widest text-[#00c3ff] pt-3">{plan}</p>
                </div>
                <p className="text-white font-body leading-relaxed">{desc}</p>
              </div>
              </FlyIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — Comparison Table ─────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">Compare Plans</span>
            </div>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight">
              See exactly what changes at each tier.
            </h2>
          </div>

          <p className="sm:hidden text-xs text-[#8b9bb4] font-body text-right mb-2">Swipe to compare &rarr;</p>
          <div className="relative">
          <div className="overflow-x-auto rounded-2xl border border-[#1e2d4a]">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-[#1e2d4a] bg-[#0b1120]">
                  <th className="text-left px-6 py-4 text-[#8b9bb4] font-label uppercase tracking-widest text-xs sm:w-2/5 max-w-[40vw] sm:max-w-none whitespace-normal break-words sticky left-0 z-10 bg-[#0b1120] border-r border-[#1e2d4a]">Feature</th>
                  <th className="px-4 py-4 text-center text-white font-headline font-bold text-sm">Free</th>
                  <th className="px-4 py-4 text-center text-white font-headline font-bold text-sm">Starter</th>
                  <th className="px-4 py-4 text-center font-headline font-bold text-sm"><span className="text-[#00c3ff]">Pro</span></th>
                  <th className="px-4 py-4 text-center text-white font-headline font-bold text-sm">Team</th>
                </tr>
              </thead>
              <tbody className="bg-[#080f1c]">
                {categories.map(cat => (
                  <React.Fragment key={cat}>
                    <tr className="border-t border-[#1e2d4a] bg-[#0b1120]/80">
                      <td className="px-6 py-3 text-xs font-bold text-[#00c3ff] uppercase tracking-widest font-label max-w-[40vw] sm:max-w-none whitespace-normal break-words sticky left-0 z-10 bg-[#0b1120] border-r border-[#1e2d4a]">{cat}</td>
                      <td colSpan={4}></td>
                    </tr>
                    {features.filter(f => f.category === cat).map(f => (
                      <tr key={f.name} className="border-t border-[#1e2d4a]/60 hover:bg-[#0d1625] transition-colors">
                        <td className="px-6 py-4 text-[#a0b2c8] font-body max-w-[40vw] sm:max-w-none whitespace-normal break-words sticky left-0 z-10 bg-[#080f1c] border-r border-[#1e2d4a]">{f.name}</td>
                        <td className="px-4 py-4 text-center"><Cell value={f.free} /></td>
                        <td className="px-4 py-4 text-center"><Cell value={f.starter} /></td>
                        <td className="px-4 py-4 text-center bg-[#00c3ff]/[0.03]"><Cell value={f.pro} /></td>
                        <td className="px-4 py-4 text-center"><Cell value={f.team} /></td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden pointer-events-none absolute inset-y-0 right-0 w-12 rounded-r-2xl bg-gradient-to-l from-[#030B17] to-transparent" aria-hidden="true"></div>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-5 px-1">
            <div className="flex items-center gap-2 text-sm text-[#8b9bb4] font-body">
              <Check className="w-4 h-4 text-[#00c3ff]" strokeWidth={2.5} /> Included
            </div>
            <div className="flex items-center gap-2 text-sm text-[#8b9bb4] font-body">
              <span className="text-[#8b9bb4]" aria-label="Not included">&mdash;</span> Not included
            </div>
            <div className="flex items-center gap-2 text-sm text-[#8b9bb4] font-body">
              <span className="text-[#8b9bb4] text-sm">15/mo</span> Usage limit applies
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — FAQ ──────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">Common Questions</span>
            </div>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight">
              Questions before you choose a plan?
            </h2>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#0d1828] transition-colors duration-200"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-white font-bold font-headline pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#00c3ff] shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                    strokeWidth={2}
                  />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-out ${openFaq === i ? 'max-h-96' : 'max-h-0'}`}>
                  <p className="px-6 pb-5 pt-4 text-[#a0b2c8] text-sm font-body leading-relaxed border-t border-[#1e2d4a]">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7 — Final CTA ────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">Get Started</span>
          </div>
          <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-5 tracking-tight">
            Start free. Upgrade when you're ready.
          </h2>
          <p className="text-[#a0b2c8] text-lg mb-10 leading-relaxed font-body">
            No credit card required. Real opportunities from day one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup/?promo=summer2026" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline">
              Start Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact/" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline">
              Talk to the Team
            </Link>
          </div>
          <p className="mt-6 text-sm text-[#8b9bb4] font-body">
            Not sure yet?{' '}
            <Link to="/tools/sam-gov-notice-analyzer/" className="text-[#00c3ff] hover:underline">
              Score a SAM.gov notice free &rarr;
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
