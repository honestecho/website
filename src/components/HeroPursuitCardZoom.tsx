import { useState, useEffect, useRef } from 'react';
import { Maximize2, X } from 'lucide-react';
import HeroPursuitCard from './HeroPursuitCard';

/**
 * Wraps the hero opportunity card with a click-to-enlarge lightbox.
 * Click the card (or its expand hint) to open an enlarged overlay;
 * click the backdrop, the ✕, or press Escape to go back.
 */
export default function HeroPursuitCardZoom() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      {/* Inline card — click to enlarge */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Enlarge opportunity card"
        className="group/zoom relative block w-full text-left cursor-zoom-in bg-transparent border-0 p-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030B17]"
      >
        <HeroPursuitCard />
        {/* expand hint */}
        <span className="pointer-events-none absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0b1120]/80 border border-[#1e2d4a] text-[#8b9bb4] text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-300">
          <Maximize2 size={11} className="text-[#00c3ff]" /> Click to enlarge
        </span>
      </button>

      {/* Lightbox */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged opportunity card"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-8"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close enlarged view"
            className="fixed top-5 right-5 z-[110] flex items-center justify-center w-10 h-10 rounded-full bg-[#0b1120] border border-[#1e2d4a] text-[#a0b2c8] hover:text-white hover:border-[#00c3ff]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
          >
            <X size={18} />
          </button>

          {/* Stop backdrop-close when interacting with the card itself */}
          <div onClick={(e) => e.stopPropagation()} className="my-auto origin-center scale-100 sm:scale-110 lg:scale-[1.3] transition-transform duration-200">
            <HeroPursuitCard />
          </div>
        </div>
      )}
    </>
  );
}
