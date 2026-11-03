// The page tree handed to the docs layout: unused fields are dropped, everything the sidebar reads is kept.
// Run with: node --no-warnings --experimental-strip-types --test tests/unit/slim-tree.test.mjs
import assert from 'node:assert/strict';
import test from 'node:test';
import { slimTree } from '../../lib/slim-tree.ts';

const hidden = Symbol('name');

test('drops description, $ref and unset options, keeps names, addresses, ids and set options', () => {
  const tree = {
    name: 'Docs',
    children: [
      { $id: 'a/index.mdx', type: 'page', name: 'A', url: '/docs/a', description: 'A long description', icon: undefined, $ref: 'a/index.mdx' },
      {
        type: 'folder', name: 'B', root: undefined, defaultOpen: true, description: undefined, collapsible: undefined,
        index: { $id: 'b/index.mdx', type: 'page', name: 'B', url: '/docs/b', description: 'x', $ref: 'b/index.mdx' },
        children: [{ $id: 'b/c.mdx', type: 'page', name: 'C', url: '/docs/b/c', description: 'y', $ref: 'b/c.mdx' }],
      },
      { type: 'separator', name: 'Break' },
    ],
  };
  assert.deepEqual(slimTree(tree), {
    name: 'Docs',
    children: [
      { $id: 'a/index.mdx', type: 'page', name: 'A', url: '/docs/a' },
      {
        type: 'folder', name: 'B', defaultOpen: true,
        index: { $id: 'b/index.mdx', type: 'page', name: 'B', url: '/docs/b' },
        children: [{ $id: 'b/c.mdx', type: 'page', name: 'C', url: '/docs/b/c' }],
      },
      { type: 'separator', name: 'Break' },
    ],
  });
});

test('does not change the tree it is given and copies only string keys', () => {
  const page = { type: 'page', name: 'A', url: '/docs/a', description: 'kept in the original', [hidden]: 'symbol keys are not copied' };
  const tree = { name: 'Docs', children: [page] };
  const slim = slimTree(tree);
  assert.equal(page.description, 'kept in the original');
  assert.equal(Object.getOwnPropertySymbols(slim.children[0]).length, 0);
  assert.equal('description' in slim.children[0], false);
});
