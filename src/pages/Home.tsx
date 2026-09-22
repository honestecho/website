import type { ElementType } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Sparkles, CheckCircle, Users, FileText, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import FlyIn from '../components/FlyIn';
import Notice from '../components/Notice';
import { SoftwareApplicationSchema } from '../components/SchemaOrg';
import HeroPursuitCardZoom from '../components/HeroPursuitCardZoom';
import ZoomImage from '../components/ZoomImage';
import { track } from '../lib/analytics';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030B17]';

// Both primary CTAs go to opportunity discovery; notice analysis stays the secondary path.
const DISCOVERY_TO = '/signup/?promo=fall2026';
const ANALYZER_TO = '/tools/sam-gov-notice-analyzer/';


// The example shown in the Bid Handoff screenshot: the V2 journey preview rig walked on the
// TEIS IV On-Ramp notice (public SAM.gov data) with example answers; the rationale is the
// example's recorded text and the counts are the product's own output. Not a customer's data.
const DECISION_EXAMPLE = {
  title: 'TEIS IV On-Ramp Opportunity',
  agency: 'Department of the Army',
  call: 'Go',
  why: 'Primary NAICS and past performance match the on-ramp; no eligibility gaps, a comfortable response window, and a seat on a vehicle we want.',
  handoff: '570 requirements identified across five work packages, one submission rule to review, and 15 source documents on record.',
};

const FAQ = [
  {
    q: 'What can I do for free?',
    a: 'Search SAM.gov opportunities, see the ones ranked for your profile, bookmark up to 15 a month, save searches with nightly alerts, and run one evaluation to try the workflow. No credit card.',
  },
  {
    q: 'What information is needed to match opportunities to my business?',
    a: 'Your company name, one NAICS code, and one target agency are enough to start — or enter your UEI and we pull the basics from SAM.gov. Add certifications, keywords, geography, and contract size later to sharpen the ranking.',
  },
  {
    q: 'Where do opportunities come from, and how current are they?',
    a: 'Every notice comes from SAM.gov’s public listings. We sync nightly, Monday through Saturday, score new notices against your profile, and send alerts for your saved searches.',
  },
  {
    q: 'Does a high fit score mean I’m eligible to bid?',
    a: 'No. Fit measures how well a notice matches your profile. Eligibility — set-asides, certifications, clearances, registrations — is checked in the evaluation workflow, and the notice itself is always the final word.',
  },
  {
    q: 'What happens after I find an opportunity I like?',
    a: 'Bookmark it, then run the five-phase evaluation: triage, eligibility, alignment, viability, and a recorded Go or No-Go with the rationale — then hand the requirements off to your proposal team. Your first evaluation is free; Starter includes up to 25 pursuits a month, and Pro is unlimited.',
  },
];

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Honest Echo — GovCon Bid/No-Bid Intelligence for Small Contractors</title>
        <meta name="description" content="Find, qualify, and decide on government contracting opportunities faster. HE Pursuit analyzes SAM.gov notices and gives small contractors a bid/no-bid recommendation in minutes — before you waste proposal hours." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/" />
        <meta property="og:title" content="HE Pursuit — Bid/No-Bid Decisions for Small Government Contractors" />
        <meta property="og:description" content="Find, qualify, and decide on government contracting opportunities faster. SAM.gov opportunity scoring, fit analysis, and pursuit intelligence for lean GovCon teams." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview-3.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HE Pursuit — Bid/No-Bid Decisions for Small Government Contractors" />
        <meta name="twitter:description" content="Qualify government contracting opportunities in minutes. SAM.gov opportunity scoring and pursuit intelligence for lean GovCon teams." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview-3.png" />
      </Helmet>
      <SoftwareApplicationSchema />

      {/* ── 1 — Hero: finding matched opportunities is the entry point ─────── */}
      <section className="relative px-6 pt-14 pb-16 lg:pt-20 lg:pb-20">
        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,46fr)_minmax(0,54fr)] gap-12 xl:gap-16 items-center">

          {/* Left column: copy + CTA */}
          <div className="w-full max-w-[600px]">
            <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-[#a9b6cb] mb-5">For small government contractors</p>
            <h1 className="font-headline font-black text-[38px] sm:text-5xl lg:text-[52px] xl:text-[64px] tracking-[-0.035em] leading-[1.02] text-white drop-shadow-2xl">
              Find government opportunities <span className="he-gradient-text">worth pursuing.</span>
            </h1>
            <p className="mt-6 text-lg lg:text-xl leading-relaxed text-[#a9b6cb] font-body max-w-[50ch]">
              Discover SAM.gov opportunities matched to your business. See why they fit, spot potential obstacles, and decide where to invest your proposal time.
            </p>

            <div className="mt-8">
              <Link
                to={DISCOVERY_TO}
                onClick={() => track('home_discovery_cta_clicked')}
                className={`inline-flex w-full sm:w-auto items-center justify-center gap-2.5 min-h-[56px] px-6 sm:px-8 rounded-xl bg-[#00c3ff] text-[#030B17] font-bold text-base sm:text-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all ${focusRing}`}
              >
                Find My Opportunities — Free
                <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
              </Link>
              <p className="mt-3 text-sm text-[#a9b6cb] font-body">Create a free account and set up your profile to see your matches.</p>
              <p className="mt-4 text-sm font-body">
                <Link
                  to={ANALYZER_TO}
                  onClick={() => track('home_analyzer_link_clicked')}
                  className={`inline-flex items-center gap-1.5 min-h-[44px] font-semibold text-[#00c3ff] hover:underline underline-offset-4 rounded ${focusRing}`}
                >
                  Already have an opportunity? Analyze a notice
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </Link>
              </p>
            </div>
          </div>

          {/* Right column: the product's real decision card — static render, click to enlarge */}
          <div className="w-full min-w-0 hidden md:flex items-center lg:justify-self-end lg:max-w-[680px] transition-transform duration-700 hover:-translate-y-2">
            <HeroPursuitCardZoom />
          </div>
        </div>
      </section>

      {/* ── 2 — How it works: three steps ─────────────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-24 px-6 py-16 lg:py-20 border-t border-[#1e2d4a]/60 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="font-headline font-black text-[32px] sm:text-4xl lg:text-[44px] text-white tracking-[-0.03em] leading-[1.05]">
            From opportunity to a <span className="he-gradient-text">clear</span> decision.
          </h2>
          <ol className="mt-10 lg:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {([
              { Icon: FileText,    title: 'Build your profile',      body: 'Tell us what you do and where you want to compete.' },
              { Icon: Search,      title: 'Find your opportunities', body: 'Review matches ranked for your business, with reasons you can inspect.' },
              { Icon: CheckCircle, title: 'Decide what to pursue',   body: 'Check eligibility, fit, and effort before committing proposal time.' },
            ] as { Icon: ElementType; title: string; body: string }[]).map(({ Icon, title, body }, i) => (
              <li key={title}>
                <FlyIn delay={['', 'delay-150', 'delay-300'][i]} className="h-full">
                  <div className="relative h-full bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 lg:p-8 shadow-2xl overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="w-12 h-12 rounded-xl bg-[#00c3ff]/10 border border-[#00c3ff]/30 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#00c3ff]" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <span className="font-headline font-bold text-sm text-[#00c3ff] tracking-widest tabular-nums" aria-hidden="true">0{i + 1}</span>
                    </div>
                    <h3 className="font-headline font-bold text-lg lg:text-xl text-white tracking-tight leading-snug">{title}</h3>
                    <p className="mt-2 text-[15px] lg:text-base text-[#a9b6cb] font-body leading-relaxed">{body}</p>
                  </div>
                </FlyIn>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 3 — See why an opportunity fits ───────────────────────────────── */}
      <section className="px-6 py-24 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-12 lg:gap-16 items-start">

            <div className="max-w-[560px]">
              <h2 className="font-headline font-black text-[34px] sm:text-4xl lg:text-[48px] text-white tracking-[-0.03em] leading-[1.02]">
                See <span className="he-gradient-text">why</span> an opportunity fits.
              </h2>
              <p className="mt-4 text-base text-[#a9b6cb] font-body">Built for small contractors and lean proposal teams.</p>

              <ol className="mt-10 space-y-8">
                {[
                  { title: 'Why it fits',        body: 'Six scored reasons — NAICS, competitive access, your keywords, timing, agency, geography — add up to the fit score, each explained in plain language. Then you make the strategic call: how does it support your growth priorities?' },
                  { title: 'What needs checking', body: 'Points not earned show where the match is weaker, and you can challenge any reason you disagree with. A challenged reason stays flagged through to the decision.' },
                  { title: 'Where it came from',  body: 'Every reason opens to its evidence: what the notice says beside what your profile says, so you can see the match for yourself.' },
                ].map(({ title, body }, i) => (
                  <li key={title} className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-[50%] bg-[#00c3ff] text-[#030B17] font-headline font-black text-sm flex items-center justify-center shrink-0 tabular-nums" aria-hidden="true">{i + 1}</span>
                    <div className="pt-0.5">
                      <h3 className="font-headline font-bold text-lg lg:text-xl text-white tracking-tight leading-snug">{title}</h3>
                      <p className="mt-1.5 text-[15px] lg:text-base text-[#a9b6cb] font-body leading-relaxed">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="mt-10 text-base lg:text-lg text-white font-body leading-relaxed text-pretty">
                The score is where you start. The reasons are what you decide with.
              </p>
            </div>

            <FlyIn delay="delay-150" className="w-full min-w-0">
              <ZoomImage
                src="/fit-example.png"
                alt="HE Pursuit Alignment phase for an example pursuit: a fit score of 94 out of 100, the six scored reasons behind it — NAICS, competitive access, profile keywords, timing, agency, geography — and the strategic call on growth priorities"
                width={1650}
                height={1498}
                zoomMinWidthClass="min-w-[825px]"
                label="Example pursuit"
              />
              <p className="mt-3 text-xs text-[#8b9bb4] font-body text-center">The Alignment phase of an example pursuit — score, six reasons, and your strategic call — on a public SAM.gov notice with example answers.</p>
            </FlyIn>
          </div>
        </div>
      </section>

      {/* ── 4 — Decide before you invest proposal time ────────────────────── */}
      <section className="px-6 py-24 border-t border-[#1e2d4a]/60 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-12 lg:gap-16 items-start">

            <div className="max-w-[560px]">
              <h2 className="font-headline font-black text-[34px] sm:text-4xl lg:text-[48px] text-white tracking-[-0.03em] leading-[1.02]">
                Decide <span className="he-gradient-text">before</span> you invest proposal time.
              </h2>
              <p className="mt-5 text-lg text-[#a9b6cb] font-body leading-relaxed">
                Five phases — Triage, Eligibility, Alignment, Viability, Decision — each answer one question about the notice and end in a recorded Go or No-Go. What your proposal team receives is the Bid Handoff.
              </p>

              <ol className="mt-10 space-y-8">
                {[
                  { title: 'Your recorded call',            body: 'Go or No-Go, your rationale word for word, and the response deadline in view.' },
                  { title: 'What needs to happen next',     body: 'Only the work your answers call for — conditions to meet, gaps to close, submission rules to follow — each with an owner.' },
                  { title: 'Requirements by work package',  body: 'Every requirement in the notice, traced to its source section and sorted into proposal, eligibility, performance, deliverables, and administrative packages with a suggested role for each.' },
                ].map(({ title, body }, i) => (
                  <li key={title} className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-[50%] bg-[#00c3ff] text-[#030B17] font-headline font-black text-sm flex items-center justify-center shrink-0 tabular-nums" aria-hidden="true">{i + 1}</span>
                    <div className="pt-0.5">
                      <h3 className="font-headline font-bold text-lg lg:text-xl text-white tracking-tight leading-snug">{title}</h3>
                      <p className="mt-1.5 text-[15px] lg:text-base text-[#a9b6cb] font-body leading-relaxed">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="mt-10 text-base lg:text-lg text-white font-body leading-relaxed text-pretty">
                Your proposal team starts from a checklist, not from the raw notice.
              </p>
            </div>

            {/* One decision example: the product's Phase 5 screen, plus the call it shows */}
            <div className="w-full min-w-0">
              <FlyIn>
              <ZoomImage
                src="/decision-example.png"
                alt="HE Pursuit Bid Handoff screen for an example pursuit: the recorded Go decision with its rationale, what needs to happen next, the decision record with its sources, and every requirement sorted into work packages with suggested roles"
                width={1800}
                height={2972}
                zoomMinWidthClass="min-w-[900px]"
                label="Example pursuit"
              />
              </FlyIn>
              <FlyIn delay="delay-150">
              <div className="mt-4 rounded-2xl border border-[#1e2d4a] bg-[#0b1120] px-5 py-4 shadow-2xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8b9bb4]">Example pursuit</p>
                <p className="mt-1 text-sm font-bold text-white font-headline leading-snug">{DECISION_EXAMPLE.title}</p>
                <p className="text-xs text-[#8b9bb4] font-body">{DECISION_EXAMPLE.agency}</p>
                <dl className="mt-3 space-y-2 text-sm font-body">
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-[#8b9bb4]">The call</dt>
                    <dd className="font-bold text-[#4ade80]">{DECISION_EXAMPLE.call}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-[#8b9bb4]">Why</dt>
                    <dd className="text-[#dde2f1] leading-snug">{DECISION_EXAMPLE.why}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-[#8b9bb4]">Handoff</dt>
                    <dd className="text-[#dde2f1] leading-snug">{DECISION_EXAMPLE.handoff}</dd>
                  </div>
                </dl>
              </div>
              </FlyIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 — Pricing ───────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 border-t border-[#1e2d4a]/60 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-10 max-w-6xl mx-auto">
            <h2 className="font-headline font-black text-4xl md:text-5xl text-white mb-6 tracking-tight leading-tight">
              Start <span className="he-gradient-text">free</span>. Go deeper when you need to.
            </h2>
            <p className="text-lg lg:text-xl text-[#a9b6cb] font-body leading-relaxed">
              Free covers finding opportunities: a scored list of open SAM.gov opportunities that match your profile, search, up to 15 bookmarks a month, saved searches with nightly alerts, and one evaluation to try the workflow. Starter and Pro add the full five-phase workflow — eligibility review, disqualifiers, requirements, fit and effort scoring, and a recorded bid/no-bid decision you can hand off to your proposal team.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto mt-12">

            {/* Free */}
            <FlyIn>
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300 h-full">
              <h3 className="font-headline text-xl font-bold text-white mb-1">Free</h3>
              <p className="text-xs text-[#8b9bb4] mb-4">Find what fits</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white">$0</span>
              </div>
              <ul className="space-y-2 text-sm text-[#a0b2c8] mb-6 flex-grow">
                {['Scored list of open opportunities matching your profile', 'Search and view SAM.gov opportunities', 'Bookmark up to 15 opportunities/mo', 'Saved searches & nightly alerts', 'One evaluation to try the workflow'].map(f => (
                  <li key={f} className="flex gap-2 items-start"><Sparkles className="w-3.5 h-3.5 text-[#00c3ff] shrink-0 mt-0.5"/>{f}</li>
                ))}
              </ul>
              <Link to={DISCOVERY_TO} className="block text-center w-full py-3 rounded-lg border border-[#1e2d4a] text-white font-bold hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all text-sm">Start Free</Link>
            </div>
            </FlyIn>

            {/* Starter */}
            <FlyIn delay="delay-150">
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300 h-full">
              <h3 className="font-headline text-xl font-bold text-white mb-1">Starter</h3>
              <p className="text-xs text-[#8b9bb4] mb-4">Make real bid/no-bid decisions</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white">$99</span>
                <span className="text-[#8b9bb4] text-sm">/mo</span>
              </div>
              <ul className="space-y-2 text-sm text-[#a0b2c8] mb-6 flex-grow">
                {['Everything in Free', 'Full five-phase workflow', 'Eligibility & disqualifier review', 'Requirements extraction', 'Strategic fit & effort scoring', 'Up to 25 pursuits per month'].map(f => (
                  <li key={f} className="flex gap-2 items-start"><Sparkles className="w-3.5 h-3.5 text-[#00c3ff] shrink-0 mt-0.5"/>{f}</li>
                ))}
              </ul>
              <Link to={DISCOVERY_TO} className="block text-center w-full py-3 rounded-lg border border-[#1e2d4a] text-white font-bold hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all text-sm">Select Starter</Link>
            </div>
            </FlyIn>

            {/* Pro — highlighted */}
            <FlyIn delay="delay-300">
            <div className="bg-[#0b1120] border border-[#00c3ff]/50 rounded-2xl p-6 flex flex-col shadow-[0_0_60px_rgba(0,195,255,0.12)] relative overflow-hidden h-full">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/60 to-transparent rounded-t-2xl"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.06)_0%,transparent_65%)] pointer-events-none"></div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-headline text-xl font-bold text-white">Pro</h3>
                <span className="text-xs font-bold text-[#030B17] bg-[#00c3ff] px-2 py-0.5 rounded-full uppercase tracking-widest">Recommended</span>
              </div>
              <p className="text-xs text-[#8b9bb4] mb-4">Run your pursuit process</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white">$199</span>
                <span className="text-[#8b9bb4] text-sm">/mo</span>
              </div>
              <ul className="space-y-2 text-sm text-[#a0b2c8] mb-6 flex-grow relative z-10">
                {['Everything in Starter', 'Unlimited pursuits', 'Decision tracking and history', 'Dashboard: pipeline, deadlines, priorities', 'Downloadable decision reports (PDF)'].map(f => (
                  <li key={f} className="flex gap-2 items-start"><Sparkles className="w-3.5 h-3.5 text-[#00c3ff] shrink-0 mt-0.5"/>{f}</li>
                ))}
              </ul>
              <Link to={DISCOVERY_TO} className="block text-center w-full py-3 rounded-lg bg-[#00c3ff] text-[#030B17] font-bold shadow-[0_0_30px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 text-sm">Select Pro</Link>
            </div>
            </FlyIn>

          </div>

          {/* Team — same coming-soon strip as /pricing, not a fourth equal-weight card */}
          <FlyIn delay="delay-[450ms]" className="max-w-6xl mx-auto mt-6">
          <div className="rounded-2xl border border-[#1e2d4a] bg-[#0b1120] px-6 py-5 flex flex-col md:flex-row md:items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#00c3ff]/10 border border-[#00c3ff]/30 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-[#00c3ff]" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-headline font-bold text-white text-base tracking-tight">Team — shared workspaces are coming.</p>
              <p className="text-sm text-[#8b9bb4] font-body">$299/mo. Multiple users, shared pursuits, team-level visibility. Not available yet.</p>
            </div>
            <Link to="/team-waitlist/" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white border border-[#1e2d4a] rounded-lg hover:border-[#00c3ff]/40 hover:text-[#00c3ff] transition-colors shrink-0">
              Join the waitlist <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          </FlyIn>

          {/* The seasonal offer stays secondary to the ongoing product benefit */}
          <FlyIn delay="delay-[600ms]" className="max-w-6xl mx-auto mt-8">
            <Notice label="Fall Offer" tone="soft" align="left">
              <span className="font-bold text-[#00c3ff]">Fall Bid Clarity Pass:</span> 2 months of Starter or Pro free, applied automatically at checkout.
              <br /><span className="font-bold text-[#00c3ff]">Ends November 30, 2026.</span> Renews at the regular price unless canceled.
            </Notice>
          </FlyIn>
          <p className="text-center text-sm text-[#8b9bb4]/60 mt-8 max-w-6xl mx-auto">
            <Link to="/pricing/" className="text-[#00c3ff] hover:underline">See full feature comparison →</Link>
          </p>
        </div>
      </section>

      {/* ── 6 — Frequently asked questions ────────────────────────────────── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c3ff]/10 border border-[#00c3ff]/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-[#00c3ff] tracking-widest uppercase font-label">Frequently Asked Questions</span>
            </div>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight">
              Before you <span className="he-gradient-text">sign up</span>.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {FAQ.map(({ q, a }, i) => (
              <FlyIn key={q} delay={['', 'delay-150', 'delay-300', 'delay-[450ms]', 'delay-[600ms]'][i]} className={i === FAQ.length - 1 ? 'md:col-span-2 md:w-[calc(50%-12px)] md:justify-self-center' : ''}>
              <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-300 h-full">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                <h3 className="text-white font-bold font-headline text-base mb-3">{q}</h3>
                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">{a}</p>
              </div>
              </FlyIn>
            ))}
          </div>
          <p className="text-center text-sm text-[#8b9bb4]/60 mt-8">
            <Link to="/faq/" className="text-[#00c3ff] hover:underline">More questions answered →</Link>
          </p>
        </div>
      </section>

      {/* ── 7 — Final invitation ──────────────────────────────────────────── */}
      <section className="py-20 px-6 relative">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-4 tracking-tight">
            Find your first opportunities today.
          </h2>
          <p className="text-[#a0b2c8] text-lg mb-10 leading-relaxed font-body max-w-xl mx-auto">
            Create a free account, add three details about your business, and see the SAM.gov opportunities that match — with the reasons behind each one.
          </p>
          <Link
            to={DISCOVERY_TO}
            onClick={() => track('home_discovery_cta_clicked', { placement: 'final' })}
            className={`inline-flex items-center gap-2 min-h-[56px] px-8 rounded-xl bg-[#00c3ff] text-[#030B17] font-bold text-base sm:text-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all ${focusRing}`}
          >
            Find My Opportunities — Free
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
          <p className="mt-4 text-sm font-body">
            <Link
              to={ANALYZER_TO}
              onClick={() => track('home_analyzer_link_clicked', { placement: 'final' })}
              className={`inline-flex items-center gap-1.5 min-h-[44px] text-[#00c3ff] font-semibold hover:underline underline-offset-4 rounded ${focusRing}`}
            >
              Already have an opportunity? Analyze a notice
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

    </>
  );
}
