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

// All indexable routes — must match sitemap.xml
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
      const { html, helmetContext } = render(route);
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

      // Inject rendered HTML + page-specific head tags into the client build template
      const output = template
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
        .replace(/<title>[^<]*<\/title>/, '')
        .replace('</head>', `    ${helmetHead}\n  </head>`);

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
