#!/usr/bin/env node
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import postcss from 'postcss';
import { createGuides } from '../features/courses/csi247/study-guides/guides.mjs';
import { document, VERSION } from '../features/courses/csi247/study-guides/document.mjs';
import { verifySimulations } from '../features/courses/csi247/study-guides/simulations.mjs';
import { algorithmOverview } from '../features/courses/csi247/study-guides/overviews.mjs';
import { getFullChapterMarkdown } from '../features/courses/csi247/study-guides/markdown.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = join(root, 'features', 'courses', 'csi247', 'study-guides');
const outputDir = join(root, 'public', 'files', 'sem3', 'csi247', 'study-guides');
const publicRoot = '/files/sem3/csi247/study-guides';
const pdfRequested = process.argv.includes('--pdf');
const verifyBrowser = process.argv.includes('--verify');
const auditOnly = process.argv.includes('--audit-only');
const readText = async path => (await readFile(path, 'utf8')).replace(/\r\n?/g, '\n');
const guides = createGuides();
const [referenceCss, overrides, runtime, siteTheme] = await Promise.all([
  readText(join(sourceDir, 'reference.css')),
  readText(join(sourceDir, 'study-guide-overrides.css')),
  readText(join(sourceDir, 'runtime.js')),
  readText(join(sourceDir, 'site-theme.css')),
]);
const css = `${referenceCss}\n${overrides}`;
// Scope the same editorial rules to the native website chapter. No reference
// selector can restyle navigation, another course, or the site's document root.
const siteCss = postcss.parse(css);
siteCss.walkAtRules('page', rule => rule.remove());
siteCss.walkRules(rule => {
  if (rule.parent.type === 'atrule' && /keyframes$/.test(rule.parent.name)) return;
  rule.selectors = rule.selectors.map(selector => {
    const mapped = selector.replace(/:root|\bhtml\b|\bbody\b/g, '.csi247-chapter').replace(/\bmain\b/g, '.chapter-content');
    if (rule.parent.type === 'rule') return mapped.replace(/^\.csi247-chapter/, '&');
    return mapped.startsWith('.csi247-chapter') ? mapped : `.csi247-chapter ${mapped}`;
  });
});
const nativeCss = `/* Generated from reference.css and study-guide-overrides.css. */\n${siteCss.toString()}\n.csi247-chapter{background:transparent;margin:0;min-width:0;font-size:1rem;--bar-h:3rem}\n.csi247-chapter::before{display:none}\n.csi247-chapter .chapter-content{max-width:none}\n.csi247-chapter .chapter-content>section{padding:2rem 0;margin:0;opacity:1;transform:none}\n.csi247-chapter h2{font-size:clamp(1.6rem,3vw,2.2rem)}\n.csi247-chapter h3{font-size:1.3rem}\n.csi247-chapter .map-pass h3{font-size:.95rem}\n.csi247-chapter.csi247-chapter{--paper:var(--color-fd-background);--paper-light:var(--color-fd-card);--paper-deep:var(--color-fd-muted);--ink:var(--color-fd-foreground);--muted:var(--color-fd-muted-foreground);--line:var(--color-fd-border)}\n@media print{.csi247-chapter.csi247-chapter{--paper:#fff;--paper-light:#fff;--paper-deep:#eee;--ink:#292722;--muted:#5f5a52;--line:#aaa}}\n`;
if (!auditOnly) await writeFile(join(sourceDir, 'native-chapter.css'), nativeCss + siteTheme);
else assert.equal(await readText(join(sourceDir, 'native-chapter.css')), nativeCss + siteTheme, 'Native chapter CSS is stale');
let previousArtifacts = [];
try { previousArtifacts = JSON.parse(await readFile(join(outputDir, 'manifest.json'), 'utf8')).artifacts || []; } catch {}
console.log(verifySimulations());
// Independent expected traces for the user's three visual examples. These catch
// boundary, no-swap and held-key mistakes that a final sorted-array check misses.
assert.deepEqual(algorithmOverview('binary').rows.map(row => row.slice(0, 5)), [
  [1, 0, 4, 9, 2], [2, 5, 7, 9, 6], [3, 8, 8, 9, 7],
]);
assert.deepEqual(algorithmOverview('selection').rows.map(row => row[2]), ['0 ↔ 3', '1 ↔ 3', '2 ↔ 8', '3 ↔ 7', '4 ↔ 6', 'No swap', '6 ↔ 7', 'No swap']);
assert.deepEqual(algorithmOverview('insertion').rows.map(row => row.slice(1, 4)), [[12, 1, 0], [59, 1, 1], [45, 2, 1], [72, 1, 3], [51, 3, 2]]);
const binaryMarkdown = getFullChapterMarkdown('/docs/sem3/csi247/sorting-and-searching/notes/binary-search');
assert(binaryMarkdown.includes('2 &lt; 7: discard indexes 0..4.'), 'Markdown lost a comparison condition');
assert(binaryMarkdown.includes('high = 9'), 'Markdown lost the final binary boundary');
console.log('Reference-image traces verified: 3 binary probes, 8 selection passes, 5 held insertion keys.');
await mkdir(outputDir, { recursive: true });

function auditHtml(html, guide) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${guide.id}: duplicate IDs`);
  for (const hash of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(hash[1]), `${guide.id}: missing hash ${hash[1]}`);
  assert(!/(?:src|href)="https?:|<link\b|<script[^>]+src=/i.test(html), `${guide.id}: external dependency`);
  assert(html.includes('@media print') && html.includes('data-theme="dark"'), `${guide.id}: missing theme/print presentation`);
  assert(guide.sections.length >= 9, `${guide.id}: incomplete chapter sequence`);
  assert(guide.sections.filter((item) => item.reference).length >= 4, `${guide.id}: reference chapter was not preserved`);
  assert(ids.some((id) => id.includes('interactive')), `${guide.id}: missing in-topic interactive extension`);
  assert(ids.includes('annotated-java'), `${guide.id}: missing annotated Java`);
  assert(ids.includes('expanded-exam-practice'), `${guide.id}: missing expanded exam practice`);
  assert((html.match(/class="worked"/g) || []).length >= 5, `${guide.id}: missing worked cases`);
  assert.equal(guide.sections[0].id, 'visual-map', `${guide.id}: visual map is not first`);
  assert((html.match(/class="quiz-question"/g) || []).length >= 12, `${guide.id}: topic quiz is too short`);
  assert((html.match(/class="question"/g) || []).length >= 5, `${guide.id}: missing explained exam practice`);
  assert(html.includes('data-current') && html.includes('aria-current="step"'), `${guide.id}: trace synchronization absent`);
  new Function(runtime.replace('export function initializeChapter', 'function initializeChapter'));
}

let browser;
if (pdfRequested || verifyBrowser) {
  try {
    const { chromium } = await import('@playwright/test');
    browser = await chromium.launch({ headless: true });
  } catch (error) {
    throw new Error(`Chromium is required for --pdf/--verify. Install with npx playwright install chromium. ${error.message}`);
  }
}
const artifacts = [];
try {
  for (const guide of guides) {
    const htmlPath = join(outputDir, guide.chapter, `${guide.slug}.html`), pdfPath = htmlPath.replace(/\.html$/, '.pdf');
    const html = auditOnly ? await readText(htmlPath) : document(guide, css, runtime);
    if (auditOnly) assert.equal(html, document(guide, css, runtime), `${guide.id}: generated HTML is stale; rerun the builder`);
    auditHtml(html, guide);
    if (!auditOnly) { await mkdir(dirname(htmlPath), { recursive: true }); await writeFile(htmlPath, html, 'utf8'); }
    if (browser) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      // Local files and inline assets only: external requests are rejected.
      await page.route(/^https?:/, (route) => route.abort());
      await page.goto(pathToFileURL(htmlPath).href);
      if (verifyBrowser) {
        for (const size of [{ width: 390, height: 844 }, { width: 1280, height: 900 }]) {
          await page.setViewportSize(size);
          for (const theme of ['light', 'dark']) {
            await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme);
            assert(!(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)), `${guide.id}: overflow at ${size.width} ${theme}`);
          }
        }
        const players = page.locator('[data-player]');
        await page.evaluate(() => document.querySelectorAll('details.lesson-detail').forEach(node => { node.open = true; }));
        for (let i = 0; i < await players.count(); i++) {
          const item = players.nth(i), count = await item.locator('[data-frame]').count();
          if (count > 1) {
            await item.locator('[data-action=next]').click();
            assert.equal(await item.locator('[data-frame="1"]').isVisible(), true, `${guide.id}: Next does not show second frame`);
            assert.equal(await item.locator('[data-row="1"]').getAttribute('aria-current'), 'step', `${guide.id}: Next does not select matching row`);
            assert((await item.locator('[data-current]').textContent()).includes('Current step 2:'), `${guide.id}: current row card is stale`);
            await item.locator('[data-action=reset]').click();
          }
        }
        await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
        await page.emulateMedia({ media: 'print' });
        const printState = await page.evaluate(() => ({ background: getComputedStyle(document.body).backgroundColor, frames: getComputedStyle(document.querySelector('.frames')).display, visibleFrames: [...document.querySelectorAll('[data-frame]')].filter((item) => getComputedStyle(item).display !== 'none').length, frameCount: document.querySelectorAll('[data-frame]').length, table: getComputedStyle(document.querySelector('.full-trace .table-wrap')).display }));
        assert.equal(printState.background, 'rgb(255, 255, 255)', `${guide.id}: dark mode leaked into print`);
        assert.notEqual(printState.frames, 'none', `${guide.id}: visual trace frames are missing from print`);
        assert.equal(printState.visibleFrames, printState.frameCount, `${guide.id}: print truncated interactive trace frames`);
        assert.notEqual(printState.table, 'none', `${guide.id}: full trace absent in print`);
        assert.deepEqual(errors, [], `${guide.id}: browser errors`);
      }
      if (pdfRequested) {
        await page.emulateMedia({ media: 'print' });
        await page.evaluate(() => document.querySelectorAll('details').forEach((node) => { node.open = true; }));
        await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: `<div style="font:8px Arial;color:#515666;width:100%;padding:0 14mm;display:flex;justify-content:space-between"><span>CSI247 · ${guide.title}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>` });
      }
      await page.close();
    }
    let pdfExists = false;
    try { pdfExists = (await stat(pdfPath)).size > 0; } catch {}
    const htmlSha256 = createHash('sha256').update(html).digest('hex');
    // A changed HTML-only build must never advertise an older PDF as current.
    const pdfCurrent = pdfExists && (pdfRequested || previousArtifacts.some((artifact) => artifact.id === guide.id && artifact.htmlSha256 === htmlSha256 && artifact.pdf));
    artifacts.push({ id: guide.id, title: guide.title, chapter: guide.chapter, sourceRoutes: guide.sourceRoutes, html: `${publicRoot}/${guide.id}.html`, pdf: pdfCurrent ? `${publicRoot}/${guide.id}.pdf` : null, htmlSha256, sections: guide.sections.length, status: pdfCurrent ? 'html-and-pdf' : 'print-ready-html' });
    console.log(`Verified ${guide.id}: ${guide.sections.length} sections${pdfExists ? ' + light PDF' : ''}`);
  }
} finally { await browser?.close(); }
const generatedManifest = {
  schemaVersion: 1,
  version: VERSION,
  course: 'CSI247',
  contentSource: 'features/courses/csi247/study-guides',
  pdfCommand: 'node scripts/build-csi247-study-guides.mjs --pdf --verify',
  artifacts,
};
if (auditOnly) {
  const checkedInManifest = JSON.parse(await readFile(join(outputDir, 'manifest.json'), 'utf8'));
  assert.deepEqual(checkedInManifest, generatedManifest, 'study-guide manifest or artifact hashes are stale; rerun the PDF builder');
} else {
  await writeFile(join(outputDir, 'manifest.json'), `${JSON.stringify(generatedManifest, null, 2)}\n`);
}
console.log(`Study-guide audit passed: ${artifacts.length} independent offline chapters. Output: ${relative(root, outputDir)}`);
