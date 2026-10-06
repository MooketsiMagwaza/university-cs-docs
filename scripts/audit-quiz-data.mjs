#!/usr/bin/env node
/**
 * Audits quiz data under content/quiz-data and the <QuizRef /> references in content/docs.
 *
 *   npm run audit:quizzes
 *
 * Fails (exit code 1) when a data file is malformed, a reference points at a missing file or quiz id,
 * or a quiz is defined but never referenced.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataRoot = path.join(root, 'content/quiz-data');
const docsRoot = path.join(root, 'content/docs');

const problems = [];
const report = (where, message) => problems.push(`${where}: ${message}`);

function walk(directory, extension) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(full, extension);
    return entry.name.endsWith(extension) ? [full] : [];
  });
}

const rel = (file, base) => path.relative(base, file).replace(/\\/g, '/');
const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// 1. Data files
const definedQuizzes = new Map(); // "src#id" -> true
let questionCount = 0;

for (const file of walk(dataRoot, '.json')) {
  const name = rel(file, dataRoot);
  if (name === 'quiz.schema.json') continue;

  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    report(name, `invalid JSON (${error.message})`);
    continue;
  }

  const src = name.replace(/\.json$/, '');
  const quizzes = data.quizzes;
  if (!quizzes || typeof quizzes !== 'object' || Object.keys(quizzes).length === 0) {
    report(name, 'needs a non-empty "quizzes" object');
    continue;
  }

  for (const [id, quiz] of Object.entries(quizzes)) {
    const where = `${name} #${id}`;
    definedQuizzes.set(`${src}#${id}`, true);
    if (!ID_PATTERN.test(id)) report(where, 'quiz ids must be lowercase words joined by hyphens');
    if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      report(where, 'needs at least one question');
      continue;
    }

    quiz.questions.forEach((question, index) => {
      const at = `${where} question ${index + 1}`;
      questionCount += 1;
      if (typeof question.question !== 'string' || !question.question.trim()) report(at, 'missing question text');
      if (!Array.isArray(question.options) || question.options.length < 2) {
        report(at, 'needs at least two options');
        return;
      }
      if (question.options.some((option) => typeof option !== 'string' || !option.trim())) report(at, 'options must be non-empty strings');
      if (new Set(question.options).size !== question.options.length) report(at, 'options must be distinct');
      if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex >= question.options.length) {
        report(at, 'correctIndex is out of range');
      }
      if (question.optionFeedback !== undefined && question.optionFeedback.length !== question.options.length) {
        report(at, 'optionFeedback must have one entry per option');
      }
      if (question.code !== undefined && typeof question.code !== 'string' && !(Array.isArray(question.code) && question.code.every((line) => typeof line === 'string'))) {
        report(at, 'code must be a string or an array of strings');
      }
    });
  }
}

// 2. References from MDX
const referenced = new Set();
const referencePattern = /<QuizRef\s+src="([^"]+)"\s+id="([^"]+)"\s*\/>/g;
for (const file of walk(docsRoot, '.mdx')) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(referencePattern)) {
    const [, src, id] = match;
    const key = `${src}#${id}`;
    referenced.add(key);
    if (!fs.existsSync(path.join(dataRoot, `${src}.json`))) report(rel(file, docsRoot), `QuizRef points at missing file content/quiz-data/${src}.json`);
    else if (!definedQuizzes.has(key)) report(rel(file, docsRoot), `QuizRef id "${id}" is not defined in content/quiz-data/${src}.json`);
  }
  // Catch references written in a form the pattern above cannot read.
  const tagCount = (source.match(/<QuizRef\b/g) || []).length;
  const parsedCount = [...source.matchAll(referencePattern)].length;
  if (tagCount !== parsedCount) report(rel(file, docsRoot), 'a <QuizRef /> tag is not in the form <QuizRef src="..." id="..." />');
}

// 3. Unreferenced quizzes
for (const key of definedQuizzes.keys()) {
  if (!referenced.has(key)) report(key.replace('#', ' #'), 'quiz is defined but not referenced by any page');
}

if (problems.length > 0) {
  console.error(`Quiz data audit found ${problems.length} problem${problems.length === 1 ? '' : 's'}:`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`Quiz data audit passed: ${definedQuizzes.size} quizzes, ${questionCount} questions, ${referenced.size} references.`);
