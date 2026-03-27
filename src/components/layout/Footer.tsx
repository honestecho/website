import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { Share2, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest w-full mt-auto border-t border-outline-variant/10">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-12 py-10 gap-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to="/" className="flex items-center gap-3 group">
            <Zap 
              className="w-8 h-8 text-[#00c3ff] opacity-80 group-hover:opacity-100 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(0,195,255,0.8)] transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-12" 
              fill="currentColor" 
              fillOpacity={0.2} 
              strokeWidth={2} 
            />
            <span className="text-lg font-bold text-white font-headline group-hover:opacity-80 transition-opacity">Honest Echo</span>
          </Link>
          <span className="font-body text-sm tracking-wide text-on-surface-variant">
            Honest Echo — tools for real government contractors.
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <Link to="/platform" className="font-body text-sm tracking-wide text-on-surface-variant hover:text-white transition-colors">
            Product
          </Link>
          <Link to="/consulting" className="font-body text-sm tracking-wide text-on-surface-variant hover:text-white transition-colors">
            Consulting
          </Link>
          <Link to="/about" className="font-body text-sm tracking-wide text-on-surface-variant hover:text-white transition-colors">
            About
          </Link>
          <a href="https://pursuit.honestecho.com" target="_blank" rel="noopener noreferrer" className="font-body text-sm tracking-wide text-on-surface-variant hover:text-white transition-colors">
            Login
          </a>
          <Link to="/contact" className="font-body text-sm tracking-wide text-on-surface-variant hover:text-white transition-colors">
            Contact
          </Link>
        </div>
        <div className="flex gap-4">
          <Share2 className="w-5 h-5 text-on-surface-variant hover:text-primary-container cursor-pointer transition-colors" />
          <Globe className="w-5 h-5 text-on-surface-variant hover:text-primary-container cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  );
}
