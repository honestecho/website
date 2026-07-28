Reading additional input from stdin...
OpenAI Codex v0.136.0
--------
workdir: C:\Users\aaron\OneDrive\Honest Echo LLC\Antigravity\HE Website - 1
model: gpt-5.5
provider: openai
approval: never
sandbox: read-only
reasoning effort: none
reasoning summaries: none
session id: 019e8dae-3d07-7b92-86ac-684bd5beafd7
--------
user
Review this diff spanning two repos (a React/Vite marketing site and its Node/Express backend api-server.js). This is going to production for a paid marketing launch. Find bugs, security holes, and launch-breakers. Be specific and cite the hunk. PRIORITIZE: (1) the Content-Security-Policy in public/_headers — will it break Google Fonts (fonts.googleapis.com/fonts.gstatic.com), Supabase auth (pnvvwlyyhrifovrsimzy.supabase.co), the OAuth redirect to Google, or fetch() calls to he-pursuit-api.onrender.com? Is anything missing from connect-src/style-src/script-src? (2) the NEW POST /api/public/contact endpoint — header/HTML injection via replyTo or fields, abuse/spam vectors, the honeypot/rate-limit logic, error leakage. (3) Does the analytics track() ever throw and break a page? (4) Any place the centralized API_BASE breaks an existing working call. Output: numbered findings, each tagged BLOCKER / SHOULD-FIX / NIT, with the fix.

<stdin>
############## FRONTEND REPO: HE Website - 1 ##############
diff --git a/public/_headers b/public/_headers
index 2d74e76..a4108ad 100644
--- a/public/_headers
+++ b/public/_headers
@@ -3,3 +3,5 @@
   X-Content-Type-Options: nosniff
   Referrer-Policy: strict-origin-when-cross-origin
   Permissions-Policy: camera=(), microphone=(), geolocation=()
+  Strict-Transport-Security: max-age=31536000; includeSubDomains
+  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://he-pursuit-api.onrender.com https://pnvvwlyyhrifovrsimzy.supabase.co https://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; object-src 'none'
diff --git a/src/App.tsx b/src/App.tsx
index 9667669..cba5893 100644
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -21,6 +21,7 @@ import SharedPackage from './pages/SharedPackage';
 import TeamWaitlist from './pages/TeamWaitlist';
 import NotFound from './pages/NotFound';
 import { OrganizationSchema } from './components/SchemaOrg';
+import { track } from './lib/analytics';
 
 function ScrollToTop() {
   const { pathname } = useLocation();
@@ -29,6 +30,12 @@ function ScrollToTop() {
   return null;
 }
 
+function PageViews() {
+  const { pathname } = useLocation();
+  useEffect(() => { track('page_viewed', { path: pathname }); }, [pathname]);
+  return null;
+}
+
 function App() {
   return (
     <div className="min-h-screen flex flex-col bg-[#030B17] relative">
@@ -44,6 +51,7 @@ function App() {
       </div>
       <OrganizationSchema />
       <ScrollToTop />
+      <PageViews />
       <Navbar />
       <main className="flex-grow relative z-10">
         <Routes>
diff --git a/src/components/SchemaOrg.tsx b/src/components/SchemaOrg.tsx
index 84920f4..c5443f4 100644
--- a/src/components/SchemaOrg.tsx
+++ b/src/components/SchemaOrg.tsx
@@ -57,14 +57,14 @@ export function SoftwareApplicationSchema() {
         name: 'Starter',
         price: '99',
         priceCurrency: 'USD',
-        description: 'Full bid/no-bid workflow, 25 evaluations/month',
+        description: 'Full bid/no-bid workflow, 25 pursuits/month',
       },
       {
         '@type': 'Offer',
         name: 'Pro',
         price: '199',
         priceCurrency: 'USD',
-        description: 'Unlimited evaluations, dashboard, PDF export',
+        description: 'Unlimited pursuits, dashboard, PDF export',
       },
       {
         '@type': 'Offer',
diff --git a/src/lib/analytics.ts b/src/lib/analytics.ts
new file mode 100644
index 0000000..6b03120
--- /dev/null
+++ b/src/lib/analytics.ts
@@ -0,0 +1,44 @@
+// Site-wide analytics for honestecho.com.
+//
+// Posts to the same first-party endpoint the public SAM.gov analyzer already
+// uses (/api/analytics/track on the HE Pursuit backend). No third-party tag,
+// no GA/GTM, no cookie banner needed — events land in our own analytics_events
+// table. Server shape: { events: [{ event_name, anonymous_id, page, properties,
+// source }] }.
+
+import { API_ORIGIN } from './api';
+
+const ANALYTICS_API = `${API_ORIGIN}/api/analytics/track`;
+
+function getAnonId(): string {
+  const KEY = 'he_anon_id';
+  try {
+    let id = localStorage.getItem(KEY);
+    if (!id) { id = crypto.randomUUID(); localStorage.setItem(KEY, id); }
+    return id;
+  } catch {
+    return 'unknown';
+  }
+}
+
+export function track(event: string, props: Record<string, unknown> = {}): void {
+  if (import.meta.env.DEV) { console.debug('[analytics]', event, props); return; }
+  try {
+    fetch(ANALYTICS_API, {
+      method: 'POST',
+      headers: { 'Content-Type': 'application/json' },
+      body: JSON.stringify({
+        events: [{
+          event_name:   event,
+          anonymous_id: getAnonId(),
+          page:         window.location.pathname,
+          properties:   props,
+          source:       'website',
+        }],
+      }),
+      keepalive: true,
+    }).catch(() => {});
+  } catch {
+    /* non-fatal — analytics must never break the page */
+  }
+}
diff --git a/src/lib/api.ts b/src/lib/api.ts
new file mode 100644
index 0000000..799c288
--- /dev/null
+++ b/src/lib/api.ts
@@ -0,0 +1,13 @@
+// Single source of truth for the HE Pursuit backend base URL.
+//
+// History: three different hosts were hard-coded across the site
+// (he-pursuit-api.onrender.com, pursuit.honestecho.com/api,
+// pursuit-api.honestecho.com) — two of which were non-functional in prod
+// (pursuit.honestecho.com/api 405s on POST; pursuit-api.honestecho.com has no
+// DNS). Everything now funnels through here. Override with VITE_API_URL in the
+// build environment if the backend moves off Render.
+
+export const API_ORIGIN =
+  (import.meta.env.VITE_API_URL as string | undefined) || 'https://he-pursuit-api.onrender.com';
+
+export const API_BASE = `${API_ORIGIN}/api`;
diff --git a/src/pages/Contact.tsx b/src/pages/Contact.tsx
index e8d63ae..ca24f6d 100644
--- a/src/pages/Contact.tsx
+++ b/src/pages/Contact.tsx
@@ -1,7 +1,63 @@
+import { useState } from 'react';
+import type { FormEvent } from 'react';
 import { Helmet } from 'react-helmet-async';
-import { Mail, MapPin, Send } from 'lucide-react';
+import { Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
+import { API_BASE } from '../lib/api';
+import { track } from '../lib/analytics';
 
 export default function Contact() {
+  const [firstName, setFirstName] = useState('');
+  const [lastName, setLastName]   = useState('');
+  const [email, setEmail]         = useState('');
+  const [message, setMessage]     = useState('');
+  const [honeypot, setHoneypot]   = useState(''); // bot trap
+  const [loading, setLoading]     = useState(false);
+  const [submitted, setSubmitted] = useState(false);
+  const [error, setError]         = useState<string | null>(null);
+
+  async function handleSubmit(e: FormEvent) {
+    e.preventDefault();
+    setError(null);
+
+    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
+      setError('Please enter a valid email address.');
+      return;
+    }
+    if (!message.trim()) {
+      setError('Please include a message.');
+      return;
+    }
+
+    setLoading(true);
+    try {
+      const res = await fetch(`${API_BASE}/public/contact`, {
+        method:  'POST',
+        headers: { 'Content-Type': 'application/json' },
+        body:    JSON.stringify({
+          first_name: firstName.trim() || undefined,
+          last_name:  lastName.trim() || undefined,
+          email:      email.trim(),
+          message:    message.trim(),
+          honeypot:   honeypot || undefined,
+        }),
+      });
+
+      if (!res.ok) {
+        const body = await res.json().catch(() => ({ message: 'Something went wrong. Please try again.' }));
+        setError(body.message || 'Something went wrong. Please try again.');
+        setLoading(false);
+        return;
+      }
+
+      track('contact_submitted');
+      setSubmitted(true);
+      setLoading(false);
+    } catch {
+      setError("We couldn't reach the server. Please email info@honestecho.com directly.");
+      setLoading(false);
+    }
+  }
+
   return (
     <>
       <Helmet>
@@ -17,7 +73,7 @@ export default function Contact() {
         <meta name="twitter:description" content="Reach out for consulting inquiries, enterprise tool access, or general questions about HE Pursuit." />
         <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
       </Helmet>
-      
+
       <div className="max-w-7xl mx-auto px-6 py-24 min-h-[80vh] flex flex-col md:flex-row gap-8 md:gap-16">
         {/* Left Side: Info */}
         <div className="w-full md:w-1/3">
@@ -30,7 +86,7 @@ export default function Contact() {
           <p className="text-lg text-[#a0b2c8] mb-12 font-body leading-relaxed">
             Reach out for consulting inquiries, enterprise tool access, or general questions about Honest Echo's pursuit engine.
           </p>
-          
+
           <div className="space-y-8">
             <div className="flex gap-4 items-start">
               <div className="w-10 h-10 rounded-full bg-[#0b1120] border border-[#1e2d4a] flex items-center justify-center shrink-0">
@@ -60,34 +116,62 @@ export default function Contact() {
 
         {/* Right Side: Form */}
         <div className="w-full md:w-2/3">
-          <form className="bg-[#0b1120] p-8 md:p-12 rounded-2xl border border-[#1e2d4a] shadow-2xl relative overflow-hidden">
-            <div className="absolute inset-0 bg-gradient-to-tr from-[#00c3ff]/5 to-transparent pointer-events-none"></div>
-            
-            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
-              <div>
-                <label htmlFor="firstName" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-wider mb-2">First Name</label>
-                <input type="text" id="firstName" className="w-full bg-[#030B17] border border-[#1e2d4a] rounded-lg px-4 py-3 text-white focus:border-[#00c3ff] focus:ring-1 focus:ring-[#00c3ff] focus:outline-none transition-all placeholder-[#1e2d4a]" placeholder="Jane" />
+          {!submitted ? (
+            <form onSubmit={handleSubmit} noValidate className="bg-[#0b1120] p-8 md:p-12 rounded-2xl border border-[#1e2d4a] shadow-2xl relative overflow-hidden">
+              <div className="absolute inset-0 bg-gradient-to-tr from-[#00c3ff]/5 to-transparent pointer-events-none"></div>
+
+              {/* Honeypot — hidden from humans, catches bots */}
+              <input
+                type="text"
+                name="website"
+                tabIndex={-1}
+                autoComplete="off"
+                value={honeypot}
+                onChange={e => setHoneypot(e.target.value)}
+                className="absolute -left-[9999px] w-px h-px opacity-0"
+                aria-hidden="true"
+              />
+
+              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
+                <div>
+                  <label htmlFor="firstName" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-wider mb-2">First Name</label>
+                  <input type="text" id="firstName" autoComplete="given-name" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-[#030B17] border border-[#1e2d4a] rounded-lg px-4 py-3 text-white focus:border-[#00c3ff] focus:ring-1 focus:ring-[#00c3ff] focus:outline-none transition-all placeholder-[#1e2d4a]" placeholder="Jane" />
+                </div>
+                <div>
+                  <label htmlFor="lastName" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-wider mb-2">Last Name</label>
+                  <input type="text" id="lastName" autoComplete="family-name" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-[#030B17] border border-[#1e2d4a] rounded-lg px-4 py-3 text-white focus:border-[#00c3ff] focus:ring-1 focus:ring-[#00c3ff] focus:outline-none transition-all placeholder-[#1e2d4a]" placeholder="Doe" />
+                </div>
               </div>
-              <div>
-                <label htmlFor="lastName" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-wider mb-2">Last Name</label>
-                <input type="text" id="lastName" className="w-full bg-[#030B17] border border-[#1e2d4a] rounded-lg px-4 py-3 text-white focus:border-[#00c3ff] focus:ring-1 focus:ring-[#00c3ff] focus:outline-none transition-all placeholder-[#1e2d4a]" placeholder="Doe" />
+
+              <div className="mb-6">
+                <label htmlFor="email" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-wider mb-2">Work Email</label>
+                <input type="email" id="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#030B17] border border-[#1e2d4a] rounded-lg px-4 py-3 text-white focus:border-[#00c3ff] focus:ring-1 focus:ring-[#00c3ff] focus:outline-none transition-all placeholder-[#1e2d4a]" placeholder="jane@company.com" />
               </div>
+
+              <div className="mb-8">
+                <label htmlFor="message" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-wider mb-2">Message</label>
+                <textarea id="message" rows={5} required maxLength={4000} value={message} onChange={e => setMessage(e.target.value)} className="w-full bg-[#030B17] border border-[#1e2d4a] rounded-lg px-4 py-3 text-white focus:border-[#00c3ff] focus:ring-1 focus:ring-[#00c3ff] focus:outline-none transition-all placeholder-[#1e2d4a]" placeholder="How can we help your team win?"></textarea>
+              </div>
+
+              {error && (
+                <p className="text-red-400 text-sm bg-red-900/20 border border-red-700/30 rounded-lg px-4 py-3 mb-6 relative z-10">{error}</p>
+              )}
+
+              <button type="submit" disabled={loading} className="w-full py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,195,255,0.2)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
+                {loading ? 'Sending…' : (<>Send Message <Send className="w-4 h-4" /></>)}
+              </button>
+            </form>
+          ) : (
+            <div className="bg-[#0b1120] p-8 md:p-12 rounded-2xl border border-[#00c3ff]/40 shadow-[0_0_60px_rgba(0,195,255,0.15)] text-center flex flex-col items-center justify-center min-h-[360px]">
+              <div className="w-14 h-14 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/40 flex items-center justify-center mb-5">
+                <CheckCircle2 size={28} className="text-[#00c3ff]" strokeWidth={2} />
+              </div>
+              <h2 className="font-headline font-black text-2xl md:text-3xl text-white mb-3">Message sent.</h2>
+              <p className="text-[#a0b2c8] font-body max-w-md">
+                Thanks for reaching out — we'll get back to you at <span className="text-white font-semibold">{email}</span> within one business day.
+              </p>
             </div>
-            
-            <div className="mb-6">
-              <label htmlFor="email" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-wider mb-2">Work Email</label>
-              <input type="email" id="email" className="w-full bg-[#030B17] border border-[#1e2d4a] rounded-lg px-4 py-3 text-white focus:border-[#00c3ff] focus:ring-1 focus:ring-[#00c3ff] focus:outline-none transition-all placeholder-[#1e2d4a]" placeholder="jane@company.com" />
-            </div>
-            
-            <div className="mb-8">
-              <label htmlFor="message" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-wider mb-2">Message</label>
-              <textarea id="message" rows={5} className="w-full bg-[#030B17] border border-[#1e2d4a] rounded-lg px-4 py-3 text-white focus:border-[#00c3ff] focus:ring-1 focus:ring-[#00c3ff] focus:outline-none transition-all placeholder-[#1e2d4a]" placeholder="How can we help your team win?"></textarea>
-            </div>
-            
-            <button type="button" className="w-full py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,195,255,0.2)]">
-              Send Message <Send className="w-4 h-4" />
-            </button>
-          </form>
+          )}
         </div>
       </div>
     </>
diff --git a/src/pages/Pricing.tsx b/src/pages/Pricing.tsx
index 64b9ae4..7d959f8 100644
--- a/src/pages/Pricing.tsx
+++ b/src/pages/Pricing.tsx
@@ -18,7 +18,7 @@ const features: Feature[] = [
   { category: 'Core Access', name: 'Opportunity summaries',             free: 'check',     starter: 'check',     pro: 'check',     team: 'check'     },
   { category: 'Core Access', name: 'Company profile setup',             free: 'check',     starter: 'check',     pro: 'check',     team: 'check'     },
   { category: 'Core Access', name: 'Bookmark opportunities',            free: '15/mo',     starter: 'unlimited', pro: 'unlimited', team: 'unlimited' },
-  { category: 'Core Access', name: 'Opportunity evaluations',           free: 'none',      starter: '25/mo',     pro: 'unlimited', team: 'unlimited' },
+  { category: 'Core Access', name: 'Opportunity pursuits',              free: 'none',      starter: '25/mo',     pro: 'unlimited', team: 'unlimited' },
   { category: 'Core Access', name: 'Saved searches & nightly alerts',   free: 'check',     starter: 'check',     pro: 'check',     team: 'check'     },
   { category: 'Core Access', name: 'Phase 1 — Initial evaluation',      free: 'none',      starter: 'check',     pro: 'check',     team: 'check'     },
   // Eligibility & Analysis
@@ -60,7 +60,7 @@ function Cell({ value }: { value: CV }) {
 const faqs = [
   { q: 'Do I need a credit card to start?',               a: 'No. Free requires only your email. A card is only needed when you upgrade to a paid plan.' },
   { q: 'Can I cancel anytime?',                           a: 'Yes. Cancel from your account settings — no notice period, no lock-in.' },
-  { q: 'What is the difference between Starter and Pro?', a: 'Starter ($99/mo) gives you the full qualification workflow for up to 25 evaluations per month. Pro ($199/mo) removes limits entirely and adds the dashboard, decision tracking, and PDF export.' },
+  { q: 'What is the difference between Starter and Pro?', a: 'Starter ($99/mo) gives you the full qualification workflow for up to 25 pursuits per month. Pro ($199/mo) removes limits entirely and adds the dashboard, decision tracking, and PDF export.' },
   { q: 'When should I upgrade to Team?',                  a: 'When more than one person needs to work in the same pipeline. Team adds multiple users, shared pursuits, team-level visibility, and onboarding support. Team is launching Q3 2026 — join the waitlist from the Team card above and we\'ll reach out with early-access pricing.' },
 ];
 
@@ -92,7 +92,7 @@ const plans = [
     name: 'Starter',
     price: '$99',
     tagline: 'Make real bid/no-bid decisions',
-    sub: 'Run full evaluations with structured analysis',
+    sub: 'Run full pursuits with structured analysis',
     highlight: false,
     includesAbove: 'Everything in Free, plus:',
     features: [
@@ -104,7 +104,7 @@ const plans = [
       'Strategic fit and effort scoring',
       'Go / Conditional Go / No-Bid recommendations',
       'Bookmark unlimited opportunities',
-      'Evaluate opportunities (up to 25/month)',
+      'Up to 25 pursuits per month',
     ],
     cta: 'Select Starter',
     ctaTo: '/signup',
@@ -118,7 +118,7 @@ const plans = [
     badge: 'Recommended',
     includesAbove: 'Everything in Starter, plus:',
     features: [
-      'Unlimited opportunity evaluations',
+      'Unlimited opportunity pursuits',
       'Decision tracking and history',
       'Dashboard (pipeline, deadlines, priorities)',
       'Downloadable decision reports (PDF)',
diff --git a/src/pages/SamGovNoticeAnalyzer.tsx b/src/pages/SamGovNoticeAnalyzer.tsx
index 86ab0b7..314a6cc 100644
--- a/src/pages/SamGovNoticeAnalyzer.tsx
+++ b/src/pages/SamGovNoticeAnalyzer.tsx
@@ -18,37 +18,8 @@ import {
   Cpu,
 } from 'lucide-react';
 import AnalyzerOpportunityCard from '../components/AnalyzerOpportunityCard';
-
-// ── API ───────────────────────────────────────────────────────────────────────
-
-const API_BASE = import.meta.env.VITE_API_URL
-  ? `${import.meta.env.VITE_API_URL}/api`
-  : 'https://he-pursuit-api.onrender.com/api';
-
-// ── Analytics ─────────────────────────────────────────────────────────────────
-
-const ANALYTICS_API = 'https://he-pursuit-api.onrender.com/api/analytics/track';
-
-function getAnonId(): string {
-  const KEY = 'he_anon_id';
-  try {
-    let id = localStorage.getItem(KEY);
-    if (!id) { id = crypto.randomUUID(); localStorage.setItem(KEY, id); }
-    return id;
-  } catch { return 'unknown'; }
-}
-
-function track(event: string, props: Record<string, unknown> = {}) {
-  if (import.meta.env.DEV) { console.debug('[analytics]', event, props); return; }
-  try {
-    fetch(ANALYTICS_API, {
-      method: 'POST',
-      headers: { 'Content-Type': 'application/json' },
-      body: JSON.stringify({ events: [{ event_name: event, anonymous_id: getAnonId(), page: window.location.pathname, properties: props, source: 'website' }] }),
-      keepalive: true,
-    }).catch(() => {});
-  } catch { /* non-fatal */ }
-}
+import { API_BASE } from '../lib/api';
+import { track } from '../lib/analytics';
 
 // ── Types ─────────────────────────────────────────────────────────────────────
 
diff --git a/src/pages/Signup.tsx b/src/pages/Signup.tsx
index 8a06c29..b4fe24e 100644
--- a/src/pages/Signup.tsx
+++ b/src/pages/Signup.tsx
@@ -3,6 +3,8 @@ import { Helmet } from 'react-helmet-async';
 import { Link } from 'react-router-dom';
 import { Zap, ArrowRight, Target, Scale, CheckCircle2, Eye, EyeOff } from 'lucide-react';
 import { supabase } from '../lib/supabase';
+import { API_BASE } from '../lib/api';
+import { track } from '../lib/analytics';
 
 type FormState = 'form' | 'verify';
 
@@ -42,6 +44,7 @@ export default function Signup() {
   async function handleGoogleSignIn() {
     setError('');
     setGoogleLoading(true);
+    track('signup_submitted', { method: 'google' });
     try {
       const { error: oauthError } = await supabase.auth.signInWithOAuth({
         provider: 'google',
@@ -95,8 +98,10 @@ export default function Signup() {
         return;
       }
 
+      track('signup_submitted', { method: 'email' });
+
       // Send welcome email
-      fetch(`${import.meta.env.VITE_API_URL || 'https://pursuit-api.honestecho.com'}/api/public/welcome-email`, {
+      fetch(`${API_BASE}/public/welcome-email`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email: form.email.trim(), fullName: form.fullName.trim() })
diff --git a/src/pages/TeamWaitlist.tsx b/src/pages/TeamWaitlist.tsx
index 9e2b22b..47030f1 100644
--- a/src/pages/TeamWaitlist.tsx
+++ b/src/pages/TeamWaitlist.tsx
@@ -3,12 +3,8 @@ import type { FormEvent } from 'react';
 import { Link } from 'react-router-dom';
 import { Helmet } from 'react-helmet-async';
 import { Users, Share2, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';
-
-// ── API base ─────────────────────────────────────────────────────────────────
-
-const API_BASE = import.meta.env.VITE_API_URL
-  ? `${import.meta.env.VITE_API_URL}/api`
-  : 'https://pursuit.honestecho.com/api';
+import { API_BASE } from '../lib/api';
+import { track } from '../lib/analytics';
 
 // ── Page ─────────────────────────────────────────────────────────────────────
 
@@ -54,6 +50,7 @@ export default function TeamWaitlist() {
         return;
       }
 
+      track('team_waitlist_submitted', { team_size: teamSize || undefined });
       setSubmitted(true);
       setLoading(false);
     } catch {

############## BACKEND REPO: Antigravity (HE-Pursuit/api-server.js) ##############
diff --git a/HE-Pursuit/api-server.js b/HE-Pursuit/api-server.js
index 3d6047a..39230b8 100644
--- a/HE-Pursuit/api-server.js
+++ b/HE-Pursuit/api-server.js
@@ -8856,6 +8856,73 @@ app.post('/api/public/welcome-email', async (req, res) => {
   }
 });
 
+// POST /api/public/contact — contact form on honestecho.com/contact
+// Body: { first_name?, last_name?, email, message, honeypot? }
+// Emails the inbound message to the ops inbox with reply-to set to the sender.
+// Honeypot → silent 200. Rate-limited per IP (reuses sandbox limiter). All
+// user-supplied fields are HTML-escaped before being rendered into the email.
+const CONTACT_INBOX = process.env.CONTACT_INBOX || 'info@honestecho.com';
+app.post('/api/public/contact', async (req, res) => {
+  const { first_name, last_name, email, message, honeypot } = req.body || {};
+
+  // Silent honeypot reject — looks like success, sends nothing
+  if (honeypot && String(honeypot).trim().length > 0) return res.json({ success: true });
+
+  if (!email || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
+    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
+  }
+  if (!message || typeof message !== 'string' || !message.trim()) {
+    return res.status(400).json({ success: false, message: 'Please include a message.' });
+  }
+
+  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').toString().split(',')[0].trim();
+  const gate = await checkSandboxRateLimit(ip);
+  if (!gate.allowed) {
+    return res.status(429).json({ success: false, message: 'Too many messages. Please try again later.', retryAfter: gate.retryAfter });
+  }
+
+  const esc = (s, max) => String(s || '')
+    .slice(0, max)
+    .replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
+
+  const name      = `${esc(first_name, 100)} ${esc(last_name, 100)}`.trim() || '(no name given)';
+  const safeEmail = esc(email.trim(), 254);
+  const safeMsg   = esc(message.trim(), 4000).replace(/\n/g, '<br>');
+
+  if (!resendClient) {
+    console.warn(`[CONTACT] (resend disabled) from ${safeEmail}: ${esc(message.trim(), 200)}`);
+    return res.json({ success: true });
+  }
+
+  try {
+    const { error } = await resendClient.emails.send({
+      from:    'Honest Echo Website <noreply@honestecho.com>',
+      to:      CONTACT_INBOX,
+      replyTo: email.trim(),
+      subject: `New contact form message from ${name}`,
+      html: `
+        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
+          <h2 style="margin-bottom: 4px;">New contact form submission</h2>
+          <p style="margin: 0 0 16px; color: #888; font-size: 13px;">via honestecho.com/contact</p>
+          <p><strong>Name:</strong> ${name}</p>
+          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
+          <p><strong>Message:</strong></p>
+          <div style="border-left: 3px solid #00c3ff; padding: 8px 14px; background: #f6fafd; border-radius: 4px;">${safeMsg}</div>
+        </div>
+      `,
+    });
+
+    if (error) {
+      console.error('[CONTACT] Resend error:', error);
+      return res.status(502).json({ success: false, message: 'Could not send your message. Please email info@honestecho.com directly.' });
+    }
+    return res.json({ success: true });
+  } catch (err) {
+    console.error('[CONTACT] Unexpected error:', err.message);
+    return res.status(500).json({ success: false, message: 'Server error. Please email info@honestecho.com directly.' });
+  }
+});
+
 // ══════════════════════════════════════════════════════════════════════════════
 // END PUBLIC MARKETING ROUTES
 // ══════════════════════════════════════════════════════════════════════════════
</stdin>
codex
1. **BLOCKER: CSP will break API calls if `VITE_API_URL` is set to any non-Render host.**  
   Hunk: `public/_headers` + `src/lib/api.ts`  
   `connect-src` only allows `https://he-pursuit-api.onrender.com` plus Supabase. But `API_ORIGIN` is explicitly configurable via `VITE_API_URL`. If production is built with `VITE_API_URL=https://pursuit.honestecho.com` or another custom API domain, every `fetch()` using `API_BASE` and analytics will be blocked by CSP.  
   Fix: either pin production `VITE_API_URL` to `https://he-pursuit-api.onrender.com`, or add the actual production API origin(s) to `connect-src`, for example:
   ```txt
   connect-src 'self' https://he-pursuit-api.onrender.com https://pursuit.honestecho.com https://pnvvwlyyhrifovrsimzy.supabase.co https://*.supabase.co;
   ```

2. **SHOULD-FIX: CSP is probably OK for Google Fonts, Supabase auth, Google OAuth redirect, and Render fetches, but it is incomplete for WebSocket Supabase features.**  
   Hunk: `public/_headers`  
   Google Fonts are covered: `style-src ... https://fonts.googleapis.com`, `font-src ... https://fonts.gstatic.com`. Render fetches are covered: `connect-src ... https://he-pursuit-api.onrender.com`. Supabase REST/auth calls are covered by `https://pnvvwlyyhrifovrsimzy.supabase.co` and `https://*.supabase.co`. Google OAuth top-level navigation is not governed by `connect-src`/`script-src`, so `accounts.google.com` is not needed for the redirect itself.  
   Missing piece: if the frontend ever uses Supabase Realtime/storage features that open WebSockets, CSP needs `wss://*.supabase.co` in `connect-src`.  
   Fix:
   ```txt
   connect-src 'self' https://he-pursuit-api.onrender.com https://pnvvwlyyhrifovrsimzy.supabase.co https://*.supabase.co wss://*.supabase.co;
   ```

3. **SHOULD-FIX: contact endpoint allows header injection risk through `subject` name fields.**  
   Hunk: backend `POST /api/public/contact`, especially:
   ```js
   const name = `${esc(first_name, 100)} ${esc(last_name, 100)}`.trim()
   subject: `New contact form message from ${name}`,
   ```
   `esc()` HTML-escapes but does not remove `\r` or `\n`. Those characters can enter `first_name` / `last_name` and then flow into the email subject. Resend may sanitize internally, but production launch code should not rely on provider behavior for email headers.  
   Fix: use separate sanitizers for HTML body vs email headers:
   ```js
   const cleanHeader = s => String(s || '').replace(/[\r\n]+/g, ' ').slice(0, 100).trim();
   const displayName = `${cleanHeader(first_name)} ${cleanHeader(last_name)}`.trim() || '(no name given)';
   ```

4. **SHOULD-FIX: `replyTo` uses raw email instead of the already-normalized value.**  
   Hunk: backend contact endpoint:
   ```js
   const safeEmail = esc(email.trim(), 254);
   ...
   replyTo: email.trim(),
   ```
   The regex blocks whitespace, so obvious CRLF header injection is unlikely, but the code validates one transformed value and then sends another raw value. That is brittle.  
   Fix: create a normalized email once, validate it, then use it everywhere:
   ```js
   const normalizedEmail = email.trim().toLowerCase();
   ...
   replyTo: normalizedEmail
   ```

5. **SHOULD-FIX: rate limiting happens after validation, so invalid-request floods bypass the limiter.**  
   Hunk: backend contact endpoint:
   ```js
   if (!email ... ) return res.status(400)...
   if (!message ... ) return res.status(400)...
   const gate = await checkSandboxRateLimit(ip);
   ```
   Attackers can hammer the route with malformed JSON bodies or invalid emails/messages and never hit the limiter. That still consumes app resources and log/error paths.  
   Fix: compute IP and apply a lightweight route limiter before validation, while keeping honeypot silent behavior if desired.

6. **SHOULD-FIX: endpoint truncates `message` after validation instead of rejecting oversized submissions.**  
   Hunk:
   ```js
   const safeMsg = esc(message.trim(), 4000)
   ```
   The frontend has `maxLength={4000}`, but clients can bypass it. The server silently truncates large messages rather than enforcing a contract. Depending on Express body limits this may be partially mitigated, but the endpoint should reject oversized fields.  
   Fix:
   ```js
   if (message.length > 4000) {
     return res.status(400).json({ success: false, message: 'Message is too long.' });
   }
   ```

7. **NIT: honeypot submissions are not rate-limited.**  
   Hunk:
   ```js
   if (honeypot && String(honeypot).trim().length > 0) return res.json({ success: true });
   ```
   Silent success is fine, but unlimited honeypot traffic can still create backend load.  
   Fix: either rate-limit before the honeypot branch or add a very cheap IP counter for this route.

8. **NIT: frontend displays backend error messages directly.**  
   Hunk: `Contact.tsx`
   ```ts
   setError(body.message || 'Something went wrong. Please try again.');
   ```
   Current backend messages are safe and generic, so this is not a launch blocker. But if future backend errors include operational detail, the UI will surface them.  
   Fix: map status codes to frontend-owned copy, or only trust a small allowlist of known messages.

9. **No issue found: analytics `track()` should not throw through to the page in normal cases.**  
   Hunk: `src/lib/analytics.ts`  
   `fetch()` is wrapped in `try`, rejected promises are swallowed with `.catch(() => {})`, `localStorage` access is caught, and `JSON.stringify()` failures from bad props are inside the outer `try`. The page-view hook in `App.tsx` should not break rendering.

10. **SHOULD-FIX: centralized `API_BASE` changes a previously broken host, but CSP and environment config must match it.**  
   Hunks: `src/lib/api.ts`, `Signup.tsx`, `TeamWaitlist.tsx`, `SamGovNoticeAnalyzer.tsx`  
   The code now consistently targets `${API_ORIGIN}/api`, defaulting to Render. That likely fixes `Signup.tsx`, which previously used `https://pursuit-api.honestecho.com`, and `TeamWaitlist.tsx`, which previously used `https://pursuit.honestecho.com/api`. The launch risk is configuration drift: if `VITE_API_URL` includes a trailing `/api`, calls become `/api/api/...`; if it points to a host not in CSP, calls are blocked.  
   Fix: document `VITE_API_URL` as origin-only, normalize trailing slashes, and align CSP:
   ```ts
   const rawOrigin = (import.meta.env.VITE_API_URL as string | undefined) || 'https://he-pursuit-api.onrender.com';
   export const API_ORIGIN = rawOrigin.replace(/\/+$/, '').replace(/\/api$/, '');
   export const API_BASE = `${API_ORIGIN}/api`;
   ```
tokens used
11,400
1. **BLOCKER: CSP will break API calls if `VITE_API_URL` is set to any non-Render host.**  
   Hunk: `public/_headers` + `src/lib/api.ts`  
   `connect-src` only allows `https://he-pursuit-api.onrender.com` plus Supabase. But `API_ORIGIN` is explicitly configurable via `VITE_API_URL`. If production is built with `VITE_API_URL=https://pursuit.honestecho.com` or another custom API domain, every `fetch()` using `API_BASE` and analytics will be blocked by CSP.  
   Fix: either pin production `VITE_API_URL` to `https://he-pursuit-api.onrender.com`, or add the actual production API origin(s) to `connect-src`, for example:
   ```txt
   connect-src 'self' https://he-pursuit-api.onrender.com https://pursuit.honestecho.com https://pnvvwlyyhrifovrsimzy.supabase.co https://*.supabase.co;
   ```

2. **SHOULD-FIX: CSP is probably OK for Google Fonts, Supabase auth, Google OAuth redirect, and Render fetches, but it is incomplete for WebSocket Supabase features.**  
   Hunk: `public/_headers`  
   Google Fonts are covered: `style-src ... https://fonts.googleapis.com`, `font-src ... https://fonts.gstatic.com`. Render fetches are covered: `connect-src ... https://he-pursuit-api.onrender.com`. Supabase REST/auth calls are covered by `https://pnvvwlyyhrifovrsimzy.supabase.co` and `https://*.supabase.co`. Google OAuth top-level navigation is not governed by `connect-src`/`script-src`, so `accounts.google.com` is not needed for the redirect itself.  
   Missing piece: if the frontend ever uses Supabase Realtime/storage features that open WebSockets, CSP needs `wss://*.supabase.co` in `connect-src`.  
   Fix:
   ```txt
   connect-src 'self' https://he-pursuit-api.onrender.com https://pnvvwlyyhrifovrsimzy.supabase.co https://*.supabase.co wss://*.supabase.co;
   ```

3. **SHOULD-FIX: contact endpoint allows header injection risk through `subject` name fields.**  
   Hunk: backend `POST /api/public/contact`, especially:
   ```js
   const name = `${esc(first_name, 100)} ${esc(last_name, 100)}`.trim()
   subject: `New contact form message from ${name}`,
   ```
   `esc()` HTML-escapes but does not remove `\r` or `\n`. Those characters can enter `first_name` / `last_name` and then flow into the email subject. Resend may sanitize internally, but production launch code should not rely on provider behavior for email headers.  
   Fix: use separate sanitizers for HTML body vs email headers:
   ```js
   const cleanHeader = s => String(s || '').replace(/[\r\n]+/g, ' ').slice(0, 100).trim();
   const displayName = `${cleanHeader(first_name)} ${cleanHeader(last_name)}`.trim() || '(no name given)';
   ```

4. **SHOULD-FIX: `replyTo` uses raw email instead of the already-normalized value.**  
   Hunk: backend contact endpoint:
   ```js
   const safeEmail = esc(email.trim(), 254);
   ...
   replyTo: email.trim(),
   ```
   The regex blocks whitespace, so obvious CRLF header injection is unlikely, but the code validates one transformed value and then sends another raw value. That is brittle.  
   Fix: create a normalized email once, validate it, then use it everywhere:
   ```js
   const normalizedEmail = email.trim().toLowerCase();
   ...
   replyTo: normalizedEmail
   ```

5. **SHOULD-FIX: rate limiting happens after validation, so invalid-request floods bypass the limiter.**  
   Hunk: backend contact endpoint:
   ```js
   if (!email ... ) return res.status(400)...
   if (!message ... ) return res.status(400)...
   const gate = await checkSandboxRateLimit(ip);
   ```
   Attackers can hammer the route with malformed JSON bodies or invalid emails/messages and never hit the limiter. That still consumes app resources and log/error paths.  
   Fix: compute IP and apply a lightweight route limiter before validation, while keeping honeypot silent behavior if desired.

6. **SHOULD-FIX: endpoint truncates `message` after validation instead of rejecting oversized submissions.**  
   Hunk:
   ```js
   const safeMsg = esc(message.trim(), 4000)
   ```
   The frontend has `maxLength={4000}`, but clients can bypass it. The server silently truncates large messages rather than enforcing a contract. Depending on Express body limits this may be partially mitigated, but the endpoint should reject oversized fields.  
   Fix:
   ```js
   if (message.length > 4000) {
     return res.status(400).json({ success: false, message: 'Message is too long.' });
   }
   ```

7. **NIT: honeypot submissions are not rate-limited.**  
   Hunk:
   ```js
   if (honeypot && String(honeypot).trim().length > 0) return res.json({ success: true });
   ```
   Silent success is fine, but unlimited honeypot traffic can still create backend load.  
   Fix: either rate-limit before the honeypot branch or add a very cheap IP counter for this route.

8. **NIT: frontend displays backend error messages directly.**  
   Hunk: `Contact.tsx`
   ```ts
   setError(body.message || 'Something went wrong. Please try again.');
   ```
   Current backend messages are safe and generic, so this is not a launch blocker. But if future backend errors include operational detail, the UI will surface them.  
   Fix: map status codes to frontend-owned copy, or only trust a small allowlist of known messages.

9. **No issue found: analytics `track()` should not throw through to the page in normal cases.**  
   Hunk: `src/lib/analytics.ts`  
   `fetch()` is wrapped in `try`, rejected promises are swallowed with `.catch(() => {})`, `localStorage` access is caught, and `JSON.stringify()` failures from bad props are inside the outer `try`. The page-view hook in `App.tsx` should not break rendering.

10. **SHOULD-FIX: centralized `API_BASE` changes a previously broken host, but CSP and environment config must match it.**  
   Hunks: `src/lib/api.ts`, `Signup.tsx`, `TeamWaitlist.tsx`, `SamGovNoticeAnalyzer.tsx`  
   The code now consistently targets `${API_ORIGIN}/api`, defaulting to Render. That likely fixes `Signup.tsx`, which previously used `https://pursuit-api.honestecho.com`, and `TeamWaitlist.tsx`, which previously used `https://pursuit.honestecho.com/api`. The launch risk is configuration drift: if `VITE_API_URL` includes a trailing `/api`, calls become `/api/api/...`; if it points to a host not in CSP, calls are blocked.  
   Fix: document `VITE_API_URL` as origin-only, normalize trailing slashes, and align CSP:
   ```ts
   const rawOrigin = (import.meta.env.VITE_API_URL as string | undefined) || 'https://he-pursuit-api.onrender.com';
   export const API_ORIGIN = rawOrigin.replace(/\/+$/, '').replace(/\/api$/, '');
   export const API_BASE = `${API_ORIGIN}/api`;
   ```
