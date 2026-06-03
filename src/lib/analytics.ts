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
          properties:   props,
          source:       'website',
        }],
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* non-fatal — analytics must never break the page */
  }
}
