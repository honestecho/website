import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Free Analyzer', to: '/tools/sam-gov-notice-analyzer/' },
  { label: 'Pricing',       to: '/pricing/'  },
  { label: 'FAQ',           to: '/faq/'      },
  { label: 'Security',      to: '/security/' },
  { label: 'About',         to: '/about/'    },
];

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1120]';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  // On /signup the page's own "Create Free Account" is the primary CTA —
  // don't render a competing filled "Start Free" in the chrome.
  const onSignup = pathname.startsWith('/signup');

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `font-headline font-bold tracking-tight transition-colors ${focusRing} rounded ${
      isActive
        ? 'text-white underline decoration-[#00c3ff] decoration-2 underline-offset-8'
        : 'text-white/80 hover:text-white'
    }`;

  return (
    <nav className="bg-[#0b1120] w-full top-0 z-50 shadow-[0_1px_0_0_rgba(255,255,255,0.05)] sticky">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">

        {/* Brand */}
        <Link to="/" className={`flex items-center gap-3 rounded ${focusRing}`} onClick={() => setOpen(false)}>
          <img src="/he-logo-mark.png" alt="Honest Echo" className="h-10 w-auto" />
          <div className="flex flex-col leading-none gap-1">
            <span className="font-headline font-black text-xl tracking-tighter leading-none">
              <span className="text-white">Honest </span><span className="text-[#00c3ff]">Echo</span>
            </span>
            <span className="font-body text-[10px] text-[#a0b2c8] tracking-widest uppercase hidden sm:block">Know Before You Bid</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map(({ label, to }) => (
            <NavLink key={to} to={to} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right: Sign In (ghost) + Start Free (primary) + hamburger */}
        <div className="flex items-center gap-3">
          <a
            href="https://pursuit.honestecho.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:inline-block px-4 py-2.5 text-sm font-bold text-white/80 border border-[#1e2d4a] rounded hover:text-white hover:border-[#00c3ff]/40 transition-colors ${focusRing}`}
          >
            Sign In
          </a>
          {!onSignup && (
            <Link
              to="/signup/"
              className={`px-5 py-2.5 text-sm font-bold bg-[#00c3ff] text-[#030B17] shadow-[0_0_15px_rgba(0,195,255,0.2)] rounded hover:bg-white hover:scale-105 transition-all duration-300 ${focusRing}`}
            >
              Start Free
            </Link>
          )}
          <button
            className={`lg:hidden flex items-center justify-center w-11 h-11 rounded-lg border border-[#1e2d4a] text-white hover:border-[#00c3ff]/40 transition-colors ${focusRing}`}
            onClick={() => setOpen(prev => !prev)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="lg:hidden border-t border-[#1e2d4a] bg-[#0b1120] px-6 py-4 flex flex-col gap-1">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `font-headline font-bold py-3 border-b border-[#1e2d4a] last:border-0 transition-colors ${focusRing} ${
                  isActive ? 'text-[#00c3ff]' : 'text-white/80 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <a
            href="https://pursuit.honestecho.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-3 w-full text-center py-3 rounded-lg border border-[#1e2d4a] text-white/90 font-bold text-sm hover:border-[#00c3ff]/40 transition-colors ${focusRing}`}
          >
            Sign In
          </a>
          {!onSignup && (
            <Link
              to="/signup/"
              onClick={() => setOpen(false)}
              className={`mt-2 w-full text-center py-3 rounded-lg bg-[#00c3ff] text-[#030B17] font-bold text-sm hover:bg-white transition-colors ${focusRing}`}
            >
              Start Free
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
