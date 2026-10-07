// Merge operations are computed, not hand-transcribed. Child operations are
// paired for a labelled side-by-side overview, not a claim of parallel Java.
function mergeTrace(left, right, start) {
  let i = 0, j = 0;
  const output = [], steps = [];
  while (i < left.length || j < right.length) {
    const leftover = i === left.length || j === right.length;
    const chosen = j === right.length || (i < left.length && left[i] <= right[j]) ? 'left' : 'right';
    const value = chosen === 'left' ? left[i] : right[j];
    steps.push({start, end:start + left.length + right.length - 1,
      left, right, i, j, output:[...output], chosen, value,
      action:leftover ? 'leftover' : 'compare',
      comparison:leftover ? 'One side empty' : `${left[i]} > ${right[j]}? ${left[i] > right[j] ? 'True' : 'False'}`});
    output.push(value);
    if (chosen === 'left') i++; else j++;
  }
  return {steps, output};
}

export function createMergeJourney() {
  const values = [7, 3, 5, 2];
  const scenes = [];
  let comparisons = 0;
  const add = (action, heading, caption, narration, state = {}) => scenes.push({
    mode: 'merge-journey', action, heading, caption, narration,
    values: [...values], comparisons, start: 0, end: values.length - 1, ...state,
  });
  add('intro', 'Start with four values', 'Small sorted pieces combine into one sorted row.',
    'Merge sort builds an ordered row from smaller ordered pieces. Follow these same four values through every split, copy, and return.');
  add('split', 'Split the problem, not the values', 'LEFT child: positions 0..1 · RIGHT child: 2..3',
    'Split the index range into left and right children. The values have not moved. We will show both children together so you can compare their work.', {mid:1});
  const childTraces = [mergeTrace([7],[3],0), mergeTrace([5],[2],2)];
  add('children-base', 'Both children split into single values', 'One value is already sorted: this is the base case.',
    'Each child splits into single values. Each single value is already sorted. This is a side by side overview. The Java code actually finishes the left child before the right.',
    {children:childTraces.map(trace => trace.steps[0])});
  for (let step = 0; step < 2; step++) {
    const children = childTraces.map(trace => trace.steps[step]);
    comparisons += children.filter(child => child.action === 'compare').length;
    add(`children-${children[0].action}`,
      step === 0 ? 'Compare on BOTH sides, then copy' : 'Copy each child’s leftover',
      step === 0 ? 'True: take the right value. False: take the left.' : 'No extra comparisons: 7 and 5 are left over.',
      step === 0 ? 'On the left, is seven greater than three? True, so copy three. On the right, is five greater than two? True, so copy two. Both copies go into their own temporary output.' :
        'Both right inputs are empty. Copy the leftover seven on the left, and five on the right. Neither copy needs another comparison.', {children});
  }
  const children = childTraces.map((trace,index) => ({...trace.steps.at(-1), output:trace.output, start:index*2, end:index*2+1}));
  add('children-copyback', 'Both children return sorted results', 'LEFT returns [3, 7] · RIGHT returns [2, 5]',
    'Copy each completed result back into its own array range. The left child returns three, seven. The right child returns two, five. Both are now ready for the parent.', {children});
  values.splice(0,4,...childTraces.flatMap(trace => trace.output));
  const final = mergeTrace(values.slice(0,2), values.slice(2), 0);
  for (const step of final.steps) {
    const leftover = step.action === 'leftover';
    if (!leftover) comparisons++;
    add(step.action, leftover ? 'One side is empty: copy the leftover' : `${step.comparison}. Choose ${step.chosen.toUpperCase()}.`,
      `Copy ${step.value} into temp[${step.output.length}]. ${leftover ? 'No extra comparison.' : `Only ${step.chosen === 'left' ? 'L' : 'R'} advances.`}`,
      leftover ? `One side is empty. Copy the remaining ${step.value}. This is not another comparison.` :
        `Is ${step.left[step.i]} greater than ${step.right[step.j]}? ${step.chosen === 'right' ? 'True' : 'False'}. Copy ${step.value} from the ${step.chosen} into temporary output. Only that pointer advances.`, {...step, mid:1});
  }
  add('copyback', 'Copy back, then return the whole range', '2, 3, 5, 7 → array positions 0..3',
    'Copy the completed output back into the original range. Only now is the whole array sorted.',
    {left:[3,7], right:[2,5], i:2, j:2, output:final.output});
  values.splice(0,4,...final.output);
  add('finish', 'Both children finished. Parent finished.', '5 comparisons · 8 temp copies · 8 copy-back writes',
    'Five comparisons, eight temporary copies, and eight copy back writes. Merging is not swapping. On equal values, greater than is false, so choose the left first to preserve their order.');
  return { title: 'Merge sort · both children, every return', scenes };
}
