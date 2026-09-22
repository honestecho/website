import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { track } from '../../lib/analytics';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1120]';

// "Start free" follows the same entry logic as the home hero's discovery CTA:
// the existing account-creation flow. After auth, pursuit.honestecho.com routes
// a new account to profile setup and an existing profile to its matches.
const START_FREE_TO = '/signup/?promo=fall2026';
const SIGN_IN_HREF = 'https://pursuit.honestecho.com';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  // On /signup the page's own "Create Free Account" is the primary CTA —
  // don't render a competing "Start free" in the chrome.
  const onSignup = pathname.startsWith('/signup');

  const linkBase = `font-headline font-bold tracking-tight transition-colors ${focusRing} rounded`;
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${linkBase} ${
      isActive
        ? 'text-white underline decoration-[#00c3ff] decoration-2 underline-offset-8'
        : 'text-white/80 hover:text-white'
    }`;

  const onStartFree = () => { track('nav_start_free_clicked'); setOpen(false); };

  return (
    <nav className="bg-[#0b1120] w-full top-0 z-50 shadow-[0_1px_0_0_rgba(255,255,255,0.05)] sticky">
      <div className="flex justify-between items-center w-full px-6 min-h-[80px] max-w-7xl mx-auto">

        {/* Brand */}
        <Link to="/" className={`flex items-center gap-3 rounded ${focusRing}`} onClick={() => setOpen(false)}>
          <img src="/he-logo-mark.png" alt="Honest Echo" className="h-10 w-auto" />
          <div className="flex flex-col leading-none gap-1">
            <span className="font-headline font-black text-xl tracking-tighter leading-none">
              <span className="text-white">Honest </span><span className="text-[#00c3ff]">Echo</span>
            </span>
            <span className="font-body text-xs text-[#a0b2c8] tracking-widest uppercase hidden sm:block">Know Before You Bid</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/#how-it-works" className={`${linkBase} text-white/80 hover:text-white`}>
            How it works
          </Link>
          <NavLink to="/pricing/" className={linkClass}>
            Pricing
          </NavLink>
        </div>

        {/* Right: Sign in (text) + Start free (outlined) + hamburger */}
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={SIGN_IN_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:inline-flex items-center min-h-[44px] px-3 text-sm font-bold text-white/80 rounded hover:text-white transition-colors ${focusRing}`}
          >
            Sign in
          </a>
          {!onSignup && (
            <Link
              to={START_FREE_TO}
              onClick={onStartFree}
              className={`hidden min-[360px]:inline-flex items-center min-h-[44px] px-4 sm:px-5 text-sm font-bold text-[#00c3ff] border border-[#00c3ff]/60 rounded-xl hover:border-[#00c3ff] hover:bg-[#00c3ff]/10 transition-colors ${focusRing}`}
            >
              Start free
            </Link>
          )}
          <button
            className={`lg:hidden flex items-center justify-center w-11 h-11 rounded-xl border border-[#1e2d4a] text-white hover:border-[#00c3ff]/40 transition-colors ${focusRing}`}
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
          <Link
            to="/#how-it-works"
            onClick={() => setOpen(false)}
            className={`font-headline font-bold py-3 border-b border-[#1e2d4a] text-white/80 hover:text-white transition-colors ${focusRing}`}
          >
            How it works
          </Link>
          <NavLink
            to="/pricing/"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `font-headline font-bold py-3 border-b border-[#1e2d4a] transition-colors ${focusRing} ${
                isActive ? 'text-[#00c3ff]' : 'text-white/80 hover:text-white'
              }`
            }
          >
            Pricing
          </NavLink>
          <a
            href={SIGN_IN_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-3 w-full text-center py-3 rounded-xl border border-[#1e2d4a] text-white/90 font-bold text-sm hover:border-[#00c3ff]/40 transition-colors ${focusRing}`}
          >
            Sign in
          </a>
          {!onSignup && (
            <Link
              to={START_FREE_TO}
              onClick={onStartFree}
              className={`mt-2 w-full text-center py-3 rounded-xl border border-[#00c3ff]/60 text-[#00c3ff] font-bold text-sm hover:border-[#00c3ff] hover:bg-[#00c3ff]/10 transition-colors ${focusRing}`}
            >
              Start free
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
