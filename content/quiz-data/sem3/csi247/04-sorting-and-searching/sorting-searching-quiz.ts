export const quizData = [
  {
    "group": "Linear search",
    "question": "How many comparisons does linear search need for 18 in 63 29 85 72 18 42 23 54 8 32?",
    "options": [
      "5",
      "4",
      "10",
      "1"
    ],
    "correctIndex": 0,
    "explanation": "18 is the fifth element: four elements are rejected and the fifth matches.",
    "optionFeedback": [
      "Correct.",
      "The matching element is also compared.",
      "10 is the count for a missing key.",
      "The key is not at index 0."
    ]
  },
  {
    "group": "Linear search",
    "question": "What does linear search return for 31 in 63 29 85 72 18 42 23 54 8 32, and how many comparisons does it make?",
    "options": [
      "-1 after 10 comparisons",
      "-1 after 9 comparisons",
      "10 after 10 comparisons",
      "0 after 1 comparison"
    ],
    "correctIndex": 0,
    "explanation": "The key is not in the array, so every element is compared.",
    "optionFeedback": [
      "Correct.",
      "All 10 elements are compared.",
      "The result for a missing key is -1.",
      "The array is not empty."
    ]
  },
  {
    "group": "Linear search",
    "question": "On the ordered array 8 18 23 29 34 42 54 63 72 85, linear search for 31 stops when it sees an element larger than the key. How many comparisons?",
    "options": [
      "5",
      "4",
      "10",
      "6"
    ],
    "correctIndex": 0,
    "explanation": "It compares 8, 18, 23, 29 and then 34, which is larger than 31.",
    "optionFeedback": [
      "Correct.",
      "34 is also compared.",
      "The early stop saves comparisons.",
      "The search stops at 34."
    ]
  },
  {
    "group": "Linear search",
    "question": "What are the best and worst cases of linear search?",
    "options": [
      "O(1) when the key is at index 0, O(n) when it is at the end or absent",
      "O(log n) and O(n)",
      "O(1) and O(1)",
      "O(n) and O(n squared)"
    ],
    "correctIndex": 0,
    "explanation": "The best case compares once; the worst case compares every element.",
    "optionFeedback": [
      "Correct.",
      "O(log n) belongs to binary search.",
      "The worst case grows with n.",
      "Linear search does not nest loops."
    ]
  },
  {
    "group": "Linear search",
    "question": "Which loop version does the recursive linearSearchRec(arr, key, i) replace?",
    "options": [
      "The for loop with i as the loop variable",
      "A while loop with no counter",
      "The binary search loop",
      "The sorting loop"
    ],
    "correctIndex": 0,
    "explanation": "The index becomes a parameter, the loop end becomes a base case that returns -1, and i++ becomes the call with i + 1.",
    "optionFeedback": [
      "Correct.",
      "The method has a counter i.",
      "It is a linear search.",
      "It does not sort."
    ]
  },
  {
    "group": "Binary search",
    "question": "What must be true of an array for binary search to work?",
    "options": [
      "It must be sorted",
      "It must contain no duplicates",
      "It must have an even length",
      "It must contain integers"
    ],
    "correctIndex": 0,
    "explanation": "Binary search discards half the array on the assumption of order.",
    "optionFeedback": [
      "Correct.",
      "Duplicates are allowed.",
      "Odd lengths work too.",
      "Any comparable type works."
    ]
  },
  {
    "group": "Binary search",
    "question": "With the lecture's method, which index is the first mid for the 10 elements 8 18 23 29 34 42 54 63 72 85?",
    "options": [
      "4, the value 34",
      "5, the value 42",
      "9, the value 85",
      "0, the value 8"
    ],
    "correctIndex": 0,
    "explanation": "mid = 0 + (9 - 0) / 2 = 4 with integer division. The lecture's picture starts at 42, but the method starts at 34.",
    "optionFeedback": [
      "Correct.",
      "That is the upper middle cell, used in the lecture's picture.",
      "mid is not high.",
      "mid is not low."
    ]
  },
  {
    "group": "Binary search",
    "question": "How many passes of the loop does binary search need for 18 in 8 18 23 29 34 42 54 63 72 85?",
    "options": [
      "2",
      "1",
      "3",
      "4"
    ],
    "correctIndex": 0,
    "explanation": "The first mid is index 4 (34, too large), the second is index 1 (18, found).",
    "optionFeedback": [
      "Correct.",
      "The first mid is 34, not 18.",
      "The key is found at the second mid.",
      "Four passes are needed for 31 or 85."
    ]
  },
  {
    "group": "Binary search",
    "question": "What does binary search return for 31 in 8 18 23 29 34 42 54 63 72 85, and after how many passes?",
    "options": [
      "-1 after 4 passes",
      "-1 after 1 pass",
      "4 after 4 passes",
      "-1 after 10 passes"
    ],
    "correctIndex": 0,
    "explanation": "The search space shrinks 0-9, 0-3, 2-3, 3-3, then low passes high.",
    "optionFeedback": [
      "Correct.",
      "One pass cannot exhaust ten cells.",
      "A missing key returns -1.",
      "It never makes 10 passes on 10 elements."
    ]
  },
  {
    "group": "Binary search",
    "question": "What happens when binary search is used on the unsorted array 63 29 85 72 18 42 23 54 8 32 to find 29?",
    "options": [
      "It returns -1 although 29 is present",
      "It returns 1",
      "It throws an exception",
      "It sorts the array first"
    ],
    "correctIndex": 0,
    "explanation": "The method discards half of the array on the false assumption of order.",
    "optionFeedback": [
      "Correct.",
      "29 is at index 1, but the method does not reach it.",
      "No exception is thrown.",
      "Binary search never sorts."
    ]
  },
  {
    "group": "Binary search",
    "question": "What are the best, average and worst cases of binary search?",
    "options": [
      "O(1), O(log n), O(log n)",
      "O(1), O(n), O(n)",
      "O(log n), O(log n), O(n)",
      "O(n), O(n), O(n)"
    ],
    "correctIndex": 0,
    "explanation": "The best case is the middle element; the others halve the space each step.",
    "optionFeedback": [
      "Correct.",
      "That is linear search.",
      "The worst case is O(log n).",
      "That ignores the halving."
    ]
  },
  {
    "group": "Binary search",
    "question": "About how many passes does binary search need for a missing key in a sorted array of one million elements?",
    "options": [
      "20",
      "1000",
      "500000",
      "1000000"
    ],
    "correctIndex": 0,
    "explanation": "log2 of a million is about 20; the search space is halved each time.",
    "optionFeedback": [
      "Correct.",
      "That is far more than log n.",
      "That is half the elements.",
      "That is linear search."
    ]
  },
  {
    "group": "Binary search",
    "question": "What is the effect of while (low < high) instead of while (low <= high)?",
    "options": [
      "A key in the last remaining cell is never compared and -1 is returned",
      "The search never ends",
      "ArrayIndexOutOfBoundsException",
      "Nothing: they are equivalent"
    ],
    "correctIndex": 0,
    "explanation": "When low equals high the search space is one cell, and the loop stops before checking it.",
    "optionFeedback": [
      "Correct.",
      "The loop ends sooner, not later.",
      "No index goes out of range.",
      "They differ for the last cell."
    ]
  },
  {
    "group": "Binary search",
    "question": "What is the effect of starting with high = arr.length instead of arr.length - 1?",
    "options": [
      "ArrayIndexOutOfBoundsException for a key larger than every element",
      "The search ignores the last element",
      "The search never ends",
      "Nothing: it is only a different style"
    ],
    "correctIndex": 0,
    "explanation": "mid can reach arr.length, which is one past the last valid index.",
    "optionFeedback": [
      "Correct.",
      "The last element is included.",
      "The loop still ends.",
      "It is an index error."
    ]
  },
  {
    "group": "Binary search",
    "question": "What is the effect of low = mid instead of low = mid + 1?",
    "options": [
      "The search space may stop shrinking and the loop may never end",
      "The search is faster",
      "The array is sorted",
      "The key is found one cell earlier"
    ],
    "correctIndex": 0,
    "explanation": "The cell at mid has been rejected, so low must move past it.",
    "optionFeedback": [
      "Correct.",
      "It can be slower, and it can loop forever.",
      "Searching does not sort.",
      "The cell was already rejected."
    ]
  },
  {
    "group": "Lab 4",
    "question": "The second array of Lab 4 holds the first 50 positive even integers. At which index is 36?",
    "options": [
      "17",
      "18",
      "35",
      "16"
    ],
    "correctIndex": 0,
    "explanation": "The value at index i is 2 * (i + 1), so 36 is at index 17.",
    "optionFeedback": [
      "Correct.",
      "Index 18 holds 38.",
      "That is half of 36 plus 17.",
      "Index 16 holds 34."
    ]
  },
  {
    "group": "Lab 4",
    "question": "Why is a number typed by the user, such as 23.5, unlikely to be found by linearSearch on 50 random decimals?",
    "options": [
      "The comparison arr[i] == key needs an exact match and the random values are almost never exactly 23.5",
      "Linear search cannot search decimals",
      "The array is not sorted",
      "Math.random never returns 23.5"
    ],
    "correctIndex": 0,
    "explanation": "For testing, search for a value taken from the array.",
    "optionFeedback": [
      "Correct.",
      "It can search any numeric type.",
      "Linear search does not need sorting.",
      "It could, but with practically zero probability."
    ]
  },
  {
    "group": "Simple sorts",
    "question": "What is the array 63 29 72 85 18 after pass 1 of bubble sort?",
    "options": [
      "29 63 72 18 85",
      "18 29 63 72 85",
      "29 63 72 85 18",
      "63 29 72 18 85"
    ],
    "correctIndex": 0,
    "explanation": "63 and 29 swap, 72 and 85 stay, and 85 and 18 swap: the largest value reaches the end.",
    "optionFeedback": [
      "Correct.",
      "That is the final result after four passes.",
      "That is after only one swap.",
      "63 and 29 are swapped."
    ]
  },
  {
    "group": "Simple sorts",
    "question": "How many comparisons does the lecture's bubble sort make for 5 items, even for an array that is already sorted?",
    "options": [
      "20",
      "10",
      "5",
      "4"
    ],
    "correctIndex": 0,
    "explanation": "It makes n passes of n - 1 comparisons: 5 x 4.",
    "optionFeedback": [
      "Correct.",
      "10 is n(n - 1)/2.",
      "That is n.",
      "That is one pass."
    ]
  },
  {
    "group": "Simple sorts",
    "question": "What does javac report for the slide's insertion sort line arr[j] = arr[j-1] ) ?",
    "options": [
      "error: ';' expected",
      "error: cannot find symbol",
      "error: missing return statement",
      "Nothing: it compiles"
    ],
    "correctIndex": 0,
    "explanation": "The closing bracket should be a semicolon.",
    "optionFeedback": [
      "Correct.",
      "All symbols exist.",
      "The method is void.",
      "The line is a syntax error."
    ]
  },
  {
    "group": "Simple sorts",
    "question": "How many items does insertion sort move for 5 4 3 2 1?",
    "options": [
      "10",
      "4",
      "5",
      "15"
    ],
    "correctIndex": 0,
    "explanation": "1 + 2 + 3 + 4 = 10: each item passes every larger item before it.",
    "optionFeedback": [
      "Correct.",
      "That is the number of passes.",
      "That is n.",
      "The first item is not moved."
    ]
  },
  {
    "group": "Simple sorts",
    "question": "When is insertion sort a good choice?",
    "options": [
      "When the list has few items or is nearly sorted",
      "When the list is very large",
      "When the list is in reverse order",
      "When the list has no duplicates"
    ],
    "correctIndex": 0,
    "explanation": "Few items mean few overheads; a nearly sorted list needs fewer moves.",
    "optionFeedback": [
      "Correct.",
      "A very large list calls for merge sort.",
      "Reverse order is its worst case.",
      "Duplicates do not matter."
    ]
  },
  {
    "group": "Simple sorts",
    "question": "What is the array 63 29 72 85 18 after pass 1 of selection sort (i = 0)?",
    "options": [
      "18 29 72 85 63",
      "29 63 72 85 18",
      "18 63 72 85 29",
      "29 63 72 18 85"
    ],
    "correctIndex": 0,
    "explanation": "The smallest value, 18 at index 4, is swapped with the value at index 0.",
    "optionFeedback": [
      "Correct.",
      "That is not a selection step.",
      "The 29 stays in place.",
      "That is the bubble sort result."
    ]
  },
  {
    "group": "Simple sorts",
    "question": "How many comparisons does selection sort make for 5 items?",
    "options": [
      "10",
      "20",
      "4",
      "5"
    ],
    "correctIndex": 0,
    "explanation": "4 + 3 + 2 + 1 = 10, whatever the order of the data.",
    "optionFeedback": [
      "Correct.",
      "20 is bubble sort's count.",
      "That is the number of swaps at most.",
      "That is n."
    ]
  },
  {
    "group": "Simple sorts",
    "question": "Which two of bubble, insertion and selection sort have the same time complexity?",
    "options": [
      "All three are O(n squared)",
      "Only bubble and selection",
      "None: they are all different",
      "Only insertion and selection"
    ],
    "correctIndex": 0,
    "explanation": "The lecture's summary gives O(n squared) for all three.",
    "optionFeedback": [
      "Correct.",
      "Insertion sort is also O(n squared).",
      "They are the same.",
      "Bubble sort is also O(n squared)."
    ]
  },
  {
    "group": "Simple sorts",
    "question": "After two passes an array 40 10 30 20 50 is 10 20 30 40 50 and after one pass it was 10 30 20 40 50. Which algorithm is it?",
    "options": [
      "Bubble sort",
      "Insertion sort",
      "Selection sort",
      "Merge sort"
    ],
    "correctIndex": 0,
    "explanation": "The largest value is at the end and several neighbours changed in pass 1.",
    "optionFeedback": [
      "Correct.",
      "Insertion sort leaves the unsorted part untouched.",
      "Selection sort swaps the smallest to the front.",
      "Merge sort does not sort by passes."
    ]
  },
  {
    "group": "Merge sort",
    "question": "What is divide and conquer?",
    "options": [
      "Breaking a problem into smaller sub-problems, solving each one and combining the solutions",
      "Sorting from both ends of the list",
      "Comparing every pair of items",
      "Searching the middle element first"
    ],
    "correctIndex": 0,
    "explanation": "Merge sort and quick sort use it.",
    "optionFeedback": [
      "Correct.",
      "That is not the strategy.",
      "That is a quadratic approach.",
      "That describes binary search."
    ]
  },
  {
    "group": "Merge sort",
    "question": "How many merges does merge sort make for 8 items?",
    "options": [
      "7",
      "8",
      "3",
      "16"
    ],
    "correctIndex": 0,
    "explanation": "n - 1 merges for n items: 4 + 2 + 1.",
    "optionFeedback": [
      "Correct.",
      "That is n.",
      "That is the number of levels.",
      "That is 2n."
    ]
  },
  {
    "group": "Merge sort",
    "question": "For merge(arr, 0, 2, 4), how many items does the left array hold and how many the right?",
    "options": [
      "3 and 2",
      "2 and 3",
      "3 and 3",
      "5 and 0"
    ],
    "correctIndex": 0,
    "explanation": "size1 = m - s + 1 = 3 and size2 = e - m = 2.",
    "optionFeedback": [
      "Correct.",
      "The left half includes mid.",
      "The two halves share 5 items.",
      "Both halves are used."
    ]
  },
  {
    "group": "Merge sort",
    "question": "merge(arr, 0, 2, 4) on 10 40 90 20 60 gives which array?",
    "options": [
      "10 20 40 60 90",
      "10 40 90 20 60",
      "20 60 10 40 90",
      "90 60 40 20 10"
    ],
    "correctIndex": 0,
    "explanation": "The sorted halves 10 40 90 and 20 60 are merged taking the smaller front item each time.",
    "optionFeedback": [
      "Correct.",
      "That is the input.",
      "That puts one half after the other.",
      "That is descending order."
    ]
  },
  {
    "group": "Merge sort",
    "question": "With mid = (start + end) / 2, how is a range of five items divided?",
    "options": [
      "Into 3 and 2 items",
      "Into 2 and 3 items",
      "Into 4 and 1 items",
      "Into 2 and 2 items with one left over"
    ],
    "correctIndex": 0,
    "explanation": "The left half is start to mid, which has the extra item.",
    "optionFeedback": [
      "Correct.",
      "The left half is the bigger one.",
      "mid is the centre.",
      "No item is left over."
    ]
  },
  {
    "group": "Merge sort",
    "question": "What is the time complexity of merge sort, and what does it cost?",
    "options": [
      "O(n log n), with extra memory for the arrays that merge creates",
      "O(n squared), with no extra memory",
      "O(log n), with no extra memory",
      "O(n), with extra memory"
    ],
    "correctIndex": 0,
    "explanation": "About log n levels, each handling all n items once.",
    "optionFeedback": [
      "Correct.",
      "That is the cost of the simple sorts.",
      "That is the cost of binary search.",
      "It has to compare many items."
    ]
  },
  {
    "group": "Merge sort",
    "question": "Which sort suits a very large list, and which a nearly sorted list?",
    "options": [
      "Merge sort for the large list, insertion sort for the nearly sorted one",
      "Bubble sort for the large list, merge sort for the nearly sorted one",
      "Selection sort for both",
      "Insertion sort for both"
    ],
    "correctIndex": 0,
    "explanation": "Merge sort is O(n log n); insertion sort needs few moves on nearly sorted data.",
    "optionFeedback": [
      "Correct.",
      "Bubble sort is the slowest.",
      "Selection sort is O(n squared) always.",
      "Insertion sort is slow on large unordered lists."
    ]
  }
];
