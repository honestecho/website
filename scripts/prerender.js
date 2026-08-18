/**
 * Pre-render script — Sprint 2 SSG
 *
 * Uses Vite's createServer + ssrLoadModule to render each route to static HTML.
 * This approach works with OneDrive (where Node's ESM loader can't read cloud-synced
 * node_modules) because it uses the same Vite file pipeline as `npm run dev`.
 *
 * Run after `vite build` — reads dist/index.html as template, writes
 * dist/{route}/index.html for Cloudflare Pages to serve to crawlers.
 */

import { createServer } from 'vite';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist');

// All indexable routes — must match sitemap.xml (public/sitemap.xml).
const routes = [
  '/',
  '/pricing',
  '/about',
  '/contact',
  '/faq',
  '/security',
  '/terms',
  '/privacy',
  '/signup',
  '/vs-govwin',
  '/vs-govtribe',
  '/sam-gov-opportunity-analysis',
  '/sam-gov-hidden-opportunities',
  '/sources-sought-worth-responding',
  '/sam-gov-recompete-tracking',
  '/for-small-business-owners',
  '/for-proposal-managers',
  '/for-govcon-consultants',
  '/team-waitlist',
  '/tools/sam-gov-notice-analyzer',
  '/tools/pursuit-readout',
];

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

    for (const route of routes) {
      const { html, helmetContext } = await render(route);

      // Self-canonical in the trailing-slash form Cloudflare Pages actually
      // serves (/route/ — requesting /route 308-redirects to add the slash).
      // Matching the served URL keeps the canonical a 200, not a redirect target.
      const canonical = `https://honestecho.com${route}${route === '/' ? '' : '/'}`;
      const headTags = [helmetTags(helmetContext.helmet), `<link rel="canonical" href="${canonical}" />`]
        .filter(Boolean)
        .join('\n    ');

      const output = buildPage(html, headTags);
      const filePath =
        route === '/'
          ? resolve(distDir, 'index.html')
          : resolve(distDir, route.slice(1), 'index.html');

      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, output);
      console.log(`  ✓  ${route.padEnd(30)}  →  ${filePath.replace(rootDir + '\\', '')}`);
    }

    // 404 page — Cloudflare Pages serves dist/404.html with an HTTP 404 for any
    // path that matches no static asset. Without it, unknown URLs fall back to
    // index.html with a 200 (soft 404 — wastes crawl budget, can index junk).
    // Render the catch-all NotFound route; it sets robots=noindex, no canonical.
    const notFound = await render('/__not_found__');
    writeFileSync(resolve(distDir, '404.html'), buildPage(notFound.html, helmetTags(notFound.helmetContext.helmet)));
    console.log(`  ✓  ${'404'.padEnd(30)}  →  ${resolve(distDir, '404.html').replace(rootDir + '\\', '')}`);

    console.log('\n✓ Pre-rendering complete\n');
  } finally {
    await vite.close();
  }
}

prerender().catch(err => {
  console.error('\nPre-render failed:', err);
  process.exit(1);
});
