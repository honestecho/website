import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FlyIn from '../components/FlyIn';
import { RESOURCES } from '../content/resources';
import { BreadcrumbListSchema, ItemListSchema } from '../components/SchemaOrg';

// The guide index. Its job is structural: every guide gets one contextual,
// in-body link from a page about the same subject, instead of a single sitewide
// footer link each. New guides land here by being added to the manifest.
const PAGE_PATH = '/resources/';

export default function Resources() {
  return (
    <>
      <Helmet>
        <title>GovCon Guides — SAM.gov, Sources Sought, Recompetes | Honest Echo</title>
        <meta name="description" content="Short guides for small government contractors: what SAM.gov search hides, when a Sources Sought is worth answering, and how to see a recompete coming." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://honestecho.com${PAGE_PATH}`} />
        <meta property="og:title" content="GovCon Guides — Honest Echo" />
        <meta property="og:description" content="Short guides for small government contractors on SAM.gov, Sources Sought notices, and recompetes." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GovCon Guides — Honest Echo" />
        <meta name="twitter:description" content="Short guides for small government contractors on SAM.gov, Sources Sought notices, and recompetes." />
      </Helmet>

      <BreadcrumbListSchema
        items={[
          { name: 'Honest Echo', path: '/' },
          { name: 'Guides', path: PAGE_PATH },
        ]}
      />
      <ItemListSchema
        name="Honest Echo GovCon guides"
        items={RESOURCES.map(r => ({ name: r.title, url: `https://honestecho.com${r.path}` }))}
      />

      {/* Hero */}
      <section className="pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">Guides</span>
          </div>
          <h1 className="font-headline font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            What we know about<br className="hidden md:block" /> bidding federal work.
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-3xl">
            Short, specific guides on the parts of government contracting that cost small companies the most time — where SAM.gov search falls short, which notices deserve an answer, and how work you could win shows up long before the RFP does.
          </p>
        </div>
      </section>

      {/* Guides */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {RESOURCES.map((r, i) => (
              <FlyIn key={r.path} delay={['', 'delay-150', 'delay-300', 'delay-[450ms]'][i % 4]} className={i === RESOURCES.length - 1 ? 'lg:col-span-2' : ''}>
                <Link
                  to={r.path}
                  className="block bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 h-full"
                >
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 text-[#00c3ff] text-xs font-bold tracking-widest uppercase font-label mb-4">
                    {r.kicker}
                  </span>
                  <h2 className="font-headline font-bold text-white text-xl tracking-tight mb-3 group-hover:text-[#00c3ff] transition-colors">
                    {r.title}
                  </h2>
                  <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">{r.summary}</p>
                  <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-[#00c3ff] font-body">
                    Read the guide <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </FlyIn>
            ))}
          </div>
        </div>
      </section>

      {/* Hand-off */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-headline font-bold text-white text-3xl tracking-tight mb-3">
            Or skip the reading and check a notice.
          </h2>
          <p className="text-[#a0b2c8] text-base font-body leading-relaxed mb-8 max-w-2xl mx-auto">
            Paste a SAM.gov Notice ID or URL and get a screening read on fit, eligibility, and what could rule you out. Free, no account required.
          </p>
          <Link
            to="/tools/sam-gov-notice-analyzer/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline"
          >
            Analyze a notice — free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
