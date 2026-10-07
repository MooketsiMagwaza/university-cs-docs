import { escape, player, table, recursionTree } from './visuals.mjs';
import { search, sort } from './simulations.mjs';

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
const legend = `<div class="map-legend" aria-label="Diagram colour key"><span class="fixed">Green: sorted / found</span><span class="selected">Blue: chosen value / midpoint</span><span class="target">Orange: destination / held key</span><span class="discarded">Crossed: ruled out</span><span>· = conceptual gap</span></div>`;

export function algorithmOverview(kind) {
  const input = MAP_INPUTS[kind];
  const run = ['linear', 'binary'].includes(kind) ? search(kind, input, kind === 'binary' ? 7 : 18) : sort(kind, input);
  const frames = [], rows = [];
  let head = '', result = '';
  if (kind === 'selection') {
    head = 'Read down the page: scan the entire suffix after the green sorted prefix, select its blue minimum, then exchange it with the orange destination. A no-swap pass still performs its full scan.';
    for (const p of run.passes) {
      const i = p.number - 1, min = p.before.indexOf(Math.min(...p.before.slice(i)), i), same = min === i;
      const action = same ? `Minimum ${p.before[min]} is already at index ${i}: no swap.` : `Minimum ${p.before[min]} at index ${min}; swap ${p.before[i]} ↔ ${p.before[min]}.`;
      const labels = { [i]: same ? 'i = min' : 'fill i', ...(!same ? { [min]: 'min' } : {}) };
      const visual = row(cards(p.before, { roles: { ...roleRange(i, 'fixed'), [i]: 'target', [min]: 'selected' }, labels, arrows: same ? [] : [{ from: min, to: i, kind: 'swap' }], caption: `Pass ${p.number}, before selection swap` }), `${action} Compare all ${p.comparisons} remaining candidates before moving values.`)
        + row(cards(p.after, { roles: roleRange(i + 1, 'fixed'), labels: { [i]: 'fixed' }, caption: `Pass ${p.number}, completed` }), `Position ${i} is final. ${same ? 'The array stays unchanged.' : 'The displaced value returns to the minimum’s old position.'}`);
      frames.push({ title: `Pass ${p.number}: fill index ${i}`, visual, explanation: action });
      rows.push([p.number, `${p.before[min]} at ${min}`, same ? 'No swap' : `${i} ↔ ${min}`, `[${p.after.join(', ')}]`, p.comparisons]);
    }
    result = `Sorted: [${run.result.join(', ')}]. ${run.comparisons} key comparisons; ${run.moves} actual swaps. The last value is already in place after pass ${run.passes.length}.`;
  } else if (kind === 'insertion') {
    head = 'The key stays in a separate variable while larger prefix values shift right. The orange gap is a visual model of the next available slot; Java temporarily retains a duplicate value there.';
    for (const p of run.passes) {
      const i = p.number, key = p.before[i], a = [...p.before]; let j = i - 1;
      a[i] = null;
      let visual = row(cards(a, { roles: { ...roleRange(i, 'fixed'), [i]: 'target' }, held: key, labels: { [i]: 'gap' }, caption: `Pass ${i}: save key ${key}` }), `Save key = ${key}. Prefix 0..${i - 1} is sorted; start comparing at j = ${j}.`);
      while (j >= 0 && a[j] > key) {
        const value = a[j], before = [...a];
        visual += row(cards(before, { roles: { ...roleRange(i, 'fixed'), [j]: 'selected', [j + 1]: 'target' }, held: key, arrows: [{ from: j, to: j + 1, text: `shift ${value} →` }], labels: { [j]: 'j', [j + 1]: 'gap' }, caption: `${value} > ${key}: shift right` }), `${value} > ${key}: copy ${value} one cell right, then j--. The gap moves left; the held key does not change.`);
        a[j + 1] = a[j]; a[j] = null; j--;
      }
      const stop = j < 0 ? 'j = -1: the left boundary stops the loop; arr[-1] is never read.' : `${a[j]} > ${key} is false: stop after ${a[j]}.`;
      visual += row(cards(a, { roles: { ...roleRange(i + 1, 'fixed'), [j + 1]: 'target' }, held: key, labels: { [j + 1]: 'insert' }, caption: `Insert held key at ${j + 1}` }), `${stop} Insert the held key at j + 1 = ${j + 1}.`);
      visual += row(cards(p.after, { roles: roleRange(i + 1, 'fixed'), labels: { [j + 1]: 'key placed' }, caption: `Pass ${i} complete` }), `Prefix 0..${i} is now sorted. ${p.moves} shift${p.moves === 1 ? '' : 's'} + one insertion write.`);
      frames.push({ title: `Pass ${i}: hold ${key}, shift, insert`, visual, explanation: `${p.moves} shifts; ${stop} Insert ${key} at index ${j + 1}.` });
      rows.push([i, key, p.moves, j + 1, `[${p.after.join(', ')}]`]);
    }
    result = `Sorted: [${run.result.join(', ')}]. ${run.moves} shifts and ${run.passes.length} insertion writes; ${run.comparisons} key comparisons. Shifts are not swaps.`;
  } else if (kind === 'binary' || kind === 'linear') {
    const binary = kind === 'binary';
    head = binary ? 'Search for 7 in ascending order. The whole run shows inclusive low/high boundaries, the midpoint, and every range ruled out. None of the stored array values move.' : 'Search for 18. Only the index moves: failed checks advance left to right, and the first match returns immediately.';
    for (const [n, s] of run.steps.entries()) {
      const discarded = input.flatMap((_, i) => binary ? i < s.low || i > s.high ? [i] : [] : i < s.i ? [i] : []);
      const labels = {};
      if (binary) for (const [i, label] of [[s.low, 'low'], [s.i, 'mid'], [s.high, 'high']]) labels[i] = labels[i] ? `${labels[i]}/${label}` : label;
      else labels[s.i] = s.match ? 'found' : 'i';
      const roles = { ...Object.fromEntries(discarded.map(i => [i, 'discarded'])), [s.i]: s.match ? 'fixed' : 'selected' };
      const next = run.steps[n + 1];
      const reason = s.match ? `${s.value} == ${run.key}: return index ${s.i}. Stop.` : binary ? `${s.value} ${s.value < run.key ? '<' : '>'} ${run.key}: discard indexes ${s.value < run.key ? `${s.low}..${s.i}` : `${s.i}..${s.high}`}. ${s.value < run.key ? `low = mid + 1 = ${s.i + 1}` : `high = mid - 1 = ${s.i - 1}`}.` : `${s.value} == ${run.key} is false. Advance i to ${s.i + 1}.`;
      const visual = row(cards(input, { roles, labels, arrows: next ? [{ from: s.i, to: next.i, text: binary ? 'next midpoint' : 'advance i' }] : [], caption: `${binary ? 'Probe' : 'Check'} ${n + 1}` }), e(reason));
      frames.push({ title: `${binary ? 'Probe' : 'Check'} ${n + 1}`, visual, explanation: reason });
      rows.push(binary ? [n + 1, s.low, s.i, s.high, s.value, reason] : [n + 1, s.i, s.value, reason]);
    }
    result = `Return ${run.found} after ${run.steps.length} ${binary ? 'midpoint probes' : 'key comparisons'}. ${binary ? 'On the successful probe, low = mid = 8 and high = 9. Index 9 remains unvisited because index 8 matches.' : 'Later cells are not inspected after the match.'}`;
  } else if (kind === 'bubble') {
    head = 'A pass compares neighbouring pairs from left to right. Every swap moves the larger value right; at the end of the pass, the largest active value is final.';
    for (const p of run.passes) {
      const steps = run.steps.filter(s => s.pass === p.number), a = [...p.before];
      let visual = '';
      for (const [j, s] of steps.entries()) {
        const change = a[j] > a[j + 1];
        visual += row(cards(a, { roles: { ...Object.fromEntries(a.map((_,i) => [i, i >= a.length - p.number + 1 ? 'fixed' : ''])), [j]: 'target', [j + 1]: 'selected' }, labels: { [j]: 'j', [j + 1]: 'j + 1' }, arrows: change ? [{ from: j, to: j + 1, kind: 'swap' }] : [], caption: `Pass ${p.number}, adjacent comparison` }), e(s.explanation));
        a.splice(0, a.length, ...s.a);
      }
      visual += row(cards(p.after, { roles: Object.fromEntries(a.map((_,i) => [i, i >= a.length - p.number ? 'fixed' : ''])), caption: `Pass ${p.number} complete` }), `${p.moves ? `Largest active value ${p.after[a.length - p.number]} is fixed.` : 'No swaps in the entire pass: stop early.'}`);
      frames.push({ title: `Pass ${p.number}: ${p.comparisons} neighbour comparisons`, visual, explanation: `${p.moves} swaps; array after pass [${p.after}].` });
      rows.push([p.number, p.comparisons, p.moves, `[${p.after.join(', ')}]`]);
    }
    result = `Sorted: [${run.result.join(', ')}]. ${run.comparisons} key comparisons and ${run.moves} swaps.`;
  } else {
    head = 'First split ranges until each contains one value. Then read the merge returns below in execution order: complete the left child, complete the right child, merge, return.';
    for (const r of run.returns) {
      const choices = r.micro.filter(s => s.phase === 'choose' || s.phase === 'leftover').map(s => s.explanation);
      const visual = row(cards([...r.left, ...r.right], { roles: roleRange(r.left.length, 'selected'), labels: { 0: 'left front', [r.left.length]: 'right front' }, caption: `Merge ${r.lo}..${r.hi}: both children sorted` }), `Merge range ${r.lo}..${r.hi}; left [${r.left}], right [${r.right}]. Compare the two front values and advance only the chosen side.`)
        + `<ol class="merge-choices">${choices.map(c => `<li>${e(c)}</li>`).join('')}</ol>`
        + row(cards(r.result, { roles: roleRange(r.result.length, 'fixed'), caption: `Return sorted range ${r.lo}..${r.hi}` }), `Copy temp back to arr[${r.lo}..${r.hi}], then return. ${r.comparisons} key comparisons; ${r.result.length} temp writes and ${r.result.length} copy-back writes. Diagram indexes are relative to this run.`);
      frames.push({ title: `Merge return ${r.number}: range ${r.lo}..${r.hi}`, visual, explanation: `Both child ranges are sorted before this merge. Return [${r.result}].` });
      rows.push([r.number, `${r.lo}..${r.hi}`, `[${r.left}] + [${r.right}]`, `[${r.result}]`, r.comparisons]);
    }
    result = `Sorted: [${run.result.join(', ')}]. ${run.comparisons} key comparisons across all merges. ${run.writes} copy-back writes across three merge levels; peak extra array space is O(n).`;
  }
  const headers = kind === 'selection' ? ['Pass', 'Minimum', 'Action', 'Array after pass', 'Comparisons'] : kind === 'insertion' ? ['Pass', 'Held key', 'Shifts', 'Insert at', 'Array after pass'] : kind === 'binary' ? ['Probe', 'low', 'mid', 'high', 'Value', 'Decision'] : kind === 'linear' ? ['Check', 'Index', 'Value', 'Decision'] : kind === 'bubble' ? ['Pass', 'Comparisons', 'Swaps', 'Array after pass'] : ['Return', 'Range', 'Sorted inputs', 'Result', 'Comparisons'];
  return {
    body: `<p>${head}</p>${legend}<div class="whole-run" data-map-kind="${kind}">${kind === 'merge' ? recursionTree(input) : ''}${frames.map(f => pass(f.title, f.visual)).join('')}</div><p class="result-line">${e(result)}</p>`,
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
