// The build step that turns a highlighted code block into one string (lib/code-as-string.ts): the HTML it writes, how the
// text is read back from it, and which `pre` elements it touches.
// Run with: node --no-warnings --experimental-strip-types --test tests/unit/code-as-string.test.mjs

import assert from 'node:assert/strict';
import test from 'node:test';
import { htmlToText, rehypeCodeAsString, serialize } from '../../lib/code-as-string.ts';

const text = (value) => ({ type: 'text', value });
const el = (tagName, properties, ...children) => ({ type: 'element', tagName, properties, children });

// What Shiki leaves for `if (a < b && c) { x = "y"; }` followed by a second line.
const line = (...tokens) => el('span', { className: ['line'] }, ...tokens);
const token = (value, light, dark) => el('span', { style: `--shiki-light:${light};--shiki-dark:${dark}` }, text(value));
const code = () =>
  el('code', { className: ['language-java'] }, line(token('if (a < b && c) {', '#d73a49', '#f97583')), text('\n'), line(token('  x = "y";', '#032f62', '#9ecbff')));
const pre = (child) => el('pre', { className: ['shiki'], tabIndex: 0, style: '--shiki-light-bg:#fff' }, child);

test('serialize writes elements, classes and styles, and escapes the text', () => {
  const html = serialize(code().children);
  assert.equal(
    html,
    '<span class="line"><span style="--shiki-light:#d73a49;--shiki-dark:#f97583">if (a &lt; b &amp;&amp; c) {</span></span>\n' +
      '<span class="line"><span style="--shiki-light:#032f62;--shiki-dark:#9ecbff">  x = "y";</span></span>',
  );
});

test('the text of a block is read back from the string exactly as the tree had it', () => {
  const html = serialize(code().children);
  assert.equal(htmlToText(html), 'if (a < b && c) {\n  x = "y";');
  // the escapes are undone once, so text that looks like an escape survives
  assert.equal(htmlToText(serialize([text('&amp; &lt;tag&gt; &quot;')])), '&amp; &lt;tag&gt; &quot;');
  assert.equal(htmlToText(serialize([el('span', {}, text('a > b'))])), 'a > b');
});

test('attribute names and values are written safely', () => {
  const html = serialize([el('span', { dataHighlighted: true, ariaLabel: 'a "quoted" <b>', className: ['x', 'y'], hidden: false }, text('t'))]);
  assert.equal(html, '<span data-highlighted aria-label="a &quot;quoted&quot; &lt;b&gt;" class="x y">t</span>');
});

test('the plugin replaces the children of a highlighted pre with the string and the code class', () => {
  const tree = { type: 'root', children: [el('p', {}, text('prose')), pre(code())] };
  rehypeCodeAsString()(tree);
  const block = tree.children[1];
  assert.deepEqual(block.children, []);
  assert.equal(block.properties.dataCodeClass, 'language-java');
  assert.equal(htmlToText(block.properties.dataHtml), 'if (a < b && c) {\n  x = "y";');
  assert.equal(block.properties.tabIndex, 0, 'the other properties of the pre are kept');
  assert.equal(tree.children[0].children[0].value, 'prose', 'other elements are not touched');
});

test('a pre that is not a plain highlighted block is left alone', () => {
  const unusual = el('pre', {}, el('code', {}, text('a')), el('span', {}, text('extra')));
  const empty = el('pre', {});
  const tree = { type: 'root', children: [unusual, empty] };
  rehypeCodeAsString()(tree);
  assert.equal(unusual.properties.dataHtml, undefined);
  assert.equal(unusual.children.length, 2);
  assert.equal(empty.properties.dataHtml, undefined);
});

test('a code element with no class gives an empty class, and blank text beside it is allowed', () => {
  const block = el('pre', {}, text('\n'), el('code', {}, line(token('x', '#000', '#fff'))), text('\n'));
  rehypeCodeAsString()({ type: 'root', children: [block] });
  assert.equal(block.properties.dataCodeClass, '');
  assert.equal(htmlToText(block.properties.dataHtml), 'x');
});

test('the class of the code element is found whether it is a class string (Shiki) or a className list', () => {
  const shiki = el('pre', { class: 'shiki github-light' }, el('code', { class: 'language-haskell' }, line(token('x', '#000', '#fff'))));
  rehypeCodeAsString()({ type: 'root', children: [shiki] });
  assert.equal(shiki.properties.dataCodeClass, 'language-haskell');
});
