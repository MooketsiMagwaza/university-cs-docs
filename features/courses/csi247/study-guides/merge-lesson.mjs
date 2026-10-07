import { escape as e, player } from './visuals.mjs';

/** Three labelled lanes keep two input runs distinct from temporary output. */
export function mergeScene(merge, previous, current) {
  const width = 620, cell = 55, start = 48;
  const chosen = current.temp.length - previous.temp.length === 1;
  const leftChosen = chosen && current.i > previous.i;
  const chosenIndex = leftChosen ? previous.i : previous.j;
  const ySource = leftChosen ? 66 : 153, outIndex = current.temp.length - 1;
  const lane = (values, y, pointer, base, label, side) => `<text class="merge-label" x="16" y="${y - 19}">${e(label)}</text>${values.map((v,i) => {
    const selected = chosen && side === (leftChosen ? 'left' : 'right') && i === chosenIndex;
    const state = i < pointer ? 'consumed' : selected ? 'chosen' : i === pointer ? 'front' : '';
    return `<g class="merge-value ${state}"><rect x="${start+i*cell}" y="${y}" width="44" height="36" rx="4"/><text x="${start+i*cell+22}" y="${y+24}">${v}</text><text class="merge-index" x="${start+i*cell+22}" y="${y+52}">${base+i}</text>${i === pointer ? `<text class="merge-index" x="${start+i*cell+22}" y="${y-5}">${side === 'left' ? 'L' : 'R'}</text>` : ''}</g>`;
  }).join('')}${pointer === values.length ? `<text class="merge-label" x="${start+values.length*cell+5}" y="${y+24}">exhausted</text>` : ''}`;
  const output = Array.from({length:merge.result.length},(_,i)=>`<g class="merge-value output ${chosen && i===outIndex ? 'chosen' : ''}"><rect x="${start+i*cell}" y="264" width="44" height="36" rx="4"/><text x="${start+i*cell+22}" y="288">${current.temp[i] ?? '·'}</text><text class="merge-index" x="${start+i*cell+22}" y="316">${i}</text></g>`).join('');
  const from = start + chosenIndex*cell+22, to = start+outIndex*cell+22;
  const arrow = chosen ? `<path class="merge-path" d="M${from},${ySource+36} V${ySource+59} H590 V228 H${to} V253"/><path class="merge-path" d="M${to-5},247 L${to},257 L${to+5},247"/>` : '';
  return `<figure class="merge-scene" data-merge-scene><svg viewBox="0 0 ${width} 340" role="img" aria-label="${e(current.explanation)} Output: ${current.temp.join(', ')}"><title>${e(current.title)}</title>${lane(merge.left,66,previous.i,merge.lo,'LEFT: sorted input','left')}${lane(merge.right,153,previous.j,merge.mid+1,'RIGHT: sorted input','right')}<text class="merge-label" x="16" y="245">TEMP: output being built (not the original array)</text>${output}${arrow}</svg><figcaption>${chosen ? `Copy ${current.temp.at(-1)} from ${leftChosen ? 'LEFT' : 'RIGHT'} into temp[${outIndex}]. ${leftChosen ? `L: ${merge.lo+previous.i} → ${merge.lo+current.i}; R stays ${merge.mid+1+previous.j}` : `R: ${merge.mid+1+previous.j} → ${merge.mid+1+current.j}; L stays ${merge.lo+previous.i}`}.` : 'Both runs are sorted. Only their front unread values may compete.'}</figcaption></figure>`;
}

export function mergeReturnVisual(r) {
  const end = r.micro.filter(s=>['choose','leftover'].includes(s.phase)).at(-1);
  const start = r.micro[0];
  return `<div class="merge-return"><p><strong>Two sorted inputs:</strong> LEFT [${r.left.join(', ')}], RIGHT [${r.right.join(', ')}].</p><ol class="merge-picks">${r.micro.filter(s=>['choose','leftover'].includes(s.phase)).map((s,i)=>`<li><strong>temp[${i}] = ${s.temp.at(-1)}</strong> — ${e(s.explanation)}</li>`).join('')}</ol><p><strong>Temporary output:</strong> [${end.temp.join(', ')}]. Copy it to arr[${r.lo}..${r.hi}], then return to the parent. ${r.comparisons} comparisons.</p><details><summary>See the two input lanes before this merge</summary>${mergeScene(r,start,start)}</details></div>`;
}

export function focusedMergeLesson(run) {
  const r=run.returns.at(-1), picks=r.micro.filter(s=>['choose','leftover'].includes(s.phase));
  let previous=r.micro[0];
  const frames=picks.map((current,i)=>{
    const frame={title:`Output ${i+1} of ${picks.length}: ${current.title}`,visual:mergeScene(r,previous,current),explanation:current.explanation};
    previous=current;return frame;
  });
  return `<p>Merging is <strong>not swapping</strong> the two inputs. Read only the front unread item from each sorted run, copy the smaller into a separate output, and advance only that input pointer. The other pointer waits.</p><p>For this final merge, LEFT is [${r.left.join(', ')}] and RIGHT is [${r.right.join(', ')}]. The arrow connects the chosen input to its new output position. Faded input cells have already been consumed.</p>${player('merge-lanes','Follow one value from input to output',frames,['Step','Written value','Left consumed','Right consumed','Output'],picks.map(s=>[s.temp.at(-1),s.i,s.j,`[${s.temp.join(', ')}]`]))}<div class="callout"><strong>After the last choice:</strong> temp is [${r.result.join(', ')}]. Copy temp[k] to arr[start + k] for every k. Only then is the original range sorted and this call finished. Copying leftovers does not compare two keys; copying back is not a swap.</div><p><strong>Why only the fronts?</strong> Everything behind a run’s front is at least that large. Therefore the smaller of the two fronts is the smallest unread value overall. On equality, taking LEFT first preserves stability.</p>`;
}

export function splitExplanation() {
  return `<div class="merge-phases"><div><strong>1. Go down: split ranges</strong><p>The recursive calls change start/end indexes. No values move during splitting.</p><code>[63,29,72,85,18,49,3,54]<br/>[63,29,72,85] | [18,49,3,54]<br/>[63,29] | [72,85] | [18,49] | [3,54]<br/>[63] [29] [72] [85] [18] [49] [3] [54]</code></div><div><strong>2. Come back: merge results</strong><p>A call waits for its left child, then its right child. It can merge only after both return sorted.</p><code>[29,63] → [72,85] → [29,63,72,85]<br/>[18,49] → [3,54] → [3,18,49,54]<br/>[3,18,29,49,54,63,72,85]</code><p>These arrows show actual depth-first return order, not simultaneous levels.</p></div></div>`;
}
