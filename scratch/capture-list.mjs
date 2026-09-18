// Taste-loop capture for /government-contracts-for-bid/construction/ at 1440 + 390.
// Usage: node scratch/capture-list.mjs <baseUrl> <outDir>
// Shots: fold, list block (filters + first rows), explainer cards; plus innerText,
// overflow + console-error check. Playwright borrowed from HE-Pursuit/dashboard.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const require = createRequire('C:/Users/aaron/OneDrive/Honest Echo LLC/Antigravity/HE-Pursuit/dashboard/package.json');
const { chromium } = require('playwright');

const [base = 'http://localhost:4173', out = 'scratch/shots-list'] = process.argv.slice(2);
const PATH = '/government-contracts-for-bid/construction/';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const errors = [];
for (const [w, h, tag] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push(`[${tag}] ${m.text()}`); });
  await page.goto(base + PATH, { waitUntil: 'networkidle' });
  await page.waitForSelector('ol li', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(out, `${tag}-fold.png`) });
  // Scrolled clips: hide the fixed navbar so Codex does not review a header
  // overlaying the filters (home-harness lesson).
  await page.addStyleTag({ content: 'nav{visibility:hidden!important}' });
  // list block: the section holding filters + list, clipped to the first ~7 rows
  const listSection = page.locator('section').nth(1);
  const rows = page.locator('ol li');
  // Viewport-sized clip (fullPage clips drop content): grow the viewport to the
  // section, scroll it to the top, and clip in viewport coordinates.
  const box = await listSection.boundingBox();
  const clipH = Math.min(Math.ceil(box.height) + 24, 3200);
  await page.setViewportSize({ width: w, height: clipH });
  
  await listSection.scrollIntoViewIfNeeded();
  await page.evaluate(() => { const el = document.querySelectorAll('section')[1]; window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 8); });
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(out, `${tag}-list.png`) });
  await page.setViewportSize({ width: w, height: h });
  const cards = page.locator('section').nth(2);
  await cards.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await cards.screenshot({ path: join(out, `${tag}-cards.png`) });
  const text = await page.evaluate(() => document.body.innerText);
  writeFileSync(join(out, `${tag}-text.txt`), text);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  const total = await page.evaluate(() => document.body.scrollHeight);
  console.log(`${tag}: height=${total} overflowX=${overflow} rows=${await rows.count()}`);
  await ctx.close();
}
await browser.close();
writeFileSync(join(out, 'console-errors.txt'), errors.join('\n'));
console.log(`console errors: ${errors.length}`);
