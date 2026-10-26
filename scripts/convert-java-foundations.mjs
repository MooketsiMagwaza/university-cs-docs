#!/usr/bin/env node
/**
 * Converts the "Java Foundations" reference course (one self-contained HTML file with 40 pages) into MDX lessons
 * for CSI247, using the site's component vocabulary (docs/content-standard.md section 2.3).
 *
 *   node scripts/convert-java-foundations.mjs <java-foundations.html> [outDir] [--only id,id]
 *
 * Output (default outDir `.tmp/jf`):
 *   lessons/<chapter>/<slug>.mdx    one lesson per reference page (frontmatter, objectives, sections, check questions)
 *   reference/<id>.mdx              the cheat sheet, glossary and appendices (to be split by hand)
 *   figures/<chapter>/<slug>.json   the SVG of every figure, keyed by figure id (rendered by <SvgFigure />)
 *   report.json                     what was converted, with warnings
 *
 * The reference draws four figures with JavaScript at load time; this script runs that code against a small DOM
 * stand-in so the SVG is stored as data. Sorting and searching animations map onto the site's existing story
 * components, and the memory-diagram steppers map onto <MemoryDiagram /> (lib/csi247/memory-scenarios.ts).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fromHtml } from 'hast-util-from-html';
import { toHtml } from 'hast-util-to-html';

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const flag = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : null;
};
const inputPath = args[0];
const outDir = path.resolve(args[1] ?? '.tmp/jf');
const only = flag('only') ? new Set(flag('only').split(',')) : null;
if (!inputPath) {
  console.error('Usage: node scripts/convert-java-foundations.mjs <java-foundations.html> [outDir] [--only id,id]');
  process.exit(2);
}

const COURSE_URL = '/docs/sem3/csi247';

/** Reference page id -> where its lesson lives. The slug is the final URL slug (an existing lesson keeps its slug). */
const PAGES = {
  'how-java-runs': ['01-java-fundamentals', 'how-a-java-program-runs'],
  variables: ['01-java-fundamentals', 'variables-types-and-operators'],
  'control-flow': ['01-java-fundamentals', 'decisions-and-loops'],
  'arrays-methods': ['01-java-fundamentals', 'arrays-and-methods'],
  'oop-intro': ['06-object-oriented-programming', 'what-is-oop'],
  'classes-objects': ['06-object-oriented-programming', 'classes-and-objects'],
  'memory-diagrams': ['06-object-oriented-programming', 'drawing-memory-diagrams'],
  encapsulation: ['06-object-oriented-programming', 'encapsulation'],
  inheritance: ['06-object-oriented-programming', 'inheritance-and-super'],
  polymorphism: ['06-object-oriented-programming', 'overriding-and-polymorphism'],
  'object-class': ['06-object-oriented-programming', 'object-class-casting-and-wrappers'],
  abstraction: ['06-object-oriented-programming', 'abstract-classes-and-interfaces'],
  composition: ['06-object-oriented-programming', 'composition'],
  'shape-case-study': ['06-object-oriented-programming', 'shapes-case-study-and-uml'],
  'big-o': ['03-time-complexity', 'algorithm-analysis'],
  'counting-steps': ['03-time-complexity', 'counting-steps'],
  recursion: ['02-recursion', 'recursion-in-java'],
  'trace-tables': ['02-recursion', 'trace-tables'],
  'linear-search': ['04-sorting-and-searching', 'linear-search'],
  'binary-search': ['04-sorting-and-searching', 'binary-search'],
  'search-library': ['04-sorting-and-searching', 'searching-with-the-java-library'],
  'search-drill': ['04-sorting-and-searching', 'searching-exam-drill'],
  'sort-basics': ['04-sorting-and-searching', 'sorting-fundamentals'],
  bubble: ['04-sorting-and-searching', 'bubble-sort'],
  selection: ['04-sorting-and-searching', 'selection-sort'],
  insertion: ['04-sorting-and-searching', 'insertion-sort'],
  merge: ['04-sorting-and-searching', 'merge-sort'],
  quick: ['04-sorting-and-searching', 'quick-sort'],
  comparable: ['04-sorting-and-searching', 'comparable-and-comparator'],
  'sort-drill': ['04-sorting-and-searching', 'sorting-exam-drill'],
  packages: ['05-packages', 'packages-explained'],
  generics: ['07-generics', 'generics-explained'],
  collections: ['08-collections', 'collections-and-iterators'],
  arraylist: ['08-collections', 'lists-and-arraylist'],
  'linked-lists': ['09-linked-lists-traversals', 'linked-lists-explained'],
  'stacks-queues': ['10-stacks-and-queues', 'stacks-and-queues-explained'],
};
const REFERENCE_PAGES = new Set(['cheat', 'glossary', 'appendix']);

/** Pages whose existing CSI247 lesson is deeper than the reference: converted into `skipped/` and not used. */
const SKIPPED = new Set(['linear-search', 'binary-search', 'insertion', 'merge', 'packages', 'generics']);
/** Where a link to a skipped page goes instead. */
const LINK_TO = {
  packages: ['05-packages', 'built-in-packages-and-imports'],
  generics: ['07-generics', 'why-generics'],
};
const urlOf = (id) => {
  const hit = LINK_TO[id] ?? PAGES[id];
  return hit ? `${COURSE_URL}/${hit[0]}/notes/${hit[1]}` : null;
};

/* ───────── generated figures: run the reference's own drawing code against a tiny DOM stand-in ───────── */

class FakeEl {
  constructor(tag) {
    this.tag = tag;
    this.attrs = {};
    this.kids = [];
  }
  setAttribute(k, v) {
    this.attrs[k] = v;
  }
  appendChild(c) {
    this.kids.push(c);
    return c;
  }
  set textContent(t) {
    this.kids = [String(t)];
  }
  html() {
    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const attrs = Object.entries(this.attrs)
      .map(([k, v]) => ` ${k}="${String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`)
      .join('');
    return `<${this.tag}${attrs}>${this.kids.map((c) => (typeof c === 'string' ? esc(c) : c.html())).join('')}</${this.tag}>`;
  }
  inner() {
    return this.kids.map((c) => (typeof c === 'string' ? c : c.html())).join('');
  }
}

function generatedFigures(source) {
  const start = source.indexOf("const NS='http://www.w3.org/2000/svg';");
  const end = source.indexOf('/* ───────── sorting visualiser');
  if (start < 0 || end < 0) return {};
  const ids = ['growthCurves', 'stab', 'mergeTree', 'partFig'];
  const roots = Object.fromEntries(ids.map((id) => [id, new FakeEl('svg')]));
  const document = {
    getElementById: (id) => roots[id] ?? null,
    createElementNS: (_ns, tag) => new FakeEl(tag),
  };
  new Function('document', source.slice(start, end))(document);
  return Object.fromEntries(ids.map((id) => [id, roots[id].inner()]));
}

/* ───────── small helpers ───────── */

const slugger = (text) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
    .replace(/ /g, '-');
/** Removes anything that looks like a tag, repeating until none is left, so `<<b>b>` cannot leave a tag behind. */
const stripTags = (s) => {
  let previous;
  do {
    previous = s;
    s = s.replace(/<[^>]*>/g, '');
  } while (s !== previous);
  return s;
};
const refSlug = (s) =>
  stripTags(s.toLowerCase())
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);

const isEl = (n, tag) => n && n.type === 'element' && (!tag || n.tagName === tag);
const cls = (n) => (n?.properties?.className ?? []).map(String);
const hasCls = (n, c) => isEl(n) && cls(n).includes(c);
const kids = (n) => n.children ?? [];
const textOf = (n) => (n.type === 'text' ? n.value : kids(n).map(textOf).join(''));
const find = (n, pred) => {
  if (pred(n)) return n;
  for (const c of kids(n)) {
    const hit = find(c, pred);
    if (hit) return hit;
  }
  return null;
};
const findAll = (n, pred, out = []) => {
  if (pred(n)) out.push(n);
  kids(n).forEach((c) => findAll(c, pred, out));
  return out;
};
const prop = (n, name) => n.properties?.[name];

const INLINE_TAGS = new Set(['code', 'em', 'i', 'strong', 'b', 'a', 'span', 'br', 'kbd', 'sup', 'sub', 'small', 's', 'u', 'n']);
const isInlineNode = (n) => n.type === 'text' || (isEl(n) && INLINE_TAGS.has(n.tagName));

const report = { pages: {}, warnings: [] };
let current = null;
const warn = (msg) => {
  report.warnings.push(`${current ?? '-'}: ${msg}`);
};

const ENTITY_FIXES = [
  [/✓/g, 'Yes'],
  [/✗/g, 'No'],
];
const noMarks = (s) => ENTITY_FIXES.reduce((acc, [re, to]) => acc.replace(re, to), s);

/* ───────── headings and links ───────── */

/** heading ids the reference generates (page id + slug of the heading) -> { page, slug } */
const headingIndex = new Map();

function resolveHref(href) {
  if (!href) return null;
  if (/^(https?:|mailto:)/.test(href)) return href;
  if (!href.startsWith('#')) return href;
  const id = href.slice(1);
  if (PAGES[id]) return urlOf(id);
  if (id === 'home') return COURSE_URL;
  if (REFERENCE_PAGES.has(id)) return `${COURSE_URL}/resources`;
  const heading = headingIndex.get(id);
  if (heading) {
    const base = urlOf(heading.page);
    if (base) return `${base}#${heading.slug}`;
    return `${COURSE_URL}/resources#${heading.slug}`;
  }
  warn(`unresolved link ${href}`);
  return null;
}

/* ───────── inline conversion ───────── */

function escText(s, o = {}) {
  let t = noMarks(s).replace(/\s+/g, ' ');
  t = t.replace(/\\/g, '\\\\').replace(/([*_`\[\]{}<>$~])/g, '\\$1');
  t = t.replace(/&(?=[A-Za-z#])/g, '&amp;');
  if (o.cell) t = t.replace(/\|/g, '\\|');
  return t;
}
const escJsx = (s) =>
  noMarks(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');

function codeSpan(text, o = {}) {
  let t = noMarks(text).replace(/\s*\n\s*/g, ' ');
  if (!t) return '';
  // In a table cell a pipe ends the cell and a backslash before it is ambiguous, so write such code as HTML.
  if (o.cell && /[|\\]/.test(t)) return `<code>${escJsx(t).replace(/\|/g, '&#124;')}</code>`;
  const max = Math.max(0, ...(t.match(/`+/g) ?? []).map((r) => r.length));
  const fence = '`'.repeat(max + 1);
  const pad = t.startsWith('`') || t.endsWith('`') ? ' ' : '';
  return `${fence}${pad}${t}${pad}${fence}`;
}

function wrapMark(mark, inner) {
  const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(inner);
  if (!m[2]) return inner;
  return `${m[1]}${mark}${m[2]}${mark}${m[3]}`;
}

function inl(nodes, o = {}) {
  let out = '';
  for (const n of nodes) {
    if (n.type === 'text') out += escText(n.value, o);
    else if (isEl(n)) out += inlEl(n, o);
  }
  return out;
}

function inlEl(n, o) {
  switch (n.tagName) {
    case 'code':
      return codeSpan(textOf(n), o);
    case 'em':
    case 'i':
      return wrapMark('*', inl(kids(n), o));
    case 'strong':
    case 'b':
      return wrapMark('**', inl(kids(n), o));
    case 's':
      return wrapMark('~~', inl(kids(n), o));
    case 'a': {
      const text = inl(kids(n), o);
      const url = resolveHref(prop(n, 'href'));
      return url ? `[${text}](${url})` : text;
    }
    case 'br':
      return '<br />';
    case 'kbd':
      return `<kbd>${escJsx(textOf(n))}</kbd>`;
    case 'sup':
    case 'sub':
      return `<${n.tagName}>${escJsx(textOf(n))}</${n.tagName}>`;
    default:
      return inl(kids(n), o);
  }
}

/** Inline content as JSX-safe HTML, for attributes and table fallbacks. */
function jsxInline(nodes) {
  let out = '';
  for (const n of nodes) {
    if (n.type === 'text') out += escJsx(n.value.replace(/\s+/g, ' '));
    else if (isEl(n)) {
      switch (n.tagName) {
        case 'code':
          out += `<code>${escJsx(textOf(n))}</code>`;
          break;
        case 'em':
        case 'i':
          out += `<em>${jsxInline(kids(n))}</em>`;
          break;
        case 'strong':
        case 'b':
          out += `<strong>${jsxInline(kids(n))}</strong>`;
          break;
        case 'br':
          out += '<br />';
          break;
        case 'kbd':
        case 'sup':
        case 'sub':
          out += `<${n.tagName}>${escJsx(textOf(n))}</${n.tagName}>`;
          break;
        case 'a': {
          const url = resolveHref(prop(n, 'href'));
          out += url ? `<a href="${url}">${jsxInline(kids(n))}</a>` : jsxInline(kids(n));
          break;
        }
        default:
          out += jsxInline(kids(n));
      }
    }
  }
  return out;
}

const attrString = (s) => (/[\"{}<>&\n]/.test(s) ? `{${JSON.stringify(s)}}` : `"${s}"`);

/* ───────── block conversion ───────── */

const FENCE_LANG = { out: 'text' };

function dedent(t) {
  t = t.replace(/^\s*\n/, '').replace(/\s+$/, '');
  const lines = t.split('\n');
  const indents = lines.filter((l) => l.trim()).map((l) => /^ */.exec(l)[0].length);
  const ind = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(ind)).join('\n');
}

function fence(code, lang, meta = '') {
  const runs = code.match(/^`{3,}/gm) ?? [];
  const n = Math.max(3, ...runs.map((r) => r.length + 1));
  const f = '`'.repeat(n);
  return `${f}${lang}${meta ? ' ' + meta : ''}\n${code}\n${f}`;
}

function onlyInline(cell) {
  return kids(cell).every(isInlineNode);
}

function rawJsx(n) {
  if (n.type === 'text') return escJsx(n.value.replace(/\s+/g, ' '));
  if (!isEl(n)) return '';
  const tag = n.tagName;
  if (tag === 'br') return '<br />';
  if (['td', 'th'].includes(tag)) {
    const a = [];
    if (n.properties.colSpan) a.push(`colSpan={${n.properties.colSpan}}`);
    if (n.properties.rowSpan) a.push(`rowSpan={${n.properties.rowSpan}}`);
    return `<${tag}${a.length ? ' ' + a.join(' ') : ''}>${kids(n).map(rawJsx).join('')}</${tag}>`;
  }
  const allowed = new Set(['table', 'thead', 'tbody', 'tr', 'ul', 'ol', 'li', 'p', 'code', 'em', 'strong', 'b', 'i', 'kbd', 'sup', 'sub']);
  if (tag === 'b') return `<strong>${kids(n).map(rawJsx).join('')}</strong>`;
  if (tag === 'i') return `<em>${kids(n).map(rawJsx).join('')}</em>`;
  if (tag === 'code') return `<code>${escJsx(textOf(n))}</code>`;
  if (!allowed.has(tag)) return kids(n).map(rawJsx).join('');
  return `<${tag}>${kids(n).map(rawJsx).join('')}</${tag}>`;
}

function tableBlock(wrapper, table) {
  const rows = findAll(table, (n) => isEl(n, 'tr'));
  const cellsOf = (tr) => kids(tr).filter((c) => isEl(c, 'td') || isEl(c, 'th'));
  const simple = rows.every((tr) => cellsOf(tr).every((c) => !c.properties.rowSpan && !c.properties.colSpan && onlyInline(c)));
  let md;
  if (!simple || !rows.length) {
    md = `<table>${rows.length ? '' : kids(table).map(rawJsx).join('')}${rows.map((tr) => `<tr>${cellsOf(tr).map(rawJsx).join('')}</tr>`).join('')}</table>`;
    current && report.pages[current] && (report.pages[current].rawTables = (report.pages[current].rawTables ?? 0) + 1);
  } else {
    const width = Math.max(...rows.map((tr) => cellsOf(tr).length));
    const line = (tr) => {
      const cells = cellsOf(tr).map((c) => inl(kids(c), { cell: true }).trim() || ' ');
      while (cells.length < width) cells.push(' ');
      return `| ${cells.join(' | ')} |`;
    };
    md = [line(rows[0]), `|${' --- |'.repeat(width)}`, ...rows.slice(1).map(line)].join('\n');
  }
  if (hasCls(wrapper, 'reveal')) return `<TraceTable>\n\n${md}\n\n</TraceTable>`;
  return md;
}

function listMd(n) {
  const ordered = n.tagName === 'ol';
  const lines = [];
  let i = 1;
  for (const li of kids(n).filter((c) => isEl(c, 'li'))) {
    const bullet = ordered ? `${i++}. ` : '- ';
    const pad = ' '.repeat(bullet.length);
    const inlineNodes = [];
    const rest = [];
    for (const c of kids(li)) {
      if (!rest.length && isInlineNode(c)) inlineNodes.push(c);
      else rest.push(c);
    }
    lines.push(bullet + (inl(inlineNodes).trim() || ' '));
    for (const c of rest) {
      if (isEl(c, 'ul') || isEl(c, 'ol')) {
        lines.push(...listMd(c).split('\n').map((l) => pad + l));
      } else {
        for (const piece of blocks([c])) {
          lines.push('');
          lines.push(...piece.split('\n').map((l) => (l ? pad + l : l)));
        }
      }
    }
  }
  return lines.join('\n');
}

function paragraph(nodes) {
  let text = inl(nodes).trim();
  if (!text) return null;
  if (/^(#|[-+>]|\d+[.)])/.test(text)) text = '\\' + text;
  return text;
}

function calloutKind(n) {
  const k = cls(n).find((c) => ['note', 'tip', 'caution', 'warn', 'key', 'analogy'].includes(c)) ?? 'note';
  return k === 'warn' ? 'mistake' : k;
}

const STORIES = {
  bubble: 'BubbleSortStory',
  selection: 'SelectionSortStory',
  insertion: 'InsertionSortStory',
  merge: 'MergeSortStory',
  linear: 'LinearSearchStory',
  binary: 'BinarySearchStory',
};

let figureStore = {};
let figureCount = 0;
let figurePage = null;

const MARKERS = {}; // id -> serialised <marker> element, read from the reference's defs block

function svgFigure(svg) {
  const id = `${figurePage.id}-${++figureCount}`;
  let markup = toHtml(svg);
  const used = [...new Set([...markup.matchAll(/url\(#([A-Za-z0-9_-]+)\)/g)].map((m) => m[1]))];
  const defs = used.filter((m) => MARKERS[m]).map((m) => MARKERS[m].replace(`id="${m}"`, `id="${id}-${m}"`));
  markup = markup.replace(/url\(#([A-Za-z0-9_-]+)\)/g, (all, m) => (MARKERS[m] ? `url(#${id}-${m})` : all));
  if (defs.length) markup = markup.replace(/(<svg[^>]*>)/, `$1<defs>${defs.join('')}</defs>`);
  figureStore[id] = { alt: prop(svg, 'ariaLabel') ?? '', svg: markup };
  return id;
}

function figureBlock(n, ctx) {
  const caption = find(n, (c) => isEl(c, 'figcaption'));
  const capMd = caption ? paragraph(kids(caption)) : null;
  const mem = find(n, (c) => hasCls(c, 'mem') && prop(c, 'dataMem'));
  if (mem) {
    const body = `<MemoryDiagram scenario="${prop(mem, 'dataMem')}" static />`;
    return capMd ? `${body}\n\n${capMd}` : body;
  }
  const svg = find(n, (c) => isEl(c, 'svg'));
  if (!svg) {
    warn('figure without svg');
    return capMd ?? '';
  }
  const id = svgFigure(svg);
  const src = ctx.figSrc;
  return `<SvgFigure src="${src}" id="${id}">\n\n${capMd ?? ''}\n\n</SvgFigure>`;
}

function quizBlock(n, ctx) {
  return quizItems(kids(n).filter((c) => hasCls(c, 'q')), ctx, true);
}

function quizItems(items, ctx, heading) {
  const out = [...(heading ? ['## Check your understanding'] : []), '<CheckQuestions>'];
  for (const q of items) {
    const summary = find(q, (c) => isEl(c, 'summary'));
    const answer = find(q, (c) => hasCls(c, 'a'));
    const plain = kids(summary).every((c) => c.type === 'text');
    const question = plain ? `{${JSON.stringify(textOf(summary).replace(/\s+/g, ' ').trim())}}` : `{<>${jsxInline(kids(summary)).trim()}</>}`;
    const body = answer ? blocks(kids(answer), ctx).join('\n\n') : '';
    out.push(`<CheckQuestion question=${question}>\n\n${body}\n\n</CheckQuestion>`);
  }
  out.push('</CheckQuestions>');
  return out.join('\n\n');
}

function stepsBlock(n, ctx) {
  const items = kids(n).filter((c) => isEl(c, 'li'));
  const out = ['<Steps>'];
  items.forEach((li, i) => {
    const first = kids(li).find((c) => c.type !== 'text' || c.value.trim());
    let title = `Step ${i + 1}`;
    let rest = kids(li);
    if (isEl(first, 'b') || isEl(first, 'strong')) {
      title = textOf(first).replace(/\s+/g, ' ').trim().replace(/[.:]$/, '');
      rest = kids(li).slice(kids(li).indexOf(first) + 1);
    }
    const body = blocks(rest, ctx).join('\n\n');
    out.push(`<Step title=${attrString(title)}>\n\n${body}\n\n</Step>`);
  });
  out.push('</Steps>');
  return out.join('\n\n');
}

function listingBlock(n) {
  const isOut = prop(n, 'dataKind') === 'out';
  const code = dedent(textOf(n));
  const file = prop(n, 'dataFile');
  if (isOut) return fence(code, FENCE_LANG.out, file && file !== 'Output' ? `title="${file}"` : '');
  return fence(code, 'java', file ? `title="${file}"` : '');
}

function convertDiv(n, ctx) {
  if (hasCls(n, 'tbl')) {
    const table = find(n, (c) => isEl(c, 'table'));
    return [tableBlock(n, table)];
  }
  if (hasCls(n, 'aside')) {
    const kind = calloutKind(n);
    const label = prop(n, 'dataLabel');
    const body = blocks(kids(n), ctx).join('\n\n');
    return [`<Callout type="${kind}"${label ? ` title=${attrString(label)}` : ''}>\n\n${body}\n\n</Callout>`];
  }
  if (hasCls(n, 'term')) {
    const title = find(n, (c) => hasCls(c, 't'));
    const rest = kids(n).filter((c) => !hasCls(c, 'w') && !hasCls(c, 't'));
    const body = blocks(rest, ctx).join('\n\n');
    return [`<KeyTerm${title ? ` title=${attrString(textOf(title).trim())}` : ''}>\n\n${body}\n\n</KeyTerm>`];
  }
  if (hasCls(n, 'exam')) {
    const lab = find(n, (c) => hasCls(c, 'lab'));
    const rest = kids(n).filter((c) => c !== lab);
    const body = blocks(rest, ctx).join('\n\n');
    return [`<KeyTerm label=${attrString(textOf(lab ?? { type: 'text', value: 'Working' }).trim())} tone="green">\n\n${body}\n\n</KeyTerm>`];
  }
  if (hasCls(n, 'frame')) {
    const boxes = kids(n).filter((c) => isEl(c, 'div'));
    const parts = boxes.map((b) => {
      const k = find(b, (c) => hasCls(c, 'k'));
      const rest = kids(b).filter((c) => c !== k);
      return `<FrameBox label=${attrString(textOf(k).trim())}>\n\n${blocks(rest, ctx).join('\n\n')}\n\n</FrameBox>`;
    });
    return [`<ConceptFrame>\n\n${parts.join('\n\n')}\n\n</ConceptFrame>`];
  }
  if (hasCls(n, 'quiz')) return [quizBlock(n, ctx)];
  if (hasCls(n, 'viz')) {
    if (prop(n, 'dataMem')) return [`<MemoryDiagram scenario="${prop(n, 'dataMem')}"${prop(n, 'dataStatic') !== undefined ? ' static' : ''} />`];
    const algo = prop(n, 'dataAlgo') ?? prop(n, 'dataSearch');
    if (STORIES[algo]) return [`<${STORIES[algo]} />`];
    warn(`no animation for ${algo}`);
    ctx.page.missingAnimations = [...(ctx.page.missingAnimations ?? []), algo];
    return [];
  }
  if (hasCls(n, 'arr-row')) {
    const text = kids(n).map((c) => (c.type === 'text' ? c.value.replace(/ /g, ' ') : textOf(c))).join(' ').replace(/ {2,}/g, '  ').trim();
    return [`ARRROW:${text}`];
  }
  if (hasCls(n, 'split')) {
    return kids(n)
      .filter((c) => isEl(c, 'div'))
      .flatMap((c) => {
        const h = find(c, (x) => isEl(x, 'h4'));
        const rest = kids(c).filter((x) => x !== h);
        return [h ? `**${textOf(h).trim()}**` : '', ...blocks(rest, ctx)].filter(Boolean);
      });
  }
  if (hasCls(n, 'cs')) {
    return kids(n)
      .filter((c) => isEl(c, 'div'))
      .flatMap((c) => {
        const h = find(c, (x) => isEl(x, 'h4'));
        const rest = kids(c).filter((x) => x !== h);
        return [h ? `### ${textOf(h).trim()}` : '', ...blocks(rest, ctx)].filter(Boolean);
      });
  }
  if (hasCls(n, 'cards') || hasCls(n, 'hero') || hasCls(n, 'meta') || hasCls(n, 'objectives') || hasCls(n, 'btns')) return [];
  // unknown wrapper: convert the children
  const known = cls(n).join(' ');
  if (known && !['wide', 'good', 'bad', 'art'].includes(known)) warn(`unhandled div.${known}`);
  return blocks(kids(n), ctx);
}

function blocks(nodes, ctx) {
  const out = [];
  let run = [];
  let detailRun = [];
  const flushDetails = () => {
    if (detailRun.length) {
      out.push(quizItems(detailRun, ctx, false));
      detailRun = [];
    }
  };
  const flush = () => {
    if (run.length) {
      const p = paragraph(run);
      if (p) out.push(p);
      run = [];
    }
  };
  for (const n of nodes) {
    if (n.type === 'text' || (isEl(n) && INLINE_TAGS.has(n.tagName) && !hasCls(n, 'chip') && !hasCls(n, 'lab'))) {
      if (n.type !== 'text' || n.value.trim() || run.length) run.push(n);
      continue;
    }
    flush();
    if (!isEl(n)) continue;
    const tag = n.tagName;
    if (!(tag === 'details' && hasCls(n, 'q'))) flushDetails();
    if (tag === 'p') {
      if (hasCls(n, 'lede') || hasCls(n, 'pagehint')) continue;
      const p = paragraph(kids(n));
      if (!p) continue;
      out.push(hasCls(n, 'cap') ? `*${p.replace(/\*/g, '')}*` : p);
    } else if (['h2', 'h3', 'h4'].includes(tag)) {
      if (tag === 'h4' && ctx.inObjectives) continue;
      out.push(`${tag === 'h2' ? '##' : tag === 'h3' ? '###' : '####'} ${inl(kids(n)).trim()}`);
    } else if (tag === 'ul' || tag === 'ol') {
      if (tag === 'ol' && hasCls(n, 'steps')) out.push(stepsBlock(n, ctx));
      else out.push(listMd(n));
    } else if (tag === 'div') {
      out.push(...convertDiv(n, ctx));
    } else if (tag === 'script') {
      out.push(listingBlock(n));
    } else if (tag === 'figure') {
      out.push(figureBlock(n, ctx));
    } else if (tag === 'table') {
      out.push(tableBlock(n, n));
    } else if (tag === 'pre') {
      const code = dedent(textOf(n));
      out.push(fence(code, /^[\w.<>\[\]]+ \|/.test(code) || /\|/.test(code.split('\n')[0]) ? 'text' : 'java'));
    } else if (tag === 'dl') {
      out.push(glossary(n));
    } else if (tag === 'input' || tag === 'button' || tag === 'style' || tag === 'svg') {
      /* skip */
    } else if (tag === 'details' && hasCls(n, 'q')) {
      detailRun.push(n);
      continue;
    } else {
      warn(`unhandled <${tag}>`);
    }
  }
  flush();
  flushDetails();
  // merge consecutive array rows into one text block
  const merged = [];
  for (const b of out) {
    if (b.startsWith('ARRROW:')) {
      const line = b.slice(7);
      const prev = merged[merged.length - 1];
      if (prev && prev.startsWith('```text\nARR')) merged[merged.length - 1] = prev.replace(/\n```$/, `\n${line}\n\`\`\``);
      else merged.push('```text\nARR\n' + line + '\n```');
    } else merged.push(b);
  }
  return merged.map((b) => b.replace(/^```text\nARR\n/, '```text\n'));
}

function glossary(dl) {
  const rows = [];
  const items = kids(dl).filter((c) => isEl(c));
  for (let i = 0; i < items.length; i += 2) {
    const dt = items[i];
    const dd = items[i + 1];
    if (!isEl(dt, 'dt') || !isEl(dd, 'dd')) continue;
    const where = find(dt, (c) => isEl(c, 'small'));
    const term = inl(kids(dt).filter((c) => c !== where), { cell: true }).trim();
    rows.push(`| ${term} | ${inl(kids(dd), { cell: true }).trim()} | ${where ? inl(kids(where), { cell: true }).trim() : ' '} |`);
  }
  return ['| Term | Meaning | Where it is taught |', '| --- | --- | --- |', ...rows].join('\n');
}

/* ───────── pages ───────── */

function firstSentences(text) {
  const parts = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? [text];
  return { first: parts[0].trim(), rest: parts.slice(1).join('').trim() };
}

function lessonMdx(page, chapter, slug) {
  const id = prop(page, 'id');
  const title = prop(page, 'dataTitle').replace(/\s+/g, ' ').trim();
  const lede = find(page, (c) => hasCls(c, 'lede'));
  const ledeText = lede ? textOf(lede).replace(/\s+/g, ' ').trim() : '';
  const { first, rest } = firstSentences(ledeText);
  const objectives = find(page, (c) => hasCls(c, 'objectives'));
  const items = objectives
    ? findAll(objectives, (c) => isEl(c, 'li')).map((li) => inl(kids(li)).replace(/\\([*_`\[\]{}<>$~])/g, '$1').replace(/\\\\/g, '\\').trim())
    : [];
  const ctx = { page: report.pages[id], figSrc: `sem3/csi247/${chapter}/notes/${slug}`, inObjectives: false };
  figurePage = { id };
  figureCount = 0;
  figureStore = {};

  const body = blocks(
    kids(page).filter((c) => !isEl(c, 'h1') && !hasCls(c, 'lede') && !hasCls(c, 'meta') && !hasCls(c, 'objectives') && !hasCls(c, 'crumbs')),
    ctx,
  );

  const out = [];
  out.push(`---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(first)}
---`);
  if (rest) out.push(escText(rest));
  if (items.length) out.push(`<LearningObjectives items={[\n${items.map((i) => `  ${JSON.stringify(i)},`).join('\n')}\n]} />`);
  out.push(...body);
  return { mdx: out.join('\n\n') + '\n', figures: figureStore };
}

/* ───────── main ───────── */

let source = fs.readFileSync(inputPath, 'utf8');
const generated = generatedFigures(source);
for (const [id, inner] of Object.entries(generated)) {
  const re = new RegExp(`(<(?:svg|g)[^>]*\\bid="${id}"[^>]*>)`);
  if (!re.test(source)) warn(`no element with id="${id}" to fill`);
  source = source.replace(re, `$1${inner}`);
}

const tree = fromHtml(source);
const pages = findAll(tree, (n) => isEl(n, 'section') && hasCls(n, 'page'));

// marker definitions
const defsRoot = find(tree, (n) => isEl(n, 'defs'));
for (const m of defsRoot ? kids(defsRoot).filter((c) => isEl(c, 'marker')) : []) MARKERS[prop(m, 'id')] = toHtml(m);

// pass 1: heading index for link resolution
for (const page of pages) {
  const id = prop(page, 'id');
  for (const h of findAll(page, (n) => isEl(n, 'h2') || isEl(n, 'h3'))) {
    if (find(h, () => false)) continue;
    const explicit = prop(h, 'id');
    const refId = explicit ?? `${id}-${refSlug(textOf(h))}`;
    headingIndex.set(refId, { page: id, slug: slugger(textOf(h).replace(/\s+/g, ' ').trim()) });
  }
}

fs.rmSync(outDir, { recursive: true, force: true });
for (const page of pages) {
  const id = prop(page, 'id');
  if (only && !only.has(id)) continue;
  current = id;
  report.pages[id] = { title: prop(page, 'dataTitle') };
  if (id === 'home') {
    report.pages[id].skipped = 'course landing page';
    continue;
  }
  if (REFERENCE_PAGES.has(id)) {
    const { mdx, figures } = lessonMdx(page, 'reference', id);
    const file = path.join(outDir, 'reference', `${id}.mdx`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, mdx);
    report.pages[id].file = path.relative(outDir, file);
    report.pages[id].bytes = Buffer.byteLength(mdx);
    continue;
  }
  const target = PAGES[id];
  if (!target) {
    warn(`no target for page ${id}`);
    continue;
  }
  const [chapter, slug] = target;
  const { mdx, figures } = lessonMdx(page, chapter, slug);
  const file = path.join(outDir, SKIPPED.has(id) ? 'skipped' : 'lessons', chapter, `${slug}.mdx`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, mdx);
  report.pages[id].file = path.relative(outDir, file);
  report.pages[id].bytes = Buffer.byteLength(mdx);
  report.pages[id].figures = Object.keys(figures).length;
  if (Object.keys(figures).length && !SKIPPED.has(id)) {
    const figFile = path.join(outDir, 'figures', chapter, 'notes', `${slug}.json`);
    fs.mkdirSync(path.dirname(figFile), { recursive: true });
    fs.writeFileSync(figFile, JSON.stringify(figures, null, 2) + '\n');
  }
}
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');
const total = Object.values(report.pages).reduce((n, p) => n + (p.bytes ?? 0), 0);
console.log(`${Object.keys(report.pages).length} pages, ${(total / 1024).toFixed(0)} KB of MDX, ${report.warnings.length} warnings -> ${outDir}`);
for (const w of report.warnings.slice(0, 40)) console.log('  warn', w);
