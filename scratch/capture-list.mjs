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
  const box = await listSection.boundingBox();
  const rows = page.locator('ol li');
  const n = Math.min(await rows.count(), tag === 'desktop' ? 7 : 4);
  const last = n ? await rows.nth(n - 1).boundingBox() : null;
  const clipH = last ? Math.min(last.y + last.height - box.y + 24, 2600) : Math.min(box.height, 2600);
  await page.evaluate(y => window.scrollTo(0, y), Math.max(0, box.y - 8));
  await page.waitForTimeout(300);
  const box2 = await listSection.boundingBox();
  await page.screenshot({ path: join(out, `${tag}-list.png`), clip: { x: 0, y: Math.max(0, box2.y - 8), width: w, height: clipH }, fullPage: true });
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
