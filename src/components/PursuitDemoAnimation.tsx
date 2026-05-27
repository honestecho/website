import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Shield, Layers, Landmark, CheckCircle2, AlertTriangle, ArrowRight, Clock, DollarSign, MapPin, Hash
} from 'lucide-react';

type Phase = 'search' | 'card' | 'pipeline';

export default function PursuitDemoAnimation() {
  const [phase, setPhase] = useState<Phase>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [pursueHovered, setPursueHovered] = useState(false);
  const [pursueClicked, setPursueClicked] = useState(false);

  const fullQuery = "SETA Follow on Systems Engineering...";
  const pipelineSteps = ['Triage', 'Eligibility', 'Strategic', 'Effort - Win', 'Decision'];

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const runSequence = async () => {
      // Reset state
      setPhase('search');
      setSearchQuery('');
      setActiveStep(0);
      setPursueHovered(false);
      setPursueClicked(false);

      // Phase 1: Typing
      await new Promise(r => setTimeout(r, 1000));
      for (let i = 0; i <= fullQuery.length; i++) {
        setSearchQuery(fullQuery.slice(0, i));
        await new Promise(r => setTimeout(r, 40));
      }

      // Pause after typing
      await new Promise(r => setTimeout(r, 800));
      setPhase('card');

      // Phase 2: Card appears, wait, then simulate hover/click on "Pursue"
      await new Promise(r => setTimeout(r, 2000));
      setPursueHovered(true);
      await new Promise(r => setTimeout(r, 600));
      setPursueClicked(true);
      await new Promise(r => setTimeout(r, 300));

      // Phase 3: Transition to Pipeline
      setPhase('pipeline');

      // Step sequentially through the pipeline
      for (let i = 1; i <= 5; i++) {
        await new Promise(r => setTimeout(r, 800));
        setActiveStep(i);
      }

      // Hold at the end
      await new Promise(r => setTimeout(r, 4000));

      // Loop!
      runSequence();
    };

    runSequence();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto h-[500px] flex items-center justify-center bg-transparent perspective-1000">
      <AnimatePresence mode="wait">
        
        {/* --- SEARCH BAR PHASE --- */}
        {phase === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-lg"
          >
            <div className="flex items-center gap-4 bg-[#0f1a2e]/90 backdrop-blur-xl border border-[#1e2d4a] rounded-2xl px-6 py-4 shadow-[0_20px_40px_-10px_rgba(0,195,255,0.1)]">
              <Search className="text-[#00c3ff]" size={24} />
              <div className="flex items-center flex-1">
                <span className="text-xl font-medium text-white">{searchQuery}</span>
                <motion.div 
                  animate={{ opacity: [1, 0, 1] }} 
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-0.5 h-6 bg-[#00c3ff] ml-1" 
                />
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#00c3ff]/10 text-[#00c3ff] text-sm font-bold border border-[#00c3ff]/20">
                Search
              </div>
            </div>
          </motion.div>
        )}

        {/* --- OPPORTUNITY CARD PHASE --- */}
        {phase === 'card' && (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 40, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
            className="w-full max-w-4xl"
          >
            <div className="rounded-2xl border border-[#1e2d4a] bg-[#0b1120] flex flex-col p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full border border-[#1e2d4a] bg-[#0f1a2e] flex items-center justify-center shrink-0 p-1">
                  {/* USAF Logo placeholder - using a generic seal representation */}
                  <div className="w-full h-full rounded-full border-2 border-dashed border-[#00c3ff]/40 flex items-center justify-center bg-[#00c3ff]/10">
                    <Shield size={24} className="text-[#00c3ff]" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-black text-white leading-tight mb-1">
                    DC3 SETA Follow on Systems Engineering and Technical<br/>Assistance (SETA) Professional Support Services
                  </h3>
                  <p className="text-sm font-bold text-[#8b9bb4] tracking-wide mb-2 uppercase">DEPT OF THE AIR FORCE</p>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-black uppercase tracking-wide bg-[#1a1300] text-[#fbbf24] border border-[#332500]">
                    Solicitation
                  </span>
                </div>
                <div className="shrink-0 flex flex-col items-end pt-1">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-black tabular-nums leading-none tracking-tight text-white">85</span>
                    <span className="text-2xl font-black text-[#8b9bb4]">%</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#8b9bb4] mt-1">Match Score</span>
                  <div className="mt-3 flex flex-col items-end gap-1.5">
                    <span className="text-xs font-semibold tabular-nums text-[#f87171] flex items-center gap-1.5">
                      <Clock size={12} /> Due May 21, 2026
                    </span>
                    <span className="px-2 py-0.5 rounded border border-[#4a0a0a] bg-[#2a0505] text-[#f87171] text-xs font-bold">
                      5d left
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex gap-6 border-t border-[#1e2d4a] pt-6 pb-2">
                
                {/* Left Column */}
                <div className="flex-1 space-y-5">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-3">Contract Identity</h4>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <Layers size={14} className="text-[#00c3ff] shrink-0" />
                        <span className="px-3 py-1 bg-[#0f1a2e] rounded-lg text-sm border border-[#1e2d4a] text-white">
                          <span className="text-[#00c3ff] font-medium">541611</span> — Administrative Management and ...
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Hash size={14} className="text-[#00c3ff] shrink-0" />
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-[#0f1a2e] rounded-lg text-sm border border-[#1e2d4a] text-[#00c3ff]">Systems Engi...</span>
                          <span className="px-3 py-1 bg-[#0f1a2e] rounded-lg text-sm border border-[#1e2d4a] text-[#00c3ff]">Professional S...</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield size={14} className="text-[#00c3ff] shrink-0" />
                        <span className="px-3 py-1 bg-[#0f1a2e] rounded-lg text-sm border border-[#1e2d4a] text-[#00c3ff]">
                          Total Small Business Set-Aside (FAR 19.5)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Landmark size={14} className="text-[#00c3ff] shrink-0" />
                        <span className="px-3 py-1 bg-[#0f1a2e] rounded-lg text-sm border border-[#1e2d4a] text-[#00c3ff]">
                          DEPT OF THE AIR FORCE
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-3">Operational Fit</h4>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <MapPin size={14} className="text-[#00c3ff] shrink-0" />
                        <span className="text-sm text-[#4a6080] italic">Not disclosed</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign size={14} className="text-[#00c3ff] shrink-0" />
                        <span className="text-sm text-[#4a6080] italic">Not disclosed</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock size={14} className="text-[#00c3ff] shrink-0" />
                        <span className="px-3 py-1 bg-[#0f1a2e] rounded-lg text-sm border border-[#4a0a0a] text-[#f87171] flex items-center gap-2">
                          <Clock size={12} /> Due May 21, 2026
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="w-[45%] border-l border-[#1e2d4a] pl-6 flex flex-col">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-3">Recommendation</h4>
                  <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#06261A] border border-[#0A402B] w-full mb-6 shadow-[inset_0_0_20px_rgba(74,222,128,0.05)]">
                    <CheckCircle2 size={16} className="text-[#4ade80]" />
                    <span className="text-sm font-black text-white">GO <span className="text-[#4ade80] font-normal mx-1">|</span> High confidence</span>
                  </div>
                  
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-3">Why this scored 85%</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={14} className="text-[#4ade80] shrink-0 mt-0.5" />
                      <span className="text-sm text-white font-medium">NAICS code closely matches the requirement</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={14} className="text-[#4ade80] shrink-0 mt-0.5" />
                      <span className="text-sm text-white font-medium">Scope language aligns well with your profile</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle size={14} className="text-[#fbbf24] shrink-0 mt-0.5" />
                      <span className="text-sm text-[#8b9bb4] font-medium">Geographic scope may fall outside your area</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={14} className="text-[#4ade80] shrink-0 mt-0.5" />
                      <span className="text-sm text-white font-medium">Contract value fits your target range</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={14} className="text-[#4ade80] shrink-0 mt-0.5" />
                      <span className="text-sm text-white font-medium">Set-aside type aligns with your certifications</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center border-t border-[#1e2d4a] pt-5 mt-2">
                <div className="flex items-center gap-6">
                  <span className="text-sm font-semibold text-[#8b9bb4]">Apr 25, 2026</span>
                  <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-[#8b9bb4] hover:text-white transition-colors">
                    <ArrowRight size={14} className="-rotate-45" /> SAM.gov
                  </a>
                </div>
                
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[#1e2d4a] text-[#8b9bb4] text-sm font-bold hover:text-white hover:bg-[#1e2d4a]/50 transition-colors">
                    <span className="rotate-90">⚑</span> Bookmark
                  </button>
                  <motion.div
                    animate={{
                      scale: pursueClicked ? 0.95 : pursueHovered ? 1.05 : 1,
                      backgroundColor: pursueHovered ? '#00e5ff' : '#00c3ff',
                      boxShadow: pursueHovered ? '0 0 20px rgba(0, 195, 255, 0.4)' : 'none'
                    }}
                    className="flex items-center gap-2 px-10 py-2.5 rounded-lg text-[#030B17] font-black text-sm cursor-pointer"
                  >
                    <div className="w-4 h-4 rounded-full border-2 border-[#030B17] flex items-center justify-center border-t-transparent border-l-transparent rotate-45" />
                    Pursue
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- PIPELINE PHASE --- */}
        {phase === 'pipeline' && (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-full max-w-4xl"
          >
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-12 flex items-center justify-between relative shadow-2xl">
              
              {/* Connecting line background */}
              <div className="absolute top-1/2 left-20 right-20 h-0.5 bg-[#1e2d4a] -translate-y-1/2 -z-0" />
              
              {/* Active line fill */}
              <motion.div 
                className="absolute top-1/2 left-20 h-0.5 bg-[#4ade80] -translate-y-1/2 -z-0"
                initial={{ width: "0%" }}
                animate={{ width: `${(Math.max(0, activeStep - 1) / 4) * 100}%` }}
                transition={{ duration: 0.5 }}
                style={{ right: '5rem', width: 'calc(100% - 10rem)' }}
              />

              {pipelineSteps.map((stepName, idx) => {
                const isActive = activeStep > idx;
                const isCurrent = activeStep === idx;
                return (
                  <div key={idx} className="relative z-10 flex flex-col items-center gap-5">
                    <motion.div
                      initial={{ backgroundColor: '#0b1120', borderColor: '#1e2d4a' }}
                      animate={{
                        backgroundColor: '#0b1120',
                        borderColor: isActive ? '#4ade80' : isCurrent ? '#00c3ff' : '#1e2d4a',
                        boxShadow: isActive ? '0 0 25px rgba(74,222,128,0.2)' : isCurrent ? '0 0 25px rgba(0,195,255,0.2)' : 'none',
                        scale: isActive || isCurrent ? 1.1 : 1
                      }}
                      className="w-16 h-16 rounded-full border-[3px] flex items-center justify-center transition-colors relative"
                    >
                      {/* Inner glow effect for active/current */}
                      {(isActive || isCurrent) && (
                        <div className={`absolute inset-0 rounded-full blur-md opacity-40 ${isActive ? 'bg-[#4ade80]' : 'bg-[#00c3ff]'}`} />
                      )}

                      {isActive ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="relative z-10">
                          <CheckCircle2 size={24} className="text-[#4ade80]" strokeWidth={3} />
                        </motion.div>
                      ) : isCurrent ? (
                        <Shield size={24} className="text-[#00c3ff] relative z-10" strokeWidth={2} />
                      ) : (
                        <span className="text-[#1e2d4a] font-bold text-xl opacity-50 relative z-10">?</span>
                      )}
                    </motion.div>
                    
                    <div className="text-center w-24">
                      <p className={`text-[13px] font-black uppercase tracking-widest mb-1 ${isActive ? 'text-white' : isCurrent ? 'text-white' : 'text-[#4a6080]'}`}>
                        {stepName}
                      </p>
                      
                      {/* Status Text (Stop / Continue / Complete) */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-[13px] font-semibold ${
                          isActive ? 'text-[#4ade80]' : 
                          isCurrent && stepName === 'Triage' ? 'text-[#f87171]' : 
                          isCurrent && stepName === 'Eligibility' ? 'text-[#8b9bb4]' : 
                          'opacity-0'
                        }`}
                      >
                        {isActive ? 'Complete' : 
                         isCurrent && stepName === 'Triage' ? 'Stop' : 
                         isCurrent && stepName === 'Eligibility' ? 'Continue' : 
                         'Pending'}
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
