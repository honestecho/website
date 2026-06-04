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
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist');

// All indexable routes — must match sitemap.xml (public/sitemap.xml).
// `module` is the lazy-loaded page source, used to inject <link rel="modulepreload">
// for that route's code-split chunk (null = eager, e.g. Home is in the main bundle).
const routes = [
  { path: '/', module: null },
  { path: '/pricing', module: 'src/pages/Pricing.tsx' },
  { path: '/about', module: 'src/pages/About.tsx' },
  { path: '/contact', module: 'src/pages/Contact.tsx' },
  { path: '/faq', module: 'src/pages/FAQ.tsx' },
  { path: '/security', module: 'src/pages/Security.tsx' },
  { path: '/terms', module: 'src/pages/Terms.tsx' },
  { path: '/privacy', module: 'src/pages/Privacy.tsx' },
  { path: '/signup', module: 'src/pages/Signup.tsx' },
  { path: '/vs-govwin', module: 'src/pages/VsGovWin.tsx' },
  { path: '/vs-govtribe', module: 'src/pages/VsGovTribe.tsx' },
  { path: '/sam-gov-opportunity-analysis', module: 'src/pages/SamGovAnalysis.tsx' },
  { path: '/team-waitlist', module: 'src/pages/TeamWaitlist.tsx' },
  { path: '/tools/sam-gov-notice-analyzer', module: 'src/pages/SamGovNoticeAnalyzer.tsx' },
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

    // Build manifest maps each page source to its code-split chunk (+ shared
    // imports). Preloading them means the lazy route chunk is already in flight
    // by hydration time, so React never flashes the Suspense fallback (the cause
    // of CLS on hard-loaded landing pages).
    let manifest = {};
    try {
      manifest = JSON.parse(readFileSync(resolve(distDir, '.vite/manifest.json'), 'utf-8'));
    } catch {
      console.warn('  !  no .vite/manifest.json — skipping modulepreload injection');
    }
    const preloadFor = moduleId => {
      if (!moduleId) return '';
      if (!manifest[moduleId]) {
        // A route's source moved/renamed without updating the map — surface it,
        // since a silent miss means that route's CLS regresses unnoticed.
        console.warn(`  !  manifest has no entry for ${moduleId} — modulepreload skipped`);
        return '';
      }
      // Walk the import graph transitively so nested shared chunks are preloaded
      // too, not just the route's direct dependencies.
      const files = new Set();
      const visit = id => {
        const e = manifest[id];
        if (!e) return;
        if (e.file) files.add(e.file);
        for (const imp of e.imports || []) visit(imp);
      };
      visit(moduleId);
      return [...files].map(f => `<link rel="modulepreload" href="/${f}" />`).join('\n    ');
    };

    for (const { path: route, module } of routes) {
      const { html, helmetContext } = await render(route);

      // Self-canonical in the trailing-slash form Cloudflare Pages actually
      // serves (/route/ — requesting /route 308-redirects to add the slash).
      // Matching the served URL keeps the canonical a 200, not a redirect target.
      const canonical = `https://honestecho.com${route}${route === '/' ? '' : '/'}`;
      const headTags = [
        helmetTags(helmetContext.helmet),
        `<link rel="canonical" href="${canonical}" />`,
        preloadFor(module),
      ]
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

    // The build manifest was only needed for modulepreload injection above; don't
    // ship it (it's a build artifact, not a runtime asset).
    rmSync(resolve(distDir, '.vite/manifest.json'), { force: true });

    console.log('\n✓ Pre-rendering complete\n');
  } finally {
    await vite.close();
  }
}

prerender().catch(err => {
  console.error('\nPre-render failed:', err);
  process.exit(1);
});
