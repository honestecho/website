// node capture.cjs <round>  — renders mock.html with copy-<round>.json → shot-<round>.png
// NODE_PATH = HE-Pursuit/dashboard/node_modules (Playwright is borrowed from there).
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  const round = process.argv[2];
  const dir = __dirname;
  const copy = JSON.parse(fs.readFileSync(path.join(dir, `copy-${round}.json`), 'utf8'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.addInitScript(c => { window.__COPY__ = c; }, copy);
  await page.goto('file:///' + path.join(dir, 'mock.html').replace(/\\/g, '/'));
  await page.waitForLoadState('networkidle');
  const box = await page.locator('#cards').boundingBox();
  await page.screenshot({ path: path.join(dir, `shot-${round}.png`), clip: box });
  await browser.close();
  console.log(`shot-${round}.png`, Math.round(box.width), 'x', Math.round(box.height));
})();
