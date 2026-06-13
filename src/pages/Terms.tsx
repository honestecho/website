import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FileText, UserCheck, CreditCard, AlertCircle, ShieldCheck, Clock, XCircle, AlertTriangle, RefreshCw, Mail } from 'lucide-react';
import FlyIn from '../components/FlyIn';

// ─── Content ──────────────────────────────────────────────────────────────────

interface Bullet { label?: string; items: string[]; }
interface TermsSection {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  lead: string;
  body?: string;
  bullets?: Bullet;
  note?: string;
  email?: string;
}

const sections: TermsSection[] = [
  {
    Icon: FileText,
    title: 'Use of the Service',
    lead: 'HE Pursuit is a software platform designed to help users evaluate government contracting opportunities and support bid/no-bid decisions.',
    body: 'You agree to use the service for lawful purposes and in accordance with these Terms.',
    bullets: {
      label: 'You are responsible for:',
      items: ['Maintaining the security of your account', 'The accuracy of information you provide', 'All activity that occurs under your account'],
    },
  },
  {
    Icon: UserCheck,
    title: 'Accounts',
    lead: 'You must provide accurate information when creating an account.',
    bullets: {
      label: 'We reserve the right to suspend or terminate accounts that:',
      items: ['Violate these Terms', 'Misuse the platform', 'Attempt to access or interfere with other users\' data'],
    },
  },
  {
    Icon: CreditCard,
    title: 'Subscriptions & Billing',
    lead: 'Some features of HE Pursuit require a paid subscription.',
    bullets: {
      items: ['Subscriptions are billed on a recurring basis', 'You may cancel at any time', 'Access to paid features continues through the end of the billing period'],
    },
    note: 'We may update pricing from time to time. If we make material changes, we will provide reasonable notice.',
  },
  {
    Icon: AlertCircle,
    title: 'Product Limitations',
    lead: 'HE Pursuit is designed to support decision-making, not replace professional judgment.',
    bullets: {
      items: ['Outputs, scores, and recommendations are informational', 'We do not guarantee outcomes or contract awards', 'You are responsible for your final bid/no-bid decisions'],
    },
  },
  {
    Icon: ShieldCheck,
    title: 'Data & Privacy',
    lead: 'Your use of the service is also governed by our Privacy Policy.',
    body: 'We do not sell your data and use it only to provide and improve the service.',
  },
  {
    Icon: Clock,
    title: 'Availability',
    lead: 'We aim to provide a reliable service, but we do not guarantee uninterrupted access.',
    body: 'The platform may be updated, modified, or temporarily unavailable due to maintenance or other factors.',
  },
  {
    Icon: XCircle,
    title: 'Termination',
    lead: 'You may stop using the service at any time.',
    bullets: {
      label: 'We reserve the right to suspend or terminate access if:',
      items: ['These Terms are violated', 'The service is misused', 'Required by law'],
    },
  },
  {
    Icon: AlertTriangle,
    title: 'Limitation of Liability',
    lead: 'To the maximum extent permitted by law:',
    bullets: {
      items: ['HE Pursuit is provided "as is"', 'We are not liable for indirect, incidental, or consequential damages', 'We are not responsible for business decisions made using the platform'],
    },
  },
  {
    Icon: RefreshCw,
    title: 'Changes to These Terms',
    lead: 'We may update these Terms from time to time.',
    body: 'If changes are material, we will provide notice through the platform or by email.',
  },
  {
    Icon: Mail,
    title: 'Contact',
    lead: 'If you have questions about these Terms:',
    email: 'support@honestecho.com',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Honest Echo</title>
        <meta name="description" content="Terms of Service for HE Pursuit by Honest Echo LLC. Read the terms governing your use of our bid/no-bid decision platform for government contractors." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/terms" />
        <meta property="og:title" content="Terms of Service — Honest Echo" />
        <meta property="og:description" content="Terms governing your use of HE Pursuit by Honest Echo LLC." />
        <meta property="og:image" content="https://honestecho.com/pursuit-overview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms of Service — Honest Echo" />
        <meta name="twitter:description" content="Terms governing your use of HE Pursuit by Honest Echo LLC." />
        <meta name="twitter:image" content="https://honestecho.com/pursuit-overview.png" />
      </Helmet>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="font-headline font-black text-5xl md:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            Terms of Service
          </h1>
          <p className="text-[#8b9bb4] text-base font-body">
            Effective Date: April 10, 2026 &nbsp;·&nbsp; Honest Echo LLC operates HE Pursuit. By accessing or using the service, you agree to these Terms.
          </p>
        </div>
      </section>

      {/* ── Sections — single column ───────────────────────────────────────── */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-6">
            {sections.map((s) => (
              <FlyIn key={s.title}>
              <div
                className="group bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden h-full hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                    <s.Icon
                      className="w-5 h-5 text-[#00c3ff] group-hover:text-white group-hover:scale-110 drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10"
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
                  <div className="mb-3">
                    {s.bullets.label && (
                      <p className="text-[#8b9bb4] text-sm font-body mb-2">{s.bullets.label}</p>
                    )}
                    <ul className="space-y-2">
                      {s.bullets.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-[#a0b2c8] font-body">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff] shrink-0 mt-[0.35rem]"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {s.email && (
                  <a href={`mailto:${s.email}`} className="inline-block text-[#00c3ff] font-bold font-headline text-sm hover:text-white transition-colors mb-3">
                    {s.email}
                  </a>
                )}

                {s.note && (
                  <p className="text-[#8b9bb4] text-sm font-body leading-relaxed border-t border-[#1e2d4a] pt-4 mt-1">{s.note}</p>
                )}

                {s.title === 'Contact' && (
                  <p className="text-[#8b9bb4] text-sm font-body mt-4 border-t border-[#1e2d4a] pt-4">
                    Also see our{' '}
                    <Link to="/privacy/" className="text-[#00c3ff] hover:text-white transition-colors">Privacy Policy</Link>.
                  </p>
                )}
              </div>
              </FlyIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
