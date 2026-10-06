#!/usr/bin/env node
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { createGuides } from '../features/courses/csi247/study-guides/guides.mjs';
import { document, VERSION } from '../features/courses/csi247/study-guides/document.mjs';
import { verifySimulations } from '../features/courses/csi247/study-guides/simulations.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = join(root, 'features', 'courses', 'csi247', 'study-guides');
const outputDir = join(root, 'public', 'files', 'sem3', 'csi247', 'study-guides');
const publicRoot = '/files/sem3/csi247/study-guides';
const pdfRequested = process.argv.includes('--pdf');
const verifyBrowser = process.argv.includes('--verify');
const auditOnly = process.argv.includes('--audit-only');
const guides = createGuides();
const [css, runtime] = await Promise.all([readFile(join(sourceDir, 'study-guide.css'), 'utf8'), readFile(join(sourceDir, 'runtime.js'), 'utf8')]);
let previousArtifacts = [];
try { previousArtifacts = JSON.parse(await readFile(join(outputDir, 'manifest.json'), 'utf8')).artifacts || []; } catch {}
console.log(verifySimulations());
await mkdir(outputDir, { recursive: true });

function auditHtml(html, guide) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${guide.id}: duplicate IDs`);
  for (const hash of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(hash[1]), `${guide.id}: missing hash ${hash[1]}`);
  assert(!/(?:src|href)="https?:|<link\b|<script[^>]+src=/i.test(html), `${guide.id}: external dependency`);
  assert(html.includes('@media print') && html.includes(':root[data-theme=dark]'), `${guide.id}: missing theme/print presentation`);
  assert(guide.sections.length >= 13, `${guide.id}: incomplete chapter sequence`);
  for (const id of ['definition', 'implementation', 'examples', 'properties', 'errors', 'practice', 'summary']) assert(ids.includes(id), `${guide.id}: missing ${id}`);
  assert((html.match(/class="worked"/g) || []).length >= 5, `${guide.id}: missing worked cases`);
  assert((html.match(/class="question"/g) || []).length >= 5, `${guide.id}: missing explained exam practice`);
  assert(html.includes('data-current') && html.includes('aria-current="step"'), `${guide.id}: trace synchronization absent`);
  new Function(runtime); // Verify the embedded offline runtime parses.
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
    const html = auditOnly ? await readFile(htmlPath, 'utf8') : document(guide, css, runtime);
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
        const printState = await page.evaluate(() => ({ background: getComputedStyle(document.body).backgroundColor, frames: getComputedStyle(document.querySelector('.frames')).display, table: getComputedStyle(document.querySelector('.full-trace .table-wrap')).display }));
        assert.equal(printState.background, 'rgb(255, 255, 255)', `${guide.id}: dark mode leaked into print`);
        assert.equal(printState.frames, 'none', `${guide.id}: selected frame leaked into print`);
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
