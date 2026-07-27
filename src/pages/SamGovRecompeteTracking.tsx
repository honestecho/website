import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw, Clock, Trophy, Search, Target, CheckCircle } from 'lucide-react';
import FlyIn from '../components/FlyIn';
import { SoftwareApplicationSchema } from '../components/SchemaOrg';

const leadCard = {
  Icon: RefreshCw,
  title: 'Recompetes are the most predictable opportunities in GovCon',
  body: 'Every federal contract ends. When it does, the work usually gets solicited again — a recompete. Unlike brand-new requirements, recompetes come with a paper trail: who holds the contract, what it is worth, when it expires, and how the agency bought it last time. For a small contractor, that makes recompetes the rare pipeline you can see coming quarters in advance — if you are tracking expirations instead of waiting for the RFP to surprise you.',
};

const cards = [
  {
    Icon: Clock,
    kicker: 'The window',
    title: 'The recompete is won before the solicitation posts',
    body: 'By the time a recompete RFP hits SAM.gov, incumbents have been positioning for a year and informed challengers have already met the customer, shaped their teaming, and built past-performance stories. If your first contact with a recompete is the solicitation notice, you are starting last. Tracking contract expirations flips that: you know the opportunity exists while there is still time to position.',
  },
  {
    Icon: Trophy,
    kicker: 'The opening',
    title: 'Incumbents lose recompetes more often than you think',
    body: 'Recompetes are not coronations. Incumbents get complacent, key staff leave, pricing drifts, requirements change, and set-aside decisions shift who is even allowed to bid. A challenger who shows up early with sharp past performance and a credible transition story wins these — but only the challengers who knew the recompete was coming.',
  },
  {
    Icon: Search,
    kicker: 'How HE Pursuit helps',
    title: 'Expiring-contract tracking, matched to your NAICS',
    body: 'HE Pursuit scans federal award data (USASpending) for contracts in your NAICS codes that are approaching their end dates, and surfaces them as recompete candidates — incumbent, value, and timeline included. Instead of manually cross-referencing award databases, your pipeline of upcoming recompetes builds itself from your company profile.',
  },
  {
    Icon: Target,
    kicker: 'How HE Pursuit helps',
    title: 'Award history is intel — 22,000+ award notices indexed',
    body: 'HE Pursuit’s opportunity index holds over 22,000 award notices alongside active solicitations — who won, for how much, under what set-aside. That is the raw material for recompete strategy: what the agency paid last time, whether the award was set aside, and which incumbents keep showing up in your lane.',
  },
  {
    Icon: CheckCircle,
    kicker: 'From signal to decision',
    title: 'Then qualify it like any other pursuit',
    body: 'A recompete on the calendar is a signal, not a decision. When the notice appears, run it through HE Pursuit’s bid/no-bid workflow: fit, eligibility, incumbent strength, and pursuit value. Chase the recompetes where a challenger actually has a path — and let the rest expire without you.',
  },
];

const faqs = [
  {
    q: 'What is a recompete in government contracting?',
    a: 'When a federal contract reaches the end of its period of performance, the agency typically re-solicits the ongoing work — that new competition is the recompete. The incumbent contractor competes to keep the work; challengers compete to take it.',
  },
  {
    q: 'How do I find upcoming recompetes before the RFP is posted?',
    a: 'Track contract end dates in federal award data. Public sources like USASpending list active contracts, their values, and their end dates. HE Pursuit automates this: it matches expiring contracts to your NAICS codes and surfaces them as recompete candidates with the incumbent and timeline attached.',
  },
  {
    q: 'Can a small business beat an incumbent on a recompete?',
    a: 'Yes — especially when the recompete becomes a small-business or socioeconomic set-aside, when incumbent performance has slipped, or when the requirement changes enough to reset the playing field. The common thread in challenger wins is early positioning, which requires knowing about the recompete early.',
  },
  {
    q: 'How early should I start positioning for a recompete?',
    a: 'Most practitioners aim for 6–18 months before the expected solicitation: time to meet the customer, respond to any Sources Sought, line up teammates, and build the past-performance narrative. That is why expiration tracking matters more than solicitation alerts.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function SamGovRecompeteTracking() {
  return (
    <>
      <Helmet>
        <title>SAM.gov Recompete Tracking for Small Contractors — HE Pursuit</title>
        <meta name="description" content="Recompetes are GovCon's most predictable pipeline — if you track contract expirations early. HE Pursuit matches expiring federal contracts to your NAICS codes and indexes 22,000+ award notices for incumbent intel." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/sam-gov-recompete-tracking" />
        <meta property="og:title" content="SAM.gov Recompete Tracking for Small Contractors — HE Pursuit" />
        <meta property="og:description" content="Every contract ends. Track expirations in your NAICS lane, see the incumbent and value, and position quarters ahead of the RFP." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SAM.gov Recompete Tracking for Small Contractors — HE Pursuit" />
        <meta name="twitter:description" content="Every contract ends. Track expirations in your NAICS lane, see the incumbent and value, and position quarters ahead of the RFP." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <SoftwareApplicationSchema />

      {/* Hero */}
      <section className="pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">Recompete Tracking</span>
          </div>
          <h1 className="font-headline font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            See the recompete coming<br className="hidden md:block" /> before the RFP does.
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-3xl">
            Every federal contract has an end date, and most of the work gets solicited again. HE Pursuit tracks expiring contracts in your NAICS lane — incumbent, value, and timeline — so you position quarters ahead instead of discovering the recompete when the solicitation posts.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
            <Link
              to="/signup/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline"
            >
              Start Free — Track Your Lane
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/tools/sam-gov-notice-analyzer/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline"
            >
              Analyze a Notice Free
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

      {/* FAQ */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline font-bold text-white text-3xl tracking-tight text-center mb-8">
            Recompete questions, answered
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
        <div className="max-w-7xl mx-auto">
        <h2 className="font-headline font-bold text-white text-3xl md:text-4xl tracking-tight text-center mb-8">
          Stop being surprised by your own market.
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline"
          >
            Start Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/sources-sought-worth-responding/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline"
          >
            Sources Sought Guide
          </Link>
        </div>
        </div>
      </section>
    </>
  );
}
