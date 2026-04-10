import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'What is Pursuit?',
    a: 'Pursuit is a bid/no-bid decision platform for government contractors. It scores SAM.gov opportunities against your company profile so you can quickly identify which contracts are worth pursuing and which to skip.',
  },
  {
    q: 'How does opportunity scoring work?',
    a: 'Pursuit analyzes each SAM.gov opportunity against your company profile including NAICS codes, set-aside eligibility, geographic preferences, and past performance factors. Each opportunity receives a confidence score so you can focus your time on the best-fit contracts.',
  },
  {
    q: 'What data do you access?',
    a: 'We pull publicly available opportunity data from SAM.gov. Your company profile, pursuit notes, and strategic assessments are private to your account. We do not access your SAM.gov credentials or any non-public government data.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. Your data is stored on US-based servers with encryption in transit (TLS 1.2+) and at rest (AES-256). We use row-level security so users can only access their own data. We do not use your data to train AI models. See our Security page for full details.',
  },
  {
    q: 'How do I upgrade my plan?',
    a: 'You can upgrade anytime from Settings > Plan & Billing, or when you encounter a feature limit. Upgrades take effect immediately. You will be charged the prorated difference for the remainder of your billing cycle.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from Settings > Plan & Billing or email support@honestecho.com. Your paid features remain active until the end of your current billing period. No partial-month refunds.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards through Stripe. All billing is in US dollars on a monthly cycle.',
  },
  {
    q: 'What support is included?',
    a: 'Free: Help center and FAQ. Starter ($99/mo): Email support with 48-hour response. Pro ($199/mo): Email support with 24-hour response. Team ($299/mo): Priority email with 12-hour response plus an onboarding call.',
  },
  {
    q: 'What is a pursuit?',
    a: 'A pursuit is your workspace for evaluating a specific SAM.gov opportunity. It takes you through a structured bid/no-bid analysis: from initial triage, through eligibility and strategic scoring, to a final go/no-go decision. Free accounts get 10 active pursuits through Phase 1. Starter accounts get 25 through all 5 phases. Pro and Team get unlimited.',
  },
  {
    q: 'What does the FPDS bookmark analysis do?',
    a: 'When you bookmark an opportunity, Pursuit automatically pulls data from FPDS (Federal Procurement Data System) to show you who currently holds the contract, the contract value, and the period of performance. This gives you competitive intelligence before you commit time to a full pursuit. Free accounts get 3 analyses per month; paid accounts get unlimited.',
  },
];

function AccordionItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className={`rounded-xl border transition-colors ${open ? 'border-[#1e3a5f] bg-[#0b1628]' : 'border-[#1e2d4a]/60 bg-[#0b1120]/40 hover:border-[#1e2d4a]'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className={`text-sm font-semibold ${open ? 'text-white' : 'text-slate-300'}`}>{q}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-[#00c3ff] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-[#94a3b8] leading-relaxed border-t border-[#1e2d4a]/50 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <>
      <Helmet>
        <title>FAQ | Honest Echo</title>
        <meta name="description" content="Frequently asked questions about Pursuit — the bid/no-bid decision platform for government contractors." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/faq" />
        <meta property="og:title" content="FAQ — Honest Echo" />
        <meta property="og:description" content="Frequently asked questions about Pursuit by Honest Echo." />
      </Helmet>

      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-[#00c3ff] mb-3">Support</p>
          <h1 className="text-4xl font-black text-white tracking-tight mb-4">Frequently Asked Questions</h1>
          <p className="text-[#94a3b8] text-base">
            Can't find what you're looking for?{' '}
            <a href="mailto:support@honestecho.com" className="text-[#00c3ff] hover:underline">
              Email support@honestecho.com
            </a>
          </p>
        </div>

        <div className="space-y-2">
          {FAQS.map((item, i) => (
            <AccordionItem
              key={i}
              q={item.q}
              a={item.a}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
