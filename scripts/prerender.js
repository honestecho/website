/**
 * Pre-render script — Sprint 2 SSG
 *
 * Uses Vite's createServer + ssrLoadModule to render each route to static HTML.
 * This approach works with OneDrive (where Node's ESM loader can't read cloud-synced
 * node_modules) because it uses the same Vite file pipeline as `npm run dev`.
 *
 * Run after `vite build` — reads dist/index.html as template, writes
 * dist/{route}/index.html for Cloudflare Pages to serve to crawlers, and
 * dist/sitemap.xml from the same route table.
 */

import { createServer } from 'vite';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist');

// All indexable routes. This table is the single source of truth for both the
// pre-render pass and sitemap.xml — they used to drift (the sitemap sat frozen
// at one hand-typed lastmod for every URL while pages shipped weekly).
// `file` is what lastmod is read from, via that file's last commit date.
const routes = [
  { path: '/',                                        file: 'src/pages/Home.tsx',                        changefreq: 'weekly',  priority: '1.0' },
  { path: '/pricing',                                 file: 'src/pages/Pricing.tsx',                     changefreq: 'weekly',  priority: '0.9' },
  { path: '/about',                                   file: 'src/pages/About.tsx',                       changefreq: 'monthly', priority: '0.8' },
  { path: '/contact',                                 file: 'src/pages/Contact.tsx',                     changefreq: 'monthly', priority: '0.7' },
  { path: '/faq',                                     file: 'src/pages/FAQ.tsx',                         changefreq: 'weekly',  priority: '0.8' },
  { path: '/security',                                file: 'src/pages/Security.tsx',                    changefreq: 'monthly', priority: '0.6' },
  { path: '/terms',                                   file: 'src/pages/Terms.tsx',                       changefreq: 'yearly',  priority: '0.3' },
  { path: '/privacy',                                 file: 'src/pages/Privacy.tsx',                     changefreq: 'yearly',  priority: '0.3' },
  { path: '/signup',                                  file: 'src/pages/Signup.tsx',                      changefreq: 'monthly', priority: '0.7' },
  { path: '/vs-govwin',                               file: 'src/pages/VsGovWin.tsx',                    changefreq: 'monthly', priority: '0.8' },
  { path: '/vs-govtribe',                             file: 'src/pages/VsGovTribe.tsx',                  changefreq: 'monthly', priority: '0.8' },
  { path: '/sam-gov-opportunity-analysis',            file: 'src/pages/SamGovAnalysis.tsx',              changefreq: 'monthly', priority: '0.8' },
  { path: '/sam-gov-hidden-opportunities',            file: 'src/pages/SamGovHiddenOpportunities.tsx',   changefreq: 'monthly', priority: '0.8' },
  { path: '/sources-sought-worth-responding',         file: 'src/pages/SourcesSoughtGuide.tsx',          changefreq: 'monthly', priority: '0.8' },
  { path: '/sam-gov-recompete-tracking',              file: 'src/pages/SamGovRecompeteTracking.tsx',     changefreq: 'monthly', priority: '0.8' },
  { path: '/for-small-business-owners',               file: 'src/pages/ForSmallBusinessOwners.tsx',      changefreq: 'monthly', priority: '0.8' },
  { path: '/for-proposal-managers',                   file: 'src/pages/ForProposalManagers.tsx',         changefreq: 'monthly', priority: '0.8' },
  { path: '/for-govcon-consultants',                  file: 'src/pages/ForGovconConsultants.tsx',        changefreq: 'monthly', priority: '0.8' },
  // Rebuilt daily so the seeded list below stays inside its 48-hour promise.
  { path: '/government-contracts-for-bid/construction', file: 'src/pages/ContractsForBidConstruction.tsx', changefreq: 'daily',  priority: '0.9' },
  { path: '/team-waitlist',                           file: 'src/pages/TeamWaitlist.tsx',                changefreq: 'monthly', priority: '0.5' },
  { path: '/tools/sam-gov-notice-analyzer',           file: 'src/pages/SamGovNoticeAnalyzer.tsx',        changefreq: 'weekly',  priority: '0.9' },
  { path: '/tools/pursuit-readout',                   file: 'src/pages/PursuitReadout.tsx',              changefreq: 'weekly',  priority: '0.9' },
];

const LIST_ROUTE = '/government-contracts-for-bid/construction';
const LIST_NAICS = '236220';
// The page advertises "at least 48 hours left". A notice seeded with 72 hours
// left still honours that a full day later, which is the rebuild cadence.
const SEED_MIN_HOURS = 72;

const apiOrigin = (process.env.VITE_API_URL || 'https://he-pursuit-api.onrender.com')
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');

const urlOf = path => `https://honestecho.com${path}${path === '/' ? '' : '/'}`;

/**
 * Build-time list for the construction page, so its rows are in the static HTML
 * instead of arriving after hydration (a crawler only ever saw "Loading live
 * notices…"). Never fatal: with no seed the page renders its skeleton and
 * fetches on mount, exactly as it did before.
 */
async function fetchListSeed() {
  try {
    const res = await fetch(`${apiOrigin}/api/public/opportunities/list?naics=${LIST_NAICS}`, {
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const payload = await res.json();
    if (!Array.isArray(payload?.notices)) throw new Error('unexpected payload shape');

    const floor = Date.now() + SEED_MIN_HOURS * 3600e3;
    const notices = payload.notices.filter(n => new Date(n.response_deadline).getTime() >= floor);
    if (!notices.length) throw new Error('no notice survives the deadline floor');

    console.log(`  ·  list seed: ${notices.length} of ${payload.notices.length} notices have ${SEED_MIN_HOURS}h+ left`);
    return { ...payload, notices, count: notices.length };
  } catch (err) {
    console.warn(`  !  list seed unavailable (${err.message}) — ${LIST_ROUTE} will render its skeleton`);
    return null;
  }
}

// </script> and <!-- inside JSON would end the inline script early.
const inlineJson = value => JSON.stringify(value).replace(/</g, '\\u003c');

/** Last commit date of a file (YYYY-MM-DD), or today if git can't say. */
const today = new Date().toISOString().slice(0, 10);
function lastModified(file) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
      cwd: rootDir,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out || today;
  } catch {
    return today;
  }
}

function writeSitemap() {
  const body = routes
    .map(({ path, file, changefreq, priority }) =>
      [
        '  <url>',
        `    <loc>${urlOf(path)}</loc>`,
        // The list page's content turns over with SAM.gov, not with its source file.
        `    <lastmod>${path === LIST_ROUTE ? today : lastModified(file)}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n')
    )
    .join('\n\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${body}

</urlset>
`;
  writeFileSync(resolve(distDir, 'sitemap.xml'), xml);
  console.log(`  ✓  ${'sitemap.xml'.padEnd(30)}  →  ${routes.length} URLs`);
}

async function prerender() {
  // Spin up a Vite dev server in SSR middleware mode.
  // ssrLoadModule loads TypeScript source via Vite's transform pipeline —
  // works with OneDrive because Vite handles its own file reads.
  const vite = await createServer({
    root: rootDir,
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'warn',
    // Disable the dep optimizer — it reads the lockfile which is a cloud-synced
    // OneDrive file and causes UNKNOWN read errors during the build step.
    optimizeDeps: { disabled: true },
  });

  try {
    const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
    const template = readFileSync(resolve(distDir, 'index.html'), 'utf-8');
    const listSeed = await fetchListSeed();

    // Strip the template's homepage-specific SEO tags once, scoped to <head>, so
    // per-route Helmet values + canonical are the only ones that survive (the
    // home defaults must not leak onto deep routes). Scoping to <head> keeps
    // inline SVG <title> in page bodies (lucide icons) untouched.
    const headEnd = template.indexOf('</head>');
    const cleanHead = template
      .slice(0, headEnd)
      .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
      .replace(/\s*<meta\s+name=["']description["'][^>]*>/i, '')
      .replace(/\s*<link\s+rel=["']canonical["'][^>]*>/i, '')
      .replace(/\s*<meta\s+property=["']og:url["'][^>]*>/i, '')
      .replace(/\s*<meta\s+property=["']og:title["'][^>]*>/i, '')
      .replace(/\s*<meta\s+property=["']og:description["'][^>]*>/i, '')
      .replace(/\s*<meta\s+name=["']twitter:title["'][^>]*>/i, '')
      .replace(/\s*<meta\s+name=["']twitter:description["'][^>]*>/i, '');
    const tailHtml = template.slice(headEnd);

    const helmetTags = helmet =>
      (helmet
        ? [
            helmet.title?.toString() ?? '',
            helmet.priority?.toString() ?? '',
            helmet.meta?.toString() ?? '',
            helmet.link?.toString() ?? '',
            helmet.script?.toString() ?? '',
          ]
        : []
      )
        .map(s => s.trim())
        .filter(Boolean)
        .join('\n    ');

    const buildPage = (html, headTags) =>
      (cleanHead + `    ${headTags}\n  ` + tailHtml)
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

    for (const { path } of routes) {
      const seed = path === LIST_ROUTE && listSeed ? { list: listSeed } : undefined;
      const { html, helmetContext } = await render(path, seed);

      // Self-canonical in the trailing-slash form Cloudflare Pages actually
      // serves (/route/ — requesting /route 308-redirects to add the slash).
      // Matching the served URL keeps the canonical a 200, not a redirect target.
      const headTags = [
        helmetTags(helmetContext.helmet),
        `<link rel="canonical" href="${urlOf(path)}" />`,
        // Same object the server just rendered from, so hydration sees the rows
        // already in the HTML rather than replacing them with a skeleton.
        seed ? `<script>window.__HE_LIST__ = ${inlineJson(listSeed)};</script>` : '',
      ]
        .filter(Boolean)
        .join('\n    ');

      const output = buildPage(html, headTags);
      const filePath =
        path === '/'
          ? resolve(distDir, 'index.html')
          : resolve(distDir, path.slice(1), 'index.html');

      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, output);
      console.log(`  ✓  ${path.padEnd(30)}  →  ${filePath.replace(rootDir + '\\', '')}`);
    }

    // 404 page — Cloudflare Pages serves dist/404.html with an HTTP 404 for any
    // path that matches no static asset. Without it, unknown URLs fall back to
    // index.html with a 200 (soft 404 — wastes crawl budget, can index junk).
    // Render the catch-all NotFound route; it sets robots=noindex, no canonical.
    const notFound = await render('/__not_found__');
    writeFileSync(resolve(distDir, '404.html'), buildPage(notFound.html, helmetTags(notFound.helmetContext.helmet)));
    console.log(`  ✓  ${'404'.padEnd(30)}  →  ${resolve(distDir, '404.html').replace(rootDir + '\\', '')}`);

    writeSitemap();

    console.log('\n✓ Pre-rendering complete\n');
  } finally {
    await vite.close();
  }
}

prerender().catch(err => {
  console.error('\nPre-render failed:', err);
  process.exit(1);
});
