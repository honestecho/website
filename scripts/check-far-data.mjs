// Gate for src/content/far-overhaul.json. Runs in prebuild, so a bad weekly update
// fails the build and never deploys. Rules: every fact links to a .gov or .mil page,
// dates are real ISO dates or null (never guessed), and the ranked lists stay ranked.
import { readFileSync, readdirSync } from 'fs';

const file = new URL('../src/content/far-overhaul.json', import.meta.url);
const d = JSON.parse(readFileSync(file, 'utf8'));
const errors = [];
const fail = (msg) => errors.push(msg);

const ISO = /^\d{4}-\d{2}-\d{2}$/;
// Round-trip check: Date.parse would quietly turn 2026-02-30 into March 2.
const isDate = (v) => typeof v === 'string' && ISO.test(v) && !Number.isNaN(Date.parse(v)) && new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v;
const dateOrNull = (v, where) => { if (v !== null && v !== undefined && !isDate(v)) fail(`${where}: bad date "${v}"`); };
const url = (v, where, host = /(^|\.)[a-z0-9-]+\.(gov|mil)$/) => {
  let ok = false;
  try {
    const u = new URL(v);
    ok = u.protocol === 'https:' && !u.username && !u.password && host.test(u.hostname.toLowerCase()) && !/[\s<>"'`]/.test(v);
  } catch { /* not a URL */ }
  if (!ok) fail(`${where}: source must be an https .gov/.mil URL, got "${v}"`);
};
const text = (v, where) => { if (typeof v !== 'string' || !v.trim()) fail(`${where}: missing text`); };
const count = (v, where) => { if (!Number.isInteger(v) || v < 0) fail(`${where}: must be a whole number, got ${v}`); };

// Every string in the file: no markup (it lands in HTML and JSON-LD), and nothing personal
// or internal. The weekly run's context includes private notes, so this is the last fence
// before a public page.
const PRIVATE = /\b(shivar|aaron|mojo|zoe|dasn|shadow ?objects|halsted|net worth|living trust|honestecho\.com)\b|@[a-z0-9-]+\./i;
const walk = (v, path) => {
  if (typeof v === 'string') {
    if (/[<>]/.test(v)) fail(`${path}: "<" or ">" is not allowed in data`);
    const m = v.match(PRIVATE);
    if (m) fail(`${path}: private or internal term "${m[0]}" in public data`);
  } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, `${path}.${k}`));
};
walk(d, 'data');

const today = new Date().toISOString().slice(0, 10);
if (!isDate(d.verifiedOn)) fail('verifiedOn missing or not a date');
if (d.verifiedOn > today) fail(`verifiedOn ${d.verifiedOn} is in the future`);
if (!isDate(d.nextCheck) || d.nextCheck <= d.verifiedOn) fail('nextCheck must be a date after verifiedOn');

for (const [k, l] of Object.entries(d.layers || {})) url(l.sourceUrl, `layers.${k}`);
if (Object.keys(d.layers || {}).length !== 4) fail('layers must have exactly 4 entries');
url(d.adoptionRule?.sourceUrl, 'adoptionRule');

const ranked = (list, name, fields) => {
  if (!Array.isArray(list) || list.length !== 10) return fail(`${name}: need exactly 10, got ${list?.length}`);
  if (list.some((x) => !Number.isInteger(x.rank))) fail(`${name}: ranks must be integers`);
  const ranks = list.map((x) => x.rank).sort((a, b) => a - b).join(',');
  if (ranks !== '1,2,3,4,5,6,7,8,9,10') fail(`${name}: ranks must be 1-10 once each`);
  list.forEach((x, i) => { fields.forEach((f) => text(x[f], `${name}[${i}].${f}`)); url(x.sourceUrl, `${name}[${i}]`); });
};
ranked(d.impacts, 'impacts', ['title', 'whatChanged', 'whoItHits', 'doNow']);
ranked(d.trends, 'trends', ['title', 'evidence']);
const FOCUS = new Set(['small-business', 'commercial', 'services', 'construction', 'tech']);
d.impacts?.forEach((x, i) => {
  if (!x.focus?.length || x.focus.some((f) => !FOCUS.has(f))) fail(`impacts[${i}].focus invalid`);
  if (x.farParts?.some((n) => !Number.isInteger(n) || n < 1 || n > 53)) fail(`impacts[${i}].farParts out of range`);
});

const STATUS = new Set(['final-rule', 'proposed-rule', 'model-text', 'reserved']);
if (d.parts?.length !== 53) fail(`parts: need 53, got ${d.parts?.length}`);
const seen = new Set();
d.parts?.forEach((p, i) => {
  if (seen.has(p.part)) fail(`parts: duplicate Part ${p.part}`);
  seen.add(p.part);
  if (!STATUS.has(p.status)) fail(`parts[${i}].status "${p.status}"`);
  text(p.title, `parts[${i}].title`);
  ['modelText', 'modelTextUpdated', 'proposedRule', 'commentsClosed', 'nextStepDate', 'finalRule', 'finalRuleEffective'].forEach((f) => dateOrNull(p[f], `Part ${p.part}.${f}`));
  if (p.status === 'proposed-rule' && !p.proposedRule) fail(`Part ${p.part}: proposed-rule status needs a proposedRule date`);
  if (p.status === 'final-rule' && (!p.finalRule || !p.finalRuleUrl)) fail(`Part ${p.part}: final-rule status needs finalRule date and finalRuleUrl`);
  if (p.proposedRuleUrl) url(p.proposedRuleUrl, `Part ${p.part}.proposedRuleUrl`);
  if (p.finalRuleUrl) url(p.finalRuleUrl, `Part ${p.part}.finalRuleUrl`, /^www\.federalregister\.gov$/);
  if (p.finalRuleEffective && !p.finalRule) fail(`Part ${p.part}: finalRuleEffective without finalRule`);
  url(p.sourceUrl, `Part ${p.part}`);
});

if (!Array.isArray(d.agencies) || d.agencies.length < 1) fail('agencies missing');
d.agencies?.forEach((a, i) => {
  text(a.name, `agencies[${i}].name`); text(a.short, `agencies[${i}].short`);
  if (a.parts.some((n) => !Number.isInteger(n) || n < 1 || n > 53)) fail(`agencies[${i}].parts out of range`);
});
url(d.dfars?.sourceUrl, 'dfars');
Object.entries(d.dfars?.byPart || {}).forEach(([k, v]) => {
  if (!/^\d+$/.test(k) || +k < 1 || +k > 53) fail(`dfars.byPart key "${k}" is not a FAR part`);
  text(v.deviation, `dfars.byPart.${k}.deviation`); dateOrNull(v.effective, `dfars.byPart.${k}.effective`); url(v.url, `dfars.byPart.${k}`);
});
const cov = d.adoptionCoverage;
if (!cov || !Array.isArray(cov.untrackedParts) || cov.untrackedParts.some((n) => !Number.isInteger(n) || n < 1 || n > 53)) fail('adoptionCoverage.untrackedParts invalid');
url(cov?.sourceUrl, 'adoptionCoverage');
const LANES = new Set(['model', 'rulemaking', 'final', null]);
d.phases?.forEach((x, i) => {
  if (!LANES.has(x.lane ?? null)) fail(`phases[${i}].lane "${x.lane}"`);
  if (x.lane && !x.short) fail(`phases[${i}]: a laned phase needs a short label`);
});

if (!d.thisWeek?.length || d.thisWeek.length > 5) fail('thisWeek: need 1-5 entries');
d.thisWeek?.forEach((x, i) => {
  dateOrNull(x.date, `thisWeek[${i}].date`);
  ['title', 'whatChanged', 'meaning'].forEach((f) => text(x[f], `thisWeek[${i}].${f}`));
  url(x.sourceUrl, `thisWeek[${i}]`);
});
d.upcoming?.forEach((x, i) => { dateOrNull(x.date, `upcoming[${i}].date`); text(x.what, `upcoming[${i}].what`); url(x.sourceUrl, `upcoming[${i}]`); });
d.phases?.forEach((x, i) => { ['date', 'endDate', 'commentsClosed'].forEach((f) => dateOrNull(x[f], `phases[${i}].${f}`)); url(x.sourceUrl, `phases[${i}]`); });
d.metrics?.forEach((x, i) => { dateOrNull(x.date, `metrics[${i}].date`); url(x.sourceUrl, `metrics[${i}]`); });
d.changelog?.forEach((c, i) => { dateOrNull(c.date, `changelog[${i}].date`); c.entries.forEach((e, j) => { text(e.text, `changelog[${i}][${j}]`); url(e.sourceUrl, `changelog[${i}][${j}]`); }); });
if (d.changelog?.[0]?.date && d.changelog[0].date > d.verifiedOn) fail('changelog: newest entry is after verifiedOn');
d.faq?.forEach((f, i) => { text(f.q, `faq[${i}].q`); text(f.a, `faq[${i}].a`); });
d.sources?.forEach((s, i) => url(s.url, `sources[${i}]`));

// Part numbers are exactly 1-53, and the headline counts must agree with the records.
if ((d.parts || []).some((p) => !Number.isInteger(p.part))) fail('parts: part numbers must be integers');
if ((d.parts || []).map((p) => p.part).sort((a, b) => a - b).join(',') !== Array.from({ length: 53 }, (_, i) => i + 1).join(',')) fail('parts: must be Parts 1-53, once each');
['faq', 'impacts', 'trends', 'parts', 'agencies', 'phases', 'upcoming', 'thisWeek', 'changelog', 'sources'].forEach((k) => { if (!Array.isArray(d[k])) fail(`${k}: required list missing`); });
const L = d.layers || {};
const live = (d.parts || []).filter((p) => p.status !== 'reserved');
[['modelText.parts', L.modelText?.parts], ['modelText.of', L.modelText?.of], ['agencyAdoption.agencies', L.agencyAdoption?.agencies], ['proposedRules.published', L.proposedRules?.published], ['proposedRules.planned', L.proposedRules?.planned], ['proposedRules.parts', L.proposedRules?.parts], ['proposedRules.openComments', L.proposedRules?.openComments], ['finalRules.published', L.finalRules?.published]].forEach(([k, v]) => count(v, `layers.${k}`));
if (L.modelText?.of !== live.length) fail(`layers.modelText.of ${L.modelText?.of} != ${live.length} non-reserved parts`);
if (L.modelText?.parts !== live.filter((p) => p.modelText).length) fail('layers.modelText.parts disagrees with parts[].modelText');
if (L.agencyAdoption?.agencies !== d.agencies?.length) fail('layers.agencyAdoption.agencies disagrees with agencies[]');
if (L.proposedRules?.parts !== live.filter((p) => p.proposedRule).length) fail('layers.proposedRules.parts disagrees with parts[].proposedRule');
if (L.proposedRules?.published > L.proposedRules?.planned) fail('layers.proposedRules: published exceeds planned');
const finals = live.filter((p) => p.status === 'final-rule').length;
if ((finals > 0) !== (L.finalRules?.published > 0)) fail('layers.finalRules.published disagrees with final-rule parts');
// A final rule covers at least one part, so there can't be more rules than final-rule parts.
if (L.finalRules?.published > finals) fail(`layers.finalRules.published ${L.finalRules?.published} exceeds ${finals} final-rule parts`);

const banned = /\b(TBD|lorem|illustrative|placeholder|estimated date)\b/i;
const raw = readFileSync(file, 'utf8');
const hit = raw.match(banned);
if (hit) fail(`banned word in data: "${hit[0]}"`);

// ── Deep-dive files, one per FAR part (src/content/far-parts/part-N.json) ──────
// Same rules: every source .gov/.mil, real dates, no markup, nothing private.
const TYPES = new Set(['removed', 'narrowed', 'expanded', 'moved-to-guidance', 'unchanged-but-reworded', 'new']);
const partsDir = new URL('../src/content/far-parts/', import.meta.url);
let partFiles = [];
try { partFiles = readdirSync(partsDir).filter((f) => f.endsWith('.json')); } catch { /* no deep dives yet */ }
for (const f of partFiles) {
  const at = (s) => `${f}: ${s}`;
  const m = f.match(/^part-(\d+)\.json$/);
  if (!m) { fail(at('file name must be part-N.json')); continue; }
  const rawP = readFileSync(new URL(f, partsDir), 'utf8');
  const p = JSON.parse(rawP);
  walk(p, f);
  const bw = rawP.match(banned);
  if (bw) fail(at(`banned word "${bw[0]}"`));
  if (p.part !== +m[1]) fail(at(`part ${p.part} does not match the file name`));
  if (!d.parts?.some((x) => x.part === p.part && x.status !== 'reserved')) fail(at('part is not a live part in far-overhaul.json'));
  if (!isDate(p.comparedOn) || p.comparedOn > today) fail(at('comparedOn must be a real date, not in the future'));
  ['title', 'headline', 'subhead', 'description'].forEach((k) => text(p[k], at(k)));
  if (!Array.isArray(p.shortVersion) || p.shortVersion.length < 1 || p.shortVersion.length > 5) fail(at('shortVersion: 1-5 lines'));
  p.shortVersion?.forEach((s, i) => text(s, at(`shortVersion[${i}]`)));
  dateOrNull(p.codified?.effective, at('codified.effective')); url(p.codified?.sourceUrl, at('codified'));
  p.modelTextUpdates?.forEach((u, i) => { dateOrNull(u.date, at(`modelTextUpdates[${i}].date`)); text(u.what, at(`modelTextUpdates[${i}].what`)); url(u.sourceUrl, at(`modelTextUpdates[${i}]`)); });
  if (p.dod) { text(p.dod.deviation, at('dod.deviation')); ['signed', 'effective', 'revisionDate'].forEach((k) => dateOrNull(p.dod[k], at(`dod.${k}`))); url(p.dod.sourceUrl, at('dod')); }
  if (!Array.isArray(p.changes) || p.changes.length < 1 || p.changes.length > 30) fail(at('changes: 1-30'));
  const ids = new Set();
  p.changes?.forEach((c, i) => {
    const w = at(`changes[${i}]`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.id || '') || ids.has(c.id)) fail(`${w}: id missing, malformed or duplicate`);
    ids.add(c.id);
    ['topic', 'subpart', 'before', 'after', 'whatItMeans', 'whoItHits'].forEach((k) => text(c[k], `${w}.${k}`));
    if (!TYPES.has(c.changeType)) fail(`${w}: changeType "${c.changeType}"`);
    if (!['high', 'medium', 'low'].includes(c.confidence)) fail(`${w}: confidence "${c.confidence}"`);
    if (!c.sourceUrls?.length) fail(`${w}: needs sources`);
    c.sourceUrls?.forEach((s, j) => url(s, `${w}.sourceUrls[${j}]`));
  });
  p.unchanged?.forEach((u, i) => { ['topic', 'detail'].forEach((k) => text(u[k], at(`unchanged[${i}].${k}`))); u.sourceUrls?.forEach((s, j) => url(s, at(`unchanged[${i}].sourceUrls[${j}]`))); });
  p.actions?.forEach((a, i) => { text(a.action, at(`actions[${i}]`)); if (!ids.has(a.changeId)) fail(at(`actions[${i}] points at unknown change "${a.changeId}"`)); });
  p.agencyDates?.forEach((a, i) => {
    ['agency', 'short'].forEach((k) => text(a[k], at(`agencyDates[${i}].${k}`)));
    if (!isDate(a.date) || a.date > today) fail(at(`agencyDates[${i}].date "${a.date}"`));
    if (!['effective', 'signature', 'first date in memo'].includes(a.basis)) fail(at(`agencyDates[${i}].basis "${a.basis}"`));
    url(a.sourceUrl, at(`agencyDates[${i}]`));
  });
  p.faq?.forEach((q, i) => { text(q.q, at(`faq[${i}].q`)); text(q.a, at(`faq[${i}].a`)); });
  p.sources?.forEach((s, i) => url(s.url, at(`sources[${i}]`)));
}

if (errors.length) {
  console.error(`far-overhaul.json failed ${errors.length} check(s):\n  - ${errors.join('\n  - ')}`);
  process.exit(1);
}
console.log(`far-overhaul.json OK (verified ${d.verifiedOn}, ${d.parts.length} parts, ${d.agencies.length} agencies; deep dives: ${partFiles.join(', ') || 'none'})`);
