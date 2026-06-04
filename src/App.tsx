import { useEffect, useLayoutEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import { OrganizationSchema } from './components/SchemaOrg';
import { track } from './lib/analytics';

// Home stays eager (it's the landing LCP). Everything else is code-split into
// its own chunk so the initial bundle isn't dragged down by framer-motion-heavy
// secondary pages. The prerender (scripts/prerender.js) resolves these lazy
// boundaries via React 19's async prerenderToNodeStream, so SSG still produces
// full per-route HTML + Helmet head — see src/entry-server.tsx.
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
      {/* Global background — grid + two drifting glow blobs */}
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
