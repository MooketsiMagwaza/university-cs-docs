// Trace numbers come from executions rather than handwritten parallel tables.
import assert from 'node:assert/strict';
const compare = (a, b, descending) => descending ? a < b : a > b;
export function search(kind, input, key, descending = false) {
  const a = [...input], steps = [];
  let found = -1;
  if (kind === 'linear') {
    for (let i = 0; i < a.length; i++) {
      const match = a[i] === key;
      steps.push({ i, value: a[i], low: 0, high: a.length - 1, decision: `${a[i]} == ${key} → ${match}; ${match ? `return ${i}` : 'advance i'}`, match });
      if (match) { found = i; break; }
    }
  } else {
    assert(a.every((v, i) => i === 0 || (descending ? a[i - 1] >= v : a[i - 1] <= v)), 'Binary input must use the requested ordering');
    let low = 0, high = a.length - 1;
    while (low <= high) {
      const i = low + Math.floor((high - low) / 2), match = a[i] === key;
      const goRight = descending ? a[i] > key : a[i] < key;
      steps.push({ i, value: a[i], low, high, match, decision: match ? `${a[i]} == ${key} → true; return ${i}` : `${a[i]} == ${key} → false; ${a[i]} ${descending ? '>' : '<'} ${key} → ${goRight}; ${goRight ? `low = ${i + 1}` : `high = ${i - 1}`}` });
      if (match) { found = i; break; }
      if (goRight) low = i + 1; else high = i - 1;
    }
  }
  assert(found === -1 ? !a.includes(key) : a[found] === key);
  return { input: a, steps, found, key, kind, descending };
}
export function sort(kind, input, descending = false) {
  if (kind === 'merge') return mergeSort(input, descending);
  const a = [...input], passes = [], steps = [];
  let comparisons = 0, moves = 0;
  for (let p = kind === 'insertion' ? 1 : 0; p < a.length - (kind === 'insertion' ? 0 : 1); p++) {
    const before = [...a], operations = [], startComparisons = comparisons, startMoves = moves;
    if (kind === 'bubble') {
      let swapped = false;
      for (let j = 0; j < a.length - 1 - p; j++) {
        const left = a[j], right = a[j + 1], change = compare(left, right, descending);
        comparisons++;
        if (change) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; moves++; swapped = true; }
        const explanation = `${left} ${descending ? '<' : '>'} ${right} → ${change}; ${change ? 'swap adjacent values' : 'leave the pair'}; pass ${p + 1}`;
        operations.push(explanation);
        steps.push({ title: `Pass ${p + 1}, compare indexes ${j} and ${j + 1}`, a: [...a], active: [j, j + 1], sorted: Array.from({ length: p }, (_, i) => a.length - 1 - i), explanation, pass: p + 1 });
      }
      passes.push({ number: p + 1, before, after: [...a], operations, comparisons: comparisons - startComparisons, moves: moves - startMoves });
      if (!swapped) break;
    } else if (kind === 'selection') {
      let min = p;
      for (let j = p + 1; j < a.length; j++) {
        const change = compare(a[min], a[j], descending), previous = min;
        comparisons++;
        const explanation = `${a[j]} ${descending ? '>' : '<'} ${a[previous]} → ${change}; ${change ? `best index becomes ${j}` : `best stays ${min}`}`;
        if (change) min = j;
        operations.push(explanation);
        steps.push({ title: `Pass ${p + 1}, scan index ${j}`, a: [...a], active: [p, j, min], sorted: Array.from({ length: p }, (_, i) => i), explanation, pass: p + 1 });
      }
      if (min !== p) { [a[p], a[min]] = [a[min], a[p]]; moves++; }
      const explanation = min === p ? 'Minimum is already in position; no swap.' : `Scan is complete: swap indexes ${p} and ${min}.`;
      operations.push(explanation);
      steps.push({ title: `Pass ${p + 1}, fill position ${p}`, a: [...a], active: [p], sorted: Array.from({ length: p + 1 }, (_, i) => i), explanation, pass: p + 1, print: true });
      passes.push({ number: p + 1, before, after: [...a], operations, comparisons: comparisons - startComparisons, moves: moves - startMoves });
    } else {
      const key = a[p]; let j = p - 1;
      steps.push({ title: `Pass ${p}, save key ${key}`, a: [...a], active: [p], key, sorted: Array.from({ length: p }, (_, i) => i), explanation: `key = arr[${p}] = ${key}. Save it before shifting overwrites its cell.`, pass: p });
      while (j >= 0) {
        comparisons++;
        const change = compare(a[j], key, descending);
        operations.push(`${a[j]} ${descending ? '<' : '>'} ${key} → ${change}`);
        if (!change) { steps.push({ title: `Pass ${p}, stop at index ${j}`, a: [...a], active: [j], key, explanation: `${a[j]} ${descending ? '<' : '>'} ${key} → false. The gap is index ${j + 1}.`, pass: p }); break; }
        const value = a[j]; a[j + 1] = a[j]; moves++;
        steps.push({ title: `Pass ${p}, shift ${value} right`, a: [...a], active: [j, j + 1], key, explanation: `arr[${j + 1}] = arr[${j}]. Temporary duplicate ${value} is safe because key ${key} is held separately.`, pass: p });
        j--;
      }
      a[j + 1] = key;
      steps.push({ title: `Pass ${p}, insert into index ${j + 1}`, a: [...a], active: [j + 1], sorted: Array.from({ length: p + 1 }, (_, i) => i), explanation: `arr[${j + 1}] = key = ${key}. Prefix 0..${p} is now sorted.`, pass: p, print: true });
      passes.push({ number: p, before, after: [...a], operations, comparisons: comparisons - startComparisons, moves: moves - startMoves });
    }
  }
  const expected = [...input].sort((x, y) => descending ? y - x : x - y);
  assert.deepEqual(a, expected);
  return { kind, input: [...input], result: a, passes, steps, comparisons, moves, descending };
}
export function mergeSort(input, descending = false) {
  const a = [...input], calls = [], returns = [], steps = [], stack = [];
  let comparisons = 0, writes = 0;
  function visit(lo, hi) {
    const call = calls.length + 1, mid = lo + Math.floor((hi - lo) / 2);
    calls.push({ call, lo, hi, mid: lo < hi ? mid : null, depth: stack.length });
    stack.push({ name: `mergeSort(${lo}, ${hi})`, next: lo >= hi ? 'Base case: return' : `Call left ${lo}..${mid}, then right ${mid + 1}..${hi}, then merge` });
    steps.push({ title: `Call ${call}: range ${lo}..${hi}`, a: [...a], range: `${lo}:${hi}`, stack: structuredClone(stack), explanation: lo >= hi ? `${lo} >= ${hi}: zero or one value, already sorted.` : `mid = ${lo} + (${hi} - ${lo}) / 2 = ${mid}. Values have not moved.`, print: false });
    if (lo >= hi) { stack.pop(); return; }
    visit(lo, mid);
    stack[stack.length - 1].next = `Left returned; call right ${mid + 1}..${hi}, then merge`;
    visit(mid + 1, hi);
    stack[stack.length - 1].next = `Both children returned; merge(${lo}, ${mid}, ${hi})`;
    const left = a.slice(lo, mid + 1), right = a.slice(mid + 1, hi + 1), temp = [], micro = [];
    let i = 0, j = 0, count = 0;
    const snapshot = (title, explanation, phase = 'choose') => micro.push({ title, explanation, left: [...left], right: [...right], temp: [...temp], i, j, out: temp.length, lo, hi, mid, phase, a: [...a] });
    snapshot('Start with two sorted runs', `left = ${lo}, right = ${mid + 1}, out = 0. Both input ranges are sorted.`, 'start');
    while (i < left.length && j < right.length) {
      const takeLeft = descending ? left[i] >= right[j] : left[i] <= right[j];
      const first = left[i], second = right[j]; count++; comparisons++;
      temp.push(takeLeft ? left[i++] : right[j++]);
      snapshot(`Write temp[${temp.length - 1}] = ${temp.at(-1)}`, `${first} ${descending ? '>=' : '<='} ${second} → ${takeLeft}; take ${takeLeft ? 'left' : 'right'} and advance only its pointer.`);
    }
    while (i < left.length) { temp.push(left[i++]); snapshot(`Copy left leftover ${temp.at(-1)}`, 'Right run is exhausted. Copy a remaining left value without a key comparison.', 'leftover'); }
    while (j < right.length) { temp.push(right[j++]); snapshot(`Copy right leftover ${temp.at(-1)}`, 'Left run is exhausted. Copy a remaining right value without a key comparison.', 'leftover'); }
    for (let k = 0; k < temp.length; k++) { a[lo + k] = temp[k]; writes++; snapshot(`Copy back arr[${lo + k}] = ${temp[k]}`, `temp[${k}] is copied to arr[start + ${k}]. Unread source values were protected in temp.`, 'copyback'); }
    returns.push({ number: returns.length + 1, call, lo, mid, hi, left, right, result: [...temp], comparisons: count, micro });
    steps.push({ title: `Return ${returns.length}: merge(${lo}, ${mid}, ${hi})`, a: [...a], range: `${lo}:${hi}`, stack: structuredClone(stack), explanation: `Return from call ${call}: [${temp.join(', ')}]. Both children completed before this merge.`, print: true });
    stack.pop();
  }
  if (a.length) visit(0, a.length - 1);
  assert.deepEqual(a, [...input].sort((x, y) => descending ? y - x : x - y));
  assert.equal(calls.length, a.length ? 2 * a.length - 1 : 0);
  assert.equal(returns.length, Math.max(0, a.length - 1));
  return { kind: 'merge', input: [...input], result: a, calls, returns, steps, comparisons, writes, descending };
}
export function verifySimulations() {
  for (const kind of ['bubble', 'selection', 'insertion', 'merge']) for (const input of [[], [1], [4, 2, 5, 1, 3], [2, 2, 1], [5, 4, 3, 2, 1], [1, 2, 3]]) for (const descending of [false, true]) sort(kind, input, descending);
  for (const input of [[], [1], [1, 2, 2, 5]]) for (const key of [-1, 1, 2, 5, 9]) { search('linear', input, key); search('binary', input, key); }
  const merge = mergeSort([63, 29, 72, 85, 18, 49, 3, 54]);
  assert.deepEqual(merge.returns.map((r) => r.call), [3, 6, 2, 10, 13, 9, 1]);
  assert.equal(merge.returns.at(-1).comparisons, 5);
  return '48 sorting executions, 30 search executions, and depth-first merge invariants passed';
}
