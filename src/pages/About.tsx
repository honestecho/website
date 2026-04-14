import { Helmet } from 'react-helmet-async';
import { AlertCircle, Target, Clock, ArrowRight, Building2, UserCircle, Users } from 'lucide-react';

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
          <h1 className="font-headline font-black text-5xl md:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            About Honest Echo
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body">
            Honest Echo builds practical tools to help small government contractors make better decisions.
          </p>
        </div>
      </section>

      {/* ── Why We Built This + What We Do ──────────────────────────────────── */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Why We Built This */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <AlertCircle
                    className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10"
                    fill="currentColor"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </div>
                <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">Why We Built This</h2>
              </div>
              <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-3">
                Most small GovCon teams do not struggle to find opportunities. They struggle to decide which ones are worth pursuing.
              </p>
              <p className="text-[#8b9bb4] text-xs font-body mb-3">Too many bids are driven by:</p>
              <ul className="space-y-2 mb-4">
                {['Incomplete information', 'Inconsistent processes', 'Limited time and resources'].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#a0b2c8] font-body">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff] shrink-0 mt-[0.35rem]"></div>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[#8b9bb4] text-xs font-body leading-relaxed border-t border-[#1e2d4a] pt-4">
                The result is wasted effort on opportunities that were never a strong fit.
              </p>
            </div>

            {/* What We Do */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <Target
                    className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10"
                    fill="currentColor"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </div>
                <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">What We Do</h2>
              </div>
              <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-3">
                HE Pursuit helps teams evaluate opportunities quickly and consistently. It provides a structured way to assess:
              </p>
              <ul className="space-y-2 mb-4">
                {['Fit', 'Eligibility', 'Effort', 'Overall pursuit value'].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#a0b2c8] font-body">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff] shrink-0 mt-[0.35rem]"></div>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[#8b9bb4] text-xs font-body mb-2">So teams can:</p>
              <ul className="space-y-1.5">
                {['Qualify faster', 'Focus on the right opportunities', 'Make more confident bid/no-bid decisions'].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#a0b2c8] font-body">
                    <ArrowRight className="w-3.5 h-3.5 text-[#00c3ff] shrink-0 mt-[0.2rem]" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── How We Think ────────────────────────────────────────────────────── */}
      <section className="py-8 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,195,255,0.04)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 md:p-12 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                <Clock
                  className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10"
                  fill="currentColor"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </div>
              <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">How We Think About It</h2>
            </div>
            <p className="text-white font-headline font-black text-2xl md:text-3xl tracking-tight leading-snug mb-4">
              We don't believe more data solves the problem.<br />We believe better decisions do.
            </p>
            <p className="text-[#a0b2c8] text-base font-body leading-relaxed max-w-3xl">
              HE Pursuit is designed to support judgment—not replace it—by making evaluation more consistent and easier to act on.
            </p>
          </div>
        </div>
      </section>

      {/* ── Who It's For ────────────────────────────────────────────────────── */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { Icon: Building2, label: 'Small government contractors' },
              { Icon: UserCircle, label: 'Owner-operators' },
              { Icon: Users,     label: 'Lean capture and BD teams' },
            ].map(({ Icon, label }) => (
              <div
                key={label}
                className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible mb-5">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <Icon
                    className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10"
                    fill="currentColor"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </div>
                <h3 className="font-headline font-bold text-white text-lg tracking-tight">{label}</h3>
              </div>
            ))}
          </div>
          <p className="text-[#8b9bb4] text-sm font-body mt-6 max-w-2xl">
            Teams that need to protect proposal capacity and make smarter decisions with limited resources.
          </p>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────────────────── */}
      <section className="py-8 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#8b9bb4] font-body text-sm">
            Get in touch:{' '}
            <a href="mailto:info@honestecho.com" className="text-[#00c3ff] hover:text-white transition-colors font-bold">
              info@honestecho.com
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
