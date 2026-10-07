// Begin with the same values that continue into the illustrated walkthrough.
export const ALGORITHM_INTRODUCTIONS = {
  linear: {
    goal: 'Learn to find a value by checking one position at a time.',
    idea: 'Linear search checks values from left to right. Stop when you find the value you want; if you reach the end without a match, it is not there. The row does not need to be sorted.',
    example: 'Find 18 in <code>[63, 29, 85, 72, 18, 42, 23, 54, 8, 32]</code>.',
    steps: [
      'Check 63 at index 0. It is not 18, so move to the next position. An <strong>index</strong> is a position number; arrays begin at 0.',
      'Check 29, then 85, then 72. None matches, so keep moving right.',
      'Check 18 at index 4. Return that position and stop. The values after it do not need checking.',
    ],
    explanation: 'A failed check rules out only that position. We cannot skip an unchecked value because an unordered row gives us no clue where 18 might be. If every position fails, the code returns <code>-1</code> to mean “not found”.',
    bridge: 'In the next illustration, follow the highlighted position from left to right. The values stay where they are; only the position being checked changes.',
  },
  binary: {
    goal: 'Learn how an ordered row lets you rule out half the remaining search positions.',
    idea: 'Binary search checks the middle of a sorted row, then keeps only the side where the wanted value could still be. The values must already be in ascending order for this rule to work.',
    example: 'Find 7 in <code>[-5, -2, 0, 1, 2, 4, 5, 6, 7, 10]</code>.',
    steps: [
      'Start with indexes 0 through 9. Check index 4, the lower of the two middle positions. Its value is 2.',
      'Because 7 is greater than 2, rule out 2 and everything to its left. The remaining positions are indexes 5 through 9.',
      'Check the middle of that range: 6 at index 7. Again, 7 is greater, so keep only indexes 8 and 9.',
      'Check 7 at index 8. It matches: return index 8 and stop.',
    ],
    explanation: 'Sorting makes each decision safe. Everything to the left of 2 is at most 2, so none can be 7. A middle value greater than the target would instead rule out that value and everything to its right.',
    bridge: 'In the next illustration, “low” and “high” mark the first and last positions still possible. “Mid” marks the position being checked. Crossed-out positions have been ruled out; the stored values do not move.',
  },
  bubble: {
    goal: 'Learn how repeated neighbour swaps put a row of values in order.',
    idea: 'Bubble sort walks along a row and checks neighbouring values. If the larger neighbour comes first, swap them: each takes the other’s position. One full walk is called a pass.',
    example: 'Make the first pass through <code>[4, 2, 5, 1, 3]</code>.',
    steps: [
      'Compare 4 and 2. Swap them because 4 is larger: <code>[2, 4, 5, 1, 3]</code>.',
      'Compare 4 and 5. They are already in order, so leave them where they are.',
      'Compare 5 and 1. Swap them: <code>[2, 4, 1, 5, 3]</code>.',
      'Compare 5 and 3. Swap them: <code>[2, 4, 1, 3, 5]</code>. This pass is complete; 5 is in its final position.',
    ],
    explanation: 'Each neighbour check keeps the larger value on the right. As the pass continues, the largest value reaches the end. Repeat on the unfinished part; stop early if a whole pass makes no swaps.',
    bridge: 'In the next illustration, read each neighbour comparison in order, then look at the row after the pass. The completed positions on the right can be left alone.',
  },
  selection: {
    goal: 'Learn how finding the smallest remaining value fixes one position at a time.',
    idea: 'Selection sort fills the row from left to right. Scan the unfinished part to find its smallest value, then swap that value into the position you are filling. A swap exchanges two values’ positions.',
    example: 'Fill the first position in <code>[29, 72, 98, 13, 87, 66, 52, 51, 36]</code>.',
    steps: [
      'Begin with 29 as the smallest value seen so far. Check 72 and 98; neither is smaller.',
      'Find 13. Remember its position as the new smallest, but do not move it yet.',
      'Check the rest: 87, 66, 52, 51 and 36. None is smaller than 13.',
      'Swap 13 with the first value, 29: <code>[13, 72, 98, 29, 87, 66, 52, 51, 36]</code>. The first position is finished.',
    ],
    explanation: 'Waiting until the scan ends confirms that no smaller value remains. On the next pass, leave 13 alone and search the rest. If the smallest value is already in the position being filled, leave it there; no swap is needed.',
    bridge: 'In the next illustration, follow the smallest value found during each scan, then the exchange into the next open position. The finished section grows from the left.',
  },
  insertion: {
    goal: 'Learn how holding one value and shifting others makes room in an ordered section.',
    idea: 'Insertion sort grows an ordered section on the left. Save the next value separately, move larger values one position right, then place the saved value in the space they leave.',
    example: 'Start with <code>[85, 12, 59, 45, 72, 51]</code>. The first value, 85, is already an ordered section on its own.',
    steps: [
      'Save 12 separately. The code calls this held value the <strong>key</strong>. It stays safe while we make room.',
      'Compare 85 with 12. Because 85 is larger, copy 85 one position right. This movement is a <strong>shift</strong>, not an exchange with 12.',
      'We have reached the start of the row. Write the held 12 into the first position: <code>[12, 85, 59, 45, 72, 51]</code>.',
      'The first two values are ordered. Next, hold 59 and make room for it among 12 and 85.',
    ],
    explanation: 'The left section is already sorted, so moving backward past its larger values finds the right place for the key. Stop after a value that is no larger than the key, or at the start of the row. A shift copies one value right; a swap would exchange two values.',
    bridge: 'In the next illustration, track the held key separately from the values shifting right. The drawn gap shows where the key can go; the actual array can briefly contain a duplicate after a shift.',
  },
  merge: {
    goal: 'Learn how small sorted groups combine to put a whole row in order.',
    idea: 'Merge sort first divides the problem until each group has one value. It then joins sorted groups by copying their smaller front value into a new output row. Joining two groups this way is called a merge.',
    example: 'Follow <code>[63, 29, 72, 85, 18, 49, 3, 54]</code> from small groups to one sorted row.',
    steps: [
      'Split into <code>[63, 29, 72, 85]</code> and <code>[18, 49, 3, 54]</code>. Split those into pairs, then single values. Splitting changes which positions we work on; it does not rearrange the values.',
      'A single value is already sorted. To join 63 and 29, compare them and copy 29 first. With its side empty, copy the leftover 63. The result is <code>[29, 63]</code>.',
      'Copy that result back into its original positions and return to the larger problem that requested it. Finish the other pair, <code>[72, 85]</code>, before joining the two pairs.',
      'Compare the fronts, 29 and 72: copy 29. Then compare 63 and 72: copy 63. The left group is empty, so copy the remaining 72 and 85 in order. Return <code>[29, 63, 72, 85]</code>.',
      'Finish the right half in the same way. Its pairs are <code>[18, 49]</code> and <code>[3, 54]</code>; joining them returns <code>[3, 18, 49, 54]</code>.',
      'Both halves are ready. Compare their front unread values, 29 and 3, and copy 3. Compare 29 with 18 and copy 18. Keep taking the smaller front; advance only the group it came from.',
      'When one group is empty, copy what remains of the other. Copy the completed output back into the whole original range: <code>[3, 18, 29, 49, 54, 63, 72, 85]</code>.',
    ],
    explanation: 'Why are the fronts enough? Each input group is sorted, so nothing behind its front can be smaller. The smaller of the two fronts is therefore the next value in the combined order. Copying writes a value into another position; it does not exchange two values as a swap does.',
    bridge: 'In the next illustration, follow the tree downward for splits, then upward for completed results. Each larger merge waits for both smaller groups to finish. A returned result becomes one sorted input for the merge above it.',
  },
};

export function algorithmIntroduction(kind) {
  const intro = ALGORITHM_INTRODUCTIONS[kind];
  if (!intro) throw new Error(`No beginner introduction for ${kind}`);
  return {
    id: 'plain-language', title: 'Start with the idea',
    body: `<p class="lede">${intro.idea}</p><h3>A small example</h3><p>${intro.example}</p><p>${intro.steps[kind === 'merge' ? 1 : 0]}</p><p>${intro.bridge}</p>`,
  };
}

export function algorithmReason(kind) {
  return { id: 'why-it-works', title: 'Why this works', body: `<p>${ALGORITHM_INTRODUCTIONS[kind].explanation}</p>` };
}
