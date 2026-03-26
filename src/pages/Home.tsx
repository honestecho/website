import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ShieldCheck, Sparkles, Zap, Target, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Honest Echo | GovCon Intelligence</title>
        <meta name="description" content="AI-powered bid/no-bid decision engine and high-end B2B consulting for the GovCon arena." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative px-6 pt-6 pb-20 lg:pt-10 lg:pb-24 bg-[#030B17] overflow-hidden border-b border-[#1e2d4a]">
        {/* Crisp Grid Background exactly like Pursuit page */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px] z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#00c3ff]/10 via-transparent to-transparent z-0 blur-[100px] pointer-events-none w-full h-1/2 top-0"></div>

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column: Copy */}
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-5 animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <span className="text-xs font-bold text-blue-200 tracking-wide">Secure Analytics Platform</span>
            </div>

            <h1 className="font-headline font-black text-5xl sm:text-6xl lg:text-[4rem] xl:text-7xl tracking-tighter text-white mb-4 leading-tight drop-shadow-2xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c3ff] to-[#5b8cff]">Save hours.</span><br/>
              Stop writing proposals you can't win.
            </h1>
            
            <p className="text-[#a0b2c8] text-lg lg:text-xl mb-8 leading-relaxed font-body">
              The bid/no-bid decision engine built for small government contractors. Know your eligibility fast and get capture clarity in minutes.
            </p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex gap-4 items-start group/item">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 relative overflow-visible mt-0.5">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover/item:opacity-60 transition-opacity duration-500 rounded-full scale-110"></div>
                  <Zap className="w-6 h-6 text-[#00c3ff] group-hover/item:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover/item:scale-110 group-hover/item:-rotate-12 group-hover/item:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.2} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-0.5 font-headline text-base">AI-Powered Scoring</h3>
                  <p className="text-sm text-[#a0b2c8] leading-relaxed">Every SAM.gov opportunity scored against your NAICS, certs, and strategic fit — automatically.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start group/item">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 relative overflow-visible mt-0.5">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover/item:opacity-60 transition-opacity duration-500 rounded-full scale-110"></div>
                  <Target className="w-6 h-6 text-[#00c3ff] group-hover/item:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover/item:scale-110 group-hover/item:-rotate-12 group-hover/item:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.2} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-0.5 font-headline text-base">5-Phase Pursuit Workflow</h3>
                  <p className="text-sm text-[#a0b2c8] leading-relaxed">Triage • Eligibility • Strategic Value • Effort & Win Probability • Go/No-Go Decision — structured analysis at every gate.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start group/item">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 relative overflow-visible mt-0.5">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover/item:opacity-60 transition-opacity duration-500 rounded-full scale-110"></div>
                  <Scale className="w-6 h-6 text-[#00c3ff] group-hover/item:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover/item:scale-110 group-hover/item:-rotate-12 group-hover/item:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.2} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-0.5 font-headline text-base">Clear Bid/No-Bid Decisions</h3>
                  <p className="text-sm text-[#a0b2c8] leading-relaxed">Go, Conditional Go, or No-Bid — every recommendation is backed by AI analysis and a structured evidence trail.</p>
                </div>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/app" className="px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/platform" className="px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] transition-all flex items-center justify-center">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Column: Opportunity Card */}
          <div className="w-full lg:w-1/2 relative group hidden md:block transition-transform duration-700 hover:-translate-y-2">
            <div className={`absolute inset-0 bg-[#00c3ff]/20 blur-3xl -z-10 rounded-[3rem] transition-colors duration-700 ${isFullscreen ? 'opacity-0' : 'group-hover:bg-[#00c3ff]/30 animate-pulse'}`}></div>
            <div 
              onClick={() => setIsFullscreen(true)}
              className="bg-[#0b1120] border border-[#1e2d4a] hover:border-[#00c3ff]/50 rounded-xl p-2 shadow-2xl hover:shadow-[0_0_40px_rgba(0,195,255,0.2)] font-body relative overflow-hidden transition-all duration-700 mx-auto max-w-xl cursor-pointer hover:scale-[1.02]"
            >
              <img src="/opportunitycard.jpg" alt="Opportunity Snapshot and Fit Analysis" className="w-full h-auto rounded-lg" />
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
      <section className="py-24 px-6 bg-[#01060e] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
                 <span className="text-sm font-bold text-blue-200 tracking-wide">B2B GovCon Consulting</span>
              </div>
              
              <h2 className="font-headline font-black text-4xl text-white mb-6 leading-tight">
                Winning contracts takes more than software.
              </h2>
              <p className="text-xl text-[#a0b2c8] mb-8 leading-relaxed">
                Honest Echo isn't just an AI company. As an established government contractor, we provide high-end BD consulting, capture strategy, and proposal support to secure real wins across complex federal agencies.
              </p>
              <Link to="/consulting" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#030B17] font-bold rounded-lg hover:bg-slate-200 transition-colors">
                Learn About Our Services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="w-full md:w-1/2 bg-[#0b1120] p-2 rounded-xl border border-[#1e2d4a] shadow-2xl relative overflow-hidden group">
              <div className="bg-[#030B17] rounded-lg overflow-hidden aspect-video relative border border-[#1e2d4a]">
                 <img 
                  src="/consulting_collaboration.png" 
                  alt="High-end strategic corporate war room"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-[#030B17]/90 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION — Social Proof */}
      <section className="px-6 py-32 bg-[#050d1a] border-t border-b border-[#1e2d4a] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00c3ff]/5 via-transparent to-[#00c3ff]/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-headline font-black text-4xl md:text-5xl text-white mb-6 tracking-tight">
              Trusted by leading <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c3ff] to-[#5b8cff]">GovCon innovators</span>
            </h2>
            <p className="text-[#a0b2c8] text-lg max-w-2xl mx-auto font-body">
              Here is what early adopters and high-growth contractors are saying about the Honest Echo pursuit engine.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="group bg-[#0b1120] border border-[#1e2d4a] hover:border-[#00c3ff]/40 p-8 rounded-2xl relative shadow-2xl hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 flex flex-col">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <div className="text-[#00c3ff]/20 font-serif text-8xl leading-none mb-2 select-none">"</div>
              <p className="text-white font-body text-[15px] leading-relaxed mb-8 flex-grow -mt-4">
                We used to spend hours manually parsing SAM.gov attachments looking for hidden disqualifiers. Honest Echo flags them in seconds. The Phase 2 effort scoring alone has saved our team weeks of wasted proposal writing.
              </p>
              <div className="flex items-center gap-4 border-t border-[#1e2d4a] pt-6">
                <div className="w-10 h-10 rounded-full bg-[#00c3ff]/10 flex items-center justify-center border border-[#00c3ff]/30 shrink-0">
                  <span className="text-[#00c3ff] font-bold text-xs uppercase">VP</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">VP of Capture</h4>
                  <p className="text-[#a0b2c8] text-xs">Mid-Tier Defense IT Firm</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group bg-[#0b1120] border border-[#1e2d4a] hover:border-[#00c3ff]/40 p-8 rounded-2xl relative shadow-2xl hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 flex flex-col">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <div className="text-[#00c3ff]/20 font-serif text-8xl leading-none mb-2 select-none">"</div>
              <p className="text-white font-body text-[15px] leading-relaxed mb-8 flex-grow -mt-4">
                The shift from tracking opportunities heavily to actually deciding what to win is profound. The UI is beautiful, fast, and the workflow instantly aligns our leadership on bid/no-bid calls without the endless meetings.
              </p>
              <div className="flex items-center gap-4 border-t border-[#1e2d4a] pt-6">
                <div className="w-10 h-10 rounded-full bg-[#00c3ff]/10 flex items-center justify-center border border-[#00c3ff]/30 shrink-0">
                  <span className="text-[#00c3ff] font-bold text-xs uppercase">CEO</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Chief Executive Officer</h4>
                  <p className="text-[#a0b2c8] text-xs">Small Business Federal Consulting</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group bg-[#0b1120] border border-[#1e2d4a] hover:border-[#00c3ff]/40 p-8 rounded-2xl relative shadow-2xl hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 flex flex-col">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <div className="text-[#00c3ff]/20 font-serif text-8xl leading-none mb-2 select-none">"</div>
              <p className="text-white font-body text-[15px] leading-relaxed mb-8 flex-grow -mt-4">
                It feels like we finally have a brilliant data scientist working directly for our proposal team. The exact breakdown of capability fit versus agency fit lets us see exactly why a seemingly 'perfect' RFP is actually a dangerous trap.
              </p>
              <div className="flex items-center gap-4 border-t border-[#1e2d4a] pt-6">
                <div className="w-10 h-10 rounded-full bg-[#00c3ff]/10 flex items-center justify-center border border-[#00c3ff]/30 shrink-0">
                  <span className="text-[#00c3ff] font-bold text-xs uppercase">Dir</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Director of Proposals</h4>
                  <p className="text-[#a0b2c8] text-xs">Logistics & Supply Chain LLC</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION — Pricing */}
      <section className="py-32 px-6 bg-[#01060e] relative">
        {/* Subtle glow behind pricing */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,195,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="font-headline font-black text-5xl text-white mb-6">Transparent Scale</h2>
            <p className="text-xl text-[#a0b2c8] leading-relaxed">
              We know small proposal teams run lean. Start for free, test the engine, and scale as your pipeline grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
            
            {/* Free Tier */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 flex flex-col h-full shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300">
              <h3 className="font-headline text-2xl font-bold text-white mb-2">Free</h3>
              <p className="text-sm text-[#a0b2c8] mb-6">Good for testing the engine.</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-white">$0</span>
              </div>
              
              <ul className="space-y-4 text-sm text-[#a0b2c8] mb-10 flex-grow">
                <li className="flex gap-3 items-start"><Sparkles className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5"/> Search opportunities</li>
                <li className="flex gap-3 items-start"><Sparkles className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5"/> Save pursuits</li>
                <li className="flex gap-3 items-start"><Sparkles className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5"/> Phase 1 summary</li>
                <li className="flex gap-3 items-start text-slate-500"><ShieldCheck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5"/> Limited eligibility check</li>
                <li className="flex gap-3 items-start text-slate-500"><ShieldCheck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5"/> Limited document parsing</li>
              </ul>
              <Link to="/app" className="block text-center w-full py-4 rounded-lg border border-[#1e2d4a] text-white font-bold hover:bg-[#1a2538] transition-all">Get Started</Link>
            </div>

            {/* Pro Tier (Highlighted) */}
            <div className="bg-[#0b1120] border-2 border-[#00c3ff] rounded-2xl p-8 flex flex-col h-full shadow-[0_0_50px_rgba(0,195,255,0.15)] relative md:scale-105 z-10 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-[#00c3ff]/5 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 right-8 bg-[#00c3ff] text-[#030B17] px-4 py-1 rounded-b-lg text-xs font-bold uppercase tracking-wider">Most Popular</div>
              
              <h3 className="font-headline text-2xl font-bold text-white mb-2 relative">Pro</h3>
              <p className="text-sm text-[#a0b2c8] mb-6 relative">For small contractors & proposal shops.</p>
              <div className="flex items-baseline gap-1 mb-8 relative">
                <span className="text-5xl font-black text-white">$39</span>
                <span className="text-[#a0b2c8] font-medium">/mo</span>
              </div>
              
              <ul className="space-y-4 text-sm text-white mb-10 flex-grow relative font-medium">
                <li className="flex gap-3 items-start"><Sparkles className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5"/> Unlimited pursuits & Phase 1</li>
                <li className="flex gap-3 items-start"><Sparkles className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5"/> Full Phase 2 eligibility & docs</li>
                <li className="flex gap-3 items-start"><Sparkles className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5"/> Disqualifier detection</li>
                <li className="flex gap-3 items-start"><Sparkles className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5"/> Strategic & Effort scoring</li>
                <li className="flex gap-3 items-start"><Sparkles className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5"/> Decision tracking & History</li>
              </ul>
              <Link to="/app" className="block text-center relative w-full py-4 rounded-lg bg-[#00c3ff] text-[#030B17] font-bold hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#00c3ff]/20">Start Free Trial</Link>
            </div>

            {/* Team Tier */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 flex flex-col h-full shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300">
              <h3 className="font-headline text-2xl font-bold text-white mb-2">Team</h3>
              <p className="text-sm text-[#a0b2c8] mb-6">For teams & capture consultants.</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-white">$99</span>
                <span className="text-[#a0b2c8] font-medium">/mo</span>
              </div>
              
              <ul className="space-y-4 text-sm text-[#a0b2c8] mb-10 flex-grow">
                <li className="flex gap-3 items-start"><Sparkles className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5"/> Everything in Pro</li>
                <li className="flex gap-3 items-start"><Sparkles className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5"/> Multiple users</li>
                <li className="flex gap-3 items-start"><Sparkles className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5"/> Shared pursuits</li>
                <li className="flex gap-3 items-start"><Sparkles className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5"/> Priority parsing & larger limits</li>
                <li className="flex gap-3 items-start"><Sparkles className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5"/> Export capabilities</li>
              </ul>
              <Link to="/contact" className="block text-center w-full py-4 rounded-lg border border-[#1e2d4a] text-white font-bold hover:bg-[#1a2538] transition-all">Contact Us</Link>
            </div>

          </div>
        </div>
      </section>


      {/* Lightbox Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030B17]/90 backdrop-blur-sm p-4 cursor-pointer"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="w-full max-w-xl rounded-xl p-2 bg-[#0b1120] border border-[#00c3ff]/50 shadow-[0_0_60px_rgba(0,195,255,0.3)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img src="/opportunitycard.jpg" alt="Opportunity Snapshot and Fit Analysis" className="w-full h-auto rounded-lg" />
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
