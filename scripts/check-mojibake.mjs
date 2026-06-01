#!/usr/bin/env node
/* Guard against UTF-8 → Windows-1252 mojibake creeping back into source.
 * Scans text source for the tell-tale byte sequences a bad "save as ANSI" produces
 * (e.g. "â€”" for —, "â”€" for ─, "âœ•" for ✕, "Ã©" for é). Exits non-zero if found.
 * Wired as the `prebuild` npm script so `npm run build` — and every Cloudflare
 * Pages deploy — fails fast instead of silently shipping garbled text.
 *
 * NOTE: legitimate UTF-8 (—, →, ✕, é, …) is NOT flagged — only the mojibake bigrams.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOTS = ['src', 'index.html'];
const EXTS = new Set(['.tsx', '.ts', '.jsx', '.js', '.css', '.html', '.md', '.json']);

// High-signal mojibake markers. These sequences do not occur in correct UTF-8 text.
const PATTERNS = [
  /â€/, /â†/, /â”/, /â‚/, /âœ/, /â–/, /â‰/, /â€™/, /â€œ/,        // dashes/quotes/arrows/box/shapes/checks
  /Ã[-ÿ]/,   // Ã©, Ã¨, Ã¼, … (accented latin mojibake)
  /Â[ -¿]/,   // Â·, Â®, Â©, Â  (NBSP) …
  /�/,             // literal replacement character
];

function walk(p) {
  let out = [];
  const st = statSync(p);
  if (st.isDirectory()) {
    for (const n of readdirSync(p)) {
      if (n === 'node_modules' || n === 'dist' || n === '.git') continue;
      out = out.concat(walk(join(p, n)));
    }
  } else if (EXTS.has(extname(p))) {
    out.push(p);
  }
  return out;
}

const hits = [];
for (const root of ROOTS) {
  let files = [];
  try { files = walk(root); } catch { continue; }
  for (const f of files) {
    const lines = readFileSync(f, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      if (PATTERNS.some(re => re.test(line))) {
        hits.push(`${f}:${i + 1}: ${line.trim().slice(0, 120)}`);
      }
    });
  }
}

if (hits.length) {
  console.error(`\n✗ Mojibake detected (${hits.length} line(s)). Fix encoding before building:\n`);
  for (const h of hits.slice(0, 50)) console.error('  ' + h);
  if (hits.length > 50) console.error(`  …and ${hits.length - 50} more`);
  console.error('\nThese are UTF-8 chars mis-saved as Windows-1252. Re-type the intended glyph (—, →, ✕, ─, etc.) and save as UTF-8.\n');
  process.exit(1);
}
console.log('✓ No mojibake found.');
