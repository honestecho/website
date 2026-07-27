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
      // gclid/gbraid/wbraid: Google Ads auto-tagging identifiers. Without them
      // ad clicks can't be joined to sessions and the paid test can't be
      // reconciled click-by-click (Codex, 2026-07-15). Keep ?src= as the
      // human-readable campaign tag; capture both.
      if (k === 'src' || k === 'promo' || k === 'gclid' || k === 'gbraid' || k === 'wbraid' || k.startsWith('utm_')) {
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

// First-touch external referrer (organic-vs-direct attribution). Captured once
// per session from document.referrer at the first tracked event, kept in
// sessionStorage so SPA navigation doesn't lose it. Same-site referrers are
// ignored (SPA hard-loads / internal navigation aren't a traffic source).
// Stored as hostname only — enough to distinguish google.com / bing.com /
// chatgpt.com / a backlink, with no URL payload to leak.
function getFirstTouchReferrer(): string {
  const KEY = 'he_referrer';
  try {
    const stored = sessionStorage.getItem(KEY);
    if (stored !== null) return stored; // '' = already checked, none/internal
    let host = '';
    if (document.referrer) {
      try {
        const refHost = new URL(document.referrer).hostname;
        if (refHost && refHost !== window.location.hostname) host = refHost;
      } catch { /* malformed referrer — treat as none */ }
    }
    sessionStorage.setItem(KEY, host);
    return host;
  } catch {
    return '';
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
          properties:   {
            ...getAttribution(),
            ...(getFirstTouchReferrer() ? { referrer: getFirstTouchReferrer() } : {}),
            ...props,
          },
          source:       'website',
        }],
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* non-fatal — analytics must never break the page */
  }
}
