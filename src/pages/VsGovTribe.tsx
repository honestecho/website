import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Target, CheckCircle, Zap, Filter, Layers } from 'lucide-react';
import FlyIn from '../components/FlyIn';
import { SoftwareApplicationSchema } from '../components/SchemaOrg';

const cards = [
  {
    Icon: CheckCircle,
    title: 'Go / Conditional Go / No-Bid output',
    body: "GovTribe gives you data. HE Pursuit gives you a decision. Each evaluation ends with a clear recommendation — Go, Conditional Go, or No-Bid — grounded in structured analysis, not gut feel.",
  },
  {
    Icon: Target,
    title: 'Pursuit qualification, not market analytics',
    body: "GovTribe provides market intelligence — contract history, agency spend, competitor analysis. HE Pursuit answers a different question: should you pursue this specific opportunity? It structures the go/no-go decision your team needs to make right now.",
  },
  {
    Icon: BarChart2,
    title: 'Stop browsing. Start deciding.',
    body: "GovTribe is great for passive market research. HE Pursuit is an active decision workflow. It walks you through fit, eligibility, strategic value, and effort — and produces a structured recommendation your team can act on.",
  },
  {
    Icon: Filter,
    title: 'Filter out weak fits before they drain resources',
    body: "GovTribe shows you the opportunity landscape. HE Pursuit helps you filter it. Most small contractors don't have a discovery problem — they have a qualification problem. HE Pursuit is built to solve that.",
  },
  {
    Icon: Zap,
    title: 'Minutes to a decision, not hours of research',
    body: "GovTribe research can take hours to produce a meaningful picture. HE Pursuit shortens the path from opportunity to decision. Most evaluations complete in minutes, so your team can qualify more opportunities without adding overhead.",
  },
  {
    Icon: Layers,
    title: 'Use what fits your stage',
    body: "If you need deep market intel, GovTribe delivers. If you need to decide whether to pursue a specific SAM.gov opportunity — today, with limited BD bandwidth — HE Pursuit is the tool that fits.",
  },
];

export default function VsGovTribe() {
  return (
    <>
      <Helmet>
        <title>HE Pursuit vs GovTribe — GovTribe Alternative for GovCon Teams</title>
        <meta name="description" content="Looking for a GovTribe alternative focused on bid/no-bid decisions? HE Pursuit helps small government contractors evaluate SAM.gov opportunities with a structured qualification workflow." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/vs-govtribe" />
        <meta property="og:title" content="HE Pursuit vs GovTribe — GovTribe Alternative for GovCon Teams" />
        <meta property="og:description" content="GovTribe is market analytics. HE Pursuit is bid/no-bid decision workflow. If you need to qualify SAM.gov opportunities fast, HE Pursuit is the right tool." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HE Pursuit vs GovTribe — GovTribe Alternative for GovCon Teams" />
        <meta name="twitter:description" content="GovTribe is market analytics. HE Pursuit is bid/no-bid decision workflow. If you need to qualify SAM.gov opportunities fast, HE Pursuit is the right tool." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
      </Helmet>
      <SoftwareApplicationSchema />

      {/* Hero */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">GovTribe Alternative</span>
          </div>
          <h1 className="font-headline font-black text-5xl md:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            Beyond market data.<br className="hidden md:block" /> Built for bid decisions.
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-3xl">
            GovTribe is a strong market intelligence tool. But if your team's real bottleneck is deciding which SAM.gov opportunities are worth pursuing — not finding them — HE Pursuit gives you the structured qualification workflow that market data tools don't.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
            <Link
              to="/tools/sam-gov-notice-analyzer/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline focus-visible:ring-2 focus-visible:ring-[#00c3ff] focus-visible:outline-none"
            >
              Analyze a SAM.gov Notice — Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/signup/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline focus-visible:ring-2 focus-visible:ring-[#00c3ff] focus-visible:outline-none"
            >
              Start Free
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="overflow-x-auto rounded-2xl border border-[#1e2d4a] bg-[#0b1120]">
            <table className="w-full min-w-[560px] text-left font-body text-sm">
              <thead>
                <tr className="border-b border-[#1e2d4a]">
                  <th scope="col" className="px-6 py-4"><span className="sr-only">Category</span></th>
                  <th scope="col" className="px-6 py-4 font-headline font-bold text-white text-base tracking-tight">GovTribe</th>
                  <th scope="col" className="px-6 py-4 font-headline font-bold text-[#00c3ff] text-base tracking-tight">HE Pursuit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#1e2d4a]">
                  <th scope="row" className="px-6 py-4 font-bold text-white whitespace-nowrap">Built for</th>
                  <td className="px-6 py-4 text-[#a0b2c8]">Researchers and analysts</td>
                  <td className="px-6 py-4 text-[#a0b2c8]">Owner-operators and small contracting teams</td>
                </tr>
                <tr className="border-b border-[#1e2d4a]">
                  <th scope="row" className="px-6 py-4 font-bold text-white whitespace-nowrap">The job it does</th>
                  <td className="px-6 py-4 text-[#a0b2c8]">Market intelligence — contract history, agency spend, competitor analysis</td>
                  <td className="px-6 py-4 text-[#a0b2c8]">Bid/no-bid qualification of a specific opportunity</td>
                </tr>
                <tr className="border-b border-[#1e2d4a]">
                  <th scope="row" className="px-6 py-4 font-bold text-white whitespace-nowrap">What you get</th>
                  <td className="px-6 py-4 text-[#a0b2c8]">Data on the opportunity landscape</td>
                  <td className="px-6 py-4 text-[#a0b2c8]">A Go, Conditional Go, or No-Bid recommendation</td>
                </tr>
                <tr>
                  <th scope="row" className="px-6 py-4 font-bold text-white whitespace-nowrap">Time to a decision</th>
                  <td className="px-6 py-4 text-[#a0b2c8]">Hours of research</td>
                  <td className="px-6 py-4 text-[#a0b2c8]">Minutes per evaluation</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[#8b9bb4] text-sm font-body leading-relaxed mt-4">
            If you need deep market intel, GovTribe delivers — HE Pursuit answers whether to bid.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cards.map((card, i) => (
              <FlyIn key={card.title} delay={['', 'delay-150', 'delay-300', 'delay-[450ms]'][i % 4]}>
              <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden h-full">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <card.Icon className="w-5 h-5 text-[#00c3ff]" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
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

      {/* Appian Example */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0b1120] border border-[#00c3ff]/30 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/60 to-transparent rounded-t-2xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.04)_0%,transparent_70%)] pointer-events-none"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
                <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">Based on Real Events</span>
              </div>
              <h2 className="font-headline font-bold text-white text-2xl tracking-tight mb-4">
                You already found the opportunity. The question is whether to bid it.
              </h2>
              <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-4">
                Discovery wasn't the hard part here — anyone watching the market saw this federal services solicitation come through. The trap was inside the requirements: the buyer wanted a{' '}
                <strong className="text-white">senior Appian-certified developer with 10+ years of federal acquisition experience and an active Top Secret clearance</strong>.
                {' '}Run that combination through LinkedIn and fewer than twenty people worldwide match all three criteria. That wasn't deliberate exclusivity — it was a buyer trying to sound thorough.
                Every small business that got as far as reading the requirement faced the same fork: self-disqualify, or burn an afternoon on a{' '}
                <em>"we don't quite meet this but..."</em> paragraph destined to fail compliance review.
              </p>
              <p className="text-[#00c3ff] font-bold font-body">
                That's the qualification gap. HE Pursuit's Phase 2 eligibility review scans every requirement for hard disqualifiers like this one — so the no-bid call costs you minutes, not the afternoon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 pb-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline focus-visible:ring-2 focus-visible:ring-[#00c3ff] focus-visible:outline-none"
          >
            Start Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/pricing/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline focus-visible:ring-2 focus-visible:ring-[#00c3ff] focus-visible:outline-none"
          >
            See Pricing
          </Link>
        </div>
      </section>
    </>
  );
}
