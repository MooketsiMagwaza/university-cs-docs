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
  const coursePath = relative(courseRoot, file).replaceAll('\\', '/');
  const isHiddenLegacy = coursePath.startsWith('arrays-and-arraylists/') || coursePath.startsWith('linear-structures/');
  if (!/^---\r?\n[\s\S]*?\r?\n---/.test(source)) problems.push(`${relative(root, file)}: missing frontmatter.`);
  const authoredBody = source.replace(/^---[\s\S]*?---/, '');
  if (!isHiddenLegacy && /^# /m.test(authoredBody)) problems.push(`${relative(root, file)}: explicit H1 duplicates the generated page title.`);
  if (!isHiddenLegacy && /work in progress|currently being developed|coming soon/i.test(authoredBody)) problems.push(`${relative(root, file)}: published CSI247 page still contains placeholder copy.`);
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

const officialChapters = [
  'java-fundamentals', 'recursion', 'time-complexity', 'sorting-and-searching',
  'packages', 'object-oriented-programming', 'generics', 'collections',
  'linked-lists-traversals', 'stacks-and-queues', 'hash-tables', 'trees', 'graphs',
];
for (const chapter of officialChapters) {
  if (!existsSync(join(courseRoot, chapter, 'meta.json')) || !existsSync(join(courseRoot, chapter, 'index.mdx'))) {
    problems.push(`official CSI247 chapter ${chapter} is missing its meta.json or index.mdx.`);
  }
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

const requiredTeachingEvidence = new Map([
  ['sorting-and-searching/notes/linear-search.mdx', ['linearSearchRecursive', 'four simultaneous search frames', 'orderedDescending']],
  ['sorting-and-searching/notes/binary-search.mdx', ['binarySearchRecursive', 'descendingRecursive', 'four probes, five key comparisons']],
  ['sorting-and-searching/notes/bubble-and-selection-sort.mdx', ['Literal lecture', 'descendingRecursive', 'minIndex after', '[1C,2B,2A]']],
  ['sorting-and-searching/notes/insertion-sort.mdx', ['insertionDescending', 'six shifts', 'j >= 0']],
  ['sorting-and-searching/notes/merge-sort.mdx', ['<MergeFrontWorkbench', '<MergeRecursionExplorer', '<MergeComplexityFigure', 'mergeDescending', 'Iterative bottom-up']],
  ['packages/notes/built-in-packages-and-imports.mdx', ['BookImportDemo', 'BufferedReader', 'java.util.concurrent']],
  ['packages/notes/creating-a-package.mdx', ['scratch/A.java', 'sourcepath', 'package pkg;']],
  ['packages/notes/compiling-and-running.mdx', ['-sourcepath src', 'java -cp classes app.Tester', 'fully qualified']],
]);

for (const [page, evidence] of requiredTeachingEvidence) {
  const source = readFileSync(join(courseRoot, page), 'utf8');
  for (const item of evidence) {
    if (!source.includes(item)) problems.push(`${page}: missing required teaching evidence "${item}".`);
  }
}

const guideRoot = join(root, 'public', 'files', 'sem3', 'csi247', 'study-guides');
const guideManifestPath = join(guideRoot, 'manifest.json');
if (!existsSync(guideManifestPath)) {
  problems.push('CSI247 standalone guide manifest is missing.');
} else {
  try {
    const manifest = JSON.parse(readFileSync(guideManifestPath, 'utf8'));
    if (manifest.schemaVersion !== 1) problems.push('CSI247 standalone guide manifest has an unsupported schema version.');
    if (!Array.isArray(manifest.artifacts) || manifest.artifacts.length !== 9) {
      problems.push('CSI247 standalone guide manifest must contain exactly nine topic artifacts.');
    }
    const ids = new Set();
    for (const artifact of manifest.artifacts ?? []) {
      if (ids.has(artifact.id)) problems.push(`CSI247 standalone guide manifest duplicates artifact ${artifact.id}.`);
      ids.add(artifact.id);
      if (!Array.isArray(artifact.sourceRoutes) || artifact.sourceRoutes.length === 0) problems.push(`${artifact.id}: missing source route.`);
      for (const field of ['html', 'pdf']) {
        if (typeof artifact[field] !== 'string' || !artifact[field].startsWith('/files/sem3/csi247/study-guides/')) {
          problems.push(`${artifact.id}: missing generated ${field} path.`);
          continue;
        }
        const localPath = join(root, 'public', ...artifact[field].replace(/^\/files\//, 'files/').split('/'));
        if (!existsSync(localPath)) problems.push(`${artifact.id}: generated ${field} does not exist.`);
      }
    }
  } catch (error) {
    problems.push(`CSI247 standalone guide manifest is invalid JSON (${error.message}).`);
  }
}

if (problems.length) {
  console.error(`CSI247 architecture audit found ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`CSI247 architecture audit passed: ${mdxFiles.length} MDX pages, metadata, links, and data references verified.`);
