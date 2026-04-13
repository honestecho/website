import { Helmet } from 'react-helmet-async';
import { Shield, Lock, Server, Eye, FileCheck, AlertCircle } from 'lucide-react';

const items = [
  {
    icon: Server,
    title: 'US-Hosted Infrastructure',
    body: 'All data is stored and processed exclusively within the United States. Backend compute runs on Render (US regions) and the database on Supabase (AWS us-east-1). No data is routed through foreign servers.',
  },
  {
    icon: Lock,
    title: 'Encryption In Transit & At Rest',
    body: 'All traffic is encrypted with TLS 1.2+. Database data is encrypted at rest using AES-256 via Supabase / AWS. API keys and secrets are stored as environment variables, never in source code.',
  },
  {
    icon: Eye,
    title: 'No Training on Your Data',
    body: 'Your opportunity data, pursuit notes, and company profile are never used to train AI models. Claude API calls are stateless — each request is isolated and not retained by Anthropic for model training under our API agreement.',
  },
  {
    icon: Shield,
    title: 'Row-Level Security (RLS)',
    body: 'Every database table uses Supabase Row-Level Security policies enforced at the database layer. Users can only read and write their own data — cross-account access is structurally impossible, not just blocked by application logic.',
  },
  {
    icon: FileCheck,
    title: 'SOC 2 & Compliance Posture',
    body: 'Supabase and Render are SOC 2 Type II compliant. HE Pursuit does not store CUI (Controlled Unclassified Information) and is not designed for classified data. For CUI-handling requirements, contact us to discuss a custom deployment.',
  },
  {
    icon: AlertCircle,
    title: 'Vulnerability Disclosure',
    body: 'To report a security issue, email security@honestecho.com. We aim to acknowledge reports within 48 hours and resolve critical issues within 7 business days. We do not pursue legal action against good-faith researchers.',
  },
];

export default function Security() {
  return (
    <>
      <Helmet>
        <title>Security | Honest Echo</title>
        <meta name="description" content="Honest Echo security posture — US-hosted, encrypted at rest and in transit, row-level data isolation, no AI training on user data, SOC 2 compliant infrastructure." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/security" />
        <meta property="og:title" content="Security at Honest Echo — Trust & Data Protection" />
        <meta property="og:description" content="US-hosted, AES-256 encrypted, row-level security, no AI training on user data. Built for GovCon teams that take security seriously." />
        <meta property="og:image" content="https://honestecho.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Security at Honest Echo — Trust & Data Protection" />
        <meta name="twitter:description" content="US-hosted, AES-256 encrypted, row-level security, no AI training on user data. Built for GovCon teams that take security seriously." />
        <meta name="twitter:image" content="https://honestecho.com/og-image.png" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]" />
            <span className="text-xs font-bold text-blue-200 tracking-wide">Trust & Security</span>
          </div>
          <h1 className="font-headline font-black text-5xl text-white mb-6 tracking-tight">
            Security at <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c3ff] to-purple-400">Honest Echo</span>
          </h1>
          <p className="text-lg text-[#a0b2c8] max-w-2xl mx-auto leading-relaxed">
            Federal buyers and GovCon teams need to trust the tools they use. Here is exactly how we protect your data.
          </p>
        </div>

        {/* Security Items */}
        <div className="space-y-6">
          {items.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl bg-[#0b1120] border border-[#1e2d4a] p-7 flex gap-6 items-start"
              style={{ boxShadow: '0 0 0 1px rgba(0,195,255,0.04), 0 4px 24px rgba(0,0,0,0.4)' }}
            >
              <div className="w-11 h-11 rounded-lg bg-[#00c3ff]/8 border border-[#00c3ff]/20 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-[#00c3ff]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                <p className="text-[#a0b2c8] text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-14 text-center">
          <p className="text-sm text-[#4a6080]">
            Questions about our security posture?{' '}
            <a href="mailto:security@honestecho.com" className="text-[#00c3ff] hover:underline">
              security@honestecho.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
