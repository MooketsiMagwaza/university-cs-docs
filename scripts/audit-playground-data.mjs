#!/usr/bin/env node
/**
 * Audits content/playground-data: every file must name its language, use unique ids,
 * and every example must refer to a seed that exists in the same file.
 *
 *   npm run audit:playgrounds
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataRoot = path.join(root, 'content/playground-data');
const LANGUAGES = ['html', 'javascript', 'python', 'sql', 'haskell'];
const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const problems = [];
const report = (where, message) => problems.push(`${where}: ${message}`);
const hasCode = (code) => (Array.isArray(code) ? code.some((line) => line.trim()) : typeof code === 'string' && code.trim().length > 0);

let seedCount = 0;
let exampleCount = 0;

for (const language of LANGUAGES) {
  const name = `${language}.json`;
  const file = path.join(dataRoot, name);
  if (!fs.existsSync(file)) {
    report(name, 'missing data file');
    continue;
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    report(name, `invalid JSON (${error.message})`);
    continue;
  }

  if (data.language !== language) report(name, `"language" must be "${language}"`);
  if (!Array.isArray(data.seeds)) report(name, '"seeds" must be an array');
  if (!Array.isArray(data.examples) || data.examples.length === 0) report(name, '"examples" must be a non-empty array');

  const seedIds = new Set();
  for (const seed of data.seeds ?? []) {
    seedCount += 1;
    if (!ID_PATTERN.test(seed.id ?? '')) report(`${name} seed ${seed.id}`, 'id must be lowercase words joined by hyphens');
    if (seedIds.has(seed.id)) report(`${name} seed ${seed.id}`, 'duplicate seed id');
    seedIds.add(seed.id);
    if (!seed.label || !seed.description) report(`${name} seed ${seed.id}`, 'needs a label and a description');
    if (!hasCode(seed.code)) report(`${name} seed ${seed.id}`, 'needs code');
  }

  const exampleIds = new Set();
  for (const example of data.examples ?? []) {
    exampleCount += 1;
    const where = `${name} example ${example.id}`;
    if (!ID_PATTERN.test(example.id ?? '')) report(where, 'id must be lowercase words joined by hyphens');
    if (exampleIds.has(example.id)) report(where, 'duplicate example id');
    exampleIds.add(example.id);
    if (!example.label) report(where, 'needs a label');
    if (!hasCode(example.code)) report(where, 'needs code');
    if (example.seed !== undefined && !seedIds.has(example.seed)) report(where, `refers to unknown seed "${example.seed}"`);
  }
}

if (problems.length > 0) {
  console.error(`Playground data audit found ${problems.length} problem${problems.length === 1 ? '' : 's'}:`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`Playground data audit passed: ${exampleCount} examples and ${seedCount} seed datasets across ${LANGUAGES.length} languages.`);
