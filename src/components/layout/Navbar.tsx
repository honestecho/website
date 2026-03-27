import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-surface/80 backdrop-blur-xl w-full top-0 z-50 shadow-[0_1px_0_0_rgba(255,255,255,0.05)] sticky">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3 text-2xl font-black tracking-tighter text-slate-100 font-headline group">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
            <Zap 
              className="w-10 h-10 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_15px_rgba(0,195,255,0.8)] transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-12 relative z-10" 
              fill="currentColor" 
              fillOpacity={0.2} 
              strokeWidth={2} 
            />
          </div>
          <span className="hidden sm:block group-hover:text-white transition-colors">Honest Echo</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/platform" className="font-headline font-bold tracking-tight text-white/80 hover:text-white transition-colors">
            Product
          </Link>
          <Link to="/consulting" className="font-headline font-bold tracking-tight text-white/80 hover:text-white transition-colors">
            Consulting
          </Link>
          <Link to="/about" className="font-headline font-bold tracking-tight text-white/80 hover:text-white transition-colors">
            About
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://pursuit.honestecho.com" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 text-sm font-bold bg-[#00c3ff] text-[#030B17] shadow-[0_0_15px_rgba(0,195,255,0.2)] rounded hover:bg-white hover:scale-105 transition-all duration-300">
            Login
          </a>
        </div>
      </div>
    </nav>
  );
}
