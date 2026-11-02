export const quizData = [
  {
    "group": "Measuring algorithms",
    "question": "What does time complexity describe?",
    "options": [
      "The exact seconds used on one computer",
      "How runtime grows as input size grows",
      "Only the memory used by an algorithm",
      "The number of lines in the source file"
    ],
    "correctIndex": 1,
    "explanation": "Time complexity focuses on growth with input size rather than an exact clock time.",
    "optionFeedback": [
      "Exact seconds depend on the computer, so they are not what time complexity describes.",
      "Correct. It is about growth with the input size N.",
      "Memory is space complexity, a separate measure.",
      "The length of the source file says nothing about runtime."
    ]
  },
  {
    "group": "Measuring algorithms",
    "question": "Why should a theoretical algorithm comparison be independent of hardware?",
    "options": [
      "Hardware never changes runtime",
      "The same algorithm can have different clock times on different machines",
      "Algorithms cannot be implemented",
      "Only memory affects performance"
    ],
    "correctIndex": 1,
    "explanation": "Clock time varies across machines even when the algorithm is unchanged.",
    "optionFeedback": [
      "Hardware does change runtime, which is why the comparison must not depend on it.",
      "Correct. The same algorithm gives different clock times on different machines.",
      "Algorithms can be implemented; the point is that the analysis should not depend on one implementation.",
      "Memory is only one factor; clock speed and architecture also differ."
    ]
  },
  {
    "group": "Measuring algorithms",
    "question": "Which is a limitation of experimental runtime testing?",
    "options": [
      "It never uses real data",
      "It requires no implementation",
      "It tests only a limited set of inputs",
      "It cannot measure time"
    ],
    "correctIndex": 2,
    "explanation": "An experiment may miss inputs on which the algorithm behaves differently.",
    "optionFeedback": [
      "Experiments do use real data; the problem is how much of it.",
      "Experimentation requires the algorithms to be implemented first, which is one of its limits.",
      "Correct. An algorithm may be slower on data that was never tested.",
      "Experiments can measure time, for example with System.currentTimeMillis()."
    ]
  },
  {
    "group": "Measuring algorithms",
    "question": "Which item is a primitive operation?",
    "options": [
      "Designing an entire application",
      "An array-index access",
      "Choosing a programming language",
      "Buying a faster computer"
    ],
    "correctIndex": 1,
    "explanation": "Array indexing is a basic, easily identifiable operation used when counting work.",
    "optionFeedback": [
      "Designing an application is not a basic, language-independent action.",
      "Correct. Array indexing is a primitive operation, like arithmetic and assignment.",
      "Choosing a language is not an operation the algorithm performs.",
      "Hardware is not an operation of the algorithm."
    ]
  },
  {
    "group": "Measuring algorithms",
    "question": "What does the worst case represent?",
    "options": [
      "The shortest runtime for size N",
      "The expected runtime for size N",
      "The maximum runtime for size N",
      "The runtime for N = 1 only"
    ],
    "correctIndex": 2,
    "explanation": "Worst-case analysis asks for the maximum work required by a valid input of size N.",
    "optionFeedback": [
      "The shortest runtime is the best case.",
      "The expected runtime is the average case.",
      "Correct. The worst case is the maximum runtime for size N.",
      "The worst case is for any input of size N, not only N = 1."
    ]
  },
  {
    "group": "Counting steps",
    "question": "How do you combine the costs of sequential statements?",
    "options": [
      "Add them",
      "Multiply them",
      "Use only the first",
      "Always call the result O(N)"
    ],
    "correctIndex": 0,
    "explanation": "Sequential statements execute one after another, so their costs are added.",
    "optionFeedback": [
      "Correct. Statements that run one after another have their times added.",
      "Multiplying is for loops: body time times repetitions.",
      "Every statement in the sequence costs time, not only the first.",
      "The Big-O depends on the statements; a sequence of constants is O(1)."
    ]
  },
  {
    "group": "Counting steps",
    "question": "For worst-case analysis of an if-else statement, which branch is used?",
    "options": [
      "The shorter branch",
      "The longer-running branch",
      "Neither branch",
      "Both branches always execute"
    ],
    "correctIndex": 1,
    "explanation": "Count the condition and the more expensive possible branch.",
    "optionFeedback": [
      "The shorter branch would under-estimate the worst case.",
      "Correct. Count the condition plus the more expensive branch.",
      "One branch is always counted.",
      "Only one branch runs; the larger one gives the worst case."
    ]
  },
  {
    "group": "Counting steps",
    "question": "A loop visits every one of N array elements once. What is its time complexity?",
    "options": [
      "$O(1)$",
      "$O(log N)$",
      "$O(N)$",
      "$O(N^2)$"
    ],
    "correctIndex": 2,
    "explanation": "The loop body executes N times, producing linear growth.",
    "optionFeedback": [
      "O(1) would mean the time does not depend on N.",
      "O(log N) needs the problem to shrink each step.",
      "Correct. The body runs N times.",
      "O(N^2) would need a loop inside a loop."
    ]
  },
  {
    "group": "Counting steps",
    "question": "Two nested loops each execute N times. What is the usual time complexity?",
    "options": [
      "$O(1)$",
      "$O(N)$",
      "$O(N log N)$",
      "$O(N^2)$"
    ],
    "correctIndex": 3,
    "explanation": "The inner statement executes N x N times.",
    "optionFeedback": [
      "O(1) would mean the work does not grow with N.",
      "O(N) is for a single loop.",
      "O(N log N) is for divide-and-conquer sorting, not two plain loops.",
      "Correct. N x N executions of the inner statement."
    ]
  },
  {
    "group": "Big-O and growth",
    "question": "What is the Big-O complexity of $7N - 3$?",
    "options": [
      "$O(1)$",
      "$O(log N)$",
      "$O(N)$",
      "$O(N^2)$"
    ],
    "correctIndex": 2,
    "explanation": "The linear term dominates, and its coefficient is dropped.",
    "optionFeedback": [
      "Constants are dropped, but the N term remains.",
      "There is no logarithm in 7N - 3.",
      "Correct. 7N dominates and its coefficient is dropped.",
      "There is no N squared term."
    ]
  },
  {
    "group": "Big-O and growth",
    "question": "What is the Big-O complexity of $3N^2 + 5N$?",
    "options": [
      "$O(N)$",
      "$O(N log N)$",
      "$O(N^2)$",
      "$O(N^3)$"
    ],
    "correctIndex": 2,
    "explanation": "$N^2$ grows faster than $N$, so the quadratic term dominates.",
    "optionFeedback": [
      "N alone is lower order than N squared.",
      "There is no logarithmic factor.",
      "Correct. The quadratic term dominates.",
      "There is no cubic term."
    ]
  },
  {
    "group": "Big-O and growth",
    "question": "What is the Big-O complexity of $3 log N + 5$?",
    "options": [
      "$O(1)$",
      "$O(log N)$",
      "$O(N)$",
      "$O(N log N)$"
    ],
    "correctIndex": 1,
    "explanation": "Drop the coefficient and constant, leaving logarithmic growth.",
    "optionFeedback": [
      "A constant would be the answer only if the expression had no log term.",
      "Correct. The coefficient 3 and the constant 5 are dropped.",
      "The expression has no N term.",
      "The expression has no N log N term."
    ]
  },
  {
    "group": "Big-O and growth",
    "question": "Which order grows more slowly as N becomes large?",
    "options": [
      "$O(N)$",
      "$O(N log N)$",
      "$O(N^2)$",
      "$O(2^N)$"
    ],
    "correctIndex": 0,
    "explanation": "Among these choices, linear growth is the most scalable.",
    "optionFeedback": [
      "Correct. Among these, linear growth is the most scalable.",
      "N log N grows faster than N.",
      "N squared grows much faster.",
      "Exponential growth is the fastest of the four."
    ]
  },
  {
    "group": "Counting steps",
    "question": "What is the time complexity of computing the sum of N numbers with one loop?",
    "options": [
      "$O(1)$",
      "$O(log N)$",
      "$O(N)$",
      "$O(N^2)$"
    ],
    "correctIndex": 2,
    "explanation": "Each of the N numbers must be processed once.",
    "optionFeedback": [
      "One loop does not give constant time.",
      "There is no halving of the problem.",
      "Correct. Each of the N numbers is processed once.",
      "Only a nested loop would give N squared."
    ]
  },
  {
    "group": "Big-O and growth",
    "question": "Which statement about Big-O is correct?",
    "options": [
      "It gives an exact runtime in milliseconds",
      "It keeps every constant in T(N)",
      "It focuses on the dominant growth term",
      "It depends on the processor model"
    ],
    "correctIndex": 2,
    "explanation": "Big-O classifies growth by retaining the dominant term and ignoring constants and lower-order terms.",
    "optionFeedback": [
      "Big-O does not give exact times.",
      "Constants are dropped in Big-O.",
      "Correct. Big-O keeps the dominant term.",
      "It is deliberately independent of the processor."
    ]
  },
  {
    "group": "Counting steps",
    "question": "A loop body runs 6 times. How many times is the loop condition evaluated?",
    "options": [
      "5",
      "6",
      "7",
      "12"
    ],
    "correctIndex": 2,
    "explanation": "The condition is evaluated before each of the 6 passes and once more, to end the loop: n + 1 = 7.",
    "optionFeedback": [
      "That is one fewer than the body count; the ending check is missed.",
      "The body runs 6 times, but the condition is checked once more.",
      "Correct. n + 1.",
      "The condition is not checked twice per pass."
    ]
  },
  {
    "group": "Counting steps",
    "question": "With every constant set to 1, how many steps does the slide's while loop take for n = 4?",
    "code": "tot = 0;\nc = 1;\nwhile (c <= n) {\n    tot = tot + c;\n    c = c + 1;\n}",
    "options": [
      "12",
      "15",
      "16",
      "20"
    ],
    "correctIndex": 1,
    "explanation": "T(n) = 3n + 3 = 15. The lines run 1, 1, 5, 4 and 4 times: 15.",
    "optionFeedback": [
      "12 is 3n; the constant 3 is missing.",
      "Correct. 1 + 1 + 5 + 4 + 4.",
      "16 counts the condition one time too many.",
      "20 multiplies by too much."
    ]
  },
  {
    "group": "Counting steps",
    "question": "For the slide's nested loop, how many steps are taken for n = 3 with every constant set to 1?",
    "options": [
      "27",
      "36",
      "41",
      "81"
    ],
    "correctIndex": 2,
    "explanation": "T(n) = 3n^2 + 4n + 2 = 27 + 12 + 2 = 41.",
    "optionFeedback": [
      "27 is only the 3n^2 term.",
      "36 leaves out the constant and part of the linear term.",
      "Correct. 1 + 4 + 3 + 12 + 9 + 9 + 3.",
      "81 is n^4; the loops only multiply to n^2."
    ]
  },
  {
    "group": "Counting steps",
    "question": "The slide's loop is changed to c = c + 2. For n = 5 how many times does the body run?",
    "options": [
      "5",
      "3",
      "2",
      "10"
    ],
    "correctIndex": 1,
    "explanation": "c takes the values 1, 3 and 5, which are all at most 5, so the body runs 3 times. The Big-O stays O(n).",
    "optionFeedback": [
      "5 would be the count for a step of 1.",
      "Correct. 1, 3, 5.",
      "That misses the pass with c = 5.",
      "The body cannot run more times than with a step of 1."
    ]
  },
  {
    "group": "Counting steps",
    "question": "for (i = 1; i <= n; i++) contains for (j = 1; j <= 5; j++) x++; What is its Big-O?",
    "options": [
      "O(1)",
      "O(n)",
      "O(n^2)",
      "O(5^n)"
    ],
    "correctIndex": 1,
    "explanation": "The inner loop always runs 5 times, a constant factor, so T(n) = 19n + 2, which is O(n).",
    "optionFeedback": [
      "The outer loop depends on n, so the work grows.",
      "Correct. Only one of the two loops depends on n.",
      "The inner bound is the constant 5, not n.",
      "The loops multiply to 5n, not 5 to the power n."
    ]
  },
  {
    "group": "Counting steps",
    "question": "A loop over n items is followed by a second, separate loop over n items. What is the Big-O?",
    "options": [
      "O(n)",
      "O(n^2)",
      "O(2^n)",
      "O(log n)"
    ],
    "correctIndex": 0,
    "explanation": "Loops one after another are added: n + n = 2n, which is O(n). Only nesting multiplies.",
    "optionFeedback": [
      "Correct. Sequence adds.",
      "That would need the second loop inside the first.",
      "The work is not exponential.",
      "Nothing is halved."
    ]
  },
  {
    "group": "Counting steps",
    "question": "for i = 1 to n contains for j = 1 to i. For n = 10, how many times does the inner body run?",
    "options": [
      "10",
      "55",
      "100",
      "1000"
    ],
    "correctIndex": 1,
    "explanation": "The inner body runs 1 + 2 + ... + 10 = 55 times, which is n(n + 1) / 2, so the Big-O is O(n^2).",
    "optionFeedback": [
      "That is only n, the number of outer passes.",
      "Correct. 1 + 2 + ... + 10.",
      "100 would be n x n with an inner bound of n.",
      "1000 would be three nested loops."
    ]
  },
  {
    "group": "Counting steps",
    "question": "An if-block is one statement. The else-block is a loop that costs 3n + 1 steps. The condition costs 1. What is T(n) in the worst case?",
    "options": [
      "4n + 2",
      "3n + 2",
      "n + 2",
      "3n + 3"
    ],
    "correctIndex": 1,
    "explanation": "T(n) = 1 + max(1, 3n + 1) = 3n + 2, which is O(n). Count the condition and the larger branch only.",
    "optionFeedback": [
      "That adds both branches; only one runs.",
      "Correct. The condition plus the larger branch.",
      "The larger branch costs 3n + 1, not n.",
      "That adds a step that is not in either block."
    ]
  },
  {
    "group": "Big-O and growth",
    "question": "Algorithm X takes 5n + 20 steps and Y takes n^2. From which n is Y slower than X?",
    "options": [
      "n = 4",
      "n = 8",
      "n = 20",
      "Never"
    ],
    "correctIndex": 1,
    "explanation": "For n = 7: X = 55, Y = 49. For n = 8: X = 60, Y = 64. From n = 8 the quadratic Y is slower and falls further behind.",
    "optionFeedback": [
      "At n = 4, X = 40 and Y = 16, so Y is still faster.",
      "Correct. 64 against 60.",
      "Y is already slower well before 20.",
      "A quadratic always overtakes a linear rate for large n."
    ]
  },
  {
    "group": "Big-O and growth",
    "question": "Searching 8 unsorted items for a target that is last takes how many comparisons, and what is the Big-O of the worst case?",
    "options": [
      "1; O(1)",
      "8; O(n)",
      "4.5; O(n)",
      "8; O(1)"
    ],
    "correctIndex": 1,
    "explanation": "The worst case compares every element: 8 = n comparisons, which is O(n). The best case is 1 and the average when present is 4.5.",
    "optionFeedback": [
      "1 is the best case.",
      "Correct. The worst case is n comparisons.",
      "4.5 is the average when the target is present.",
      "The number of comparisons grows with n, so it is not O(1)."
    ]
  },
  {
    "group": "Big-O and growth",
    "question": "Why is 3n^3 + 20n^2 + 5 in O(n^3) although 20 is larger than 3?",
    "options": [
      "The coefficients are ignored for every n",
      "The cubic term is larger from n = 7 and grows faster, and Big-O describes large n",
      "Because 3n^3 is always larger than 20n^2",
      "Because constants cannot be compared"
    ],
    "correctIndex": 1,
    "explanation": "For n = 6, 20n^2 = 720 is larger than 3n^3 = 648; from n = 7, 3n^3 = 1029 is larger than 980. Big-O is about large n.",
    "optionFeedback": [
      "Coefficients are dropped from the answer, but the reason is growth for large n.",
      "Correct.",
      "For small n the quadratic term is larger (n = 6).",
      "The reason is the growth of the terms, not the constants."
    ]
  }
];
