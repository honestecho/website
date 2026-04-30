import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import AppRedirect from './pages/AppRedirect';
import Signup from './pages/Signup';
import Welcome from './pages/Welcome';
import Pricing from './pages/Pricing';
import Security from './pages/Security';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import FAQ from './pages/FAQ';
import VsGovWin from './pages/VsGovWin';
import VsGovTribe from './pages/VsGovTribe';
import SamGovAnalysis from './pages/SamGovAnalysis';
import SamGovNoticeAnalyzer from './pages/SamGovNoticeAnalyzer';
import SharedPackage from './pages/SharedPackage';
import TeamWaitlist from './pages/TeamWaitlist';
import NotFound from './pages/NotFound';
import { OrganizationSchema } from './components/SchemaOrg';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, [pathname]);
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
      <Navbar />
      <main className="flex-grow relative z-10">
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
      </main>
      <Footer />
    </div>
  );
}

export default App;
