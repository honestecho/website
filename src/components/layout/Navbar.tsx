import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Pricing',    to: '/pricing'    },
  { label: 'FAQ',        to: '/faq'        },
  { label: 'Security',   to: '/security'   },
  { label: 'About',      to: '/about'      },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#0b1120] w-full top-0 z-50 shadow-[0_1px_0_0_rgba(255,255,255,0.05)] sticky">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src="/he-logo-mark.png" alt="Honest Echo" className="h-10 w-auto" />
          <div className="flex flex-col leading-none gap-1">
            <span className="font-headline font-black text-xl tracking-tighter leading-none">
              <span className="text-white">Honest </span><span className="text-[#00c3ff]">Echo</span>
            </span>
            <span className="font-body text-[10px] text-[#8b9bb4] tracking-widest uppercase hidden sm:block">Know Before You Bid</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, to }) => (
            <Link key={to} to={to} className="font-headline font-bold tracking-tight text-white/80 hover:text-white transition-colors">
              {label}
            </Link>
          ))}
        </div>

        {/* Right: Login + hamburger */}
        <div className="flex items-center gap-3">
          <a
            href="https://pursuit.honestecho.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-sm font-bold bg-[#00c3ff] text-[#030B17] shadow-[0_0_15px_rgba(0,195,255,0.2)] rounded hover:bg-white hover:scale-105 transition-all duration-300"
          >
            Login
          </a>
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-[#1e2d4a] text-white hover:border-[#00c3ff]/40 transition-colors"
            onClick={() => setOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-[#1e2d4a] bg-[#0b1120] px-6 py-4 flex flex-col gap-1">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="font-headline font-bold text-white/80 hover:text-white py-3 border-b border-[#1e2d4a] last:border-0 transition-colors"
            >
              {label}
            </Link>
          ))}
          <a
            href="https://pursuit.honestecho.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full text-center py-3 rounded-lg bg-[#00c3ff] text-[#030B17] font-bold text-sm hover:bg-white transition-colors"
          >
            Launch App
          </a>
        </div>
      )}
    </nav>
  );
}
