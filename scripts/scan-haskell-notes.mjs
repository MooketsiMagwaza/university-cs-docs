#!/usr/bin/env node
/**
 * Scans the CSI243 notes for Haskell examples and runs each one through the in-browser simulator
 * (lib/haskell-simulator.ts), so a change to the simulator shows how many of the notes' examples it
 * now runs and how many reproduce the GHC output printed next to them.
 *
 *   node --no-warnings --experimental-strip-types scripts/scan-haskell-notes.mjs
 *
 * Options:
 *   --simulator <path>  scan another simulator file (for example a saved copy, to compare)
 *   --file <text>       only the notes whose path contains this text
 *   --limit <n>         examples to show per failure group (default 1)
 *   --verbose           list every failing example, not one per group
 *   --mismatches        list the examples that ran but printed something other than the shown output
 *   --json <path>       write every result to a JSON file
 *   --explain <text>    print the program, result and shown output of the examples whose file:line contains this text
 *
 * What counts as an example:
 *   - a fenced haskell block, including the child of a <HaskellTryIt> tag. The GHC output shown next to it
 *     is the next fenced text block, when no other haskell block comes first. If that block is a GHCi
 *     transcript (lines that begin with "ghci>"), the transcript's inputs run after the block's code and
 *     its output lines are the expected output.
 *   - a GHCi transcript with no haskell block before it. Its inputs run on their own.
 *
 * How an example runs: on its own first. If that fails only because it uses a name an earlier block of
 * the same page defines (a `main` that calls a function defined in the block above, for instance), it
 * runs again after the page's earlier blocks, which is how a reader meets it. The earlier blocks used are
 * the ones that only define things and still load together; a block that prints is left out. If that is
 * not enough (text that uses a name before the page shows its code) it runs once more with the blocks
 * below it as well. Both kinds are counted separately, so the standalone number stays visible.
 *
 * A program that reads input (getLine, readLn) is run the way the notes show it: the shown text is the
 * terminal with the typed lines echoed in it, so each time the program stops for input the next shown
 * line is taken as the typed line and the program runs again.
 *
 * Examples that show a GHC error as their output pass when the simulator also reports an error; its
 * wording is not compared. Blocks whose own comments call them wrong ("-- Incorrect: ...") and that the
 * simulator rejects with a parse or type error are counted the same way. A GHC warning in the shown text
 * is ignored. Transcripts that use GHCi commands (:type, :info, :load ...) need type inference or GHCi
 * itself, so they are counted and left out of the run and match numbers.
 *
 * A block that only defines things has no output to compare, so the text beside it (a derivation, say)
 * is not held against it. The "ran but printed something else" list needs reading by a person: most of
 * its entries are text that belongs to a neighbouring block, not a wrong answer.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const notesRoot = path.join(root, 'content', 'docs', 'sem3', 'csi243');

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const at = args.indexOf(name);
  return at >= 0 ? args[at + 1] : fallback;
};
const flag = (name) => args.includes(name);
const simulatorPath = path.resolve(root, option('--simulator', 'lib/haskell-simulator.ts'));
const fileFilter = option('--file', '');
const perGroup = Number(option('--limit', '1'));
const verbose = flag('--verbose');
const showMismatches = flag('--mismatches');
const jsonOut = option('--json', '');
const explain = option('--explain', '');

const simulator = await import(pathToFileURL(simulatorPath).href);
// A simulator without input support (an older copy) still runs the programs that need none.
const runHaskellWithInput = simulator.runHaskellWithInput ?? ((source) => simulator.runHaskell(source));

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(notesRoot)
  .filter((file) => /[\\/]notes[\\/][^\\/]+\.mdx$/.test(file))
  .filter((file) => file.includes(fileFilter))
  .sort();

/** GHC warnings (the -Wx-partial note on head, for instance) are not output the simulator is meant to print. */
function withoutWarnings(text) {
  const kept = [];
  let skipping = false;
  for (const line of text.split('\n')) {
    if (/^<interactive>:\d+:\d+: warning:/.test(line)) {
      skipping = true;
      continue;
    }
    if (skipping && /^\s+\S/.test(line)) continue;
    skipping = false;
    kept.push(line);
  }
  return kept.join('\n');
}

/** Every fenced block of a note in order, with the line it starts on and whether a <HaskellTryIt> holds it. */
function extractFences(source) {
  const lines = source.split(/\r?\n/);
  const fences = [];
  let open = null;
  let inTryIt = false;
  let inSession = false;
  lines.forEach((line, index) => {
    if (open) {
      if (new RegExp(`^\\s*${open.ticks}\\s*$`).test(line)) {
        const code = open.buffer.map((text) => text.slice(Math.min(open.indent, text.length - text.trimStart().length))).join('\n');
        fences.push({ ...open, code: open.lang === 'text' ? withoutWarnings(code) : code });
        open = null;
      } else {
        open.buffer.push(line);
      }
      return;
    }
    if (/<HaskellTryIt\b/.test(line)) inTryIt = true;
    if (/<HaskellTryIt\b[^>]*\bsession\b/.test(line)) inSession = true;
    if (/<\/HaskellTryIt>/.test(line)) inTryIt = inSession = false;
    const match = line.match(/^(\s*)(`{3,})\s*([\w-]*)\s*$/);
    if (match) open = { indent: match[1].length, ticks: match[2], lang: match[3], line: index + 1, buffer: [], tryIt: inTryIt, session: inSession };
  });
  return fences;
}

const PROMPT = /^(?:ghci|Prelude|\*?Main)>\s?(.*)$/;

/** Splits a GHCi transcript into inputs and the output lines that follow each. Null if it is not one. */
function parseTranscript(text) {
  const entries = [];
  for (const line of text.split(/\r?\n/)) {
    const prompt = line.match(PROMPT);
    if (prompt) entries.push({ input: prompt[1], output: [] });
    else if (entries.length > 0) entries[entries.length - 1].output.push(line);
  }
  // Blank lines only separate the entries of a transcript.
  for (const entry of entries) while (entry.output.length > 0 && entry.output[entry.output.length - 1].trim() === '') entry.output.pop();
  return entries.length > 0 ? entries : null;
}

const ERROR_SHOWN = /error:|\*\*\* Exception|Exception:|<interactive>|^\S+\.hs:\d+:\d+|Prelude\.\w+: |non-exhaustive|Non-exhaustive/m;

const normalise = (text) =>
  text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .replace(/^\n+|\n+$/g, '');

const definesMain = (code) => /^main\s*(::|=|\s)/m.test(code);

const examples = [];
const blocksByFile = [];

for (const file of files) {
  const relative = path.relative(root, file).replace(/\\/g, '/');
  const fences = extractFences(fs.readFileSync(file, 'utf8'));
  blocksByFile.push({ file: relative, haskell: fences.filter((fence) => fence.lang === 'haskell').length });

  fences.forEach((fence, index) => {
    const next = fences[index + 1];
    const previous = fences[index - 1];

    if (fence.lang === 'haskell' && fence.session) {
      // <HaskellTryIt session>: this fence holds the commands, the text fence after it is the transcript the page shows.
      const shownSession = next && next.lang === 'text' ? next : undefined;
      const sessionTranscript = shownSession ? parseTranscript(shownSession.code) : null;
      if (sessionTranscript) {
        examples.push({
          file: relative,
          line: fence.line,
          tryIt: true,
          fenceIndex: index,
          code: '',
          shownLine: shownSession.line,
          transcript: sessionTranscript,
          shownIsError: ERROR_SHOWN.test(shownSession.code),
          kind: 'transcript-only',
        });
        return;
      }
    }
    if (fence.lang === 'haskell') {
      const shown = next && next.lang === 'text' ? next : undefined;
      const transcript = shown ? parseTranscript(shown.code) : null;
      examples.push({
        file: relative,
        line: fence.line,
        tryIt: fence.tryIt,
        fenceIndex: index,
        code: fence.code,
        shownLine: shown?.line,
        transcript,
        shown: shown && !transcript ? shown.code : undefined,
        shownIsError: Boolean(shown) && ERROR_SHOWN.test(shown.code),
        kind: transcript ? 'transcript' : shown ? 'program' : 'plain',
      });
    } else if (fence.lang === 'text' && previous?.lang !== 'haskell') {
      const transcript = parseTranscript(fence.code);
      if (transcript) {
        examples.push({
          file: relative,
          line: fence.line,
          tryIt: false,
          fenceIndex: index,
          code: '',
          shownLine: fence.line,
          transcript,
          shownIsError: ERROR_SHOWN.test(fence.code),
          kind: 'transcript-only',
        });
      }
    }
  });
}

const META = /^\s*:/;
const INTENDED_ERROR = /--.*\b(error|rejected|incorrect|wrong|invalid|illegal|not allowed|will not compile|does not compile|type clash)\b/i;
const NEEDS_INPUT = /\b(getLine|readLn|getChar)\b/;

function attempt(source, stdin = '') {
  try {
    return runHaskellWithInput(source, stdin);
  } catch (error) {
    return { ok: false, output: '', diagnostic: { kind: 'Runtime error', message: `The simulator threw: ${error instanceof Error ? error.message : error}` } };
  }
}

/** The haskell blocks of a page, in page order. */
const pageBlocks = new Map();
function blocksOf(file) {
  if (!pageBlocks.has(file)) {
    const fences = extractFences(fs.readFileSync(path.join(root, file), 'utf8'));
    pageBlocks.set(
      file,
      // A session's commands are not definitions the page's other examples can use.
      fences.map((fence, index) => (fence.lang === 'haskell' && !fence.session ? { index, code: fence.code, main: definesMain(fence.code) } : null)),
    );
  }
  return pageBlocks.get(file);
}

const JOIN = '\n\nscanBlockEnd = ()\n\n';
const withoutModuleHeader = (code) => code.replace(/^module\s[^\n]*\bwhere[ \t]*$/m, '');

/**
 * Tries a block after the ones already kept. A block that only defines things is kept when the whole still loads;
 * one that prints would add its output to the example. Blocks that run a program (they define main) are kept only
 * for a transcript, which may call main, and are tried against the definitions alone.
 */
function keepIfDefinitions(state, block, withMain) {
  if (!block || (!withMain && block.main)) return state;
  const code = withoutModuleHeader(block.code);
  const result = attempt([...state.defs, code].join(JOIN));
  if (!result.ok) return state;
  if (block.main) return { defs: state.defs, kept: [...state.kept, code] };
  if (!/^(Definitions loaded|No output)/.test(result.output)) return state;
  return { defs: [...state.defs, code], kept: [...state.kept, code] };
}

const earlierCache = new Map();

/** For each position on the page, the earlier blocks that serve as context there. */
function earlierContexts(file, withMain) {
  const key = `${file}|${withMain}`;
  if (!earlierCache.has(key)) {
    const prefixes = [];
    let state = { defs: [], kept: [] };
    blocksOf(file).forEach((block, index) => {
      prefixes[index] = state.kept;
      state = keepIfDefinitions(state, block, withMain);
    });
    earlierCache.set(key, prefixes);
  }
  return earlierCache.get(key);
}

/**
 * The blocks of the same page to run before an example. By default the ones above it, as a reader meets them. With
 * wholePage, the ones below it come first and the ones above override them, for text that uses a name before it
 * shows the code.
 */
function pageContext(example, withMain, wholePage = false) {
  if (!wholePage) return earlierContexts(example.file, withMain)[example.fenceIndex];
  const blocks = blocksOf(example.file);
  let state = { defs: [], kept: [] };
  for (const block of [...blocks.slice(example.fenceIndex + 1), ...blocks.slice(0, example.fenceIndex)]) {
    state = keepIfDefinitions(state, block, withMain);
  }
  return state.kept;
}

function programFor(example, context) {
  const parts = [...context];
  if (example.code) parts.push(example.code);
  // A binding between blocks keeps the last equations of one block from joining the first equations of the next.
  const program = parts.join('\n\nscanBlockEnd = ()\n\n');
  if (!example.transcript) return program;
  const session = example.transcript.map((entry) => `ghci> ${entry.input}`).join('\n');
  return program === '' ? session : `${program}\n\n${session}`;
}

function expectedFor(example) {
  if (example.transcript) {
    return normalise(example.transcript.map((entry) => entry.output.join('\n')).filter((text) => text.trim() !== '').join('\n'));
  }
  return example.shown === undefined ? undefined : normalise(example.shown);
}

/**
 * Runs a program that reads input, the way the notes show it: the shown text is the terminal, with what the
 * reader typed echoed in it. Each time the program asks for a line the run stops at end of file, the next
 * line of the shown text after what has been printed is taken as the typed line, and the program runs again.
 */
function runWithTyping(source, shown) {
  const typed = [];
  const positions = [];
  const spliced = (output, count) => {
    let text = '';
    let last = 0;
    for (let i = 0; i < count; i += 1) {
      text += output.slice(last, positions[i]) + typed[i] + '\n';
      last = positions[i];
    }
    return text + output.slice(last);
  };
  const target = `${shown.replace(/\r\n/g, '\n').replace(/\s+$/, '')}\n`;
  for (let round = 0; round < 12; round += 1) {
    const result = attempt(source, typed.map((line) => `${line}\n`).join(''));
    if (result.ok) return { run: result, transcript: spliced(result.output, typed.length) };
    if (!/end of file/.test(result.diagnostic?.message ?? '')) return { run: result, transcript: undefined };
    const so_far = spliced(result.output, typed.length);
    if (!target.startsWith(so_far) || target.length === so_far.length) return { run: result, transcript: undefined };
    const next = target.slice(so_far.length).split('\n')[0];
    positions.push(result.output.length);
    typed.push(next);
  }
  return { run: attempt(source), transcript: undefined };
}

const failureKey = (result) => `${result.diagnostic?.kind ?? 'Error'}: ${(result.diagnostic?.message ?? 'unknown').split('\n')[0]}`;

const results = [];
for (const example of examples) {
  const result = { ...example, status: '', via: 'alone', failure: '', got: '' };
  results.push(result);

  if (example.transcript?.some((entry) => META.test(entry.input))) {
    result.status = 'skipped';
    result.failure = 'GHCi command in the transcript (:type, :info, :load ...)';
    continue;
  }
  if (example.kind === 'transcript-only' && example.transcript.every((entry) => entry.input.trim() === '')) {
    result.status = 'skipped';
    result.failure = 'empty transcript';
    continue;
  }

  const expected = expectedFor(example);
  const run = (source) => {
    if (NEEDS_INPUT.test(source) && expected !== undefined) return runWithTyping(source, expected);
    return { run: attempt(source), transcript: undefined };
  };

  let outcome = run(programFor(example, []));
  const wanted = explain && `${example.file}:${example.line}`.includes(explain);
  let usedContext = [];
  if (!outcome.run.ok && /not in scope/i.test(outcome.run.diagnostic?.message ?? '')) {
    const withMain = Boolean(example.transcript);
    // First the blocks above the example, as a reader meets them; then the whole page, for text that uses a name before it shows the code.
    for (const [tier, wholePage] of [['page', false], ['later', true]]) {
      const context = pageContext(example, withMain, wholePage);
      if (context.length === 0) continue;
      const again = run(programFor(example, context));
      if (again.run.ok) {
        outcome = again;
        result.via = tier;
        usedContext = context;
        break;
      }
      if (wanted) {
        console.log(`--- with ${context.length} blocks from the page (${tier}) it failed:`, JSON.stringify(again.run.diagnostic));
        console.log(programFor(example, context));
      }
    }
  }
  const attemptResult = outcome.run;
  if (wanted) {
    console.log(`--- ${example.file}:${example.line} (${example.kind}, ${result.via})`);
    console.log(programFor(example, usedContext));
    console.log('--- result:', JSON.stringify({ ok: attemptResult.ok, output: attemptResult.output, diagnostic: attemptResult.diagnostic }, null, 1));
    console.log('--- shown:', JSON.stringify(expected));
  }

  if (example.shownIsError) {
    result.status = attemptResult.ok ? 'error-not-reproduced' : 'error-reproduced';
    if (attemptResult.ok) result.failure = 'GHC shows an error here but the simulator ran it without one';
    continue;
  }

  if (!attemptResult.ok && expected === undefined && /end of file/.test(attemptResult.diagnostic?.message ?? '') && NEEDS_INPUT.test(programFor(example, usedContext))) {
    // No output is shown to compare with, and the program ran up to the point where it waits for typed input.
    result.status = 'ran';
    result.waitsForInput = true;
    continue;
  }

  if (!attemptResult.ok && INTENDED_ERROR.test(example.code) && attemptResult.diagnostic && attemptResult.diagnostic.kind !== 'Runtime error') {
    // The block's own comments say it is wrong, and the simulator rejects it too.
    result.status = 'error-reproduced';
    result.intendedError = true;
    continue;
  }

  if (!attemptResult.ok) {
    result.status = 'failed';
    result.failure = failureKey(attemptResult);
    continue;
  }

  result.got = normalise(outcome.transcript ?? attemptResult.output);
  const executed = !/^(Definitions loaded\.|No output\.)/.test(result.got);
  if (expected === undefined) {
    result.status = 'ran';
  } else if (!executed && !example.transcript) {
    // The block only defines things, so the text beside it is not its output (a derivation, for instance).
    result.status = 'ran';
    result.shownNotOutput = true;
  } else if (result.got === expected) {
    result.status = 'match';
  } else {
    result.status = 'mismatch';
    result.expected = expected;
  }
}

const count = (predicate) => results.filter(predicate).length;
const haskellBlocks = blocksByFile.reduce((sum, item) => sum + item.haskell, 0);
const inScope = results.filter((item) => item.status !== 'skipped');
const withShownOutput = inScope.filter((item) => item.kind !== 'plain' && !item.shownIsError);
const ranOk = inScope.filter((item) => ['ran', 'match', 'mismatch'].includes(item.status));
const matched = count((item) => item.status === 'match');
const shownMismatch = count((item) => item.status === 'mismatch');
const ranStatuses = ['ran', 'match', 'mismatch'];
const viaPage = results.filter((item) => item.via === 'page' && ranStatuses.includes(item.status));
const viaLater = results.filter((item) => item.via === 'later' && ranStatuses.includes(item.status));
const matchedViaPage = viaPage.filter((item) => item.status === 'match').length;
const matchedViaLater = viaLater.filter((item) => item.status === 'match').length;
const tryItResults = results.filter((item) => item.tryIt);

const line = (label, value, note = '') => console.log(`  ${label.padEnd(54)}${String(value).padStart(5)}${note ? `   ${note}` : ''}`);

console.log(`Haskell notes scan: ${files.length} notes under ${path.relative(root, notesRoot).replace(/\\/g, '/')}`);
console.log(`Simulator: ${path.relative(root, simulatorPath).replace(/\\/g, '/')}\n`);
line('Haskell blocks (fenced, including inside <HaskellTryIt>)', haskellBlocks);
line('Examples (blocks, plus transcripts with no block before them)', results.length);
line('  with GHC output or a transcript shown next to them', count((item) => item.kind !== 'plain'));
line('  skipped: transcripts that use GHCi commands (:type ...)', count((item) => item.status === 'skipped'));
line('  where GHC shows an error', count((item) => item.shownIsError), `simulator also errors: ${count((item) => item.status === 'error-reproduced' && item.shownIsError)}`);
line('  marked wrong in their own comments, rejected by the simulator', count((item) => item.intendedError));
console.log('');
line('Examples in scope (not skipped)', inScope.length);
line('  RUN without an error', ranOk.length + count((item) => item.status === 'error-reproduced'), `of ${inScope.length}`);
line('  MATCH the shown output', matched, `of ${withShownOutput.length} that show output`);
line('  ran but printed something else', shownMismatch);
line('  of those that ran, stopped to wait for typed input', count((item) => item.waitsForInput), 'run with runHaskellWithInput to feed them');
line('  needed the page\'s earlier blocks to run', viaPage.length, `${matchedViaPage} of them match`);
line('  needed blocks lower on the page (text uses a name early)', viaLater.length, `${matchedViaLater} of them match`);
line('  on their own: run / match', `${ranOk.length - viaPage.length - viaLater.length} / ${matched - matchedViaPage - matchedViaLater}`);
line('<HaskellTryIt> blocks that run without an error', tryItResults.filter((item) => ['ran', 'match', 'mismatch', 'error-reproduced'].includes(item.status)).length, `of ${tryItResults.length}`);
line('<HaskellTryIt> blocks that match the shown output', tryItResults.filter((item) => item.status === 'match').length, `of ${tryItResults.filter((item) => item.kind !== 'plain' && !item.shownIsError).length} that show output`);

const failed = results.filter((item) => item.status === 'failed' || item.status === 'error-not-reproduced');
const groups = new Map();
for (const item of failed) {
  const key = item.failure;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(item);
}

const preview = (item) => {
  const first = (item.code || item.transcript?.map((entry) => `ghci> ${entry.input}`).join(' ; ') || '').split('\n').filter(Boolean).slice(0, 2).join(' / ');
  return first.length > 100 ? `${first.slice(0, 97)}...` : first;
};

console.log(`\nFailures by cause (${failed.length} examples, ${groups.size} causes)\n`);
for (const [key, items] of [...groups].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`${String(items.length).padStart(4)}  ${key}`);
  for (const item of items.slice(0, verbose ? items.length : perGroup)) {
    console.log(`        ${item.file.replace('content/docs/sem3/csi243/', '')}:${item.line}   ${preview(item)}`);
  }
}

if (showMismatches) {
  const mismatches = results.filter((item) => item.status === 'mismatch');
  console.log(`\nRan but printed something other than the shown output (${mismatches.length})\n`);
  for (const item of mismatches) {
    console.log(`  ${item.file.replace('content/docs/sem3/csi243/', '')}:${item.line}   ${preview(item)}`);
    console.log(`      shown: ${JSON.stringify(item.expected).slice(0, 160)}`);
    console.log(`      got:   ${JSON.stringify(item.got).slice(0, 160)}`);
  }
}

if (jsonOut) {
  fs.writeFileSync(
    path.resolve(root, jsonOut),
    JSON.stringify(results.map(({ transcript, ...rest }) => ({ ...rest, transcriptInputs: transcript?.map((entry) => entry.input) })), null, 2),
  );
  console.log(`\nWrote ${jsonOut}`);
}
