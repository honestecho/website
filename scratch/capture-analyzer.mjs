// Taste-loop capture for /tools/sam-gov-notice-analyzer/ at 1440 + 390.
// Usage: node scratch/capture-analyzer.mjs <baseUrl> <outDir>
// States: pre-result fold (example loaded) → click Analyze → result section,
// How-it-works, FAQ+CTA. Nav hidden for scrolled clips. Playwright from HE-Pursuit/dashboard.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const require = createRequire('C:/Users/aaron/OneDrive/Honest Echo LLC/Antigravity/HE-Pursuit/dashboard/package.json');
const { chromium } = require('playwright');

const [base = 'http://localhost:4173', out = 'scratch/shots-analyzer'] = process.argv.slice(2);
const PATH = '/tools/sam-gov-notice-analyzer/';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const errors = [];

async function shootSection(page, sec, path, w, maxH = 2600) {
  // Grow the viewport to the section, scroll it to the top, shoot the viewport
  // rect. fullPage clips re-lay out the page and dropped section content.
  const vh = page.viewportSize().height;
  let box = await sec.boundingBox();
  const want = Math.min(Math.ceil(box.height) + 24, maxH);
  await page.setViewportSize({ width: w, height: Math.max(vh, want) });
  await page.waitForTimeout(250);
  box = await sec.boundingBox();
  await page.evaluate(y => window.scrollTo(0, y), box.y + (await page.evaluate(() => window.scrollY)) - 8);
  await page.waitForTimeout(300);
  box = await sec.boundingBox();
  await page.screenshot({ path, clip: { x: 0, y: Math.max(0, box.y), width: w, height: Math.min(box.height + 8, maxH) } });
  await page.setViewportSize({ width: w, height: vh });
  await page.waitForTimeout(200);
}

for (const [w, h, tag] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push(`[${tag}] ${m.text()}`); });
  await page.goto(base + PATH, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);   // sample card arrives async
  await page.screenshot({ path: join(out, `${tag}-fold.png`) });

  await page.getByRole('button', { name: /^Analyze/ }).first().click();
  await page.getByText('Score against my business').first().waitFor({ timeout: 45000 }).catch(() => errors.push(`[${tag}] result did not render`));
  await page.waitForTimeout(800);
  await page.addStyleTag({ content: 'nav{visibility:hidden!important}' });

  const sections = page.locator('main > section, main section');
  const result = page.locator('section', { has: page.getByText('Score against my business') }).first();
  await shootSection(page, result, join(out, `${tag}-result.png`), w, 3200);
  const how = page.locator('section', { has: page.getByText("How the analyzer works") }).first();
  await shootSection(page, how, join(out, `${tag}-how.png`), w);
  if (tag === 'desktop') {
    const faq = page.locator('section', { has: page.getByText('Common questions') }).first();
    await shootSection(page, faq, join(out, `${tag}-faq.png`), w);
    const cta = page.locator('section', { has: page.getByText('See how this notice fits your business.') }).first();
    await shootSection(page, cta, join(out, `${tag}-cta.png`), w);
  }
  const text = await page.evaluate(() => document.body.innerText);
  writeFileSync(join(out, `${tag}-text.txt`), text);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log(`${tag}: sections=${await sections.count()} overflowX=${overflow} height=${await page.evaluate(() => document.body.scrollHeight)}`);
  await ctx.close();
}
await browser.close();
writeFileSync(join(out, 'console-errors.txt'), errors.join('\n'));
console.log(`console errors: ${errors.length}`);
