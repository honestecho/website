import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#1e2d4a] bg-[#030B17] mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Top: brand (centered) + 3 link columns (right-grouped) */}
        <div className="flex flex-col md:flex-row items-stretch gap-12 mb-6">

          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" aria-label="Honest Echo home">
              <img src="/he-logo.png" alt="Honest Echo" className="h-8 w-auto" />
            </Link>
            <div className="flex items-stretch gap-5">
              <Link to="/" className="flex flex-col leading-none justify-between gap-1">
                <span className="font-headline font-black text-xl tracking-tighter text-white">Honest Echo</span>
                <span className="font-body font-normal text-xs text-[#8b9bb4] tracking-wide whitespace-nowrap">Better Signals. Smarter Pursuits</span>
              </Link>
              <div className="border-l border-[#1e2d4a] self-stretch"></div>
              <div className="flex flex-col justify-end gap-0.5 leading-none">
                <p className="text-xs text-[#8b9bb4]">Fairfax, VA</p>
                <a href="mailto:info@honestecho.com" className="text-xs text-[#8b9bb4] hover:text-[#00c3ff] transition-colors whitespace-nowrap">
                  info@honestecho.com
                </a>
              </div>
            </div>
          </div>

          {/* Link columns — centered in remaining space, generously spaced */}
          <div className="flex flex-1 justify-center items-start gap-16 md:gap-24">

            {/* Product column */}
            <div>
              <p className="text-xs font-bold text-[#00c3ff] uppercase tracking-widest mb-3">Product</p>
              <ul className="space-y-2">
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
              <ul className="space-y-2">
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

            {/* Compare column */}
            <div>
              <p className="text-xs font-bold text-[#00c3ff] uppercase tracking-widest mb-3">Compare</p>
              <ul className="space-y-2">
                {[
                  { label: 'vs GovWin', to: '/vs-govwin' },
                  { label: 'vs GovTribe', to: '/vs-govtribe' },
                  { label: 'SAM.gov Analysis', to: '/sam-gov-opportunity-analysis' },
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
              <ul className="space-y-2">
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
        <div className="border-t border-[#1e2d4a] pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
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
