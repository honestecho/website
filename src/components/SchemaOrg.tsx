import { Helmet } from 'react-helmet-async';

// ── Organization (rendered on every page via App.tsx) ─────────────────────────

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Honest Echo LLC',
    url: 'https://honestecho.com',
    logo: 'https://honestecho.com/he-logo.png',
    description: 'Honest Echo builds HE Pursuit — a bid/no-bid decision platform for small government contractors. We help lean GovCon teams evaluate SAM.gov opportunities faster and with more confidence.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Fairfax',
      addressRegion: 'VA',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@honestecho.com',
      contactType: 'customer support',
    },
    sameAs: [
      'https://pursuit.honestecho.com',
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// ── SoftwareApplication (Home + Pricing pages) ────────────────────────────────

export function SoftwareApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HE Pursuit',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://pursuit.honestecho.com',
    description: 'Bid/no-bid decision platform for small government contractors. Evaluate government contracting opportunities on SAM.gov for fit, eligibility, effort, and pursuit value in minutes.',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'USD',
        description: 'SAM.gov search, opportunity scoring, and bookmarks (up to 15/month)',
      },
      {
        '@type': 'Offer',
        name: 'Starter',
        price: '99',
        priceCurrency: 'USD',
        description: 'Full bid/no-bid workflow, 25 evaluations/month',
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '199',
        priceCurrency: 'USD',
        description: 'Unlimited evaluations, dashboard, PDF export',
      },
      {
        '@type': 'Offer',
        name: 'Team',
        price: '299',
        priceCurrency: 'USD',
        description: 'Multi-user workspace, shared pursuit pipeline',
      },
    ],
    creator: {
      '@type': 'Organization',
      name: 'Honest Echo LLC',
      url: 'https://honestecho.com',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// ── FAQPage (FAQ page only) ───────────────────────────────────────────────────

interface FAQEntry { q: string; a: string; }

export function FAQPageSchema({ items }: { items: FAQEntry[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
