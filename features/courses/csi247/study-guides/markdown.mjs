import { parseFragment } from 'parse5';
import { createGuides } from './guides.mjs';
import { nodeText, omittedTags } from './html-text.mjs';

// Escape literal text once, including backslashes. Never emit raw source HTML.
const text = value => value.replace(/[&<>\\`*_\[\]|]/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;'}[char] ?? `\\${char}`));
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value || '';
const fence = (value, minimum) => '`'.repeat(Math.max(minimum, ...[...value.matchAll(/`+/g)].map(match => match[0].length + 1)));
const descendants = (node, tag) => (node.childNodes || []).flatMap(child => child.tagName === tag ? [child] : descendants(child, tag));
const blocks = new Set(['p','div','article','section','figure','summary','legend','label','li','ol','ul','aside','details']);

function render(node) {
  if (node.nodeName === '#text') return text(node.value);
  if (node.nodeName === '#comment' || omittedTags.has(node.tagName)) return '';
  const tag = node.tagName;
  if (tag === 'pre') {
    const source = nodeText(node).trim(), ticks = fence(source, 3);
    return `\n${ticks}\n${source}\n${ticks}\n`;
  }
  if (tag === 'svg') return `\n*Diagram: ${text(attr(node, 'aria-label') || 'See visual chapter')}*\n`;
  if (tag === 'table') {
    const rows = descendants(node, 'tr').map(row => (row.childNodes || [])
      .filter(cell => cell.tagName === 'td' || cell.tagName === 'th')
      .map(cell => text(nodeText(cell).trim().replace(/\s+/g, ' '))));
    return '\n' + rows.map((row, i) => '| ' + row.join(' | ') + ' |' +
      (i === 0 ? '\n| ' + row.map(() => '---').join(' | ') + ' |' : '')).join('\n') + '\n';
  }
  if (tag === 'code') {
    const source = nodeText(node), ticks = fence(source, 1);
    return `${ticks} ${source} ${ticks}`;
  }
  const children = (node.childNodes || []).map(render).join('');
  if (/^h[1-6]$/.test(tag || '')) return `\n${'#'.repeat(Number(tag[1]))} ${children.trim()}\n`;
  if (tag === 'a') {
    const href = attr(node, 'href');
    try {
      const url = new URL(href, 'https://study.invalid');
      if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) return children;
      const target = encodeURI(href).replaceAll('(', '%28').replaceAll(')', '%29');
      return `[${children}](<${target}>)`;
    } catch { return children; }
  }
  if (tag === 'strong' || tag === 'b') return `**${children}**`;
  if (tag === 'br') return '\n';
  if (tag === 'li') return `\n- ${children}\n`;
  return blocks.has(tag) ? `\n${children}\n\n` : children;
}

// The parsed shared chapter, not the superseded MDX, powers Copy Markdown.
export function chapterMarkdown(html) {
  return render(parseFragment(html)).split('\n').map(line => line.trimEnd()).join('\n')
    .replace(/\n{3,}/g, '\n\n').trim();
}

let chapters;
export function getFullChapterMarkdown(pageUrl) {
  chapters ??= createGuides();
  const matched = chapters.filter(guide => guide.sourceRoutes.includes(pageUrl));
  if (!matched.length) return null;
  return matched.map(guide => `# ${text(guide.title)}\n\n${text(guide.summary)}\n\n` +
    guide.sections.map(section => (section.raw ? '' : `## ${text(section.title)}\n\n`) + chapterMarkdown(section.body)).join('\n\n')).join('\n\n');
}
