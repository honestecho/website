import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Sparkles, Target, Scale, FileText, CheckCircle, Upload, Compass, Clock, Shuffle, Filter, Shield, TrendingUp, Quote } from 'lucide-react';
// Scale, Upload used in How It Works steps
import { Link } from 'react-router-dom';
import FlyIn from '../components/FlyIn';
import { SoftwareApplicationSchema } from '../components/SchemaOrg';
import HeroPursuitCard from '../components/HeroPursuitCard';

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
      <section className="relative px-6 py-32">
        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Left Column: Copy */}
          <div className="w-full lg:w-1/2">
            <h1 className="font-headline font-black text-4xl sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] tracking-tighter text-white mb-5 leading-tight drop-shadow-2xl">
              Stop wasting proposal hours on bids you{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c3ff] to-[#5b8cff]">shouldn't chase.</span>
            </h1>

            <p className="text-[#a0b2c8] text-base lg:text-xl mb-8 leading-relaxed font-body">
              HE Pursuit helps small government contractors evaluate government contracting opportunities for fit, eligibility, and pursuit value in minutes — so your team can make faster, more defensible bid/no-bid decisions before committing proposal capacity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Link to="/signup/" className="px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                Start Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/tools/sam-gov-notice-analyzer/" className="px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00c3ff]" />
                Analyze a SAM.gov Notice
              </Link>
            </div>

            <p className="flex items-center gap-2 text-sm text-[#8b9bb4] font-body">
              <CheckCircle className="w-4 h-4 text-[#00c3ff] shrink-0" />
              No login required to analyze a live SAM.gov opportunity.
            </p>
          </div>

          {/* Right Column: static opportunity card */}
          <div className="w-full lg:w-[58%] relative hidden md:flex items-center transition-transform duration-700 hover:-translate-y-2">
            <HeroPursuitCard />
          </div>
        </div>

        {/* Full-width filmstrip */}
        <div className="max-w-7xl mx-auto relative z-10 mt-10">
          <div className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] grid grid-cols-2 md:grid-cols-4 divide-x divide-[#1e2d4a]">
            {([
              { Icon: Clock,      title: 'Save Hours',   body: 'Analyze in seconds, not hours'           },
              { Icon: Target,     title: 'Bid Smarter',  body: 'Focus on opportunities worth pursuing'   },
              { Icon: Shield,     title: 'Reduce Risk',  body: 'Spot potential issues before you invest' },
              { Icon: TrendingUp, title: 'Win More',     body: 'Make data-driven go / no-go decisions'   },
            ] as { Icon: React.ElementType; title: string; body: string }[]).map((item, i) => (
              <div key={item.title} className={`flex items-center gap-3 px-4 sm:px-6 md:px-8 py-5 md:py-6 group cursor-default ${i >= 2 ? 'border-t border-[#1e2d4a] md:border-t-0' : ''}`}>
                <div className="w-9 h-9 flex items-center justify-center relative overflow-visible shrink-0">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <item.Icon className="w-5 h-5 text-[#00c3ff] group-hover:text-white group-hover:scale-110 drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <div>
                  <div className="text-base font-black text-white font-headline leading-none mb-1">{item.title}</div>
                  <div className="text-sm text-[#a0b2c8] font-body leading-snug">{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────── */}
      <section className="px-6 pb-8 relative" aria-label="What customers say">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {([
              {
                quote: "I don't start on SAM.gov anymore.",
                body: 'HE Pursuit screens the noise first. I can see which opportunities are worth a real look, what the risks are, and whether I should move into a pursuit review before I burn proposal hours.',
                name: 'Keith L.',
                role: 'Small Business Owner, Audio/Visual Services',
              },
              {
                quote: 'The compliance review is where it clicked.',
                body: 'HE Pursuit did not just summarize the solicitation. It surfaced the requirements that could affect our bid decision and still produced a draft compliance matrix we could use if we moved forward.',
                name: 'Matt S.',
                role: 'Small Business Owner, IT Services',
              },
              {
                quote: 'It helped us say no with confidence.',
                body: 'For a small team, the expensive mistake is chasing the wrong opportunity. HE Pursuit gave us a clear go/no-go record, the reasons behind it, and the open risks we would have had to resolve.',
                name: 'Priya S.',
                role: 'Capture Lead, Government Contractor',
              },
            ] as { quote: string; body: string; name: string; role: string }[]).map((t, i) => (
              <FlyIn key={t.name} delay={['', 'delay-150', 'delay-300'][i]} alwaysAnimate className="h-full">
              <figure className="group bg-[#0b1120] border border-[#1e2d4a] hover:border-[#00c3ff]/40 p-8 rounded-2xl relative shadow-2xl hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 h-full flex flex-col">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible mb-5">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <Quote aria-hidden="true" className="w-6 h-6 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <blockquote className="flex flex-col flex-grow">
                  <p className="font-headline font-black text-lg text-white mb-3 tracking-tight leading-snug">{t.quote}</p>
                  <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">{t.body}</p>
                </blockquote>
                <figcaption className="mt-6 pt-5 border-t border-[#1e2d4a]">
                  <span className="block text-white font-bold text-sm font-headline">{t.name}</span>
                  <span className="block text-[#8b9bb4] text-xs font-body mt-0.5">{t.role}</span>
                </figcaption>
              </figure>
              </FlyIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works (5 steps) ───────────────────────────────────────── */}
      <section className="px-6 py-32 relative">
        <div className="max-w-7xl mx-auto relative z-10">

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">How HE Pursuit Works</span>
            </div>
            <h2 className="font-headline font-black text-4xl md:text-5xl text-white tracking-tight">
              From opportunity to decision in minutes.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Upload,      step: '01', title: 'Start with the opportunity',        body: 'Import or review an opportunity and capture the core signals that matter first.' },
              { icon: Target,      step: '02', title: 'Check fit and eligibility',          body: 'Assess alignment across your business profile, set-asides, certifications, location, and other qualification criteria.' },
              { icon: Scale,       step: '03', title: 'Evaluate pursuit value and effort',  body: 'Look beyond technical fit to determine whether the opportunity is worth the time, cost, and internal attention required.' },
              { icon: FileText,    step: '04', title: 'Get a bid/no-bid recommendation',   body: 'Make a more disciplined decision with a recommendation grounded in evidence and structured review.' },
              { icon: CheckCircle, step: '05', title: 'Move forward with confidence',      body: 'Pursue strong-fit opportunities faster and walk away from weak-fit ones earlier.' },
            ].map(({ icon: Icon, step, title, body }, i) => (
              <FlyIn key={step} delay={['', 'delay-100', 'delay-200', 'delay-300', 'delay-[400ms]'][i]}>
              <div className="group bg-[#0b1120] border border-[#1e2d4a] hover:border-[#00c3ff]/40 p-6 rounded-2xl relative shadow-2xl hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 h-full">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center relative overflow-visible flex-shrink-0">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                    <Icon className="w-6 h-6 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                  </div>
                  <span className="text-[#8b9bb4] text-xs font-label uppercase tracking-widest">Step {step}</span>
                </div>
                <h3 className="font-headline font-black text-lg text-white mb-2 tracking-tight">{title}</h3>
                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">{body}</p>
              </div>
              </FlyIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — Why It Matters ───────────────────────────────────── */}
      {/* #10 badge, #16 headline+body, #20 tiles */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">The Problem</span>
          </div>

          <h2 className="font-headline font-black text-4xl xl:text-5xl text-white mb-6 leading-tight tracking-tight max-w-4xl">
            Most small GovCon teams do not lose because they lack capability. They lose because they spend scarce time on the wrong pursuits.
          </h2>

          <p className="text-[#a0b2c8] text-lg mb-14 leading-relaxed font-body max-w-4xl">
            Every weak-fit bid consumes proposal hours, leadership attention, and B&P dollars that could have gone to stronger opportunities. HE Pursuit helps your team qualify earlier, walk away sooner, and focus effort where it has a real chance to pay off.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {([
              {
                icon: Clock,
                title: 'Wasted proposal hours',
                body: 'Bad-fit pursuits consume scarce time and money before your team realizes they were never worth chasing.',
              },
              {
                icon: Shuffle,
                title: 'Inconsistent bid/no-bid decisions',
                body: 'When qualification is informal, teams chase the wrong bids, miss warning signs, and struggle to make repeatable decisions.',
              },
              {
                icon: Filter,
                title: 'Too many low-quality pursuits',
                body: 'Weak opportunities create noise, distract the team, and pull energy away from the bids with real win potential.',
              },
            ] as { icon: React.ElementType; title: string; body: string }[]).map((card, i) => (
              <FlyIn key={card.title} delay={['', 'delay-150', 'delay-300'][i]}>
              <div
                className="group bg-[#0b1120] border border-[#1e2d4a] hover:border-[#f5a623]/40 p-8 rounded-2xl relative shadow-2xl hover:shadow-[0_0_40px_rgba(245,166,35,0.08)] transition-all duration-500"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#f5a623]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible mb-6">
                  <div className="absolute inset-0 bg-[#f5a623] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <card.icon className="w-6 h-6 text-[#f5a623] group-hover:text-white drop-shadow-[0_0_8px_rgba(245,166,35,0.8)] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(245,166,35,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <h3 className="font-headline font-black text-xl text-white mb-3 tracking-tight">{card.title}</h3>
                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">{card.body}</p>
              </div>
              </FlyIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — Why HE Pursuit ───────────────────────────────────── */}
      {/* #10 badge update, #17 headline+body */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header — full width */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">Why HE Pursuit</span>
            </div>

            <h2 className="font-headline font-black text-4xl xl:text-5xl text-white mb-5 leading-tight tracking-tight">
              Built for disciplined bid decisions, not generic opportunity tracking.
            </h2>

            <p className="text-[#a0b2c8] text-lg mb-10 leading-relaxed font-body">
              Tools like <Link to="/vs-govwin/" className="text-[#00c3ff] underline hover:text-white transition-colors">GovWin</Link> and <Link to="/vs-govtribe/" className="text-[#00c3ff] underline hover:text-white transition-colors">GovTribe</Link> help you discover SAM.gov opportunities. HE Pursuit helps you decide which ones deserve your time. It gives lean GovCon teams a repeatable way to qualify opportunities, pressure-test assumptions, and avoid proposal churn.
            </p>

            <Link to="/pricing/" className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all">
              See Pricing
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Differentiators — 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {([
              {
                icon: Target,
                label: 'Fit scoring based on your actual business',
                body: 'Evaluate each opportunity against the criteria that matter to your company, not a generic checklist.',
              },
              {
                icon: Compass,
                label: 'Structured 5-phase pursuit workflow',
                body: 'Move from opportunity triage to eligibility, strategic value, effort, and final go/no-go in one repeatable process.',
              },
              {
                icon: FileText,
                label: 'Decision-ready output',
                body: 'Turn scattered opportunity details into a practical recommendation your team can review, challenge, and act on.',
              },
            ] as { icon: React.ElementType; label: string; body: string }[]).map((item, i) => (
              <FlyIn key={item.label} delay={['', 'delay-150', 'delay-300'][i]} className="h-full">
              <div className="group bg-[#0b1120] border border-[#1e2d4a] hover:border-[#00c3ff]/40 p-8 rounded-2xl relative shadow-2xl hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 h-full">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 relative overflow-visible mb-5">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <item.icon className="w-6 h-6 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <p className="text-white font-bold text-base font-headline mb-2">{item.label}</p>
                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">{item.body}</p>
              </div>
              </FlyIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — Built for Small Businesses ───────────────────────── */}
      {/* #11 title change */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
                <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">Who It's For</span>
              </div>
              <h2 className="font-headline font-black text-4xl xl:text-5xl text-white mb-5 leading-tight tracking-tight">
                Built for Small Businesses.
              </h2>
              <p className="text-[#a0b2c8] text-lg leading-relaxed font-body">
                HE Pursuit is built for small government contractors, owner-operators, capture leads, and lean BD teams that need a smarter way to qualify opportunities without burning time on every notice that looks interesting.
              </p>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.03)_0%,transparent_70%)] pointer-events-none"></div>
                <ul className="space-y-5 relative z-10">
                  {[
                    'Small GovCon teams with limited proposal capacity',
                    'Companies that need more discipline in bid/no-bid decisions',
                    'Capture and BD leaders trying to reduce wasted effort',
                    'Teams that want a clearer, more repeatable qualification process',
                  ].map((bullet) => (
                    <li key={bullet} className="flex gap-4 items-start group/item">
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 relative overflow-visible mt-0.5">
                        <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-15 group-hover/item:opacity-50 transition-opacity duration-500 rounded-full scale-110"></div>
                        <CheckCircle className="w-5 h-5 text-[#00c3ff] relative z-10" fill="currentColor" fillOpacity={0.2} strokeWidth={2} />
                      </div>
                      <p className="text-[#a0b2c8] font-body leading-relaxed pt-1">{bullet}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — Pricing ───────────────────────────────────────────── */}
      {/* #12 — moved before Common Questions */}
      {/* #18 supporting line updated + sized up */}
      {/* #15 — button labels → "Select [Tier]" */}
      <section id="pricing" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-10 max-w-4xl">
            <h2 className="font-headline font-black text-4xl md:text-5xl text-white mb-6 tracking-tight leading-tight">
              Start simple. Upgrade when your pursuit process needs more structure.
            </h2>
            <p className="text-xl text-[#a0b2c8] leading-relaxed font-body mb-2">
              Whether you are qualifying a handful of opportunities or building a more disciplined team workflow, HE Pursuit is designed to help you make better bid decisions without adding unnecessary overhead.
            </p>
            <p className="text-xl text-[#a0b2c8] font-body">
              For many small contractors, avoiding just one bad-fit proposal can pay for the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch max-w-6xl mx-auto mt-12">

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
              <Link to="/signup/" className="block text-center w-full py-3 rounded-lg border border-[#1e2d4a] text-white font-bold hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all text-sm">Start Free</Link>
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
              <Link to="/signup/" className="block text-center w-full py-3 rounded-lg border border-[#1e2d4a] text-white font-bold hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all text-sm">Select Starter</Link>
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
              <Link to="/signup/" className="block text-center w-full py-3 rounded-lg bg-[#00c3ff] text-[#030B17] font-bold shadow-[0_0_30px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 text-sm">Select Pro</Link>
            </div>
            </FlyIn>

            {/* Team */}
            <FlyIn delay="delay-[450ms]">
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300 h-full">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-headline text-xl font-bold text-white">Team</h3>
                <span className="text-xs font-bold text-[#030B17] bg-[#00c3ff] px-2 py-0.5 rounded-full uppercase tracking-widest">Coming Soon</span>
              </div>
              <p className="text-xs text-[#8b9bb4] mb-4">For multi-user capture teams</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white">$299</span>
                <span className="text-[#8b9bb4] text-sm">/mo</span>
              </div>
              <ul className="space-y-2 text-sm text-[#a0b2c8] mb-6 flex-grow">
                {['Everything in Pro', 'Multiple users', 'Shared pursuit pipeline', 'Team-level visibility', 'Onboarding assistance'].map(f => (
                  <li key={f} className="flex gap-2 items-start"><Sparkles className="w-3.5 h-3.5 text-[#00c3ff] shrink-0 mt-0.5"/>{f}</li>
                ))}
              </ul>
              <Link to="/team-waitlist/" className="block text-center w-full py-3 rounded-lg border border-[#1e2d4a] text-white font-bold hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all text-sm">Join the Waitlist</Link>
            </div>
            </FlyIn>

          </div>
          <p className="text-center text-sm text-[#8b9bb4]/60 mt-8 max-w-6xl mx-auto">
            <Link to="/pricing/" className="text-[#00c3ff] hover:underline">See full feature comparison →</Link>
          </p>
        </div>
      </section>

      {/* ── SECTION 7 — Common Questions ─────────────────────────────────── */}
      {/* #12 — now after pricing */}
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
                a: 'No. HE Pursuit helps your team qualify opportunities faster and more consistently so you can spend more time on the bids that deserve real strategy.',
              },
              {
                q: 'Who gets value fastest?',
                a: 'Small GovCon teams and business owners who need to protect proposal bandwidth and stop chasing low-fit opportunities.',
              },
              {
                q: 'How is this different from GovWin or GovTribe?',
                a: 'GovWin and GovTribe focus on opportunity discovery and pipeline data. HE Pursuit focuses on the next step: deciding which SAM.gov opportunities are actually worth pursuing. It structures the bid/no-bid decision — not just the collection of leads.',
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

      {/* ── SECTION 8 — Final CTA ─────────────────────────────────────────── */}
      {/* #13 line break, #14 remove See Pricing, #19 new headline */}
      <section className="py-20 px-6 relative">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">Get Started</span>
          </div>
          <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-4 tracking-tight">
            Spend less time debating.<br />Spend more time pursuing the right bids.
          </h2>
          <p className="text-[#a0b2c8] text-lg mb-10 leading-relaxed font-body max-w-xl mx-auto">
            Stop relying on scattered notes, gut feel, and costly proposal churn. HE Pursuit helps your team qualify smarter, decide faster, and focus effort where it has the best chance to pay off.
          </p>
          <Link to="/signup/" className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all">
            Start Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </>
  );
}
