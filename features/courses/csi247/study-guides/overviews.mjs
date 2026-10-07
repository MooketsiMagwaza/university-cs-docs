import { escape, player, table } from './visuals.mjs';
import { search, sort } from './simulations.mjs';
import { mergeTree, mergeJoinDiagram, mergeChoices } from './merge-map.mjs';

// These are the three supplied visual examples, executed rather than transcribed.
export const MAP_INPUTS = {
  selection: [29, 72, 98, 13, 87, 66, 52, 51, 36],
  insertion: [85, 12, 59, 45, 72, 51],
  binary: [-5, -2, 0, 1, 2, 4, 5, 6, 7, 10],
  bubble: [4, 2, 5, 1, 3],
  linear: [63, 29, 85, 72, 18, 42, 23, 54, 8, 32],
  merge: [63, 29, 72, 85, 18, 49, 3, 54],
};
const e = escape;

// Each row has its own viewBox: a printed run can break between passes without
// shrinking one giant SVG to an unreadable page. Roles also have text labels.
export function cards(values, { roles = {}, labels = {}, arrows = [], held, caption = '' } = {}) {
  const cell = 48, start = 18, y = 59, width = Math.max(330, values.length * cell + 36);
  const arrow = (a) => {
    const from = start + a.from * cell + 22, to = start + a.to * cell + 22;
    const d = `M${from},${y - 3} V28 H${to} V${y - 7}`;
    return `<path class="map-arrow ${a.kind || ''}" d="${d}"/><path class="map-arrow" d="M${to - 4},${y - 13} L${to},${y - 5} L${to + 4},${y - 13}"/>${a.kind === 'swap' ? `<path class="map-arrow" d="M${from - 4},${y - 9} L${from},${y - 1} L${from + 4},${y - 9}"/>` : ''}<text class="map-arrow-label" x="${(from + to) / 2}" y="20">${e(a.text || a.kind || 'shift')}</text>`;
  };
  return `<svg class="map-array" style="max-width:${width}px" viewBox="0 0 ${width} 146" role="img" aria-label="${e(`${caption} Array ${values.map(v => v ?? 'gap').join(', ')}. ${Object.entries(labels).map(([i,l]) => `Index ${i}: ${l}`).join('; ')}${held !== undefined ? `. Held key ${held}` : ''}`)}"><title>${e(caption)}</title>${held !== undefined ? `<text class="map-held" x="${width - 8}" y="10">held key = ${e(held)}</text>` : ''}${arrows.map(arrow).join('')}${values.map((value, i) => `<g class="map-card ${roles[i] || ''}"><text class="map-index" x="${start + i * cell + 22}" y="${y + 53}">${i}</text><rect x="${start + i * cell}" y="${y}" width="44" height="38" rx="2"/><text class="map-value" x="${start + i * cell + 22}" y="${y + 25}">${e(value ?? '·')}</text>${roles[i] === 'discarded' ? `<path class="map-strike" d="M${start + i * cell + 3},${y + 3} l38,32"/>` : ''}<text class="map-role" x="${start + i * cell + 22}" y="${y + 69}">${e(labels[i] || (value === null ? 'gap' : ''))}</text></g>`).join('')}</svg>`;
}
const row = (visual, text) => `<div class="map-row"><div>${visual}</div><p>${text}</p></div>`;
const roleRange = (n, role) => Object.fromEntries(Array.from({ length: n }, (_, i) => [i, role]));
const pass = (title, body) => `<article class="map-pass"><h3>${e(title)}</h3>${body}</article>`;
const legend = (kind) => `<div class="map-legend" aria-label="Diagram colour key"><span class="fixed">Green: ${['linear', 'binary'].includes(kind) ? 'found' : 'sorted'}</span><span class="selected">Blue: ${kind === 'merge' ? 'left group' : 'being checked'}</span>${kind === 'merge' ? '<span class="target">Orange: right group</span>' : ['linear', 'binary'].includes(kind) ? '<span class="discarded">Crossed out: ruled out</span>' : `<span class="target">Orange: ${kind === 'insertion' ? 'space for the held value' : 'position to fill'}</span>`}</div>`;

export function algorithmOverview(kind) {
  const input = MAP_INPUTS[kind];
  const run = ['linear', 'binary'].includes(kind) ? search(kind, input, kind === 'binary' ? 7 : 18) : sort(kind, input);
  const frames = [], rows = [];
  let head = '', result = '';
  if (kind === 'selection') {
    head = 'Read down the page. In each pass, find the smallest value in the unfinished part, then swap it into the next position on the left. Leave the green completed positions alone.';
    for (const p of run.passes) {
      const i = p.number - 1, min = p.before.indexOf(Math.min(...p.before.slice(i)), i), same = min === i;
      const action = same ? `The smallest remaining value, ${p.before[min]}, is already at index ${i}. Leave it there.` : `The smallest remaining value is ${p.before[min]} at index ${min}. Swap ${p.before[i]} and ${p.before[min]} to fill index ${i}.`;
      let smallest = i;
      const scan = [`Start with [${p.before.join(', ')}]. Fill index ${i}; remember ${p.before[i]} at index ${i} as the smallest seen so far.`];
      for (let candidate = i + 1; candidate < p.before.length; candidate++) {
        const smaller = p.before[candidate] < p.before[smallest];
        scan.push(`Check ${p.before[candidate]} at index ${candidate}: ${p.before[candidate]} < ${p.before[smallest]} is ${smaller ? 'true' : 'false'}. ${smaller ? `Remember ${p.before[candidate]} at index ${candidate} as the new smallest.` : `Keep ${p.before[smallest]} as the smallest.`}`);
        if (smaller) smallest = candidate;
      }
      const nextSelection = i + 1 < p.before.length - 1 ? `Next, fill index ${i + 1}: start with ${p.after[i + 1]} as the smallest and scan from index ${i + 2}.` : 'Only the last position remains; its value is already in place, so stop.';
      const labels = { [i]: same ? 'smallest' : 'fill here', ...(!same ? { [min]: 'smallest' } : {}) };
      const visual = '<div class="selection-pass">' + row(cards(p.before, { roles: { ...roleRange(i, 'fixed'), [i]: 'target', [min]: 'selected' }, labels, arrows: same ? [] : [{ from: min, to: i, kind: 'swap' }], caption: `Pass ${p.number}: find the smallest remaining value` }), `${scan.map(e).join('<br>')}<br><strong>The scan is finished.</strong> ${e(action)}`)
        + row(cards(p.after, { roles: roleRange(i + 1, 'fixed'), labels: { [i]: 'done' }, caption: `Pass ${p.number}, completed` }), `The row is now [${p.after.join(', ')}]. Position ${i} is finished. ${same ? 'No swap was needed.' : `${p.before[i]} takes the position that ${p.before[min]} left behind.`} ${nextSelection}`) + '</div>';
      frames.push({ title: `Pass ${p.number}: fill index ${i}`, visual, explanation: action });
      rows.push([p.number, `${p.before[min]} at ${min}`, same ? 'No swap' : `${i} ↔ ${min}`, `[${p.after.join(', ')}]`, p.comparisons]);
    }
    result = `Sorted: [${run.result.join(', ')}]. Once all earlier positions are filled, the last remaining value is already in place.`;
  } else if (kind === 'insertion') {
    head = 'Hold the next value separately as the key. Copy larger values one position right to make room, then insert the key. The drawn gap helps you follow the opening; the array can briefly contain a duplicate after a shift.';
    for (const p of run.passes) {
      const i = p.number, key = p.before[i], a = [...p.before]; let j = i - 1;
      a[i] = null;
      let visual = row(cards(a, { roles: { ...roleRange(i, 'fixed'), [i]: 'target' }, held: key, labels: { [i]: 'gap' }, caption: `Pass ${i}: hold ${key}` }), `Start with [${p.before.join(', ')}]. Hold ${key} from index ${i} separately. Positions 0 through ${i - 1} are already ordered. Compare the held ${key} with ${a[j]} at index ${j}. The gap marks where we are making room; it is not an empty Java array cell.`);
      while (j >= 0 && a[j] > key) {
        const value = a[j], before = [...a];
        const shifted = [...a]; shifted[j + 1] = value; shifted[j] = null;
        const nextComparison = j > 0 ? `Next compare ${a[j - 1]} at index ${j - 1} with the held ${key}.` : 'There is no value further left; stop shifting.';
        visual += row(cards(before, { roles: { ...roleRange(i, 'fixed'), [j]: 'selected', [j + 1]: 'target' }, held: key, arrows: [{ from: j, to: j + 1, text: `shift ${value} →` }], labels: { [j]: 'compare', [j + 1]: 'gap' }, caption: `${value} > ${key}: shift right` }), e(`${value} > ${key} is true, so ${value} belongs after ${key}. Shift ${value} from index ${j} to index ${j + 1} by copying it right. With ${key} still held, the diagram row becomes [${shifted.map(v => v ?? 'gap').join(', ')}]. ${nextComparison}`));
        a[j + 1] = a[j]; a[j] = null; j--;
      }
      const stop = j < 0 ? 'We reached the start of the row: index -1 is outside the array, so stop without reading it.' : `${a[j]} > ${key} is false, so stop shifting: ${key} belongs after ${a[j]} at index ${j}.`;
      const nextInsertion = i + 1 < p.after.length ? `Next pass, hold ${p.after[i + 1]} from index ${i + 1} and compare it with ${p.after[i]} at index ${i}.` : 'There is no next value to hold; the whole row is sorted, so stop.';
      visual += row(cards(a, { roles: { ...roleRange(i + 1, 'fixed'), [j + 1]: 'target' }, held: key, labels: { [j + 1]: 'insert' }, caption: `Insert held key at index ${j + 1}` }), `${stop} Insert the held ${key} at index ${j + 1}. The row becomes [${p.after.join(', ')}].`);
      visual += row(cards(p.after, { roles: roleRange(i + 1, 'fixed'), labels: { [j + 1]: 'key placed' }, caption: `Pass ${i} complete` }), `Positions 0 through ${i} are now ordered: [${p.after.slice(0, i + 1).join(', ')}]. ${nextInsertion}`);
      frames.push({ title: `Pass ${i}: hold ${key}, shift, insert`, visual, explanation: `${stop} Insert ${key} at index ${j + 1}.` });
      rows.push([i, key, p.moves, j + 1, `[${p.after.join(', ')}]`]);
    }
    result = `Sorted: [${run.result.join(', ')}]. Each held value has been inserted into the growing ordered section. Shifts copy values right; they do not swap two values.`;
  } else if (kind === 'binary' || kind === 'linear') {
    const binary = kind === 'binary';
    head = binary ? 'Find 7 in this sorted row. Low and high mark the first and last possible positions; mid marks the middle position to check. Each decision narrows that range without moving the values.' : 'Find 18 by checking from left to right. After a failed check, try the next position. Stop at the first match; the values stay where they are.';
    for (const [n, s] of run.steps.entries()) {
      const discarded = input.flatMap((_, i) => binary ? i < s.low || i > s.high ? [i] : [] : i < s.i ? [i] : []);
      const labels = {};
      if (binary) for (const [i, label] of [[s.low, 'low'], [s.i, 'mid'], [s.high, 'high']]) labels[i] = labels[i] ? `${labels[i]}/${label}` : label;
      else labels[s.i] = s.match ? 'found' : 'check';
      const roles = { ...Object.fromEntries(discarded.map(i => [i, 'discarded'])), [s.i]: s.match ? 'fixed' : 'selected' };
      const next = run.steps[n + 1];
      const check = binary ? `Look for ${run.key} among indexes ${s.low} through ${s.high}: [${input.slice(s.low, s.high + 1).join(', ')}]. The middle index is (${s.low} + ${s.high}) / 2, rounded down to ${s.i}; its value is ${s.value}.` : `Look for ${run.key}. Check ${s.value} at index ${s.i}.`;
      const decision = s.match ? `${s.value} == ${run.key} is true. Return index ${s.i} and stop; no other positions need checking.` : binary ? `${s.value} ${s.value < run.key ? '<' : '>'} ${run.key} is true. ${s.value < run.key ? 'This value and everything to its left are too small.' : 'This value and everything to its right are too large.'} Rule out indexes ${s.value < run.key ? `${s.low} through ${s.i}` : `${s.i} through ${s.high}`}. ${next ? `Keep indexes ${next.low} through ${next.high}: [${input.slice(next.low, next.high + 1).join(', ')}]. Next middle: (${next.low} + ${next.high}) / 2, rounded down to index ${next.i}; check ${next.value}.` : 'No possible positions remain; return -1 for not found.'}` : `${s.value} == ${run.key} is false. This position is not a match. ${next ? `Move one position right: next check ${next.value} at index ${next.i}.` : 'The row has ended; return -1 for not found.'}`;
      const reason = `${check} ${decision}`;
      const visual = row(cards(input, { roles, labels, arrows: next ? [{ from: s.i, to: next.i, text: binary ? 'next middle' : 'next check' }] : [], caption: `Check ${n + 1}` }), e(reason));
      frames.push({ title: `Check ${n + 1}`, visual, explanation: reason });
      rows.push(binary ? [n + 1, s.low, s.i, s.high, s.value, reason] : [n + 1, s.i, s.value, reason]);
    }
    result = `Found ${run.key} at index ${run.found}. ${binary ? 'Index 9 was still possible, but finding the match at index 8 means we can stop.' : 'The later values do not need checking once a match is found.'}`;
  } else if (kind === 'bubble') {
    head = 'Follow the neighbour checks from left to right. Swap only when the larger value comes first. By the end of a pass, the largest unfinished value has reached its final position on the right.';
    for (const p of run.passes) {
      const steps = run.steps.filter(s => s.pass === p.number), a = [...p.before];
      let visual = '';
      for (const [j, s] of steps.entries()) {
        const change = a[j] > a[j + 1];
        const nextPair = j + 1 < steps.length ? `Next compare ${s.a[j + 1]} and ${s.a[j + 2]} at indexes ${j + 1} and ${j + 2}.` : 'That was the last neighbour check in this pass.';
        visual += row(cards(a, { roles: { ...Object.fromEntries(a.map((_,i) => [i, i >= a.length - p.number + 1 ? 'fixed' : ''])), [j]: 'target', [j + 1]: 'selected' }, labels: { [j]: 'left', [j + 1]: 'right' }, arrows: change ? [{ from: j, to: j + 1, kind: 'swap' }] : [], caption: `Pass ${p.number}: compare neighbours` }), e(`${j === 0 ? `Start this pass with [${p.before.join(', ')}]. ` : ''}Compare ${a[j]} at index ${j} with ${a[j + 1]} at index ${j + 1}: ${a[j]} > ${a[j + 1]} is ${change ? 'true' : 'false'}. ${change ? `Swap their positions so the larger value, ${a[j]}, moves right. The row becomes [${s.a.join(', ')}].` : `They are already in order; keep the row [${s.a.join(', ')}].`} ${nextPair}`));
        a.splice(0, a.length, ...s.a);
      }
      const nextBubble = !p.moves ? 'No neighbours needed swapping anywhere in this pass. The row is sorted, so stop.' : p.number < run.passes.length ? `Next pass, leave indexes ${a.length - p.number} through ${a.length - 1} alone. Start again at the left: compare ${p.after[0]} with ${p.after[1]}, then continue through index ${a.length - p.number - 1}.` : 'Only one unfinished position remains; its value is already in place. Stop.';
      visual += row(cards(p.after, { roles: Object.fromEntries(a.map((_,i) => [i, i >= a.length - p.number ? 'fixed' : ''])), caption: `Pass ${p.number} complete` }), `The row is [${p.after.join(', ')}]. ${p.moves ? `The largest unfinished value, ${p.after[a.length - p.number]}, is now in its final position at index ${a.length - p.number}. ` : ''}${nextBubble}`);
      frames.push({ title: `Pass ${p.number}: check the neighbours`, visual, explanation: `Row after this pass: [${p.after.join(', ')}]. ${p.moves ? 'Leave the finished positions on the right alone.' : 'No swaps were needed, so sorting is complete.'}` });
      rows.push([p.number, p.comparisons, p.moves, `[${p.after.join(', ')}]`]);
    }
    result = `Sorted: [${run.result.join(', ')}]. Each pass settled the largest unfinished value on the right.`;
  } else {
    head = 'There are two parts: split the groups, then join them in order. A group with one value is already sorted. The joining is what puts the values in order.';
    for (const r of run.returns) {
      const choices = mergeChoices(r);
      const parent = r.lo === 0 && r.hi === input.length - 1 ? null : run.returns.find(candidate => candidate.lo <= r.lo && candidate.hi >= r.hi && candidate.hi - candidate.lo > r.hi - r.lo);
      const destination = parent ? `This result becomes the ${r.lo === parent.lo ? 'left' : 'right'} group in join ${parent.number}.` : 'This is the whole array, so sorting is finished.';
      const start = `The left group is [${r.left.join(', ')}]; the right is [${r.right.join(', ')}]. Both are already sorted. Start a new, empty output row.`;
      const explanation = r.result.length < input.length ? choices.map(c => `${e(c.reason)} The output is now <code>[${c.current.temp.join(', ')}]</code>.`).join('<br><br>') : `${e(choices[0].reason)} The eight choices are illustrated one by one in <a href="#final-merge">Build the final row</a> below.`;
      const visual = `<p>${start}</p>` + row(mergeJoinDiagram(r), explanation)
        + `<p class="merge-return-note"><strong>Coming back:</strong> copy [${r.result.join(', ')}] back into the positions this group came from. ${destination}</p>`
        + `<details class="merge-choice-detail"><summary>See each choice in this join</summary><ol class="merge-choices">${choices.map(c => `<li>${e(c.reason)} Output: <code>[${c.current.temp.join(', ')}]</code>.</li>`).join('')}</ol></details>`;
      frames.push({ title: `Join ${r.number}: ${r.left.length} + ${r.right.length} values become ${r.result.length}`, visual, explanation: destination });
      rows.push([r.number, `${r.lo}..${r.hi}`, `[${r.left}] + [${r.right}]`, `[${r.result}]`, r.comparisons]);
    }
    result = `Sorted: [${run.result.join(', ')}]. Every value is still present; only their order has changed. Merging copies values into order—it does not swap two values.`;
  }
  const headers = kind === 'selection' ? ['Pass', 'Minimum', 'Action', 'Array after pass', 'Comparisons'] : kind === 'insertion' ? ['Pass', 'Held key', 'Shifts', 'Insert at', 'Array after pass'] : kind === 'binary' ? ['Probe', 'low', 'mid', 'high', 'Value', 'Decision'] : kind === 'linear' ? ['Check', 'Index', 'Value', 'Decision'] : kind === 'bubble' ? ['Pass', 'Comparisons', 'Swaps', 'Array after pass'] : ['Return', 'Range', 'Sorted inputs', 'Result', 'Comparisons'];
  return {
    body: `<p>${head}</p>${legend(kind)}<div class="whole-run" data-map-kind="${kind}">${kind === 'merge' ? `${mergeTree(run)}${mergeTree(run, true)}<p><strong>What does “coming back” mean?</strong> A smaller sorting task finishes and gives its ordered group back to the larger task that needs it. That larger task waits until <em>both</em> groups are ready before joining them.</p><p>The tree shows how groups fit together, not tasks happening at the same time. The code finishes the left side first. Follow the seven joins below in the order they actually happen.</p>` : ''}${frames.map(f => pass(f.title, f.visual)).join('')}</div><p class="result-line">${e(result)}</p>`,
    walkthrough: `<p>Predict the next completed ${['linear','binary'].includes(kind) ? 'check' : kind === 'merge' ? 'merge' : 'pass'}, then advance. Each scene keeps all its movements together.</p>${player(`${kind}-main`, 'Guided walkthrough: major steps', frames, headers, rows.map(r => r.slice(1)))}`,
    trace: table(headers, rows, `${kind} overview concise trace`),
    frames, rows, result,
  };
}

export function packageOverview(kind) {
  const stages = kind === 'imports' ? [
    ['Identify the type', 'java.util.Scanner', 'java.util is the package; Scanner is the class. The fully qualified name already identifies it.'],
    ['Choose a spelling', 'import java.util.Scanner;', 'A specific import lets this file write Scanner. java.util.* includes accessible types directly in java.util, not subpackages.'],
    ['Check visibility', 'public class / public member', 'An import cannot grant access. A package-private member stays available only within its package.'],
    ['Compile, then run', 'Scanner input = new Scanner(System.in);', 'The compiler resolves the simple name. The class must still be available; an import does not install or copy it.'],
  ] : [
    ['Declare the address', 'package pkg; public class Tester', 'The class identity is pkg.Tester. Put the declaration before imports and the class.'],
    ['Place the source', 'src/pkg/Tester.java', 'src is the source root. pkg mirrors the package name. A public Tester class needs the filename Tester.java.'],
    ['Compile the project', 'javac -d classes -sourcepath src src/pkg/Tester.java', 'From the project directory, the compiler finds dependencies under src and writes classes/pkg/Tester.class.'],
    ['Run the entry point', 'java -classpath classes pkg.Tester', 'classes is the root above pkg. Use a dotted class name, without .class, and invoke its public static main method.'],
  ];
  const blocks = stages.map(([title, value, reason], i) => `<article class="package-map-step"><span class="stage-number">${i + 1}</span><div><h3>${title}</h3><code>${e(value)}</code><p>${reason}</p></div>${i < stages.length - 1 ? '<span class="stage-arrow" aria-hidden="true">↓</span>' : ''}</article>`);
  const frames = stages.map(([title, value, reason], i) => ({ title, visual: blocks[i], explanation: reason }));
  return { body: `<div class="whole-run package-map" data-map-kind="${kind}">${blocks.join('')}</div>`, walkthrough: player(`packages-${kind}`, 'Follow the class from source to execution', frames, ['Step', 'Stage', 'Representation', 'Reason'], stages), trace: table(['Stage', 'Representation', 'What changes'], stages) };
}
