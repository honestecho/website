import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, EyeOff, FileSearch, Filter, Radar, Layers, CheckCircle } from 'lucide-react';
import FlyIn from '../components/FlyIn';
import { SoftwareApplicationSchema } from '../components/SchemaOrg';

const leadCard = {
  Icon: EyeOff,
  title: 'SAM.gov’s search hides opportunities from you',
  body: 'Most opportunity tools — and SAM.gov’s own filtered search — key everything off the NAICS code. But a large share of federal notices are posted with no NAICS code at all: Sources Sought, Special Notices, draft RFPs. If your search is NAICS-first, those notices are invisible to you. They never show up, and you never know what you missed.',
};

const cards = [
  {
    Icon: Filter,
    kicker: 'The gap',
    title: 'NAICS-filtered search skips notices with no NAICS',
    body: 'Filter by 541512 and you only ever see notices tagged 541512. Special Notices, industry-day announcements, and draft solicitations routinely ship with a blank NAICS field — so a NAICS filter, by construction, can never return them. The result is a blind spot exactly where the early, shapeable work lives.',
  },
  {
    Icon: FileSearch,
    kicker: 'What you’re missing',
    title: 'Sources Sought & RFIs — shape the requirement first',
    body: 'The best time to influence a federal requirement is before the RFP exists. Sources Sought and RFIs are where agencies test the market — and where an early, credible response can shape scope, evaluation criteria, and set-aside decisions. Many carry no NAICS code, so they’re the first thing a filtered search drops.',
  },
  {
    Icon: Layers,
    kicker: 'What you’re missing',
    title: 'Special Notices & draft RFPs — the signal before the solicitation',
    body: 'Draft RFPs, pre-solicitations, and Special Notices tell you what’s coming and give you time to team, position, and prepare. These are frequently posted without a NAICS code — the exact category of notice that never surfaces in a code-first search.',
  },
  {
    Icon: Radar,
    kicker: 'How we fix it',
    title: 'HE Pursuit indexes every notice — searchable by keyword',
    body: 'HE Pursuit mirrors the full SAM.gov opportunity feed — every notice type, with or without a NAICS code — and makes it searchable by keyword, not just code. Search “contract writing,” “zero trust,” or your capability in plain language and see the notices a NAICS filter would have hidden. Nothing drops through the cracks because it wasn’t tagged.',
  },
  {
    Icon: CheckCircle,
    kicker: 'From signal to decision',
    title: 'Surface it, then decide whether to chase it',
    body: 'Finding a hidden notice is only half the job. HE Pursuit runs each one through the same bid/no-bid qualification — fit, eligibility, and pursuit value — so you get a Go, Conditional Go, or No-Bid recommendation in minutes, not just another notice in a list.',
  },
];

export default function SamGovHiddenOpportunities() {
  return (
    <>
      <Helmet>
        <title>Find the SAM.gov Opportunities Its Search Hides — HE Pursuit</title>
        <meta name="description" content="SAM.gov’s NAICS-filtered search skips Sources Sought, Special Notices, and draft RFPs posted with no NAICS code — the early-stage notices where you shape the requirement. HE Pursuit indexes every notice and makes it searchable by keyword." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/sam-gov-hidden-opportunities" />
        <meta property="og:title" content="Find the SAM.gov Opportunities Its Search Hides — HE Pursuit" />
        <meta property="og:description" content="NAICS-filtered search misses the no-code notices — Sources Sought, Special Notices, draft RFPs. HE Pursuit surfaces every notice by keyword, then qualifies it." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Find the SAM.gov Opportunities Its Search Hides — HE Pursuit" />
        <meta name="twitter:description" content="NAICS-filtered search misses the no-code notices — Sources Sought, Special Notices, draft RFPs. HE Pursuit surfaces every notice by keyword, then qualifies it." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
      </Helmet>
      <SoftwareApplicationSchema />

      {/* Hero */}
      <section className="pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">SAM.gov Coverage</span>
          </div>
          <h1 className="font-headline font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            The SAM.gov opportunities<br className="hidden md:block" /> its own search hides.
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-3xl">
            If you search SAM.gov by NAICS code — or use a tool that does — you never see the notices posted without one. Sources Sought, Special Notices, and draft RFPs are exactly where the early, shapeable work lives, and they’re the first thing a code-first search drops. HE Pursuit indexes every notice and makes it searchable by keyword, so nothing hides.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
            <Link
              to="/tools/sam-gov-notice-analyzer/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline"
            >
              Analyze a SAM.gov Notice — Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/signup/?promo=fall2026"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline"
            >
              Start Free
            </Link>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FlyIn delay="" className="lg:col-span-2">
              <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 h-full">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                    <leadCard.Icon className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                  </div>
                  <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">{leadCard.title}</h2>
                </div>
                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">{leadCard.body}</p>
              </div>
            </FlyIn>
            {cards.map((card, i) => (
              <FlyIn key={card.title} delay={['', 'delay-150', 'delay-300', 'delay-[450ms]'][i % 4]} className={i === cards.length - 1 ? 'lg:col-span-2' : ''}>
              <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 h-full">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 text-[#00c3ff] text-xs font-bold tracking-widest uppercase font-label mb-4">
                  {card.kicker}
                </span>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                    <card.Icon className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                  </div>
                  <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">{card.title}</h2>
                </div>
                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">{card.body}</p>
              </div>
              </FlyIn>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-5">
          <p className="text-[#a0b2c8] text-base font-body text-center">
            Paste any live notice number — including a Sources Sought or Special Notice — and see the analysis for yourself.
          </p>
          <Link
            to="/tools/sam-gov-notice-analyzer/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline"
          >
            Try it on a live notice — free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
        <h2 className="font-headline font-bold text-white text-3xl md:text-4xl tracking-tight text-center mb-8">
          See the opportunities you’ve been missing.
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup/?promo=fall2026"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline"
          >
            Start Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/sam-gov-opportunity-analysis/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline"
          >
            How the analysis works
          </Link>
        </div>
        </div>
      </section>
    </>
  );
}
