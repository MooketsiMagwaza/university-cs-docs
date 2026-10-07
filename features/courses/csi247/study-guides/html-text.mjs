import { parseFragment } from 'parse5';

export const omittedTags = new Set(['script', 'style', 'template', 'button', 'iframe', 'object']);
export function nodeText(node) {
  if (omittedTags.has(node.tagName)) return '';
  if (node.nodeName === '#text') return node.value;
  return (node.childNodes || []).map(nodeText).join('');
}

// Parsing decodes entities exactly once. This extracts text, not sanitized HTML.
export const htmlText = html => nodeText(parseFragment(html));
