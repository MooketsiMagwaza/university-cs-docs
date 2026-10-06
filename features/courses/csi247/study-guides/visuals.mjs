// Pure semantic renderers shared by screen, offline HTML and print output.
export const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const list = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
export const code = (source, language = 'java') => `<figure class="code"><figcaption>${escape(language)}</figcaption><pre><code>${escape(source.replace(/[ \t]+$/gm, ''))}</code></pre></figure>`;
function columns(headers) {
  const weights = headers.map((header) => /^(step|pass|return|call #|depth|probe|check|low|high|mid|i|j|value|arr\[i\]|key comparisons|swaps|shifts|out|left \(absolute\)|right \(absolute\))$/i.test(header) ? .8 : /evaluated|decision|reason|repair|consequence|what goes|why|operation/i.test(header) ? 4 : 2);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return `<colgroup>${weights.map((weight) => `<col style="width:${(100 * weight / total).toFixed(2)}%">`).join('')}</colgroup>`;
}
export function table(headers, rows, label = 'Worked trace') {
  return `<div class="table-wrap"><table aria-label="${escape(label)}">${columns(headers)}<thead><tr>${headers.map((h) => `<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell, i) => `<td data-label="${escape(headers[i])}">${escape(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
export function array(values, { active = [], sorted = [], discarded = [], labels = {}, offset = 0, empty = false } = {}) {
  return `<div class="array" role="img" aria-label="${escape(values.length ? `Array: ${values.join(', ')}. ${Object.entries(labels).map(([i, text]) => `Index ${Number(i) + offset}: ${text}`).join('; ')}` : 'Empty array')} ">${values.length ? values.map((value, i) => `<div class="cell ${active.includes(i) ? 'active' : ''} ${sorted.includes(i) ? 'done' : ''} ${discarded.includes(i) ? 'discarded' : ''} ${empty ? 'empty' : ''}"><span>${escape(value === null ? '·' : value)}</span><small>${offset + i}${labels[i] ? `<br>${escape(labels[i])}` : ''}</small></div>`).join('') : '<span class="empty-message">[] - no valid index</span>'}</div>`;
}
export function figure(body, caption) {
  return `<figure class="diagram">${body}<figcaption>${caption}</figcaption></figure>`;
}
export function stack(frames) {
  return `<div class="stack"><p class="eyebrow">Call stack - newest frame at the top</p>${[...frames].reverse().map((frame, i) => `<div class="stack-frame ${i === 0 ? 'active' : ''}"><strong>${escape(frame.name)}</strong><span>${escape(i === 0 ? frame.next : `Waiting: ${frame.next}`)}</span></div>`).join('') || '<p>Stack empty: control has returned to the caller.</p>'}</div>`;
}
export function recursionTree(values, activeRange = '') {
  const width = 880, step = 96, nodes = [], edges = [];
  function walk(lo, hi, depth, parent) {
    if (lo > hi) return;
    const x = 45 + ((lo + hi) / 2) * ((width - 90) / Math.max(1, values.length - 1));
    const y = 35 + depth * step;
    const node = { lo, hi, x, y };
    if (parent) edges.push(`<path d="M${parent.x},${parent.y + 22} L${x},${y - 22}"/>`);
    nodes.push(`<g class="${`${lo}:${hi}` === activeRange ? 'tree-active' : ''}"><rect x="${x - 42}" y="${y - 22}" width="84" height="44" rx="7"/><text x="${x}" y="${y - 2}">${lo}..${hi}</text><text class="tree-sub" x="${x}" y="${y + 13}">${lo === hi ? values[lo] : `mid=${Math.floor((lo + hi) / 2)}`}</text></g>`);
    if (lo < hi) { const mid = Math.floor((lo + hi) / 2); walk(lo, mid, depth + 1, node); walk(mid + 1, hi, depth + 1, node); }
  }
  walk(0, values.length - 1, 0);
  const height = 76 + Math.ceil(Math.log2(Math.max(1, values.length))) * step;
  return `<div class="tree-scroll" tabindex="0" aria-label="Call tree diagram; scroll horizontally on narrow screens"><svg class="tree" viewBox="0 0 ${width} ${height}" role="img" aria-label="Merge sort call tree. Each node shows inclusive index bounds; leaves contain the original values."><title>Merge sort range tree</title><g class="tree-edges">${edges.join('')}</g>${nodes.join('')}</svg></div>`;
}
export function levels(kind, n = 8) {
  const items = kind === 'merge' ? [['8 values', '1 run × 8 = 8'], ['4 + 4', '2 runs × 4 = 8'], ['2 + 2 + 2 + 2', '4 runs × 2 = 8'], ['1-value leaves', 'Base cases: stop']] : kind === 'binary' ? [['n candidates', 'One midpoint probe'], ['n / 2', 'One midpoint probe'], ['n / 4', 'One midpoint probe'], ['At most 1', 'Match or empty range']] : kind === 'linear' ? [['First value', '1 comparison'], ['First half', 'About n / 2 comparisons'], ['Last or absent', 'n comparisons']] : [['Pass 1', 'n - 1 comparisons'], ['Pass 2', 'n - 2 comparisons'], ['Last pass', '1 comparison']];
  return figure(`<div class="levels">${items.map(([label, detail], i) => `<div><strong>${escape(label)}</strong><span style="--level:${kind === 'merge' ? 100 : Math.max(10, 100 / (i + 1))}%"></span><small>${escape(detail)}</small></div>`).join('')}</div>`, kind === 'merge' ? 'Splitting gives log₂ n merge levels. Every merge level processes n values in total. The tree shows dependencies, not execution in level order.' : kind === 'binary' ? 'Halving repeatedly gives logarithmic growth. A probe means one visited midpoint, even if Java evaluates two comparison expressions.' : kind === 'linear' ? 'Linear growth: doubling the number of candidates can double the scan.' : 'Worst-case triangular work: (n - 1) + (n - 2) + ... + 1 = n(n - 1)/2.');
}
export function player(id, title, frames, headers, rows) {
  if (!frames.length) return '<p>No execution steps: the empty input returns immediately.</p>';
  return `<section class="player" data-player="${escape(id)}"><h3>${title}</h3><div class="player-controls"><button type="button" data-action="reset">Reset</button><button type="button" data-action="prev">Previous</button><button type="button" data-action="next">Next</button><output data-progress>Step 1 of ${frames.length}</output></div><div class="frames">${frames.map((frame, i) => `<div class="frame" data-frame="${i}" ${i ? 'hidden' : ''}><h4>${escape(frame.title)}</h4>${frame.visual}<p class="decision">${escape(frame.explanation)}</p></div>`).join('')}</div><div class="current-row" aria-live="polite" data-current>Current: ${escape(rows[0].join(' | '))}</div><details class="full-trace"><summary>Full trace table - select a row to jump to its scene</summary><div class="table-wrap"><table>${columns(headers)}<thead><tr>${headers.map((h) => `<th>${escape(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((row, i) => `<tr data-row="${i}" ${i === 0 ? 'aria-current="step"' : ''}><td><button type="button" data-jump="${i}" aria-label="Show step ${i + 1}">${i + 1}</button></td>${row.map((cell, j) => `<td data-label="${escape(headers[j + 1] || '')}">${escape(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details><div class="print-only storyboard">${frames.filter((frame) => frame.print).map((frame) => `<div class="milestone"><h4>${escape(frame.title)}</h4>${frame.visual}<p>${escape(frame.explanation)}</p></div>`).join('')}</div></section>`;
}
