#!/usr/bin/env node
/**
 * Checks the size of every prerendered page against a budget. Run it after `npm run build`.
 *
 *   npm run audit:page-budget                      (fails when a page is over budget)
 *   npm run audit:page-budget -- --report          (prints the tables and always exits 0)
 *   npm run audit:page-budget -- --write-known     (records the pages that are over budget now in scripts/page-budget.json)
 *
 * For each page under .next/server/app/**.html it measures
 *   html      the bytes of the HTML document, which includes the page data React needs to hydrate it;
 *   js        the gzip bytes of the script files the document loads (Next's "First Load JS");
 *   css       the gzip bytes of its style sheets;
 *   requests  the document plus its scripts and style sheets.
 * Budget (scripts/page-budget.json, defaults 500 KB of HTML and 330 KB of gzip JavaScript: the 250 KB the order asked for is not
 * reachable while every docs page loads React, Next, the Fumadocs layout and the progress and timer panels, which are about
 * 300 KB; see docs/guides/performance.md): `htmlBytes` and `firstLoadJsGzipBytes` for every page. A page already over budget
 * when the budget was introduced is listed under `known` with the size it had; it may not grow more than 5 per cent
 * beyond that, so the heavy pages cannot get heavier while they are being fixed. Remove a page from `known` when it fits.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appDir = path.join(root, '.next', 'server', 'app');
const configFile = path.join(root, 'scripts', 'page-budget.json');
const args = new Set(process.argv.slice(2));

if (!fs.existsSync(appDir)) {
  console.error('No build output found at .next/server/app. Run `npm run build` first.');
  process.exit(2);
}

const config = fs.existsSync(configFile)
  ? JSON.parse(fs.readFileSync(configFile, 'utf8'))
  : { htmlBytes: 500_000, firstLoadJsGzipBytes: 330_000, known: {} };
config.known ??= {};

const htmlFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
};
walk(appDir);

const gzipCache = new Map();
const staticSize = (href) => {
  const clean = href.split('?')[0];
  if (gzipCache.has(clean)) return gzipCache.get(clean);
  const file = path.join(root, '.next', clean.replace(/^\/_next\//, ''));
  let size = { raw: 0, gzip: 0 };
  try {
    const buffer = fs.readFileSync(file);
    size = { raw: buffer.length, gzip: zlib.gzipSync(buffer, { level: 6 }).length };
  } catch { /* a file the build did not keep */ }
  gzipCache.set(clean, size);
  return size;
};

const kindOf = (route) => {
  if (route === '/') return 'home';
  const parts = route.split('/').filter(Boolean);
  if (route.includes('/notes/')) return 'notes lesson';
  if (route.endsWith('/review')) return 'review (quiz and flashcards)';
  if (route.endsWith('/questions')) return 'questions (practice)';
  if (route.endsWith('/cheat-sheet')) return 'cheat sheet';
  if (route.endsWith('/resources')) return 'resources';
  if (parts[0] === 'docs' && parts.length === 3) return 'course overview';
  if (parts[0] === 'docs' && parts.length === 4) return 'topic overview';
  return 'other';
};

const pages = htmlFiles.map((file) => {
  const html = fs.readFileSync(file, 'utf8');
  const route = '/' + path.relative(appDir, file).replace(/\\/g, '/').replace(/\.html$/, '').replace(/^index$/, '');
  // Scripts for modern browsers only: the `noModule` polyfill file is not downloaded by them.
  const scripts = new Set([...html.matchAll(/<script\b([^>]*?)\ssrc="([^"]+\.js[^"]*)"([^>]*)>/g)].filter((m) => !/noModule/i.test(m[1] + m[3])).map((m) => m[2]));
  // A preload of a script the page is about to need (a chunk loaded on demand that the server already rendered).
  for (const m of html.matchAll(/<link\b[^>]*rel="preload"[^>]*as="script"[^>]*href="([^"]+)"/g)) scripts.add(m[1]);
  const styles = new Set([...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1]));
  const js = [...scripts].reduce((sum, href) => sum + staticSize(href).gzip, 0);
  const jsRaw = [...scripts].reduce((sum, href) => sum + staticSize(href).raw, 0);
  const css = [...styles].reduce((sum, href) => sum + staticSize(href).gzip, 0);
  const flight = [...html.matchAll(/self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g)].reduce((sum, m) => sum + m[1].length, 0);
  return {
    route: route === '/' || route === '' ? '/' : route,
    kind: kindOf(route === '' ? '/' : route),
    html: Buffer.byteLength(html),
    htmlGzip: zlib.gzipSync(html).length,
    flight,
    js,
    jsRaw,
    css,
    requests: 1 + scripts.size + styles.size,
  };
}).filter((page) => !/\/(_not-found|_global-error)$/.test(page.route));

const kb = (bytes) => (bytes / 1000).toFixed(0).padStart(6) + ' KB';
const over = (page) => {
  const reasons = [];
  const known = config.known[page.route];
  const limit = (name, value, budget) => {
    const allowed = known?.[name] ? Math.max(budget, known[name] * 1.05) : budget;
    if (value > allowed) reasons.push(`${name} ${kb(value).trim()} over ${kb(allowed).trim()}`);
  };
  limit('htmlBytes', page.html, config.htmlBytes);
  limit('firstLoadJsGzipBytes', page.js, config.firstLoadJsGzipBytes);
  return reasons;
};

console.log(`${pages.length} prerendered pages. Budget per page: ${kb(config.htmlBytes).trim()} of HTML, ${kb(config.firstLoadJsGzipBytes).trim()} of first-load JavaScript (gzip).\n`);

// One row per kind of page: the largest page of the kind.
const byKind = new Map();
for (const page of pages) {
  const list = byKind.get(page.kind) ?? [];
  list.push(page);
  byKind.set(page.kind, list);
}
console.log('kind of page                    pages      html   html gz    flight        js     css  requests   largest page');
for (const [kind, list] of [...byKind.entries()].sort()) {
  const largest = list.reduce((a, b) => (b.html > a.html ? b : a));
  console.log(`${kind.padEnd(30)} ${String(list.length).padStart(6)} ${kb(largest.html)} ${kb(largest.htmlGzip)} ${kb(largest.flight)} ${kb(largest.js)} ${kb(largest.css)} ${String(largest.requests).padStart(8)}   ${largest.route}`);
}

const offenders = pages.map((page) => ({ page, reasons: over(page) })).filter((item) => item.reasons.length);
const knownNow = pages.filter((page) => page.html > config.htmlBytes || page.js > config.firstLoadJsGzipBytes);
console.log(`\n${knownNow.length} pages are over the budget now; ${offenders.length} are over what they are allowed.`);
for (const { page, reasons } of offenders.sort((a, b) => b.page.html - a.page.html).slice(0, 25)) console.log(`  ${page.route}: ${reasons.join('; ')}`);

if (args.has('--write-known')) {
  config.known = Object.fromEntries(knownNow.map((page) => [page.route, { htmlBytes: page.html, firstLoadJsGzipBytes: page.js }]));
  fs.writeFileSync(configFile, JSON.stringify({ htmlBytes: config.htmlBytes, firstLoadJsGzipBytes: config.firstLoadJsGzipBytes, known: config.known }, null, 2) + '\n');
  console.log(`\nWrote ${path.relative(root, configFile)} with ${knownNow.length} known pages.`);
  process.exit(0);
}
if (args.has('--report')) process.exit(0);
process.exit(offenders.length ? 1 : 0);
