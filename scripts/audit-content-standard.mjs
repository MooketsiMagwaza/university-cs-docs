#!/usr/bin/env node
/**
 * Audits every course under content/docs against docs/content-standard.md.
 *
 *   npm run audit:content-standard                 summary table, one row per course
 *   npm run audit:content-standard -- --verbose    every finding, grouped by course
 *   npm run audit:content-standard -- --course csi243
 *   npm run audit:content-standard -- --json       machine-readable findings
 *   npm run audit:content-standard -- --strict     exit 1 when anything fails
 *
 * Checks: the topic shape (folder names, page set and order, and that every Excalidraw canvas
 * points at a real file), the notes template (title, description, repeated title, retired
 * components, quizzes inside notes), and the assessment pages (which components review and
 * practice pages use).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsRoot = path.join(root, 'content/docs');
const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const asJson = args.includes('--json');
const strict = args.includes('--strict');
const courseFilter = args.includes('--course') ? args[args.indexOf('--course') + 1]?.toLowerCase() : undefined;

/* ───────── the standard ───────── */

// Topic pages in their required order. Optional pages may be absent.
const TOPIC_PAGES = ['index', 'notes', 'cheat-sheet', 'review', 'questions', 'resources'];
const REQUIRED_TOPIC_PAGES = ['index', 'notes', 'review', 'questions'];
// The Exam section was removed (no exam papers are available). These page names must not come back.
const REMOVED_TOPIC_PAGES = ['exam', 'exam-practice'];
const COURSE_PAGES = ['index', 'resources'];
const TOPIC_FOLDER = /^\d{2}-[a-z0-9]+(-[a-z0-9]+)*$/;

// Components a notes page may use.
const NOTES_COMPONENTS = new Set([
  'Callout', 'KeyTerm', 'Steps', 'Step', 'LearningObjectives', 'Prerequisites', 'CheckQuestions', 'CheckQuestion',
  'ComparisonTable', 'SiteDiagram', 'Mermaid', 'SafeImage', 'GraphViewer', 'FormulaBlock', 'Tabs', 'Tab',
  'JavaTryIt', 'HaskellTryIt', 'CodeTryIt', 'JavaPlayground', 'HaskellPlayground', 'CodePlayground',
  'InsertionSortStory', 'LinearSearchStory', 'BinarySearchStory', 'BubbleSortStory', 'SelectionSortStory',
  'MergeSortStory', 'MergeFrontWorkbench', 'MergeRecursionExplorer', 'MergeComplexityFigure',
  'PackageImportStory', 'PackageFolderStory', 'PackageBuildStory',
]);

// Assessment components belong on assessment pages, never inside notes.
const QUIZ_COMPONENTS = new Set(['Quiz', 'QuizRef', 'ExamQuestion', 'SubQuestion', 'CheckpointQuiz', 'FlashcardDeck', 'Flashcard']);

// Components the standard replaces; each maps to what replaces it.
const RETIRED = {
  Card: 'KeyTerm or prose',
  HighlightCard: 'KeyTerm or Callout',
  PresetCard: 'Callout',
  ConceptBlock: 'KeyTerm',
  TheoremBlock: 'KeyTerm',
  CommonMistake: 'Callout type="mistake"',
  RecognitionStrategy: 'Callout type="tip"',
  StepByStep: 'Steps',
  StepByStepTitle: 'Steps',
  StepTitle: 'Steps',
  MethodSteps: 'Steps',
  InteractiveStepper: 'Steps',
  StepperStep: 'Steps',
  FumaSteps: 'Steps',
  FumaStep: 'Steps',
  Checklist: 'LearningObjectives and CheckQuestions',
  Accordion: 'a section or CheckQuestions',
  Accordions: 'a section or CheckQuestions',
  LessonIntroduction: 'the page description and LearningObjectives',
  LessonSummary: 'Callout type="key"',
  PracticeCheckpoint: 'CheckQuestions',
  LessonConnection: 'the pager',
  WorkedExample: 'Steps',
  WorkedExampleSet: 'Steps',
  Columns: 'a table or two sections',
  Column: 'a table or two sections',
};

// Generated pages are fixed in their generators (phase 4 of the plan).
const GENERATED = new Set(['TopicNotesFlow', 'ChapterReview', 'ChapterQuestions']);

const ASSESSMENT_COMPONENTS = {
  review: new Set(['FlashcardDeck', 'QuizRef', 'Quiz', 'Callout', 'CommandWords', 'DecodeQuestion', 'KeyTerm', 'Steps', 'Step']),
  questions: new Set(['ExamQuestion', 'SubQuestion', 'Callout', 'KeyTerm', 'Steps', 'Step', 'SiteDiagram', 'ComparisonTable', 'FormulaBlock']),
};

// MDX components that exist: the global registry plus the MAT221 page overrides.
// Anything else that looks like a tag (List<Integer>, <T>) is text, not a component.
const registry = fs.readFileSync(path.join(root, 'components/mdx.tsx'), 'utf8');
const registryBody = registry.slice(registry.indexOf('...defaultMdxComponents'));
const REGISTERED = new Set([...registryBody.matchAll(/^\s+([A-Z][A-Za-z0-9]*),/gm)].map((match) => match[1]));
const MAT221_SOURCE = new Set(['LessonIntro', 'Concept', 'Theorem', 'CheckpointQuiz', 'Mat', 'CalculusDiagram']);
for (const name of [...MAT221_SOURCE, 'Accordion', 'Accordions', 'Callout', 'Tabs', 'Tab']) REGISTERED.add(name);
const isMat221Source = (name) => MAT221_SOURCE.has(name) || name.startsWith('Mat221');

const GENERIC_TITLES = new Set(['notes', 'review', 'questions', 'quiz', 'practice']);

/* ───────── helpers ───────── */

const rel = (file) => path.relative(docsRoot, file).replace(/\\/g, '/');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

function frontmatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  const fields = {};
  if (!match) return fields;
  for (const line of match[1].split(/\r?\n/)) {
    const field = /^([A-Za-z]+):\s*(.*)$/.exec(line);
    if (field) fields[field[1]] = field[2].replace(/^["']|["']$/g, '').trim();
  }
  return fields;
}

/** MDX tag names used on a page, ignoring code fences, inline code and imports. */
function componentsIn(source) {
  const body = source
    .replace(/^---[\s\S]*?\n---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]*`/g, '')
    .replace(/^import .*$/gm, '');
  const counts = new Map();
  for (const [, name] of body.matchAll(/<([A-Z][A-Za-z0-9]*)[\s/>]/g)) counts.set(name, (counts.get(name) ?? 0) + 1);
  return counts;
}

function pagesOf(directory) {
  const metaFile = path.join(directory, 'meta.json');
  return fs.existsSync(metaFile) ? (readJson(metaFile).pages ?? []) : null;
}

/* ───────── audit ───────── */

const findings = [];
const add = (course, rule, where, message) => findings.push({ course, rule, where, message });

/**
 * Sidebar labels (docs/content-standard.md, section 2.1.1). A title carries no number of its own, because the sidebar,
 * the breadcrumb, the topic tabs and the pager add it (lib/topic-pages.ts). Keep this pattern the same as TYPED_NUMBER there.
 */
const TYPED_NUMBER = /^\s*(?:\d+(?:\.\d+)+\s+|\d+[.):]\s+)/;
const COURSE_TITLE = /^[A-Z]{3}\d{3}: \S/;

function auditLabel(course, where, title, what) {
  if (TYPED_NUMBER.test(title)) add(course, 'label-typed-number', where, `${what} title "${title}" has a typed number; the sidebar numbers it`);
  if (/\((?:wip|draft|todo)\)/i.test(title)) add(course, 'label-status', where, `${what} title "${title}" carries a status marker`);
}

/**
 * The topic Overview layout (docs/content-standard.md, section 2.1.2): a title that names the topic, then
 * <LearningObjectives>, <Prerequisites> (each draws its own heading) and "## Pages in this topic", in that order.
 */
const GENERIC_OVERVIEW_TITLE = /^(?:topic \d+ overview|chapter \d+ overview|chapter overview|topic overview|overview)$/i;

function auditOverview(course, file) {
  const source = fs.readFileSync(file, 'utf8');
  const where = rel(file);
  const { title = '' } = frontmatter(source);
  if (GENERIC_OVERVIEW_TITLE.test(title.trim())) add(course, 'overview-title', where, `title "${title}" should be the topic's name`);
  const objectives = source.search(/<LearningObjectives/);
  const prerequisites = source.search(/<Prerequisites/);
  const pages = source.search(/^##\s+Pages in this topic\s*$/im);
  if (objectives < 0) add(course, 'overview-layout', where, 'no LearningObjectives list');
  if (prerequisites < 0) add(course, 'overview-layout', where, 'no Prerequisites list');
  if (pages < 0) add(course, 'overview-layout', where, 'missing "## Pages in this topic"');
  if (objectives >= 0 && prerequisites >= 0 && objectives > prerequisites) add(course, 'overview-layout', where, 'Prerequisites comes before LearningObjectives');
  if (prerequisites >= 0 && pages >= 0 && prerequisites > pages) add(course, 'overview-layout', where, '"## Pages in this topic" comes before Prerequisites');
}

function auditNotesPage(course, file) {
  const source = fs.readFileSync(file, 'utf8');
  const where = rel(file);
  const { title = '', description = '' } = frontmatter(source);
  auditLabel(course, where, title, 'lesson');
  if (!title || GENERIC_TITLES.has(title.toLowerCase())) add(course, 'notes-title', where, `title "${title}" does not name the lesson`);
  if (!description) add(course, 'notes-description', where, 'no description');
  const headings = [...source.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim().toLowerCase());
  if (title && headings.includes(title.toLowerCase())) add(course, 'notes-repeated-title', where, `a ## heading repeats the title "${title}"`);

  for (const [name, count] of componentsIn(source)) {
    if (!REGISTERED.has(name)) continue;
    if (isMat221Source(name)) add(course, 'generated', where, `${name} (MAT221 source site; replaced by the rebuild)`);
    else if (QUIZ_COMPONENTS.has(name)) add(course, 'notes-quiz', where, `${name} ×${count} inside the notes; move to Check your understanding or the review page`);
    else if (GENERATED.has(name)) add(course, 'generated', where, `${name} (generated page; fixed in its generator)`);
    else if (RETIRED[name]) add(course, 'retired-component', where, `${name} ×${count}; use ${RETIRED[name]}`);
    else if (!NOTES_COMPONENTS.has(name)) add(course, 'unlisted-component', where, `${name} ×${count} is not in the notes vocabulary`);
  }
}

function auditAssessmentPage(course, file, kind) {
  const source = fs.readFileSync(file, 'utf8');
  const where = rel(file);
  for (const [name, count] of componentsIn(source)) {
    if (!REGISTERED.has(name)) continue;
    if (GENERATED.has(name)) add(course, 'generated', where, `${name} (generated page; fixed in its generator)`);
    else if (isMat221Source(name)) add(course, 'generated', where, `${name} (MAT221 source site; replaced by the rebuild)`);
    else if (!ASSESSMENT_COMPONENTS[kind].has(name)) add(course, 'assessment-component', where, `${name} ×${count} on a ${kind} page`);
  }
}

function auditTopic(course, directory) {
  const name = path.basename(directory);
  const where = rel(directory);
  if (!TOPIC_FOLDER.test(name)) add(course, 'topic-folder-name', where, 'topic folder is not numbered as NN-slug');

  const pages = pagesOf(directory);
  if (!pages) {
    add(course, 'topic-meta', where, 'no meta.json');
    return;
  }
  auditLabel(course, rel(path.join(directory, 'meta.json')), readJson(path.join(directory, 'meta.json')).title ?? '', 'topic');
  const overview = path.join(directory, 'index.mdx');
  if (fs.existsSync(overview)) {
    auditLabel(course, rel(overview), frontmatter(fs.readFileSync(overview, 'utf8')).title ?? '', 'Overview');
    auditOverview(course, overview);
  }
  const known = pages.filter((page) => TOPIC_PAGES.includes(page.replace(/\.mdx$/, '')));
  for (const page of pages) {
    if (REMOVED_TOPIC_PAGES.includes(page)) add(course, 'topic-extra-page', where, `"${page}": the Exam section was removed`);
    else if (!TOPIC_PAGES.includes(page)) add(course, 'topic-extra-page', where, `"${page}" is not a standard topic page`);
  }
  for (const page of REMOVED_TOPIC_PAGES) {
    if (fs.existsSync(path.join(directory, `${page}.mdx`))) add(course, 'topic-extra-page', where, `${page}.mdx exists, but the Exam section was removed`);
  }
  for (const page of REQUIRED_TOPIC_PAGES) {
    if (!pages.includes(page)) add(course, 'topic-missing-page', where, `missing ${page}`);
  }
  const ordered = [...known].sort((a, b) => TOPIC_PAGES.indexOf(a) - TOPIC_PAGES.indexOf(b));
  if (known.join() !== ordered.join()) add(course, 'topic-order', where, `pages out of order: ${known.join(', ')}`);

  // Notes: notes.mdx or every page in notes/.
  const notesFile = path.join(directory, 'notes.mdx');
  const notesDir = path.join(directory, 'notes');
  if (fs.existsSync(notesFile)) auditNotesPage(course, notesFile);
  if (fs.existsSync(notesDir)) {
    for (const entry of fs.readdirSync(notesDir).filter((file) => file.endsWith('.mdx'))) auditNotesPage(course, path.join(notesDir, entry));
  }
  // Non-standard pages that hold teaching content are audited as notes too.
  for (const page of pages) {
    const file = path.join(directory, `${page}.mdx`);
    if (!TOPIC_PAGES.includes(page) && !REMOVED_TOPIC_PAGES.includes(page) && fs.existsSync(file)) auditNotesPage(course, file);
  }
  for (const [page, kind] of [['review', 'review'], ['questions', 'questions']]) {
    const file = path.join(directory, `${page}.mdx`);
    if (fs.existsSync(file)) auditAssessmentPage(course, file, kind);
  }
}

/** Every Excalidraw canvas a course embeds must point at a file under public/. */
function auditCanvases(course, directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      auditCanvases(course, full);
      continue;
    }
    if (!entry.name.endsWith('.mdx')) continue;
    const source = fs.readFileSync(full, 'utf8');
    for (const [, src] of source.matchAll(/<ExcalidrawCanvas\b[^>]*?\bsrc="([^"]+)"/g)) {
      if (!fs.existsSync(path.join(root, 'public', src))) add(course, 'canvas-file', rel(full), `canvas file ${src} does not exist`);
    }
  }
}

const courses = [];
for (const semester of fs.readdirSync(docsRoot).filter((entry) => /^sem\d+$/.test(entry)).sort()) {
  const semesterDir = path.join(docsRoot, semester);
  for (const courseName of fs.readdirSync(semesterDir).sort()) {
    const courseDir = path.join(semesterDir, courseName);
    if (!fs.statSync(courseDir).isDirectory()) continue;
    if (courseFilter && courseName !== courseFilter) continue;
    const course = `${semester}/${courseName}`;
    courses.push(course);

    const courseMeta = path.join(courseDir, 'meta.json');
    const courseTitle = fs.existsSync(courseMeta) ? readJson(courseMeta).title ?? '' : '';
    if (!COURSE_TITLE.test(courseTitle)) add(course, 'label-course-title', rel(courseMeta), `course title "${courseTitle}" is not "CODE: Title"`);
    const pages = pagesOf(courseDir) ?? [];
    const topics = [];
    for (const page of pages) {
      if (page.startsWith('---')) {
        add(course, 'course-separator', course, `sidebar separator "${page}"`);
        continue;
      }
      const child = path.join(courseDir, page);
      if (fs.existsSync(child) && fs.statSync(child).isDirectory()) topics.push(child);
      else if (!COURSE_PAGES.includes(page)) add(course, 'course-extra-page', course, `"${page}" is not a course overview, topic or resources page`);
    }
    for (const page of COURSE_PAGES) {
      if (!pages.includes(page)) add(course, 'course-missing-page', course, `missing ${page}`);
    }
    if (topics.length === 0) add(course, 'course-no-topics', course, 'no topic folders');
    for (const topic of topics) auditTopic(course, topic);
    auditCanvases(course, courseDir);
  }
}

/* ───────── report ───────── */

if (asJson) {
  process.stdout.write(`${JSON.stringify({ courses, findings }, null, 2)}\n`);
} else {
  const groups = {
    structure: ['topic-folder-name', 'topic-meta', 'topic-extra-page', 'topic-missing-page', 'topic-order', 'course-extra-page', 'course-missing-page', 'course-separator', 'course-no-topics', 'canvas-file', 'label-typed-number', 'label-status', 'label-course-title', 'overview-title', 'overview-layout'],
    notes: ['notes-title', 'notes-description', 'notes-repeated-title', 'notes-quiz', 'retired-component', 'unlisted-component'],
    assessment: ['assessment-component'],
    generated: ['generated'],
  };
  const count = (course, rules) => findings.filter((finding) => finding.course === course && rules.includes(finding.rule)).length;
  const rows = courses.map((course) => [course, ...Object.values(groups).map((rules) => count(course, rules))]);
  const header = ['course', 'structure', 'notes', 'assessment', 'generated'];
  const widths = header.map((title, i) => Math.max(title.length, ...rows.map((row) => String(row[i]).length)));
  const line = (cells) => cells.map((cell, i) => (i === 0 ? String(cell).padEnd(widths[i]) : String(cell).padStart(widths[i]))).join('  ');
  console.log(line(header));
  console.log(widths.map((width) => '-'.repeat(width)).join('  '));
  for (const row of rows) console.log(line(row));
  const passing = rows.filter((row) => row.slice(1).every((value) => value === 0)).length;
  console.log(`\n${passing} of ${courses.length} courses meet the content standard; ${findings.length} findings.`);

  if (verbose) {
    for (const course of courses) {
      const own = findings.filter((finding) => finding.course === course);
      if (own.length === 0) continue;
      console.log(`\n${course}`);
      for (const finding of own) console.log(`  [${finding.rule}] ${finding.where}: ${finding.message}`);
    }
  } else if (findings.length) {
    console.log('Run with --verbose for every finding, or --course <code> for one course.');
  }
}

if (strict && findings.length) process.exit(1);
