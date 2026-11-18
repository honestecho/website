Reading additional input from stdin...
OpenAI Codex v0.170.0
--------
workdir: C:\Users\aaron\OneDrive\Mojo\Categories\6_Research_Lab\business-opportunity-discovery
model: gpt-6.1-sol
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 01a1ef73-a4fc-7d83-89dc-b93a2a91611d
--------
user
Review this diff per the brief at the top. Flag bugs, risks, missing tests. Be specific.

<stdin>
# Review brief — one ship's diff, Honest Echo website

Review ONLY the diff and the new data file below. Do not review the rest of the codebase; no sweep. This is the "other logic or data change" triage row: one review of this ship's diff.

## What the ship does

Adds a FAR Part 15 deep-dive page at `/far-overhaul/part-15/`. The page template already existed and already serves `/far-overhaul/part-19/`; adding a part normally means adding `src/content/far-parts/part-N.json` and nothing else. This ship adds that file plus three small code changes:

1. `src/lib/farParts.ts` — a new `renumbered` member on the `ChangeType` union, its `CHANGE_LABEL` entry, and a new optional `capture` field on the `PartDeepDive` interface.
2. `src/pages/FarPartPage.tsx` — a `DigestSignup` form component, rendered only when a part file carries `capture`. It POSTs to the existing `/api/contact` Cloudflare Pages function. One sentence of static copy was also genericized.
3. `scripts/check-far-data.mjs` — accepts the new change type.

## What I need you to attack, in priority order

1. **The `DigestSignup` form.** Honeypot handling, double-submit, error and success states, whether it can leak anything or mis-tag a submission. Specifically: it sends a FIXED string as `first_name` (`"FAR Part 15 digest"`), and the contact function interpolates `first_name` into the outgoing email subject. The function's source is included below as `context-contact-function.js` — check whether that interpolation is actually safe given the function's own escaping, and whether a user-controlled field could reach the subject or headers by another route.
2. **Whether the optional `capture` field can break the existing part-19 page or the prerender.** `part-19.json` has no `capture` key. The page is prerendered at build time and also hydrates client-side.
3. **Whether the new `ChangeType` member is handled everywhere the union is consumed** — the label map, the validator, and any exhaustive switch or `Record<ChangeType, ...>` that would now be incomplete or silently fall through.
4. **Accessibility** of the form: the `sr-only` label, the hidden honeypot input, disabled-button state, focus and error announcement.

## Already verified — do not re-report

`npm run build` passes end to end: the repo's `check-mojibake` and `check-far-data` validators, `tsc -b`, the Vite build, and prerender. `/far-overhaul/part-15` emits. The page was rendered locally and read back: title, canonical, og:title and h1 generate correctly, the status line populates, and `part-19` is unaffected in the build output.

## Explicitly out of scope

The factual accuracy of the JSON's claims about FAR Part 15 — that was verified separately against the primary texts on acquisition.gov. And anything outside these four files.

Be specific and concrete. For each finding give the file, the problem, why it bites, and the fix. Rank P0 / P1 / P2. If something is fine, say so briefly rather than padding.

---
## context-contact-function.js (existing endpoint, for concern 1)
```javascript
// Cloudflare Pages Function: POST /api/contact
//
// Self-contained website contact handler — no dependency on the Pursuit backend.
// Sends the submitted message to the ops inbox via Resend (honestecho.com is
// already a verified Resend sending domain).
//
// Required env var on the he-website Pages project:
//   RESEND_API_KEY  — Resend API key
// Optional:
//   CONTACT_INBOX   — recipient address (default: aaron.shivar@honestecho.com;
//   was info@, an unmonitored mailbox — a real lead would have rotted there.
//   Verified 2026-09-06: info@ held only unread DMARC reports.)
//
// Abuse posture: `to` and `from` are fixed (not user-controlled), so the worst
// case is spam to the ops inbox, not an open relay. Honeypot catches basic bots;
// add a Cloudflare rate-limiting rule on /api/contact for heavier protection.

const esc = (s, max) => String(s || '')
  .slice(0, max)
  .replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// HTML-escape AND strip CR/LF so name fields can't inject into the email subject.
const headerSafe = (s) => esc(s, 100).replace(/[\r\n]+/g, ' ').trim();

export async function onRequestPost({ request, env }) {
  const json = (status, obj) =>
    new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

  let body;
  try { body = await request.json(); } catch { body = {}; }
  const { first_name, last_name, email, message, honeypot } = body || {};

  // Honeypot → silent success (writes/sends nothing).
  if (honeypot && String(honeypot).trim().length > 0) return json(200, { success: true });

  if (!email || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return json(400, { success: false, message: 'Please enter a valid email address.' });
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return json(400, { success: false, message: 'Please include a message.' });
  }
  if (message.length > 4000) {
    return json(400, { success: false, message: 'Message is too long (4000 character max).' });
  }

  if (!env.RESEND_API_KEY) {
    return json(503, { success: false, message: "We couldn't send your message right now. Please email info@honestecho.com directly." });
  }

  const name      = `${headerSafe(first_name)} ${headerSafe(last_name)}`.trim() || '(no name given)';
  const safeEmail = esc(email.trim(), 254);
  const safeMsg   = esc(message.trim(), 4000).replace(/\n/g, '<br>');
  const inbox     = env.CONTACT_INBOX || 'aaron.shivar@honestecho.com';

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from:     'Honest Echo Website <noreply@honestecho.com>',
        to:       inbox,
        reply_to: email.trim(),
        subject:  `New contact form message from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333;">
            <h2 style="margin-bottom:4px;">New contact form submission</h2>
            <p style="margin:0 0 16px;color:#888;font-size:13px;">via honestecho.com/contact</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            <p><strong>Message:</strong></p>
            <div style="border-left:3px solid #00c3ff;padding:8px 14px;background:#f6fafd;border-radius:4px;">${safeMsg}</div>
          </div>`,
      }),
    });

    if (!r.ok) {
      return json(502, { success: false, message: "We couldn't send your message right now. Please email info@honestecho.com directly." });
    }
    return json(200, { success: true });
  } catch {
    return json(500, { success: false, message: 'Server error. Please email info@honestecho.com directly.' });
  }
}
```

=== MODIFIED (git diff) ===
diff --git a/scripts/check-far-data.mjs b/scripts/check-far-data.mjs
index f5f018a..842d8af 100644
--- a/scripts/check-far-data.mjs
+++ b/scripts/check-far-data.mjs
@@ -135,7 +135,7 @@ if (hit) fail(`banned word in data: "${hit[0]}"`);
 
 // ── Deep-dive files, one per FAR part (src/content/far-parts/part-N.json) ──────
 // Same rules: every source .gov/.mil, real dates, no markup, nothing private.
-const TYPES = new Set(['removed', 'narrowed', 'expanded', 'moved-to-guidance', 'unchanged-but-reworded', 'new']);
+const TYPES = new Set(['removed', 'narrowed', 'expanded', 'moved-to-guidance', 'unchanged-but-reworded', 'new', 'renumbered']);
 const partsDir = new URL('../src/content/far-parts/', import.meta.url);
 let partFiles = [];
 try { partFiles = readdirSync(partsDir).filter((f) => f.endsWith('.json')); } catch { /* no deep dives yet */ }
diff --git a/src/lib/farParts.ts b/src/lib/farParts.ts
index b2eb3c7..ab0e71f 100644
--- a/src/lib/farParts.ts
+++ b/src/lib/farParts.ts
@@ -5,7 +5,7 @@
 
 import { partByNumber } from './farApplicability';
 
-export type ChangeType = 'removed' | 'narrowed' | 'expanded' | 'moved-to-guidance' | 'unchanged-but-reworded' | 'new';
+export type ChangeType = 'removed' | 'narrowed' | 'expanded' | 'moved-to-guidance' | 'unchanged-but-reworded' | 'new' | 'renumbered';
 
 export interface PartChange {
   id: string; topic: string; subpart: string; before: string; after: string;
@@ -30,6 +30,8 @@ export interface PartDeepDive {
   agencyDates: { agency: string; short: string; date: string; basis: 'effective' | 'signature' | 'first date in memo'; sourceUrl: string }[];
   faq: { q: string; a: string }[];
   sources: { name: string; url: string }[];
+  /** Optional digest sign-up. Omit it and the page renders exactly as before. */
+  capture?: { heading: string; blurb: string; cta: string; tag: string; confirmation: string };
 }
 
 const files = import.meta.glob<PartDeepDive>('../content/far-parts/part-*.json', { eager: true, import: 'default' });
@@ -64,5 +66,7 @@ export const CHANGE_LABEL: Record<ChangeType, { label: string; cls: string }> =
   expanded: { label: 'Expanded', cls: 'border-[#00c3ff]/60 text-[#00c3ff]' },
   new: { label: 'New', cls: 'border-[#00c3ff]/60 text-[#00c3ff]' },
   'moved-to-guidance': { label: 'Moved to Guidance', cls: 'border-[#5b8cff]/60 text-[#9db7ff]' },
+  // Same rule, different citation: the section moved inside the FAR rather than out of it.
+  renumbered: { label: 'Renumbered', cls: 'border-[#c08cff]/60 text-[#c9a9ff]' },
   'unchanged-but-reworded': { label: 'Same Rule, New Words', cls: 'border-[#2a3b5c] text-[#a0b2c8]' },
 };
diff --git a/src/pages/FarPartPage.tsx b/src/pages/FarPartPage.tsx
index f090a9e..b4d6c2b 100644
--- a/src/pages/FarPartPage.tsx
+++ b/src/pages/FarPartPage.tsx
@@ -361,7 +361,7 @@ function PartBody({ dd }: { dd: PartDeepDive }) {
           <div className={`${card} p-6 md:p-8`}>
             <h2 className="font-headline font-bold text-white text-xl tracking-tight mb-3">Sources and method</h2>
             <p className="text-sm text-[#a0b2c8] font-body leading-relaxed mb-4">
-              Each change compares the current FAR Part {dd.part} with the FAR Council's rewritten model text, read on {fmtDate(dd.comparedOn)}. "What it means for you" is Honest Echo's reading, not regulatory text or legal advice. Changes marked medium confidence rest on what the rewrite leaves out, or on an SBA rule we could not fully reconcile; check the sources before relying on them. The status line at the top updates weekly with the tracker.
+              Each change compares the current FAR Part {dd.part} with the FAR Council's rewritten model text, read on {fmtDate(dd.comparedOn)}. "What it means for you" is Honest Echo's reading, not regulatory text or legal advice. Changes marked medium confidence rest on what the rewrite leaves out, or on a source we could not fully reconcile; check the sources before relying on them. The status line at the top updates weekly with the tracker.
             </p>
             <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
               {dd.sources.map(s => <li key={s.url}><Source href={s.url} label={s.name} /></li>)}
@@ -370,6 +370,8 @@ function PartBody({ dd }: { dd: PartDeepDive }) {
         </div>
       </section>
 
+      {dd.capture && <DigestSignup part={dd.part} c={dd.capture} />}
+
       <RelatedGuides current={path} />
 
       <section className="py-8 pb-24 px-6">
@@ -394,6 +396,90 @@ function PartBody({ dd }: { dd: PartDeepDive }) {
   );
 }
 
+// Posts to the existing /api/contact Pages function, so no new endpoint ships with this.
+// `tag` goes in first_name, which the function puts in the email subject: that is how
+// sign-ups are counted. Every accepted address gets the same answer, so the confirmation
+// copy must be true whether or not the send succeeded.
+function DigestSignup({ part, c }: { part: number; c: NonNullable<PartDeepDive['capture']> }) {
+  const [email, setEmail] = useState('');
+  const [honeypot, setHoneypot] = useState('');
+  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
+
+  async function submit(e: React.FormEvent) {
+    e.preventDefault();
+    if (state === 'sending') return;
+    setState('sending');
+    track('far_digest_subscribe_submitted', { part });
+    try {
+      const res = await fetch('/api/contact', {
+        method: 'POST',
+        headers: { 'Content-Type': 'application/json' },
+        body: JSON.stringify({
+          first_name: c.tag,
+          email: email.trim(),
+          message: `Digest sign-up from the FAR Part ${part} page (${c.tag}).`,
+          honeypot: honeypot || undefined,
+        }),
+      });
+      setState(res.ok ? 'done' : 'error');
+    } catch {
+      setState('error');
+    }
+  }
+
+  return (
+    <section className="py-8 px-6">
+      <div className="max-w-7xl mx-auto">
+        <div className={`${card} p-8 md:p-10`}>
+          <h2 className="font-headline font-bold text-white text-xl md:text-2xl tracking-tight">{c.heading}</h2>
+          <p className="text-sm text-[#a0b2c8] font-body leading-relaxed mt-2 max-w-3xl">{c.blurb}</p>
+          {state === 'done' ? (
+            <p className="mt-5 text-sm font-body text-[#7ee787] flex items-start gap-2">
+              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
+              {c.confirmation}
+            </p>
+          ) : (
+            <form onSubmit={submit} className="mt-5 flex flex-col sm:flex-row gap-3 max-w-xl">
+              <label htmlFor={`digest-email-${part}`} className="sr-only">Work email</label>
+              <input
+                id={`digest-email-${part}`}
+                type="email"
+                value={email}
+                onChange={e => setEmail(e.target.value)}
+                autoComplete="email"
+                required
+                placeholder="you@yourcompany.com"
+                className="flex-1 px-4 py-3 bg-[#060d1a] border border-[#1e2d4a] rounded-lg text-white font-body placeholder:text-[#5b6b85] focus:outline-none focus:border-[#00c3ff]/60"
+              />
+              <input
+                type="text"
+                tabIndex={-1}
+                autoComplete="off"
+                aria-hidden="true"
+                value={honeypot}
+                onChange={e => setHoneypot(e.target.value)}
+                className="hidden"
+              />
+              <button
+                type="submit"
+                disabled={state === 'sending'}
+                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg font-headline hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:hover:scale-100"
+              >
+                {state === 'sending' ? 'Sending...' : c.cta} <ArrowRight className="w-4 h-4" />
+              </button>
+            </form>
+          )}
+          {state === 'error' && (
+            <p className="mt-3 text-sm font-body text-[#ff8a8a]">
+              That didn't go through. Email info@honestecho.com and we'll add you by hand.
+            </p>
+          )}
+        </div>
+      </div>
+    </section>
+  );
+}
+
 function DateRow({ a, hidden }: { a: PartDeepDive['agencyDates'][number]; hidden: boolean }) {
   return (
     <tr hidden={hidden}>

=== NEW FILE: src/content/far-parts/part-15.json (data, schema-validated) ===
{
  "part": 15,
  "title": "Contracting by Negotiation",
  "comparedOn": "2026-11-18",
  "headline": "Part 15, rewritten. The section number in your proposal template may now point somewhere else.",
  "subhead": "The current rule and the rewrite, side by side, with every citation that changed meaning.",
  "description": "FAR Part 15 under the FAR overhaul: 15 changes for proposal and contracts managers, side by side with the current rule, including four pricing citations that mean something different in each version, the new highest-technically-rated approach, and which agencies have adopted it.",
  "shortVersion": [
    "Part 15 was reorganized from six subparts into five, and the section numbers moved with it. A citation in a proposal template, a compliance matrix or an internal SOP can now point at different text depending on which version governs the contract.",
    "Two pricing sections swap places exactly: 15.405 is Price negotiation today and Special cost or pricing areas in the rewrite, while 15.407 is Special cost or pricing areas today and Price negotiation in the rewrite. 15.403-1 changes from a prohibition into a data category.",
    "A third source selection approach is codified: highest technically rated with a fair and reasonable price. Tradeoff and LPTA are no longer the only named options, and the phrase \"best value continuum\" does not appear in the rewritten part at all.",
    "Until a final rule takes effect, the rewrite reaches a contract only through an agency's class deviation and the clauses in that contract. Part 15 is further along than most: a proposed rule was published 2026-09-18 and comments closed 2026-10-19."
  ],
  "codified": {
    "fac": "2026-01",
    "effective": "2026-03-13",
    "sourceUrl": "https://www.acquisition.gov/far/part-15"
  },
  "modelTextUpdates": [
    {
      "date": "2025-09-30",
      "what": "Model deviation text for Part 15 published. No supplement has been issued since.",
      "sourceUrl": "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15"
    }
  ],
  "dod": {
    "deviation": "2026-O0048",
    "signed": null,
    "effective": "2026-03-16",
    "revisionDate": null,
    "revisionSummary": "Revision 1, covering DFARS Part 215. Listed on DoD's class deviation page 2026-07-22. DoD is applying the overhaul through class deviations rather than DFARS rulemaking; no DFARS overhaul proposed rule has appeared in the Federal Register.",
    "sourceUrl": "https://www.acq.osd.mil/dpap/dars/classdev/DFARS_RFO/Part-215/2026-O0048_Rev_1_TAB_A_Deviation_Memo_Part_215.pdf"
  },
  "changes": [
    {
      "id": "pricing-15-405-and-15-407-swapped",
      "topic": "15.405 and 15.407 trade places",
      "subpart": "15.4",
      "before": "15.405 is \"Price negotiation\" and 15.407 is \"Special cost or pricing areas\" (with 15.407-1 defective certified cost or pricing data, 15.407-2 make-or-buy programs, 15.407-3 forward pricing rate agreements, 15.407-4 should-cost review, 15.407-5 estimating systems).",
      "after": "15.405 is \"Special cost or pricing areas\" (with 15.405-1 inaccurate, incomplete, or noncurrent cost or pricing data, 15.405-2 make-or-buy programs, 15.405-3 forward pricing rate agreements, 15.405-4 should-cost review) and 15.407 is \"Price negotiation.\" The two section numbers are exchanged.",
      "changeType": "renumbered",
      "whatItMeans": "This is the clearest reason to know which text governs a given contract. A citation to \"FAR 15.405\" in a proposal instruction, a compliance matrix, a subcontract flow-down or an internal pricing SOP resolves to price negotiation under the current FAR and to special cost or pricing areas under the rewrite. The citation is still valid in both; it just means something else. Search your templates for 15.405 and 15.407 and decide, per document, which version you intend.",
      "whoItHits": "Pricing analysts, proposal managers, anyone maintaining compliance matrices or subcontract templates",
      "confidence": "high",
      "sourceUrls": [
        "https://www.acquisition.gov/far/part-15",
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15"
      ]
    },
    {
      "id": "far-15-403-1-redefined",
      "topic": "15.403-1 changes from a prohibition into a data category",
      "subpart": "15.4",
      "before": "15.403-1 is \"Prohibition on obtaining certified cost or pricing data (10 U.S.C. chapter 271 and 41 U.S.C. chapter 35)\", and the requirement to seek data other than certified cost or pricing data sits separately at 15.403-3.",
      "after": "15.403-1 is \"Data other than certified cost or pricing data\", opening with an order of preference: \"For acquisitions that do not require certified cost or pricing data, contracting officers must generally use the following order of preference to determine the type of data to require: (1) No additional data from the offeror, when adequate price competition exists...\" The prohibitions move to 15.403-2.",
      "changeType": "renumbered",
      "whatItMeans": "A document that cites 15.403-1 to invoke the statutory prohibition is citing the data-preference section under the rewrite. If your proposal boilerplate asserts an exception by section number rather than by statute, check it. Citing the underlying statute (10 U.S.C. chapter 271, 41 U.S.C. chapter 35) survives both versions; citing the FAR subsection number does not.",
      "whoItHits": "Anyone claiming a certified cost or pricing data exception by citation",
      "confidence": "high",
      "sourceUrls": [
        "https://www.acquisition.gov/far/part-15",
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15"
      ]
    },
    {
      "id": "pricing-renumbering-cascade",
      "topic": "The rest of Subpart 15.4 renumbers around those two",
      "subpart": "15.4",
      "before": "15.402 Pricing policy; 15.404 Proposal analysis with 15.404-1 Proposal analysis techniques, 15.404-2 Data to support proposal analysis, 15.404-3 Subcontract pricing considerations, 15.404-4 Profit; 15.406 Documentation with 15.406-2 Certificate of Current Cost or Pricing Data; 15.408 Solicitation provisions and contract clauses.",
      "after": "15.402 General; 15.404 Cost and/or price analysis with price analysis, cost analysis, cost realism, technical analysis, unit prices, unbalanced pricing, pass-through, subcontract pricing and profit each as their own numbered section (15.404-1 through 15.404-9); 15.406 Data to support proposal analysis; 15.408 Documentation; the certificate moves to 15.403-4.",
      "changeType": "renumbered",
      "whatItMeans": "Subsections that lived inside 15.404-1 as lettered paragraphs are promoted to their own sections, so a cite like \"15.404-1(d) cost realism\" becomes \"15.404-3\". Four consecutive section numbers in this subpart mean different things across the two versions. Treat any Subpart 15.4 citation in a template as needing a version stamp.",
      "whoItHits": "Pricing analysts and proposal writers citing analysis techniques",
      "confidence": "high",
      "sourceUrls": [
        "https://www.acquisition.gov/far/part-15",
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15"
      ]
    },
    {
      "id": "htrfrp-new-approach",
      "topic": "A third source selection approach: highest technically rated with a fair and reasonable price",
      "subpart": "15.1",
      "before": "15.101 \"Best value continuum\" names two approaches: 15.101-1 Tradeoff process and 15.101-2 Lowest price technically acceptable.",
      "after": "15.103 \"Developing a competitive source selection approach\" names four: 15.103-1 Tradeoff, 15.103-2 LPTA, 15.103-3 Highest technically rated with a fair and reasonable price, and 15.103-4 Phased acquisition. On the new approach: it \"is appropriate when the Government determines in advance that it would not be advantageous to consider tradeoffs between cost or price and non-cost or non-price factors; rather, the acquisition warrants paying any fair and reasonable price for the highest quality performance.\"",
      "changeType": "new",
      "whatItMeans": "Where an agency has adopted the rewrite, expect solicitations that evaluate non-price factors first and then test only whether the top-rated proposal's price is fair and reasonable. Under that approach a lower price buys nothing. If your capture strategy assumes a tradeoff, confirm which approach the RFP names before pricing to win.",
      "whoItHits": "Capture and pricing strategy on any negotiated procurement",
      "confidence": "high",
      "sourceUrls": [
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15",
        "https://www.acquisition.gov/far/part-15"
      ]
    },
    {
      "id": "best-value-continuum-phrase-gone",
      "topic": "\"Best value continuum\" is gone as a term of art",
      "subpart": "15.1",
      "before": "15.101 is titled \"Best value continuum\" and frames the approaches as points along a continuum.",
      "after": "The phrase \"best value continuum\" does not appear anywhere in the rewritten Part 15. The framing section is 15.103, \"Developing a competitive source selection approach.\"",
      "changeType": "removed",
      "whatItMeans": "A proposal that argues best value by quoting the continuum is quoting language the rewrite does not contain. The underlying idea of tradeoffs survives at 15.103-1; the phrase and its section do not. Worth a search-and-replace in standard proposal narrative.",
      "whoItHits": "Proposal writers using stock best-value language",
      "confidence": "high",
      "sourceUrls": [
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15",
        "https://www.acquisition.gov/far/part-15"
      ]
    },
    {
      "id": "subparts-reorganized-six-to-five",
      "topic": "Six subparts become five, and a new Postaward subpart appears",
      "subpart": "15.0",
      "before": "15.1 Source Selection Processes and Techniques; 15.2 Solicitation and Receipt of Proposals and Information; 15.3 Source Selection; 15.4 Contract Pricing; 15.5 Preaward, Award, and Postaward Notifications, Protests, and Mistakes; 15.6 Unsolicited Proposals.",
      "after": "15.1 Presolicitation and Solicitation; 15.2 Evaluation and Award; 15.3 Postaward; 15.4 Contract Pricing; 15.5 Unsolicited Proposals.",
      "changeType": "renumbered",
      "whatItMeans": "Only Subpart 15.4 keeps both its number and its subject. Current 15.1 and 15.2 are merged into the new 15.1; current 15.3 becomes 15.2; current 15.5 is split, with preaward notices and debriefings landing at 15.206 and postaward matters forming a new Subpart 15.3; unsolicited proposals move from 15.6 to 15.5. A subpart-level cross-reference in an SOP is almost certainly pointing at the wrong subject now.",
      "whoItHits": "Anyone maintaining internal procedures keyed to Part 15 subparts",
      "confidence": "high",
      "sourceUrls": [
        "https://www.acquisition.gov/far/part-15",
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15"
      ]
    },
    {
      "id": "award-without-negotiation-split",
      "topic": "Discussions restructured into award with and without negotiation",
      "subpart": "15.2",
      "before": "15.306 \"Exchanges with offerors after receipt of proposals\" covers clarifications, communications, establishing the competitive range and discussions in a single section, with proposal revisions at 15.307.",
      "after": "Two parallel paths: 15.203 \"Competitive award without negotiation\" and 15.204 \"Competitive award with negotiation,\" the latter broken into 15.204-1 \"Establishing a competitive range\" and 15.204-2 \"Competitive negotiations.\"",
      "changeType": "renumbered",
      "whatItMeans": "The rewrite makes award without negotiation its own named path rather than a variation inside the exchanges section. Read the RFP for which path it declares, because it governs whether you should expect a competitive range and a revision opportunity at all. The competitive range concept survives: it appears 26 times in the rewritten part.",
      "whoItHits": "Proposal managers planning for discussions and final proposal revisions",
      "confidence": "high",
      "sourceUrls": [
        "https://www.acquisition.gov/far/part-15",
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15"
      ]
    },
    {
      "id": "debriefings-split-with-followup",
      "topic": "Debriefings split across two subparts, with follow-up questions named",
      "subpart": "15.2",
      "before": "15.505 Preaward debriefing of offerors and 15.506 Postaward debriefing of offerors, both inside Subpart 15.5.",
      "after": "Preaward debriefing moves to 15.206-2, inside the award subpart. Postaward debriefing opens the new Subpart 15.3 at 15.301, with 15.301-1 \"Debriefing process\" and 15.301-2 \"Opportunity for follow-up questions\" as separate subsections.",
      "changeType": "expanded",
      "whatItMeans": "A follow-up question opportunity gets its own subsection rather than being buried in debriefing procedure. If you request a debriefing under a contract governed by the rewrite, cite 15.301 rather than 15.506, and plan for the follow-up round as a defined step.",
      "whoItHits": "Anyone requesting a debriefing or considering a protest",
      "confidence": "high",
      "sourceUrls": [
        "https://www.acquisition.gov/far/part-15",
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15"
      ]
    },
    {
      "id": "ucf-renumbered",
      "topic": "Uniform contract format renumbered",
      "subpart": "15.1",
      "before": "15.204 Contract format, with 15.204-1 Uniform contract format and 15.204-2 through 15.204-5 for Parts I to IV.",
      "after": "15.109 Uniform contract format, with 15.109-1 through 15.109-4 for Parts I to IV. Note that 15.204 now means \"Competitive award with negotiation\" in the rewrite.",
      "changeType": "renumbered",
      "whatItMeans": "Another live citation collision. \"FAR 15.204\" means contract format today and competitive award with negotiation under the rewrite. Section L and M references built on the 15.204 family need checking.",
      "whoItHits": "Proposal managers and anyone citing Sections L and M structure",
      "confidence": "high",
      "sourceUrls": [
        "https://www.acquisition.gov/far/part-15",
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15"
      ]
    },
    {
      "id": "advisory-multistep-removed",
      "topic": "Advisory multi-step process is not carried over",
      "subpart": "15.1",
      "before": "15.202 \"Advisory multi-step process\" lets an agency publish a presolicitation notice, take limited information, and advise respondents whether they are likely to be viable competitors.",
      "after": "No section titled \"Advisory multi-step process\" appears in the rewritten Part 15, and the phrase \"advisory multi-step\" does not appear in its text. Early industry engagement is consolidated at 15.101 \"Early exchanges with industry.\"",
      "changeType": "removed",
      "whatItMeans": "The named advisory down-select procedure is gone from the part. That does not necessarily mean agencies cannot run one under other authority, and some of the function may be intended to sit inside early exchanges. Treat the removal of the section as established and the practical effect as open, which is why this item is marked medium.",
      "whoItHits": "Firms relying on advisory down-selects to decide whether to bid",
      "confidence": "medium",
      "sourceUrls": [
        "https://www.acquisition.gov/far/part-15",
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15"
      ]
    },
    {
      "id": "tiered-evaluation-reworded",
      "topic": "Tiered evaluation prohibition reworded and renumbered",
      "subpart": "15.1",
      "before": "15.101-3 \"Tiered evaluation of small business offers\": \"An agency shall not create a tiered (or 'cascading') evaluation of offers, as described in 13 CFR 125.2, for multiple-award contracts unless an agency has statutory authority.\"",
      "after": "15.105-3 \"Limitation on tiered evaluations for multiple award contracts\": \"When soliciting for a multiple award contract, agencies must not create a tiered or cascading evaluation of small business offers, as described in 13 CFR 125.2, unless the agency has statutory authority to do so.\"",
      "changeType": "unchanged-but-reworded",
      "whatItMeans": "The substance looks the same, with the qualifier moved: the current title says small business offers while its text says offers generally, and the rewrite reverses that. The real change is the citation, 15.101-3 to 15.105-3. Do not read a narrowing into this without counsel; read it as a renumbering.",
      "whoItHits": "Small businesses bidding multiple-award vehicles",
      "confidence": "high",
      "sourceUrls": [
        "https://www.acquisition.gov/far/part-15",
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15",
        "https://www.ecfr.gov/current/title-13/section-125.2"
      ]
    },
    {
      "id": "lpta-dod-carveout",
      "topic": "LPTA limitations carry an explicit DoD carve-out",
      "subpart": "15.1",
      "before": "15.101-2 Lowest price technically acceptable source selection process, with limitations in agency supplements and statute.",
      "after": "15.103-2(c) Limitations opens \"Except for DoD, in accordance with section 880 of the John S. McCain National Defense Authorization Act for Fiscal Year 2019 (Pub. L. 115-232, 41 U.S.C. ...)\" placing the statutory LPTA restrictions in the FAR text itself with DoD treated separately.",
      "changeType": "expanded",
      "whatItMeans": "The LPTA restrictions are stated in the part rather than left to supplements, and DoD is carved out because its own statute governs. If you are bidding a DoD LPTA procurement, the limitation analysis runs through section 880 rather than through this section.",
      "whoItHits": "Anyone bidding LPTA, especially at DoD",
      "confidence": "high",
      "sourceUrls": [
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15"
      ]
    },
    {
      "id": "estimating-systems-moved-postaward",
      "topic": "Estimating systems moves out of pricing into Postaward",
      "subpart": "15.3",
      "before": "15.407-5 Estimating systems, inside Subpart 15.4 Contract Pricing.",
      "after": "15.305 Estimating systems, inside the new Subpart 15.3 Postaward.",
      "changeType": "renumbered",
      "whatItMeans": "A contractor business-systems citation keyed to 15.407-5 points at forward pricing rate agreements under the rewrite. Check any business-systems compliance reference.",
      "whoItHits": "Contractors with CAS-covered or large-business estimating systems",
      "confidence": "high",
      "sourceUrls": [
        "https://www.acquisition.gov/far/part-15",
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15"
      ]
    },
    {
      "id": "defective-data-moved-postaward",
      "topic": "Defective certified cost or pricing data moves to Postaward",
      "subpart": "15.3",
      "before": "15.407-1 Defective certified cost or pricing data, inside Contract Pricing.",
      "after": "15.304 Defective certified cost or pricing data, inside the new Subpart 15.3 Postaward. A related section, 15.405-1, covers inaccurate, incomplete, or noncurrent cost or pricing data.",
      "changeType": "renumbered",
      "whatItMeans": "Defective pricing is reframed as a postaward matter. Two sections now sit near this subject, 15.304 and 15.405-1, so cite the one matching your facts rather than the old single reference.",
      "whoItHits": "Anyone exposed to a defective pricing claim",
      "confidence": "high",
      "sourceUrls": [
        "https://www.acquisition.gov/far/part-15",
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15"
      ]
    },
    {
      "id": "unsolicited-proposals-renumbered",
      "topic": "Unsolicited proposals renumbered and restructured",
      "subpart": "15.5",
      "before": "Subpart 15.6, sections 15.600 to 15.609, including 15.602 Policy, 15.604 Agency points of contact, 15.608 Prohibitions and 15.609 Limited use of data.",
      "after": "Subpart 15.5, sections 15.500 to 15.506. Data restrictions are handled at 15.503-3 \"Restricting use and disclosure of data\" and 15.504-2 \"Handling use and disclosure of data restrictions.\" No separate Policy or Agency points of contact section appears.",
      "changeType": "renumbered",
      "whatItMeans": "If you submit unsolicited proposals, the data-restriction legend practice is now addressed in two sections in a different subpart. Update the citation on your restrictive legends and your cover sheets.",
      "whoItHits": "Firms submitting unsolicited proposals or white papers",
      "confidence": "high",
      "sourceUrls": [
        "https://www.acquisition.gov/far/part-15",
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15"
      ]
    }
  ],
  "unchanged": [
    {
      "topic": "Tradeoff remains an available approach",
      "detail": "The tradeoff approach survives, renumbered from 15.101-1 to 15.103-1. What changed is its framing: it is one of four named approaches rather than a point on a best value continuum.",
      "currentCite": "15.101-1",
      "rfoCite": "15.103-1",
      "sourceUrls": [
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15"
      ]
    },
    {
      "topic": "The competitive range survives",
      "detail": "The competitive range is not abolished. The phrase appears 26 times in the rewritten part, and it has its own section at 15.204-1, \"Establishing a competitive range.\"",
      "currentCite": "15.306(c)",
      "rfoCite": "15.204-1",
      "sourceUrls": [
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15"
      ]
    },
    {
      "topic": "Contract Pricing stays at Subpart 15.4",
      "detail": "Subpart 15.4 is the only subpart that keeps both its number and its subject. Its internal sections renumber extensively, which is what makes it the most dangerous subpart to cite without a version stamp.",
      "currentCite": "15.4",
      "rfoCite": "15.4",
      "sourceUrls": [
        "https://www.acquisition.gov/far/part-15"
      ]
    },
    {
      "topic": "Oral presentations survive",
      "detail": "Renumbered from 15.102 to 15.105-1, where they sit under \"Other considerations\" alongside negotiations disclosure, tiered evaluation limits and cost or pricing data requests.",
      "currentCite": "15.102",
      "rfoCite": "15.105-1",
      "sourceUrls": [
        "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15"
      ]
    }
  ],
  "actions": [
    {
      "action": "Search every proposal template, compliance matrix and pricing SOP for the strings 15.405, 15.407, 15.403-1 and 15.204, and stamp each hit with the version you mean.",
      "changeId": "pricing-15-405-and-15-407-swapped"
    },
    {
      "action": "Replace citation-based cost or pricing data exceptions with statutory citations (10 U.S.C. chapter 271, 41 U.S.C. chapter 35), which survive both versions.",
      "changeId": "far-15-403-1-redefined"
    },
    {
      "action": "Before pricing to win, confirm which of the four source selection approaches the RFP names. Under highest technically rated with a fair and reasonable price, a lower price buys nothing.",
      "changeId": "htrfrp-new-approach"
    },
    {
      "action": "Remove stock \"best value continuum\" language from proposal narrative; the phrase does not appear in the rewritten part.",
      "changeId": "best-value-continuum-phrase-gone"
    },
    {
      "action": "Re-point debriefing request letters from 15.506 to 15.301, and plan for the follow-up question round as a defined step.",
      "changeId": "debriefings-split-with-followup"
    },
    {
      "action": "Update restrictive legends and cover sheets on unsolicited proposals to the 15.503-3 and 15.504-2 citations.",
      "changeId": "unsolicited-proposals-renumbered"
    },
    {
      "action": "Check your contract's clauses and modifications, not just your agency's adoption. Agency adoption alone does not change an awarded contract.",
      "changeId": "subparts-reorganized-six-to-five"
    }
  ],
  "agencyDates": [
    {
      "agency": "Department of Defense",
      "short": "DoD",
      "date": "2026-03-16",
      "basis": "effective",
      "sourceUrl": "https://www.acq.osd.mil/dpap/dars/classdev/DFARS_RFO/Part-215/2026-O0048_Rev_1_TAB_A_Deviation_Memo_Part_215.pdf"
    }
  ],
  "faq": [
    {
      "q": "Which version governs my contract right now?",
      "a": "Your contract's clauses and modifications govern, not the newest text. No final rule for Part 15 was located; a proposed rule was published 2026-09-18 and comments closed 2026-10-19. Until a final rule takes effect, the rewrite reaches a contract only through an agency's class deviation and the clauses actually in that contract. Two agencies can be running two different Part 15 texts at the same time."
    },
    {
      "q": "How many agencies have adopted the Part 15 rewrite?",
      "a": "32 of the 40 agencies with class deviations posted on acquisition.gov's deviation guide list Part 15. That count comes from this site's FAR Overhaul tracker data as verified 2026-11-09, so treat it as a reading from that date rather than from today."
    },
    {
      "q": "What is the single most expensive mistake here?",
      "a": "Citing a Part 15 section number in a proposal or template without recording which version you mean. 15.405 and 15.407 swap places, 15.403-1 changes subject, and 15.204 changes from contract format to competitive award with negotiation. The citation stays valid in both versions and silently means something else."
    },
    {
      "q": "Did LPTA go away?",
      "a": "No. It moved from 15.101-2 to 15.103-2 and gained an explicit limitations paragraph that carves out DoD, whose LPTA restrictions run through section 880 of the FY2019 NDAA."
    },
    {
      "q": "Is the new highest-technically-rated approach good or bad for a small business?",
      "a": "It depends on where you compete. If you win on technical quality and lose on price, it helps, because price only has to be fair and reasonable. If your advantage is price, it removes your lever entirely. Either way, find out which approach the RFP names before you build a price strategy."
    }
  ],
  "sources": [
    {
      "name": "Current FAR Part 15, acquisition.gov",
      "url": "https://www.acquisition.gov/far/part-15"
    },
    {
      "name": "FAR overhaul model deviation text, Part 15",
      "url": "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-15"
    },
    {
      "name": "Proposed rule, FAR Parts 8, 12, 13, 15, 38, 44, 51 (2026-19162, published 2026-09-18, comments closed 2026-10-19)",
      "url": "https://www.federalregister.gov/documents/2026/09/18/2026-19162/federal-acquisition-regulation-revolutionary-far-overhaul-parts-8-12-13-15-38-44-and-51"
    },
    {
      "name": "FAR part deviation guide index",
      "url": "https://www.acquisition.gov/far-overhaul/far-part-deviation-guide"
    },
    {
      "name": "DoD class deviation 2026-O0048 Rev 1, DFARS Part 215",
      "url": "https://www.acq.osd.mil/dpap/dars/classdev/DFARS_RFO/Part-215/2026-O0048_Rev_1_TAB_A_Deviation_Memo_Part_215.pdf"
    },
    {
      "name": "DoD FAR overhaul class deviations list",
      "url": "https://www.acq.osd.mil/dpap/dars/dfars_far_overhaul_class_deviations.html"
    },
    {
      "name": "13 CFR 125.2, tiered evaluation reference",
      "url": "https://www.ecfr.gov/current/title-13/section-125.2"
    }
  ],
  "capture": {
    "heading": "Get the Part 15 change digest",
    "blurb": "One email when a Part 15 citation changes meaning, when another agency adopts the rewrite, or when a final rule lands. Written from the primary text, with a source link on every line.",
    "cta": "Send me the digest",
    "tag": "FAR Part 15 digest",
    "confirmation": "You're on the list. The next one goes out when something in Part 15 actually changes, not on a schedule."
  }
}
</stdin>
codex
I’ll review the supplied diff and endpoint context for form failures, injection paths, hydration risks, and accessibility, without expanding into the rest of the codebase.
codex
Two P2 findings. No P0/P1 issue is established by the supplied diff.

1. **P2 — Failed sign-ups direct users to an explicitly unmonitored inbox.**  
   **File:** `src/pages/FarPartPage.tsx`, `DigestSignup` error paragraph.  
   Every HTTP or network failure tells the visitor to email `info@honestecho.com`. The endpoint context explicitly identifies that inbox as unmonitored. A failed submission followed by the prescribed recovery can therefore lose the sign-up entirely.

   **Fix:** Point the fallback at the monitored address identified in the endpoint context, `aaron.shivar@honestecho.com`. For validation failures, display an appropriate validation message so visitors can correct their submission.

   **Missing test:** Mock a non-2xx response and a rejected fetch; verify the monitored fallback appears and retry remains available.

2. **P2 — Submission results are not announced, and success removes the focused control.**  
   **File:** `src/pages/FarPartPage.tsx`, `DigestSignup` success/error rendering.  
   Neither result has a live-region role. On failure, a screen-reader user receives no reliable announcement. On success, the entire form disappears, removing whichever input or button held focus, without moving focus to the confirmation. The user can lose their position without hearing whether submission succeeded.

   **Fix:** Keep a persistent `role="status"` region for submission progress and success, and announce errors with `role="alert"`. When replacing the form, deliberately manage focus—for example, focus a confirmation container with `tabIndex={-1}`.

   **Missing test:** Verify accessible result announcements and focus after success, plus error announcement and retry after failure.

The other requested checks look sound within the supplied material:

- **Subject/header injection:** `c.tag` comes from the shipped JSON. Even a forged request supplying arbitrary names passes through `headerSafe`, which explicitly removes CR/LF. HTML escaping alone would not provide that protection; the newline removal does. The only user-controlled address header, `reply_to`, uses an email value whose validation rejects whitespace, including CR/LF. No demonstrated header-injection path exists here.
- **Leakage and tagging:** The request uses the expected fixed tag, and the shown analytics event carries only `part`, not the email address.
- **Honeypot:** A populated value reaches the endpoint’s silent-success branch. The UI consequently shows confirmation without sending mail, as intended. The hidden input is also removed from keyboard navigation and the accessibility tree.
- **Double-submit:** The disabled button and `sending` guard cover ordinary repeated user submission. Add a delayed-response regression test asserting one request while pending.
- **Optional capture:** An absent `capture` skips mounting the component. Its initial state is deterministic, with no browser-only access during rendering; no hydration mismatch is apparent.
- **Change type:** Both shown consumers—the label map and validator—include `renumbered`. Other exhaustive switches cannot be assessed from this diff alone.
- **Label:** The `sr-only` label is correctly associated with the email input.

Additional useful regression coverage: assert the exact tag and trimmed email payload, honeypot silent success, and conditional rendering with and without `capture`.
tokens used
21,466
Two P2 findings. No P0/P1 issue is established by the supplied diff.

1. **P2 — Failed sign-ups direct users to an explicitly unmonitored inbox.**  
   **File:** `src/pages/FarPartPage.tsx`, `DigestSignup` error paragraph.  
   Every HTTP or network failure tells the visitor to email `info@honestecho.com`. The endpoint context explicitly identifies that inbox as unmonitored. A failed submission followed by the prescribed recovery can therefore lose the sign-up entirely.

   **Fix:** Point the fallback at the monitored address identified in the endpoint context, `aaron.shivar@honestecho.com`. For validation failures, display an appropriate validation message so visitors can correct their submission.

   **Missing test:** Mock a non-2xx response and a rejected fetch; verify the monitored fallback appears and retry remains available.

2. **P2 — Submission results are not announced, and success removes the focused control.**  
   **File:** `src/pages/FarPartPage.tsx`, `DigestSignup` success/error rendering.  
   Neither result has a live-region role. On failure, a screen-reader user receives no reliable announcement. On success, the entire form disappears, removing whichever input or button held focus, without moving focus to the confirmation. The user can lose their position without hearing whether submission succeeded.

   **Fix:** Keep a persistent `role="status"` region for submission progress and success, and announce errors with `role="alert"`. When replacing the form, deliberately manage focus—for example, focus a confirmation container with `tabIndex={-1}`.

   **Missing test:** Verify accessible result announcements and focus after success, plus error announcement and retry after failure.

The other requested checks look sound within the supplied material:

- **Subject/header injection:** `c.tag` comes from the shipped JSON. Even a forged request supplying arbitrary names passes through `headerSafe`, which explicitly removes CR/LF. HTML escaping alone would not provide that protection; the newline removal does. The only user-controlled address header, `reply_to`, uses an email value whose validation rejects whitespace, including CR/LF. No demonstrated header-injection path exists here.
- **Leakage and tagging:** The request uses the expected fixed tag, and the shown analytics event carries only `part`, not the email address.
- **Honeypot:** A populated value reaches the endpoint’s silent-success branch. The UI consequently shows confirmation without sending mail, as intended. The hidden input is also removed from keyboard navigation and the accessibility tree.
- **Double-submit:** The disabled button and `sending` guard cover ordinary repeated user submission. Add a delayed-response regression test asserting one request while pending.
- **Optional capture:** An absent `capture` skips mounting the component. Its initial state is deterministic, with no browser-only access during rendering; no hydration mismatch is apparent.
- **Change type:** Both shown consumers—the label map and validator—include `renumbered`. Other exhaustive switches cannot be assessed from this diff alone.
- **Label:** The `sr-only` label is correctly associated with the email input.

Additional useful regression coverage: assert the exact tag and trimmed email payload, honeypot silent success, and conditional rendering with and without `capture`.
