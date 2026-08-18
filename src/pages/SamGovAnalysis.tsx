import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Scale, Target, CheckCircle, FileText } from 'lucide-react';
import FlyIn from '../components/FlyIn';
import { SoftwareApplicationSchema } from '../components/SchemaOrg';

const leadCard = {
  Icon: Search,
  title: 'SAM.gov gives you opportunities — not answers',
  body: 'SAM.gov lists federal contracting opportunities for free. What it does not give you is a structured way to evaluate whether any specific opportunity is worth pursuing. That qualification gap is exactly what HE Pursuit fills.',
};

const phaseCards = [
  {
    Icon: Target,
    phase: 1,
    title: 'Fit analysis — is this right for your company?',
    body: 'HE Pursuit evaluates each SAM.gov opportunity against your company profile: NAICS codes, set-aside status, certifications, agency relationships, and geographic reach. You see fit signals immediately, before investing time in deeper review.',
  },
  {
    Icon: ShieldCheck,
    phase: 2,
    title: 'Eligibility review — can you actually bid?',
    body: 'Missing an eligibility requirement is one of the most common reasons small contractors waste proposal resources. HE Pursuit flags eligibility issues early — size standards, certifications, past performance requirements — so you know before you commit.',
  },
  {
    Icon: FileText,
    phase: 3,
    title: 'From SAM.gov notice to decision-ready output',
    body: 'HE Pursuit closes the loop between opportunity discovery and pursuit decision. Import a SAM.gov opportunity, run it through the qualification workflow, and get a structured analysis your team can review, challenge, and act on.',
  },
  {
    Icon: Scale,
    phase: 4,
    title: 'Effort and risk scoring — is it worth your time?',
    body: 'Technical fit is necessary but not sufficient. HE Pursuit also weighs the effort required to bid against the realistic value of winning — helping you walk away from opportunities that look attractive but drain more than they return.',
  },
  {
    Icon: CheckCircle,
    phase: 5,
    title: 'Go / Conditional Go / No-Bid in minutes',
    body: 'Most SAM.gov evaluations in HE Pursuit take minutes. The result is a structured recommendation — Go, Conditional Go, or No-Bid — grounded in your specific company profile, not a generic scoring algorithm.',
  },
];

export default function SamGovAnalysis() {
  return (
    <>
      <Helmet>
        <title>SAM.gov Opportunity Analysis Tool — HE Pursuit</title>
        <meta name="description" content="HE Pursuit is a SAM.gov opportunity analysis tool for small government contractors. Evaluate fit, eligibility, and pursuit value in minutes and make faster bid/no-bid decisions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/sam-gov-opportunity-analysis" />
        <meta property="og:title" content="SAM.gov Opportunity Analysis Tool — HE Pursuit" />
        <meta property="og:description" content="SAM.gov lists opportunities. HE Pursuit helps you decide which ones to pursue. Structured fit, eligibility, and effort analysis for small government contractors." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SAM.gov Opportunity Analysis Tool — HE Pursuit" />
        <meta name="twitter:description" content="SAM.gov lists opportunities. HE Pursuit helps you decide which ones to pursue. Structured bid/no-bid analysis for small government contractors." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
      </Helmet>
      <SoftwareApplicationSchema />

      {/* Hero */}
      <section className="pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">SAM.gov Analysis</span>
          </div>
          <h1 className="font-headline font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            SAM.gov opportunity analysis<br className="hidden md:block" /> built for small contractors.
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-3xl">
            SAM.gov is free and comprehensive. But listing opportunities is different from analyzing them. HE Pursuit gives small government contractors a structured way to evaluate SAM.gov opportunities for fit, eligibility, and pursuit value — so your team makes faster, more defensible bid/no-bid decisions.
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
            {phaseCards.map((card, i) => (
              <FlyIn key={card.title} delay={['', 'delay-150', 'delay-300', 'delay-[450ms]'][i % 4]} className={card.phase === 5 ? 'lg:col-span-2' : ''}>
              <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 h-full">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 text-[#00c3ff] text-xs font-bold tracking-widest uppercase font-label mb-4">
                  Phase {card.phase}
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
            Paste a live notice number and see the analysis for yourself. Not sure where to look?{' '}
            <Link to="/sam-gov-hidden-opportunities/" className="text-[#00c3ff] hover:text-white transition-colors underline underline-offset-4">
              Start with the opportunities SAM.gov&rsquo;s search hides
            </Link>.
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
          Stop guessing on bid decisions.
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
            to="/faq/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline"
          >
            Common Questions
          </Link>
        </div>
        </div>
      </section>
    </>
  );
}
