// Checks the "predict, then reveal" data (content/predict-data) and the pages that use it.
//   - every question in every JSON file is well formed (the same rules the page loader applies, lib/predict-data.ts);
//   - every <PredictReveal src="..." id="..." /> in the docs points at a question that exists.
// Questions nobody uses are listed but are not an error (the MAT221 ones wait for its rebuild, STD-12).
// Run: node --no-warnings --experimental-strip-types scripts/audit-predict-data.mjs
import fs from 'node:fs';
import path from 'node:path';
import { problemWith } from '../lib/predict-data.ts';

const root = path.resolve(import.meta.dirname, '..');
const dataRoot = path.join(root, 'content', 'predict-data');
const docsRoot = path.join(root, 'content', 'docs');

const walk = (directory) =>
  fs.existsSync(directory)
    ? fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]))
    : [];

const problems = [];
const known = new Set();
for (const file of walk(dataRoot).filter((name) => name.endsWith('.json'))) {
  const src = path.relative(dataRoot, file).split(path.sep).join('/').replace(/\.json$/, '');
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    problems.push(`${src}: not valid JSON (${error.message})`);
    continue;
  }
  if (typeof data.predictions !== 'object' || data.predictions === null) {
    problems.push(`${src}: it needs a "predictions" object`);
    continue;
  }
  for (const [id, question] of Object.entries(data.predictions)) {
    const problem = problemWith(question);
    if (problem) problems.push(`${src}#${id}: ${problem}`);
    known.add(`${src}#${id}`);
  }
}

const used = new Set();
for (const file of walk(docsRoot).filter((name) => name.endsWith('.mdx'))) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/<PredictReveal\s+src="([^"]+)"\s+id="([^"]+)"/g)) {
    const key = `${match[1]}#${match[2]}`;
    used.add(key);
    if (!known.has(key)) problems.push(`${path.relative(root, file).split(path.sep).join('/')}: PredictReveal ${key} has no data`);
  }
}

const unused = [...known].filter((key) => !used.has(key));
for (const key of unused) console.log(`unused: ${key}`);
if (problems.length) {
  for (const problem of problems) console.error(`PROBLEM ${problem}`);
  process.exit(1);
}
console.log(`Predict data audit passed: ${known.size} questions, ${used.size} used, ${unused.length} not used yet.`);
