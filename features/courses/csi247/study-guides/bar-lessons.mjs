import { escape as e } from './visuals.mjs';

export function bars(values, label, highlighted=[]) {
  const max=Math.max(1,...values.map(Math.abs)), base=170, cell=48;
  return `<figure class="value-bars"><figcaption>${e(label)}</figcaption><svg viewBox="0 0 ${values.length*cell+50} 225" role="img" aria-label="${e(label)}. Values by index: ${values.join(', ')}"><text class="bar-axis" x="8" y="16">value</text><path class="bar-baseline" d="M20,${base} H${values.length*cell+25}"/>${values.map((v,i)=>{const h=Math.abs(v)/max*125,x=28+i*cell;return `<g><rect class="value-bar ${highlighted.includes(i)?'is-active':''}" x="${x}" y="${base-h}" width="32" height="${h}" rx="2"/><text x="${x+16}" y="${base-h-8}">${v}</text><text class="bar-axis" x="${x+16}" y="192">${i}</text></g>`}).join('')}<text class="bar-axis" x="${values.length*cell+20}" y="216" text-anchor="end">array index →</text></svg></figure>`;
}

export function barLesson(kind) {
  const examples={
    bubble:{before:[7,3,5,2],after:[3,5,2,7],active:[3],title:'A tall bar travels through adjacent swaps',text:'Compare 7 with 3, then 7 with 5, then 7 with 2. Three adjacent swaps move 7 to index 3. The remaining bars are NOT sorted yet: 5 still precedes 2. One pass fixes the largest active value, not the entire array.'},
    selection:{before:[7,3,5,2],after:[2,3,5,7],active:[0,3],title:'Find the shortest bar, then exchange two positions',text:'Scan all remaining bars: 2 is the minimum at index 3. After the scan, swap 7 and 2 once. The displaced 7 goes back to index 3. The scan itself changes only minIndex; the bars do not move while you search.'},
    insertion:{before:[3,5,7,2],after:[2,3,5,7],active:[0],title:'Hold one bar; shift the larger bars right',text:'The first three bars are sorted. Save key 2. Copy 7 one place right, then 5, then 3. Insert held 2 at index 0. This is three shifts plus one insertion, not three swaps. The held copy prevents the value 2 from being lost.'},
    merge:{before:[2,7,3,5],after:[2,3,5,7],active:[0,1,2,3],title:'Two rising runs become one rising run',text:'LEFT [2,7] and RIGHT [3,5] are individually sorted. Compare 2 ≤ 3: take 2. Compare 7 ≤ 3: take 3. Compare 7 ≤ 5: take 5. RIGHT is empty, so copy leftover 7. Output [2,3,5,7] was built separately, then copied back. Three key comparisons, four temporary writes, four copy-back writes.'},
    linear:{before:[7,3,5,2],after:[7,3,5,2],active:[2],title:'Searching visits bars; it does not rearrange them',text:'Searching for 5 checks indexes 0, 1, then 2 and returns 2. Heights and positions are unchanged. The selected bar marks where the key was found, not a sorted position.'},
    binary:{before:[2,3,5,7,9],after:[2,3,5,7,9],active:[2,3],title:'Order lets a probe rule out a whole side',text:'Searching for 7 first probes index 2, value 5. Because 5 < 7 and the bars rise left to right, indexes 0..2 cannot contain 7. Set low = 3; the next midpoint is 3 and matches. No bar moves: only the candidate interval changes.'},
  };
  const x=examples[kind];
  return `<p>Bar height means <strong>value</strong>; horizontal position means <strong>index</strong>. All panels below use the same height scale. A taller bar is not “more sorted”.</p><h3>${x.title}</h3><div class="bar-comparison">${bars(x.before,'Before',[])}${bars(x.after,['linear','binary'].includes(kind)?'After searching: unchanged order':'After this operation',x.active)}</div><p>${x.text}</p><p><strong>Check yourself:</strong> identify which indexes are guaranteed final, which values were merely inspected, and whether the operation swapped, shifted or copied data. A sorted ascending array has non-decreasing heights, including equal-height neighbours.</p>`;
}
