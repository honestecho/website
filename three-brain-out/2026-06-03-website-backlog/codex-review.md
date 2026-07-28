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
session id: 019e8e91-e594-7581-ba13-fc566c816932
--------
user
Review this diff to a React/Vite marketing site. Changes: (1) App.tsx converted all routes except Home to React.lazy + a single Suspense wrapper for code-splitting; (2) Signup.tsx analytics events renamed signup_submitted -> signup_started (at attempt) + signup_completed (on success) to match a backend funnel view; (3) Pricing.tsx 'Limited' -> 'Per-pursuit' and 'Coming Q3' -> 'Coming Soon'; (4) Home.tsx + TeamWaitlist.tsx 'Coming Q3' -> 'Coming Soon'; (5) SharedPackage.tsx now imports API_BASE from lib/api (was hardcoded to pursuit.honestecho.com/api which returned SPA HTML and broke shared links) + adds a track('shared_package_viewed') call. Look for: broken lazy/Suspense usage, any route that still imports eagerly, analytics double-firing or misplacement, the SharedPackage host fix being correct, and any regression. Numbered findings tagged BLOCKER/SHOULD-FIX/NIT with the fix.

<stdin>
diff --git a/src/App.tsx b/src/App.tsx
index cba5893..97bb0bc 100644
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -1,28 +1,32 @@
-import { useEffect, useLayoutEffect } from 'react';
+import { useEffect, useLayoutEffect, lazy, Suspense } from 'react';
 import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
 import Navbar from './components/layout/Navbar';
 import Footer from './components/layout/Footer';
 import Home from './pages/Home';
-import About from './pages/About';
-import Contact from './pages/Contact';
-import AppRedirect from './pages/AppRedirect';
-import Signup from './pages/Signup';
-import Welcome from './pages/Welcome';
-import Pricing from './pages/Pricing';
-import Security from './pages/Security';
-import Terms from './pages/Terms';
-import Privacy from './pages/Privacy';
-import FAQ from './pages/FAQ';
-import VsGovWin from './pages/VsGovWin';
-import VsGovTribe from './pages/VsGovTribe';
-import SamGovAnalysis from './pages/SamGovAnalysis';
-import SamGovNoticeAnalyzer from './pages/SamGovNoticeAnalyzer';
-import SharedPackage from './pages/SharedPackage';
-import TeamWaitlist from './pages/TeamWaitlist';
-import NotFound from './pages/NotFound';
 import { OrganizationSchema } from './components/SchemaOrg';
 import { track } from './lib/analytics';
 
+// Home stays eager (it's the landing LCP). Everything else is code-split into
+// its own chunk so the initial bundle isn't dragged down by framer-motion-heavy
+// secondary pages.
+const About = lazy(() => import('./pages/About'));
+const Contact = lazy(() => import('./pages/Contact'));
+const AppRedirect = lazy(() => import('./pages/AppRedirect'));
+const Signup = lazy(() => import('./pages/Signup'));
+const Welcome = lazy(() => import('./pages/Welcome'));
+const Pricing = lazy(() => import('./pages/Pricing'));
+const Security = lazy(() => import('./pages/Security'));
+const Terms = lazy(() => import('./pages/Terms'));
+const Privacy = lazy(() => import('./pages/Privacy'));
+const FAQ = lazy(() => import('./pages/FAQ'));
+const VsGovWin = lazy(() => import('./pages/VsGovWin'));
+const VsGovTribe = lazy(() => import('./pages/VsGovTribe'));
+const SamGovAnalysis = lazy(() => import('./pages/SamGovAnalysis'));
+const SamGovNoticeAnalyzer = lazy(() => import('./pages/SamGovNoticeAnalyzer'));
+const SharedPackage = lazy(() => import('./pages/SharedPackage'));
+const TeamWaitlist = lazy(() => import('./pages/TeamWaitlist'));
+const NotFound = lazy(() => import('./pages/NotFound'));
+
 function ScrollToTop() {
   const { pathname } = useLocation();
   useLayoutEffect(() => { window.scrollTo(0, 0); }, [pathname]);
@@ -54,6 +58,7 @@ function App() {
       <PageViews />
       <Navbar />
       <main className="flex-grow relative z-10">
+        <Suspense fallback={<div className="min-h-[60vh]" />}>
         <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/product" element={<Navigate to="/" replace />} />
@@ -78,6 +83,7 @@ function App() {
           <Route path="/team-waitlist" element={<TeamWaitlist />} />
           <Route path="*" element={<NotFound />} />
         </Routes>
+        </Suspense>
       </main>
       <Footer />
     </div>
diff --git a/src/pages/Home.tsx b/src/pages/Home.tsx
index 1d7e3c2..510022f 100644
--- a/src/pages/Home.tsx
+++ b/src/pages/Home.tsx
@@ -415,7 +415,7 @@ export default function Home() {
             <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300 h-full">
               <div className="flex items-center justify-between mb-1">
                 <h3 className="font-headline text-xl font-bold text-white">Team</h3>
-                <span className="text-[10px] font-bold text-[#030B17] bg-[#00c3ff] px-2 py-0.5 rounded-full uppercase tracking-widest">Coming Q3</span>
+                <span className="text-[10px] font-bold text-[#030B17] bg-[#00c3ff] px-2 py-0.5 rounded-full uppercase tracking-widest">Coming Soon</span>
               </div>
               <p className="text-xs text-[#8b9bb4] mb-4">For multi-user capture teams</p>
               <div className="flex items-baseline gap-1 mb-4">
diff --git a/src/pages/Pricing.tsx b/src/pages/Pricing.tsx
index 7d959f8..d8ebc49 100644
--- a/src/pages/Pricing.tsx
+++ b/src/pages/Pricing.tsx
@@ -30,7 +30,7 @@ const features: Feature[] = [
   { category: 'Eligibility & Analysis', name: 'Strategic & effort scoring',   free: 'none', starter: 'check', pro: 'check', team: 'check' },
   // Decisions & Output
   { category: 'Decisions & Output', name: 'Go / Conditional Go / No-Bid', free: 'none', starter: 'check', pro: 'check', team: 'check' },
-  { category: 'Decisions & Output', name: 'Decision tracking & history',   free: 'none', starter: 'Limited', pro: 'check', team: 'check' },
+  { category: 'Decisions & Output', name: 'Decision tracking & history',   free: 'none', starter: 'Per-pursuit', pro: 'check', team: 'check' },
   { category: 'Decisions & Output', name: 'PDF decision report export',    free: 'none', starter: 'none',  pro: 'check', team: 'check' },
   // Workflow & Visibility
   { category: 'Workflow & Visibility', name: 'Dashboard (pipeline, deadlines)', free: 'none', starter: 'none', pro: 'check', team: 'check' },
@@ -61,7 +61,7 @@ const faqs = [
   { q: 'Do I need a credit card to start?',               a: 'No. Free requires only your email. A card is only needed when you upgrade to a paid plan.' },
   { q: 'Can I cancel anytime?',                           a: 'Yes. Cancel from your account settings — no notice period, no lock-in.' },
   { q: 'What is the difference between Starter and Pro?', a: 'Starter ($99/mo) gives you the full qualification workflow for up to 25 pursuits per month. Pro ($199/mo) removes limits entirely and adds the dashboard, decision tracking, and PDF export.' },
-  { q: 'When should I upgrade to Team?',                  a: 'When more than one person needs to work in the same pipeline. Team adds multiple users, shared pursuits, team-level visibility, and onboarding support. Team is launching Q3 2026 — join the waitlist from the Team card above and we\'ll reach out with early-access pricing.' },
+  { q: 'When should I upgrade to Team?',                  a: 'When more than one person needs to work in the same pipeline. Team adds multiple users, shared pursuits, team-level visibility, and onboarding support. Team is launching soon — join the waitlist from the Team card above and we\'ll reach out with early-access pricing.' },
 ];
 
 // ─── Pricing cards data ───────────────────────────────────────────────────────
@@ -133,7 +133,7 @@ const plans = [
     tagline: 'Scale across your team',
     sub: 'Standardize decisions across users',
     highlight: false,
-    badge: 'Coming Q3',
+    badge: 'Coming Soon',
     includesAbove: 'Everything in Pro, plus:',
     features: [
       'Multiple users',
diff --git a/src/pages/SharedPackage.tsx b/src/pages/SharedPackage.tsx
index 0917c50..3e03361 100644
--- a/src/pages/SharedPackage.tsx
+++ b/src/pages/SharedPackage.tsx
@@ -20,12 +20,12 @@ import {
   Link2Off,
   AlertCircle,
 } from 'lucide-react';
+import { API_BASE } from '../lib/api';
+import { track } from '../lib/analytics';
 
-// ── API base ─────────────────────────────────────────────────────────────────
-
-const API_BASE = import.meta.env.VITE_API_URL
-  ? `${import.meta.env.VITE_API_URL}/api`
-  : 'https://pursuit.honestecho.com/api';
+// API base is centralized in lib/api (he-pursuit-api.onrender.com). The old
+// hard-coded pursuit.honestecho.com/api fallback returned SPA HTML for this GET,
+// which broke every shared-package link in production.
 
 // ── Snapshot shape (matches api-server.js assembleShareSnapshot) ────────────
 
@@ -243,6 +243,7 @@ export default function SharedPackage() {
         const body = await res.json().catch(() => ({}));
         if (cancelled) return;
         if (res.status === 200 && body?.success) {
+          track('shared_package_viewed', { token });
           setState({ kind: 'ok', snapshot: body.snapshot as Snapshot, createdAt: body.created_at });
           return;
         }
diff --git a/src/pages/Signup.tsx b/src/pages/Signup.tsx
index b4fe24e..1336b47 100644
--- a/src/pages/Signup.tsx
+++ b/src/pages/Signup.tsx
@@ -44,7 +44,7 @@ export default function Signup() {
   async function handleGoogleSignIn() {
     setError('');
     setGoogleLoading(true);
-    track('signup_submitted', { method: 'google' });
+    track('signup_started', { method: 'google' });
     try {
       const { error: oauthError } = await supabase.auth.signInWithOAuth({
         provider: 'google',
@@ -75,6 +75,7 @@ export default function Signup() {
     if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
 
     setLoading(true);
+    track('signup_started', { method: 'email' });
     try {
       const { data, error: signUpError } = await supabase.auth.signUp({
         email: form.email.trim(),
@@ -98,7 +99,7 @@ export default function Signup() {
         return;
       }
 
-      track('signup_submitted', { method: 'email' });
+      track('signup_completed', { method: 'email' });
 
       // Send welcome email
       fetch(`${API_BASE}/public/welcome-email`, {
diff --git a/src/pages/TeamWaitlist.tsx b/src/pages/TeamWaitlist.tsx
index 47030f1..3fe3cc7 100644
--- a/src/pages/TeamWaitlist.tsx
+++ b/src/pages/TeamWaitlist.tsx
@@ -63,7 +63,7 @@ export default function TeamWaitlist() {
     <>
       <Helmet>
         <title>Team Waitlist | HE Pursuit</title>
-        <meta name="description" content="Team pricing for HE Pursuit launches Q3 2026. Join the waitlist for multi-user workspaces, shared pursuits, and team-level visibility across your government contracting pipeline." />
+        <meta name="description" content="Team pricing for HE Pursuit is launching soon. Join the waitlist for multi-user workspaces, shared pursuits, and team-level visibility across your government contracting pipeline." />
         <meta property="og:type" content="website" />
         <meta property="og:url" content="https://honestecho.com/team-waitlist" />
         <meta property="og:title" content="Team Waitlist — HE Pursuit" />
@@ -80,7 +80,7 @@ export default function TeamWaitlist() {
         <div className="max-w-4xl mx-auto relative z-10">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
             <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]" />
-            <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Coming Q3 2026</span>
+            <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Coming Soon</span>
           </div>
 
           <h1 className="font-headline font-black text-5xl md:text-6xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
</stdin>
codex
I’ll verify the diff against the current source where the answer depends on surrounding code, especially `lib/api`, route structure, and analytics helpers.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg -n "export const API_BASE|const API_BASE|VITE_API_URL|function track|export function track" src/lib src/pages src/App.tsx' in C:\Users\aaron\OneDrive\Honest Echo LLC\Antigravity\HE Website - 1
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Path src\\lib\\analytics.ts" in C:\Users\aaron\OneDrive\Honest Echo LLC\Antigravity\HE Website - 1
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Path src\\pages\\Signup.tsx" in C:\Users\aaron\OneDrive\Honest Echo LLC\Antigravity\HE Website - 1
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Path src\\pages\\SharedPackage.tsx" in C:\Users\aaron\OneDrive\Honest Echo LLC\Antigravity\HE Website - 1
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Path src\\lib\\api.ts" in C:\Users\aaron\OneDrive\Honest Echo LLC\Antigravity\HE Website - 1
 succeeded in 178ms:
src/lib\api.ts:7:// DNS). Everything now funnels through here. Override with VITE_API_URL in the
src/lib\api.ts:10:// VITE_API_URL should be origin-only (no trailing slash, no /api). We normalize
src/lib\api.ts:13:  (import.meta.env.VITE_API_URL as string | undefined) || 'https://he-pursuit-api.onrender.com';
src/lib\api.ts:17:export const API_BASE = `${API_ORIGIN}/api`;
src/lib\analytics.ts:24:export function track(event: string, props: Record<string, unknown> = {}): void {

 succeeded in 188ms:
// Site-wide analytics for honestecho.com.
//
// Posts to the same first-party endpoint the public SAM.gov analyzer already
// uses (/api/analytics/track on the HE Pursuit backend). No third-party tag,
// no GA/GTM, no cookie banner needed â€” events land in our own analytics_events
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
    /* non-fatal â€” analytics must never break the page */
  }
}

 succeeded in 206ms:
// Single source of truth for the HE Pursuit backend base URL.
//
// History: three different hosts were hard-coded across the site
// (he-pursuit-api.onrender.com, pursuit.honestecho.com/api,
// pursuit-api.honestecho.com) â€” two of which were non-functional in prod
// (pursuit.honestecho.com/api 405s on POST; pursuit-api.honestecho.com has no
// DNS). Everything now funnels through here. Override with VITE_API_URL in the
// build environment if the backend moves off Render.

// VITE_API_URL should be origin-only (no trailing slash, no /api). We normalize
// defensively so a misconfigured env var can't produce `/api/api/...` URLs.
const rawOrigin =
  (import.meta.env.VITE_API_URL as string | undefined) || 'https://he-pursuit-api.onrender.com';

export const API_ORIGIN = rawOrigin.replace(/\/+$/, '').replace(/\/api$/, '');

export const API_BASE = `${API_ORIGIN}/api`;

 succeeded in 209ms:
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Target, Scale, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { API_BASE } from '../lib/api';
import { track } from '../lib/analytics';

type FormState = 'form' | 'verify';

interface FormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const initialForm: FormData = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export default function Signup() {
  const [state, setState] = useState<FormState>('form');
  const [form, setForm] = useState<FormData>(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleGoogleSignIn() {
    setError('');
    setGoogleLoading(true);
    track('signup_started', { method: 'google' });
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://pursuit.honestecho.com/auth/callback',
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (oauthError) {
        setError(oauthError.message);
        setGoogleLoading(false);
      }
      // On success Supabase redirects away â€” no need to reset loading.
    } catch {
      setError('Could not start Google sign-in. Please try again.');
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.fullName.trim()) { setError('Full name is required.'); return; }
    if (!form.company.trim()) { setError('Company name is required.'); return; }
    if (!form.email.trim()) { setError('Email is required.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    track('signup_started', { method: 'email' });
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            full_name: form.fullName.trim(),
            company: form.company.trim(),
            phone: form.phone.trim(),
          },
          emailRedirectTo: 'https://honestecho.com/welcome',
        },
      });

      if (signUpError) {
        if (signUpError.message.toLowerCase().includes('already registered')) {
          setError('An account with this email already exists. Try logging in.');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      track('signup_completed', { method: 'email' });

      // Send welcome email
      fetch(`${API_BASE}/public/welcome-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), fullName: form.fullName.trim() })
      }).catch(err => console.warn('Welcome email trigger failed:', err));

      if (data?.session) {
        // Email confirmation is disabled â€” session is live immediately.
        // Bridge to pursuit via URL hash tokens; Supabase client there picks
        // them up automatically and fires SIGNED_IN without a second login.
        const { access_token, refresh_token } = data.session;
        window.location.href =
          `https://pursuit.honestecho.com#access_token=${access_token}&refresh_token=${refresh_token}&type=signup`;
        return;
      }
      // Fallback: confirmation still required â€” show verify state.
      setState('verify');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResent(false);
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: form.email.trim(),
    });
    if (!resendError) setResent(true);
  }

  return (
    <>
      <Helmet>
        <title>Sign Up | Honest Echo</title>
        <meta name="description" content="Create your free Honest Echo account and start making smarter bid/no-bid decisions." />
      </Helmet>

      <div className="min-h-[calc(100vh-72px)] relative overflow-hidden flex items-center justify-center py-12">
        {/* Line grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px] z-0 pointer-events-none"></div>

        <div className="w-full max-w-5xl mx-auto px-6 flex flex-col lg:flex-row items-center lg:items-stretch gap-0 relative z-10">

        {/* Left column â€” value props (hidden on mobile) */}
        <div className="hidden lg:flex flex-col justify-start pt-8 w-[400px] shrink-0 pr-16">
          <h1 className="font-headline font-black text-4xl xl:text-5xl tracking-tighter text-white mb-4 leading-tight">
            Win more contracts.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c3ff] to-[#5b8cff]">Waste less time.</span>
          </h1>
          <p className="text-[#a0b2c8] text-lg mb-12 leading-relaxed font-body">
            The bid/no-bid intelligence engine built for small government contractors. Free to start.
          </p>

          <ul className="space-y-6">
            {[
              { icon: Zap, label: 'Scoring Built Around Your Business', body: 'Every opportunity evaluated against your NAICS codes, certifications, and pursuit history.' },
              { icon: Target, label: '5-Phase Pursuit Workflow', body: 'Structured analysis from first look to final Go/No-Go decision.' },
              { icon: Scale, label: 'Clear Bid/No-Bid Decisions', body: 'Every recommendation backed by structured analysis and a clear evidence trail.' },
            ].map(({ icon: Icon, label, body }) => (
              <li key={label} className="flex gap-4 items-start group/item">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 relative overflow-visible mt-0.5">
                  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover/item:opacity-50 transition-opacity duration-500 rounded-full scale-110"></div>
                  <Icon className="w-5 h-5 text-[#00c3ff] relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm font-headline">{label}</p>
                  <p className="text-[#a0b2c8] text-sm leading-relaxed">{body}</p>
                </div>
              </li>
            ))}
          </ul>

        </div>

        {/* Right column â€” form card */}
        <div className="flex-1 flex items-center justify-center lg:pl-16 py-8 lg:py-0">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <Link to="/" className="flex items-center gap-3 mb-10 lg:hidden group w-fit">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 rounded-full scale-150"></div>
                <Zap className="w-8 h-8 text-[#00c3ff] drop-shadow-[0_0_12px_rgba(0,195,255,0.8)] relative z-10" fill="currentColor" fillOpacity={0.2} strokeWidth={2} />
              </div>
              <span className="text-lg font-black tracking-tighter text-white font-headline">Honest Echo</span>
            </Link>

            {state === 'form' ? (
              <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent"></div>

                <h2 className="font-headline font-black text-2xl text-white mb-1">Create your account</h2>
                <p className="text-[#a0b2c8] text-sm mb-6 font-body">Free to start. No credit card required.</p>

                {/* Google OAuth â€” primary path */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || loading}
                  className="w-full py-3.5 bg-white text-[#1f2937] font-bold rounded-lg border border-[#d1d5db] hover:bg-[#f9fafb] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  {googleLoading ? 'Redirecting to Googleâ€¦' : 'Continue with Google'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-[#1e2d4a]" />
                  <span className="text-xs text-[#8b9bb4] uppercase tracking-widest font-body">or continue with email</span>
                  <div className="flex-1 h-px bg-[#1e2d4a]" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-1.5">Full Name</label>
                      <input
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        autoFocus
                        placeholder="Jane Smith"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors placeholder:text-[#8b9bb4]"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-1.5">Company</label>
                      <input
                        name="company"
                        type="text"
                        autoComplete="organization"
                        placeholder="Acme Federal LLC"
                        value={form.company}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors placeholder:text-[#8b9bb4]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-1.5">Work Email</label>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="jane@acmefederal.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors placeholder:text-[#8b9bb4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-1.5">
                      Phone <span className="text-[#8b9bb4] normal-case font-normal tracking-normal">(optional)</span>
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors placeholder:text-[#8b9bb4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Min. 8 characters"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors placeholder:text-[#8b9bb4]"
                      />
                      <button type="button" onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b9bb4] hover:text-white transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-widest mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Repeat password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#060e1c] border border-[#1e2d4a] text-white rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[#00c3ff]/60 transition-colors placeholder:text-[#8b9bb4]"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b9bb4] hover:text-white transition-colors">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm bg-red-900/20 border border-red-700/30 rounded-lg px-4 py-3">{error}</p>
                  )}

                  <p className="text-xs text-[#64748b] text-center leading-relaxed">
                    By creating an account, you agree to our{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#00c3ff] hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#00c3ff] hover:underline">Privacy Policy</a>.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {loading ? 'Creating accountâ€¦' : (
                      <>Create Free Account <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-xs text-[#8b9bb4] font-body">
                  Already have an account?{' '}
                  <a href="https://pursuit.honestecho.com" target="_blank" rel="noopener noreferrer" className="text-[#00c3ff] hover:text-white transition-colors">
                    Sign in
                  </a>
                </p>
              </div>
            ) : (
              /* Post-signup state â€” account created, go to app */
              <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-10 shadow-2xl relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent"></div>

                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-xl opacity-25 rounded-full"></div>
                    <CheckCircle2 className="w-10 h-10 text-[#00c3ff] drop-shadow-[0_0_15px_rgba(0,195,255,0.8)] relative z-10" strokeWidth={1.5} />
                  </div>
                </div>

                <h2 className="font-headline font-black text-2xl text-white mb-3">You're in.</h2>
                <p className="text-[#a0b2c8] text-sm mb-2 font-body">Account created for</p>
                <p className="text-white font-bold mb-8 text-sm">{form.email}</p>
                <p className="text-[#8b9bb4] text-xs mb-8 font-body leading-relaxed">
                  We sent a confirmation email so you can verify later. For now, head straight to your dashboard and set up your first pursuit.
                </p>

                <div className="space-y-3">
                  <a
                    href="https://pursuit.honestecho.com"
                    className="w-full py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
                  >
                    Open HE Pursuit <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={handleResend}
                    className="block w-full py-3 border border-[#1e2d4a] text-[#a0b2c8] text-sm font-body rounded-lg hover:bg-[#152033] hover:text-white transition-all"
                  >
                    {resent ? 'Confirmation email resent.' : 'Resend confirmation email'}
                  </button>
                </div>

                <p className="mt-6 text-xs text-[#8b9bb4] font-body">
                  <Link to="/" className="text-[#00c3ff] hover:text-white transition-colors">â† Back to home</Link>
                </p>
              </div>
            )}
          </div>
        </div>
        </div>{/* end max-w-5xl wrapper */}
      </div>
    </>
  );
}

 succeeded in 234ms:
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  ShieldCheck,
  Gauge,
  TrendingUp,
  FileText,
  Building2,
  Calendar,
  Hash,
  Tag,
  Sparkles,
  Loader2,
  Link2Off,
  AlertCircle,
} from 'lucide-react';
import { API_BASE } from '../lib/api';
import { track } from '../lib/analytics';

// API base is centralized in lib/api (he-pursuit-api.onrender.com). The old
// hard-coded pursuit.honestecho.com/api fallback returned SPA HTML for this GET,
// which broke every shared-package link in production.

// â”€â”€ Snapshot shape (matches api-server.js assembleShareSnapshot) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface Snapshot {
  shared_at: string;
  company: { name: string | null };
  opportunity: {
    rfi_title: string | null;
    issuing_agency: string | null;
    notice_type: string | null;
    reference_number: string | null;
    due_date: string | null;
    naics_codes: string | null;
    set_aside: string | null;
    purpose: string | null;
  };
  phase1: { triage_status: string | null };
  phase2: {
    eligibility_status: string | null;
    disqualifier_count: number;
    disqualifier_summary: string[];
    requirement_count: number;
    top_requirement_categories: string[];
  };
  phase3: {
    strategic_value: string | null;
    strategic_total: number | null;
  };
  phase4: {
    overall_effort: string | null;
    win_probability: string | null;
    effort_total: number | null;
  };
  phase5: {
    decision: string | null;
    rationale: string | null;
  };
}

type FetchState =
  | { kind: 'loading' }
  | { kind: 'ok'; snapshot: Snapshot; createdAt: string }
  | { kind: 'error'; reason: 'not_found' | 'revoked' | 'expired' | 'rate_limited' | 'server_error' };

// â”€â”€ Decision styling â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function decisionStyle(decision: string | null) {
  const d = (decision || '').toUpperCase();
  if (d === 'GO') {
    return {
      label: 'Pursue',
      Icon: CheckCircle2,
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_60px_rgba(16,185,129,0.15)]',
    };
  }
  if (d === 'CONDITIONAL_GO') {
    return {
      label: 'Conditionally Pursue',
      Icon: AlertTriangle,
      border: 'border-amber-500/40',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_60px_rgba(245,158,11,0.12)]',
    };
  }
  if (d === 'WATCH') {
    return {
      label: 'Watch',
      Icon: Eye,
      border: 'border-sky-500/40',
      bg: 'bg-sky-500/10',
      text: 'text-sky-400',
      glow: 'shadow-[0_0_60px_rgba(14,165,233,0.12)]',
    };
  }
  if (d === 'NO_GO') {
    return {
      label: 'No-Go',
      Icon: XCircle,
      border: 'border-red-500/40',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      glow: 'shadow-[0_0_60px_rgba(239,68,68,0.12)]',
    };
  }
  return {
    label: 'Decision pending',
    Icon: FileText,
    border: 'border-[#1e2d4a]',
    bg: 'bg-[#8b9bb4]/10',
    text: 'text-[#a0b2c8]',
    glow: '',
  };
}

// â”€â”€ Small labeled row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number | null | undefined;
}) {
  const displayed = value === null || value === undefined || value === '' ? 'Not stated' : String(value);
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#1e2d4a] last:border-b-0">
      <div className="w-8 h-8 flex-shrink-0 rounded-md bg-[#0d1827] border border-[#1e2d4a] flex items-center justify-center">
        <Icon size={15} className="text-[#00c3ff]" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold text-[#8b9bb4] uppercase tracking-widest font-label mb-0.5">
          {label}
        </div>
        <div className="text-sm text-white font-body break-words">{displayed}</div>
      </div>
    </div>
  );
}

// â”€â”€ Summary stat block â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function StatBlock({
  icon: Icon,
  label,
  value,
  sub,
  tone = 'neutral',
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string | null;
  tone?: 'neutral' | 'good' | 'warn' | 'bad';
}) {
  const toneMap = {
    neutral: 'text-[#a0b2c8]',
    good:    'text-emerald-400',
    warn:    'text-amber-400',
    bad:     'text-red-400',
  };
  return (
    <div className="rounded-xl bg-[#0b1120] border border-[#1e2d4a] p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={13} className="text-[#8b9bb4]" strokeWidth={2} />
        <span className="text-[10px] font-bold text-[#8b9bb4] uppercase tracking-widest font-label">
          {label}
        </span>
      </div>
      <p className={`text-lg font-bold font-headline leading-tight ${toneMap[tone]}`}>{value}</p>
      {sub && <p className="text-xs text-[#8b9bb4] mt-1 font-body">{sub}</p>}
    </div>
  );
}

function eligibilityTone(v: string | null): 'good' | 'warn' | 'bad' | 'neutral' {
  if (v === 'eligible') return 'good';
  if (v === 'eligible_with_caution') return 'warn';
  if (v === 'likely_disqualified') return 'bad';
  return 'neutral';
}
function eligibilityLabel(v: string | null): string {
  if (!v) return 'Not set';
  return v
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
function strategicTone(v: string | null): 'good' | 'warn' | 'bad' | 'neutral' {
  if (v === 'high') return 'good';
  if (v === 'medium') return 'warn';
  if (v === 'low') return 'bad';
  return 'neutral';
}
function effortTone(v: string | null): 'good' | 'warn' | 'bad' | 'neutral' {
  if (v === 'low') return 'good';
  if (v === 'moderate') return 'warn';
  if (v === 'high' || v === 'very_high') return 'bad';
  return 'neutral';
}
function winTone(v: string | null): 'good' | 'warn' | 'bad' | 'neutral' {
  if (v === 'high') return 'good';
  if (v === 'medium') return 'warn';
  if (v === 'low') return 'bad';
  return 'neutral';
}
function titleCase(v: string | null): string {
  if (!v) return 'Not set';
  return v
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function SharedPackage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<FetchState>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!token || !/^[A-Za-z0-9]{22}$/.test(token)) {
        setState({ kind: 'error', reason: 'not_found' });
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/public/shared/${token}`);
        const body = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.status === 200 && body?.success) {
          track('shared_package_viewed', { token });
          setState({ kind: 'ok', snapshot: body.snapshot as Snapshot, createdAt: body.created_at });
          return;
        }
        const reason =
          body?.reason === 'revoked' ? 'revoked' :
          body?.reason === 'expired' ? 'expired' :
          body?.reason === 'rate_limited' ? 'rate_limited' :
          res.status === 429 ? 'rate_limited' :
          res.status === 410 ? 'revoked' :
          res.status === 404 ? 'not_found' :
          'server_error';
        setState({ kind: 'error', reason });
      } catch {
        if (cancelled) return;
        setState({ kind: 'error', reason: 'server_error' });
      }
    }
    load();
    return () => { cancelled = true; };
  }, [token]);

  // â”€â”€ Error states â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (state.kind === 'error') {
    const messages: Record<string, { title: string; body: string; Icon: React.ElementType }> = {
      not_found: {
        title: "We couldn't find that link.",
        body: 'It may have been revoked or mistyped.',
        Icon: Link2Off,
      },
      revoked: {
        title: 'The owner has disabled this link.',
        body: 'If you need access, contact them directly.',
        Icon: Link2Off,
      },
      expired: {
        title: 'This link has expired.',
        body: 'If you need access, ask the owner for a new link.',
        Icon: AlertCircle,
      },
      rate_limited: {
        title: 'Too many views from your location.',
        body: 'Try again in an hour.',
        Icon: AlertCircle,
      },
      server_error: {
        title: 'Something went wrong.',
        body: "We couldn't load this page right now. Try refreshing in a moment.",
        Icon: AlertCircle,
      },
    };
    const m = messages[state.reason] || messages.server_error;
    return (
      <>
        <Helmet>
          <title>Shared Decision Package Â· HE Pursuit</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <section className="pt-16 pb-20 px-6">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#0b1120] border border-[#1e2d4a] flex items-center justify-center mb-5">
              <m.Icon size={24} className="text-[#00c3ff]" strokeWidth={2} />
            </div>
            <h1 className="font-headline font-black text-3xl md:text-4xl text-white mb-3 tracking-tight">
              {m.title}
            </h1>
            <p className="text-[#a0b2c8] font-body mb-8">{m.body}</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Visit honestecho.com
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </>
    );
  }

  // â”€â”€ Loading skeleton â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (state.kind === 'loading') {
    return (
      <>
        <Helmet>
          <title>Shared Decision Package Â· HE Pursuit</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <section className="pt-16 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8b9bb4] uppercase tracking-widest mb-8">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00c3ff]" />
              Loading decision packageâ€¦
            </div>
            <div className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] shadow-2xl p-6 md:p-8 animate-pulse">
              <div className="h-6 w-32 bg-[#152033] rounded mb-4" />
              <div className="h-8 w-3/4 bg-[#152033] rounded mb-3" />
              <div className="h-4 w-1/2 bg-[#152033] rounded mb-6" />
              <div className="space-y-3">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#152033]" />
                    <div className="h-4 bg-[#152033] rounded flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // â”€â”€ Success render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const { snapshot, createdAt } = state;
  const decision = decisionStyle(snapshot.phase5.decision);

  const sharedDate = new Date(createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      <Helmet>
        <title>
          {snapshot.opportunity.rfi_title
            ? `${snapshot.opportunity.rfi_title} Â· Decision Package Â· HE Pursuit`
            : 'Decision Package Â· HE Pursuit'}
        </title>
        <meta name="robots" content="noindex, nofollow" />
        {token && (
          <link rel="canonical" href={`https://honestecho.com/p/${token}`} />
        )}
      </Helmet>

      {/* â”€â”€ Shared banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="pt-16 pb-6 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#0d1827] border border-[#1e2d4a] flex items-center justify-center">
              <Sparkles size={13} className="text-[#00c3ff]" />
            </div>
            <p className="text-xs text-[#8b9bb4] font-body">
              <span className="font-bold text-white">Decision Package</span>
              {snapshot.company.name && (
                <>
                  {' Â· '}
                  <span className="text-[#a0b2c8]">{snapshot.company.name}</span>
                </>
              )}
              {' Â· '}
              <span className="text-[#a0b2c8]">Shared {sharedDate}</span>
            </p>
          </div>
          <Link
            to="/"
            className="text-xs text-[#8b9bb4] hover:text-[#00c3ff] font-body transition-colors"
          >
            Powered by HE Pursuit â†’
          </Link>
        </div>
      </section>

      {/* â”€â”€ Opportunity card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="pb-6 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-[#0b1120] border border-[#1e2d4a] p-6 md:p-8 shadow-2xl">
            <h1 className="font-headline font-black text-2xl md:text-3xl text-white mb-2 tracking-tight leading-tight">
              {snapshot.opportunity.rfi_title || 'Untitled opportunity'}
            </h1>
            <p className="text-[#a0b2c8] text-sm font-body mb-6">
              {snapshot.opportunity.issuing_agency || 'Agency not stated'}
              {snapshot.opportunity.notice_type ? ` Â· ${snapshot.opportunity.notice_type}` : ''}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <Field icon={Hash}        label="Reference Number" value={snapshot.opportunity.reference_number} />
              <Field icon={Building2}   label="Issuing Agency"   value={snapshot.opportunity.issuing_agency} />
              <Field icon={FileText}    label="Notice Type"      value={snapshot.opportunity.notice_type} />
              <Field icon={Calendar}    label="Response Deadline" value={snapshot.opportunity.due_date} />
              <Field icon={Tag}         label="NAICS Code(s)"     value={snapshot.opportunity.naics_codes} />
              <Field icon={ShieldCheck} label="Set-Aside"         value={snapshot.opportunity.set_aside} />
            </div>

            {snapshot.opportunity.purpose && (
              <div className="mt-6 pt-6 border-t border-[#1e2d4a]">
                <div className="text-[10px] font-bold text-[#8b9bb4] uppercase tracking-widest font-label mb-2">
                  Purpose
                </div>
                <p className="text-sm text-white font-body leading-relaxed">
                  {snapshot.opportunity.purpose}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* â”€â”€ Final recommendation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="pb-6 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className={`rounded-2xl bg-[#0b1120] border ${decision.border} p-6 md:p-8 ${decision.glow}`}
          >
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${decision.bg} ${decision.border} border mb-5`}
            >
              <decision.Icon size={14} className={decision.text} strokeWidth={2.5} />
              <span
                className={`text-xs font-bold uppercase tracking-widest font-label ${decision.text}`}
              >
                Final Recommendation
              </span>
            </div>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-3 tracking-tight leading-tight">
              {decision.label}
            </h2>
            {snapshot.phase5.rationale && (
              <p className="text-[#a0b2c8] font-body leading-relaxed max-w-2xl">
                {snapshot.phase5.rationale}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* â”€â”€ Summary blocks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="pb-6 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xs font-bold text-[#8b9bb4] uppercase tracking-widest font-label mb-3">
            Analysis Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBlock
              icon={ShieldCheck}
              label="Eligibility"
              value={eligibilityLabel(snapshot.phase2.eligibility_status)}
              sub={
                snapshot.phase2.disqualifier_count > 0
                  ? `${snapshot.phase2.disqualifier_count} disqualifier flag${
                      snapshot.phase2.disqualifier_count === 1 ? '' : 's'
                    }`
                  : 'No disqualifier flags'
              }
              tone={eligibilityTone(snapshot.phase2.eligibility_status)}
            />
            <StatBlock
              icon={TrendingUp}
              label="Strategic Fit"
              value={titleCase(snapshot.phase3.strategic_value)}
              sub={
                snapshot.phase3.strategic_total !== null
                  ? `Score: ${snapshot.phase3.strategic_total}/21`
                  : null
              }
              tone={strategicTone(snapshot.phase3.strategic_value)}
            />
            <StatBlock
              icon={Gauge}
              label="Effort"
              value={titleCase(snapshot.phase4.overall_effort)}
              sub={null}
              tone={effortTone(snapshot.phase4.overall_effort)}
            />
            <StatBlock
              icon={TrendingUp}
              label="Win Probability"
              value={titleCase(snapshot.phase4.win_probability)}
              sub={null}
              tone={winTone(snapshot.phase4.win_probability)}
            />
          </div>

          {/* Requirements roll-up */}
          {snapshot.phase2.requirement_count > 0 && (
            <div className="mt-4 rounded-xl bg-[#0b1120] border border-[#1e2d4a] p-5">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={13} className="text-[#8b9bb4]" strokeWidth={2} />
                <span className="text-[10px] font-bold text-[#8b9bb4] uppercase tracking-widest font-label">
                  Requirements
                </span>
              </div>
              <p className="text-sm text-white font-body">
                <span className="font-bold">{snapshot.phase2.requirement_count}</span>{' '}
                requirements identified
                {snapshot.phase2.top_requirement_categories.length > 0 && (
                  <>
                    {' '}â€” top categories:{' '}
                    <span className="text-[#a0b2c8]">
                      {snapshot.phase2.top_requirement_categories.join(', ')}
                    </span>
                  </>
                )}
              </p>
            </div>
          )}

          {/* Disqualifier summary */}
          {snapshot.phase2.disqualifier_summary.length > 0 && (
            <div className="mt-4 rounded-xl bg-[#0b1120] border border-amber-500/30 p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={13} className="text-amber-400" strokeWidth={2} />
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-label">
                  Eligibility Flags
                </span>
              </div>
              <ul className="text-sm text-[#a0b2c8] font-body space-y-1">
                {snapshot.phase2.disqualifier_summary.map(d => (
                  <li key={d} className="flex gap-2">
                    <span className="text-amber-400">â€¢</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* â”€â”€ About the analysis â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-[#0b1120] border border-[#00c3ff]/30 p-6 md:p-8 shadow-[0_0_40px_rgba(0,195,255,0.08)]">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h3 className="font-headline font-black text-xl md:text-2xl text-white mb-2 tracking-tight">
                  Analyze your own SAM.gov opportunity â€” free.
                </h3>
                <p className="text-[#a0b2c8] font-body">
                  This decision package was generated by HE Pursuit in under 3 minutes. Paste any
                  SAM.gov Notice ID or URL into the free analyzer and see the same structured
                  triage on your own opportunity.
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
                <Link
                  to="/tools/sam-gov-notice-analyzer"
                  className="px-6 py-3 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_30px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Try the free analyzer
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Create a free account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ Footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-[#8b9bb4] font-body">
            Powered by{' '}
            <Link to="/" className="text-[#00c3ff] hover:text-white transition-colors">
              HE Pursuit
            </Link>
            {' Â· '}
            <Link to="/" className="text-[#8b9bb4] hover:text-[#00c3ff] transition-colors">
              honestecho.com
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

codex
I’ve confirmed `API_BASE` normalizes to `https://he-pursuit-api.onrender.com/api` by default, so the shared link host change is directionally correct. I’m checking the route imports and whether the new analytics events line up with the async flows.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Path src\\App.tsx" in C:\Users\aaron\OneDrive\Honest Echo LLC\Antigravity\HE Website - 1
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "rg -n \"signup_submitted|signup_started|signup_completed|shared_package_viewed|track\\(\" src" in C:\Users\aaron\OneDrive\Honest Echo LLC\Antigravity\HE Website - 1
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg -n "Coming Q3|Q3 2026|Coming Soon|Limited|Per-pursuit" src' in C:\Users\aaron\OneDrive\Honest Echo LLC\Antigravity\HE Website - 1
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "rg -n \"from './pages/|from \\\"./pages/|import\\('./pages/|<Route\" src\\App.tsx src" in C:\Users\aaron\OneDrive\Honest Echo LLC\Antigravity\HE Website - 1
 declined in 0ms:
`"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "rg -n \"from './pages/|from \\\"./pages/|import\\('./pages/|<Route\" src\\App.tsx src"` rejected: blocked by policy
2026-06-03T17:40:12.942162Z ERROR codex_core::tools::router: error=`"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "rg -n \"from './pages/|from \\\"./pages/|import\\('./pages/|<Route\" src\\App.tsx src"` rejected: blocked by policy
 succeeded in 173ms:
import { useEffect, useLayoutEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import { OrganizationSchema } from './components/SchemaOrg';
import { track } from './lib/analytics';

// Home stays eager (it's the landing LCP). Everything else is code-split into
// its own chunk so the initial bundle isn't dragged down by framer-motion-heavy
// secondary pages.
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const AppRedirect = lazy(() => import('./pages/AppRedirect'));
const Signup = lazy(() => import('./pages/Signup'));
const Welcome = lazy(() => import('./pages/Welcome'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Security = lazy(() => import('./pages/Security'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const FAQ = lazy(() => import('./pages/FAQ'));
const VsGovWin = lazy(() => import('./pages/VsGovWin'));
const VsGovTribe = lazy(() => import('./pages/VsGovTribe'));
const SamGovAnalysis = lazy(() => import('./pages/SamGovAnalysis'));
const SamGovNoticeAnalyzer = lazy(() => import('./pages/SamGovNoticeAnalyzer'));
const SharedPackage = lazy(() => import('./pages/SharedPackage'));
const TeamWaitlist = lazy(() => import('./pages/TeamWaitlist'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PageViews() {
  const { pathname } = useLocation();
  useEffect(() => { track('page_viewed', { path: pathname }); }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#030B17] relative">
      {/* Global background â€” grid + two drifting glow blobs */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:48px_48px]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-glow-a w-[150vw] h-[150vh] rounded-full blur-[160px] bg-[radial-gradient(ellipse,rgba(0,195,255,0.40)_0%,rgba(91,140,255,0.16)_45%,transparent_72%)]"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-glow-b w-[120vw] h-[120vh] rounded-full blur-[140px] bg-[radial-gradient(ellipse,rgba(91,140,255,0.28)_0%,rgba(0,195,255,0.10)_52%,transparent_75%)]"></div>
        </div>
      </div>
      <OrganizationSchema />
      <ScrollToTop />
      <PageViews />
      <Navbar />
      <main className="flex-grow relative z-10">
        <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Navigate to="/" replace />} />
          <Route path="/platform" element={<Navigate to="/" replace />} />
          <Route path="/consulting" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/app" element={<AppRedirect />} />
          <Route path="/pursuit" element={<AppRedirect />} />
          <Route path="/security" element={<Security />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/vs-govwin" element={<VsGovWin />} />
          <Route path="/vs-govtribe" element={<VsGovTribe />} />
          <Route path="/sam-gov-opportunity-analysis" element={<SamGovAnalysis />} />
          <Route path="/tools/sam-gov-notice-analyzer" element={<SamGovNoticeAnalyzer />} />
          <Route path="/p/:token" element={<SharedPackage />} />
          <Route path="/team-waitlist" element={<TeamWaitlist />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;

 succeeded in 157ms:
src\App.tsx:39:  useEffect(() => { track('page_viewed', { path: pathname }); }, [pathname]);
src\lib\analytics.ts:24:export function track(event: string, props: Record<string, unknown> = {}): void {
src\pages\SharedPackage.tsx:246:          track('shared_package_viewed', { token });
src\pages\SamGovNoticeAnalyzer.tsx:79:  useEffect(() => { track('public_analyzer_page_viewed'); }, []);
src\pages\SamGovNoticeAnalyzer.tsx:91:    track('public_analyzer_input_submitted', { parsed_from_url: parsedFromUrl });
src\pages\SamGovNoticeAnalyzer.tsx:105:        track('public_analyzer_rate_limit_hit');
src\pages\SamGovNoticeAnalyzer.tsx:111:        track('public_analyzer_invalid_input');
src\pages\SamGovNoticeAnalyzer.tsx:117:        track('public_analyzer_notice_not_found');
src\pages\SamGovNoticeAnalyzer.tsx:132:      track('public_analyzer_result_rendered', {
src\pages\SamGovNoticeAnalyzer.tsx:256:                    onTrack={event => track(event, { notice_id: result.noticeId })}
src\pages\SamGovNoticeAnalyzer.tsx:302:                        onClick={() => track('public_analyzer_unlock_cta_clicked', { notice_id: result.noticeId })}
src\pages\Contact.tsx:52:      track('contact_submitted');
src\pages\TeamWaitlist.tsx:53:      track('team_waitlist_submitted', { team_size: teamSize || undefined });
src\pages\Signup.tsx:47:    track('signup_started', { method: 'google' });
src\pages\Signup.tsx:78:    track('signup_started', { method: 'email' });
src\pages\Signup.tsx:102:      track('signup_completed', { method: 'email' });

 succeeded in 157ms:
src\pages\Home.tsx:418:                <span className="text-[10px] font-bold text-[#030B17] bg-[#00c3ff] px-2 py-0.5 rounded-full uppercase tracking-widest">Coming Soon</span>
src\pages\SamGovNoticeAnalyzer.tsx:77:  const [rateLimited, setRateLimited] = useState(false);
src\pages\SamGovNoticeAnalyzer.tsx:84:    setRateLimited(false);
src\pages\SamGovNoticeAnalyzer.tsx:103:        setRateLimited(true);
src\pages\SamGovNoticeAnalyzer.tsx:222:                  <div className={`absolute inset-0 blur-sm rounded-full opacity-25 ${rateLimited ? 'bg-[#00c3ff]' : 'bg-[#f87171]'}`} />
src\pages\SamGovNoticeAnalyzer.tsx:223:                  <AlertCircle className={`w-4 h-4 relative z-10 ${rateLimited ? 'text-[#00c3ff]' : 'text-[#f87171]'}`} strokeWidth={2} />
src\pages\SamGovNoticeAnalyzer.tsx:227:                  {rateLimited && (
src\pages\SamGovNoticeAnalyzer.tsx:351:                body: 'Free and anonymous. Limited analyses per hour. Upgrade to run unlimited pursuits with personalized analysis across your full pipeline.',
src\pages\Pricing.tsx:33:  { category: 'Decisions & Output', name: 'Decision tracking & history',   free: 'none', starter: 'Per-pursuit', pro: 'check', team: 'check' },
src\pages\Pricing.tsx:136:    badge: 'Coming Soon',
src\pages\TeamWaitlist.tsx:83:            <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Coming Soon</span>

codex
1. **SHOULD-FIX** [src/pages/Signup.tsx](/mnt/c/Users/aaron/OneDrive/Honest%20Echo%20LLC/Antigravity/HE%20Website%20-%201/src/pages/Signup.tsx:47): Google signup now records `signup_started`, but there is still no `signup_completed` event for successful Google OAuth. If the backend funnel expects `started -> completed` by method, Google signups will look abandoned.
   Fix: emit `signup_completed` from the OAuth callback/backend/app once the Google signup session is actually established, not immediately before redirect.

2. **SHOULD-FIX** [src/pages/SharedPackage.tsx](/mnt/c/Users/aaron/OneDrive/Honest%20Echo%20LLC/Antigravity/HE%20Website%20-%201/src/pages/SharedPackage.tsx:246): `shared_package_viewed` includes the raw share `token`. These tokens are bearer-style access secrets, so analytics storage now becomes another place valid shared-link credentials can leak.
   Fix: omit the token, or send a non-sensitive identifier such as a backend share id, hash, or short prefix if correlation is required.

No blocker found in the lazy/Suspense change. `App.tsx` only eagerly imports `Home` from `./pages`, and the single `<Suspense>` around `<Routes>` is valid. The `SharedPackage` API host fix is correct based on `lib/api.ts`: default resolves to `https://he-pursuit-api.onrender.com/api`, with `/api` normalization for env overrides.
tokens used
24,554
1. **SHOULD-FIX** [src/pages/Signup.tsx](/mnt/c/Users/aaron/OneDrive/Honest%20Echo%20LLC/Antigravity/HE%20Website%20-%201/src/pages/Signup.tsx:47): Google signup now records `signup_started`, but there is still no `signup_completed` event for successful Google OAuth. If the backend funnel expects `started -> completed` by method, Google signups will look abandoned.
   Fix: emit `signup_completed` from the OAuth callback/backend/app once the Google signup session is actually established, not immediately before redirect.

2. **SHOULD-FIX** [src/pages/SharedPackage.tsx](/mnt/c/Users/aaron/OneDrive/Honest%20Echo%20LLC/Antigravity/HE%20Website%20-%201/src/pages/SharedPackage.tsx:246): `shared_package_viewed` includes the raw share `token`. These tokens are bearer-style access secrets, so analytics storage now becomes another place valid shared-link credentials can leak.
   Fix: omit the token, or send a non-sensitive identifier such as a backend share id, hash, or short prefix if correlation is required.

No blocker found in the lazy/Suspense change. `App.tsx` only eagerly imports `Home` from `./pages`, and the single `<Suspense>` around `<Routes>` is valid. The `SharedPackage` API host fix is correct based on `lib/api.ts`: default resolves to `https://he-pursuit-api.onrender.com/api`, with `/api` normalization for env overrides.
