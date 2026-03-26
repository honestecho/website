import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AppRedirect() {
  const [loadingText, setLoadingText] = useState('Initializing Secure Session...');

  useEffect(() => {
    const timer1 = setTimeout(() => setLoadingText('Authenticating Credentials...'), 1200);
    const timer2 = setTimeout(() => setLoadingText('Loading Pursuit Workspace...'), 2400);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>App Login | Honest Echo</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
        <div className="bg-surface-container-low p-12 rounded-2xl border border-outline-variant/20 shadow-2xl w-full max-w-md text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container via-secondary to-tertiary"></div>
          
          <Loader2 className="w-12 h-12 text-primary-container animate-spin mx-auto mb-6" />
          
          <h1 className="font-headline font-bold text-2xl text-white mb-2">System Access</h1>
          <p className="text-on-surface-variant text-sm font-label tracking-wide uppercase mb-8">
            {loadingText}
          </p>

          <div className="bg-surface-container-highest rounded border border-outline-variant/10 p-4 mb-8 text-left">
            <div className="flex items-center gap-3 mb-2 text-xs font-label uppercase text-outline">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span> Connection Secure
            </div>
            <div className="flex items-center gap-3 mb-2 text-xs font-label uppercase text-outline">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse delay-75"></span> Node: US-East-1
            </div>
            <div className="flex items-center gap-3 text-xs font-label uppercase text-outline">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse delay-150"></span> Standby for Login Prompt
            </div>
          </div>

          <Link to="/" className="inline-flex items-center gap-2 text-sm text-outline hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Return to Public Site
          </Link>
        </div>
      </div>
    </>
  );
}
