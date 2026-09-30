// Remember the notice a visitor just analysed, so signing up continues WITH it (OB-09/18/21).
//
// The analyzer is honestecho.com and the app is pursuit.honestecho.com: sessionStorage and
// localStorage are per-origin and never reach the app, which is why the planned sessionStorage
// fix could not have worked. A cookie on `.honestecho.com` reaches both, and it survives the
// Google sign-in round trip. The app reads it once after the profile exists, makes the notice a
// pursuit, clears the cookie and opens it. It holds a public SAM.gov notice id — nothing else.
// Twin: HE-Pursuit dashboard/src/lib/pendingNotice.ts.
const NAME = 'he_pending_notice';

export function rememberPendingNotice(noticeId: string): void {
  if (!/^[0-9a-f]{32}$/.test(noticeId)) return;
  try {
    const shared = location.hostname === 'honestecho.com' || location.hostname.endsWith('.honestecho.com');
    // A day: long enough to read the result, look around and sign up later the same day.
    document.cookie = `${NAME}=${noticeId}; Max-Age=86400; Path=/; SameSite=Lax${shared ? '; Domain=.honestecho.com; Secure' : ''}`;
  } catch { /* cookies blocked: signup still works, the notice just is not carried */ }
}
