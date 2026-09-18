// One-off production check for the list page: rows, scores, load timing, both click paths.
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/aaron/OneDrive/Honest Echo LLC/Antigravity/HE-Pursuit/dashboard/package.json');
const { chromium } = require('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 HE-internal-check HeadlessChrome' });
const page = await ctx.newPage();
const t0 = Date.now();
await page.goto('https://honestecho.com/government-contracts-for-bid/construction/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('ol.divide-y > li', { timeout: 20000 });
const listMs = Date.now() - t0;
const perf = await page.evaluate(() => ({ sinceNavMs: Math.round(performance.now()), listFetch: performance.getEntriesByType('resource').filter(r => r.name.includes('opportunities/list')).map(r => ({ start: Math.round(r.startTime), end: Math.round(r.responseEnd) })) }));
console.log(JSON.stringify(perf));
const info = await page.evaluate(() => {
  const li = [...document.querySelectorAll('ol.divide-y > li')];
  return { rows: li.length, row1: li[0].innerText.replace(/\n+/g, ' | '), status: [...document.querySelectorAll('p')].find(p => p.textContent.startsWith('Showing'))?.textContent.slice(0, 70) };
});
console.log(JSON.stringify({ listVisibleMs: listMs, ...info }));
const rowScore = (info.row1.match(/(\d+)\/100/) || [])[1];
await page.locator('ol.divide-y > li').first().getByText('See why').click();
await page.getByText(/Score: \d+ of \d+/).first().waitFor({ timeout: 30000 });
const an = await page.evaluate(() => ({ url: location.pathname + location.search, score: (document.body.innerText.match(/Score: [^\n]+/) || [])[0], persona: (() => { const s = document.getElementById('persona-select'); return s ? s.options[s.selectedIndex].text : null; })() }));
console.log(JSON.stringify({ rowScore, ...an }));
await page.goBack();
await page.waitForSelector('ol.divide-y > li');
await page.getByText('See how fit checking works').click();
await page.waitForTimeout(1200);
console.log(JSON.stringify({ calloutLandsOn: new URL(page.url()).pathname, h1: (await page.locator('h1').first().innerText()).slice(0, 70) }));
await browser.close();
