import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle, Megaphone, Scale, ShieldCheck, XCircle, CheckCircle } from 'lucide-react';
import FlyIn from '../components/FlyIn';
import { SoftwareApplicationSchema } from '../components/SchemaOrg';

const leadCard = {
  Icon: Megaphone,
  title: 'A Sources Sought notice is market research — and an invitation',
  body: 'Before an agency issues an RFP, it often posts a Sources Sought notice (or RFI) on SAM.gov to find out who could do the work. There are roughly 3,000 active Sources Sought notices on SAM.gov at any given time, with 2,000+ posted in the last 30 days alone. No contract is awarded from one — but the responses shape the acquisition strategy, the set-aside decision, and sometimes the requirement itself. Responding is how you get in the room before the room exists.',
};

const cards = [
  {
    Icon: ShieldCheck,
    kicker: 'Why respond',
    title: 'Your response can trigger a small-business set-aside',
    body: 'Under the "rule of two," if the agency finds at least two capable small businesses, it can set the work aside for small business — and Sources Sought responses are exactly where that evidence comes from. A credible capability statement from your company can literally change who is allowed to compete. Skip the notice, and the set-aside decision gets made from whoever did respond.',
  },
  {
    Icon: Scale,
    kicker: 'Why respond',
    title: 'You help shape the requirement before it hardens',
    body: 'At the Sources Sought stage, the scope, evaluation criteria, and contract vehicle are still in motion. Thoughtful responses — pointing out what is realistic, what drives cost, what a small firm can deliver — routinely influence the final RFP. By the time the solicitation drops, that window is closed and you are bidding against a requirement someone else helped write.',
  },
  {
    Icon: XCircle,
    kicker: 'When to skip',
    title: 'Not every Sources Sought deserves your hours',
    body: 'If the incumbent is entrenched and performing, the scope is far outside your NAICS lane, or the agency has no history of awarding to firms like yours, a response may be effort spent on someone else’s market research. The decision is the same discipline as bid/no-bid: fit, eligibility, and realistic positioning — just cheaper to get right at this stage.',
  },
  {
    Icon: HelpCircle,
    kicker: 'The catch',
    title: 'Many Sources Sought notices are easy to miss entirely',
    body: 'Sources Sought and other early-stage notices are frequently posted without a NAICS code — right now over 850 active early-stage notices on SAM.gov (Sources Sought, Special Notices, presolicitations) carry no NAICS code at all. If your search or tool filters by NAICS, these never appear. HE Pursuit indexes every notice and makes it keyword-searchable, so the early opportunities stay visible.',
  },
  {
    Icon: CheckCircle,
    kicker: 'How to decide',
    title: 'Run it through the same bid/no-bid discipline — in minutes',
    body: 'Paste the notice into the free analyzer and get a fit score, a recommendation, and the top factors — against a business profile like yours. If it is worth a response, HE Pursuit’s full workflow helps you qualify it properly: eligibility, disqualifiers, and what a credible response needs to say. If it is not, you found out in minutes instead of an afternoon.',
  },
];

const faqs = [
  {
    q: 'Does responding to a Sources Sought notice lead to a contract?',
    a: 'Not directly — no award is made from a Sources Sought. But responses influence whether the work is set aside for small business, what the final requirement looks like, and which firms the contracting office already knows when the RFP is released.',
  },
  {
    q: 'What should a Sources Sought response include?',
    a: 'A concise capability statement matched to the notice: who you are (size, socioeconomic status, NAICS), directly relevant past performance, and clear statements that you can perform the scope described. Answer the specific questions the notice asks — contracting officers read for evidence, not marketing.',
  },
  {
    q: 'How much time do I have to respond?',
    a: 'Response windows vary and are often short. The deadline is stated on each notice — and it is one of the first things HE Pursuit’s analyzer surfaces, along with whether the opportunity is worth the effort at all.',
  },
  {
    q: 'Why don’t I see Sources Sought notices in my SAM.gov searches?',
    a: 'Two common reasons: your saved search filters by notice type (solicitations only), or it filters by NAICS code — and many early-stage notices are posted without one. A keyword-based search across all notice types, like HE Pursuit’s, surfaces them.',
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

export default function SourcesSoughtGuide() {
  return (
    <>
      <Helmet>
        <title>Should You Respond to a Sources Sought Notice? — HE Pursuit</title>
        <meta name="description" content="Sources Sought notices shape set-aside decisions and requirements before the RFP exists. When responding is worth it, when to skip, and how to decide in minutes with a free SAM.gov notice analysis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/sources-sought-worth-responding" />
        <meta property="og:title" content="Should You Respond to a Sources Sought Notice? — HE Pursuit" />
        <meta property="og:description" content="Responses shape set-asides and requirements before the RFP exists. When it's worth your hours — and how to decide in minutes." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Should You Respond to a Sources Sought Notice? — HE Pursuit" />
        <meta name="twitter:description" content="Responses shape set-asides and requirements before the RFP exists. When it's worth your hours — and how to decide in minutes." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <SoftwareApplicationSchema />

      {/* Hero */}
      <section className="pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">Sources Sought</span>
          </div>
          <h1 className="font-headline font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            Should you respond to<br className="hidden md:block" /> that Sources Sought notice?
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-3xl">
            No contract is awarded from a Sources Sought — but the responses decide set-asides, shape requirements, and introduce you to the contracting office before the RFP exists. Some deserve a same-week response. Many deserve a pass. Here is how to tell the difference without burning an afternoon.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
            <Link
              to="/tools/sam-gov-notice-analyzer/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline"
            >
              Analyze a Sources Sought — Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/sam-gov-hidden-opportunities/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline"
            >
              Why these notices hide
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
            Sources Sought questions, answered
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
          Decide in minutes, not afternoons.
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
            to="/signup/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline"
          >
            Start Free
          </Link>
        </div>
        </div>
      </section>
    </>
  );
}
