import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Scale, Zap, Layers, Presentation, DollarSign } from 'lucide-react';
import FlyIn from '../components/FlyIn';
import Notice from '../components/Notice';
import { SoftwareApplicationSchema, FAQPageSchema } from '../components/SchemaOrg';

const faqs = [
  {
    q: 'What tools do GovCon consultants use to screen opportunities for clients?',
    a: 'The traditional stack is GovWin IQ or GovTribe for discovery plus manual judgment for screening — powerful, but priced for firms, not solo consultants, and the screening hours don\'t scale past a handful of clients. HE Pursuit covers the screening layer: each client gets a profile, every SAM.gov notice gets scored against it, and the consultant reviews a ranked shortlist per client instead of running the same searches ten times.',
  },
  {
    q: 'How do consultants justify a no-bid recommendation to a client?',
    a: 'With evidence, not authority. A client who hears "I don\'t think it\'s a fit" pushes back; a client who sees the scored breakdown — eligibility gap, incumbent signals, timing risk, effort versus value — accepts the recommendation and remembers who protected their proposal budget. HE Pursuit produces that breakdown for every notice, in a form you can put in front of a client.',
  },
  {
    q: 'Can I use HE Pursuit in client workshops or training?',
    a: 'Yes — the SAM.gov notice analyzer is free and needs no account, which makes it a live demo you can run in any workshop: paste a real notice, watch the verdict and reasoning render, switch sample business profiles to show how fit changes the answer. Advisors who must stay vendor-neutral can present the analysis method without endorsing a purchase.',
  },
  {
    q: 'Is HE Pursuit a GovWin alternative for consultants?',
    a: 'For opportunity screening and bid/no-bid decisions, yes — at $99–$199/month instead of five figures a year. It does not replace GovWin\'s market-intelligence depth (pre-RFP forecasting, competitor analysis, state/local coverage). Many consultants use HE Pursuit as the per-client screening layer and reserve enterprise tools for the engagements that pay for them.',
  },
  {
    q: 'How does pricing work for consultants with multiple clients?',
    a: 'Plans are priced per account ($99 Starter / $199 Pro), and through November 30 two months of Starter or Pro are free, applied automatically at checkout. The free analyzer needs no account at all — many consultants start there, then upgrade when the multi-client workflow earns it.',
  },
];

const cards = [
  {
    Icon: Users,
    title: 'Ten clients. One screening pass.',
    body: 'Sunday night SAM.gov searches, once per client, was never a business model. Set a profile per client and every notice scores against all of them — your judgment goes where it\'s worth billing: the top of each list.',
  },
  {
    Icon: Scale,
    title: 'Scores you can defend in a client meeting',
    body: 'Your judgment is the product — a defensible scorecard makes it scalable, not obsolete. Every recommendation shows evidence a client can interrogate: what fits, what disqualifies, what to verify before spending their proposal budget.',
  },
  {
    Icon: Presentation,
    title: 'A live demo that teaches itself',
    body: 'The free analyzer needs no login: paste a real notice in a workshop, show the verdict, switch sample profiles to prove that fit depends on the business. Attendees stop glazing over at SAM.gov the moment they see their own trade scored.',
  },
  {
    Icon: Zap,
    title: 'Faster intake, more clients',
    body: 'When screening a new client\'s pipeline takes an hour instead of a week, intake stops being the bottleneck. Take the engagement; let the scored feed do the first pass.',
  },
  {
    Icon: DollarSign,
    title: 'Enterprise-tool output without the enterprise invoice',
    body: 'GovWin-grade triage at $99–$199 a month means the math works for a solo practice — and for recommending to clients who would never sign a five-figure data contract.',
  },
  {
    Icon: Layers,
    title: 'Deliverables your clients keep',
    body: 'Scored pipelines, documented no-bids, decision records — artifacts that survive the engagement and prove your value at renewal time.',
  },
];

export default function ForGovconConsultants() {
  return (
    <>
      <Helmet>
        <title>Opportunity Screening for GovCon Consultants — HE Pursuit</title>
        <meta name="description" content="Multi-client SAM.gov screening for GovCon consultants, capture advisors, and proposal shops. Defensible bid/no-bid scores per client — without GovWin pricing." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/for-govcon-consultants" />
        <meta property="og:title" content="Opportunity Screening for GovCon Consultants — HE Pursuit" />
        <meta property="og:description" content="Screen SAM.gov for every client from one place. Evidence-backed bid/no-bid recommendations your clients can interrogate." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Opportunity Screening for GovCon Consultants — HE Pursuit" />
        <meta name="twitter:description" content="Multi-client SAM.gov triage with defensible scores. Free analyzer for live workshop demos." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
      </Helmet>
      <SoftwareApplicationSchema />
      <FAQPageSchema items={faqs} />

      {/* Hero */}
      <section className="pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">For GovCon Consultants &amp; Advisors</span>
          </div>
          <h1 className="font-headline font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            Your judgment is the product.<br className="hidden md:block" /> Make it scale.
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-3xl">
            You can read a solicitation in minutes — that was never the bottleneck. The bottleneck is running the same SAM.gov searches for ten clients, writing the same &ldquo;here&rsquo;s why this one isn&rsquo;t a fit&rdquo; email for the ninth time, and turning away work because screening doesn&rsquo;t scale. HE Pursuit runs the per-client screening layer: one scored feed per client profile, evidence-backed recommendations you can put in front of anyone, and a free no-login analyzer you can demo live in a workshop.
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
            Common questions from consultants
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
            Demo it on a live notice — no account, no pitch.
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
              to="/vs-govwin/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline"
            >
              Compare vs GovWin
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
