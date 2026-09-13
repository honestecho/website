import type { ElementType } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Sparkles, CheckCircle, Users, Building2, ClipboardCheck, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import FlyIn from '../components/FlyIn';
import Notice from '../components/Notice';
import { SoftwareApplicationSchema } from '../components/SchemaOrg';
import HeroPursuitCardZoom from '../components/HeroPursuitCardZoom';
import ProfileIllustration from '../components/ProfileIllustration';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Honest Echo — GovCon Bid/No-Bid Intelligence for Small Contractors</title>
        <meta name="description" content="Find, qualify, and decide on government contracting opportunities faster. HE Pursuit analyzes SAM.gov notices and gives small contractors a bid/no-bid recommendation in minutes — before you waste proposal hours." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/" />
        <meta property="og:title" content="HE Pursuit — Bid/No-Bid Decisions for Small Government Contractors" />
        <meta property="og:description" content="Find, qualify, and decide on government contracting opportunities faster. SAM.gov opportunity scoring, fit analysis, and pursuit intelligence for lean GovCon teams." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview-3.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HE Pursuit — Bid/No-Bid Decisions for Small Government Contractors" />
        <meta name="twitter:description" content="Qualify government contracting opportunities in minutes. SAM.gov opportunity scoring and pursuit intelligence for lean GovCon teams." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview-3.png" />
      </Helmet>
      <SoftwareApplicationSchema />

      {/* ── SECTION 1 — Hero ─────────────────────────────────────────────── */}
      <section className="relative px-6 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Left Column: Copy */}
          <div className="w-full lg:w-1/2">
            {/* Fall Bid Clarity Pass promo */}
            <Notice align="left" className="mb-5">
              <span className="font-headline font-bold">Friends don't let friends read SAM.gov raw.</span>{' '}
              Fall Bid Clarity Pass: 2 months of Starter or Pro free — applied automatically at checkout.{' '}
              <span className="text-[#00c3ff] font-bold">Ends November 30, 2026.</span>
            </Notice>
            <h1 className="font-headline font-black text-4xl sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] tracking-tighter text-white mb-5 leading-tight drop-shadow-2xl">
              Stop wasting proposal hours on bids you{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c3ff] to-[#5b8cff]">shouldn't chase.</span>
            </h1>

            <p className="text-[#a0b2c8] text-base lg:text-xl mb-8 leading-relaxed font-body">
              HE Pursuit is a bid/no-bid decision tool for small government contractors. It scores every SAM.gov opportunity against your profile, ranks the ones worth your pursuit time, and flags the near-misses that look right and aren’t — with the evidence behind every call.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Link to="/tools/sam-gov-notice-analyzer/" className="px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                Analyze a SAM.gov Notice — Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <p className="flex items-center gap-2 text-sm text-[#8b9bb4] font-body">
              <CheckCircle className="w-4 h-4 text-[#00c3ff] shrink-0" />
              No login required to analyze a live SAM.gov opportunity.
            </p>
            <p className="mt-3 text-sm font-body">
              <Link to="/signup/?promo=fall2026" className="text-[#00c3ff] font-semibold hover:underline underline-offset-4">
                Or start free with an account →
              </Link>
            </p>
          </div>

          {/* Right Column: static opportunity card */}
          <div className="w-full lg:w-[58%] relative hidden md:flex items-center transition-transform duration-700 hover:-translate-y-2">
            <HeroPursuitCardZoom />
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — How Pursuit works (user journey, 4 steps) ────────── */}
      <section className="px-6 py-24 lg:py-28 relative">
        <div className="max-w-7xl mx-auto relative z-10">

          {/* Headline row — full width so the Radar can align with step 01 below */}
          <div className="mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">How Pursuit Works</span>
            </div>
            <h2 className="font-headline font-black text-[37px] md:text-5xl lg:text-[54px] text-white tracking-[-0.045em] md:tracking-[-0.035em] leading-[0.98] md:leading-[0.96] max-w-[340px] md:max-w-[720px]">
              Build your profile.<br />Find what fits.<br /><span className="sm:whitespace-nowrap">Decide with <span className="max-sm:block">the evidence.</span></span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-x-16 items-start">

            {/* Steps */}
            <ol className="mt-0">
              {[
                {
                  step: '01',
                  title: 'Build your business profile',
                  body: 'Add your NAICS codes, certifications, target agencies, geography, contract size, and past performance. A few minutes, once.',
                },
                {
                  step: '02',
                  title: 'Find opportunities that fit',
                  body: 'Pursuit scores SAM.gov opportunities against your profile, brings the strongest matches to the top, and alerts you when new ones appear.',
                },
                {
                  step: '03',
                  title: 'Confirm eligibility and fit',
                  body: 'Quickly check set-asides, requirements, timing, geography, and other factors that could make an opportunity a poor fit.',
                },
                {
                  step: '04',
                  title: 'Decide what’s worth pursuing',
                  body: 'For the promising opportunities, weigh strategic value, effort, and risk — then make a documented bid/no-bid decision.',
                },
              ].map(({ step, title, body }) => (
                <li key={step} className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-x-5 pb-5 sm:pb-7 lg:pb-10 last:pb-0 max-sm:after:top-10 after:absolute after:left-[19px] after:top-11 after:bottom-0 after:w-px after:bg-[#1e2d4a] last:after:hidden">
                  <div className="w-10 h-10 rounded-xl border border-[#00c3ff]/60 bg-[#00c3ff]/[.06] flex items-center justify-center font-headline font-bold text-[15px] text-[#00c3ff] tabular-nums">
                    {step}
                  </div>
                  <div className="pt-1.5">
                    <h3 className="font-headline font-black text-xl lg:text-[22px] text-white tracking-tight leading-snug mb-2">{title}</h3>
                    <p className="text-[#a0b2c8] text-[15px] sm:text-base leading-[1.38] sm:leading-[1.45] lg:leading-[1.55] font-body max-w-[52ch]">{body}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* The Scoring Alignment Check — what step 01 builds and the first match it produces */}
            <div className="lg:self-start lg:max-w-[580px] lg:justify-self-end w-full">
              <ProfileIllustration />
              <p className="hidden">
                The Scoring Alignment Check inside HE Pursuit, with illustrative values: the profile you build in step 01, and the first match it produces.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 3 — Who it's for (persona doorways) ──────────────────── */}
      <section className="px-6 py-24 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">Who It's For</span>
            </div>
            <h2 className="font-headline font-black text-[38px] md:text-5xl lg:text-[52px] text-white tracking-[-0.04em] leading-[0.98] max-w-[15ch] md:max-w-[1040px] [text-wrap:balance]">
              Built for the people who read SAM.gov so the company doesn't have to.
            </h2>
          </div>

          {/* One contained panel, three doorway rows — same language as the steps panel */}
          <div className="rounded-2xl border border-[#1e2d4a]/70 bg-[#0b1120] shadow-2xl divide-y divide-[#1e2d4a]/55 overflow-hidden">
            {([
              {
                icon: Building2,
                to: '/for-small-business-owners/',
                who: 'Small business owners',
                title: 'Sub today. Prime when the notice is right.',
                body: 'Set-aside holders and subcontractors who want their own paper: certification matches and primeable-at-your-size flags on every notice you evaluate.',
                cta: 'The owner’s walkthrough',
              },
              {
                icon: ClipboardCheck,
                to: '/for-proposal-managers/',
                who: 'Proposal managers',
                title: 'Too many notices. A ranked shortlist instead.',
                body: 'Screen before you read: scored inflow, disqualifiers up front, and a bid/no-bid with the reasoning recorded.',
                cta: 'See the triage workflow',
              },
              {
                icon: Briefcase,
                to: '/for-govcon-consultants/',
                who: 'GovCon consultants',
                title: 'A no-bid with the rationale attached.',
                body: 'Evidence-backed scores you can put in front of a client, plus a free analyzer you can demo live in a workshop.',
                cta: 'See the client workflow',
              },
            ] as { icon: ElementType; to: string; who: string; title: string; body: string; cta: string }[]).map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className="group grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_auto] gap-x-10 gap-y-4 lg:items-start px-6 py-7 sm:px-8 lg:px-10 lg:py-9 transition-colors hover:bg-[#00c3ff]/[.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00c3ff]"
              >
                <div className="flex items-center gap-3 lg:pt-0.5">
                  <card.icon className="w-6 h-6 text-[#00c3ff] shrink-0" strokeWidth={2} />
                  <span className="font-headline font-black text-xl text-white tracking-tight leading-tight">{card.who}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-headline font-bold text-lg text-white tracking-tight leading-snug">{card.title}</h3>
                  <p className="mt-1.5 text-[15px] text-[#a0b2c8] font-body leading-6 max-w-[64ch]">{card.body}</p>
                </div>
                <span className="flex items-center justify-between gap-2 max-sm:w-full lg:pt-1.5 text-sm font-bold text-white group-hover:text-[#00c3ff] transition-colors whitespace-nowrap lg:justify-self-end">
                  {card.cta} <ArrowRight className="w-4 h-4 text-[#00c3ff] transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — Pricing ───────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-10 max-w-4xl">
            <h2 className="font-headline font-black text-4xl md:text-5xl text-white mb-6 tracking-tight leading-tight">
              Start simple. Upgrade when your pursuit process needs more structure.
            </h2>
            <p className="text-xl text-[#a0b2c8] font-body">
              Starter is $99/month and Pro is $199/month. Compare that with the labor cost of one proposal your team decides not to write.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto mt-12">

            {/* Free */}
            <FlyIn>
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300 h-full">
              <h3 className="font-headline text-xl font-bold text-white mb-1">Free</h3>
              <p className="text-xs text-[#8b9bb4] mb-4">Try the product</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white">$0</span>
              </div>
              <ul className="space-y-2 text-sm text-[#a0b2c8] mb-6 flex-grow">
                {['Search SAM.gov opportunities', 'Bookmark up to 15 opportunities/mo', 'Saved searches & nightly alerts'].map(f => (
                  <li key={f} className="flex gap-2 items-start"><Sparkles className="w-3.5 h-3.5 text-[#00c3ff] shrink-0 mt-0.5"/>{f}</li>
                ))}
              </ul>
              <Link to="/signup/?promo=fall2026" className="block text-center w-full py-3 rounded-lg border border-[#1e2d4a] text-white font-bold hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all text-sm">Start Free</Link>
            </div>
            </FlyIn>

            {/* Starter */}
            <FlyIn delay="delay-150">
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300 h-full">
              <h3 className="font-headline text-xl font-bold text-white mb-1">Starter</h3>
              <p className="text-xs text-[#8b9bb4] mb-4">For solo contractors</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white">$99</span>
                <span className="text-[#8b9bb4] text-sm">/mo</span>
              </div>
              <ul className="space-y-2 text-sm text-[#a0b2c8] mb-6 flex-grow">
                {['25 pursuits', 'Full 5-phase AI workflow', 'Eligibility & disqualifier review', 'Strategic & effort scoring', 'Decision tracking (per-pursuit)'].map(f => (
                  <li key={f} className="flex gap-2 items-start"><Sparkles className="w-3.5 h-3.5 text-[#00c3ff] shrink-0 mt-0.5"/>{f}</li>
                ))}
              </ul>
              <Link to="/signup/?promo=fall2026" className="block text-center w-full py-3 rounded-lg border border-[#1e2d4a] text-white font-bold hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all text-sm">Select Starter</Link>
            </div>
            </FlyIn>

            {/* Pro — highlighted */}
            <FlyIn delay="delay-300">
            <div className="bg-[#0b1120] border border-[#00c3ff]/50 rounded-2xl p-6 flex flex-col shadow-[0_0_60px_rgba(0,195,255,0.12)] relative overflow-hidden h-full">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/60 to-transparent rounded-t-2xl"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.06)_0%,transparent_65%)] pointer-events-none"></div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-headline text-xl font-bold text-white">Pro</h3>
                <span className="text-xs font-bold text-[#030B17] bg-[#00c3ff] px-2 py-0.5 rounded-full uppercase tracking-widest">Recommended</span>
              </div>
              <p className="text-xs text-[#8b9bb4] mb-4">For small contractors & proposal teams</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white">$199</span>
                <span className="text-[#8b9bb4] text-sm">/mo</span>
              </div>
              <ul className="space-y-2 text-sm text-[#a0b2c8] mb-6 flex-grow relative z-10">
                {['Unlimited pursuits', 'Everything in Starter', 'PDF Decision Package export', 'Priority email support'].map(f => (
                  <li key={f} className="flex gap-2 items-start"><Sparkles className="w-3.5 h-3.5 text-[#00c3ff] shrink-0 mt-0.5"/>{f}</li>
                ))}
              </ul>
              <Link to="/signup/?promo=fall2026" className="block text-center w-full py-3 rounded-lg bg-[#00c3ff] text-[#030B17] font-bold shadow-[0_0_30px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 text-sm">Select Pro</Link>
            </div>
            </FlyIn>

          </div>

          {/* Team — same coming-soon strip as /pricing, not a fourth equal-weight card */}
          <div className="max-w-6xl mx-auto mt-6 rounded-2xl border border-[#1e2d4a] bg-[#0b1120] px-6 py-5 flex flex-col md:flex-row md:items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#00c3ff]/10 border border-[#00c3ff]/30 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-[#00c3ff]" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-headline font-bold text-white text-base tracking-tight">Team — shared workspaces are coming.</p>
              <p className="text-sm text-[#8b9bb4] font-body">$299/mo. Multiple users, shared pursuits, team-level visibility. Not available yet.</p>
            </div>
            <Link to="/team-waitlist/" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white border border-[#1e2d4a] rounded-lg hover:border-[#00c3ff]/40 hover:text-[#00c3ff] transition-colors shrink-0">
              Join the waitlist <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-center text-sm text-[#8b9bb4]/60 mt-8 max-w-6xl mx-auto">
            <Link to="/pricing/" className="text-[#00c3ff] hover:underline">See full feature comparison →</Link>
          </p>
        </div>
      </section>

      {/* ── SECTION 5 — Common Questions ─────────────────────────────────── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">Common Questions</span>
            </div>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight">
              Built to support judgment, not replace it.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                q: 'Do I need to upload a full solicitation to get value?',
                a: 'No. Start with the opportunity itself, then go deeper when the pursuit warrants it.',
              },
              {
                q: 'Is this a replacement for capture strategy?',
                a: 'No. HE Pursuit gives your team a consistent, documented way to qualify opportunities so the time goes to the bids that deserve real strategy.',
              },
              {
                q: 'Who is this built for?',
                a: 'Small GovCon teams and business owners who need to protect proposal bandwidth and stop chasing low-fit opportunities.',
              },
              {
                q: 'How is this different from GovWin or GovTribe?',
                a: 'HE Pursuit is built around one job: turning a SAM.gov notice and your company profile into a documented bid/no-bid decision. It is not a market-intelligence database. If you already use one, HE Pursuit is where the go/no-go call gets made and recorded.',
              },
            ].map(({ q, a }, i) => (
              <FlyIn key={q} delay={['', 'delay-150', 'delay-300', 'delay-[450ms]'][i]}>
              <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-300 h-full">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                <p className="text-white font-bold font-headline text-base mb-3">{q}</p>
                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">{a}</p>
              </div>
              </FlyIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — Final CTA ─────────────────────────────────────────── */}
      <section className="py-20 px-6 relative">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-4 tracking-tight">
            Spend less time debating.<br />Spend more time pursuing the right bids.
          </h2>
          <p className="text-[#a0b2c8] text-lg mb-10 leading-relaxed font-body max-w-xl mx-auto">
            Paste one notice you're weighing right now and see the verdict, with the reasons, before you commit an hour.
          </p>
          <Link to="/tools/sam-gov-notice-analyzer/" className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all">
            Analyze a SAM.gov Notice — Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-4 text-sm font-body">
            <Link to="/signup/?promo=fall2026" className="text-[#00c3ff] font-semibold hover:underline underline-offset-4">
              Or start free with an account →
            </Link>
          </p>
        </div>
      </section>

    </>
  );
}
