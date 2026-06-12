import React, { useRef, useState, useEffect } from 'react';

/**
 * Scroll-triggered fly-in animation.
 *
 * SSR/pre-render safe: initial state is 'ssr' (fully visible) so the
 * pre-rendered HTML shows all content. After mount the browser decides:
 * - element already in viewport → stays visible immediately
 * - element below the fold → briefly transitions to hidden while off-screen,
 *   then animates in when the user scrolls to it
 *
 * This means crawlers and users without JS always see the full content,
 * and the animation still works for below-fold elements.
 */
export default function FlyIn({
  children,
  delay = '',
  className = '',
  alwaysAnimate = false,
}: {
  children: React.ReactNode;
  delay?: string;
  className?: string;
  alwaysAnimate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // 'ssr'     — initial state, matches server render (content visible)
  // 'hidden'  — below the fold after mount, waiting for scroll
  // 'visible' — in viewport, fully shown
  const [state, setState] = useState<'ssr' | 'hidden' | 'visible'>('ssr');

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setState('visible');
      return;
    }

    // Respect reduced-motion: never hide content to animate it back in.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState('visible');
      return;
    }

    // Elements already in or near the viewport show immediately —
    // unless alwaysAnimate forces the scroll-triggered fly-in.
    if (!alwaysAnimate) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.05) {
        setState('visible');
        return;
      }
    }

    // Below-fold elements get hidden and animated in on scroll
    setState('hidden');
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setState('visible'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const visibilityClass =
    state === 'hidden' ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0';

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${delay} ${visibilityClass} ${className}`}
    >
      {children}
    </div>
  );
}
