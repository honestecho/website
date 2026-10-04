import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign, Target, Scale, Users, Zap, Layers } from 'lucide-react';
import FlyIn from '../components/FlyIn';
import Notice from '../components/Notice';
import { SoftwareApplicationSchema, FAQPageSchema } from '../components/SchemaOrg';
import HeroPursuitCardZoom from '../components/HeroPursuitCardZoom';
import { track } from '../lib/analytics';

// GovWin price-shoppers want discovery, so the primary action is Find my
// matches (no notice ID needed). Click events make the paid competitor test
// readable; page_viewed alone can't tell a bounce from a CTA exit.
const FIND_MATCHES_PATH = '/tools/find-my-matches/';
const ctaClick = (cta: string, position: string) => () =>
  track('vs_cta_clicked', { page: 'vs-govwin', cta, position });

const faqs = [
  {
    q: 'What is the best GovWin alternative for a small government contractor?',
    a: 'It depends which job you need done. GovWin IQ is a market intelligence subscription — pre-RFP forecasting, pipeline data, and competitor research at scale. If what you actually need is to decide whether a specific SAM.gov opportunity is worth bidding, HE Pursuit is built for that job: it evaluates fit, eligibility, effort, and risk, then returns a Go, Conditional Go, or No-Go recommendation. Small contractors who already find opportunities on SAM.gov but struggle to qualify them are the fit.',
  },
  {
    q: 'How much does GovWin IQ cost compared to HE Pursuit?',
    a: 'Deltek does not publish list pricing for GovWin IQ; it is quoted per seat. HE Pursuit publishes its pricing: Free, Starter at $99/month, Pro at $199/month, and Team at $299/month. No credit card is required to start, and the SAM.gov notice analyzer is free to use without an account.',
  },
  {
    q: 'Who should NOT use HE Pursuit?',
    a: 'Teams that need what GovWin actually sells. If you need multi-year pre-RFP forecasting, state and local coverage, agency spend analytics, or a shared pipeline database for a large BD department, HE Pursuit does not replace those and is not trying to. It also adds little if you already have a dedicated capture team running a disciplined bid/no-bid process. HE Pursuit is for lean teams whose qualification process today is a spreadsheet and a gut call.',
  },
  {
    q: 'Can I use HE Pursuit and GovWin together?',
    a: 'Yes, and for teams that already own GovWin that is the normal pattern. GovWin surfaces and forecasts opportunities; HE Pursuit qualifies the ones you are seriously considering and documents the reasoning behind the decision. They sit at different stages of the same pipeline.',
  },
  {
    q: 'Do I need to buy anything to try HE Pursuit?',
    a: 'No. The SAM.gov notice analyzer at honestecho.com/tools/sam-gov-notice-analyzer is public and requires no login — paste a notice ID or SAM.gov URL and it returns a scored assessment. The Free plan adds search and bookmarks without a credit card.',
  },
];

const cards = [
  {
    Icon: Scale,
    title: 'Structured qualification, not data subscriptions',
    body: 'GovWin is built to surface and research opportunities. HE Pursuit is built to decide on one. Each evaluation walks you through fit, eligibility, effort, and risk — and produces a Go, Conditional Go, or No-Go recommendation your team can act on.',
  },
  {
    Icon: Target,
    title: 'Bid/no-bid decisions, not market intelligence',
    body: 'GovWin focuses on opportunity discovery, pipeline data, and market research. HE Pursuit focuses on what comes next: evaluating whether a specific opportunity is worth pursuing. Different tools for different jobs.',
  },
  {
    Icon: Users,
    title: 'Built for small teams without a capture department',
    body: "GovWin offers depth across forecasting, pipeline data, and market research. HE Pursuit is built for owner-operators, solo capture leads, and lean teams that need to move fast without burning bandwidth.",
  },
  {
    Icon: Zap,
    title: 'A structured answer before proposal hours',
    body: 'GovWin accelerates opportunity discovery. HE Pursuit accelerates the qualification decision. Most evaluations take minutes — giving you a structured answer before you commit proposal resources.',
  },
  {
    Icon: DollarSign,
    title: 'Published pricing, not a sales quote',
    body: "Deltek doesn't publish GovWin IQ pricing; it is quoted per seat. HE Pursuit's pricing is on the page: Free, then $99, $199, or $299 a month.",
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
        <meta name="description" content="A GovWin alternative for small contractors. HE Pursuit finds SAM.gov opportunities that fit and delivers bid/no-bid decisions, with published pricing." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/vs-govwin" />
        <meta property="og:title" content="HE Pursuit vs GovWin IQ — GovWin Alternative for Small Contractors" />
        <meta property="og:description" content="GovWin is a market intelligence platform. HE Pursuit is built for small government contractors who need bid/no-bid decisions, not a market intelligence subscription." />
        <meta property="og:image" content="https://honestecho.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HE Pursuit vs GovWin IQ — GovWin Alternative for Small Contractors" />
        <meta name="twitter:description" content="GovWin is a market intelligence platform. HE Pursuit is built for small contractors who need a bid/no-bid decision platform, not a market intelligence subscription." />
        <meta name="twitter:image" content="https://honestecho.com/og-image.jpg" />
      </Helmet>
      <SoftwareApplicationSchema />

      {/* Hero — copy left, live sample verdict right (same pattern as Home) */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">GovWin Alternative</span>
            </div>
            <h1 className="font-headline font-black text-5xl md:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
              A GovWin alternative<br className="hidden md:block" /> built for small contractors.
            </h1>
            <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-3xl">
              Deltek doesn't publish GovWin pricing. Ours is public: Free, $99, $199, or $299 a month. GovWin IQ is a powerful market intelligence platform. If you're a small government contractor who needs to find SAM.gov opportunities that fit and make faster bid/no-bid decisions, HE Pursuit was built for you.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
              <Link
                to={FIND_MATCHES_PATH}
                onClick={ctaClick('find_matches', 'hero')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline"
              >
                See your matches free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/tools/sam-gov-notice-analyzer/"
                onClick={ctaClick('analyzer', 'hero')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline"
              >
                Analyze a notice you have
              </Link>
            </div>
            <p className="text-[#8b9bb4] text-sm font-body mt-3">Enter your company name or UEI. No account needed.</p>
            <Notice align="left" className="mt-6">
              <span className="font-bold text-[#00c3ff]">Fall Bid Clarity Pass:</span>{' '}
              2 months of Starter or Pro free — applied automatically at checkout.{' '}
              <span className="font-bold text-[#00c3ff]">Ends November 30.</span>
            </Notice>
          </div>
          <div className="w-full lg:w-[58%] relative hidden md:flex items-center transition-transform duration-700 hover:-translate-y-2">
            <HeroPursuitCardZoom />
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <FlyIn>
            <p className="sm:hidden text-xs text-[#8b9bb4] font-body text-right mb-2">Swipe to compare &rarr;</p>
            <div className="relative">
            <div className="overflow-x-auto rounded-2xl border border-[#1e2d4a] bg-[#0b1120]">
              <table className="w-full min-w-[640px] text-left text-sm font-body">
                <thead>
                  <tr className="border-b border-[#1e2d4a]">
                    <th className="px-6 py-4 font-headline font-bold text-xs tracking-widest uppercase text-[#8b9bb4] w-[22%] sticky left-0 z-10 bg-[#0b1120] border-r border-[#1e2d4a]"><span className="sr-only">Comparison dimension</span></th>
                    <th className="px-6 py-4 font-headline font-bold text-[#8b9bb4] tracking-tight">GovWin</th>
                    <th className="px-6 py-4 font-headline font-bold text-[#00c3ff] tracking-tight border-l border-[#00c3ff]/25 bg-[#00c3ff]/[0.07]">HE&nbsp;Pursuit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#1e2d4a]">
                    <th scope="row" className="px-6 py-4 font-headline font-bold text-xs tracking-widest uppercase text-[#8b9bb4] align-top sticky left-0 z-10 bg-[#0b1120] border-r border-[#1e2d4a]">Built for</th>
                    <td className="px-6 py-4 text-[#8b9bb4] leading-relaxed align-top">Teams that need market intelligence: forecasting, pipeline data, competitor research</td>
                    <td className="px-6 py-4 text-white leading-relaxed align-top border-l border-[#00c3ff]/25 bg-[#00c3ff]/[0.05]">Owner-operators, solo capture leads, and lean teams</td>
                  </tr>
                  <tr className="border-b border-[#1e2d4a]">
                    <th scope="row" className="px-6 py-4 font-headline font-bold text-xs tracking-widest uppercase text-[#8b9bb4] align-top sticky left-0 z-10 bg-[#0b1120] border-r border-[#1e2d4a]">The job it does</th>
                    <td className="px-6 py-4 text-[#8b9bb4] leading-relaxed align-top">Opportunity discovery, pipeline data, and market research</td>
                    <td className="px-6 py-4 text-white leading-relaxed align-top border-l border-[#00c3ff]/25 bg-[#00c3ff]/[0.05]">Evaluating whether a specific opportunity is worth pursuing — bid/no-bid qualification</td>
                  </tr>
                  <tr className="border-b border-[#1e2d4a]">
                    <th scope="row" className="px-6 py-4 font-headline font-bold text-xs tracking-widest uppercase text-[#8b9bb4] align-top sticky left-0 z-10 bg-[#0b1120] border-r border-[#1e2d4a]">What you get</th>
                    <td className="px-6 py-4 text-[#8b9bb4] leading-relaxed align-top">Opportunity, pipeline, and market data</td>
                    <td className="px-6 py-4 text-white leading-relaxed align-top border-l border-[#00c3ff]/25 bg-[#00c3ff]/[0.05]">A Go, Conditional Go, or No-Go recommendation your team can act on</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-4 font-headline font-bold text-xs tracking-widest uppercase text-[#8b9bb4] align-top sticky left-0 z-10 bg-[#0b1120] border-r border-[#1e2d4a]">Price</th>
                    <td className="px-6 py-4 text-[#8b9bb4] leading-relaxed align-top">Not published; quoted per seat</td>
                    <td className="px-6 py-4 text-white leading-relaxed align-top border-l border-[#00c3ff]/25 bg-[#00c3ff]/[0.05]"><span className="text-[#00c3ff] font-bold">Published:</span> Free, $99, $199, or $299 a month</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="sm:hidden pointer-events-none absolute inset-y-0 right-0 w-12 rounded-r-2xl bg-gradient-to-l from-[#0b1120] to-transparent" aria-hidden="true"></div>
            </div>
            <Notice tone="soft" align="left" className="mt-4">
              Different tools for different jobs — GovWin for market intelligence, <span className="font-bold text-[#00c3ff]">HE Pursuit</span> for the bid/no-bid decision.
            </Notice>
          </FlyIn>
        </div>
      </section>

      {/* Cards */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cards.map((card, i) => (
              <FlyIn key={card.title} delay={['', 'delay-150', 'delay-300', 'delay-[450ms]'][i % 4]}>
              <div className="group bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden h-full hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                    <card.Icon className="w-5 h-5 text-[#00c3ff] group-hover:text-white group-hover:scale-110 drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
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
                <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">Example</span>
              </div>
              <p className="text-[#a0b2c8] text-base font-body leading-relaxed mb-4">
                A federal services solicitation can ask for a{' '}
                <strong className="text-white">senior Appian-certified developer with 10+ years of federal acquisition experience and an active Top Secret clearance</strong>.
                {' '}Very few people meet all three criteria at once.
                A small business reading that requirement can self-disqualify, or burn an afternoon writing a{' '}
                <em>"we don't quite meet this but..."</em> paragraph that is unlikely to survive compliance review.
              </p>
              <p className="text-[#00c3ff] font-bold font-body">
                HE Pursuit catches requirements like this in Phase 2 eligibility review — where the solicitation's requirements are checked for hard disqualifiers before your team commits an afternoon to a proposal you can't win.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQPageSchema items={faqs} />
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline font-bold text-white text-3xl tracking-tight text-center mb-8">
            GovWin alternative questions, answered
          </h2>
          <div className="space-y-4">
            {faqs.map(f => (
              <div key={f.q} className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6">
                <h3 className="font-headline font-bold text-white text-base mb-2">{f.q}</h3>
                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 pb-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={FIND_MATCHES_PATH}
            onClick={ctaClick('find_matches', 'footer')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline"
          >
            See your matches free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/pricing/"
            onClick={ctaClick('pricing', 'footer')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline"
          >
            See Pricing
          </Link>
        </div>
        <p className="max-w-4xl mx-auto text-center text-xs text-[#8b9bb4] font-body mt-10">
          GovWin IQ is a trademark of Deltek, Inc. Honest Echo is not affiliated with or endorsed by Deltek.
        </p>
      </section>
    </>
  );
}
