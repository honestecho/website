import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import { track } from '../lib/analytics';

const SRC = '/video/pursuit-launch-v2.mp4';
const POSTER = '/video/pursuit-launch-v2-poster.jpg';
const LABEL = 'HE Pursuit: a 30-second tour from a scored opportunity to a recorded Go decision';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030B17]';
const autoplayOff = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !window.matchMedia('(min-width: 768px)').matches);
const chip = `inline-flex items-center justify-center gap-1.5 h-9 rounded-xl bg-[#030B17]/70 border border-white/15 text-white text-xs font-semibold backdrop-blur hover:bg-[#030B17]/90 transition-colors ${focusRing}`;

/**
 * Hero launch video — the 30-second Pursuit tour.
 *
 * Self-hosted under /video: the site CSP has no media-src, so media falls back
 * to default-src 'self' and a third-party embed would be blocked.
 *
 * On md+ it autoplays muted and loops, unless the visitor prefers reduced
 * motion — then it waits for a click and plays with sound. The poster is the
 * video's own first frame, so the swap from poster to playback is seamless.
 * Pause is always offered while it plays (WCAG 2.2.2: auto-starting motion
 * longer than 5s must be pausable).
 *
 * Click the video (or Enlarge) to watch it large, with sound and native
 * controls, in the same lightbox as the site's other click-to-enlarge visuals
 * (ZoomImage, HeroPursuitCardZoom). The inline video pauses underneath and
 * picks up again on close.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(true);
  // The play button is shown only once we KNOW it is needed (reduced motion,
  // autoplay refused, or the viewer paused). Keying it off `!playing` flashed
  // it over the poster on every desktop load until autoplay began. False at
  // prerender (no window), so the static HTML never carries it either.
  const [showPlay, setShowPlay] = useState(autoplayOff);

  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const enlargeRef = useRef<HTMLButtonElement>(null);
  const resumeInline = useRef(false);
  const wasOpen = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || autoplayOff()) return;
    // React's `muted` prop sets the property but never the attribute
    // (facebook/react#10389), and createRoot discards the prerendered element
    // that had it. Autoplay checks read the attribute in some browsers, so
    // without this the muted autoplay was refused and the play button showed.
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    v.preload = 'auto';
    v.play().catch(() => setShowPlay(true));
  }, []);

  // Lightbox: Escape closes; scroll is locked before paint with the scrollbar's
  // width reserved so the page doesn't shift (same as ZoomImage).
  useLayoutEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
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

  // On close: resume the inline video if it was playing, and hand focus back.
  useEffect(() => {
    if (open) { wasOpen.current = true; return; }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    if (resumeInline.current) ref.current?.play().catch(() => {});
    enlargeRef.current?.focus();
  }, [open]);

  const openLarge = () => {
    const v = ref.current;
    resumeInline.current = !!v && !v.paused;
    v?.pause();
    setOpen(true);
    track('home_hero_video_enlarged');
  };

  const playWithSound = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    v.play().catch(() => {});
    track('home_hero_video_played', { sound: true });
  };

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) track('home_hero_video_played', { sound: true });
  };

  return (
    <>
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#1e2d4a] bg-[#0d141e] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),0_0_60px_rgba(0,195,255,0.08)]">
        <video
          ref={ref}
          className="absolute inset-0 w-full h-full object-cover"
          src={SRC}
          poster={POSTER}
          muted
          loop
          playsInline
          preload="none"
          aria-label={LABEL}
          onPlay={() => { setPlaying(true); setStarted(true); setShowPlay(false); }}
          onPause={() => { setPlaying(false); setShowPlay(true); }}
        />

        {/* The whole surface opens the large player. Out of the tab order:
            the Enlarge button below is the keyboard path to the same thing. */}
        <button
          type="button"
          tabIndex={-1}
          onClick={openLarge}
          aria-label="Enlarge video"
          className="absolute inset-0 w-full h-full cursor-zoom-in bg-transparent"
        />

        {showPlay && !playing && (
          <button
            type="button"
            onClick={() => (started ? ref.current?.play().catch(() => {}) : playWithSound())}
            className={`absolute inset-0 m-auto h-fit w-fit inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#00c3ff] text-[#030B17] font-bold text-base shadow-[0_0_40px_rgba(0,195,255,0.3)] hover:scale-[1.03] transition-transform ${focusRing}`}
          >
            <Play className="w-5 h-5" aria-hidden="true" />
            {started ? 'Resume' : 'Watch the 30-second tour'}
          </button>
        )}

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {playing && (
            <>
              <button type="button" onClick={() => ref.current?.pause()} aria-label="Pause video" className={`${chip} w-9`}>
                <Pause className="w-4 h-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={toggleSound} aria-label={muted ? 'Turn sound on' : 'Mute video'} className={`${chip} px-3`}>
                {muted ? <VolumeX className="w-4 h-4" aria-hidden="true" /> : <Volume2 className="w-4 h-4" aria-hidden="true" />}
                {muted ? 'Sound on' : 'Mute'}
              </button>
            </>
          )}
          <button ref={enlargeRef} type="button" onClick={openLarge} aria-label="Enlarge video" className={`${chip} px-3`}>
            <Maximize2 className="w-4 h-4" aria-hidden="true" />
            Enlarge
          </button>
        </div>
      </div>

      {/* Large player — portaled to <body> so no ancestor's stacking context
          can paint over it. Plays from the top with sound: opening it is the
          click, so the browser allows audio. */}
      {open && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={LABEL}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close enlarged video"
            className="fixed top-5 right-5 z-[110] flex items-center justify-center w-11 h-11 rounded-full bg-[#0b1120] border border-[#1e2d4a] text-[#a0b2c8] hover:text-white hover:border-[#00c3ff]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff]"
          >
            <X size={18} aria-hidden="true" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[min(100%,1600px,calc((100vh_-_6rem)*16/9))] aspect-video rounded-2xl overflow-hidden border border-[#1e2d4a] bg-[#030b17] shadow-2xl"
          >
            <video className="block w-full h-full" src={SRC} poster={POSTER} controls autoPlay playsInline aria-label={LABEL} />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
