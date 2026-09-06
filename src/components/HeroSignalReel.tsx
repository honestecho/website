import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Hash, Shield, Landmark, MapPin, DollarSign, Clock, CheckCircle2, ArrowRight, FileText,
} from 'lucide-react';

/**
 * Hero "signal over noise" reel.
 * Flow: opportunity noise -> decision card (score + GO/Strong Evidence + 3 reasons)
 * -> soft pursuit pipeline under the card -> fade out to the white "Know before you bid." tagline.
 * Code animation (not a video): real product UI, crisp, instant, no fake data.
 */

type Phase = 'noise' | 'card' | 'fill' | 'pipeline' | 'tagline';
const ORDER: Phase[] = ['noise', 'card', 'fill', 'pipeline', 'tagline'];

const IDENTITY = [
  { Icon: Layers, text: '541611 — Administrative Management an...' },
  { Icon: Hash, text: 'Outreach' },
  { Icon: Shield, text: 'Total Small Business Set-Aside (FAR 19.5)' },
  { Icon: Landmark, text: 'DEPT OF THE ARMY' },
];

// 3 reasons only — a hero viewer absorbs a few things.
const WHY = [
  'NAICS closely matches the requirement',
  'Scope aligns with your profile',
  'Set-aside fits your certifications',
];

// Faint background "noise" cards with tiny labels — many, to convey overwhelm.
const GHOSTS = [
  { top: '1%', left: '-2%', w: 162, drift: -8, dur: 5.5, label: 'SAM.gov notice' },
  { top: '3%', left: '24%', w: 138, drift: 6, dur: 6.6, label: 'Sources Sought' },
  { top: '6%', right: '2%', w: 150, drift: 7, dur: 6.2, label: 'Attachments' },
  { top: '20%', left: '6%', w: 144, drift: -6, dur: 5.9, label: 'RFP' },
  { top: '24%', left: '44%', w: 132, drift: 6, dur: 6.4, label: 'Solicitation' },
  { top: '22%', right: '4%', w: 146, drift: 8, dur: 6.0, label: 'Pre-solicitation' },
  { top: '40%', left: '-4%', w: 156, drift: -6, dur: 5.0, label: 'Due soon' },
  { top: '44%', right: '-2%', w: 148, drift: 9, dur: 6.7, label: 'NAICS' },
  { top: '58%', left: '10%', w: 150, drift: -7, dur: 5.6, label: 'Set-aside' },
  { top: '60%', right: '6%', w: 140, drift: 7, dur: 6.3, label: 'Amendment' },
  { top: '76%', left: '0%', w: 158, drift: -8, dur: 5.8, label: 'Combined Synopsis' },
  { top: '80%', left: '40%', w: 132, drift: 6, dur: 6.1, label: 'Q&A' },
  { top: '78%', right: '20%', w: 148, drift: -9, dur: 5.3, label: 'Award Notice' },
];

const STAGES = [
  { label: 'Triage', status: 'Continue', color: '#4ade80' },
  { label: 'Eligibility', status: 'Unclear', color: '#8b9bb4' },
  { label: 'Strategic', status: 'High', color: '#4ade80' },
  { label: 'Effort · Win', status: 'Moderate · Medium', color: '#fbbf24' },
  { label: 'Decision', status: 'Go', color: '#4ade80' },
];

export default function HeroSignalReel() {
  const [phase, setPhase] = useState<Phase>('noise');
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(0); // pipeline progress (0 = Triage active)
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);

  const at = (p: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(p);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    const countTo = (to: number, ms: number) => new Promise<void>(resolve => {
      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return resolve();
        const t = Math.min(1, (now - start) / ms);
        setScore(Math.round((1 - Math.pow(1 - t, 3)) * to));
        if (t < 1) requestAnimationFrame(tick); else resolve();
      };
      requestAnimationFrame(tick);
    });

    const run = async () => {
      while (!cancelled) {
        while (!visibleRef.current && !cancelled) await sleep(400);
        if (cancelled) return;

        setPhase('noise'); setScore(0); setStep(0);
        await sleep(1500); if (cancelled) return;

        // Complete card appears, then the score counts up.
        setPhase('card');
        await sleep(350); if (cancelled) return;
        await countTo(82, 1300); if (cancelled) return;
        await sleep(350); if (cancelled) return;

        // Right side fills in one item at a time.
        setPhase('fill');
        await sleep(2300); if (cancelled) return;

        // Pursuit pipeline resolves softly under the card.
        setPhase('pipeline');
        for (let i = 1; i <= 5; i++) { await sleep(520); if (cancelled) return; setStep(i); }
        await sleep(800); if (cancelled) return;

        // Fade out to the white tagline.
        setPhase('tagline');
        await sleep(3400);
      }
    };

    run();
    return () => { cancelled = true; };
  }, []);

  const dim = phase === 'tagline';

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto h-[600px] flex flex-col items-center justify-center gap-5 overflow-hidden"
    >
      {/* ── Background noise: faint labelled opportunity cards ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: phase === 'noise' ? 1 : dim ? 0.16 : 0.1,
          filter: phase === 'noise' ? 'blur(2px)' : dim ? 'blur(20px)' : 'blur(14px)',
        }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
      >
        {GHOSTS.map((g, i) => (
          <motion.div
            key={i}
            className="absolute rounded-xl border border-[#1e2d4a] bg-[#0b1120]/70"
            style={{ top: g.top, left: g.left, right: g.right, width: g.w }}
            animate={{ y: [0, g.drift, 0] }}
            transition={{ duration: g.dur, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="p-3 opacity-70">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-bold uppercase tracking-wider text-[#5a6c87]">{g.label}</span>
                <div className="h-1.5 w-5 rounded bg-[#1e2d4a]" />
              </div>
              <div className="h-1.5 w-full rounded bg-[#152033] mb-1.5" />
              <div className="h-1.5 w-2/3 rounded bg-[#152033]" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Overlay: "Too many opportunities." ── */}
      <AnimatePresence>
        {phase === 'noise' && (
          <motion.div
            key="noise-overlay"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
            className="absolute top-6 left-0 right-0 text-center z-20 pointer-events-none"
          >
            <span className="text-lg sm:text-xl font-headline font-bold text-[#8b9bb4]">Too many opportunities.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Decision card ── */}
      <motion.div
        initial={false}
        animate={{ opacity: phase === 'noise' ? 0 : dim ? 0.12 : 1, y: phase === 'noise' ? 8 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[620px]"
      >
        <div className="relative rounded-2xl border border-[#1e2d4a] bg-[#0b1120] p-5 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/50 to-transparent rounded-t-2xl" />

          {/* Header */}
          <div className="flex items-start gap-3 pb-4 border-b border-[#1e2d4a]">
            <div className="w-12 h-12 rounded-full border border-[#2a3a5c] bg-gradient-to-b from-[#13203a] to-[#0b1120] flex items-center justify-center shrink-0">
              <div className="w-9 h-9 rounded-full border border-[#b58500]/50 flex items-center justify-center bg-[#b58500]/10">
                <Landmark size={15} className="text-[#d4a017]" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[13.5px] font-black text-white leading-snug line-clamp-2">
                Right-of-Entry (ROE) Management &amp; Outreach, Guam &amp; CNMI
              </h3>
              <p className="text-[10px] font-bold text-[#8b9bb4] uppercase tracking-wide mt-1">Dept of the Army</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide bg-[#0a2a3a] border border-[#15506a] text-[#5cc7e8]">
                Combined Synopsis / Solicitation
              </span>
            </div>
            <div className="shrink-0 flex flex-col items-end pt-0.5">
              <div className="flex items-baseline">
                <span className="text-6xl font-black tabular-nums leading-none tracking-tighter text-white">{score}</span>
                <span className="text-2xl font-black text-[#8b9bb4]">%</span>
              </div>
              <AnimatePresence>
                {at('card') && (
                  <motion.div
                    key="fit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-end mt-1.5"
                  >
                    <div className="h-[3px] w-14 rounded bg-[#4ade80] mb-1" />
                    <span className="text-[13px] font-bold text-[#4ade80]">Strong Fit</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#d4a017]">
                <Clock size={11} /> Due Jun 5, 2026
              </span>
            </div>
          </div>

          {/* Body — two columns (left dimmed / secondary) */}
          <div className="flex gap-5 pt-4">
            {/* Left — secondary */}
            <div className="flex-1 min-w-0 space-y-4 opacity-55">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-2.5">Contract Identity</h4>
                <div className="space-y-2">
                  {IDENTITY.map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <Icon size={13} className="text-[#00c3ff] shrink-0" />
                      <span className="text-[12px] text-[#cdd9ea] truncate">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-2.5">Operational Fit</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <MapPin size={13} className="text-[#00c3ff] shrink-0" />
                    <span className="text-[12px] text-[#8b9bb4] italic">Not disclosed — low risk if remote-eligible</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <DollarSign size={13} className="text-[#00c3ff] shrink-0" />
                    <span className="text-[12px] text-[#8b9bb4] italic">Not posted — request pre-sol estimate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — the decision (primary) */}
            <div className="w-[48%] border-l border-[#1e2d4a] pl-5 min-h-[170px]">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-2.5">Recommendation</h4>

              {/* Analyzing… while the card resolves (plain conditional so it unmounts cleanly) */}
              {phase === 'card' && (
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#00c3ff] mb-3 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]" /> Analyzing fit signals…
                </div>
              )}

              {/* GO + Strong Evidence */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={at('fill') ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.5 }}
                className="flex gap-2 mb-3"
              >
                <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#06261A] border border-[#0A402B] text-[13px] font-black text-white">
                  <CheckCircle2 size={14} className="text-[#4ade80]" /> GO
                </span>
                <span className="flex items-center px-3 py-2 rounded-lg bg-[#0f1a2e] border border-[#1e2d4a] text-[11px] font-bold text-[#8b9bb4]">
                  Strong Evidence
                </span>
              </motion.div>

              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4] mb-2.5">Why this scored {at('card') ? '82' : '—'}%</h4>
              <div className="space-y-2.5">
                {WHY.map((w, i) => (
                  <motion.div
                    key={w}
                    initial={{ opacity: 0, x: -8 }}
                    animate={at('fill') ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                    transition={{ duration: 0.45, delay: at('fill') ? 0.4 + i * 0.45 : 0 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle2 size={13} className="text-[#4ade80] shrink-0 mt-0.5" />
                    <span className="text-[12.5px] text-white leading-snug">{w}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center border-t border-[#1e2d4a] pt-4 mt-4">
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-semibold text-[#8b9bb4]">May 20, 2026</span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[#8b9bb4]">
                <ArrowRight size={12} className="-rotate-45" /> SAM.gov
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1e2d4a] text-[#8b9bb4] text-[11px] font-bold">
                <span className="rotate-90">⚑</span> Bookmark
              </span>
              <motion.span
                animate={at('fill')
                  ? { boxShadow: '0 0 26px rgba(0,195,255,0.5)', scale: 1.03 }
                  : { boxShadow: '0 0 0px rgba(0,195,255,0)', scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#00c3ff] text-[#030B17] text-[12px] font-black"
              >
                <span className="w-3.5 h-3.5 rounded-full border-2 border-[#030B17] flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-[#030B17]" />
                </span>
                Start Pursuit
              </motion.span>
            </div>
          </div>
          <p className="text-center text-[11px] text-[#8b9bb4] mt-3">Run the full bid/no-bid workflow.</p>
        </div>
      </motion.div>

      {/* ── Soft pursuit pipeline, under the card ── */}
      <motion.div
        initial={false}
        animate={{ opacity: phase === 'noise' ? 0 : dim ? 0.12 : 1, y: phase === 'noise' ? 8 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[620px]"
      >
        <div className="relative flex items-start justify-between px-2">
          {/* track */}
          <div className="absolute top-7 left-[10%] right-[10%] h-0.5 bg-[#1e2d4a]" />
          <motion.div
            className="absolute top-7 left-[10%] h-0.5 bg-[#4ade80]"
            animate={{ width: `${Math.min(1, step / 5) * 80}%` }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
          {STAGES.map((s, idx) => {
            const resolved = idx < step;
            const active = idx === step && step < 5;
            return (
              <div key={s.label} className="relative z-10 flex flex-col items-center gap-2.5 w-[20%]">
                <motion.div
                  animate={{
                    borderColor: resolved ? '#4ade80' : active ? '#00c3ff' : '#22324f',
                    boxShadow: resolved ? '0 0 22px rgba(74,222,128,0.3)' : active ? '0 0 22px rgba(0,195,255,0.3)' : '0 0 0 rgba(0,0,0,0)',
                  }}
                  transition={{ duration: 0.4 }}
                  style={{ borderRadius: '9999px' }}
                  className="w-14 h-14 rounded-full border bg-[#0b1120]/80 flex items-center justify-center aspect-square"
                >
                  {resolved
                    ? <CheckCircle2 size={20} className="text-[#4ade80]" strokeWidth={2.5} />
                    : active
                      ? <FileText size={18} className="text-[#00c3ff]" />
                      : <span className="text-[#3a4a66] font-bold text-base">?</span>}
                </motion.div>
                <div className="text-center leading-tight">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${resolved || active ? 'text-white' : 'text-[#4a6080]'}`}>{s.label}</p>
                  {(resolved || active) && (
                    <p className="text-[11px] font-semibold mt-0.5" style={{ color: active ? '#00c3ff' : s.color }}>{s.status}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Final title card: white "Know before you bid." ── */}
      <AnimatePresence>
        {phase === 'tagline' && (
          <motion.div
            key="tagline"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          >
            <p
              className="max-w-xl px-6 text-center text-xl sm:text-2xl font-headline font-bold tracking-tight leading-snug text-white"
              style={{ filter: 'drop-shadow(0 0 30px rgba(0,195,255,0.4))' }}
            >
              Honest Echo turns SAM.gov notices and solicitation documents into clear pursuit decisions — with fit scoring, blockers, evidence, and next actions in minutes.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
