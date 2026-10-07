// One computed trace drives the picture, comparisons, code and sound cues.
// Sibling ranges are juxtaposed for teaching; recursive Java visits them in order.
export const INPUT = [7, 3, 8, 2, 6, 1, 5, 4];

export function mergeTrace(left, right, start = 0) {
  let i = 0, j = 0;
  const output = [], steps = [];
  while (i < left.length || j < right.length) {
    const action = i === left.length || j === right.length ? 'leftover' : 'compare';
    const chosen = j === right.length || (i < left.length && left[i] <= right[j]) ? 'left' : 'right';
    const value = chosen === 'left' ? left[i] : right[j];
    steps.push({start, left: [...left], right: [...right], i, j, output: [...output], chosen, value, action,
      comparison: action === 'compare' ? `${left[i]} > ${right[j]}?` : '',
      answer: action === 'compare' ? (left[i] > right[j] ? 'yes' : 'no') : ''});
    output.push(value);
    if (chosen === 'left') i++; else j++;
  }
  return {start, left: [...left], right: [...right], steps, output};
}

export function createMergeJourney() {
  const scenes = [], values = [...INPUT];
  const add = (action, heading, caption, narration, data = {}) => scenes.push({
    mode: 'merge-journey', action, heading, caption, narration, values: [...values], ...data,
  });
  add('intro', 'Which number comes first?', 'Merge sort, one small decision at a time.',
    'Which number belongs first? One. But how could a program find every next number without searching the whole row again?', {groupSize: 8});
  add('split', 'Make the problem smaller.', 'Two halves. The same values.',
    'Start with two smaller problems. Split the row in half. Nothing has changed order yet.', {fromSize: 8, groupSize: 4});
  add('split', 'Make the problem smaller.', 'Then split each half.',
    'Split each half again. Now we only need to put a pair of numbers in order.', {fromSize: 4, groupSize: 2});
  add('split', 'One number is already sorted.', 'This is where the splitting stops.',
    'Split once more. A number on its own is already sorted. Now we can build back up.', {fromSize: 2, groupSize: 1});
  const wording = {
    2: [
      'Let the smaller number lead.', 'Compare the neighbours, then build each pair.',
      'Three beats seven. Two beats eight. On each side, copy the smaller number first. Then let the other follow.',
      'Bring the ordered pairs back.', 'Each pair returns to its place.',
      'Put each finished pair back where it belongs. We have four little rows that are already in order.',
    ],
    4: [
      'Watch the front of each group.', 'Blue = left input · Mint = right input',
      'Here, two beats three, while one beats four. Then compare the next fronts. Only the side we took from moves forward.',
      'Two halves, ready to join.', 'Sorted within each half—not across the whole row yet.',
      'Each half is ready. The numbers inside it are ordered, but the whole row still needs joining.',
    ],
    8: [
      'Why are the fronts enough?', 'Nothing behind either front can be smaller.',
      'Now watch: one, then two, then three. We only look at the fronts, because nothing behind them can be smaller. When one side runs out, the rest follows.',
      'Bring the finished row home.', 'The ordered result returns to the original row.',
      'Now put the finished row back. Every number has found its place, from one through eight.',
    ],
  };
  for (const groupSize of [2, 4, 8]) {
    const groups = [];
    for (let start = 0; start < values.length; start += groupSize) {
      const mid = start + groupSize / 2;
      groups.push(mergeTrace(values.slice(start, mid), values.slice(mid, start + groupSize), start));
    }
    const [heading, caption, narration, returnHeading, returnCaption, returnNarration] = wording[groupSize];
    add('merge', heading, caption, narration, {groupSize, groups});
    add('return', returnHeading, returnCaption, returnNarration, {groupSize, groups});
    values.splice(0, values.length, ...groups.flatMap(group => group.output));
  }
  add('finish', 'Small pieces. One ordered row.', 'Split it down. Build it back in order.',
    'That is merge sort. Make small sorted pieces, then let their fronts guide you to a bigger sorted row.', {groupSize: 8});
  return {title: 'Merge sort · small pieces, one ordered row', width: 1440, height: 1440, fps: 60, scenes};
}

// Decision hold, curved travel, then readable landing. No carried frame state.
export function mergeBeat(progress, count, beats) {
  if (beats?.length) {
    const index = Math.min(count-1, Math.max(0, beats.findIndex(beat => progress < beat.end)));
    if (progress >= beats.at(-1).end) return {index:count-1, phase:1};
    const beat = beats[index];
    const map = (a,b,lo,hi) => lo+(hi-lo)*Math.max(0,Math.min(1,(progress-a)/(b-a)));
    return {index, phase:progress < beat.move ? map(beat.start,beat.move,0,.3) : progress < beat.land ? map(beat.move,beat.land,.3,.79) : map(beat.land,beat.end,.79,1)};
  }
  const clock = Math.max(0, Math.min(count, (progress - .06) / .88 * count));
  const index = Math.min(count - 1, Math.floor(clock));
  return {index, phase: clock === count ? 1 : clock - index};
}

export function soundBeats(scene) {
  if (scene.action === 'merge' && scene.beats) return scene.beats.flatMap((beat,i) => [
    ...(scene.groups.some(group=>group.steps[i].action==='compare')?[{at:beat.start+.02, sound:'compare'}]:[]),
    {at:beat.land, sound:'land'},
  ]);
  if (scene.action === 'merge') return Array.from({length: scene.groupSize}, (_,i) => [
    ...(scene.groups.some(group => group.steps[i].action === 'compare') ? [{at: .06 + .88 * (i + .08) / scene.groupSize, sound: 'compare'}] : []),
    {at: .06 + .88 * (i + .79) / scene.groupSize, sound: 'land'},
  ]).flat();
  if (scene.action === 'return') return [{at: .8, sound: 'merge'}];
  return [];
}
