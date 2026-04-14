import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Database, Cpu, Share2, Lock, Clock, SlidersHorizontal, Bot, RefreshCw, Mail } from 'lucide-react';

// ─── Content ──────────────────────────────────────────────────────────────────

interface PrivacySection {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  lead: string;
  body?: string;
  bullets?: string[];
  sub?: { label: string; bullets: string[] }[];
  note?: string;
  email?: string;
}

const sections: PrivacySection[] = [
  {
    Icon: Database,
    title: 'Information We Collect',
    lead: 'We collect information you provide and information collected automatically.',
    sub: [
      {
        label: 'Information you provide',
        bullets: ['Account information (name, email)', 'Company profile details (NAICS, certifications, preferences)', 'Pursuit data (notes, evaluations, decisions)'],
      },
      {
        label: 'Information collected automatically',
        bullets: ['Usage data (features used, activity)', 'Device and browser information', 'Log data (IP address, timestamps)'],
      },
    ],
    note: 'We use publicly available information (such as SAM.gov) to support opportunity analysis.',
  },
  {
    Icon: Cpu,
    title: 'How We Use Information',
    lead: 'We use your information to:',
    bullets: [
      'Provide and operate the platform',
      'Improve product functionality and performance',
      'Process subscriptions and billing',
      'Communicate with you about your account and product updates',
      'Maintain security and prevent misuse',
    ],
  },
  {
    Icon: Share2,
    title: 'Data Sharing',
    lead: 'We do not sell, rent, or trade your data.',
    body: 'We share data only with service providers who help operate the platform (such as hosting and payment processing), and only as necessary.',
    note: 'We may disclose information if required by law.',
  },
  {
    Icon: Lock,
    title: 'Data Security',
    lead: 'We use commercially reasonable safeguards to protect your data, including encryption, access controls, and monitoring.',
    note: 'No system is completely secure, but we take data protection seriously.',
  },
  {
    Icon: Clock,
    title: 'Data Retention',
    lead: 'We retain your data while your account is active.',
    body: 'If you delete your account, we will remove your personal data within a reasonable period, except where retention is required for legal or operational purposes.',
  },
  {
    Icon: SlidersHorizontal,
    title: 'Your Choices',
    lead: 'You may:',
    bullets: ['Update or correct your information', 'Request deletion of your data', 'Opt out of non-essential communications'],
    note: 'To make a request, contact: support@honestecho.com',
  },
  {
    Icon: Bot,
    title: 'AI & Data Use',
    lead: 'We do not use your data to train artificial intelligence or machine learning models.',
  },
  {
    Icon: RefreshCw,
    title: 'Changes to This Policy',
    lead: 'We may update this Privacy Policy from time to time.',
    body: 'The effective date at the top reflects the latest version.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Honest Echo</title>
        <meta name="description" content="Privacy Policy for HE Pursuit by Honest Echo LLC. Learn how we collect, use, and protect your data." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/privacy" />
        <meta property="og:title" content="Privacy Policy — Honest Echo" />
        <meta property="og:description" content="What data we collect, how we use it, and your options." />
      </Helmet>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="font-headline font-black text-5xl md:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            Privacy Policy
          </h1>
          <p className="text-[#8b9bb4] text-base font-body">
            Effective Date: April 10, 2026 &nbsp;·&nbsp; Honest Echo LLC operates HE Pursuit. This policy explains what data we collect, how we use it, and your options.
          </p>
        </div>
      </section>

      {/* ── Sections — 2-column grid ────────────────────────────────────────── */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sections.map((s) => (
              <div
                key={s.title}
                className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                    <s.Icon
                      className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10"
                      fill="currentColor"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </div>
                  <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">{s.title}</h2>
                </div>

                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-3">{s.lead}</p>

                {s.body && (
                  <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-3">{s.body}</p>
                )}

                {s.bullets && (
                  <ul className="space-y-2 mb-3">
                    {s.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[#a0b2c8] font-body">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff] shrink-0 mt-[0.35rem]"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {s.sub && (
                  <div className="space-y-4 mb-3">
                    {s.sub.map((sub) => (
                      <div key={sub.label}>
                        <p className="text-[#8b9bb4] text-xs font-label uppercase tracking-widest mb-2">{sub.label}</p>
                        <ul className="space-y-1.5">
                          {sub.bullets.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm text-[#a0b2c8] font-body">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff] shrink-0 mt-[0.35rem]"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {s.note && (
                  <p className="text-[#8b9bb4] text-xs font-body leading-relaxed border-t border-[#1e2d4a] pt-4 mt-1">{s.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────────────────── */}
      <section className="py-8 pb-24 px-6">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="w-full lg:w-[calc(50%-12px)] bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                <Mail
                  className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10"
                  fill="currentColor"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </div>
              <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">Contact</h2>
            </div>
            <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-3">For questions about privacy:</p>
            <a href="mailto:support@honestecho.com" className="text-[#00c3ff] font-bold font-headline text-sm hover:text-white transition-colors">
              support@honestecho.com
            </a>
            <p className="text-[#8b9bb4] text-xs font-body mt-4 border-t border-[#1e2d4a] pt-4">
              Also see our{' '}
              <Link to="/terms" className="text-[#00c3ff] hover:text-white transition-colors">Terms of Service</Link>.
            </p>
          </div>
        </div>
      </section>

    </>
  );
}
