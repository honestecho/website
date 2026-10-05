1. **P1** — `src/lib/oauthReturn.ts:114` — Fix 4 is incomplete: client-writable, non-atomic `user_metadata.signup_reported` permits concurrent or deliberate duplicate conversions; deduplicate server-side with an atomic unique key on user ID.

2. **P1** — `src/lib/oauthReturn.ts:118` — Fix 5 is incomplete: `updateUser()` and `reportSignupConversion()` are awaited without timeouts, so a stalled request can prevent handoff indefinitely; enforce a bounded timeout and continue to pursuit.

3. **P2** — `src/lib/oauthReturn.ts:77` — Fix 1 deletes every `sb-*-auth-token` on the origin, potentially signing users out of unrelated Supabase projects; remove only this client’s configured storage key.

4. **P2** — `src/lib/oauthReturn.ts:77` — Direct storage deletion leaves the current client’s auto-refresh and listeners alive, allowing an in-flight refresh to persist the session again before unload; stop auto-refresh before deleting the exact key and redirecting.

Fixes 2 and 3 are confirmed. Fix 5’s delayed marker removal and exception handling are otherwise correct.
