#!/usr/bin/env node
/**
 * MDX removes the indentation of the lines inside a multi-line attribute value, so a program written as
 * `initialCode={`...`}` or `code="..."` runs with its Haskell layout (or Python blocks) destroyed.
 * The program goes in a fenced block inside the tag instead.
 *
 *   npm run audit:mdx-code
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentRoot = path.join(root, 'content');
const TAGS = 'HaskellPlayground|HaskellTryIt|CodePlayground|CodeTryIt|JavaPlayground|JavaTryIt';
const tag = new RegExp(`<(${TAGS})\\b([^>]*)>`, 'g');
const codeProp = /(^|\s)(initialCode|code)=/;

const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.mdx$/.test(entry.name)) files.push(full);
  }
};
walk(contentRoot);

const problems = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(tag)) {
    if (!codeProp.test(match[2])) continue;
    const line = text.slice(0, match.index).split('\n').length;
    problems.push(`${path.relative(root, file).replace(/\\/g, '/')}:${line}: <${match[1]}> passes its program as a prop; put it in a fenced block inside the tag`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} program(s) would lose their indentation in MDX.`);
  process.exit(1);
}
console.log(`MDX code props audit passed: ${files.length} pages, no program passed as an attribute.`);
