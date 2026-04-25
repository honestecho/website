import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AlertCircle, Target, Shield, Users, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';
import FlyIn from '../components/FlyIn';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Honest Echo | Evaluate Government Contracting Opportunities</title>
        <meta name="description" content="Honest Echo helps small government contractors evaluate government contracting opportunities, reduce wasted proposal effort, and make better bid/no-bid decisions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/about" />
        <meta property="og:title" content="About Honest Echo | Evaluate Government Contracting Opportunities" />
        <meta property="og:description" content="Honest Echo helps small government contractors evaluate government contracting opportunities, reduce wasted proposal effort, and make better bid/no-bid decisions." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Honest Echo | Evaluate Government Contracting Opportunities" />
        <meta name="twitter:description" content="Honest Echo helps small government contractors evaluate government contracting opportunities and make confident bid/no-bid decisions." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Our Story</span>
          </div>
          <h1 className="font-headline font-black text-5xl md:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            About Honest Echo
          </h1>
          <p className="font-headline font-black text-2xl md:text-3xl text-[#00c3ff] mb-5 tracking-tight leading-snug">
            The government contracting opportunity we should have never pursued.
          </p>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-2xl">
            Honest Echo helps small government contractors evaluate government contracting opportunities with clarity — so you can pursue smarter from the start.
          </p>
        </div>
      </section>

      {/* ── 2-column card grid ───────────────────────────────────────────────── */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* The Story */}
            <FlyIn>
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 h-full">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <AlertCircle className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">The Opportunity We Should Have Never Pursued</h2>
              </div>
              <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-3">
                It started with a strong-looking government contracting opportunity. Right agency. Relevant scope. It looked like a clear fit.
              </p>
              <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-3">
                So we did what most small GovCon teams do — we leaned in. Weeks of review. Internal discussions. Early capture work. Time we didn't really have.
              </p>
              <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-4">
                And then — buried deep in the RFP — was the detail that killed it. A disqualifier. Something small, easy to miss, but absolute.
              </p>
              <div className="border-t border-[#1e2d4a] pt-4">
                <p className="text-white font-headline font-black text-base tracking-tight">We were never eligible to win.</p>
              </div>
            </div>
            </FlyIn>

            {/* The Hidden Risk */}
            <FlyIn delay="delay-150">
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 h-full">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <Target className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">The Hidden Risk in Government Contracting Opportunities</h2>
              </div>
              <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-4">
                Most small government contractors don't lose because they lack capability. They lose because of how they pursue.
              </p>
              <ul className="space-y-2.5 mb-4">
                {[
                  'They pursue the wrong government contracting opportunities',
                  'They miss critical eligibility signals buried in solicitations',
                  'They make inconsistent bid/no-bid decisions under pressure',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#a0b2c8] font-body">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f87171] shrink-0 mt-[0.35rem]"></div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="border-t border-[#1e2d4a] pt-4">
                <p className="text-[#8b9bb4] text-xs font-body leading-relaxed">Every poor pursuit decision costs proposal hours, leadership attention, and real money. And once it's spent — you don't get it back.</p>
              </div>
            </div>
            </FlyIn>

            {/* Why We Built HE Pursuit */}
            <FlyIn delay="delay-300">
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 h-full">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <Compass className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">Why We Built HE Pursuit</h2>
              </div>
              <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-4">
                We built HE Pursuit to help small businesses{' '}
                <Link to="/tools/sam-gov-notice-analyzer" className="text-[#00c3ff] hover:text-white transition-colors">
                  evaluate government contracting opportunities
                </Link>{' '}
                before committing proposal resources. Not to help you find more opportunities — but to help you decide which ones are actually worth pursuing.
              </p>
              <ul className="space-y-2.5 mb-4">
                {[
                  'Assess fit and eligibility quickly',
                  'Identify hidden risks and disqualifiers',
                  'Structure bid/no-bid decisions consistently',
                  'Reduce wasted proposal effort',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#a0b2c8] font-body">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00c3ff] shrink-0 mt-0.5" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            </FlyIn>

            {/* Built For Small GovCon */}
            <FlyIn delay="delay-[450ms]">
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 h-full">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <Users className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">Built for Small Government Contractors</h2>
              </div>
              <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-4">
                Honest Echo is a woman-owned, veteran-owned small business built specifically for the government contracting community. We've evaluated complex solicitations, chased opportunities that weren't winnable, and experienced the cost of poor qualification decisions firsthand.
              </p>
              <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-4">
                This platform is built for real-world government contracting workflows — not theoretical use cases.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {['Woman-Owned', 'Veteran-Owned', 'Small Business'].map(badge => (
                  <span key={badge} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 text-xs font-bold text-blue-200 tracking-wide">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            </FlyIn>

          </div>
        </div>
      </section>

      {/* ── Our Mission — full width ─────────────────────────────────────────── */}
      <section className="py-8 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,195,255,0.04)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <FlyIn>
          <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 md:p-12 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                <Shield className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
              </div>
              <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">Our Mission</h2>
            </div>
            <p className="font-headline font-black text-2xl md:text-3xl text-white tracking-tight leading-snug mb-6">
              To help small government contractors qualify opportunities faster, make confident{' '}
              <Link to="/pricing" className="text-[#00c3ff] hover:text-white transition-colors">
                bid/no-bid decisions
              </Link>
              , and focus on opportunities they can actually win.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-[#1e2d4a] pt-6">
              {[
                { stat: 'One bad bid', body: 'can cost weeks of proposal effort and real B&P dollars.' },
                { stat: 'One right decision', body: 'protects your team\'s bandwidth and redirects energy to stronger pursuits.' },
                { stat: 'Better signals', body: 'mean smarter pursuits — and that\'s the difference between reacting and winning.' },
              ].map(({ stat, body }) => (
                <div key={stat}>
                  <p className="font-headline font-black text-[#00c3ff] text-lg mb-1">{stat}</p>
                  <p className="text-[#8b9bb4] text-sm font-body leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
          </FlyIn>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-8 pb-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/tools/sam-gov-notice-analyzer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Analyze an Opportunity Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all"
          >
            See Pricing
            <ArrowRight className="w-4 h-4 text-[#8b9bb4]" />
          </Link>
        </div>
      </section>
    </>
  );
}
