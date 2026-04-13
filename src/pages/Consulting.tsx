import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Eye, FileText, ShieldCheck, Filter, BarChart2, Zap } from 'lucide-react';

export default function Consulting() {
  return (
    <>
      <Helmet>
        <title>Consulting | Honest Echo</title>
        <meta name="description" content="GovCon consulting built around practical pursuit judgment — qualification, evaluation readiness, and bid/no-bid decision support for small government contractors." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/consulting" />
        <meta property="og:title" content="GovCon Consulting — Honest Echo" />
        <meta property="og:description" content="Practical pursuit judgment for small government contractors. Qualification reviews, evaluation readiness, and bid/no-bid decision support." />
        <meta property="og:image" content="https://honestecho.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GovCon Consulting — Honest Echo" />
        <meta name="twitter:description" content="Practical pursuit judgment for small government contractors. Qualification reviews, evaluation readiness, and bid/no-bid decision support." />
        <meta name="twitter:image" content="https://honestecho.com/og-image.png" />
      </Helmet>

      {/* ── SECTION 1 — Hero ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,195,255,0.06)_0%,transparent_65%)] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">GovCon Decision Support</span>
          </div>
          <h1 className="font-headline font-black text-4xl md:text-6xl text-white mb-6 tracking-tight leading-tight drop-shadow-2xl">
            Procurement judgment that helps teams qualify smarter.
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body mb-10 max-w-2xl mx-auto">
            We combine practical GovCon procurement judgment with structured pursuit workflows to help teams make better bid/no-bid decisions.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline">
            Talk to the Team
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── SECTION 2 — What We Help With ────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">What We Help With</span>
            </div>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight leading-tight">
              Targeted support for the decisions that matter most.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                Icon: Target,
                heading: 'Opportunity qualification and evaluation readiness',
                copy: 'Help teams assess fit, eligibility, evaluation logic, and pursuit risk before proposal work begins.',
              },
              {
                Icon: BarChart2,
                heading: 'Evaluation-focused decision support',
                copy: 'Help teams pressure-test real opportunities by looking at requirements, likely evaluation factors, and early risk signals.',
              },
              {
                Icon: FileText,
                heading: 'Requirement interpretation and fit assessment',
                copy: 'Understand how requirements are likely to be interpreted and where gaps in eligibility or positioning may create structural risk.',
              },
              {
                Icon: ShieldCheck,
                heading: 'Pursuit alignment with procurement logic',
                copy: 'Align qualification decisions with real procurement logic — not just a checklist, but an honest view of how evaluators may weigh responses.',
              },
            ].map(({ Icon, heading, copy }) => (
              <div key={heading} className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible mb-6">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <Icon className="w-6 h-6 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <h3 className="font-headline font-black text-xl text-white mb-3 tracking-tight">{heading}</h3>
                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — Why Honest Echo + What We Bring ──────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">

          {/* Why Honest Echo — 2-col copy */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Why Honest Echo</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
            <div>
              <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight leading-tight">
                Built around practical GovCon judgment, not generic consulting language.
              </h2>
            </div>
            <div className="space-y-5 font-body text-[#a0b2c8] text-base leading-relaxed lg:pt-16">
              <p>
                Honest Echo is built around a simple idea: better pursuit decisions come from clearer structure, earlier risk visibility, and a real understanding of how government opportunities are evaluated.
              </p>
              <p>
                That perspective shapes both the product and the consulting work. We help teams think through requirements, likely evaluation logic, qualification risks, and decision quality before proposal effort gets too deep. The focus is qualification, evaluation understanding, and pursuit decision-making — not broad procurement advisory, not generic advice, and not services detached from the real work of deciding whether to bid.
              </p>
            </div>
          </div>

          {/* What We Bring — 3 cards */}
          <div>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
                <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">What We Bring</span>
              </div>
              <h3 className="font-headline font-black text-2xl md:text-3xl text-white tracking-tight">
                Procurement judgment that helps teams qualify smarter.
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  Icon: Eye,
                  heading: 'Evaluation process awareness',
                  copy: 'Understand how opportunities may actually be assessed, not just how they are described.',
                },
                {
                  Icon: Filter,
                  heading: 'Requirement interpretation',
                  copy: 'Get help reading between the lines of fit, eligibility, and risk before proposal work expands.',
                },
                {
                  Icon: Zap,
                  heading: 'Practical bid judgment',
                  copy: 'Pressure-test real opportunities with a more structured view of effort, risk, and likely return.',
                },
              ].map(({ Icon, heading, copy }) => (
                <div key={heading} className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.03)_0%,transparent_60%)] pointer-events-none"></div>
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                      <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                      <Icon className="w-6 h-6 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                    </div>
                    <h3 className="font-headline font-black text-xl text-white tracking-tight leading-tight">{heading}</h3>
                  </div>
                  <p className="text-[#a0b2c8] text-sm font-body leading-relaxed relative z-10">{copy}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 4 — When to Reach Out ───────────────────────────────── */}
      <section className="py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">When to Reach Out</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — heading */}
            <div>
              <h3 className="font-headline font-black text-2xl md:text-3xl text-white tracking-tight leading-tight">
                This work fits best when the stakes are real.
              </h3>
            </div>

            {/* Right — 2×2 mini-cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { Icon: Target,     label: 'Reviewing a high-stakes opportunity' },
                { Icon: ShieldCheck, label: 'Pressure-testing a weak-fit pursuit' },
                { Icon: BarChart2,  label: 'Improving your internal bid/no-bid workflow' },
                { Icon: Zap,        label: 'Aligning HE Pursuit to your team process' },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-start gap-3 bg-[#0b1120] border border-[#1e2d4a] rounded-xl p-4 group/item hover:border-[#00c3ff]/30 transition-all duration-300">
                  <div className="w-8 h-8 flex items-center justify-center relative overflow-visible shrink-0 mt-0.5">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-0 group-hover/item:opacity-50 transition-opacity duration-500 rounded-full scale-150"></div>
                    <Icon className="w-4 h-4 text-[#00c3ff] group-hover/item:text-white group-hover/item:-rotate-12 group-hover/item:scale-110 transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                  </div>
                  <span className="text-[#a0b2c8] text-sm font-body leading-snug pt-1 group-hover/item:text-white transition-colors duration-300">{label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 5 — Final CTA ─────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(0,195,255,0.04)_0%,transparent_65%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — heading + copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
                <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Work With Us</span>
              </div>
              <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-5 tracking-tight leading-tight">
                Ready to bring more structure to your pursuit decisions?
              </h2>
              <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-lg">
                Talk to the team about your pipeline, or explore HE Pursuit to see how the product supports the same decision framework.
              </p>
            </div>

            {/* Right — 3 stacked buttons */}
            <div className="flex flex-col gap-4 lg:pl-12">
              <Link to="/contact" className="inline-flex items-center justify-between gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline group/btn">
                <span>Talk to the Team</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link to="/product" className="inline-flex items-center justify-between gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline group/btn">
                <span>Explore HE Pursuit</span>
                <ArrowRight className="w-4 h-4 text-[#8b9bb4] group-hover/btn:text-[#00c3ff] group-hover/btn:translate-x-1 transition-all duration-300" />
              </Link>
              <Link to="/pricing" className="inline-flex items-center justify-between gap-2 px-8 py-4 bg-transparent border border-[#00c3ff]/30 text-[#00c3ff] font-bold rounded-lg hover:bg-[#0b1120] hover:border-[#00c3ff]/60 hover:text-white transition-all duration-300 font-headline group/btn">
                <span>View Pricing</span>
                <ArrowRight className="w-4 h-4 opacity-60 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-300" />
              </Link>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
