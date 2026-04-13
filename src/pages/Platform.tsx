import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Target, Scale } from 'lucide-react';

export default function Platform() {
  return (
    <>
      <Helmet>
        <title>HE Pursuit — Bid/No-Bid Platform | Honest Echo</title>
        <meta name="description" content="HE Pursuit platform overview — 5-phase AI workflow for small GovCon teams: SAM.gov search, eligibility analysis, strategic scoring, and structured bid/no-bid decisions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/product" />
        <meta property="og:title" content="HE Pursuit — AI-Powered Bid/No-Bid Platform for GovCon" />
        <meta property="og:description" content="5-phase pursuit workflow for small government contractors. SAM.gov search, AI eligibility analysis, strategic scoring, and structured Go/No-Go decisions." />
        <meta property="og:image" content="https://honestecho.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HE Pursuit — AI-Powered Bid/No-Bid Platform for GovCon" />
        <meta name="twitter:description" content="5-phase pursuit workflow for small government contractors. SAM.gov search, AI eligibility analysis, strategic scoring, and structured Go/No-Go decisions." />
        <meta name="twitter:image" content="https://honestecho.com/og-image.png" />
      </Helmet>
      
      {/* Hero */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,112,240,0.1)_0%,rgba(13,20,30,0)_60%)] -z-10"></div>
        <div className="inline-flex px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-8 items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00c3ff] animate-pulse"></span>
          <span className="text-[0.6875rem] font-label uppercase tracking-widest text-blue-200">HE Pursuit</span>
        </div>
        <h1 className="font-headline font-black text-5xl md:text-7xl lg:text-8xl tracking-tighter max-w-5xl text-white mb-6">
          Pursuit
        </h1>
        <p className="text-xl md:text-2xl text-on-surface-variant max-w-3xl mb-10 leading-relaxed font-body">
          The bid/no-bid decision engine for small government contractors.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/signup" className="px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-headline">
            Start Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/pricing" className="px-8 py-4 bg-surface-container-highest border border-outline-variant/30 text-white font-bold rounded-lg hover:bg-surface-container-high transition-all font-headline flex items-center justify-center">
            See Pricing
          </Link>
        </div>
      </section>

      {/* What it does */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-8 md:p-12 mb-24">
          <h2 className="font-headline font-bold text-3xl text-white mb-6">What it does</h2>
          <p className="text-xl text-on-surface-variant leading-relaxed max-w-4xl">
            HE Pursuit replaces gut-feelings with systemic intelligence.
            It ingests opportunity data, analyzes your historical alignment, evaluates required effort
            against potential reward, and forces a disciplined Bid / No-Bid decision matrix.
          </p>
        </div>

        {/* How it works (5 phases) */}
        <h2 className="font-headline font-bold text-4xl text-white mb-12 text-center">How it works (5 phases)</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant/20 hidden md:block -z-10"></div>
          {[
            { phase: 1, title: 'What is this?', desc: 'Ingest sources sought, RFIs, and RFPs instantly.' },
            { phase: 2, title: 'Can we bid?', desc: 'Hard qualification and strict eligibility gates.' },
            { phase: 3, title: 'Should we bid?', desc: 'Strategic alignment and past performance mapping.' },
            { phase: 4, title: 'Is it worth it?', desc: 'Effort evaluation vs probability of win.' },
            { phase: 5, title: 'What do we do?', desc: 'Final execution strategy and proposal kickoff.' }
          ].map((step) => (
            <div key={step.phase} className="bg-surface-container-highest border border-outline-variant/20 rounded-xl p-6 text-center shadow-xl relative z-0">
              <div className="w-10 h-10 mx-auto bg-primary-container text-white flex items-center justify-center rounded-full font-bold mb-4">
                {step.phase}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Interface & Features */}
      <section className="py-24 px-6 bg-[#030B17] relative overflow-hidden border-y border-outline-variant/10">
        {/* Crisp subtle grid background matching comp */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            
            {/* Left Column: Awesome Features List */}
            <div className="pt-4">
              <h2 className="font-headline font-black text-6xl tracking-tight mb-6">
                 <span className="text-[#00c3ff]">HE</span> <span className="text-white">Pursuit</span>
              </h2>
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/20 border border-blue-700/30 mb-8">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                 <span className="text-sm font-bold text-blue-200 tracking-wide">GovCon Intelligence Tool</span>
              </div>

              <p className="text-xl text-[#a0b2c8] mb-12 leading-relaxed max-w-lg font-body">
                Evaluate every opportunity against your capabilities, certifications, and strategic priorities — in minutes, not hours.
              </p>
              
              <ul className="space-y-10">
                <li className="flex gap-4 items-start group/item">
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 relative overflow-visible">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover/item:opacity-60 transition-opacity duration-500 rounded-full scale-110"></div>
                    <Zap className="w-8 h-8 text-[#00c3ff] group-hover/item:text-white drop-shadow-[0_0_12px_rgba(0,195,255,0.8)] group-hover/item:scale-110 group-hover/item:-rotate-12 group-hover/item:drop-shadow-[0_0_20px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.2} strokeWidth={2} />
                  </div>
                  <div className="mt-1">
                    <h3 className="text-base font-bold text-white mb-1.5 font-headline">AI-Powered Scoring</h3>
                    <p className="text-sm text-[#a0b2c8] leading-relaxed max-w-md">Every SAM.gov opportunity scored against your NAICS, certs, and strategic fit — automatically.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start group/item">
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 relative overflow-visible">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover/item:opacity-60 transition-opacity duration-500 rounded-full scale-110"></div>
                    <Target className="w-8 h-8 text-[#00c3ff] group-hover/item:text-white drop-shadow-[0_0_12px_rgba(0,195,255,0.8)] group-hover/item:scale-110 group-hover/item:-rotate-12 group-hover/item:drop-shadow-[0_0_20px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.2} strokeWidth={2} />
                  </div>
                  <div className="mt-1">
                    <h3 className="text-base font-bold text-white mb-1.5 font-headline">5-Phase Pursuit Workflow</h3>
                    <p className="text-sm text-[#a0b2c8] leading-relaxed max-w-md">Triage · Eligibility · Strategic Value · Effort & Win Probability · Go/No-Go Decision — structured analysis at every gate.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start group/item">
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 relative overflow-visible">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover/item:opacity-60 transition-opacity duration-500 rounded-full scale-110"></div>
                    <Scale className="w-8 h-8 text-[#00c3ff] group-hover/item:text-white drop-shadow-[0_0_12px_rgba(0,195,255,0.8)] group-hover/item:scale-110 group-hover/item:-rotate-12 group-hover/item:drop-shadow-[0_0_20px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.2} strokeWidth={2} />
                  </div>
                  <div className="mt-1">
                    <h3 className="text-base font-bold text-white mb-1.5 font-headline">Clear Bid/No-Bid Decisions</h3>
                    <p className="text-sm text-[#a0b2c8] leading-relaxed max-w-md">Go, Conditional Go, or No-Bid — every recommendation is backed by AI analysis and a structured evidence trail.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right Column: Opportunity Card UI Recreation */}
            <div className="w-full max-w-lg mx-auto lg:mx-0 relative group mt-8 lg:mt-0 lg:ml-8 transition-transform duration-700 hover:-translate-y-2">
              <div className="absolute inset-0 bg-[#00c3ff]/20 blur-3xl -z-10 rounded-[3rem] group-hover:bg-[#00c3ff]/30 transition-colors duration-700 animate-pulse"></div>
              {/* Perfectly rendering the Card design exactly as provided in the screenshot */}
              <div className="bg-[#0b1120] border border-[#1e2d4a] group-hover:border-[#00c3ff]/50 rounded-2xl p-5 shadow-2xl group-hover:shadow-[0_0_40px_rgba(0,195,255,0.2)] font-body relative overflow-hidden transition-all duration-700 text-[0.9em]">
                
                {/* Simulated Glass Shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-blue-900/30 rounded-full border border-blue-500/30 flex items-center justify-center p-2 shrink-0">
                       <div className="w-full h-full rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center">
                         <span className="text-[10px] uppercase font-bold text-blue-300">Navy</span>
                       </div>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-[1.1rem] mb-1 line-clamp-1">Process Improvement and Proj...</h3>
                      <p className="text-[#a0b2c8] font-bold mb-3 tracking-wide text-xs">DEPT OF THE NAVY</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 bg-yellow-900/40 text-yellow-500 border border-yellow-700/50 rounded text-xs font-bold tracking-wider">PRE-SOL</span>
                        <span className="px-2 py-0.5 bg-blue-900/40 text-blue-400 border border-blue-800/50 rounded text-xs font-medium">Women-Owned Small Business</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right pl-4">
                    <div className="text-[2rem] font-black text-white italic tracking-tighter leading-none mb-1">77<span className="text-xl ml-0.5">%</span></div>
                    <div className="text-[9px] font-black uppercase text-white tracking-[0.1em] mb-2">Match Score</div>
                    <div className="flex items-center justify-end text-[#53d2aa] text-[11px] font-bold gap-1 whitespace-nowrap">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Due Oct 15, 2026
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-[#1e2d4a] mb-6"></div>

                {/* Body Columns */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Col */}
                  <div className="space-y-5">
                    <h4 className="text-white font-bold text-xs mb-4">Opportunity Snapshot</h4>
                    
                    <div className="flex gap-3 items-start">
                      <div className="mt-0.5 w-5 h-5 rounded bg-indigo-900/40 border border-indigo-700/50 flex items-center justify-center text-indigo-400 text-[10px] shrink-0 font-mono">#</div>
                      <p className="text-xs text-white font-bold leading-relaxed">
                        <span className="text-[#a0b2c8] font-normal mr-1">NAICS 541611 •</span> 
                        Administrative Management and General Management Consulting Services
                      </p>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded bg-slate-800/40 border border-slate-700/50 flex items-center justify-center text-slate-500 text-[10px] shrink-0">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      <p className="text-xs text-slate-500 font-medium italic mt-0.5">No keyword matches found</p>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="mt-0.5 w-5 h-5 rounded bg-blue-900/40 border border-blue-700/50 flex items-center justify-center text-blue-400 text-[10px] shrink-0">
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                      <p className="text-xs text-white font-bold leading-relaxed">
                        <span className="text-[#a0b2c8] font-normal mr-1">Set-aside:</span> 
                        Women-Owned Small Business
                      </p>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="mt-0.5 w-5 h-5 rounded bg-yellow-900/40 border border-yellow-700/50 flex items-center justify-center text-yellow-500 text-[10px] font-bold shrink-0">⚠</div>
                      <p className="text-xs text-[#a0b2c8] leading-relaxed">
                        <span className="text-yellow-500 font-medium mr-1">Key gap:</span> 
                        location and estimated value not yet available
                      </p>
                    </div>

                  </div>

                  {/* Right Col */}
                  <div className="pl-6 border-l border-[#1e2d4a]">
                    <h4 className="text-white font-bold text-xs mb-4">Fit Analysis</h4>
                    
                    <div className="space-y-3">
                      {[
                        { label: 'Capability Fit', width: '80%', score: '20', max: '25', op: 'opacity-100', color: 'bg-[#5b8cff]' },
                        { label: 'Set-Aside Fit', width: '75%', score: '15', max: '20', op: 'opacity-100', color: 'bg-[#5b8cff]' },
                        { label: 'Agency Fit', width: '66%', score: '10', max: '15', op: 'opacity-100', color: 'bg-[#4b6385]' },
                        { label: 'Geographic Fit', width: '70%', score: '7', max: '10', op: 'opacity-100', color: 'bg-[#5b8cff]' },
                        { label: 'Value Fit', width: '50%', score: '5', max: '10', op: 'opacity-50', color: 'bg-[#3b4b66]' },
                        { label: 'Timing Fit', width: '100%', score: '10', max: '10', op: 'opacity-100', color: 'bg-[#7c9cd6]' },
                        { label: 'Keyword Fit', width: '0%', score: '0', max: '10', op: 'opacity-20', color: 'bg-[#1e2d4a]' },
                      ].map((bar, i) => (
                         <div key={i} className={`flex items-center justify-between text-[11px] ${bar.op}`}>
                           <span className="text-white font-medium w-20 truncate">{bar.label}</span>
                           <div className="flex-grow h-[6px] bg-[#1a2333] mx-3 rounded-full overflow-hidden">
                             <div className={`h-full ${bar.color} rounded-full`} style={{ width: bar.width }}></div>
                           </div>
                           <span className="text-white font-bold w-10 text-right">{bar.score}<span className="text-slate-500 font-medium">/{bar.max}</span></span>
                         </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-[#1e2d4a] mt-8 mb-4"></div>

                {/* Footer */}
                <div className="flex justify-between items-center text-xs">
                  <div className="text-slate-500 leading-tight">
                    Scored <br/>04/08/2026
                  </div>
                  <div className="flex gap-5 items-center">
                    <a href="#" className="flex items-center gap-1.5 text-slate-400 font-medium hover:text-white transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      SAM.gov
                    </a>
                    <button className="flex items-center gap-1.5 text-slate-400 font-medium hover:text-white transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      Hide
                    </button>
                    <button className="px-5 py-1.5 bg-[#1e2d4a] hover:bg-[#2a3c5e] border border-blue-500/20 rounded font-bold text-white transition-colors flex items-center gap-2">
                       <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                       Bookmark
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
        
        {/* Custom Tailwin animation utilities inline for the shimmer effect */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}} />
      </section>

      {/* Pricing */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-headline font-black text-4xl text-white mb-4 tracking-tight">Simple, transparent pricing.</h2>
            <p className="text-[#a0b2c8] text-lg font-body">Start free. Upgrade when you're ready to pursue.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Free */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300">
              <h3 className="font-headline text-xl font-bold text-white mb-1">Free</h3>
              <p className="text-xs text-[#8b9bb4] mb-4 font-body">Test the workflow</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white font-headline">$0</span>
              </div>
              <p className="text-sm text-[#a0b2c8] mb-8 leading-relaxed flex-grow font-body">Search and browse SAM.gov opportunities. Run Phase 1 RFI triage on up to 10 pursuits.</p>
              <Link to="/signup" className="block text-center w-full py-3 rounded-lg border border-[#1e2d4a] text-white font-bold hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all text-sm">Start Free</Link>
            </div>
            {/* Starter */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300">
              <h3 className="font-headline text-xl font-bold text-white mb-1">Starter</h3>
              <p className="text-xs text-[#8b9bb4] mb-4 font-body">For solo contractors</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white font-headline">$99</span>
                <span className="text-[#8b9bb4] text-sm font-body">/mo</span>
              </div>
              <p className="text-sm text-[#a0b2c8] mb-8 leading-relaxed flex-grow font-body">Full 5-phase workflow for up to 25 pursuits. AI eligibility, scoring, and Go/No-Go decisions.</p>
              <Link to="/signup" className="block text-center w-full py-3 rounded-lg border border-[#1e2d4a] text-white font-bold hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all text-sm">Start Starter</Link>
            </div>
            {/* Pro */}
            <div className="bg-[#0b1120] border border-[#00c3ff]/50 rounded-2xl p-6 flex flex-col shadow-[0_0_60px_rgba(0,195,255,0.12)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/60 to-transparent rounded-t-2xl"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.06)_0%,transparent_65%)] pointer-events-none"></div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-headline text-xl font-bold text-white">Pro</h3>
                <span className="text-[10px] font-bold text-[#030B17] bg-[#00c3ff] px-2 py-0.5 rounded-full uppercase tracking-widest font-label">Most Popular</span>
              </div>
              <p className="text-xs text-[#8b9bb4] mb-4 font-body">For small contractors & proposal teams</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white font-headline">$199</span>
                <span className="text-[#8b9bb4] text-sm font-body">/mo</span>
              </div>
              <p className="text-sm text-[#a0b2c8] mb-8 leading-relaxed flex-grow font-body relative z-10">Unlimited pursuits, full AI pipeline, PDF Decision Package export — everything you need to win.</p>
              <Link to="/signup" className="block text-center w-full py-3 rounded-lg bg-[#00c3ff] text-[#030B17] font-bold shadow-[0_0_30px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 text-sm">Start Pro</Link>
            </div>
            {/* Team */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300">
              <h3 className="font-headline text-xl font-bold text-white mb-1">Team</h3>
              <p className="text-xs text-[#8b9bb4] mb-4 font-body">For multi-user capture teams</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white font-headline">$299</span>
                <span className="text-[#8b9bb4] text-sm font-body">/mo</span>
              </div>
              <p className="text-sm text-[#a0b2c8] mb-8 leading-relaxed flex-grow font-body">Everything in Pro plus multi-seat access, shared pipeline, and priority parsing for up to 5 users.</p>
              <Link to="/contact" className="block text-center w-full py-3 rounded-lg border border-[#1e2d4a] text-white font-bold hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all text-sm">Talk to the Team</Link>
            </div>
          </div>
          <p className="text-center text-sm text-[#8b9bb4]/60 mt-8">
            <Link to="/pricing" className="text-[#00c3ff] hover:underline">See full feature comparison →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
