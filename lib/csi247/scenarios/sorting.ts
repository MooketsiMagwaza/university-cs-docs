/** Memory-diagram scenarios for searching and sorting arrays (Lectures 8 and 9, Lab 4 and Lab 5 part 1). */
import { memoryBuilder, type MemScenario } from '../memory-diagram';

export const sortingScenarios: Record<string, () => MemScenario> = {
  binsearch() {
    const B = memoryBuilder().code([
      'int[] arr = {8, 18, 23, 29, 34, 42, 54, 63, 72, 85};',
      'int key = 18, low = 0, high = 9;',
      'int mid = low + (high - low) / 2;   // arr[mid] > key, so high = mid - 1',
      'int mid = low + (high - low) / 2;   // arr[mid] == key: found',
    ]);
    B.snap(-1, "Lecture 8's binary search for 18 in the sorted array, using the lecture's method. Keep track of the part of the array that is still being searched: low and high.");
    B.arr(100, 10, { at: { x: 0, y: 0 }, t: 'int[]' }).v('arr', { r: 100 });
    [8, 18, 23, 29, 34, 42, 54, 63, 72, 85].forEach((v, i) => B.set(100, i, v, false));
    B.v('key', 18).v('low', 0).v('high', 9);
    B.snap(1, 'The whole array is the search space: low = 0, high = 9, and the sorted array is what makes binary search possible.');
    B.v('mid', 4).snap(2, 'mid = 0 + (9 - 0) / 2 = 4. arr[4] is 34. 18 == 34? No. 18 < 34? Yes, so ignore the right side: high = mid - 1 = 3.');
    B.sv('high', 3).snap(2, 'high becomes 3. The search space is indexes 0 to 3 (8, 18, 23, 29). Half of the array has been discarded with one comparison.');
    B.sv('mid', 1).snap(3, 'mid = 0 + (3 - 0) / 2 = 1. arr[1] is 18. 18 == 18? Yes: found at index 1, after two passes of the loop. The method returns 1.');
    return B.done('Binary search: finding 18');
  },

  binmiss() {
    const B = memoryBuilder().code([
      'int[] arr = {8, 18, 23, 29, 34, 42, 54, 63, 72, 85};',
      'int key = 31, low = 0, high = 9;',
      'while (low <= high) {',
      '    int mid = low + (high - low) / 2;',
      '    if (arr[mid] < key) low = mid + 1; else if (arr[mid] > key) high = mid - 1;',
    ]);
    B.snap(-1, 'Binary search for a key that is NOT in the array: 31. The loop ends when the search space is empty, low > high.');
    B.arr(100, 10, { at: { x: 0, y: 0 }, t: 'int[]' }).v('arr', { r: 100 });
    [8, 18, 23, 29, 34, 42, 54, 63, 72, 85].forEach((v, i) => B.set(100, i, v, false));
    B.v('key', 31).v('low', 0).v('high', 9);
    B.snap(1, 'low = 0, high = 9: ten cells to search.');
    B.v('mid', 4).sv('high', 3).snap(4, 'mid = 4, arr[4] = 34 > 31, so high = 3. Search space: indexes 0 to 3.');
    B.sv('mid', 1).sv('low', 2).snap(4, 'mid = 1, arr[1] = 18 < 31, so low = 2. Search space: indexes 2 to 3.');
    B.sv('mid', 2).sv('low', 3).snap(4, 'mid = 2, arr[2] = 23 < 31, so low = 3. Search space: index 3 only.');
    B.sv('mid', 3).sv('low', 4).snap(4, 'mid = 3, arr[3] = 29 < 31, so low = 4. Now low (4) > high (3): the search space is empty and the loop ends. Four passes, key not found: the method returns -1.');
    return B.done('Binary search: 31 is not there');
  },

  bubblesort() {
    const B = memoryBuilder().code([
      'int[] arr = {63, 29, 72, 85, 18};',
      'for (int i = 0; i < arr.length; i++)',
      '    for (int j = 0; j < arr.length - 1; j++)',
      '        if (arr[j] > arr[j + 1]) swap arr[j], arr[j + 1]',
    ]);
    B.snap(-1, "Lecture 9's bubble sort on 63 29 72 85 18. Show the array at the end of each pass (the lecture's exercise). Each pass compares the neighbours and swaps those out of order.");
    B.arr(100, 5, { at: { x: 0, y: 0 }, t: 'int[]' }).v('arr', { r: 100 });
    [63, 29, 72, 85, 18].forEach((v, i) => B.set(100, i, v, false));
    B.snap(0, 'The unsorted array: 63, 29, 72, 85, 18.');
    B.set(100, 0, 29).set(100, 1, 63).set(100, 3, 18).set(100, 4, 85);
    B.snap(3, 'End of pass 1: (63,29) swapped, (63,72) left, (72,85) left, (85,18) swapped. The largest value, 85, has bubbled to the end: 29, 63, 72, 18, 85.');
    B.set(100, 2, 18).set(100, 3, 72);
    B.snap(3, 'End of pass 2: only (72,18) is out of order and is swapped: 29, 63, 18, 72, 85. Now the two largest values are in place.');
    B.set(100, 1, 18).set(100, 2, 63);
    B.snap(3, 'End of pass 3: (63,18) is swapped: 29, 18, 63, 72, 85.');
    B.set(100, 0, 18).set(100, 1, 29);
    B.snap(3, 'End of pass 4: (29,18) is swapped: 18, 29, 63, 72, 85. The array is sorted.');
    B.snap(3, 'Pass 5 makes no swap. The lecture\'s version always makes 5 passes of 4 comparisons (20 comparisons), even when the array was sorted earlier.');
    return B.done('Bubble sort, pass by pass');
  },

  selectionsort() {
    const B = memoryBuilder().code([
      'int[] arr = {63, 29, 72, 85, 18};',
      'for (int i = 0; i < arr.length - 1; i++) {',
      '    int minIndex = i;',
      '    for (int j = i + 1; j < arr.length; j++) if (arr[j] < arr[minIndex]) minIndex = j;',
      '    swap arr[minIndex] and arr[i]',
    ]);
    B.snap(-1, "Lecture 9's selection sort on 63 29 72 85 18. Each pass finds the smallest value in the unsorted part and swaps it into position i.");
    B.arr(100, 5, { at: { x: 0, y: 0 }, t: 'int[]' }).v('arr', { r: 100 });
    [63, 29, 72, 85, 18].forEach((v, i) => B.set(100, i, v, false));
    B.v('i', 0).v('minIndex', 0);
    B.snap(0, 'i = 0, minIndex = 0 (the value 63). The inner loop will look at indexes 1 to 4.');
    B.sv('minIndex', 4).set(100, 0, 18).set(100, 4, 63);
    B.snap(4, 'The smallest value in indexes 0 to 4 is 18, at minIndex = 4. Swap arr[4] and arr[0]: 18, 29, 72, 85, 63.');
    B.sv('i', 1).sv('minIndex', 1);
    B.snap(2, 'i = 1: the smallest of indexes 1 to 4 (29, 72, 85, 63) is 29, already at index 1. minIndex = 1, so the swap changes nothing.');
    B.sv('i', 2).sv('minIndex', 4).set(100, 2, 63).set(100, 4, 72);
    B.snap(4, 'i = 2: the smallest of indexes 2 to 4 (72, 85, 63) is 63, at minIndex = 4. Swap arr[4] and arr[2]: 18, 29, 63, 85, 72.');
    B.sv('i', 3).sv('minIndex', 4).set(100, 3, 72).set(100, 4, 85);
    B.snap(4, 'i = 3: the smaller of 85 and 72 is 72, at minIndex = 4. Swap: 18, 29, 63, 72, 85. The array is sorted after n - 1 = 4 passes and at most 4 swaps.');
    return B.done('Selection sort, pass by pass');
  },

  insertionsort() {
    const B = memoryBuilder().code([
      'int[] arr = {29, 63, 72, 85, 18};   // after i = 1, 2, 3 the first four are sorted',
      'int temp = arr[4];   // 18, the item to place; j = 4',
      'while (j > 0 && temp < arr[j - 1]) { arr[j] = arr[j - 1]; j--; }',
      'arr[j] = temp;',
    ]);
    B.snap(-1, "Lecture 9's insertion sort, the last pass (i = 4) on the array 63 29 72 85 18. The first four cells are the sorted part, and 18 is the next item taken from the unsorted part.");
    B.arr(100, 5, { at: { x: 0, y: 0 }, t: 'int[]' }).v('arr', { r: 100 });
    [29, 63, 72, 85, 18].forEach((v, i) => B.set(100, i, v, false));
    B.v('temp', 18).v('j', 4);
    B.snap(1, 'temp holds the item to insert (18) and j = 4, its current position. The value at index 4 will be overwritten, so it has been saved in temp.');
    B.set(100, 4, 85).sv('j', 3);
    B.snap(2, '18 < arr[3] (85): shift 85 right into index 4, and j = 3. (A shift is one assignment, not a swap.)');
    B.set(100, 3, 72).sv('j', 2);
    B.snap(2, '18 < arr[2] (72): shift 72 right into index 3, and j = 2.');
    B.set(100, 2, 63).sv('j', 1);
    B.snap(2, '18 < arr[1] (63): shift 63 right into index 2, and j = 1.');
    B.set(100, 1, 29).sv('j', 0);
    B.snap(2, '18 < arr[0] (29): shift 29 right into index 1, and j = 0. The loop stops because j is 0.');
    B.set(100, 0, 18).snap(3, 'arr[j] = temp: 18 is placed at index 0. The array is sorted: 18, 29, 63, 72, 85. This was the worst case for one item: it moved past every sorted item.');
    return B.done('Insertion sort: placing 18');
  },

  mergearrays() {
    const B = memoryBuilder().code([
      'int[] arr = {20, 36, 13, 54};   // the halves are already sorted',
      'merge(arr, 0, 1, 3);',
      'int[] left = {20, 36};   int[] right = {13, 54};',
      'while (i < size1 && j < size2) { arr[cur++] = (left[i] <= right[j]) ? left[i++] : right[j++]; }',
      '// copy what is left of left, then what is left of right',
    ]);
    B.snap(-1, "Lab 5's merge method, as memory. merge COPIES the two halves into new arrays left and right, then writes the smaller front item back into arr each time.");
    B.arr(100, 4, { at: { x: 0, y: 0 }, t: 'int[]' }).v('arr', { r: 100 });
    [20, 36, 13, 54].forEach((v, i) => B.set(100, i, v, false));
    B.snap(0, 'arr holds two sorted halves: 20, 36 (indexes 0 to 1) and 13, 54 (indexes 2 to 3). merge(arr, s = 0, m = 1, e = 3) is called.');
    B.arr(200, 2, { at: { x: 0, y: 110 }, t: 'int[] left' }).v('left', { r: 200 });
    B.set(200, 0, 20, false).set(200, 1, 36);
    B.arr(300, 2, { at: { x: 0, y: 220 }, t: 'int[] right' }).v('right', { r: 300 });
    B.set(300, 0, 13, false).set(300, 1, 54);
    B.v('i', 0).v('j', 0).v('cur', 0);
    B.snap(2, 'size1 = m - s + 1 = 2 and size2 = e - m = 2, so two new arrays are made and filled with copies of the halves. i, j and cur start at 0 (cur is the index in arr).');
    B.set(100, 0, 13).sv('j', 1).sv('cur', 1);
    B.snap(3, 'left[0] = 20 against right[0] = 13: 20 <= 13 is false, so arr[0] = 13 and j = 1.');
    B.set(100, 1, 20).sv('i', 1).sv('cur', 2);
    B.snap(3, 'left[0] = 20 against right[1] = 54: 20 <= 54, so arr[1] = 20 and i = 1.');
    B.set(100, 2, 36).sv('i', 2).sv('cur', 3);
    B.snap(3, 'left[1] = 36 against right[1] = 54: 36 <= 54, so arr[2] = 36 and i = 2. The left array is used up (i = size1).');
    B.set(100, 3, 54).sv('j', 2).sv('cur', 4);
    B.snap(4, 'The loop ends. The leftover item of right (54) is copied: arr[3] = 54. arr is 13, 20, 36, 54. left and right are no longer needed when merge returns.');
    return B.done('Merge: left and right copied back into arr');
  },
};
