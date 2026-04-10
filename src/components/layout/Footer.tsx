import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#1e2d4a] bg-[#030B17] mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-16">

        {/* Top: logo + columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 group mb-4">
              <Zap
                className="w-8 h-8 text-[#00c3ff] opacity-80 group-hover:opacity-100 transition-all duration-300"
                fill="currentColor"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <span className="text-lg font-bold text-white font-headline">Honest Echo</span>
            </Link>
            <p className="text-sm text-[#8b9bb4] leading-relaxed mb-4">
              The bid/no-bid decision engine for small government contractors.
            </p>
            <p className="text-xs text-[#8b9bb4]">4114 Legato Road, Fairfax, VA</p>
            <a href="mailto:info@honestecho.com" className="text-xs text-[#8b9bb4] hover:text-[#00c3ff] transition-colors">
              info@honestecho.com
            </a>
          </div>

          {/* Product column */}
          <div>
            <p className="text-xs font-bold text-[#00c3ff] uppercase tracking-widest mb-4">Product</p>
            <ul className="space-y-3">
              {[
                { label: 'Product', to: '/product' },
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
            <p className="text-xs font-bold text-[#00c3ff] uppercase tracking-widest mb-4">Company</p>
            <ul className="space-y-3">
              {[
                { label: 'About', to: '/about' },
                { label: 'Contact', to: '/contact' },
                { label: 'Consulting', to: '/consulting' },
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
            <p className="text-xs font-bold text-[#00c3ff] uppercase tracking-widest mb-4">Legal</p>
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
