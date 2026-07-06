// Site-wide analytics for honestecho.com.
//
// Posts to the same first-party endpoint the public SAM.gov analyzer already
// uses (/api/analytics/track on the HE Pursuit backend). No third-party tag,
// no GA/GTM, no cookie banner needed — events land in our own analytics_events
// table. Server shape: { events: [{ event_name, anonymous_id, page, properties,
// source }] }.

import { API_ORIGIN } from './api';

const ANALYTICS_API = `${API_ORIGIN}/api/analytics/track`;

function getAnonId(): string {
  const KEY = 'he_anon_id';
  try {
    let id = localStorage.getItem(KEY);
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(KEY, id); }
    return id;
  } catch {
    return 'unknown';
  }
}

// Campaign attribution (?src=apex-va, ?promo=..., ?utm_*=...). First-touch
// per session: the first campaign params seen win, kept in sessionStorage so
// SPA navigation doesn't lose them, and stamped onto every event's properties.
// Explicit event props take precedence on key collision.
function getAttribution(): Record<string, string> {
  const KEY = 'he_attribution';
  try {
    const stored = sessionStorage.getItem(KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, string>;
      }
    }
  } catch { /* fall through to URL capture */ }
  try {
    const params = new URLSearchParams(window.location.search);
    const captured: Record<string, string> = {};
    params.forEach((v, k) => {
      if (k === 'src' || k === 'promo' || k.startsWith('utm_')) {
        // Email clients sometimes fold trailing punctuation into the link
        // (e.g. a closing quote arrives as %22) — strip it so campaign codes
        // group cleanly.
        const clean = v.replace(/[\s"'.,;:)\]}>]+$/, '');
        if (clean) captured[k] = clean;
      }
    });
    if (Object.keys(captured).length === 0) return {};
    try { sessionStorage.setItem(KEY, JSON.stringify(captured)); } catch { /* still return captured */ }
    return captured;
  } catch {
    return {};
  }
}

export function track(event: string, props: Record<string, unknown> = {}): void {
  if (import.meta.env.DEV) { console.debug('[analytics]', event, props); return; }
  try {
    fetch(ANALYTICS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        events: [{
          event_name:   event,
          anonymous_id: getAnonId(),
          page:         window.location.pathname,
          properties:   { ...getAttribution(), ...props },
          source:       'website',
        }],
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* non-fatal — analytics must never break the page */
  }
}
