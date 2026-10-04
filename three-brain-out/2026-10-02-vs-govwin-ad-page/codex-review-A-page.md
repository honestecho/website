1. **P1 — `src/pages/VsGovWin.tsx:26`** — FAQ still claims “commonly reported” five-figure GovWin pricing without a cited, reliable source, recreating the comparative-advertising risk this commit intended to remove. **Fix:** Delete that clause and state only that Deltek does not publish list pricing.

2. **P1 — `src/pages/Signup.tsx:71`** — Google OAuth adds `from` to analytics events but never persists it—or `getAttribution()`—to the Google user’s acquisition metadata, unlike email signup. **Fix:** Preserve attribution through the OAuth redirect and write it to user metadata in the callback.

3. **P2 — `src/pages/VsGovWin.tsx:57`** — Assertions that GovWin is “designed for large contractors,” “built for enterprise,” and intended for “large primes” are factual competitor-positioning claims presented without substantiation. **Fix:** Cite authoritative Deltek material or qualify the language as the company’s assessment.

4. **P2 — `src/pages/VsGovWin.tsx:227`** — “Based on Real Events,” the buyer-intent assertion, and “every small business” are sweeping, unverifiable claims that create avoidable false-advertising risk. **Fix:** Cite the solicitation and observed evidence, or rewrite as a clearly labeled hypothetical without categorical claims.
