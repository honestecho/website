import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Sparkles, Zap, Target, Scale, FileText, BarChart2, AlertTriangle, Compass, Upload, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // IntersectionObserver for consulting card stagger animation
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardInView, setCardInView] = useState(false);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setCardInView(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>HE Pursuit | Bid/No-Bid Software for Small Government Contractors</title>
        <meta name="description" content="Bid/no-bid decision software for small government contractors. AI-powered pursuit workflow — search SAM.gov, score opportunities, and make structured Go/No-Go decisions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/" />
        <meta property="og:title" content="HE Pursuit — The Bid/No-Bid Decision Layer for GovCon" />
        <meta property="og:description" content="Stop writing proposals you can't win. AI-powered eligibility, fit, and risk analysis for small government contractors." />
        <meta property="og:image" content="https://honestecho.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HE Pursuit — The Bid/No-Bid Decision Layer for GovCon" />
        <meta name="twitter:description" content="Stop writing proposals you can't win. AI-powered eligibility, fit, and risk analysis for small government contractors." />
        <meta name="twitter:image" content="https://honestecho.com/og-image.png" />
      </Helmet>

        {/* Hero Section */}
        <section className="relative px-6 pt-2 pb-20 lg:pt-4 lg:pb-24">
          {/* Line grid */}
  
        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column: Copy */}
          <div className="w-full lg:w-1/2">
            <h1 className="font-headline font-black text-5xl sm:text-6xl lg:text-[4rem] xl:text-7xl tracking-tighter text-white mb-4 leading-tight drop-shadow-2xl">
              The Bid/No-Bid<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c3ff] to-[#5b8cff]">Decision Layer</span><br/>
              for GovCon.
            </h1>

            <p className="text-[#a0b2c8] text-lg lg:text-xl mb-8 leading-relaxed font-body">
              Stop writing proposals you can't win. HE Pursuit runs a structured AI analysis — eligibility, fit, and risk — so your team bids on what it can actually win.
            </p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex gap-4 items-start group/item">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 relative overflow-visible mt-0.5">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover/item:opacity-60 transition-opacity duration-500 rounded-full scale-110"></div>
                  <Zap className="w-6 h-6 text-[#00c3ff] group-hover/item:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover/item:scale-110 group-hover/item:-rotate-12 group-hover/item:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.2} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-0.5 font-headline text-base">Fit Scoring Built on Your Actual Business</h3>
                  <p className="text-sm text-[#a0b2c8] leading-relaxed">Evaluates each opportunity against your NAICS, set-asides, certifications, location, and pursuit profile.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start group/item">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 relative overflow-visible mt-0.5">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover/item:opacity-60 transition-opacity duration-500 rounded-full scale-110"></div>
                  <Target className="w-6 h-6 text-[#00c3ff] group-hover/item:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover/item:scale-110 group-hover/item:-rotate-12 group-hover/item:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.2} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-0.5 font-headline text-base">Structured 5-Phase Pursuit Workflow</h3>
                  <p className="text-sm text-[#a0b2c8] leading-relaxed">Move from triage to eligibility, strategic value, effort, and go/no-go with a repeatable process built for capture teams.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start group/item">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 relative overflow-visible mt-0.5">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover/item:opacity-60 transition-opacity duration-500 rounded-full scale-110"></div>
                  <Scale className="w-6 h-6 text-[#00c3ff] group-hover/item:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover/item:scale-110 group-hover/item:-rotate-12 group-hover/item:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.2} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-0.5 font-headline text-base">Decision-Ready Recommendations</h3>
                  <p className="text-sm text-[#a0b2c8] leading-relaxed">Get a Go, Conditional Go, or No-Bid recommendation backed by evidence, not guesswork.</p>
                </div>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                Start Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/product" className="px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] transition-all flex items-center justify-center">
                See How It Works
              </Link>
            </div>
          </div>

          {/* Right Column: Opportunity Card */}
          <div className="w-full lg:w-1/2 relative group hidden md:block transition-transform duration-700 hover:-translate-y-2">
            <div className={`absolute inset-0 bg-[#00c3ff]/8 blur-2xl -z-10 rounded-[3rem] transition-colors duration-700 ${isFullscreen ? 'opacity-0' : 'group-hover:bg-[#00c3ff]/15'}`}></div>
            <div 
              onClick={() => setIsFullscreen(true)}
              className="bg-[#0b1120] border border-[#1e2d4a] hover:border-[#00c3ff]/50 rounded-xl p-2 shadow-2xl hover:shadow-[0_0_40px_rgba(0,195,255,0.2)] font-body relative overflow-hidden transition-all duration-700 mx-auto max-w-xl cursor-pointer hover:scale-[1.02]"
            >
              <img src="/opportunity_card_v1.png" alt="Opportunity Snapshot and Fit Analysis" className="w-full h-auto rounded-lg" />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-[#00c3ff] text-[#030B17] font-bold px-4 py-2 rounded shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Click to Expand
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* SECTION — Consulting */}
      <section className="py-24 px-6 relative">
        {/* Line grid */}
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            {/* Left: Copy */}
            <div className="w-full md:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
                <span className="text-xs font-bold text-blue-200 tracking-wide uppercase">Why This Engine Is Different</span>
              </div>

              <h2 className="font-headline font-black text-4xl xl:text-5xl text-white mb-5 leading-tight tracking-tight">
                Built for how government opportunities are actually evaluated.
              </h2>

              <p className="text-[#a0b2c8] text-lg mb-10 leading-relaxed">
                Most bid tools rely on generic signals. HE Pursuit reflects how requirements are structured, how proposals are scored, and where teams lose before proposal work begins.
              </p>

              <Link to="/product" className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all">
                See How It Works
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: "What that means for you" card */}
            <div className="w-full md:w-1/2">
              <div ref={cardRef} className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.04)_0%,transparent_70%)] pointer-events-none"></div>

                <h3 className="font-headline font-black text-2xl tracking-tighter text-white mb-6 relative z-10">What that means for you</h3>

                <div className="relative z-10">
                  {([
                    { icon: FileText,      label: 'Requirements written to be won',       body: 'Know what evaluators reward before your team writes a word.' },
                    { icon: BarChart2,     label: 'Evaluation criteria decoded',           body: 'See how proposals get scored and where points are lost before writing starts.' },
                    { icon: AlertTriangle, label: 'Real disqualifiers, surfaced early',    body: 'Surface what knocks teams out of contention before you commit pursuit time.' },
                    { icon: Compass,       label: 'Real-world pursuit frameworks',          body: 'Pursuit tools built from real program experience, not generic templates.' },
                  ] as { icon: React.ElementType; label: string; body: string }[]).map((item, i) => (
                    <div
                      key={item.label}
                      className={`flex gap-5 items-start py-5 border-b border-[#1e2d4a] last:border-0 group/item ${cardInView ? 'animate-fade-in-up' : 'opacity-0'}`}
                      style={{ animationDelay: `${i * 110}ms` }}
                    >
                      <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 relative overflow-visible">
                        <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover/item:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                        <item.icon className="w-6 h-6 text-[#00c3ff] group-hover/item:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover/item:scale-110 group-hover/item:-rotate-12 group-hover/item:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-base font-headline mb-1">{item.label}</p>
                        <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION — How It Works */}
      <section className="px-6 py-32 relative">
        {/* Line grid */}
        <div className="max-w-7xl mx-auto relative z-10">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">How HE Pursuit Works</span>
            </div>
            <h2 className="font-headline font-black text-4xl md:text-5xl text-white mb-5 tracking-tight">
              From opportunity review to bid/no-bid in minutes.
            </h2>
            <p className="text-[#a0b2c8] text-lg max-w-2xl mx-auto font-body leading-relaxed">
              HE Pursuit helps small government contractors qualify opportunities faster, surface risks earlier, and make clearer pursuit decisions before proposal work begins.
            </p>
          </div>

          {/* Step cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Step 1 */}
            <div className="group bg-[#0b1120] border border-[#1e2d4a] hover:border-[#00c3ff]/40 p-8 rounded-2xl relative shadow-2xl hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible flex-shrink-0">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <Upload className="w-6 h-6 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <span className="text-[#8b9bb4] text-xs font-label uppercase tracking-widest">Step 01</span>
              </div>
              <h3 className="font-headline font-black text-xl text-white mb-3 tracking-tight">Import the opportunity</h3>
              <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">Upload the solicitation, paste the notice, or pull in SAM.gov content to begin the review.</p>
            </div>

            {/* Step 2 */}
            <div className="group bg-[#0b1120] border border-[#1e2d4a] hover:border-[#00c3ff]/40 p-8 rounded-2xl relative shadow-2xl hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible flex-shrink-0">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <Target className="w-6 h-6 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <span className="text-[#8b9bb4] text-xs font-label uppercase tracking-widest">Step 02</span>
              </div>
              <h3 className="font-headline font-black text-xl text-white mb-3 tracking-tight">Analyze fit and eligibility</h3>
              <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">Evaluate set-asides, NAICS alignment, certifications, capability fit, geography, and disqualifiers.</p>
            </div>

            {/* Step 3 */}
            <div className="group bg-[#0b1120] border border-[#1e2d4a] hover:border-[#00c3ff]/40 p-8 rounded-2xl relative shadow-2xl hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 flex items-center justify-center relative overflow-visible flex-shrink-0">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                  <CheckCircle className="w-6 h-6 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <span className="text-[#8b9bb4] text-xs font-label uppercase tracking-widest">Step 03</span>
              </div>
              <h3 className="font-headline font-black text-xl text-white mb-3 tracking-tight">Make the call</h3>
              <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">Get a Go, Conditional Go, or No-Bid recommendation backed by evidence and a repeatable decision workflow.</p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION — Pricing */}
      <section id="pricing" className="py-32 px-6 relative">
        {/* Line grid */}

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="font-headline font-black text-5xl text-white mb-6">Start free.<br />Scale when you're ready.</h2>
            <p className="text-xl text-[#a0b2c8] leading-relaxed">
              Start free, test HE Pursuit on real opportunities, and scale as your pipeline grows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch max-w-6xl mx-auto">

            {/* Free */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300">
              <h3 className="font-headline text-xl font-bold text-white mb-1">Free</h3>
              <p className="text-xs text-[#8b9bb4] mb-4">Test the workflow</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white">$0</span>
              </div>
              <ul className="space-y-2 text-sm text-[#a0b2c8] mb-6 flex-grow">
                {['Search SAM.gov opportunities', '10 pursuits / Phase 1 triage', 'Saved searches & nightly alerts'].map(f => (
                  <li key={f} className="flex gap-2 items-start"><Sparkles className="w-3.5 h-3.5 text-[#00c3ff] shrink-0 mt-0.5"/>{f}</li>
                ))}
              </ul>
              <Link to="/signup" className="block text-center w-full py-3 rounded-lg border border-[#1e2d4a] text-white font-bold hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all text-sm">Start Free</Link>
            </div>

            {/* Starter */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300">
              <h3 className="font-headline text-xl font-bold text-white mb-1">Starter</h3>
              <p className="text-xs text-[#8b9bb4] mb-4">For solo contractors</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white">$99</span>
                <span className="text-[#8b9bb4] text-sm">/mo</span>
              </div>
              <ul className="space-y-2 text-sm text-[#a0b2c8] mb-6 flex-grow">
                {['25 pursuits', 'Full Phase 2–5 AI workflow', 'Eligibility & disqualifier review', 'Strategic & effort scoring', 'Go/No-Go decision tracking'].map(f => (
                  <li key={f} className="flex gap-2 items-start"><Sparkles className="w-3.5 h-3.5 text-[#00c3ff] shrink-0 mt-0.5"/>{f}</li>
                ))}
              </ul>
              <Link to="/signup" className="block text-center w-full py-3 rounded-lg border border-[#1e2d4a] text-white font-bold hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all text-sm">Start Starter</Link>
            </div>

            {/* Pro — highlighted */}
            <div className="bg-[#0b1120] border border-[#00c3ff]/50 rounded-2xl p-6 flex flex-col shadow-[0_0_60px_rgba(0,195,255,0.12)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/60 to-transparent rounded-t-2xl"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.06)_0%,transparent_65%)] pointer-events-none"></div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-headline text-xl font-bold text-white">Pro</h3>
                <span className="text-[10px] font-bold text-[#030B17] bg-[#00c3ff] px-2 py-0.5 rounded-full uppercase tracking-widest">Most Popular</span>
              </div>
              <p className="text-xs text-[#8b9bb4] mb-4">For small contractors & proposal teams</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white">$199</span>
                <span className="text-[#8b9bb4] text-sm">/mo</span>
              </div>
              <ul className="space-y-2 text-sm text-[#a0b2c8] mb-6 flex-grow relative z-10">
                {['Unlimited pursuits', 'Everything in Starter', 'PDF Decision Package export', '24hr email support'].map(f => (
                  <li key={f} className="flex gap-2 items-start"><Sparkles className="w-3.5 h-3.5 text-[#00c3ff] shrink-0 mt-0.5"/>{f}</li>
                ))}
              </ul>
              <Link to="/signup" className="block text-center w-full py-3 rounded-lg bg-[#00c3ff] text-[#030B17] font-bold shadow-[0_0_30px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 text-sm">Start Pro</Link>
            </div>

            {/* Team */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300">
              <h3 className="font-headline text-xl font-bold text-white mb-1">Team</h3>
              <p className="text-xs text-[#8b9bb4] mb-4">For multi-user capture teams</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white">$299</span>
                <span className="text-[#8b9bb4] text-sm">/mo</span>
              </div>
              <ul className="space-y-2 text-sm text-[#a0b2c8] mb-6 flex-grow">
                {['Everything in Pro', 'Up to 5 user seats', 'Shared pursuit pipeline', 'Priority parsing', '12hr support + onboarding'].map(f => (
                  <li key={f} className="flex gap-2 items-start"><Sparkles className="w-3.5 h-3.5 text-[#00c3ff] shrink-0 mt-0.5"/>{f}</li>
                ))}
              </ul>
              <Link to="/contact" className="block text-center w-full py-3 rounded-lg border border-[#1e2d4a] text-white font-bold hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all text-sm">Talk to the Team</Link>
            </div>

          </div>
          <p className="text-center text-sm text-[#8b9bb4]/60 mt-8 max-w-6xl mx-auto">
            <Link to="/pricing" className="text-[#00c3ff] hover:underline">See full feature comparison →</Link>
          </p>
        </div>
      </section>


      {/* SECTION — Final CTA */}
      <section className="py-20 px-6 relative">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Questions</span>
          </div>
          <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-4 tracking-tight">
            Want to see if HE Pursuit fits your team?
          </h2>
          <p className="text-[#a0b2c8] text-lg mb-10 leading-relaxed font-body max-w-xl mx-auto">
            HE Pursuit was built from real capture experience and real procurement workflows. If you have questions, we'll give you a straight answer.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all">
            Talk to the Team
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Lightbox Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030B17]/90 backdrop-blur-sm p-10 cursor-pointer"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="rounded-xl p-2 bg-[#0b1120] border border-[#00c3ff]/50 shadow-[0_0_60px_rgba(0,195,255,0.3)] relative max-w-[860px] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img src="/opportunity_card_v1.png" alt="Opportunity Snapshot and Fit Analysis" className="block w-full h-auto max-h-[80vh] object-contain rounded-lg" />
            <button
              className="absolute -top-4 -right-4 w-10 h-10 bg-[#00c3ff] hover:bg-white text-[#030B17] font-black rounded-full flex items-center justify-center transition-colors shadow-lg"
              onClick={() => setIsFullscreen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
