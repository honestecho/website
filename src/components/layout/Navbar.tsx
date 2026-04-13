import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-[#0b1120] w-full top-0 z-50 shadow-[0_1px_0_0_rgba(255,255,255,0.05)] sticky">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tighter text-slate-100 font-headline group">
          <img
            src="/he-logo.png"
            alt="Honest Echo"
            className="h-8 w-auto group-hover:drop-shadow-[0_0_10px_rgba(0,195,255,0.6)] transition-all duration-500"
          />
          <span className="hidden sm:block group-hover:text-white transition-colors">Honest Echo</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/product" className="font-headline font-bold tracking-tight text-white/80 hover:text-white transition-colors">
            Product
          </Link>
          <Link to="/pricing" className="font-headline font-bold tracking-tight text-white/80 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link to="/faq" className="font-headline font-bold tracking-tight text-white/80 hover:text-white transition-colors">
            FAQ
          </Link>
          <Link to="/security" className="font-headline font-bold tracking-tight text-white/80 hover:text-white transition-colors">
            Security
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
