import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign, Target, Scale, Users, Zap, Layers } from 'lucide-react';
import FlyIn from '../components/FlyIn';
import { SoftwareApplicationSchema } from '../components/SchemaOrg';

const cards = [
  {
    Icon: Scale,
    title: 'Structured qualification, not data subscriptions',
    body: 'GovWin gives you more data. HE Pursuit gives you a decision. Each evaluation walks you through fit, eligibility, effort, and risk — and produces a Go, Conditional Go, or No-Bid recommendation your team can act on.',
  },
  {
    Icon: Target,
    title: 'Bid/no-bid decisions, not market intelligence',
    body: 'GovWin focuses on opportunity discovery, pipeline data, and market research. HE Pursuit focuses on what comes next: evaluating whether a specific opportunity is worth pursuing. Different tools for different jobs.',
  },
  {
    Icon: Users,
    title: 'Built for small teams, not enterprise BD departments',
    body: "GovWin's depth is designed for large contractors with dedicated capture and BD staff. HE Pursuit is built for owner-operators, solo capture leads, and lean teams that need to move fast without burning bandwidth.",
  },
  {
    Icon: Zap,
    title: 'Minutes to a decision, not days of research',
    body: 'GovWin accelerates opportunity discovery. HE Pursuit accelerates the qualification decision. Most evaluations take minutes — giving you a structured answer before you commit proposal resources.',
  },
  {
    Icon: DollarSign,
    title: 'Accessible pricing, not enterprise licensing',
    body: 'GovWin IQ is priced for large primes and enterprise BD teams — typically $10,000–$50,000+ per year. HE Pursuit starts free and scales to $299/month, built for small contractors who need serious decision support without the enterprise overhead.',
  },
  {
    Icon: Layers,
    title: 'SAM.gov is free — what you need is the decision layer',
    body: "If you're a small contractor, you may not need GovWin at all. SAM.gov gives you the opportunities. HE Pursuit helps you decide which ones to pursue — structured evaluation on top of what's already publicly available.",
  },
];

export default function VsGovWin() {
  return (
    <>
      <Helmet>
        <title>HE Pursuit vs GovWin IQ — GovWin Alternative for Small Contractors</title>
        <meta name="description" content="Looking for a GovWin alternative? HE Pursuit helps small government contractors evaluate SAM.gov opportunities and make faster bid/no-bid decisions — at a fraction of the cost." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/vs-govwin" />
        <meta property="og:title" content="HE Pursuit vs GovWin IQ — GovWin Alternative for Small Contractors" />
        <meta property="og:description" content="GovWin is built for enterprise. HE Pursuit is built for small government contractors who need bid/no-bid decisions, not a $10,000/year market intelligence subscription." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HE Pursuit vs GovWin IQ — GovWin Alternative for Small Contractors" />
        <meta name="twitter:description" content="GovWin is built for enterprise. HE Pursuit is built for small contractors who need a bid/no-bid decision platform, not a market intelligence subscription." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
      </Helmet>
      <SoftwareApplicationSchema />

      {/* Hero */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">GovWin Alternative</span>
          </div>
          <h1 className="font-headline font-black text-5xl md:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            A GovWin alternative<br className="hidden md:block" /> built for small contractors.
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-3xl">
            GovWin IQ is a powerful enterprise market intelligence tool. If you're a small government contractor who needs to evaluate SAM.gov opportunities and make faster bid/no-bid decisions — not subscribe to a $10,000/year data platform — HE Pursuit was built for you.
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
              to="/signup/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline"
            >
              Start Free
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <FlyIn>
            <div className="overflow-x-auto rounded-2xl border border-[#1e2d4a] bg-[#0b1120]">
              <table className="w-full min-w-[640px] text-left text-sm font-body">
                <thead>
                  <tr className="border-b border-[#1e2d4a]">
                    <th className="px-6 py-4 font-headline font-bold text-xs tracking-widest uppercase text-[#8b9bb4] w-[22%]"></th>
                    <th className="px-6 py-4 font-headline font-bold text-white tracking-tight">GovWin</th>
                    <th className="px-6 py-4 font-headline font-bold text-[#00c3ff] tracking-tight border-l border-[#1e2d4a]">HE Pursuit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#1e2d4a]">
                    <th scope="row" className="px-6 py-4 font-headline font-bold text-xs tracking-widest uppercase text-[#8b9bb4] align-top">Built for</th>
                    <td className="px-6 py-4 text-[#a0b2c8] leading-relaxed align-top">Large primes and enterprise BD teams with dedicated capture staff</td>
                    <td className="px-6 py-4 text-[#a0b2c8] leading-relaxed align-top border-l border-[#1e2d4a]">Owner-operators, solo capture leads, and lean teams</td>
                  </tr>
                  <tr className="border-b border-[#1e2d4a]">
                    <th scope="row" className="px-6 py-4 font-headline font-bold text-xs tracking-widest uppercase text-[#8b9bb4] align-top">The job it does</th>
                    <td className="px-6 py-4 text-[#a0b2c8] leading-relaxed align-top">Opportunity discovery, pipeline data, and market research</td>
                    <td className="px-6 py-4 text-[#a0b2c8] leading-relaxed align-top border-l border-[#1e2d4a]">Evaluating whether a specific opportunity is worth pursuing — bid/no-bid qualification</td>
                  </tr>
                  <tr className="border-b border-[#1e2d4a]">
                    <th scope="row" className="px-6 py-4 font-headline font-bold text-xs tracking-widest uppercase text-[#8b9bb4] align-top">What you get</th>
                    <td className="px-6 py-4 text-[#a0b2c8] leading-relaxed align-top">More data</td>
                    <td className="px-6 py-4 text-[#a0b2c8] leading-relaxed align-top border-l border-[#1e2d4a]">A Go, Conditional Go, or No-Bid recommendation your team can act on</td>
                  </tr>
                  <tr className="border-b border-[#1e2d4a]">
                    <th scope="row" className="px-6 py-4 font-headline font-bold text-xs tracking-widest uppercase text-[#8b9bb4] align-top">Time to a decision</th>
                    <td className="px-6 py-4 text-[#a0b2c8] leading-relaxed align-top">Days of research</td>
                    <td className="px-6 py-4 text-[#a0b2c8] leading-relaxed align-top border-l border-[#1e2d4a]">Minutes</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-4 font-headline font-bold text-xs tracking-widest uppercase text-[#8b9bb4] align-top">Price</th>
                    <td className="px-6 py-4 text-[#a0b2c8] leading-relaxed align-top">Typically $10,000–$50,000+ per year</td>
                    <td className="px-6 py-4 text-[#a0b2c8] leading-relaxed align-top border-l border-[#1e2d4a]">Starts free and scales to $299/month</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[#8b9bb4] text-sm font-body leading-relaxed mt-4">
              Different tools for different jobs — GovWin for enterprise market intelligence, HE Pursuit for the bid/no-bid decision.
            </p>
          </FlyIn>
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
                  <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 rounded-full scale-150"></div>
                    <card.Icon className="w-5 h-5 text-[#00c3ff] drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(30,58,138,0.20)] border border-[rgba(29,78,216,0.30)] mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
                <span className="text-xs font-bold text-[#bfdbfe] tracking-widest uppercase font-label">Based on Real Events</span>
              </div>
              <p className="text-[#a0b2c8] text-base font-body leading-relaxed mb-4">
                A recent federal services solicitation asked for a{' '}
                <strong className="text-white">senior Appian-certified developer with 10+ years of federal acquisition experience and an active Top Secret clearance</strong>.
                {' '}A LinkedIn search for people who meet all three criteria returns fewer than twenty results worldwide.
                The buyer wasn't trying to be exclusive — they were trying to sound thorough.
                The result: every small business that read the requirement either self-disqualified or burned an afternoon writing a{' '}
                <em>"we don't quite meet this but..."</em> paragraph that wouldn't survive compliance review.
              </p>
              <p className="text-[#00c3ff] font-bold font-body">
                HE Pursuit catches requirements like this in Phase 2 eligibility review — where every requirement is scanned for hard disqualifiers before your team commits an afternoon to a proposal you can't win.
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline"
          >
            Start Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/pricing/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline"
          >
            See Pricing
          </Link>
        </div>
      </section>
    </>
  );
}
