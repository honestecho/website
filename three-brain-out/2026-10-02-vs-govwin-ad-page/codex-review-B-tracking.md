1. **P1 — `src/pages/Signup.tsx:94`** — Google OAuth is counted as a completed signup before authentication or account creation; cancellations, failures, and repeated attempts produce false conversions. **Fix:** fire the conversion from the OAuth callback only after confirming a newly created/authenticated account.

2. **P1 — `src/lib/googleAds.ts:49`** — `transport_type: 'beacon'` does not protect an event still queued while `gtag.js` is loading; immediate navigation can discard it before Google processes the queue. **Fix:** expose tag readiness and navigate only after `event_callback`, with a short timeout fallback; use `skipBrowserRedirect` for OAuth.

3. **P2 — `src/pages/Signup.tsx:144`** — A successful Supabase `signUp()` response does not necessarily prove a new account was created because existing-user enumeration protection can return an obfuscated success, causing false or duplicate conversions. **Fix:** confirm creation server-side or validate the returned identity before reporting conversion.

4. **P2 — `src/lib/googleAds.ts:49`** — Conversion events have no `transaction_id`, so retries, double submissions, or callback replays can be counted more than once depending on the conversion action’s counting configuration. **Fix:** send a stable, non-PII signup/account identifier as `transaction_id`.

5. **P2 — `src/lib/googleAds.ts:23`** — Attribution eligibility depends entirely on the landing query or JavaScript-readable `_gcl_*` cookies; Safari ITP or cookie clearing can make a later genuine paid signup skip the tag entirely. **Fix:** persist the click identifier server-side and submit an offline/server-side conversion when the browser cookie is unavailable.

6. **P3 — `src/pages/Privacy.tsx:52`** — “Visitors who did not arrive from an ad never load it” is inaccurate because a later direct visit with a previously stored `_gcl_*` cookie loads the tag. **Fix:** say it loads for visitors with a current or previously stored Google Ads click identifier.

7. **P3 — `public/_headers:7`** — The CSP unnecessarily trusts broad script origins and every `*.doubleclick.net` connect endpoint. **Fix:** retain only observed required script hosts and replace the wildcard with explicit Google Ads collection hosts.
