#!/usr/bin/env node
/**
 * Compiles MDX pages with the site's math plugin, so a syntax error (a stray `<` or `{` in prose, an unclosed tag, a
 * fence inside a tag without blank lines) shows up in a second instead of in the production build.
 *
 *   node scripts/check-mdx.mjs content/docs/sem3/csi243/10-reasoning-revision/notes/proofs-of-programs-i.mdx
 *   node scripts/check-mdx.mjs content/docs/sem3/csi243/07-higher-order        (every .mdx under a folder)
 *
 * It does not render anything and does not check that components exist. Exit code 1 when a page does not compile.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile } from '@mdx-js/mdx';
import remarkMath from 'remark-math';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targets = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!targets.length) {
  console.error('Usage: node scripts/check-mdx.mjs <file or folder>...');
  process.exit(2);
}

const files = [];
const collect = (target) => {
  const full = path.resolve(root, target);
  if (fs.statSync(full).isFile()) return files.push(full);
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const child = path.join(full, entry.name);
    if (entry.isDirectory()) collect(child);
    else if (entry.name.endsWith('.mdx')) files.push(child);
  }
};
targets.forEach(collect);

let failed = 0;
for (const file of files.sort()) {
  const raw = fs.readFileSync(file, 'utf8');
  const frontMatter = /^---[\s\S]*?---\r?\n/.exec(raw);
  const offset = frontMatter ? frontMatter[0].split('\n').length - 1 : 0;
  try {
    await compile(frontMatter ? raw.slice(frontMatter[0].length) : raw, { remarkPlugins: [remarkMath], outputFormat: 'program' });
  } catch (error) {
    failed += 1;
    const line = error.line ? error.line + offset : '?';
    console.log(`FAILED  ${path.relative(root, file).replace(/\\/g, '/')}:${line}\n        ${String(error.message).split('\n')[0]}`);
  }
}
console.log(`\nMDX check: ${files.length - failed} of ${files.length} pages compile.`);
if (failed) process.exit(1);
