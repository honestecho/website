import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#1e2d4a] bg-[#030B17] mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-16">

        {/* Top: brand (centered) + 3 link columns (right-grouped) */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-12">

          {/* Brand — centered */}
          <div className="flex flex-col items-center text-center md:w-64 shrink-0">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img src="/he-logo.png" alt="Honest Echo" className="h-8 w-auto" />
              <div className="flex flex-col leading-none gap-0.5">
                <span className="font-headline font-black text-xl tracking-tighter text-white">Honest Echo</span>
                <span className="font-body font-normal text-xs text-[#8b9bb4] tracking-wide whitespace-nowrap">Better Signals. Smarter Pursuits</span>
              </div>
            </Link>
            <p className="text-xs text-[#8b9bb4]">Fairfax, VA</p>
            <a href="mailto:info@honestecho.com" className="text-xs text-[#8b9bb4] hover:text-[#00c3ff] transition-colors">
              info@honestecho.com
            </a>
          </div>

          {/* Link columns — centered in remaining space, generously spaced */}
          <div className="flex flex-1 justify-center items-center gap-16 md:gap-24">

            {/* Product column */}
            <div>
              <p className="text-xs font-bold text-[#00c3ff] uppercase tracking-widest mb-3">Product</p>
              <ul className="space-y-3">
                {[
                  { label: 'Pricing', to: '/pricing' },
                  { label: 'Security', to: '/security' },
                  { label: 'FAQ', to: '/faq' },
                ].map(({ label, to }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-[#8b9bb4] hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company column */}
            <div>
              <p className="text-xs font-bold text-[#00c3ff] uppercase tracking-widest mb-3">Company</p>
              <ul className="space-y-3">
                {[
                  { label: 'About', to: '/about' },
                  { label: 'Contact', to: '/contact' },
                ].map(({ label, to }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-[#8b9bb4] hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal column */}
            <div>
              <p className="text-xs font-bold text-[#00c3ff] uppercase tracking-widest mb-3">Legal</p>
              <ul className="space-y-3">
                {[
                  { label: 'Terms of Service', to: '/terms' },
                  { label: 'Privacy Policy', to: '/privacy' },
                ].map(({ label, to }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-[#8b9bb4] hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1e2d4a] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#8b9bb4]">© 2026 Honest Echo LLC. All rights reserved.</p>
          <a
            href="https://pursuit.honestecho.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#00c3ff] hover:text-white transition-colors"
          >
            Launch App →
          </a>
        </div>

      </div>
    </footer>
  );
}
