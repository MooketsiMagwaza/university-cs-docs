import { escape as e } from './visuals.mjs';

// Values, not index ranges: the same positions line up on every level.
// Both diagrams describe dependencies, not simultaneous recursive execution.
export function mergeTree(run, returning = false) {
  const width = 560, cell = 66, start = 16, top = 16, step = 76;
  const nodes = [], edges = [], levels = [];
  function visit(lo, hi, depth, parent) {
    const x = start + lo * cell + 4, w = (hi - lo + 1) * cell - 8;
    const y = top + depth * step, centre = x + w / 2;
    const result = run.returns.find(r => r.lo === lo && r.hi === hi);
    const values = returning && result ? result.result : run.input.slice(lo, hi + 1);
    (levels[depth] ??= []).push(`[${values.join(', ')}]`);
    if (parent) {
      const from = returning ? [centre, y - 3] : [parent.x, parent.y + 41];
      const to = returning ? [parent.x, parent.y + 43] : [centre, y - 4];
      const direction = returning ? 1 : -1;
      edges.push(`<path d="M${from} L${to}"/><path d="M${to[0] - 4},${to[1] + direction * 7} L${to} L${to[0] + 4},${to[1] + direction * 7}"/>`);
    }
    nodes.push(`<g class="merge-tree-group ${returning && result ? 'joined' : ''}" data-values="${values.join(',')}"><rect x="${x}" y="${y}" width="${w}" height="40" rx="5"/>${values.map((value, i) => `<text x="${start + (lo + i) * cell + cell / 2}" y="${y + 28}">${value}</text>`).join('')}</g>`);
    if (lo < hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      visit(lo, mid, depth + 1, { x: centre, y });
      visit(mid + 1, hi, depth + 1, { x: centre, y });
    }
  }
  visit(0, run.input.length - 1, 0);
  const title = returning ? 'Coming back up: join sorted groups' : 'Going down: split into smaller groups';
  const caption = returning
    ? 'Read from the bottom upward. Each pair of smaller groups produces the sorted group above it. The top row is the finished array.'
    : 'Read from the top downward. Eight values become two groups of four, then pairs, then single values. Nothing has changed position yet.';
  const description = `${title}. From top to bottom: ${levels.map(groups => groups.join(' and ')).join('; then ')}. ${caption}`;
  return `<figure class="merge-tree-figure" data-merge-tree="${returning ? 'return' : 'split'}"><h3>${title}</h3><svg class="merge-value-tree" viewBox="0 0 ${width} 294" role="img" aria-label="${e(description)}"><title>${e(title)}</title><g class="merge-tree-edges">${edges.join('')}</g>${nodes.join('')}</svg><figcaption>${caption}</figcaption></figure>`;
}

export function mergeChoices(merge) {
  let previous = merge.micro[0];
  return merge.micro.filter(s => s.phase === 'choose' || s.phase === 'leftover').map(current => {
    const left = merge.left[previous.i], right = merge.right[previous.j];
    const fromLeft = current.i > previous.i, value = current.temp.at(-1);
    const reason = current.phase === 'leftover'
      ? `The ${fromLeft ? 'right' : 'left'} group is empty. Copy ${value} from the ${fromLeft ? 'left' : 'right'}; no comparison is needed.`
      : `${left} ${left <= right ? '≤' : '>'} ${right}: copy ${value} from the ${fromLeft ? 'left' : 'right'}. ${fromLeft ? right : left} stays at the front of the other group.`;
    const item = { previous, current, fromLeft, value, reason };
    previous = current;
    return item;
  });
}

// Compact view of one completed join. The input groups remain distinct and
// both arrows lead into a separate output row: this is a copy, not a swap.
export function mergeJoinDiagram(merge) {
  const cell = 55, width = 520, groupY = 33, outputY = 124;
  const group = (values, centre, y, role, label) => {
    const x = centre - values.length * cell / 2;
    return `<g class="merge-join-group ${role}"><text class="merge-join-label" x="${centre}" y="${role === 'joined' ? y + 58 : y - 10}">${label}</text>${values.map((v, i) => `<rect x="${x + i * cell + 2}" y="${y}" width="51" height="38" rx="3"/><text class="merge-join-value" x="${x + i * cell + cell / 2}" y="${y + 26}">${v}</text>`).join('')}</g>`;
  };
  return `<svg class="merge-join-diagram" viewBox="0 0 ${width} 194" role="img" aria-label="Left [${merge.left.join(', ')}] and right [${merge.right.join(', ')}] join to make [${merge.result.join(', ')}]"><title>Two sorted groups become one sorted group</title>${group(merge.left, 130, groupY, 'left', 'Left group')}${group(merge.right, 390, groupY, 'right', 'Right group')}<path class="merge-tree-edges" d="M130,77 L242,117 M390,77 L278,117 M234,115 L242,117 L239,109 M281,109 L278,117 L286,115"/>${group(merge.result, 260, outputY, 'joined', 'Combined row')}</svg>`;
}

export function mergeDecisionDiagram(merge, choice) {
  const { previous, current, fromLeft, value } = choice;
  const cell = 54, groupY = 35, outputY = 151;
  const source = (values, centre, consumed, isLeft) => {
    const start = centre - values.length * cell / 2;
    return `<text class="merge-join-label" x="${centre}" y="20">${isLeft ? 'Left' : 'Right'}</text>${values.map((v, i) => `<g class="merge-decision-cell ${i < consumed ? 'used' : ''} ${i === consumed ? 'front' : ''} ${i === consumed && fromLeft === isLeft ? 'chosen' : ''}"><rect x="${start + i * cell + 2}" y="${groupY}" width="50" height="37" rx="3"/><text x="${start + i * cell + 27}" y="${groupY + 26}">${v}</text></g>`).join('')}`;
  };
  const xFrom = (fromLeft ? 130 - merge.left.length * cell / 2 + previous.i * cell : 390 - merge.right.length * cell / 2 + previous.j * cell) + 27;
  const xTo = 260 - merge.result.length * cell / 2 + (current.temp.length - 1) * cell + 27;
  return `<svg class="merge-decision-diagram" data-picked="${value}" data-output="${current.temp.join(',')}" viewBox="0 0 520 218" role="img" aria-label="${e(choice.reason)} Output so far: ${current.temp.join(', ')}"><title>${e(choice.reason)}</title>${source(merge.left, 130, previous.i, true)}${source(merge.right, 390, previous.j, false)}<path class="merge-copy-arrow" d="M${xFrom},76 C${xFrom},107 ${xTo},110 ${xTo},146 M${xTo - 4},139 L${xTo},146 L${xTo + 4},139"/><text class="merge-join-label" x="260" y="209">Output so far</text>${merge.result.map((_, i) => `<g class="merge-decision-cell output ${i === current.temp.length - 1 ? 'chosen' : ''}"><rect x="${260 - merge.result.length * cell / 2 + i * cell + 2}" y="${outputY}" width="50" height="37" rx="3"/><text x="${260 - merge.result.length * cell / 2 + i * cell + 27}" y="${outputY + 26}">${current.temp[i] ?? '·'}</text></g>`).join('')}</svg>`;
}

export function finalMergeWalkthrough(run) {
  const merge = run.returns.at(-1);
  return `<p>Both halves are now sorted. Look only at the first value not yet copied in each half. The arrow shows which value we copy next; faded values have already been used.</p><ol class="merge-decision-list">${mergeChoices(merge).map(choice => `<li><div class="merge-decision-visual">${mergeDecisionDiagram(merge, choice)}</div><p>${e(choice.reason)} The output is now <code>[${choice.current.temp.join(', ')}]</code>.</p></li>`).join('')}</ol><p><strong>Finish:</strong> copy this completed row back into the original array. The output is now <code>[${run.result.join(', ')}]</code>.</p><p><strong>Why compare only the fronts?</strong> Each group is already sorted. Nothing behind its front can be smaller, so the smaller front must be next.</p>`;
}
