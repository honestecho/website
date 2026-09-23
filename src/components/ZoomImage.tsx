import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, X } from 'lucide-react';

/**
 * A framed product screenshot that opens at readable size on click — the same
 * click-to-enlarge pattern as the hero card (HeroPursuitCardZoom). In the
 * overlay the image keeps its 1:1 CSS width (`zoomWidth`) inside a scrollable
 * panel, so phone viewers can pan instead of squinting at a downscaled shot.
 */
export default function ZoomImage({ src, alt, width, height, zoomWidthClass, label }: {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Tailwind width class for the capture's 1:1 CSS size, e.g. `w-[825px]` for a 1650px-wide 2x shot — the
   *  enlarged view shows the shot at that size (crisp, like the hero card's enlarge), never stretched wider. */
  zoomWidthClass: string;
  /** Always-visible badge on the frame, e.g. "Example pursuit" — demo data must be labeled on the visual itself. */
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    // Lock scroll before paint and reserve the scrollbar's width so the page
    // doesn't shift horizontally while the overlay is up.
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Enlarge screenshot"
        className="group/zoom relative block w-full text-left cursor-zoom-in rounded-2xl border border-[#1e2d4a] bg-[#0b1120] p-2 shadow-2xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030B17]"
      >
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" className="w-full h-auto rounded-xl" />
        {/* Footer row inside the frame, never over the screenshot: demo-data label left, enlarge hint right */}
        <span className="flex items-center justify-between gap-3 px-2 pt-2.5 pb-1">
          {label && (
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide bg-[#111a2e] border border-[#2a3a5c] text-[#8b9bb4]">
              {label}
            </span>
          )}
          <span className="ml-auto flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#8b9bb4] group-hover/zoom:text-[#00c3ff] transition-colors">
            <Maximize2 size={11} className="text-[#00c3ff]" aria-hidden="true" /> Enlarge
          </span>
        </span>
      </button>

      {open && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close enlarged view"
            className="fixed top-5 right-5 z-[110] flex items-center justify-center w-11 h-11 rounded-full bg-[#0b1120] border border-[#1e2d4a] text-[#a0b2c8] hover:text-white hover:border-[#00c3ff]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
          >
            <X size={18} aria-hidden="true" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-fit max-w-full max-h-full overflow-auto rounded-2xl border border-[#1e2d4a] bg-[#0b1120] p-2"
          >
            <img src={src} alt="" width={width} height={height} className={`block h-auto max-w-none rounded-xl ${zoomWidthClass}`} />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
