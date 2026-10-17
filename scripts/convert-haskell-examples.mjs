#!/usr/bin/env node
/**
 * Turns the Haskell code blocks of the CSI243 notes that already run in the in-browser interpreter into
 * Try it yourself examples, so the notes stop showing code that only sits there (work order TRY-02).
 *
 *   node --no-warnings --experimental-strip-types scripts/convert-haskell-examples.mjs            (dry run)
 *   node --no-warnings --experimental-strip-types scripts/convert-haskell-examples.mjs --apply    (write the notes)
 *
 * Options:
 *   --apply             write the changed notes (the default only prints what would change)
 *   --file <text>       only the notes whose path contains this text
 *   --verbose           list every converted block and every skipped block that looked as if it qualified
 *   --pairs-need-main   do not convert a pair whose program has no `main` (a GHCi-style snippet such as `3 * 20`)
 *   --scan-json <path>  use a saved result of `scan-haskell-notes.mjs --json` instead of running the scan
 *   --simulator <path>  the interpreter to check with (default lib/haskell-simulator.ts)
 *
 * What it converts. A fenced haskell block becomes
 *
 *     <HaskellTryIt>
 *
 *     ```haskell
 *     main = print (sum [1..10])
 *     ```
 *
 *     ```text
 *     55
 *     ```
 *
 *     </HaskellTryIt>
 *
 * when the page shows the program's output in a fenced text block straight after it (one blank line between), or
 * with only the haskell fence when nothing is shown and the program has a `main` and prints something. The
 * output block, when there is one, is the output the reader sees until they press Run.
 *
 * Which blocks. The decision about whether a block runs, runs on its own and matches the text beside it is the
 * scan's (scripts/scan-haskell-notes.mjs, run with --json), not a second copy of its logic: only an example the
 * scan reports as "program, match, on its own" (a pair) or "plain, ran, on its own" (a single block) is a
 * candidate (the scan's headline "on their own: match" number also counts GHCi transcripts, which are left as
 * they are, so it is larger than the number of pairs here). The block is then run again here, through the same
 * interpreter, as a check that the text beside it
 * equals what it prints exactly (the scan ignores GHC warnings in the text; this does not). A candidate is skipped when
 *   - its fence is indented, has anything after the language, or sits inside a JSX tag that is still open
 *     (Callout, Steps, Tabs, CheckQuestion and so on), or is already the child of a HaskellTryIt;
 *   - it reads input (getLine, readLn, getChar, getContents, interact);
 *   - its comments call it wrong or an error (the scan's own test for blocks that are meant not to compile);
 *   - the text block is not a plain `text` fence one blank line below it (a GHCi transcript, or prose elsewhere);
 *   - a single block has no `main`, or prints nothing.
 * Every other block is left exactly as it is, and the file keeps its own line endings.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const notesRoot = path.join(root, 'content', 'docs', 'sem3', 'csi243');
const scanScript = path.join(root, 'scripts', 'scan-haskell-notes.mjs');

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const at = args.indexOf(name);
  return at >= 0 ? args[at + 1] : fallback;
};
const flag = (name) => args.includes(name);
const apply = flag('--apply');
const verbose = flag('--verbose');
const pairsNeedMain = flag('--pairs-need-main');
const fileFilter = option('--file', '');
const scanJson = option('--scan-json', '');
const simulatorPath = path.resolve(root, option('--simulator', 'lib/haskell-simulator.ts'));

const simulator = await import(pathToFileURL(simulatorPath).href);
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

/** The scan's own results (the same classification of every example), by "file:line" of the opening fence. */
function loadScan() {
  if (scanJson) return JSON.parse(fs.readFileSync(path.resolve(root, scanJson), 'utf8'));
  const temporary = path.join(os.tmpdir(), `scan-haskell-notes-${process.pid}.json`);
  try {
    execFileSync(process.execPath, ['--no-warnings', '--experimental-strip-types', scanScript, '--simulator', simulatorPath, '--json', temporary], {
      cwd: root,
      stdio: ['ignore', 'ignore', 'inherit'],
      maxBuffer: 64 * 1024 * 1024,
    });
    return JSON.parse(fs.readFileSync(temporary, 'utf8'));
  } finally {
    fs.rmSync(temporary, { force: true });
  }
}

const scanResults = new Map(loadScan().map((item) => [`${item.file}:${item.line}`, item]));

/** Same comparison as the scan: line endings and trailing spaces do not count, nor blank lines at either end. */
const normalise = (text) =>
  text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .replace(/^\n+|\n+$/g, '');

const definesMain = (code) => /^main\s*(::|=|\s)/m.test(code);
const READS_INPUT = /\b(getLine|readLn|getChar|getContents|interact)\b/;
// The scan's test for a block whose own comments call it wrong or an error.
const INTENDED_ERROR = /--.*\b(error|rejected|incorrect|wrong|invalid|illegal|not allowed|will not compile|does not compile|type clash)\b/i;
const GHC_WARNING = /^<interactive>:\d+:\d+: warning:/m;

/**
 * Follows the JSX tags of a page, line by line, outside code fences, so each fence knows how many tags are open
 * around it. Inline code, inline and display math, and escaped angle brackets are not tags.
 */
function makeTracker() {
  const VOID = new Set(['br', 'hr', 'img', 'input', 'wbr', 'area', 'base', 'col', 'embed', 'link', 'meta', 'source', 'track']);
  const stack = [];
  const opened = new Map();
  let pending = null;
  let inDisplayMath = false;
  let broken = false;

  const finish = () => {
    const { name, closing, selfClosing } = pending;
    pending = null;
    if (closing) {
      if (stack.length > 0 && stack[stack.length - 1] === name) stack.pop();
      else broken = true;
      return;
    }
    opened.set(name, (opened.get(name) ?? 0) + 1);
    if (!selfClosing && !VOID.has(name)) stack.push(name);
  };

  const feed = (line) => {
    let i = 0;
    while (i < line.length) {
      const ch = line[i];
      if (pending) {
        if (pending.quote) {
          // Inside a JavaScript expression a backslash escapes the next character (an apostrophe in a string, say).
          if (ch === '\\' && pending.braces > 0) {
            i += 2;
            continue;
          }
          if (ch === pending.quote) pending.quote = '';
        } else if (ch === '"' || ch === "'" || ch === '`') {
          pending.quote = ch;
        } else if (ch === '{') {
          pending.braces += 1;
        } else if (ch === '}') {
          pending.braces -= 1;
        } else if (ch === '>' && pending.braces <= 0) {
          pending.selfClosing = pending.last === '/';
          finish();
          i += 1;
          continue;
        }
        if (!/\s/.test(ch)) pending.last = ch;
        i += 1;
        continue;
      }
      if (inDisplayMath) {
        const end = line.indexOf('$$', i);
        if (end < 0) return;
        inDisplayMath = false;
        i = end + 2;
        continue;
      }
      if (ch === '\\') {
        i += 2;
        continue;
      }
      if (ch === '`') {
        let j = i;
        while (line[j] === '`') j += 1;
        const run = line.slice(i, j);
        const end = line.indexOf(run, j);
        i = end < 0 ? line.length : end + run.length;
        continue;
      }
      if (ch === '$') {
        if (line[i + 1] === '$') {
          const end = line.indexOf('$$', i + 2);
          if (end < 0) {
            inDisplayMath = true;
            return;
          }
          i = end + 2;
          continue;
        }
        let end = line.indexOf('$', i + 1);
        while (end > 0 && line[end - 1] === '\\') end = line.indexOf('$', end + 1);
        i = end < 0 ? i + 1 : end + 1;
        continue;
      }
      if (ch === '<') {
        const match = line.slice(i).match(/^<(\/?)([A-Za-z][\w.:-]*)/);
        if (match) {
          pending = { name: match[2], closing: match[1] === '/', quote: '', braces: 0, last: '', selfClosing: false };
          i += match[0].length;
          continue;
        }
      }
      i += 1;
    }
  };

  return {
    feed,
    depth: () => stack.length + (pending ? 1 : 0),
    opened: (name) => opened.get(name) ?? 0,
    balanced: () => stack.length === 0 && !pending && !broken && !inDisplayMath,
  };
}

const FENCE_OPEN = /^(\s*)(`{3,}|~{3,})(.*)$/;

/** A page as lines (without their line endings), its own line ending, and every fenced block with the tags open around it. */
function parsePage(source) {
  const crlf = (source.match(/\r\n/g) ?? []).length;
  const lf = (source.match(/\n/g) ?? []).length;
  const eol = crlf > 0 ? '\r\n' : '\n';
  const lines = source.split(eol);
  const tracker = makeTracker();
  const fences = [];
  let open = null;
  let index = 0;
  if (lines[0].replace(/^﻿/, '') === '---') {
    const end = lines.findIndex((line, at) => at > 0 && line === '---');
    if (end > 0) index = end + 1;
  }
  for (; index < lines.length; index += 1) {
    const line = lines[index];
    if (open) {
      const close = line.match(/^\s*(`{3,}|~{3,})\s*$/);
      if (close && close[1][0] === open.ticks[0] && close[1].length >= open.ticks.length) {
        open.end = index;
        fences.push(open);
        open = null;
      } else {
        open.body.push(line);
      }
      continue;
    }
    const match = line.match(FENCE_OPEN);
    if (match && !(match[2][0] === '`' && match[3].includes('`'))) {
      const [lang = '', ...meta] = match[3].trim().split(/\s+/);
      open = { start: index, end: -1, indent: match[1].length, ticks: match[2], lang, meta: meta.join(' '), depth: tracker.depth(), body: [] };
      continue;
    }
    tracker.feed(line);
  }
  return {
    lines,
    eol,
    fences,
    mixedEndings: crlf !== 0 && crlf !== lf,
    balanced: tracker.balanced() && !open,
    embeds: tracker.opened('HaskellTryIt'),
  };
}

const run = (code) => {
  try {
    return runHaskellWithInput(code, '');
  } catch (error) {
    return { ok: false, output: '', diagnostic: { message: `The simulator threw: ${error instanceof Error ? error.message : error}` } };
  }
};

const converted = [];
const skipped = [];
const changedFiles = [];
let embedsBefore = 0;
let embedsAfter = 0;
let looksQualified = 0;
let plainWithoutMain = 0;

const skip = (item, reason) => skipped.push({ ...item, reason });

for (const file of files) {
  const relative = path.relative(root, file).replace(/\\/g, '/');
  const short = relative.replace('content/docs/sem3/csi243/', '');
  const source = fs.readFileSync(file, 'utf8');
  const page = parsePage(source);
  const { lines, fences } = page;
  embedsBefore += page.embeds;
  embedsAfter += page.embeds;

  const edits = [];
  fences.forEach((fence, at) => {
    if (fence.lang !== 'haskell') return;
    const scanned = scanResults.get(`${relative}:${fence.start + 1}`);
    if (!scanned) return;
    if (scanned.tryIt) return;

    const code = fence.body.join('\n');
    const next = fences[at + 1];
    const isPair = scanned.kind === 'program' && scanned.status === 'match' && scanned.via === 'alone';
    const isSingle = scanned.kind === 'plain' && scanned.status === 'ran' && scanned.via === 'alone' && definesMain(code) && !scanned.waitsForInput;
    if (scanned.kind === 'plain' && scanned.status === 'ran' && scanned.via === 'alone' && !isSingle && !definesMain(code)) plainWithoutMain += 1;
    if (!isPair && !isSingle) return;
    looksQualified += 1;
    const item = { file: short, line: fence.start + 1, kind: isPair ? 'pair' : 'single' };

    if (page.mixedEndings) return skip(item, 'the page mixes line endings');
    if (!page.balanced) return skip(item, 'the page structure was not understood (JSX tags do not balance)');
    if (fence.depth > 0) return skip(item, 'inside a JSX component that is still open');
    if (fence.indent > 0) return skip(item, 'the fence is indented');
    if (fence.ticks !== '```' || fence.meta !== '') return skip(item, 'the fence has more than the language');
    if (code !== scanned.code) return skip(item, 'the scan is out of date for this block (run it again)');
    if (READS_INPUT.test(code)) return skip(item, 'reads input');
    if (INTENDED_ERROR.test(code)) return skip(item, 'its comments call it wrong or an error');
    if (pairsNeedMain && isPair && !definesMain(code)) return skip(item, 'a pair with no main (a GHCi-style snippet)');

    const result = run(code);
    if (!result.ok) return skip(item, 'does not run when checked here');
    const printed = normalise(result.output);

    if (isPair) {
      const adjacent = next && next.start === fence.end + 2 && lines[fence.end + 1].trim() === '';
      if (!next || next.lang !== 'text') return skip(item, 'no text block follows');
      if (!adjacent) return skip(item, 'the text block is not one blank line below the code');
      if (next.indent > 0 || next.ticks !== '```' || next.meta !== '') return skip(item, 'the text fence is indented or has more than the language');
      const shown = next.body.join('\n');
      if (GHC_WARNING.test(shown)) return skip(item, 'the shown text contains a GHC warning');
      if (printed !== normalise(shown)) return skip(item, 'prints something other than the text block when checked here');
      edits.push({ ...item, first: fence.start, last: next.end, main: definesMain(code) });
    } else {
      if (next && next.lang === 'text') return skip(item, 'a text block follows, but not beside the code');
      if (/^(Definitions loaded|No output)/.test(printed) || printed === '') return skip(item, 'prints nothing');
      edits.push({ ...item, first: fence.start, last: fence.end, main: true });
    }
  });

  if (edits.length === 0) continue;

  // Apply from the bottom up so the line numbers above stay valid. A blank line goes before and after the tag when the neighbours are text.
  const rewritten = [...lines];
  for (const edit of [...edits].sort((a, b) => b.first - a.first)) {
    const inner = lines.slice(edit.first, edit.last + 1);
    const before = edit.first > 0 && rewritten[edit.first - 1].trim() !== '' ? [''] : [];
    const after = edit.last + 1 < lines.length && rewritten[edit.last + 1].trim() !== '' ? [''] : [];
    rewritten.splice(edit.first, edit.last - edit.first + 1, ...before, '<HaskellTryIt>', '', ...inner, '', '</HaskellTryIt>', ...after);
  }
  const text = rewritten.join(page.eol);

  // Check the result: the same fenced blocks in the same order, and one more embed for each block converted.
  const again = parsePage(text);
  const signature = (parsed) => parsed.fences.map((fence) => `${fence.lang}\n${fence.body.join('\n')}`);
  const same = JSON.stringify(signature(page)) === JSON.stringify(signature(again));
  if (!same || !again.balanced || again.embeds !== page.embeds + edits.length || again.eol !== page.eol) {
    console.error(`Refusing to change ${relative}: the rewritten page does not check out.`);
    process.exitCode = 1;
    for (const edit of edits) skip(edit, 'the rewritten page did not check out');
    continue;
  }

  embedsAfter += edits.length;
  converted.push(...edits);
  changedFiles.push({ relative, short, count: edits.length });
  if (apply) fs.writeFileSync(file, text);
}

const pairs = converted.filter((item) => item.kind === 'pair');
const singles = converted.filter((item) => item.kind === 'single');
const pagesOf = (items) => new Set(items.map((item) => item.file)).size;

const verb = apply ? 'converted' : 'to convert';
console.log(`Haskell examples ${verb} in ${files.length} notes under ${path.relative(root, notesRoot).replace(/\\/g, '/')}${apply ? '' : '   (dry run: nothing is written)'}\n`);
for (const { short, count } of changedFiles) {
  const here = converted.filter((item) => item.file === short);
  console.log(`  ${short}   ${count}`);
  if (verbose) for (const item of here) console.log(`      line ${String(item.line).padStart(4)}  ${item.kind}${item.kind === 'pair' && !item.main ? ' (no main)' : ''}`);
}

const reasons = new Map();
for (const item of skipped) reasons.set(item.reason, [...(reasons.get(item.reason) ?? []), item]);

const line = (label, value, note = '') => console.log(`  ${label.padEnd(58)}${String(value).padStart(5)}${note ? `   ${note}` : ''}`);
console.log('');
line(`Pairs (code, then its output) ${verb}`, pairs.length, `in ${pagesOf(pairs)} pages; ${pairs.filter((item) => !item.main).length} have no main`);
line(`Single blocks (a main that prints, no output shown) ${verb}`, singles.length, `in ${pagesOf(singles)} pages`);
line('Pages changed', changedFiles.length);
line('Candidates the scan reports as run and match, on their own', looksQualified, 'pairs and single blocks');
line('  skipped', skipped.length);
for (const [reason, items] of [...reasons].sort((a, b) => b[1].length - a[1].length)) {
  line(`    ${reason}`, items.length);
  for (const item of items.slice(0, verbose ? items.length : 2)) console.log(`        ${item.file}:${item.line}  (${item.kind})`);
}
line('Plain blocks that run on their own but have no main (left alone)', plainWithoutMain);
line('HaskellTryIt embeds on the pages', `${embedsBefore} -> ${embedsAfter}`, apply ? 'after writing' : 'if applied');
if (!apply && converted.length > 0) console.log('\nRun again with --apply to write the notes.');
