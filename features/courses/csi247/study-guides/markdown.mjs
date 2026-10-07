import { createGuides } from './guides.mjs';

const decode = text => text.replace(/&(amp|lt|gt|quot|apos|#39|nbsp|#\d+|#x[\da-f]+);/gi, (all, entity) => {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'", nbsp: ' ' };
  return named[entity] ?? (entity.startsWith('#x') ? String.fromCodePoint(parseInt(entity.slice(2), 16)) : entity.startsWith('#') ? String.fromCodePoint(Number(entity.slice(1))) : all);
});
const plain = html => decode(html.replace(/<\/?[a-zA-Z][^>]*>/g, ''));

// The controlled chapter markup, rather than the superseded MDX lesson, is
// also the source of Copy Markdown. Preserve code before stripping other tags.
export function chapterMarkdown(html) {
  const blocks = [];
  const save = text => { blocks.push(text); return `\nCHAPTERBLOCK${blocks.length - 1}END\n`; };
  return html
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/g, (_, code) => save(`\n\`\`\`\n${plain(code).trim()}\n\`\`\`\n`))
    .replace(/<svg\b([^>]*)>[\s\S]*?<\/svg>/g, (_, attrs) => `\n*Diagram: ${decode(attrs.match(/aria-label="([^"]*)"/)?.[1] || 'See visual chapter')}*\n`)
    .replace(/<table\b[^>]*>([\s\S]*?)<\/table>/g, (_, table) => {
      const rows = [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map(match => [...match[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map(cell => plain(cell[1]).trim().replace(/\|/g, '\\|').replace(/\s+/g, ' ')));
      if (!rows.length) return '';
      return save('\n' + rows.map((row, i) => '| ' + row.join(' | ') + ' |' + (i === 0 ? '\n| ' + row.map(() => '---').join(' | ') + ' |' : '')).join('\n') + '\n');
    })
    .replace(/<template>[\s\S]*?<\/template>/g, '')
    .replace(/<button\b[^>]*>[\s\S]*?<\/button>/g, '')
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g, (_, level, title) => `\n${'#'.repeat(Number(level))} ${plain(title)}\n`)
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/g, (_, code) => '`' + plain(code) + '`')
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, label) => `[${plain(label)}](${decode(href)})`)
    .replace(/<(strong|b)>([\s\S]*?)<\/\1>/g, (_, tag, text) => `**${plain(text)}**`)
    .replace(/<li\b[^>]*>/g, '\n- ')
    .replace(/<\/(p|div|article|section|figure|summary|legend|label|li|ol|ul)>/g, '\n\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/?[a-zA-Z][^>]*>/g, '')
    .replace(/CHAPTERBLOCK(\d+)END/g, (_, i) => blocks[Number(i)])
    .split('\n').map(line => decode(line).trimEnd()).join('\n')
    .replace(/\n{3,}/g, '\n\n').trim();
}

let chapters;
export function getFullChapterMarkdown(pageUrl) {
  chapters ??= createGuides();
  const matched = chapters.filter(guide => guide.sourceRoutes.includes(pageUrl));
  if (!matched.length) return null;
  return matched.map(guide => `# ${guide.title}\n\n${guide.summary}\n\n` + guide.sections.map(section => chapterMarkdown(section.raw ? section.body : `<h2>${section.title}</h2>${section.body}`)).join('\n\n')).join('\n\n');
}
