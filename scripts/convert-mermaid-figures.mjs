#!/usr/bin/env node
/**
 * Replaces every `<Mermaid chart={`...`} caption="..." />` in a folder of lessons with an `<SvgFigure>` whose SVG is drawn
 * by scripts/lib/flow-svg.mjs and stored in content/figure-data (see lib/figure-data.ts). The figure follows the site theme
 * and needs no diagram library in the browser.
 *
 *   node scripts/convert-mermaid-figures.mjs content/docs/sem3/csi247            (report only)
 *   node scripts/convert-mermaid-figures.mjs content/docs/sem3/csi247 --write    (rewrite the pages and the figure data)
 *   node scripts/convert-mermaid-figures.mjs content/docs/sem3/csi247 --preview .tmp/diagrams.html
 */
import fs from 'node:fs';
import path from 'node:path';
import { drawFlow, parseFlowchart } from './lib/flow-svg.mjs';

const args = process.argv.slice(2);
const root = args.find((a) => !a.startsWith('--') && a !== args[args.indexOf('--preview') + 1]) ?? 'content/docs/sem3/csi247';
const write = args.includes('--write');
const previewPath = args.includes('--preview') ? args[args.indexOf('--preview') + 1] : null;

const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const mdxText = (s) => decode(s).replace(/[{}<>]/g, (c) => `\\${c}`);

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.mdx')) files.push(p);
  }
})(root);

const re = /<Mermaid\s+chart=\{`([\s\S]*?)`\}(?:\s+caption="([^"]*)")?\s*\/>/g;
const preview = [];
let converted = 0;
let failed = 0;

for (const file of files.sort()) {
  const text = fs.readFileSync(file, 'utf8');
  if (!text.includes('<Mermaid')) continue;
  const rel = path.relative('content/docs', file).replace(/\\/g, '/').replace(/\.mdx$/, '');
  const dataFile = path.join('content/figure-data', `${rel}.json`);
  const data = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, 'utf8')) : {};
  let n = 0;
  const next = text.replace(re, (whole, chart, caption) => {
    const id = `diagram-${++n}`;
    try {
      const spec = parseFlowchart(chart);
      spec.nodes.forEach((node) => {
        if (node.text) node.text = decode(node.text);
      });
      spec.edges.forEach((e) => {
        if (e.label) e.label = decode(e.label);
      });
      if (caption) spec.alt = decode(caption);
      let drawn = drawFlow(spec, id);
      // a long left-to-right chain is unreadable once it is scaled to the page: stand it upright instead
      if (spec.direction === 'LR' && drawn.width > 800) drawn = drawFlow({ ...spec, direction: 'TD' }, id);
      const { svg, alt, issues, width, height } = drawn;
      if (issues.length) console.log(`ISSUE ${rel} ${id}: ${issues.join('; ')}`);
      if (width > 900 || height > 900) console.log(`LARGE ${rel} ${id}: ${width} x ${height}`);
      data[id] = { alt, svg };
      preview.push({ file: rel, id, svg, caption: caption ?? '' });
      converted++;
      const body = caption ? `\n\n${mdxText(caption)}\n\n` : '\n\n';
      return `<SvgFigure src="${rel}" id="${id}">${body}</SvgFigure>`;
    } catch (error) {
      failed++;
      console.log(`FAILED ${rel} ${id}: ${error.message}`);
      return whole;
    }
  });
  if (write && next !== text) {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2) + '\n');
    fs.writeFileSync(file, next);
  }
}

if (previewPath) {
  const css = fs.readFileSync('app/styles/java-lessons.css', 'utf8');
  const tokens = fs.readFileSync('app/styles/tokens.css', 'utf8');
  const html = `<!doctype html><meta charset="utf-8"><title>Diagrams</title><style>${tokens}\n${css}\nbody{font-family:system-ui,sans-serif;background:var(--ui-bg);color:var(--ui-text);max-width:760px;margin:1rem auto;padding:0 1rem}h4{margin:1.6rem 0 .2rem;font-size:.8rem;color:var(--ui-text-2)}</style><body>${preview
    .map((p) => `<h4>${p.file} ${p.id}</h4><figure class="jf-figure"><div class="jf-figure-art">${p.svg}</div><figcaption>${p.caption}</figcaption></figure>`)
    .join('\n')}</body>`;
  fs.writeFileSync(previewPath, html);
}
console.log(`${converted} diagrams drawn${write ? ' and written' : ''}, ${failed} failed`);
process.exit(failed ? 1 : 0);
