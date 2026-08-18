import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Clock, TrendingUp, ShieldCheck, Scale, Filter } from 'lucide-react';
import FlyIn from '../components/FlyIn';
import Notice from '../components/Notice';
import { SoftwareApplicationSchema, FAQPageSchema } from '../components/SchemaOrg';

const faqs = [
  {
    q: 'How do small business owners find government contracts worth bidding on?',
    a: 'Most small contractors start on SAM.gov, which lists federal contract opportunities but ranks none of them for your business. The practical workflow is: define your NAICS codes, certifications, and capacity once, then screen every incoming notice against that profile. HE Pursuit automates that screening — each SAM.gov notice gets a fit score and a Go, Conditional Go, or No-Bid read against your actual profile, so you spend proposal hours only on winnable work.',
  },
  {
    q: 'I just got my 8(a), SDVOSB, WOSB, or HUBZone certification. Now what?',
    a: 'A certification creates eligibility, not awards — and 8(a) in particular is a nine-year program, so every year without set-aside pursuits is spent runway. The first step is visibility: a feed of notices filtered to your set-aside and NAICS codes, scored for fit. HE Pursuit flags set-aside matches against your certifications automatically, so the opportunities your certification unlocks stop hiding in the feed.',
  },
  {
    q: 'Can a small subcontractor become a prime contractor?',
    a: 'Yes — and the transition is mostly about picking the right first prime bid, not building new infrastructure. Every notice HE Pursuit analyzes includes a recommended route: prime it, or pursue it as a subcontractor. Notices flagged as primeable at your size — right dollar range, right set-aside, requirements you already meet — are where sub-to-prime transitions actually start.',
  },
  {
    q: 'How much time should a small business spend on a federal proposal?',
    a: 'A competitive federal proposal routinely consumes days to weeks of working time, depending on scope. That is exactly why the bid/no-bid decision matters more than the writing: a disciplined no-bid saves the entire cost of a doomed pursuit. Screening with HE Pursuit takes minutes per notice, so the expensive hours only start after a defensible Go.',
  },
  {
    q: 'Is HE Pursuit free for small businesses?',
    a: 'The SAM.gov notice analyzer is free and requires no account. The Free plan adds search and bookmarks with no credit card. Paid plans ($99–$199/month) add the full pursuit workflow — and through November 30, two months of Starter or Pro are free, applied automatically at checkout.',
  },
];

const cards = [
  {
    Icon: Filter,
    title: 'SAM.gov is a firehose. You need a filter with judgment.',
    body: 'Two thousand new federal notices post every day. Your business fits a handful. HE Pursuit screens every notice against your NAICS codes, certifications, geography, and capacity — and tells you which ones deserve a look, with the reasoning shown.',
  },
  {
    Icon: Clock,
    title: 'Stop paying the 40-hour tax on bad-fit RFPs',
    body: "The most expensive mistake in small-business GovCon isn't losing a bid — it's spending weeks on one that was never winnable. A structured bid/no-bid read before you commit protects the hours that keep your business running.",
  },
  {
    Icon: TrendingUp,
    title: 'Sub today. Prime when the notice is right.',
    body: 'Every analyzed notice gets a recommended route: prime it, or pursue it as a sub. Notices flagged as primeable at your size — right dollar range, right set-aside, requirements you already meet — are how subcontractors become primes without betting the company.',
  },
  {
    Icon: ShieldCheck,
    title: 'Put your certification to work',
    body: '8(a), SDVOSB, WOSB, HUBZone — a set-aside certification creates eligibility, not awards, and 8(a) is a nine-year program. HE Pursuit surfaces the set-aside notices your certification actually unlocks, so the eligibility gets used instead of framed.',
  },
  {
    Icon: Scale,
    title: 'Defensible decisions, not gut calls',
    body: 'When you skip an opportunity, you should know why — and when you commit, your team should see the same reasoning. Every score comes with the evidence behind it: what fits, what to watch, what disqualifies.',
  },
  {
    Icon: Compass,
    title: 'Built for owner-operators, priced like it',
    body: "You don't have a BD department. HE Pursuit does the finding, screening, and scoring a BD hire would start with — at a small-business monthly price. Start free; upgrade when the pipeline earns it.",
  },
];

export default function ForSmallBusinessOwners() {
  return (
    <>
      <Helmet>
        <title>Government Contracts for Small Business Owners — HE Pursuit</title>
        <meta name="description" content="Find and qualify federal contracts that fit your small business. HE Pursuit screens SAM.gov notices against your NAICS, certifications, and capacity — bid/no-bid decisions in minutes, not weekends." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/for-small-business-owners/" />
        <meta property="og:title" content="Government Contracts for Small Business Owners — HE Pursuit" />
        <meta property="og:description" content="SAM.gov lists 2,000 notices a day. HE Pursuit tells you which ones fit your small business — and whether to prime, sub, or pass." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Government Contracts for Small Business Owners — HE Pursuit" />
        <meta name="twitter:description" content="Screen SAM.gov opportunities against your real business profile. Bid/no-bid decisions in minutes." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
      </Helmet>
      <SoftwareApplicationSchema />
      <FAQPageSchema items={faqs} />

      {/* Hero */}
      <section className="pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">For Small Business Owners</span>
          </div>
          <h1 className="font-headline font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            You run the business.<br className="hidden md:block" /> Who runs the pipeline?
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-3xl">
            You registered on SAM.gov. Maybe you got certified. Maybe you even bid — and lost to an incumbent you never had a chance against, or watched a &ldquo;perfect&rdquo; RFP eat three weekends before it went to someone else. The problem was never your work. It was picking pursuits without a screen. HE Pursuit scores every SAM.gov notice against your actual business — NAICS, certifications, size, geography — and tells you: pursue it, sub it, or skip it.
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
            Common questions from small business owners
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
            Paste one notice. See the verdict.
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
