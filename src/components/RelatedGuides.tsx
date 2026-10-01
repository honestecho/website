import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { RESOURCES } from '../content/resources';

// Sibling links between guides, plus the way back up to /resources/. Reads the
// same manifest as the hub, so a new guide shows up here without touching pages.
export default function RelatedGuides({ current }: { current?: string }) {
  const others = RESOURCES.filter(r => r.path !== current);
  return (
    <section className="py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 className="font-headline font-bold text-white text-2xl tracking-tight">More guides</h2>
          <Link to="/resources/" className="text-sm font-semibold text-[#00c3ff] font-body hover:text-white transition-colors">
            All guides
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {others.map(r => (
            <Link
              key={r.path}
              to={r.path}
              className="block bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 group hover:border-[#00c3ff]/40 transition-colors duration-500"
            >
              <span className="text-[#00c3ff] text-xs font-bold tracking-widest uppercase font-label">{r.kicker}</span>
              <h3 className="font-headline font-bold text-white text-base tracking-tight mt-2 group-hover:text-[#00c3ff] transition-colors">
                {r.title}
              </h3>
              <span className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-[#00c3ff] font-body">
                Read the guide <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
