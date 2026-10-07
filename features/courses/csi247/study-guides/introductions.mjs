// A short, diagram-free entry point before the complete visual trace.
// Keep formal vocabulary and the full reference examples later in the lesson.
export const ALGORITHM_INTRODUCTIONS = {
  linear: {
    goal: 'Learn to find a value by checking one position at a time.',
    idea: 'Linear search means looking through a row of values one by one until you find the value you want, or reach the end.',
    explanation: 'Think of checking a row of drawers for your keys. Start with the first drawer, then try the next. The drawers do not need to be in any special order, and you stop as soon as you find the keys.',
    example: 'Look for 18 in <code>[63, 29, 18]</code>. Check 63: no. Check 29: no. Check 18: found. It is the third value, at <strong>index 2</strong>, because array positions are counted from 0. If every check fails, this lesson returns <code>-1</code> to mean “not found”.',
    bridge: 'The diagram below repeats this idea with ten values. Only the position being checked changes; searching does not rearrange the values.',
  },
  binary: {
    goal: 'Learn how an ordered row lets you rule out half the remaining search positions.',
    idea: 'Binary search means checking the middle of an ordered row, then continuing in only the half where the value could still be.',
    explanation: 'Think of a number-guessing game where the answer is “higher” or “lower”. A middle guess lets you rule out many possibilities at once. This only works for an array if its values are already in order.',
    example: 'Look for 8 in <code>[2, 4, 6, 8, 10]</code>. The middle value is 6. Because 8 is larger, ignore 6 and everything to its left. In the remaining <code>[8, 10]</code>, check 8 and find it. Its original position is <strong>index 3</strong>, counting from 0.',
    bridge: 'The diagram below searches for 7 in a larger ordered row. “Low” and “high” mark the first and last positions still possible; “mid” is the middle position we check. The values themselves stay still.',
  },
  bubble: {
    goal: 'Learn how repeated neighbour swaps put a row of values in order.',
    idea: 'Bubble sort puts values in order by checking two neighbours at a time and exchanging them when the larger one comes first.',
    explanation: 'Think of numbered cards in a row. Walk from left to right. When two neighbours are the wrong way round, swap them: each takes the other’s place. Repeat the walk until the whole row is ordered from smallest to largest.',
    example: 'Start with <code>[4, 2, 1]</code>. Swap 4 and 2 to get <code>[2, 4, 1]</code>, then swap 4 and 1 to get <code>[2, 1, 4]</code>. That completes one <strong>pass</strong>, or walk along the row. The 4 is now in its final position, but 2 and 1 still need another pass.',
    bridge: 'The diagram below follows a larger example. Watch the largest value still being worked on travel to the right through neighbour swaps.',
  },
  selection: {
    goal: 'Learn how finding the smallest remaining value fixes one position at a time.',
    idea: 'Selection sort puts values in order by finding the smallest value still waiting and placing it in the next position on the left.',
    explanation: 'Think of choosing the smallest numbered card from a mixed row. Look through all the remaining cards before moving anything. Then swap that card with the card in the position you are filling. Leave completed positions alone.',
    example: 'Start with <code>[4, 2, 1]</code>. Look at all three values: 1 is smallest. Swap 1 and 4 to get <code>[1, 2, 4]</code>. Next, check the remaining <code>[2, 4]</code>. The 2 is already in the next position, so no swap is needed.',
    bridge: 'The diagram below repeats this with more values. Each pass fills one position, even when its scan discovers that no swap is necessary.',
  },
  insertion: {
    goal: 'Learn how holding one value and shifting others makes room in an ordered section.',
    idea: 'Insertion sort puts values in order by taking the next value and making room for it among the values already ordered on the left.',
    explanation: 'Think of arranging playing cards in your hand. Hold the new card separately. Move any larger cards one place right, then put the held card into the gap. These one-way movements are called shifts, not swaps.',
    example: 'Start with <code>[4, 2, 1]</code>. Hold 2, shift 4 right, then insert 2 before it: <code>[2, 4, 1]</code>. Now hold 1, shift 4 and then 2 right, and insert 1 at the start: <code>[1, 2, 4]</code>. The held value is called the <strong>key</strong>.',
    bridge: 'The diagram below uses six cards. Follow the held key separately from the cards shifting right; then find the gap where the key is inserted.',
  },
  merge: {
    goal: 'Learn how small sorted groups combine to put a whole row in order.',
    idea: 'Merge sort puts values in order by solving smaller parts first, then joining two ordered parts by repeatedly taking the smaller front value.',
    explanation: 'Imagine two small piles of numbered cards, each already ordered from smallest to largest. Compare their front cards and copy the smaller one into a new row. Repeat until one pile runs out, then copy what is left of the other. That joining step is called a merge.',
    example: 'To sort <code>[4, 2, 1, 3]</code>, split into smaller parts until each has one value. The left pair becomes <code>[2, 4]</code>; the right pair becomes <code>[1, 3]</code>. Merge those ordered pairs by taking 1, then 2, then 3, then the leftover 4: <code>[1, 2, 3, 4]</code>.',
    bridge: 'The diagram below follows eight values. Going down the tree means splitting the problem, not rearranging values. Coming back means finishing both smaller parts, merging their results, and passing the ordered result to the larger problem above.',
  },
};

export function algorithmIntroduction(kind) {
  const intro = ALGORITHM_INTRODUCTIONS[kind];
  if (!intro) throw new Error(`No beginner introduction for ${kind}`);
  return {
    id: 'plain-language', title: 'Start with the idea',
    body: `<p class="lede">${intro.idea}</p><p>${intro.explanation}</p><h3>A small example</h3><p>${intro.example}</p><p>${intro.bridge}</p>`,
  };
}
