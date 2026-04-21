import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Welcome() {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const name = data.session?.user?.user_metadata?.full_name as string | undefined;
      if (name) setFirstName(name.split(' ')[0]);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Welcome | Honest Echo</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-[calc(100vh-72px)] bg-[#030B17] relative overflow-hidden flex items-center justify-center px-6 py-16">
        {/* Aurora background */}
        <div className="animate-aurora absolute w-[160%] h-[500px] rounded-full blur-[100px] -left-[30%] top-[5%] z-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,195,255,0.18)_0%,rgba(91,140,255,0.10)_45%,transparent_70%)]"></div>
        <div className="animate-aurora-slow absolute w-[600px] h-[600px] rounded-full blur-[130px] bottom-[-10%] right-[-5%] z-0 pointer-events-none bg-[radial-gradient(ellipse,rgba(91,140,255,0.18)_0%,transparent_65%)]"></div>

        <div className="relative z-10 w-full max-w-lg text-center">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3 mb-12 group">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-25 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
              <Zap className="w-9 h-9 text-[#00c3ff] drop-shadow-[0_0_15px_rgba(0,195,255,0.8)] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12 relative z-10" fill="currentColor" fillOpacity={0.2} strokeWidth={2} />
            </div>
            <span className="text-xl font-black tracking-tighter text-white font-headline">Honest Echo</span>
          </Link>

          {/* Card */}
          <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/40 to-transparent"></div>

            {/* Glow icon */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#00c3ff] blur-2xl opacity-20 rounded-full animate-pulse"></div>
                <Zap className="w-12 h-12 text-[#00c3ff] drop-shadow-[0_0_20px_rgba(0,195,255,1)] relative z-10" fill="currentColor" fillOpacity={0.2} strokeWidth={1.5} />
              </div>
            </div>

            <h1 className="font-headline font-black text-3xl md:text-4xl text-white mb-3 tracking-tight">
              {firstName ? `You're in, ${firstName}.` : "You're in."}
            </h1>
            <p className="text-[#a0b2c8] text-base mb-8 leading-relaxed font-body">
              Your Honest Echo account is confirmed and ready. Start finding and winning better contracts.
            </p>

            <div className="space-y-3">
              <a
                href="https://pursuit.honestecho.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Open HE Pursuit <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                to="/"
                className="block w-full py-3 border border-[#1e2d4a] text-[#a0b2c8] text-sm font-body rounded-lg hover:bg-[#152033] hover:text-white transition-all text-center"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
