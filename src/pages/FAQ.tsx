import { useState } from 'react';
import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronDown, Rocket, Cpu, ShieldCheck, CreditCard, Target, ArrowRight } from 'lucide-react';
import FlyIn from '../components/FlyIn';
import { FAQPageSchema } from '../components/SchemaOrg';

// ─── Types ────────────────────────────────────────────────────────────────────

type Part = string | { bullets: ReactNode[] };
interface FAQItem { q: string; parts: Part[]; }
interface FAQSection { title: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; items: FAQItem[]; }

// ─── Content ──────────────────────────────────────────────────────────────────

const sections: FAQSection[] = [
  {
    title: 'Getting Started',
    Icon: Rocket,
    items: [
      {
        q: 'What is HE Pursuit and how does it help government contractors?',
        parts: [
          'HE Pursuit is a bid/no-bid decision platform that helps small government contractors evaluate opportunities quickly and decide which ones are worth pursuing.',
          'It replaces scattered notes and gut-feel decisions with a structured way to assess fit, eligibility, effort, and overall pursuit value.',
        ],
      },
      {
        q: 'How do I get started?',
        parts: [
          'Create a free account, build your company profile, and start screening live SAM.gov opportunities against it immediately.',
          'You can see how the platform scores opportunities for you before upgrading to the full 5-phase pursuit workflow.',
        ],
      },
      {
        q: 'Do I need to upload solicitations to use it?',
        parts: [
          'No. You can start by evaluating the opportunity itself.',
          'If you want deeper analysis, you can upload documents later as part of the full qualification workflow.',
        ],
      },
      {
        q: 'What do "Go," "Conditional Go," and "No-Bid" mean?',
        parts: [
          { bullets: ['Go: Strong fit and worth pursuing', 'Conditional Go: Potential fit with risks or gaps', 'No-Bid: Low fit or high risk relative to effort'] },
          'These recommendations are designed to help you make faster, more consistent decisions.',
        ],
      },
    ],
  },
  {
    title: 'How HE Pursuit Works',
    Icon: Cpu,
    items: [
      {
        q: 'How does HE Pursuit help with bid/no-bid decisions?',
        parts: [
          'HE Pursuit evaluates each opportunity against your business profile and provides a structured assessment of fit, eligibility, effort, and risk.',
          'It then generates a clear recommendation—Go, Conditional Go, or No-Bid—to support your decision.',
        ],
      },
      {
        q: 'What is included in an opportunity evaluation?',
        parts: [
          'Each evaluation includes:',
          { bullets: ['Match score', 'Fit signals (NAICS, set-aside, agency, etc.)', 'Eligibility review', 'Strategic and effort considerations', 'A bid/no-bid recommendation'] },
        ],
      },
      {
        q: 'How long does it take to evaluate an opportunity?',
        parts: [
          'Most evaluations take just a few minutes.',
          'The goal is to help you quickly determine whether an opportunity is worth deeper investment.',
        ],
      },
      {
        q: 'Is this replacing capture strategy?',
        parts: [
          'No.',
          'HE Pursuit helps you decide which opportunities deserve real capture effort. It supports your judgment—it does not replace it.',
        ],
      },
    ],
  },
  {
    title: 'Data, Trust & Accuracy',
    Icon: ShieldCheck,
    items: [
      {
        q: 'Where does the opportunity data come from?',
        parts: ['HE Pursuit uses publicly available data from sources like SAM.gov.'],
      },
      {
        q: 'Is my data shared or sold?',
        parts: ['No. We do not sell, rent, or share your data.'],
      },
      {
        q: 'Is my data used to train AI models?',
        parts: ['No. Your data is not used to train artificial intelligence or machine learning models.'],
      },
      {
        q: 'How accurate are the results?',
        parts: [
          'HE Pursuit provides structured analysis based on available data and your inputs.',
          'It is designed to support better decisions, not to guarantee outcomes.',
        ],
      },
      {
        q: 'Can I trust the recommendation?',
        parts: [
          'The recommendation reflects multiple factors including fit, eligibility, and effort.',
          'It is meant to help you make more consistent, informed decisions—not replace your expertise.',
        ],
      },
    ],
  },
  {
    title: 'Pricing & Usage',
    Icon: CreditCard,
    items: [
      {
        q: 'What does the free plan include?',
        parts: ['The Free plan lets you screen live SAM.gov opportunities against your company profile and see how the platform works — including one full Phase 1 evaluation on a notice of your choice. The full 5-phase pursuit workflow starts with Starter.'],
      },
      {
        q: 'What happens when I hit my usage limit?',
        parts: ['You can upgrade to unlock the full pursuit workflow, deeper analysis, and higher usage limits.'],
      },
      {
        q: 'Do I need a credit card to start?',
        parts: ['No. You can start using the platform for free without a credit card.'],
      },
      {
        q: 'Can I cancel anytime?',
        parts: ['Yes. You can cancel your subscription at any time.'],
      },
      {
        q: 'Which plan is right for me?',
        parts: [
          { bullets: [
            'Free: Screen live SAM.gov opportunities against your profile',
            'Starter: Make structured bid/no-bid decisions',
            'Pro: Run your full pursuit process',
            <>
              Team: Scale across multiple users — launching soon,{' '}
              <Link to="/team-waitlist/" className="text-[#00c3ff] hover:text-white transition-colors">join the waitlist</Link>
            </>,
          ] },
        ],
      },
    ],
  },
];

const seoItems: FAQItem[] = [
  {
    q: 'How do government contractors decide whether to bid on an opportunity?',
    parts: [
      'Most contractors evaluate opportunities based on fit, eligibility, strategic value, and the effort required to pursue.',
      'A structured bid/no-bid process helps reduce wasted time and improves decision consistency.',
    ],
  },
  {
    q: 'What is a bid/no-bid decision process?',
    parts: [
      'A bid/no-bid process is a structured way to determine whether an opportunity is worth pursuing.',
      'It typically considers factors like:',
      { bullets: ['Alignment with company capabilities', 'Eligibility requirements', 'Competition', 'Effort vs. expected return'] },
    ],
  },
  {
    q: 'How do you evaluate government contracting opportunities?',
    parts: [
      "You evaluate fit by comparing the opportunity to your company's:",
      { bullets: ['NAICS codes', 'Certifications and set-aside status', 'Past performance', 'Geographic and agency alignment'] },
      'A strong fit increases the likelihood of a successful bid.',
    ],
  },
  {
    q: 'What factors matter most in a bid/no-bid decision?',
    parts: [
      'Key factors include:',
      { bullets: ['Eligibility requirements', 'Technical and past performance fit', 'Level of competition', 'Internal capacity', 'Expected return relative to effort'] },
    ],
  },
  {
    q: 'How long should it take to evaluate an opportunity?',
    parts: [
      'Initial evaluation should take minutes, not hours.',
      'A quick, structured review helps you filter out low-fit opportunities before investing significant time.',
    ],
  },
  {
    q: 'Can HE Pursuit help me find and evaluate SAM.gov opportunities?',
    parts: [
      'Yes. HE Pursuit works with data from SAM.gov, the official U.S. government contracting database.',
      'You can evaluate SAM.gov opportunities against your company profile to determine which ones align with your capabilities, certifications, and set-aside status.',
    ],
  },
  {
    q: 'How is HE Pursuit different from GovWin IQ or GovTribe?',
    parts: [
      'GovWin and GovTribe are primarily opportunity discovery and pipeline data tools — they help you find contracts.',
      'HE Pursuit focuses on what comes next: making a disciplined bid/no-bid decision. It structures the qualification process — fit, eligibility, effort, and risk — so you can decide faster and focus proposal resources on realistic wins.',
    ],
  },
  {
    q: 'What is capture management software for government contractors?',
    parts: [
      'Capture management software helps government contractors track, evaluate, and pursue contract opportunities.',
      'HE Pursuit focuses on the earliest stage of capture: qualifying whether an opportunity is worth pursuing at all. This ensures your team only invests capture resources in opportunities with a realistic path to award.',
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderParts(parts: Part[]) {
  return parts.map((part, i) => {
    if (typeof part === 'string') {
      return (
        <p key={i} className={`text-[#a0b2c8] text-sm font-body leading-relaxed${i > 0 ? ' mt-2.5' : ''}`}>
          {part}
        </p>
      );
    }
    return (
      <ul key={i} className={`space-y-1.5${i > 0 ? ' mt-2.5' : ''}`}>
        {part.bullets.map((b, j) => (
          <li key={j} className="flex items-start gap-2 text-sm text-[#a0b2c8] font-body">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff] shrink-0 mt-[0.35rem]"></div>
            {b}
          </li>
        ))}
      </ul>
    );
  });
}

// ─── Accordion item ───────────────────────────────────────────────────────────

function AccordionItem({ item, panelId, isOpen, onToggle }: { item: FAQItem; panelId: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`rounded-xl border transition-colors duration-200 ${isOpen ? 'border-[#00c3ff]/20' : 'border-transparent hover:border-[#1e2d4a]'}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left"
      >
        <span className={`text-sm font-bold font-headline leading-snug ${isOpen ? 'text-white' : 'text-[#a0b2c8]'}`}>
          {item.q}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-[#00c3ff] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>
      <div id={panelId} className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-4 pb-4 border-t border-[#1e2d4a] pt-3">
          {renderParts(item.parts)}
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FAQ() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const toggle = (key: string) => setOpenKey(prev => (prev === key ? null : key));

  return (
    <>
      <Helmet>
        <title>FAQ — HE Pursuit | Bid/No-Bid Decisions for Government Contractors</title>
        <meta name="description" content="Frequently asked questions about HE Pursuit — the bid/no-bid decision platform for small government contractors. Learn how we use SAM.gov data to help you evaluate opportunities faster." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/faq" />
        <meta property="og:title" content="FAQ — HE Pursuit Bid/No-Bid Platform" />
        <meta property="og:description" content="Everything you need to know about HE Pursuit and how it helps government contractors make better bid decisions using SAM.gov data." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQ — HE Pursuit Bid/No-Bid Platform" />
        <meta name="twitter:description" content="Everything you need to know about HE Pursuit and how it helps government contractors make better bid decisions using SAM.gov data." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
      </Helmet>
      <FAQPageSchema items={[
        { q: 'What is HE Pursuit and how does it help government contractors?', a: 'HE Pursuit is a bid/no-bid decision platform that helps small government contractors evaluate SAM.gov opportunities quickly and decide which ones are worth pursuing. It replaces scattered notes and gut-feel decisions with a structured way to assess fit, eligibility, effort, and overall pursuit value.' },
        { q: 'How does HE Pursuit help with bid/no-bid decisions?', a: 'HE Pursuit evaluates each opportunity against your business profile and provides a structured assessment of fit, eligibility, effort, and risk. It then generates a clear recommendation — Go, Conditional Go, or No-Bid — to support your decision.' },
        { q: 'Where does the opportunity data come from?', a: 'HE Pursuit uses publicly available data from sources like SAM.gov.' },
        { q: 'Is my data shared or sold?', a: 'No. We do not sell, rent, or share your data.' },
        { q: 'Is my data used to train AI models?', a: 'No. Your data is not used to train artificial intelligence or machine learning models.' },
        { q: 'What does the free plan include?', a: 'The Free plan lets you screen live SAM.gov opportunities against your company profile and see how the platform works — including one full Phase 1 evaluation on a notice of your choice. The full 5-phase pursuit workflow starts with Starter.' },
        { q: 'Do I need a credit card to start?', a: 'No. You can start using the platform for free without a credit card.' },
        { q: 'Can I cancel anytime?', a: 'Yes. You can cancel your subscription at any time.' },
        { q: 'How long should it take to evaluate an opportunity?', a: 'Initial evaluation should take minutes, not hours. A quick, structured review helps you filter out low-fit opportunities before investing significant time.' },
        { q: 'Can HE Pursuit help me find and evaluate SAM.gov opportunities?', a: 'Yes. HE Pursuit works with data from SAM.gov, the official U.S. government contracting database. You can evaluate SAM.gov opportunities against your company profile to determine which ones align with your capabilities, certifications, and set-aside status.' },
        { q: 'How is HE Pursuit different from GovWin IQ or GovTribe?', a: 'GovWin and GovTribe are primarily opportunity discovery and pipeline data tools — they help you find contracts. HE Pursuit focuses on what comes next: making a disciplined bid/no-bid decision. It structures the qualification process — fit, eligibility, effort, and risk — so you can decide faster and focus proposal resources on realistic wins.' },
        { q: 'What is capture management software for government contractors?', a: 'Capture management software helps government contractors track, evaluate, and pursue contract opportunities. HE Pursuit focuses on the earliest stage of capture: qualifying whether an opportunity is worth pursuing at all, so your team only invests capture resources in opportunities with a realistic path to award.' },
      ]} />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="font-headline font-black text-5xl md:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            Frequently asked questions.
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-2xl">
            Everything you need to know about HE Pursuit and how it helps government contractors make better bid decisions.
          </p>
        </div>
      </section>

      {/* ── 4 Sections — 2-column grid ──────────────────────────────────────── */}
      <section className="pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sections.map((section, si) => (
              <FlyIn key={section.title} delay={['', 'delay-150', 'delay-300', 'delay-[450ms]'][si]}>
              <div
                className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-7 shadow-2xl relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 h-full"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>

                {/* Section header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                    <section.Icon
                      className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10"
                      fill="currentColor"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </div>
                  <h2 className="font-headline font-bold text-white text-lg tracking-tight">{section.title}</h2>
                </div>

                {/* Accordion */}
                <div className="space-y-0.5">
                  {section.items.map((item, ii) => {
                    const key = `${si}-${ii}`;
                    return (
                      <AccordionItem
                        key={key}
                        item={item}
                        panelId={`cat-faq-panel-${key}`}
                        isOpen={openKey === key}
                        onToggle={() => toggle(key)}
                      />
                    );
                  })}
                </div>
              </div>
              </FlyIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO Section — GovCon Questions ──────────────────────────────────── */}
      <section className="py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.04)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-3 group/seo">
            <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
              <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover/seo:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
              <Target
                className="w-5 h-5 text-[#00c3ff] group-hover/seo:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover/seo:scale-110 group-hover/seo:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10"
                fill="currentColor"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </div>
            <h2 className="font-headline font-bold text-white text-lg tracking-tight">Bid/No-Bid & Government Contracting</h2>
          </div>
          <p className="text-[#8b9bb4] text-sm font-body mb-8 ml-12">Common questions about the bid/no-bid process in GovCon.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {seoItems.map((item, ii) => {
              const key = `seo-${ii}`;
              return (
                <FlyIn key={key} delay={['', 'delay-150', 'delay-300', 'delay-[450ms]', ''][ii]}>
                <div
                  className={`bg-[#0b1120] rounded-xl border transition-colors duration-200 h-full ${openKey === key ? 'border-[#00c3ff]/20' : 'border-[#1e2d4a] hover:border-[#00c3ff]/20'}`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    aria-expanded={openKey === key}
                    aria-controls={`seo-faq-panel-${key}`}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className={`text-sm font-bold font-headline leading-snug ${openKey === key ? 'text-white' : 'text-[#a0b2c8]'}`}>
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-[#00c3ff] transition-transform duration-300 ${openKey === key ? 'rotate-180' : ''}`}
                      strokeWidth={2}
                    />
                  </button>
                  <div id={`seo-faq-panel-${key}`} className={`overflow-hidden transition-all duration-300 ease-out ${openKey === key ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-5 pb-5 border-t border-[#1e2d4a] pt-3">
                      {renderParts(item.parts)}
                    </div>
                  </div>
                </div>
                </FlyIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────────── */}
      <section className="pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-headline font-black text-2xl md:text-3xl text-white tracking-tight mb-6">
            Ready to make your next bid decision with confidence?
          </h2>
          <Link
            to="/signup/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Start Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-5">
            <Link
              to="/tools/sam-gov-notice-analyzer/"
              className="text-[#a0b2c8] hover:text-[#00c3ff] transition-colors text-sm font-body"
            >
              Or score a notice with the free analyzer →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Footer note ──────────────────────────────────────────────────────── */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#8b9bb4] font-body text-sm">
            Still have questions?{' '}
            <a
              href="mailto:support@honestecho.com"
              className="text-[#00c3ff] hover:text-white transition-colors"
            >
              Contact us at support@honestecho.com
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
