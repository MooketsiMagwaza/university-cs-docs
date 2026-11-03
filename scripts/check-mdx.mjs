#!/usr/bin/env node
/**
 * Compiles MDX pages with the site's math plugin, so a syntax error (a stray `<` or `{` in prose, an unclosed tag, a
 * fence inside a tag without blank lines) shows up in a second instead of in the production build.
 *
 *   node scripts/check-mdx.mjs                       (only the pages changed since the last commit, plus new ones)
 *   node scripts/check-mdx.mjs --since origin/main   (only the pages changed since that commit; use it on a branch)
 *   node scripts/check-mdx.mjs --all                 (every page under content/docs; CI uses this)
 *   node scripts/check-mdx.mjs content/docs/sem3/csi243/10-reasoning-revision/notes/proofs-of-programs-i.mdx
 *   node scripts/check-mdx.mjs content/docs/sem3/csi243/07-higher-order        (every .mdx under a folder)
 *
 * It does not render anything and does not check that components exist. Exit code 1 when a page does not compile.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile } from '@mdx-js/mdx';
import remarkMath from 'remark-math';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const sinceIndex = args.indexOf('--since');
const since = sinceIndex >= 0 ? args[sinceIndex + 1] : undefined;
const targets = args.filter((arg, index) => !arg.startsWith('--') && !(sinceIndex >= 0 && index === sinceIndex + 1));

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

const git = (...gitArgs) => execFileSync('git', gitArgs, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split(/\r?\n/).filter(Boolean);

/** The .mdx pages under content/docs that differ from `base` (or from HEAD), including staged, unstaged and new files. */
function changedPages() {
  const names = new Set([
    ...git('diff', '--name-only', '--diff-filter=ACMR', since ? `${since}...HEAD` : 'HEAD', '--', 'content/docs'),
    ...(since ? git('diff', '--name-only', '--diff-filter=ACMR', 'HEAD', '--', 'content/docs') : []),
    ...git('ls-files', '--others', '--exclude-standard', '--', 'content/docs'),
  ]);
  return [...names].filter((name) => name.endsWith('.mdx') && fs.existsSync(path.join(root, name)));
}

if (flag('--all')) {
  collect('content/docs');
} else if (targets.length) {
  targets.forEach(collect);
} else {
  let changed;
  try {
    changed = changedPages();
  } catch {
    console.error('Could not ask git which pages changed, so every page is checked (pass --all to say so).');
    changed = null;
  }
  if (changed === null) collect('content/docs');
  else if (!changed.length) {
    console.log('MDX check: no changed pages (pass --all to check every page).');
    process.exit(0);
  } else changed.forEach(collect);
}

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
