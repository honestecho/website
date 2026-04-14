import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AlertCircle, Target, Filter, Users, Lightbulb, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About | Honest Echo</title>
        <meta name="description" content="Honest Echo builds practical tools to help small government contractors make better decisions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/about" />
        <meta property="og:title" content="About Honest Echo" />
        <meta property="og:description" content="Honest Echo builds practical tools to help small government contractors make better decisions." />
        <meta property="og:image" content="https://honestecho.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="font-headline font-black text-5xl md:text-6xl xl:text-7xl text-white mb-4 tracking-tighter leading-tight drop-shadow-2xl">
            About Honest Echo
          </h1>
          <p className="font-headline font-black text-2xl md:text-3xl text-[#00c3ff] mb-5 tracking-tight">
            Better Signals. Smarter Pursuits.
          </p>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body">
            Honest Echo builds practical tools to help small government contractors make better decisions.
          </p>
        </div>
      </section>

      {/* ── 2-column card grid ──────────────────────────────────────────────── */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Why We Built This */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <AlertCircle className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">Why We Built This</h2>
              </div>
              <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-3">
                Most small government contractors don't struggle to find opportunities. They struggle to decide which ones are worth pursuing.
              </p>
              <p className="text-[#8b9bb4] text-xs font-body mb-2">Too many bid decisions are made with:</p>
              <ul className="space-y-2 mb-4">
                {[
                  'Incomplete information',
                  'Inconsistent processes',
                  'Limited time to evaluate',
                  'Pressure to chase what looks promising',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#a0b2c8] font-body">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff] shrink-0 mt-[0.35rem]"></div>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[#8b9bb4] text-xs font-body leading-relaxed border-t border-[#1e2d4a] pt-4">
                The result is wasted effort on opportunities that were never a strong fit. HE Pursuit was built to bring structure to that decision.
              </p>
            </div>

            {/* A More Practical Way */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <Target className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">A More Practical Way to Evaluate Opportunities</h2>
              </div>
              <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-3">
                HE Pursuit gives teams a repeatable way to evaluate:
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  'How well an opportunity fits their business',
                  'Whether they meet eligibility requirements',
                  'How much effort the pursuit will require',
                  'Whether it is worth moving forward',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#a0b2c8] font-body">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff] shrink-0 mt-[0.35rem]"></div>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[#8b9bb4] text-xs font-body leading-relaxed border-t border-[#1e2d4a] pt-4">
                Instead of relying on instinct or scattered notes, teams can make faster, more consistent bid/no-bid decisions.
              </p>
            </div>

            {/* What That Means in Practice */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <Filter className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">What That Means in Practice</h2>
              </div>
              <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-3">
                For most teams, the challenge is not finding opportunities — it's deciding which ones deserve real attention.
              </p>
              <p className="text-[#8b9bb4] text-xs font-body mb-2">HE Pursuit helps by:</p>
              <ul className="space-y-2">
                {[
                  'Filtering out low-fit opportunities earlier',
                  'Focusing effort on higher-value pursuits',
                  'Making decisions more consistent over time',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#a0b2c8] font-body">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff] shrink-0 mt-[0.35rem]"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Who This Is Built For */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <Users className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">Who This Is Built For</h2>
              </div>
              <ul className="space-y-2 mb-4">
                {[
                  'Small government contractors',
                  'Owner-operators',
                  'Lean business development and capture teams',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#a0b2c8] font-body">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff] shrink-0 mt-[0.35rem]"></div>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[#8b9bb4] text-xs font-body leading-relaxed border-t border-[#1e2d4a] pt-4">
                Teams that need to protect proposal capacity and make smarter decisions with limited resources.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Our Approach — full width ────────────────────────────────────────── */}
      <section className="py-8 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,195,255,0.04)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 md:p-12 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                <Lightbulb className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
              </div>
              <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">Our Approach</h2>
            </div>
            <p className="font-headline font-black text-2xl md:text-3xl text-white tracking-tight leading-snug mb-4">
              We don't believe more data solves the problem.<br />We believe better decisions do.
            </p>
            <p className="text-[#a0b2c8] text-base font-body leading-relaxed max-w-3xl">
              HE Pursuit is designed to support judgment — not replace it — by making evaluation more structured, consistent, and easier to act on.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-8 pb-24 px-6">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline group"
          >
            Talk to the Team
            <ArrowRight className="w-4 h-4 text-[#8b9bb4] group-hover:text-[#00c3ff] group-hover:translate-x-1 transition-all duration-300" />
          </Link>
        </div>
      </section>
    </>
  );
}
