import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, Rocket, Cpu, ShieldCheck, CreditCard, Target } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Part = string | { bullets: string[] };
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
          'Create a free account, build your company profile, and start evaluating opportunities immediately.',
          'You can begin with live opportunities and see how the platform works before upgrading.',
        ],
      },
      {
        q: 'Do I need to upload solicitations to use it?',
        parts: [
          'No. You can start by evaluating the opportunity itself.',
          'If you want deeper analysis, you can upload documents later as part of the full qualification workflow.',
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
        q: 'What do "Go," "Conditional Go," and "No-Bid" mean?',
        parts: [
          { bullets: ['Go: Strong fit and worth pursuing', 'Conditional Go: Potential fit with risks or gaps', 'No-Bid: Low fit or high risk relative to effort'] },
          'These recommendations are designed to help you make faster, more consistent decisions.',
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
        parts: ['The free plan allows you to evaluate a limited number of opportunities and see how the platform works before upgrading.'],
      },
      {
        q: 'What happens when I hit my usage limit?',
        parts: ['You can upgrade to continue evaluating opportunities with deeper analysis and higher usage limits.'],
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
          { bullets: ['Free: Try the product and evaluate initial opportunities', 'Starter: Make structured bid/no-bid decisions', 'Pro: Run your full pursuit process', 'Team: Scale across multiple users'] },
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
    q: 'How do you evaluate if a government contract is a good fit?',
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

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`rounded-xl border transition-colors duration-200 ${isOpen ? 'border-[#00c3ff]/20' : 'border-transparent hover:border-[#1e2d4a]'}`}>
      <button
        type="button"
        onClick={onToggle}
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
      <div className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-4 pb-4 pt-0.5 border-t border-[#1e2d4a] pt-3">
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
        <title>FAQ | Honest Echo</title>
        <meta name="description" content="Frequently asked questions about HE Pursuit — the bid/no-bid decision platform for government contractors." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/faq" />
        <meta property="og:title" content="FAQ — Honest Echo" />
        <meta property="og:description" content="Everything you need to know about HE Pursuit and how it helps government contractors make better bid decisions." />
        <meta property="og:image" content="https://honestecho.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-12 px-6 relative overflow-hidden">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {sections.map((section, si) => (
              <div
                key={section.title}
                className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-7 relative overflow-hidden group hover:border-[#00c3ff]/20 transition-all duration-500"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>

                {/* Section header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 flex items-center justify-center relative overflow-visible shrink-0">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 rounded-full scale-150"></div>
                    <section.Icon
                      className="w-4 h-4 text-[#00c3ff] relative z-10"
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
                        isOpen={openKey === key}
                        onToggle={() => toggle(key)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO Section — GovCon Questions ──────────────────────────────────── */}
      <section className="py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.04)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 flex items-center justify-center relative overflow-visible shrink-0">
              <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 rounded-full scale-150"></div>
              <Target className="w-4 h-4 text-[#00c3ff] relative z-10" strokeWidth={2} />
            </div>
            <h2 className="font-headline font-bold text-white text-lg tracking-tight">Bid/No-Bid & Government Contracting</h2>
          </div>
          <p className="text-[#8b9bb4] text-sm font-body mb-8 ml-12">Common questions about the bid/no-bid process in GovCon.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {seoItems.map((item, ii) => {
              const key = `seo-${ii}`;
              return (
                <div
                  key={key}
                  className={`bg-[#0b1120] rounded-xl border transition-colors duration-200 ${openKey === key ? 'border-[#00c3ff]/20' : 'border-[#1e2d4a] hover:border-[#00c3ff]/20'}`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(key)}
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
                  <div className={`overflow-hidden transition-all duration-300 ease-out ${openKey === key ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-5 pb-5 border-t border-[#1e2d4a] pt-3">
                      {renderParts(item.parts)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
