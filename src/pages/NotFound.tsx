import { Helmet } from 'react-helmet-async';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Honest Echo</title>
        <meta name="description" content="The page you are looking for could not be found." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="pt-32 pb-24 px-6 relative overflow-hidden min-h-[70vh] flex flex-col justify-center">
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,195,255,0.08)_0%,transparent_60%)] pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 mx-auto flex items-center justify-center relative overflow-visible mb-8 group">
            <div className="absolute inset-0 bg-[#00c3ff] blur-xl opacity-20 rounded-full scale-150"></div>
            <AlertTriangle className="w-10 h-10 text-[#00c3ff] drop-shadow-[0_0_15px_rgba(0,195,255,1)] relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={1.5} />
          </div>
          
          <p className="text-[#8b9bb4] text-xs font-bold uppercase tracking-widest font-label mb-4">
            Error 404
          </p>
          <h1 className="font-headline font-black text-5xl md:text-6xl text-white mb-6 tracking-tighter leading-tight drop-shadow-2xl">
            Signal Lost.
          </h1>
          <p className="text-[#a0b2c8] text-lg mb-10 leading-relaxed font-body max-w-lg mx-auto">
            The page you're looking for doesn't exist or has been moved. Check the URL or return to the command center.
          </p>

          <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030B17]">
            Return to Home
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">
            <Link to="/tools/sam-gov-notice-analyzer/" className="text-sm text-[#8b9bb4] hover:text-[#00c3ff] transition-colors font-body">
              Try the free SAM.gov analyzer &rarr;
            </Link>
            <Link to="/pricing/" className="text-sm text-[#8b9bb4] hover:text-[#00c3ff] transition-colors font-body">
              See pricing &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
