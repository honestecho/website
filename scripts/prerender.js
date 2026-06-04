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
  '/team-waitlist',
  '/tools/sam-gov-notice-analyzer',
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

    for (const route of routes) {
      const { html, helmetContext } = await render(route);
      const helmet = helmetContext.helmet;

      // Collect helmet-managed head tags
      const helmetHead = (
        helmet
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

      // Per-route self-canonical. No page sets <link rel="canonical"> in its
      // Helmet, so without this every prerendered route would inherit the
      // template's hard-coded homepage canonical — telling Google every landing
      // page is a duplicate of "/". Match the sitemap's canonical form (no
      // trailing slash; "/" for home).
      const canonical = `https://honestecho.com${route}`;

      const headTags = [helmetHead, `<link rel="canonical" href="${canonical}" />`]
        .filter(Boolean)
        .join('\n    ');

      // Strip the template's homepage-specific SEO tags so the per-route Helmet
      // values (and the canonical above) are the only ones that survive —
      // otherwise the home defaults leak onto every deep route. Scope the strip
      // to <head> only: page bodies can contain inline SVG <title> elements
      // (lucide icons) that must never be touched.
      const headEnd = template.indexOf('</head>');
      const head = template
        .slice(0, headEnd)
        .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
        .replace(/\s*<meta\s+name=["']description["'][^>]*>/i, '')
        .replace(/\s*<link\s+rel=["']canonical["'][^>]*>/i, '')
        .replace(/\s*<meta\s+property=["']og:url["'][^>]*>/i, '')
        .replace(/\s*<meta\s+property=["']og:title["'][^>]*>/i, '')
        .replace(/\s*<meta\s+property=["']og:description["'][^>]*>/i, '')
        .replace(/\s*<meta\s+name=["']twitter:title["'][^>]*>/i, '')
        .replace(/\s*<meta\s+name=["']twitter:description["'][^>]*>/i, '');

      // Reassemble: cleaned <head> + injected per-route tags + original body
      // with the SSR markup spliced into the root container.
      const output = (head + `    ${headTags}\n  ` + template.slice(headEnd))
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

      const filePath =
        route === '/'
          ? resolve(distDir, 'index.html')
          : resolve(distDir, route.slice(1), 'index.html');

      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, output);
      console.log(`  ✓  ${route.padEnd(12)}  →  ${filePath.replace(rootDir + '\\', '')}`);
    }

    console.log('\n✓ Pre-rendering complete\n');
  } finally {
    await vite.close();
  }
}

prerender().catch(err => {
  console.error('\nPre-render failed:', err);
  process.exit(1);
});
