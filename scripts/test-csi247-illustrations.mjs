import assert from 'node:assert/strict';
import { parseFragment } from 'parse5';
import { createGuides } from '../features/courses/csi247/study-guides/guides.mjs';
import { ALGORITHM_INTRODUCTIONS, algorithmIntroduction } from '../features/courses/csi247/study-guides/introductions.mjs';
import { MAP_INPUTS, algorithmOverview } from '../features/courses/csi247/study-guides/overviews.mjs';
import { mergeTree, mergeChoices, mergeDecisionDiagram, finalMergeWalkthrough } from '../features/courses/csi247/study-guides/merge-map.mjs';
import { sort } from '../features/courses/csi247/study-guides/simulations.mjs';
import { REFERENCE_SECTIONS } from '../features/courses/csi247/study-guides/reference-content.mjs';

const kinds = ['linear', 'binary', 'bubble', 'selection', 'insertion', 'merge'];
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const hasClass = (node, name) => (attr(node, 'class') || '').split(/\s+/).includes(name);
function nodes(root, predicate) {
  return (predicate(root) ? [root] : []).concat((root.childNodes || []).flatMap(child => nodes(child, predicate)));
}
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join('');
const fragment = html => parseFragment(html);
const values = node => nodes(node, n => n.tagName === 'text').map(n => text(n).trim()).filter(v => /^-?\d+$/.test(v)).map(Number);

const input = [63, 29, 72, 85, 18, 49, 3, 54];
const expected = [3, 18, 29, 49, 54, 63, 72, 85];
assert.deepEqual(MAP_INPUTS.merge, input);
const run = sort('merge', input);
assert.deepEqual(run.result, expected);
assert.deepEqual(run.returns.map(r => [r.lo, r.hi]), [[0, 1], [2, 3], [0, 3], [4, 5], [6, 7], [4, 7], [0, 7]], 'joins must follow left-first execution, not level-by-level parallel work');
assert.deepEqual(run.returns.map(r => r.result), [[29, 63], [72, 85], [29, 63, 72, 85], [18, 49], [3, 54], [3, 18, 49, 54], expected]);

// Expected tree groups come independently from the original range boundaries.
const splitGroups = [], returnedGroups = [];
function expectedTree(lo, hi) {
  const group = input.slice(lo, hi + 1);
  splitGroups.push(group);
  returnedGroups.push([...group].sort((a, b) => a - b));
  if (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    expectedTree(lo, mid);
    expectedTree(mid + 1, hi);
  }
}
expectedTree(0, 7);
for (const returning of [false, true]) {
  const diagram = fragment(mergeTree(run, returning));
  const groups = nodes(diagram, n => hasClass(n, 'merge-tree-group'));
  assert.equal(groups.length, 15);
  assert.deepEqual(groups.map(values), returning ? returnedGroups : splitGroups);
  assert.deepEqual(groups.map(n => attr(n, 'data-values').split(',').map(Number)), returning ? returnedGroups : splitGroups);
  assert.equal(nodes(diagram, n => hasClass(n, 'joined')).length, returning ? 7 : 0);
}

const final = run.returns.at(-1), choices = mergeChoices(final);
assert.deepEqual(final.left, [29, 63, 72, 85]);
assert.deepEqual(final.right, [3, 18, 49, 54]);
assert.equal(choices.length, 8);
assert.deepEqual(choices.map(c => c.value), expected);
assert.deepEqual(choices.map(c => c.fromLeft), [false, false, true, false, false, true, true, true]);
const fronts = [[29, 3], [29, 18], [29, 49], [63, 49], [63, 54], [63, undefined], [72, undefined], [85, undefined]];
for (const [i, choice] of choices.entries()) {
  assert.deepEqual([final.left[choice.previous.i], final.right[choice.previous.j]], fronts[i]);
  assert.deepEqual(choice.current.temp, expected.slice(0, i + 1));
  assert.equal(choice.current.i - choice.previous.i, choice.fromLeft ? 1 : 0);
  assert.equal(choice.current.j - choice.previous.j, choice.fromLeft ? 0 : 1);
  assert.equal(choice.current.phase, i < 5 ? 'choose' : 'leftover');
  const diagram = fragment(mergeDecisionDiagram(final, choice));
  const svg = nodes(diagram, n => n.tagName === 'svg')[0];
  assert.equal(attr(svg, 'data-picked'), String(expected[i]));
  assert.equal(attr(svg, 'data-output'), expected.slice(0, i + 1).join(','));
  assert(attr(svg, 'aria-label').includes(choice.reason));
  const sourceCells = nodes(diagram, n => hasClass(n, 'merge-decision-cell') && !hasClass(n, 'output'));
  assert.deepEqual(sourceCells.flatMap(values), [...final.left, ...final.right], 'copying must leave the source row visible and unchanged');
  assert.deepEqual(sourceCells.filter(n => hasClass(n, 'front')).flatMap(values), fronts[i].filter(v => v !== undefined));
  assert.deepEqual(sourceCells.filter(n => hasClass(n, 'chosen')).flatMap(values), [expected[i]]);
  const outputCells = nodes(diagram, n => hasClass(n, 'output'));
  assert.equal(outputCells.length, 8);
  assert.deepEqual(outputCells.flatMap(values), expected.slice(0, i + 1));
  assert(choice.reason.includes('copy') || choice.reason.includes('Copy'));
  assert(!choice.reason.includes('undefined'));
}
const finalHtml = fragment(finalMergeWalkthrough(run));
assert.equal(nodes(finalHtml, n => n.tagName === 'li').length, 8);
assert(text(finalHtml).includes('copy this completed row back into the original array'));
const overview = algorithmOverview('merge');
assert.equal(overview.frames.length, 7);
assert.equal(nodes(fragment(overview.body), n => hasClass(n, 'merge-join-diagram')).length, 7);

const referenceIds = {
  linear: ['searching', 'linear-array', 'linear-definition', 'linear-simple', 'linear-idea', 'linear-movements', 'linear', 'linear-variants', 'linear-examples', 'linear-properties', 'linear-complexity', 'linear-when', 'linear-mistakes', 'linear-summary', 'linear-practice'],
  binary: ['searching', 'binary-array', 'binary-definition', 'binary-simple', 'binary-idea', 'binary-movements', 'binary', 'binary-descending', 'binary-examples', 'binary-properties', 'binary-complexity', 'binary-when', 'binary-mistakes', 'binary-summary', 'binary-practice', 'search-summary'],
  bubble: ['why-sort', 'sort-map', 'bubble-array', 'bubble-definition', 'bubble-simple', 'bubble-idea', 'bubble-movements', 'bubble', 'bubble-descending', 'bubble-examples', 'bubble-properties', 'bubble-complexity', 'bubble-when', 'bubble-mistakes', 'bubble-summary', 'bubble-practice'],
  selection: ['why-sort', 'sort-map', 'selection-array', 'selection-definition', 'selection-simple', 'selection-idea', 'selection-movements', 'selection', 'selection-descending', 'selection-examples', 'selection-properties', 'selection-complexity', 'selection-when', 'selection-mistakes', 'selection-summary', 'selection-practice'],
  insertion: ['why-sort', 'sort-map', 'array', 'definition', 'simple', 'idea', 'movements', 'trace', 'table', 'java', 'recursive', 'insertion-descending', 'insertion-test', 'examples', 'properties', 'complexity', 'when', 'mistakes', 'summary', 'practice'],
  merge: ['why-sort', 'sort-map', 'merge-array', 'merge-definition', 'merge-simple', 'merge-idea', 'merge-movements', 'merge-sort', 'merge-descending', 'merge-examples', 'merge-properties', 'merge-complexity', 'merge-when', 'merge-mistakes', 'merge-summary', 'merge-practice', 'sort-compare', 'growth'],
};
// Only pre-existing display adaptations are allowed: a reference-example notice,
// softened past-paper labels and resolved cross-topic links. All other HTML stays exact.
const soften = html => html.replace(/Test 1 question/gi, 'Exam-style question').replace(/Test 1/gi, 'the past paper');
const restoreLinks = html => html.replace(/href="\.\.\/[^"#]+#([^"]+)"/g, 'href="#$1"');
const stripNotice = html => html.replace(/^<p class="fine-print"><strong>Detailed reference example:<\/strong>[\s\S]*?<\/p>/, '');
const guides = createGuides();
for (const kind of kinds) {
  const guide = guides.find(g => g.kind === kind);
  assert(guide, `missing ${kind} guide`);
  const introduction = algorithmIntroduction(kind);
  const introductionText = text(fragment(introduction.body));
  assert(introductionText.trim().split(/\s+/).length <= 170, `${kind} opening should stay short before its map`);
  assert.equal(introduction.id, 'plain-language');
  assert(introduction.body.includes(MAP_INPUTS[kind].join(', ')));
  assert.equal(nodes(fragment(introduction.body), n => n.tagName === 'p' && hasClass(n, 'lede')).length, 1);
  assert(ALGORITHM_INTRODUCTIONS[kind].goal);
  assert.deepEqual(guide.sections.filter(s => !s.optional).slice(0, kind === 'merge' ? 4 : 3).map(s => s.id), kind === 'merge' ? ['plain-language', 'visual-map', 'why-it-works', 'final-merge'] : ['plain-language', 'visual-map', 'why-it-works']);
  for (const id of referenceIds[kind]) {
    const retained = guide.sections.find(s => s.id === id && s.reference);
    assert(retained, `${kind}: missing full reference section ${id}`);
    assert(retained.optional, `${kind}: reference ${id} should be collapsed initially`);
    assert.equal(restoreLinks(stripNotice(retained.body)), soften(REFERENCE_SECTIONS[id].body), `${kind}: reference body ${id} changed`);
  }
  const map = guide.sections.find(s => s.id === 'visual-map');
  assert(!/key comparisons|insertion writes|temp writes/.test(text(fragment(map.body))), `${kind}: keep operation counts out of the primary illustration`);
}

// Read only visible explanation paragraphs, not SVG text or accessibility labels.
// Independent array operations provide the expected narration for every pass.
const prose = frame => nodes(fragment(frame.visual), n => n.tagName === 'p').map(text);
const includes = (actual, expectedText, context) => assert(actual.includes(expectedText), `${context}: missing prose “${expectedText}”`);

const insertionFrames = algorithmOverview('insertion').frames;
let working = [...MAP_INPUTS.insertion];
for (let i = 1; i < working.length; i++) {
  const before = [...working], key = working[i], paragraphs = prose(insertionFrames[i - 1]);
  includes(paragraphs[0], `Start with [${before.join(', ')}]. Hold ${key} from index ${i} separately.`, `insertion pass ${i} start`);
  const conceptual = [...before]; conceptual[i] = null;
  let j = i - 1, paragraph = 1;
  while (j >= 0 && before[j] > key) {
    const value = before[j];
    conceptual[j + 1] = value; conceptual[j] = null;
    includes(paragraphs[paragraph], `${value} > ${key} is true`, `insertion pass ${i} comparison`);
    includes(paragraphs[paragraph], `Shift ${value} from index ${j} to index ${j + 1} by copying it right`, `insertion pass ${i} movement`);
    includes(paragraphs[paragraph], `diagram row becomes [${conceptual.map(v => v ?? 'gap').join(', ')}]`, `insertion pass ${i} shift result`);
    includes(paragraphs[paragraph], j > 0 ? `Next compare ${before[j - 1]} at index ${j - 1} with the held ${key}` : 'There is no value further left; stop shifting.', `insertion pass ${i} next comparison`);
    working[j + 1] = working[j]; j--; paragraph++;
  }
  working[j + 1] = key;
  includes(paragraphs[paragraph], j < 0 ? 'index -1 is outside the array, so stop without reading it' : `${working[j]} > ${key} is false, so stop shifting`, `insertion pass ${i} stop`);
  includes(paragraphs[paragraph], `Insert the held ${key} at index ${j + 1}. The row becomes [${working.join(', ')}].`, `insertion pass ${i} insertion`);
  includes(paragraphs[paragraph + 1], i + 1 < working.length ? `Next pass, hold ${working[i + 1]} from index ${i + 1} and compare it with ${working[i]} at index ${i}` : 'There is no next value to hold; the whole row is sorted, so stop.', `insertion pass ${i} continuation`);
  assert.equal(paragraphs.length, paragraph + 2);
}
assert.deepEqual(working, [12, 45, 51, 59, 72, 85]);

const selectionFrames = algorithmOverview('selection').frames;
working = [...MAP_INPUTS.selection];
for (let i = 0; i < working.length - 1; i++) {
  const before = [...working], paragraphs = prose(selectionFrames[i]);
  includes(paragraphs[0], `Start with [${before.join(', ')}]. Fill index ${i}; remember ${before[i]} at index ${i}`, `selection pass ${i + 1} start`);
  let minimum = i;
  for (let candidate = i + 1; candidate < working.length; candidate++) {
    const smaller = before[candidate] < before[minimum];
    includes(paragraphs[0], `Check ${before[candidate]} at index ${candidate}: ${before[candidate]} < ${before[minimum]} is ${smaller ? 'true' : 'false'}. ${smaller ? `Remember ${before[candidate]} at index ${candidate} as the new smallest.` : `Keep ${before[minimum]} as the smallest.`}`, `selection pass ${i + 1} candidate ${candidate}`);
    if (smaller) minimum = candidate;
  }
  includes(paragraphs[0], minimum === i ? `The smallest remaining value, ${before[i]}, is already at index ${i}. Leave it there.` : `Swap ${before[i]} and ${before[minimum]} to fill index ${i}`, `selection pass ${i + 1} decision`);
  [working[i], working[minimum]] = [working[minimum], working[i]];
  includes(paragraphs[1], `The row is now [${working.join(', ')}]. Position ${i} is finished.`, `selection pass ${i + 1} result`);
  includes(paragraphs[1], i + 1 < working.length - 1 ? `Next, fill index ${i + 1}: start with ${working[i + 1]} as the smallest and scan from index ${i + 2}` : 'Only the last position remains; its value is already in place, so stop.', `selection pass ${i + 1} continuation`);
}
assert.deepEqual(working, [13, 29, 36, 51, 52, 66, 72, 87, 98]);

const bubbleFrames = algorithmOverview('bubble').frames;
working = [...MAP_INPUTS.bubble];
let bubblePasses = 0;
for (let end = working.length - 1; end > 0; end--) {
  const paragraphs = prose(bubbleFrames[bubblePasses]), start = [...working];
  let swapped = false;
  for (let j = 0; j < end; j++) {
    const left = working[j], right = working[j + 1], change = left > right;
    if (change) { [working[j], working[j + 1]] = [right, left]; swapped = true; }
    if (j === 0) includes(paragraphs[j], `Start this pass with [${start.join(', ')}]`, `bubble pass ${bubblePasses + 1} start`);
    includes(paragraphs[j], `Compare ${left} at index ${j} with ${right} at index ${j + 1}: ${left} > ${right} is ${change ? 'true' : 'false'}`, `bubble comparison ${j}`);
    includes(paragraphs[j], change ? `The row becomes [${working.join(', ')}]` : `keep the row [${working.join(', ')}]`, `bubble comparison ${j} result`);
    includes(paragraphs[j], j + 1 < end ? `Next compare ${working[j + 1]} and ${working[j + 2]} at indexes ${j + 1} and ${j + 2}` : 'That was the last neighbour check in this pass.', `bubble comparison ${j} continuation`);
  }
  includes(paragraphs[end], `The row is [${working.join(', ')}]`, `bubble pass ${bubblePasses + 1} result`);
  includes(paragraphs[end], !swapped ? 'The row is sorted, so stop.' : end > 1 ? `Start again at the left: compare ${working[0]} with ${working[1]}, then continue through index ${end - 1}` : 'Only one unfinished position remains', `bubble pass ${bubblePasses + 1} continuation`);
  assert.equal(paragraphs.length, end + 1);
  bubblePasses++;
  if (!swapped) break;
}
assert.equal(bubbleFrames.length, bubblePasses);
assert.deepEqual(working, [1, 2, 3, 4, 5]);

const linearFrames = algorithmOverview('linear').frames;
for (let i = 0; i <= 4; i++) {
  const paragraph = prose(linearFrames[i]).join(' '), value = MAP_INPUTS.linear[i];
  includes(paragraph, `Look for 18. Check ${value} at index ${i}.`, `linear check ${i}`);
  includes(paragraph, i === 4 ? '18 == 18 is true. Return index 4 and stop' : `${value} == 18 is false. This position is not a match. Move one position right: next check ${MAP_INPUTS.linear[i + 1]} at index ${i + 1}`, `linear continuation ${i}`);
}
assert.equal(linearFrames.length, 5);

const binaryFrames = algorithmOverview('binary').frames;
let low = 0, high = MAP_INPUTS.binary.length - 1, binaryChecks = 0;
while (low <= high) {
  const middle = Math.floor((low + high) / 2), value = MAP_INPUTS.binary[middle];
  const paragraph = prose(binaryFrames[binaryChecks]).join(' ');
  includes(paragraph, `Look for 7 among indexes ${low} through ${high}: [${MAP_INPUTS.binary.slice(low, high + 1).join(', ')}]`, `binary check ${binaryChecks + 1} range`);
  includes(paragraph, `middle index is (${low} + ${high}) / 2, rounded down to ${middle}; its value is ${value}`, `binary check ${binaryChecks + 1} middle`);
  binaryChecks++;
  if (value === 7) { includes(paragraph, `7 == 7 is true. Return index ${middle} and stop`, 'binary match'); break; }
  const smaller = value < 7;
  includes(paragraph, `${value} ${smaller ? '<' : '>'} 7 is true`, 'binary comparison');
  includes(paragraph, smaller ? 'everything to its left are too small' : 'everything to its right are too large', 'binary reason');
  includes(paragraph, `Rule out indexes ${smaller ? `${low} through ${middle}` : `${middle} through ${high}`}`, 'binary discard');
  if (smaller) low = middle + 1; else high = middle - 1;
  const nextMiddle = Math.floor((low + high) / 2);
  includes(paragraph, `Keep indexes ${low} through ${high}: [${MAP_INPUTS.binary.slice(low, high + 1).join(', ')}]`, 'binary remaining range');
  includes(paragraph, `Next middle: (${low} + ${high}) / 2, rounded down to index ${nextMiddle}; check ${MAP_INPUTS.binary[nextMiddle]}`, 'binary next middle');
}
assert.equal(binaryFrames.length, binaryChecks);
console.log('CSI247 illustrations passed: trees and final merge, retained reference, concise reading order, and standalone prose for every selection scan, insertion shift, bubble swap and search check.');
