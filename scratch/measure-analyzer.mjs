// Measure the analyzer result grid at 1440 after Analyze.
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/aaron/OneDrive/Honest Echo LLC/Antigravity/HE-Pursuit/dashboard/package.json');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:4173';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + '/tools/sam-gov-notice-analyzer/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.getByRole('button', { name: /^Analyze/ }).first().click();
await page.getByText('Score Your Own Profile').first().waitFor({ timeout: 45000 });
await page.waitForTimeout(500);
const info = await page.evaluate(() => {
  const grid = [...document.querySelectorAll('section .grid')].find(g => g.className.includes('1.6fr'));
  const r = grid.getBoundingClientRect();
  const sec = grid.closest('section').getBoundingClientRect();
  return {
    cols: getComputedStyle(grid).gridTemplateColumns, gridW: Math.round(r.width), gridH: Math.round(r.height),
    secTop: Math.round(sec.top + scrollY), secH: Math.round(sec.height),
    kids: [...grid.children].map(c => { const b = c.getBoundingClientRect(); const inner = c.firstElementChild?.getBoundingClientRect(); return { x: Math.round(b.x), w: Math.round(b.width), h: Math.round(b.height), innerH: inner ? Math.round(inner.height) : null }; }),
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    wide: [...document.querySelectorAll('main *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 5).map(e => e.className.toString().slice(0, 80)),
  };
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
