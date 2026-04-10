import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Honest Echo</title>
        <meta name="description" content="Terms of Service for Pursuit by Honest Echo LLC. Read the terms governing your use of our platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/terms" />
        <meta property="og:title" content="Terms of Service — Honest Echo" />
        <meta property="og:description" content="Terms of Service for Pursuit by Honest Echo LLC." />
      </Helmet>

      <div className="max-w-3xl mx-auto px-6 py-20 text-[#cbd5e1]">
        <div className="mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-[#00c3ff] mb-3">Legal</p>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Terms of Service</h1>
          <p className="text-sm text-[#64748b]">Effective date: April 10, 2026</p>
        </div>

        <div className="space-y-8 text-[#94a3b8] text-sm leading-relaxed">

          <p>These Terms of Service ("Terms") govern your access to and use of Pursuit, a software-as-a-service product operated by Honest Echo LLC ("Company," "we," "us," or "our"), located at 4114 Legato Road, Fairfax, VA. By creating an account or using Pursuit, you agree to these Terms.</p>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Service Description</h2>
            <p>Pursuit is a bid/no-bid decision platform for government contractors. It scores opportunities from SAM.gov against your company profile and provides tools to manage your capture pipeline. Pursuit is not a proposal writing service, contract management system, or legal advisory tool.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Accounts and Eligibility</h2>
            <p>You must be at least 18 years old and provide accurate, complete profile information to use Pursuit. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You must notify us immediately at <a href="mailto:support@honestecho.com" className="text-[#00c3ff] hover:underline">support@honestecho.com</a> if you believe your account has been compromised.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Subscription Plans and Billing</h2>
            <p>Pursuit offers a free tier and paid subscription plans (Starter, Pro, and Team) billed monthly through Stripe. By subscribing to a paid plan, you authorize us to charge your payment method on a recurring monthly basis at the rate displayed at checkout.</p>
            <p className="mt-2">Prices are listed in US dollars and are subject to change with 30 days' notice. Plan features and usage limits are described on our pricing page and may be updated from time to time. Changes to plan features will not reduce functionality during a paid billing cycle.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Free Tier</h2>
            <p>The free tier provides limited access to Pursuit at no cost. We reserve the right to modify free tier features or limits at any time. The free tier does not include a service level commitment.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Cancellation and Refunds</h2>
            <p>You may cancel your paid subscription at any time through the billing section of your account settings or by contacting <a href="mailto:support@honestecho.com" className="text-[#00c3ff] hover:underline">support@honestecho.com</a>. Cancellation takes effect at the end of your current billing period. You will retain access to paid features until the end of the period you have already paid for.</p>
            <p className="mt-2">We do not offer refunds for partial billing periods. If you believe you were charged in error, contact us within 30 days of the charge.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-outside ml-5 space-y-1 mt-2">
              <li>Use Pursuit for any unlawful purpose or in violation of any applicable laws or regulations</li>
              <li>Scrape, crawl, or use automated tools to extract data from Pursuit beyond normal application usage</li>
              <li>Attempt to gain unauthorized access to our systems, other user accounts, or data</li>
              <li>Reverse-engineer, decompile, or attempt to derive the source code of Pursuit</li>
              <li>Resell, sublicense, or redistribute access to Pursuit without our written consent</li>
              <li>Use Pursuit to transmit malicious code or interfere with the service's operation</li>
            </ul>
            <p className="mt-3">We reserve the right to suspend or terminate accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Your Data</h2>
            <p>You retain ownership of all data you input into Pursuit, including your company profile, pursuit notes, and strategic assessments. We do not claim any intellectual property rights over your data.</p>
            <p className="mt-2">Opportunity data sourced from SAM.gov is public government data and is not owned by either party.</p>
            <p className="mt-2">We store and process your data as described in our <Link to="/privacy" className="text-[#00c3ff] hover:underline">Privacy Policy</Link>. Upon account deletion, we will remove your personal data within 30 days, subject to any legal retention requirements.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Intellectual Property</h2>
            <p>Pursuit, including its design, scoring algorithms, interface, documentation, and branding, is the property of Honest Echo LLC and is protected by applicable intellectual property laws. These Terms do not grant you any rights to our trademarks, logos, or brand elements.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. Data Accuracy and Disclaimers</h2>
            <p>Pursuit provides scores and analysis to assist your bid/no-bid decisions. This information is for informational purposes only and should not be your sole basis for business decisions. We do not guarantee the accuracy, completeness, or timeliness of opportunity data sourced from SAM.gov or any other external source.</p>
            <p className="mt-2 uppercase text-xs tracking-wide text-[#64748b]">PURSUIT IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">10. Limitation of Liability</h2>
            <p className="uppercase text-xs tracking-wide text-[#64748b]">TO THE MAXIMUM EXTENT PERMITTED BY LAW, HONEST ECHO LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITIES ARISING FROM YOUR USE OF OR INABILITY TO USE PURSUIT.</p>
            <p className="uppercase text-xs tracking-wide text-[#64748b] mt-2">OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING UNDER THESE TERMS SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">11. Indemnification</h2>
            <p>You agree to indemnify and hold harmless Honest Echo LLC, its officers, and affiliates from any claims, damages, or expenses arising from your use of Pursuit, your violation of these Terms, or your violation of any third-party rights.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">12. Modifications to Terms</h2>
            <p>We may update these Terms from time to time. If we make material changes, we will notify you by email or by posting a notice within the application at least 30 days before the changes take effect. Continued use of Pursuit after changes take effect constitutes acceptance of the revised Terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">13. Termination</h2>
            <p>We may suspend or terminate your access to Pursuit at any time for violation of these Terms, with or without notice depending on the severity of the violation. You may terminate your account at any time by contacting <a href="mailto:support@honestecho.com" className="text-[#00c3ff] hover:underline">support@honestecho.com</a>. Sections 7 through 11 survive termination.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">14. Governing Law</h2>
            <p>These Terms are governed by and construed in accordance with the laws of the Commonwealth of Virginia, without regard to its conflict of laws provisions. Any disputes arising under these Terms shall be resolved in the state or federal courts located in Fairfax County, Virginia.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">15. Contact</h2>
            <p>If you have questions about these Terms, contact us at:</p>
            <address className="not-italic mt-2 text-[#94a3b8]">
              Honest Echo LLC<br />
              4114 Legato Road, Fairfax, VA<br />
              General inquiries: <a href="mailto:info@honestecho.com" className="text-[#00c3ff] hover:underline">info@honestecho.com</a><br />
              Account &amp; billing support: <a href="mailto:support@honestecho.com" className="text-[#00c3ff] hover:underline">support@honestecho.com</a>
            </address>
          </section>

          <div className="pt-8 border-t border-[#1e2d4a] text-xs text-[#475569]">
            <p>This document was last updated on April 10, 2026. Please review our <Link to="/privacy" className="text-[#00c3ff] hover:underline">Privacy Policy</Link> for information about how we handle your data.</p>
          </div>
        </div>
      </div>
    </>
  );
}
