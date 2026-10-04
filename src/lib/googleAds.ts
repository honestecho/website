// Google Ads conversion tag (gtag.js) for honestecho.com.
//
// The site's own analytics stay first-party (lib/analytics.ts). This is the one
// third-party tag, and it loads ONLY for a visitor who arrived by clicking one
// of our Google ads (gclid/gbraid/wbraid on the landing URL, or the click
// cookie the tag set on an earlier visit). Everyone else never loads it.
// Ad personalization / remarketing signals are off: the tag exists to tell
// Google Ads that a paid click became a signup, nothing else.

const AW_ID = 'AW-18393164010';
// Conversion label of the "Website signup" conversion action in Google Ads
// (Goals > Conversions, conversion type ID 7819677265, created 2026-10-04).
const SIGNUP_LABEL = 'MGGeCNGc25AdEOrRxcJE';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function cameFromAdClick(): boolean {
  const params = new URLSearchParams(window.location.search);
  if (params.has('gclid') || params.has('gbraid') || params.has('wbraid')) return true;
  return /(?:^|;\s*)_gcl_(?:aw|gb)=/.test(document.cookie);
}

export function initGoogleAds(): void {
  if (window.gtag || !cameFromAdClick()) return;
  window.dataLayer = window.dataLayer || [];
  // gtag.js reads the queued `arguments` objects, so this cannot be an arrow fn.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', AW_ID, { allow_ad_personalization_signals: false });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${AW_ID}`;
  document.head.appendChild(s);
}

// Call only once an account really exists, and await it before navigating
// away: the event can still be queued behind gtag.js loading, and a redirect
// would drop it. Resolves on Google's event_callback, or after 1s so a blocked
// or slow tag never holds up the signup. transaction_id (the new user's id)
// lets Google drop a repeat of the same signup.
export function reportSignupConversion(transactionId: string): Promise<void> {
  if (!window.gtag) return Promise.resolve();
  return new Promise(resolve => {
    const timer = setTimeout(resolve, 1000);
    window.gtag!('event', 'conversion', {
      send_to: `${AW_ID}/${SIGNUP_LABEL}`,
      transaction_id: transactionId,
      transport_type: 'beacon',
      event_callback: () => { clearTimeout(timer); resolve(); },
    });
  });
}
