import { Helmet } from 'react-helmet-async';

// ── Organization (rendered on every page via App.tsx) ─────────────────────────

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Honest Echo LLC',
    url: 'https://honestecho.com',
    logo: 'https://honestecho.com/he-logo.png',
    description: 'Honest Echo LLC is a woman-owned, veteran-owned small business based in Fairfax, VA. It builds HE Pursuit — a bid/no-bid decision platform for small government contractors — helping lean GovCon teams evaluate SAM.gov opportunities faster and with more confidence.',
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
      'https://www.crunchbase.com/organization/honest-echo-llc',
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// ── WebSite (rendered on every page via App.tsx) ──────────────────────────────
// Binds the domain to the Organization so a model resolving "Honest Echo" gets
// one entity, not a site and a company it has to guess are the same.

export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Honest Echo',
    url: 'https://honestecho.com',
    publisher: {
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

// ── BreadcrumbList (pages below the root) ─────────────────────────────────────

export function BreadcrumbListSchema({ items }: { items: { name: string; path: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, path }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `https://honestecho.com${path}`,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// ── ItemList (list-browse pages) ──────────────────────────────────────────────
// Describes the notices actually rendered on the page. Emitted only when the
// list is in the prerendered HTML — schema that describes rows a crawler cannot
// see is the kind of mismatch that gets structured data ignored.

export function ItemListSchema({ name, items }: { name: string; items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map(({ name: itemName, url }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: itemName,
      url,
    })),
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
        url: 'https://honestecho.com/pricing/',
        price: '0',
        priceCurrency: 'USD',
        description: 'SAM.gov search, opportunity scoring, and bookmarks (up to 15/month)',
      },
      {
        '@type': 'Offer',
        name: 'Starter',
        url: 'https://honestecho.com/pricing/',
        price: '99',
        priceCurrency: 'USD',
        description: 'Full bid/no-bid workflow, 25 pursuits/month',
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        url: 'https://honestecho.com/pricing/',
        price: '199',
        priceCurrency: 'USD',
        description: 'Unlimited pursuits, dashboard, PDF export',
      },
      {
        '@type': 'Offer',
        name: 'Team',
        url: 'https://honestecho.com/pricing/',
        price: '299',
        priceCurrency: 'USD',
        description: 'Multi-user workspace, shared pursuit pipeline (waitlist)',
        availability: 'https://schema.org/PreOrder',
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
