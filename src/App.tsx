import { useEffect, useLayoutEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import { OrganizationSchema } from './components/SchemaOrg';
import { track } from './lib/analytics';

// Eager pages: the LCP landing (Home) plus the dedicated SEO landing pages
// (pricing + the three comparison/analysis pages). These receive hard-load
// organic/ad traffic, and a lazy() Suspense boundary flashes its fallback over
// the prerendered content during the initial client render — a ~0.3 CLS exactly
// on the pages where Core Web Vitals affect ranking. Eager-loading removes the
// boundary so they render in place with no shift (like Home). None of these pull
// framer-motion (that's only in Home's hero), so the bundle cost is small.
import Pricing from './pages/Pricing';
import VsGovWin from './pages/VsGovWin';
import VsGovTribe from './pages/VsGovTribe';
import SamGovAnalysis from './pages/SamGovAnalysis';
import SamGovHiddenOpportunities from './pages/SamGovHiddenOpportunities';
import SourcesSoughtGuide from './pages/SourcesSoughtGuide';
import SamGovRecompeteTracking from './pages/SamGovRecompeteTracking';
import ForSmallBusinessOwners from './pages/ForSmallBusinessOwners';
import ForProposalManagers from './pages/ForProposalManagers';
import ForGovconConsultants from './pages/ForGovconConsultants';

// Everything else stays code-split — lower-traffic / interactive pages where a
// brief hard-load shift is inconsequential and the bundle savings are worth more.
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const AppRedirect = lazy(() => import('./pages/AppRedirect'));
const Signup = lazy(() => import('./pages/Signup'));
const Welcome = lazy(() => import('./pages/Welcome'));
const Security = lazy(() => import('./pages/Security'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const FAQ = lazy(() => import('./pages/FAQ'));
const SamGovNoticeAnalyzer = lazy(() => import('./pages/SamGovNoticeAnalyzer'));
const PursuitReadout = lazy(() => import('./pages/PursuitReadout'));
const SharedPackage = lazy(() => import('./pages/SharedPackage'));
const TeamWaitlist = lazy(() => import('./pages/TeamWaitlist'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Own scroll restoration before hydration. With the default 'auto', the browser
// restores the previous (bottom-of-page) scroll position during hydration/layout
// of the prerendered build *after* our scrollTo runs — so footer-link clicks would
// land mid-page in prod (never reproduces in dev, which serves no prerendered HTML).
// Module scope so it runs at import, before hydrateRoot; guarded for the prerender
// pass where `window` is absent.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => {
    // No hash → normal top-scroll on route change. Scroll synchronously (no flash)
    // and re-assert across the next two frames (true post-paint) to defeat any late
    // browser scroll restoration in the hydrated build.
    if (!hash) {
      window.scrollTo(0, 0);
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(() => window.scrollTo(0, 0)); });
      return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
    }
    // Hash → scroll to the target once it mounts. Routes are lazy-loaded, so the
    // element may not exist on the first frame; retry across a few frames before
    // falling back to top. scroll-mt-* on targets offsets the sticky navbar.
    let raf = 0;
    let tries = 0;
    const id = hash.slice(1);
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView(); return; }
      if (tries++ < 30) { raf = requestAnimationFrame(tryScroll); return; }
      window.scrollTo(0, 0);
    };
    tryScroll();
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);
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
          <Route path="/vs-govwin/" element={<VsGovWin />} />
          <Route path="/vs-govtribe" element={<VsGovTribe />} />
          <Route path="/vs-govtribe/" element={<VsGovTribe />} />
          <Route path="/sam-gov-opportunity-analysis" element={<SamGovAnalysis />} />
          <Route path="/sam-gov-hidden-opportunities" element={<SamGovHiddenOpportunities />} />
          <Route path="/sam-gov-hidden-opportunities/" element={<SamGovHiddenOpportunities />} />
          <Route path="/sources-sought-worth-responding" element={<SourcesSoughtGuide />} />
          <Route path="/sources-sought-worth-responding/" element={<SourcesSoughtGuide />} />
          <Route path="/sam-gov-recompete-tracking" element={<SamGovRecompeteTracking />} />
          <Route path="/sam-gov-recompete-tracking/" element={<SamGovRecompeteTracking />} />
          <Route path="/for-small-business-owners" element={<ForSmallBusinessOwners />} />
          <Route path="/for-small-business-owners/" element={<ForSmallBusinessOwners />} />
          <Route path="/for-proposal-managers" element={<ForProposalManagers />} />
          <Route path="/for-proposal-managers/" element={<ForProposalManagers />} />
          <Route path="/for-govcon-consultants" element={<ForGovconConsultants />} />
          <Route path="/for-govcon-consultants/" element={<ForGovconConsultants />} />
          <Route path="/tools/sam-gov-notice-analyzer" element={<SamGovNoticeAnalyzer />} />
          <Route path="/tools/pursuit-readout" element={<PursuitReadout />} />
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
