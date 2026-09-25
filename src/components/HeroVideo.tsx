import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { track } from '../lib/analytics';

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
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#1e2d4a] bg-[#0d141e] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),0_0_60px_rgba(0,195,255,0.08)]">
      <video
        ref={ref}
        className="absolute inset-0 w-full h-full object-cover"
        src="/video/pursuit-launch.mp4"
        poster="/video/pursuit-launch-poster.jpg"
        muted
        loop
        playsInline
        preload="none"
        aria-label="HE Pursuit: a 30-second tour from a scored opportunity to a recorded Go decision"
        onPlay={() => { setPlaying(true); setStarted(true); setShowPlay(false); }}
        onPause={() => { setPlaying(false); setShowPlay(true); }}
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

      {playing && (
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button type="button" onClick={() => ref.current?.pause()} aria-label="Pause video" className={`${chip} w-9`}>
            <Pause className="w-4 h-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={toggleSound} aria-label={muted ? 'Turn sound on' : 'Mute video'} className={`${chip} px-3`}>
            {muted ? <VolumeX className="w-4 h-4" aria-hidden="true" /> : <Volume2 className="w-4 h-4" aria-hidden="true" />}
            {muted ? 'Sound on' : 'Mute'}
          </button>
        </div>
      )}
    </div>
  );
}
