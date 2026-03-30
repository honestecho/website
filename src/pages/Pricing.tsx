import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, X, Minus, ChevronDown } from 'lucide-react';

// ─── Comparison table data ────────────────────────────────────────────────────

type CellValue = 'included' | 'limited' | 'unlimited' | 'none' | 'optional';

interface Feature {
  category: string;
  name: string;
  free: CellValue;
  pro: CellValue;
  team: CellValue;
}

const features: Feature[] = [
  // Core Access
  { category: 'Core Access',           name: 'Search opportunities',            free: 'included',  pro: 'included',   team: 'included'  },
  { category: 'Core Access',           name: 'Save pursuits',                   free: 'included',  pro: 'included',   team: 'included'  },
  { category: 'Core Access',           name: 'Opportunity summaries',           free: 'included',  pro: 'included',   team: 'included'  },
  { category: 'Core Access',           name: 'Number of pursuits',              free: 'limited',   pro: 'unlimited',  team: 'unlimited' },
  { category: 'Core Access',           name: 'Phase 1 access',                  free: 'included',  pro: 'included',   team: 'included'  },
  // Eligibility & Analysis
  { category: 'Eligibility & Analysis', name: 'Eligibility review',             free: 'limited',   pro: 'included',   team: 'included'  },
  { category: 'Eligibility & Analysis', name: 'Document parsing',               free: 'limited',   pro: 'included',   team: 'included'  },
  { category: 'Eligibility & Analysis', name: 'Disqualifier detection',         free: 'none',      pro: 'included',   team: 'included'  },
  { category: 'Eligibility & Analysis', name: 'Capability / fit analysis',      free: 'limited',   pro: 'included',   team: 'included'  },
  { category: 'Eligibility & Analysis', name: 'Strategic scoring',              free: 'none',      pro: 'included',   team: 'included'  },
  { category: 'Eligibility & Analysis', name: 'Effort / win scoring',           free: 'none',      pro: 'included',   team: 'included'  },
  // Decisions & Tracking
  { category: 'Decisions & Tracking',  name: 'Go / Conditional Go / No-Bid',   free: 'none',      pro: 'included',   team: 'included'  },
  { category: 'Decisions & Tracking',  name: 'Decision tracking',              free: 'none',      pro: 'included',   team: 'included'  },
  { category: 'Decisions & Tracking',  name: 'Decision history',               free: 'none',      pro: 'included',   team: 'included'  },
  // Team / Admin
  { category: 'Team / Admin',          name: 'Multiple users',                  free: 'none',      pro: 'none',       team: 'included'  },
  { category: 'Team / Admin',          name: 'Shared pursuits',                 free: 'none',      pro: 'none',       team: 'included'  },
  { category: 'Team / Admin',          name: 'Priority parsing',                free: 'none',      pro: 'none',       team: 'included'  },
  { category: 'Team / Admin',          name: 'Larger limits',                   free: 'none',      pro: 'none',       team: 'included'  },
  { category: 'Team / Admin',          name: 'Export capabilities',             free: 'none',      pro: 'none',       team: 'included'  },
  // Support / Sales
  { category: 'Support / Sales',       name: 'Self-serve signup',               free: 'included',  pro: 'included',   team: 'included'  },
  { category: 'Support / Sales',       name: 'Sales-assisted onboarding',       free: 'none',      pro: 'optional',   team: 'included'  },
];

const categories = [...new Set(features.map(f => f.category))];

function Cell({ value }: { value: CellValue }) {
  if (value === 'included')  return <Check className="w-5 h-5 text-[#00c3ff] mx-auto" strokeWidth={2.5} />;
  if (value === 'unlimited') return <span className="text-[#00c3ff] text-sm font-bold">Unlimited</span>;
  if (value === 'limited')   return <Minus className="w-4 h-4 text-[#8b9bb4] mx-auto" strokeWidth={2} />;
  if (value === 'optional')  return <span className="text-[#8b9bb4] text-xs font-body">Optional</span>;
  return <X className="w-4 h-4 text-[#2a3a4e] mx-auto" strokeWidth={2} />;
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: 'What does the Free plan include?',
    a: 'The Free plan gives you access to opportunity search, saved pursuits, and Phase 1 summaries so you can test the workflow before upgrading.',
  },
  {
    q: 'What unlocks in Pro?',
    a: 'Pro unlocks deeper eligibility analysis, document parsing, disqualifier detection, strategic scoring, effort scoring, and decision tracking.',
  },
  {
    q: 'When should I upgrade to Team?',
    a: 'Team is built for multi-user workflows. Upgrade when you need shared pursuits, collaboration across users, larger limits, or export capabilities.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. You can start free and evaluate HE Pursuit before committing to a paid plan.',
  },
  {
    q: 'Do I need a credit card to get started?',
    a: '[Placeholder — connect to actual billing policy.]',
  },
  {
    q: 'Can I cancel anytime?',
    a: '[Placeholder — connect to actual billing policy.]',
  },
  {
    q: 'What counts as a pursuit?',
    a: 'A pursuit is an opportunity saved and worked through inside HE Pursuit. [Adjust if your internal definition is more specific.]',
  },
  {
    q: 'Can I upload solicitation documents?',
    a: 'Yes. Paid plans support deeper document-based analysis, including eligibility and disqualifier review.',
  },
  {
    q: 'Is HE Pursuit built for small GovCon teams?',
    a: 'Yes. HE Pursuit is designed for small contractors, proposal teams, and capture teams that need faster, more structured bid/no-bid decisions.',
  },
  {
    q: 'Do you offer support for teams?',
    a: 'Yes. Team buyers can contact us for sales-assisted onboarding and plan guidance.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Pricing | HE Pursuit by Honest Echo</title>
        <meta name="description" content="Simple pricing for small GovCon teams. Start free, unlock full eligibility and decision workflows with Pro, and scale collaboration with Team." />
      </Helmet>

      {/* ── SECTION 1 — Hero ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:48px_48px] z-0 pointer-events-none"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Pricing</span>
          </div>
          <h1 className="font-headline font-black text-4xl md:text-5xl text-white mb-6 tracking-tight leading-tight">
            Start free.<br />Scale when you're ready.
          </h1>
          <p className="text-[#a0b2c8] text-lg md:text-xl leading-relaxed font-body">
            Start free, test HE Pursuit on real opportunities, and upgrade when you need deeper analysis, decision support, and team workflows.
          </p>
        </div>
      </section>

      {/* ── SECTION 2 — Pricing Cards ────────────────────────────────────── */}
      <section className="pb-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

            {/* Free */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <h3 className="font-headline text-2xl font-bold text-white mb-1">Free</h3>
              <p className="text-sm text-[#8b9bb4] mb-6 font-body">For testing the workflow</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-white font-headline">$0</span>
              </div>
              <ul className="space-y-3 text-sm text-[#a0b2c8] mb-10 flex-grow font-body">
                {['Search opportunities', 'Save pursuits', 'Phase 1 summary', 'Limited eligibility review', 'Limited document parsing'].map(f => (
                  <li key={f} className="flex gap-3 items-start">
                    <Check className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full py-3 text-center border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline">
                Get Started
              </Link>
            </div>

            {/* Pro — highlighted */}
            <div className="bg-[#0b1120] border border-[#00c3ff]/50 rounded-2xl p-8 flex flex-col shadow-[0_0_60px_rgba(0,195,255,0.12)] relative overflow-hidden scale-[1.02]">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/60 to-transparent rounded-t-2xl"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.06)_0%,transparent_65%)] pointer-events-none"></div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-headline text-2xl font-bold text-white">Pro</h3>
                <span className="text-[10px] font-bold text-[#030B17] bg-[#00c3ff] px-2 py-0.5 rounded-full uppercase tracking-widest font-label">Most Popular</span>
              </div>
              <p className="text-sm text-[#8b9bb4] mb-6 font-body">For small contractors and proposal teams</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-white font-headline">$39</span>
                <span className="text-[#8b9bb4] text-sm font-body">/mo</span>
              </div>
              <ul className="space-y-3 text-sm text-[#a0b2c8] mb-10 flex-grow font-body relative z-10">
                {['Unlimited pursuits and Phase 1', 'Full Phase 2 eligibility and docs', 'Disqualifier detection', 'Strategic and effort scoring', 'Decision tracking and history'].map(f => (
                  <li key={f} className="flex gap-3 items-start">
                    <Check className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full py-3 text-center bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_30px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline relative z-10">
                Start Free Trial
              </Link>
            </div>

            {/* Team */}
            <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 flex flex-col shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/30 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              <h3 className="font-headline text-2xl font-bold text-white mb-1">Team</h3>
              <p className="text-sm text-[#8b9bb4] mb-6 font-body">For multi-user capture teams</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-white font-headline">$99</span>
                <span className="text-[#8b9bb4] text-sm font-body">/mo</span>
              </div>
              <ul className="space-y-3 text-sm text-[#a0b2c8] mb-10 flex-grow font-body">
                {['Everything in Pro', 'Multiple users', 'Shared pursuits', 'Priority parsing and larger limits', 'Export capabilities'].map(f => (
                  <li key={f} className="flex gap-3 items-start">
                    <Check className="w-4 h-4 text-[#00c3ff] shrink-0 mt-0.5" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="block w-full py-3 text-center border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline">
                Talk to the Team
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 3 — Plan Fit ─────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:48px_48px] z-0 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Plan Fit</span>
            </div>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight mb-4 max-w-2xl mx-auto">
              Choose the plan that matches how your team pursues work.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                plan: 'Free',
                copy: 'Best for solo users who want to test the workflow, evaluate early opportunities, and see how HE Pursuit fits their process.',
              },
              {
                plan: 'Pro',
                copy: 'Best for small contractors and proposal teams that need full eligibility analysis, document parsing, scoring, and decision tracking.',
              },
              {
                plan: 'Team',
                copy: 'Best for collaborative capture teams that need shared visibility, larger limits, and multi-user workflows.',
              },
            ].map(({ plan, copy }) => (
              <div key={plan} className="bg-[#0b1120]/60 border border-[#1e2d4a] rounded-2xl p-8 group hover:border-[#00c3ff]/30 transition-all duration-300">
                <h3 className="font-headline font-black text-xl text-white mb-3">{plan}</h3>
                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — Comparison Table ─────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Compare Plans</span>
            </div>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight mb-4">
              See exactly what changes at each tier.
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#1e2d4a]">
            <table className="w-full min-w-[600px] text-sm">
              {/* Header */}
              <thead>
                <tr className="border-b border-[#1e2d4a] bg-[#0b1120]">
                  <th className="text-left px-6 py-4 text-[#8b9bb4] font-label uppercase tracking-widest text-xs w-1/2">Feature</th>
                  <th className="px-6 py-4 text-center text-white font-headline font-bold">Free</th>
                  <th className="px-6 py-4 text-center font-headline font-bold">
                    <span className="text-[#00c3ff]">Pro</span>
                  </th>
                  <th className="px-6 py-4 text-center text-white font-headline font-bold">Team</th>
                </tr>
              </thead>
              <tbody className="bg-[#080f1c]">
                {categories.map(cat => (
                  <>
                    {/* Category header row */}
                    <tr key={cat} className="border-t border-[#1e2d4a] bg-[#0b1120]/80">
                      <td colSpan={4} className="px-6 py-3 text-xs font-bold text-[#00c3ff] uppercase tracking-widest font-label">{cat}</td>
                    </tr>
                    {/* Feature rows */}
                    {features.filter(f => f.category === cat).map((f, i) => (
                      <tr key={f.name} className={`border-t border-[#1e2d4a]/60 hover:bg-[#0d1625] transition-colors ${i % 2 === 0 ? '' : ''}`}>
                        <td className="px-6 py-4 text-[#a0b2c8] font-body">{f.name}</td>
                        <td className="px-6 py-4 text-center"><Cell value={f.free} /></td>
                        <td className="px-6 py-4 text-center bg-[#00c3ff]/[0.03]"><Cell value={f.pro} /></td>
                        <td className="px-6 py-4 text-center"><Cell value={f.team} /></td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-5 px-1">
            <div className="flex items-center gap-2 text-xs text-[#8b9bb4] font-body">
              <Check className="w-4 h-4 text-[#00c3ff]" strokeWidth={2.5} /> Included
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8b9bb4] font-body">
              <Minus className="w-4 h-4 text-[#8b9bb4]" strokeWidth={2} /> Limited
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8b9bb4] font-body">
              <X className="w-4 h-4 text-[#2a3a4e]" strokeWidth={2} /> Not included
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — FAQ ──────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:48px_48px] z-0 pointer-events-none"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
              <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">FAQ</span>
            </div>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-white tracking-tight mb-4">
              Questions before you choose a plan?
            </h2>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#0d1828] transition-colors duration-200 group"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-white font-bold font-headline pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#00c3ff] shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                    strokeWidth={2}
                  />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-out ${openFaq === i ? 'max-h-48' : 'max-h-0'}`}>
                  <p className="px-6 pb-5 text-[#a0b2c8] text-sm font-body leading-relaxed border-t border-[#1e2d4a] pt-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — Final CTA ────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">Ready to Start</span>
          </div>
          <h2 className="font-headline font-black text-3xl md:text-4xl text-white mb-5 tracking-tight">
            Choose your plan and start evaluating opportunities faster.
          </h2>
          <p className="text-[#a0b2c8] text-lg mb-10 leading-relaxed font-body max-w-xl mx-auto">
            Start free, upgrade when you need deeper decision support, or talk to us about Team access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline">
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300 font-headline">
              Talk to the Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
