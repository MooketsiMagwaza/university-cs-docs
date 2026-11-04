/**
 * Code blocks as one string (PERF-06).
 *
 * rehype-code (Shiki) turns every fenced block into a tree of `span` elements, and MDX compiles each token of that tree
 * into JavaScript: 8,371 blocks and 176,815 tokens on the site, which is most of the 70.6 MB of compiled pages that make the
 * production build run out of memory on a small build machine. This plugin runs after rehype-code and replaces the children
 * of each `pre` with one string, the HTML of the `code` element, plus the class of the `code` element (it names the
 * language). `components/interactive/mdx-pre.tsx` reads those two properties on the server, works out the language and the
 * text from them (never from React children, which reach a client component as unresolved references and gave a different
 * answer on the server and in the browser), and `CodeWindow` writes the string into the page.
 *
 * Everything here is plain data and string work, so it also runs under node (`tests/unit/code-as-string.test.mjs`).
 * Set `CODE_AS_STRING=0` to leave the plugin out: `MdxPre` then falls back to reading the children, as before.
 */

type HastNode = {
  type: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const escapeText = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttribute = (value: string) => escapeText(value).replace(/"/g, '&quot;');

/** The HTML name of a hast property: `className` is `class`, `dataFoo` is `data-foo`, `tabIndex` is `tabindex`. */
function attributeName(property: string): string {
  if (property === 'className') return 'class';
  if (/^(data|aria)[A-Z]/.test(property)) return property.replace(/^(data|aria)/, '$1-').replace(/[A-Z]/g, (letter) => letter.toLowerCase());
  return property.toLowerCase();
}

function attributes(properties: Record<string, unknown> | undefined): string {
  let out = '';
  for (const [name, value] of Object.entries(properties ?? {})) {
    if (value === undefined || value === null || value === false) continue;
    const key = attributeName(name);
    out += value === true ? ` ${key}` : ` ${key}="${escapeAttribute(Array.isArray(value) ? value.join(' ') : String(value))}"`;
  }
  return out;
}

/** The HTML of a list of hast nodes. Shiki produces only elements and text; anything else is left out. */
export function serialize(nodes: HastNode[] | undefined): string {
  let out = '';
  for (const node of nodes ?? []) {
    if (node.type === 'text') out += escapeText(node.value ?? '');
    else if (node.type === 'element' && node.tagName) out += `<${node.tagName}${attributes(node.properties)}>${serialize(node.children)}</${node.tagName}>`;
  }
  return out;
}

/** The text of the HTML that `serialize` wrote: the tags removed and the three escapes undone. */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
}

/** The classes of an element: Shiki writes them as a `class` string, other plugins as a `className` list. */
const classOf = (properties: Record<string, unknown> | undefined) => {
  const value = properties?.className ?? properties?.class;
  return Array.isArray(value) ? value.join(' ') : typeof value === 'string' ? value : '';
};

function visit(node: HastNode, enter: (node: HastNode) => void) {
  enter(node);
  for (const child of node.children ?? []) visit(child, enter);
}

/** A rehype plugin; put it after rehype-code. */
export function rehypeCodeAsString() {
  return (tree: HastNode) => {
    visit(tree, (node) => {
      if (node.type !== 'element' || node.tagName !== 'pre') return;
      const children = node.children ?? [];
      const code = children.find((child) => child.type === 'element' && child.tagName === 'code');
      // Only a `pre` that holds nothing but a `code` element (and blank text between) is a highlighted block.
      if (!code || children.some((child) => child !== code && !(child.type === 'text' && !(child.value ?? '').trim()))) return;
      node.properties = { ...node.properties, dataHtml: serialize(code.children), dataCodeClass: classOf(code.properties) };
      node.children = [];
    });
  };
}
