#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const courseRoot = join(root, 'content', 'docs', 'sem3', 'csi247');
const problems = [];
const mdxFiles = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.mdx')) mdxFiles.push(full);
    else if (entry.name === 'meta.json') auditMeta(full);
  }
}

function auditMeta(file) {
  const directory = dirname(file);
  let data;
  try { data = JSON.parse(readFileSync(file, 'utf8')); }
  catch (error) { problems.push(`${relative(root, file)}: invalid JSON (${error.message})`); return; }
  if (!Array.isArray(data.pages)) problems.push(`${relative(root, file)}: pages must be an array.`);
  for (const page of data.pages ?? []) {
    if (typeof page !== 'string' || page.startsWith('---')) continue;
    const targetExists = existsSync(join(directory, `${page}.mdx`)) || existsSync(join(directory, `${page}.md`)) || existsSync(join(directory, page, 'meta.json'));
    if (!targetExists) problems.push(`${relative(root, file)}: page "${page}" does not resolve to a document or chapter.`);
  }
}

walk(courseRoot);

for (const file of mdxFiles) {
  const source = readFileSync(file, 'utf8');
  if (!/^---\r?\n[\s\S]*?\r?\n---/.test(source)) problems.push(`${relative(root, file)}: missing frontmatter.`);
  for (const match of source.matchAll(/\]\((\/docs\/sem3\/csi247[^)#?]*)(?:#[^)]*)?\)/g)) {
    const route = match[1].replace(/^\/docs\/sem3\/csi247\/?/, '');
    if (!route) continue;
    const target = join(courseRoot, ...route.split('/'));
    if (!existsSync(`${target}.mdx`) && !existsSync(join(target, 'index.mdx'))) {
      problems.push(`${relative(root, file)}: internal link ${match[1]} has no CSI247 page.`);
    }
  }
  for (const match of source.matchAll(/from ['"]@\/content\/flashcard-data\/([^'"]+)['"]/g)) {
    if (!existsSync(join(root, 'content', 'flashcard-data', `${match[1]}.ts`))) problems.push(`${relative(root, file)}: missing flashcard data ${match[1]}.ts.`);
  }
}

for (const page of ['java-playground.mdx']) {
  const source = readFileSync(join(courseRoot, page), 'utf8');
  if (/^# /m.test(source.replace(/^---[\s\S]*?---/, ''))) problems.push(`${page}: explicit H1 duplicates the generated page title.`);
}

const embeddedVisuals = new Map([
  ['sorting-and-searching/notes/linear-search.mdx', '<LinearSearchStory'],
  ['sorting-and-searching/notes/binary-search.mdx', '<BinarySearchStory'],
  ['sorting-and-searching/notes/bubble-and-selection-sort.mdx', '<BubbleSortStory'],
  ['sorting-and-searching/notes/insertion-sort.mdx', '<InsertionSortStory'],
  ['sorting-and-searching/notes/merge-sort.mdx', '<MergeSortStory'],
  ['packages/notes/built-in-packages-and-imports.mdx', '<PackageImportStory'],
  ['packages/notes/creating-a-package.mdx', '<PackageFolderStory'],
  ['packages/notes/compiling-and-running.mdx', '<PackageBuildStory'],
]);

for (const [page, component] of embeddedVisuals) {
  const source = readFileSync(join(courseRoot, page), 'utf8');
  if (!source.includes(component)) problems.push(`${page}: missing required topic-embedded visual ${component}.`);
}

const combinedSortSource = readFileSync(join(courseRoot, 'sorting-and-searching', 'notes', 'bubble-and-selection-sort.mdx'), 'utf8');
if (!combinedSortSource.includes('<SelectionSortStory')) problems.push('sorting-and-searching/notes/bubble-and-selection-sort.mdx: missing required topic-embedded visual <SelectionSortStory.');

const retiredLab = join(courseRoot, 'sorting-and-searching', 'visual-lab.mdx');
if (existsSync(retiredLab)) problems.push('sorting-and-searching/visual-lab.mdx: the generic lab must remain retired; visuals belong inside their topic lessons.');

if (problems.length) {
  console.error(`CSI247 architecture audit found ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`CSI247 architecture audit passed: ${mdxFiles.length} MDX pages, metadata, links, and data references verified.`);
