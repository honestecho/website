1. **P1 — `src/lib/oauthReturn.ts:52`** — The bridge copies a rotating refresh token into pursuit while the same token remains persisted on honestecho.com; either client can later reuse an obsolete token and trigger session revocation, potentially signing the user out of both sites.  
   Fix: Use a server-issued, single-use handoff code redeemed by pursuit instead of transferring access/refresh tokens.

2. **P1 — `src/lib/oauthReturn.ts:28`** — `sessionStorage.setItem` failure is silently ignored, yet OAuth still redirects to `/welcome`; the callback then appears “no-pending,” leaving the user signed into the website but never handed to pursuit.  
   Fix: Abort OAuth startup when the marker cannot be stored, or include a verifiable callback marker that does not depend solely on sessionStorage.

3. **P1 — `src/lib/oauthReturn.ts:36`** — The pending marker has no timestamp or callback binding; abandoning consent leaves it stuck, so a later ordinary `/welcome` visit can bridge an unrelated persisted session and potentially record attribution/conversion.  
   Fix: Store a nonce and expiry, validate them against the actual OAuth callback, and clear abandoned attempts when signup is revisited.

4. **P1 — `src/lib/oauthReturn.ts:89`** — “Created within ten minutes” does not prove this exchange created the account; a newly created email user or a second Google login within that window is counted again as a Google signup and emits the first-party event twice.  
   Fix: Determine creation from an authoritative server-side OAuth result and atomically record a per-user signup-conversion marker.

5. **P2 — `src/lib/oauthReturn.ts:79`** — `takeOAuthPending()` deletes retry state before session acquisition and all later work; a transient auth, metadata, analytics, or navigation failure falls through to the ordinary Welcome page with a website session but no pursuit handoff.  
   Fix: Retain the pending state until pursuit handoff succeeds, with bounded retries and an explicit “Continue to Pursuit” recovery action.
