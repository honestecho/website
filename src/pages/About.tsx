import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter, GitBranch, Eye, Wrench, Building2, FileText, Users } from 'lucide-react';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About | Honest Echo</title>
        <meta name="description" content="Honest Echo builds practical tools for real GovCon decisions. Learn why HE Pursuit was created and how we think about bid/no-bid clarity for small government contractors." />
      </Helmet>

      {/* ── SECTION 1 — Hero ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,195,255,0.06)_0%,transparent_65%)] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">About Honest Echo</span>
          </div>
          <h1 className="font-headline font-black text-4xl md:text-5xl text-white mb-6 tracking-tight leading-tight drop-shadow-2xl">
            Practical tools for real GovCon decisions.
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body mb-10 max-w-2xl mx-auto">
            Honest Echo builds software for small government contractors that need faster, clearer pursuit decisions. HE Pursuit is our first product — built to help teams qualify opportunities, surface risks early, and stop wasting time on bids they should not pursue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline">
              Explore HE Pursuit
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/pricing" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — Who We Are ───────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
                <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Who We Are</span>
              </div>
              <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight mb-8 leading-tight">
                A product company built around how GovCon decisions actually get made.
              </h2>
              <div className="space-y-5 font-body text-[#a0b2c8] text-base leading-relaxed">
                <p>
                  Honest Echo exists to build useful software for teams operating in real procurement environments. We are focused on practical decision support — not generic AI, not surface-level scoring, and not tools that look good in a demo but fall apart in real capture work.
                </p>
                <p>
                  Our products are built around the actual questions small GovCon teams face every day: Are we eligible? Is this worth pursuing? Where are the real risks? How much effort will this take? Should we bid at all?
                </p>
              </div>
            </div>
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-2xl">
              <h3 className="font-headline font-black text-lg text-white mb-6 tracking-tight">What we build for</h3>
              <ul className="space-y-4 font-body text-[#a0b2c8] text-sm">
                {[
                  'Bid / no-bid clarity',
                  'Early risk visibility',
                  'Repeatable pursuit workflows',
                  'Small-team decision support',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff] mt-2 shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — Why HE Pursuit Exists ───────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-2xl lg:order-2">
              <h3 className="font-headline font-black text-lg text-white mb-6 tracking-tight">What HE Pursuit is designed to help answer</h3>
              <ul className="space-y-4 font-body text-[#a0b2c8] text-sm">
                {[
                  'Are we actually eligible?',
                  'Is this a real fit for our business?',
                  'Where are the likely failure points?',
                  'Is the effort justified?',
                  'Should we pursue, watch, or walk away?',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff] mt-2 shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
                <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Why HE Pursuit Exists</span>
              </div>
              <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight mb-8 leading-tight">
                Because too much proposal effort gets wasted before teams know whether they should bid.
              </h2>
              <div className="space-y-5 font-body text-[#a0b2c8] text-base leading-relaxed">
                <p>
                  Small contractors and proposal teams often burn time on opportunities that are weak fits, structurally risky, or unwinnable from the start. The problem is not effort. The problem is clarity.
                </p>
                <p>
                  HE Pursuit was built to make that early decision process more structured. It helps teams qualify opportunities faster, surface disqualifiers earlier, and make go/no-go decisions with more consistency and less guesswork.
                </p>
                <p>
                  The goal is simple: spend more time on the right work, and less time chasing opportunities that should have been ruled out early.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — What We Believe ─────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">What We Believe</span>
            </div>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight max-w-2xl mx-auto leading-tight">
              Good pursuit decisions should be faster, clearer, and easier to repeat.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                Icon: Filter,
                heading: 'Clarity beats volume',
                copy: 'More opportunities do not create better outcomes. Better qualification does.',
              },
              {
                Icon: GitBranch,
                heading: 'Structure beats instinct',
                copy: 'Good teams have judgment. Great teams make that judgment repeatable.',
              },
              {
                Icon: Eye,
                heading: 'Early signals matter',
                copy: 'The best time to catch a bad fit, weak alignment, or real disqualifier is before proposal work begins.',
              },
              {
                Icon: Wrench,
                heading: 'Tools should reflect reality',
                copy: 'GovCon decisions are not generic. The software supporting them should not be generic either.',
              },
            ].map(({ Icon, heading, copy }) => (
              <div key={heading} className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible mb-6">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <Icon className="w-6 h-6 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <h3 className="font-headline font-black text-lg text-white mb-3 tracking-tight">{heading}</h3>
                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — How We Work ──────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
                <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">How We Work</span>
              </div>
              <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight mb-8 leading-tight">
                Product first. Expert help when it matters.
              </h2>
              <div className="space-y-5 font-body text-[#a0b2c8] text-base leading-relaxed">
                <p>
                  HE Pursuit is built to stand on its own as a software product. Our goal is to give small GovCon teams a practical, repeatable way to make better pursuit decisions without needing a consultant in the loop every time.
                </p>
                <p>
                  At the same time, we understand that some teams want a closer look, onboarding help, or support thinking through how the workflow fits their process. When that is useful, Honest Echo can help. But the product comes first.
                </p>
              </div>
            </div>
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-2xl">
              <h3 className="font-headline font-black text-lg text-white mb-6 tracking-tight">What that means in practice</h3>
              <ul className="space-y-4 font-body text-[#a0b2c8] text-sm">
                {[
                  'HE Pursuit is built for self-serve use',
                  'Pricing and workflows are product-led',
                  'Team buyers can request guidance when needed',
                  'Support exists to strengthen adoption, not replace the product',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff] mt-2 shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — Built For ────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Built For</span>
            </div>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight max-w-2xl mx-auto leading-tight">
              Designed for lean teams making real bid decisions.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                Icon: Building2,
                heading: 'Small government contractors',
                copy: 'Teams that need a faster way to qualify opportunities and stop wasting cycles on weak pursuits.',
              },
              {
                Icon: FileText,
                heading: 'Proposal teams',
                copy: 'Users who need earlier clarity on eligibility, fit, and decision quality before writing begins.',
              },
              {
                Icon: Users,
                heading: 'Capture and pursuit teams',
                copy: 'Teams that want a more structured way to assess opportunities, track decisions, and improve consistency.',
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
          <p className="text-center text-[#8b9bb4] text-sm font-body mt-10">
            HE Pursuit is especially useful for teams operating lean, where every pursuit decision has a real time and resource cost.
          </p>
        </div>
      </section>

      {/* ── SECTION 7 — Final CTA ────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Ready to See It in Action?</span>
          </div>
          <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-5 tracking-tight leading-tight">
            Explore HE Pursuit and see how your team can make faster, clearer bid decisions.
          </h2>
          <p className="text-[#a0b2c8] text-lg mb-10 leading-relaxed font-body max-w-xl mx-auto">
            Start with the product, review the pricing, or reach out if your team needs a closer look.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline">
              Explore HE Pursuit
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/pricing" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline">
              View Pricing
            </Link>
          </div>
          <div className="mt-6">
            <Link to="/contact" className="text-[#8b9bb4] text-sm font-body hover:text-[#00c3ff] transition-colors duration-300">
              Talk to the Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
