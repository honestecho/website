import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Filter, FileText, Target, Clock, CheckCircle } from 'lucide-react';
import FlyIn from '../components/FlyIn';
import Notice from '../components/Notice';
import { SoftwareApplicationSchema, FAQPageSchema } from '../components/SchemaOrg';

const faqs = [
  {
    q: 'What should a bid/no-bid decision framework include?',
    a: 'A defensible bid/no-bid framework scores an opportunity on capability fit (NAICS and scope match), eligibility (set-aside, size standard, certifications), competitive position (incumbency, past performance), timing (real runway to deadline), and effort versus realistic value. HE Pursuit runs that framework automatically on every SAM.gov notice — the scorecard arrives already filled in, with the evidence behind each dimension shown.',
  },
  {
    q: 'How do proposal teams triage a high volume of SAM.gov notices?',
    a: 'Manual triage breaks down around 30–50 notices a week — good opportunities sit unread while the team writes. The fix is screening before reading: every incoming notice gets scored against the company profile, and only the top slice earns human review. HE Pursuit maintains that scored inflow daily, so triage becomes reviewing a ranked shortlist instead of reading a feed.',
  },
  {
    q: 'How do you tell if an RFP is wired for the incumbent?',
    a: 'Signals include: requirements written around a specific existing solution, unusually short response windows on complex scopes, incumbent-specific past-performance requirements, and a Sources Sought that closed without requirement changes. No tool proves intent, but HE Pursuit surfaces the structural signals — incumbency indicators, timing anomalies, and restrictive requirements — so you can weigh the wire risk before committing hours.',
  },
  {
    q: 'What win rate should a small GovCon team expect?',
    a: 'Published federal win rates for small businesses cluster around 20–40% for well-qualified pursuits — and far lower for teams that chase everything. The lever is selection, not writing: bidding 4 well-fit opportunities beats bidding 11 mixed ones with the same capacity. A disciplined no-bid is the highest-ROI decision a proposal team makes.',
  },
  {
    q: 'Does HE Pursuit write proposals?',
    a: 'No. HE Pursuit is the decision layer before the writing starts: fit scoring, eligibility checks, effort/risk weighing, and a Go, Conditional Go, or No-Bid recommendation with documented reasoning. It protects proposal capacity; it does not replace it.',
  },
];

const cards = [
  {
    Icon: Scale,
    title: 'The scorecard arrives already filled in',
    body: 'You have a bid/no-bid matrix — probably a spreadsheet, probably filled in by whoever had time, probably after emotional commitment set in. HE Pursuit scores every notice on capability, eligibility, timing, agency, and geography the moment it posts, before anyone falls in love with it.',
  },
  {
    Icon: Filter,
    title: 'Triage 50 notices in the time you used to read one',
    body: 'Daily scored inflow means the pipeline meeting starts from a ranked shortlist, not a raw SAM.gov feed. The 90% that never deserved review never costs a minute.',
  },
  {
    Icon: Target,
    title: 'Kill criteria before the kickoff',
    body: 'Disqualifiers surface first: set-aside you don\'t hold, vehicle you\'re not on, clearance you can\'t staff, wage determination that breaks the price. The fastest no-bid is the one made before the color-team calendar exists.',
  },
  {
    Icon: Clock,
    title: 'Deadline runway you can actually plan against',
    body: 'Timing fit is scored, not eyeballed: real working days to deadline against the scope\'s demands. Sources Sought and draft RFPs get flagged early — when shaping the requirement is still possible.',
  },
  {
    Icon: FileText,
    title: 'Reasoning your capture meeting can challenge',
    body: 'Every recommendation shows its evidence — what matched, what\'s missing, what to verify. When the room disagrees with a score, the argument is about facts on the table, not whose gut is louder.',
  },
  {
    Icon: CheckCircle,
    title: 'A no-bid you can defend to the boss',
    body: '"Why didn\'t we bid that?" gets a documented answer: the score, the disqualifiers, the date. Decision discipline compounds — and the record is how you prove the pursuits you did pick were the right ones.',
  },
];

export default function ForProposalManagers() {
  return (
    <>
      <Helmet>
        <title>Bid/No-Bid Decisions for Proposal Managers — HE Pursuit</title>
        <meta name="description" content="Bid/no-bid discipline for proposal and capture teams. HE Pursuit scores every SAM.gov notice on fit, eligibility, timing, and risk — a filled-in decision scorecard before anyone commits proposal hours." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/for-proposal-managers" />
        <meta property="og:title" content="Bid/No-Bid Decisions for Proposal Managers — HE Pursuit" />
        <meta property="og:description" content="The bid/no-bid scorecard, already filled in. Triage SAM.gov at volume, kill bad pursuits early, and defend every decision with documented reasoning." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bid/No-Bid Decisions for Proposal Managers — HE Pursuit" />
        <meta name="twitter:description" content="Score every SAM.gov notice before the writing starts. Go / Conditional Go / No-Bid with evidence." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
      </Helmet>
      <SoftwareApplicationSchema />
      <FAQPageSchema items={faqs} />

      {/* Hero */}
      <section className="pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">For Proposal &amp; Capture Managers</span>
          </div>
          <h1 className="font-headline font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            Your team writes beautifully.<br className="hidden md:block" /> Stop making them write losers.
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-3xl">
            You know the pattern: three proposals in flight, all &ldquo;must-win,&rdquo; picked on gut and available bodies. Two were never winnable — wired for the incumbent, or disqualified by a requirement nobody caught until page 40. The writing was never the problem. The selection was. HE Pursuit runs the bid/no-bid framework on every SAM.gov notice automatically, so pursuit decisions happen on evidence, before the color-team calendar exists.
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
          <Notice align="left" className="mt-6 max-w-3xl">
            <span className="font-bold text-[#00c3ff]">Fall Bid Clarity Pass:</span>{' '}
            2 months of Starter or Pro free — applied automatically at checkout.{' '}
            <span className="font-bold text-[#00c3ff]">Ends November 30.</span>
          </Notice>
        </div>
      </section>

      {/* Cards */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cards.map((card, i) => (
              <FlyIn key={card.title} delay={['', 'delay-150', 'delay-300', 'delay-[450ms]'][i % 4]}>
              <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 h-full">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
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

      {/* FAQ */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline font-bold text-white text-3xl md:text-4xl tracking-tight text-center mb-10">
            Common questions from proposal teams
          </h2>
          <div className="space-y-4">
            {faqs.map(f => (
              <div key={f.q} className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6">
                <h3 className="font-headline font-bold text-white text-lg mb-2">{f.q}</h3>
                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline font-bold text-white text-3xl md:text-4xl tracking-tight text-center mb-8">
            Run your next bid/no-bid on evidence.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/tools/sam-gov-notice-analyzer/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline"
            >
              Try the Free Analyzer
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
