import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ShieldCheck, Eye, Lock, Server, FileCheck, Mail, Trash2 } from 'lucide-react';
import FlyIn from '../components/FlyIn';

// ─── Content ──────────────────────────────────────────────────────────────────

const atAGlance = [
  { label: 'Public SAM.gov data only' },
  { label: 'Encrypted in transit & at rest' },
  { label: 'No AI training on your data' },
  { label: 'security@honestecho.com', href: 'mailto:security@honestecho.com' },
];

const mainSections = [
  {
    Icon: ShieldCheck,
    title: 'How We Protect Data',
    lead: 'We use commercially reasonable safeguards to protect your information.',
    bullets: [
      'Data is encrypted in transit and at rest',
      'Access to systems is restricted and monitored',
      'Infrastructure is hosted on trusted cloud providers (Cloudflare, Supabase, and Render)',
    ],
    note: 'No system is completely secure, but we take data protection seriously and continue to improve our practices over time.',
  },
  {
    Icon: FileCheck,
    title: 'Data Sensitivity & CUI',
    lead: 'HE Pursuit analyzes public SAM.gov opportunity data. It is designed for general business use and is not intended for classified, CUI (Controlled Unclassified Information), or export-controlled material unless otherwise agreed in writing.',
    note: (
      <>
        If your organization has specific security or deployment requirements,{' '}
        <Link to="/contact/" className="text-[#00c3ff] hover:text-white transition-colors">contact us</Link>{' '}
        to discuss options.
      </>
    ),
  },
  {
    Icon: Eye,
    title: 'How Your Data Is Used',
    lead: 'Your data belongs to you.',
    bullets: [
      'We do not sell or rent your data. We share it only with the service providers required to run the platform — never with other customers or advertisers.',
      'We do not use your data to train artificial intelligence or machine learning models',
      'Your data is used only to provide and improve the functionality of the platform',
    ],
  },
  {
    Icon: Lock,
    title: 'Access Controls',
    lead: 'HE Pursuit is designed so that users can only access their own data.',
    bullets: [
      'Access is controlled at both the application and data levels',
      'Users cannot view or interact with data from other accounts',
      'Systems are monitored for unusual activity',
    ],
  },
  {
    Icon: Server,
    title: 'Infrastructure',
    lead: 'We use modern cloud infrastructure and service providers to operate the platform.',
    note: 'These providers maintain their own security and compliance programs, which support the overall security of the service.',
  },
  {
    Icon: Trash2,
    title: 'Data Handling',
    lead: 'You stay in control of your data.',
    bullets: [
      'You can request deletion of your account and eligible associated data',
      'You can request deletion of uploaded documents',
      'We aim to retain data only as long as needed to provide the service or meet legal obligations',
    ],
    note: (
      <>
        To request account or document deletion, contact{' '}
        <a href="mailto:support@honestecho.com" className="text-[#00c3ff] hover:text-white transition-colors">support@honestecho.com</a>.
      </>
    ),
  },
];

const bottomSections = [
  {
    Icon: Mail,
    title: 'Responsible Disclosure',
    body: 'If you discover a potential security issue, please contact:',
    email: 'security@honestecho.com',
    note: 'We aim to acknowledge reports promptly and address issues in a timely manner. We support responsible disclosure and do not pursue legal action against good-faith researchers.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Security() {
  return (
    <>
      <Helmet>
        <title>Security | Honest Echo</title>
        <meta name="description" content="How HE Pursuit protects your data — encryption, access controls, data handling practices, and responsible disclosure." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/security" />
        <meta property="og:title" content="Security — Honest Echo" />
        <meta property="og:description" content="A practical, straightforward approach to protecting customer data. Encryption, access controls, and clear data handling practices." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Security — Honest Echo" />
        <meta name="twitter:description" content="A practical, straightforward approach to protecting customer data." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
      </Helmet>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-8 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="font-headline font-black text-5xl md:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            Security
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-3xl">
            HE Pursuit is designed with a practical, straightforward approach to protecting customer data. We rely on established infrastructure, controlled access, and clear data handling practices to keep information secure.
          </p>
        </div>
      </section>

      {/* ── At a glance ────────────────────────────────────────────────────── */}
      <section className="pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {atAGlance.map((chip) =>
              chip.href ? (
                <a
                  key={chip.label}
                  href={chip.href}
                  className="inline-flex items-center gap-2.5 bg-[#0b1120] border border-[#1e2d4a] rounded-full px-4 py-2 text-sm font-body text-[#a0b2c8] hover:text-white hover:border-[#00c3ff]/40 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00c3ff] shrink-0"></span>
                  {chip.label}
                </a>
              ) : (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-2.5 bg-[#0b1120] border border-[#1e2d4a] rounded-full px-4 py-2 text-sm font-body text-[#a0b2c8]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00c3ff] shrink-0"></span>
                  {chip.label}
                </span>
              )
            )}
          </div>
          <p className="text-[#8b9bb4] text-sm font-body mt-4">Last reviewed: June 2026</p>
        </div>
      </section>

      {/* ── Main Sections — 2-column grid ──────────────────────────────────── */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mainSections.map((s, i) => (
              <FlyIn key={s.title} delay={['', 'delay-150', 'delay-300', 'delay-[450ms]', 'delay-[600ms]', 'delay-[750ms]'][i]}>
              <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 relative overflow-hidden h-full">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 rounded-full scale-150"></div>
                    <s.Icon
                      className="w-5 h-5 text-[#00c3ff] drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] relative z-10"
                      fill="currentColor"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </div>
                  <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">{s.title}</h2>
                </div>

                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-3">{s.lead}</p>

                {s.bullets && (
                  <ul className="space-y-2 mb-4">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-[#a0b2c8] font-body">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff] shrink-0 mt-[0.35rem]"></div>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                {s.note && (
                  <p className="text-[#8b9bb4] text-sm font-body leading-relaxed border-t border-[#1e2d4a] pt-4 mt-1">{s.note}</p>
                )}
              </div>
              </FlyIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Responsible Disclosure — full width ────────────────────────────── */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-6">
            {bottomSections.map((s, i) => (
              <FlyIn key={s.title} delay={['', 'delay-150'][i]}>
              <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 relative overflow-hidden h-full">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 rounded-full scale-150"></div>
                    <s.Icon
                      className="w-5 h-5 text-[#00c3ff] drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] relative z-10"
                      fill="currentColor"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </div>
                  <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">{s.title}</h2>
                </div>

                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed mb-3">{s.body}</p>

                {'email' in s && s.email && (
                  <a
                    href={`mailto:${s.email}`}
                    className="inline-block text-[#00c3ff] font-bold font-headline text-sm hover:text-white transition-colors mb-4"
                  >
                    {s.email}
                  </a>
                )}

                {s.note && (
                  <p className="text-[#8b9bb4] text-sm font-body leading-relaxed border-t border-[#1e2d4a] pt-4">{s.note}</p>
                )}
              </div>
              </FlyIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing band ───────────────────────────────────────────────────── */}
      <section className="py-12 px-6 pb-24">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-headline font-bold text-white text-3xl tracking-tight mb-6">
            Questions about security?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a
              href="mailto:security@honestecho.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-headline"
            >
              security@honestecho.com
            </a>
            <Link to="/privacy/" className="text-[#a0b2c8] hover:text-white transition-colors font-body text-sm">
              Read the Privacy Policy →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
