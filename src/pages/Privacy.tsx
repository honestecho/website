import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Honest Echo</title>
        <meta name="description" content="Privacy Policy for Pursuit by Honest Echo LLC. Learn how we collect, use, and protect your data." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/privacy" />
        <meta property="og:title" content="Privacy Policy — Honest Echo" />
        <meta property="og:description" content="Privacy Policy for Pursuit by Honest Echo LLC." />
      </Helmet>

      <div className="max-w-3xl mx-auto px-6 py-20 text-[#cbd5e1]">
        <div className="mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-[#00c3ff] mb-3">Legal</p>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-sm text-[#64748b]">Effective date: April 10, 2026</p>
        </div>

        <div className="prose-legal space-y-8 text-[#94a3b8] text-sm leading-relaxed">

          <p>Honest Echo LLC ("Company," "we," "us," or "our") operates Pursuit, a bid/no-bid decision platform for government contractors, accessible at pursuit.honestecho.com. This Privacy Policy describes what data we collect, how we use it, and your rights regarding that data.</p>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Information We Collect</h2>
            <h3 className="font-semibold text-slate-200 mb-2">Information you provide</h3>
            <div className="overflow-x-auto rounded-lg border border-[#1e2d4a] mb-4">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-[#1e2d4a] bg-[#0b1120]"><th className="text-left px-4 py-2.5 text-slate-300 font-semibold">Data Type</th><th className="text-left px-4 py-2.5 text-slate-300 font-semibold">Examples</th><th className="text-left px-4 py-2.5 text-slate-300 font-semibold">Purpose</th></tr></thead>
                <tbody className="divide-y divide-[#1e2d4a]">
                  <tr><td className="px-4 py-2.5">Account information</td><td className="px-4 py-2.5">Name, email address, password</td><td className="px-4 py-2.5">Authentication and account management</td></tr>
                  <tr><td className="px-4 py-2.5">Company profile</td><td className="px-4 py-2.5">Company name, NAICS codes, certifications, set-aside eligibility, geographic preferences</td><td className="px-4 py-2.5">Opportunity scoring and matching</td></tr>
                  <tr><td className="px-4 py-2.5">Pursuit data</td><td className="px-4 py-2.5">Pursuit notes, strategic assessments, bid/no-bid decisions, score weight preferences</td><td className="px-4 py-2.5">Core product functionality</td></tr>
                  <tr><td className="px-4 py-2.5">Billing information</td><td className="px-4 py-2.5">Payment method details</td><td className="px-4 py-2.5">Subscription billing (processed by Stripe; we do not store card numbers)</td></tr>
                </tbody>
              </table>
            </div>
            <h3 className="font-semibold text-slate-200 mb-2">Information collected automatically</h3>
            <div className="overflow-x-auto rounded-lg border border-[#1e2d4a] mb-4">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-[#1e2d4a] bg-[#0b1120]"><th className="text-left px-4 py-2.5 text-slate-300 font-semibold">Data Type</th><th className="text-left px-4 py-2.5 text-slate-300 font-semibold">Examples</th><th className="text-left px-4 py-2.5 text-slate-300 font-semibold">Purpose</th></tr></thead>
                <tbody className="divide-y divide-[#1e2d4a]">
                  <tr><td className="px-4 py-2.5">Usage data</td><td className="px-4 py-2.5">Features used, searches performed, pages visited within the app</td><td className="px-4 py-2.5">Product improvement and analytics</td></tr>
                  <tr><td className="px-4 py-2.5">Device information</td><td className="px-4 py-2.5">Browser type, operating system, screen resolution</td><td className="px-4 py-2.5">Technical support and compatibility</td></tr>
                  <tr><td className="px-4 py-2.5">Log data</td><td className="px-4 py-2.5">IP address, access timestamps, error logs</td><td className="px-4 py-2.5">Security monitoring and debugging</td></tr>
                </tbody>
              </table>
            </div>
            <h3 className="font-semibold text-slate-200 mb-2">Information from third-party sources</h3>
            <p>We retrieve publicly available opportunity data from SAM.gov to power our scoring and search features. This data is public government information and does not contain your personal data.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc list-outside ml-5 space-y-1 mt-2">
              <li>Provide, maintain, and improve Pursuit's features and scoring accuracy</li>
              <li>Process your subscription payments through Stripe</li>
              <li>Send you transactional communications (account confirmations, billing receipts, security alerts)</li>
              <li>Send you product communications (feature updates, usage summaries, deadline reminders) — you may opt out at any time</li>
              <li>Monitor for security threats, abuse, and technical issues</li>
              <li>Analyze aggregate usage patterns to improve the product (we do not sell individual usage data)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. How We Share Your Information</h2>
            <p>We do not sell, rent, or trade your personal information. We share data only with the following service providers, who process data on our behalf under contractual obligations:</p>
            <div className="overflow-x-auto rounded-lg border border-[#1e2d4a] my-4">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-[#1e2d4a] bg-[#0b1120]"><th className="text-left px-4 py-2.5 text-slate-300 font-semibold">Provider</th><th className="text-left px-4 py-2.5 text-slate-300 font-semibold">Purpose</th><th className="text-left px-4 py-2.5 text-slate-300 font-semibold">Data Shared</th></tr></thead>
                <tbody className="divide-y divide-[#1e2d4a]">
                  <tr><td className="px-4 py-2.5">Supabase</td><td className="px-4 py-2.5">Database hosting and authentication</td><td className="px-4 py-2.5">Account data, company profile, pursuit data</td></tr>
                  <tr><td className="px-4 py-2.5">Stripe</td><td className="px-4 py-2.5">Payment processing</td><td className="px-4 py-2.5">Billing information, email address</td></tr>
                </tbody>
              </table>
            </div>
            <p>We may also disclose information if required by law, court order, or governmental regulation, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Data Storage and Security</h2>
            <p>Your data is stored on servers located in the United States, hosted by Supabase with the following security measures:</p>
            <ul className="list-disc list-outside ml-5 space-y-1 mt-2">
              <li>Encryption in transit (TLS 1.2+) and at rest (AES-256)</li>
              <li>Row-level security (RLS) ensuring users can only access their own data</li>
              <li>Regular security monitoring and access logging</li>
              <li>No use of your data to train artificial intelligence or machine learning models</li>
            </ul>
            <p className="mt-3">While we implement commercially reasonable security measures, no system is completely secure. We cannot guarantee the absolute security of your data.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Data Retention</h2>
            <p>We retain your data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law (e.g., billing records for tax purposes, which we retain for 7 years).</p>
            <p className="mt-2">Anonymized, aggregate usage data that cannot be linked back to you may be retained indefinitely for analytics purposes.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the following rights:</p>
            <ul className="list-disc list-outside ml-5 space-y-1 mt-2">
              <li><strong className="text-slate-200">Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong className="text-slate-200">Correction:</strong> Request that we correct inaccurate data</li>
              <li><strong className="text-slate-200">Deletion:</strong> Request that we delete your personal data</li>
              <li><strong className="text-slate-200">Export:</strong> Request a machine-readable copy of your data</li>
              <li><strong className="text-slate-200">Opt-out:</strong> Unsubscribe from non-transactional communications at any time</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:support@honestecho.com" className="text-[#00c3ff] hover:underline">support@honestecho.com</a>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Cookies and Tracking</h2>
            <p>Pursuit uses essential cookies required for authentication and session management. We do not use third-party advertising cookies or cross-site tracking pixels. If we add analytics tools in the future, we will update this policy and provide opt-out options.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Children's Privacy</h2>
            <p>Pursuit is a business tool designed for professional use. We do not knowingly collect personal information from anyone under the age of 18. If we learn that we have collected data from a minor, we will delete it promptly.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. California Residents (CCPA)</h2>
            <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):</p>
            <ul className="list-disc list-outside ml-5 space-y-1 mt-2">
              <li>The right to know what personal information we collect, use, and share</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to opt out of the sale of personal information — we do not sell personal information</li>
              <li>The right to non-discrimination for exercising your privacy rights</li>
            </ul>
            <p className="mt-3">To make a CCPA request, contact <a href="mailto:support@honestecho.com" className="text-[#00c3ff] hover:underline">support@honestecho.com</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice within the application at least 30 days before the changes take effect. The "Effective date" at the top of this page indicates when this policy was last revised.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">11. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or how we handle your data, contact us at:</p>
            <address className="not-italic mt-2 text-[#94a3b8]">
              Honest Echo LLC<br />
              4114 Legato Road, Fairfax, VA<br />
              Privacy inquiries: <a href="mailto:support@honestecho.com" className="text-[#00c3ff] hover:underline">support@honestecho.com</a><br />
              General inquiries: <a href="mailto:info@honestecho.com" className="text-[#00c3ff] hover:underline">info@honestecho.com</a>
            </address>
          </section>

          <div className="pt-8 border-t border-[#1e2d4a] text-xs text-[#475569]">
            <p>This document was last updated on April 10, 2026. Please also review our <Link to="/terms" className="text-[#00c3ff] hover:underline">Terms of Service</Link>.</p>
          </div>
        </div>
      </div>
    </>
  );
}
