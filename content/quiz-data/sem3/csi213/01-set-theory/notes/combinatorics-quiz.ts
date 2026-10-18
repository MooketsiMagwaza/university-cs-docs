export const quizData = [
  {
    question: "The Sum Rule applies to multiple options under what strict mathematical condition?",
    options: [
      "The sets must be exhaustive ($A \\cup B = U$).",
      "The sets must be mutually exclusive ($A \\cap B = \\emptyset$).",
      "The sets must be subsets of each other ($A \\subseteq B$).",
      "The sets must have equal cardinality ($|A| = |B|$)."
    ],
    correctIndex: 1,
    explanation: "The Sum Rule requires the events or sets to be mutually exclusive, meaning they cannot occur simultaneously ($A \\cap B = \\emptyset$)."
  },
  {
    question: "Which of the following correctly states the Product Rule using the Cartesian product of sets $A$ and $B$?",
    options: [
      "$|A \\cup B| = |A| + |B|$",
      "$|A \\cap B| = |A| \\cdot |B|$",
      "$|A \\times B| = |A| \\cdot |B|$",
      "$|A \\times B| = |A| + |B|$"
    ],
    correctIndex: 2,
    explanation: "The Product Rule calculates the cardinality of the Cartesian product of sequential stages: $|A \\times B| = |A| \\cdot |B|$."
  },
  {
    question: "What is the formal mathematical definition of a Permutation $P(n, r)$?",
    options: [
      "$\\frac{n!}{r!(n-r)!}$",
      "$\\frac{n!}{(n-r)!}$",
      "$\\frac{r!}{(n-r)!}$",
      "$\\frac{n!}{r!}$"
    ],
    correctIndex: 1,
    explanation: "A permutation is an ordered arrangement. The formula is $P(n, r) = \\frac{n!}{(n-r)!}$, where order matters."
  },
  {
    question: "In the derivation of the Combination formula $C(n, r)$, why is the permutation total divided by $r!$?",
    options: [
      "To account for the replacement of items after selection.",
      "To correct for the overcounting of unordered selections.",
      "To eliminate the identical items from the pool.",
      "To calculate the probability of the intersection."
    ],
    correctIndex: 1,
    explanation: "Because combinations are unordered, the permutation formula overcounts by a factor of $r!$ (the number of ways to arrange the selected items). Dividing by $r!$ corrects this."
  },
  {
    question: "Which of the following correctly represents the Multinomial Coefficient formula for dividing $n$ items into $r$ groups?",
    options: [
      "$\\frac{n!}{r!(n-r)!}$",
      "$\\frac{n!}{(n_1 + n_2 + \\dots + n_r)!}$",
      "$\\frac{n!}{n_1! n_2! \\dots n_r!}$",
      "$\\frac{r!}{n_1! n_2! \\dots n_r!}$"
    ],
    correctIndex: 2,
    explanation: "The Multinomial Coefficient divides the total permutations $n!$ by the factorials of the counts of each identical subgroup: $\\frac{n!}{n_1! n_2! \\dots n_r!}$."
  },
  {
    question: "What is the strict mathematical condition that the subgroup sizes $n_1, n_2, \\dots, n_r$ must satisfy in the Multinomial Coefficient?",
    options: [
      "$\\prod_{i=1}^r n_i = n$",
      "$\\sum_{i=1}^r n_i = n$",
      "$n_i = \\frac{n}{r}$",
      "$\\sum_{i=1}^r n_i = r$"
    ],
    correctIndex: 1,
    explanation: "The sum of the sizes of all subgroups must exactly equal the total number of items $n$: $\\sum_{i=1}^r n_i = n$."
  },
  {
    question: "Which of the following correctly states the Inclusion-Exclusion Principle for three sets?",
    options: [
      "$|A \\cup B \\cup C| = |A| + |B| + |C| - |A \\cap B \\cap C|$",
      "$|A \\cup B \\cup C| = |A| + |B| + |C| + |A \\cap B| + |A \\cap C| + |B \\cap C| - |A \\cap B \\cap C|$",
      "$|A \\cup B \\cup C| = |A| + |B| + |C| - |A \\cap B| - |A \\cap C| - |B \\cap C| + |A \\cap B \\cap C|$",
      "$|A \\cup B \\cup C| = |A| \\cdot |B| \\cdot |C| - |A \\cap B \\cap C|$"
    ],
    correctIndex: 2,
    explanation: "For three sets, you add the individual sets, subtract the pairwise intersections, and add back the triple intersection to prevent over/under-counting."
  },
  {
    question: "In the combinatorial proof of Vandermonde's Identity, what does the right-hand side $\\binom{m+n}{r}$ represent?",
    options: [
      "Selecting $k$ men from $m$ and $r-k$ women from $n$.",
      "Selecting $r$ individuals directly from the combined pool of $m+n$ people.",
      "The sum of all possible ways to form a committee with at least one man.",
      "The number of ways to arrange $r$ people from a group of $m+n$."
    ],
    correctIndex: 1,
    explanation: "The right-hand side represents the direct method: ignoring gender entirely and simply choosing $r$ people from the total combined pool of $m+n$."
  },
  {
    question: "What is the left-hand side of Vandermonde's Identity?",
    options: [
      "$\\sum_{k=0}^n \\binom{m}{k}\\binom{n}{r-k}$",
      "$\\sum_{k=0}^r \\binom{m}{k}\\binom{n}{r-k}$",
      "$\\binom{m}{r}\\binom{n}{r}$",
      "$\\sum_{k=0}^r \\binom{m+n}{k}$"
    ],
    correctIndex: 1,
    explanation: "The left-hand side partitions the selection by the number of men $k$, summing the product of combinations from $k=0$ to $r$: $\\sum_{k=0}^r \\binom{m}{k}\\binom{n}{r-k}$."
  },
  {
    question: "According to the Generalized Pigeonhole Principle, if $n$ objects are placed into $k$ boxes, at least one box must contain at least how many objects?",
    options: [
      "$\\lfloor n/k \\rfloor$",
      "$\\lceil n/k \\rceil$",
      "$n/k$",
      "$n - k$"
    ],
    correctIndex: 1,
    explanation: "The Generalized Pigeonhole Principle uses the ceiling function to guarantee that at least one container holds $\\lceil n/k \\rceil$ objects."
  },
  {
    question: "In the context of the Product Rule, what is the crucial requirement for the number of choices in the second stage?",
    options: [
      "It must be mutually exclusive from the first stage.",
      "It must remain constant regardless of the specific choice made in the first stage.",
      "It must be exactly equal to the number of choices in the first stage.",
      "It must decrease by exactly one for every choice made in the first stage."
    ],
    correctIndex: 1,
    explanation: "For the simple Product Rule ($m \\times n$) to apply, the number of options in stage 2 must not be dependent on which specific option was chosen in stage 1."
  },
  {
    question: "Which of the following correctly defines a Combination $C(n, r)$?",
    options: [
      "An ordered arrangement of $r$ objects from a set of $n$ distinct objects.",
      "An unordered selection of $r$ objects from a set of $n$ distinct objects.",
      "A sequence of $n$ objects where repetition is allowed.",
      "A partition of $n$ objects into $r$ distinct groups."
    ],
    correctIndex: 1,
    explanation: "A combination is strictly an unordered selection. The sequence in which the $r$ objects are chosen does not matter."
  },
  {
    question: "In the Inclusion-Exclusion Principle, what is the fundamental purpose of subtracting the intersections (e.g., $|A \\cap B|$)?",
    options: [
      "To account for the elements that belong to neither set.",
      "To prevent double-counting of elements that belong to multiple sets.",
      "To calculate the conditional probability of the union.",
      "To isolate the elements that belong exclusively to set $A$."
    ],
    correctIndex: 1,
    explanation: "When adding $|A| + |B|$, elements in the intersection are counted twice. Subtracting $|A \\cap B|$ corrects this double-counting."
  },
  {
    question: "What is the basic form condition for the Pigeonhole Principle to guarantee that at least one container holds $\\ge 2$ items?",
    options: [
      "$n = m$",
      "$n < m$",
      "$n > m$",
      "$n \\ge m$"
    ],
    correctIndex: 2,
    explanation: "The basic Pigeonhole Principle requires the number of items $n$ to be strictly greater than the number of containers $m$ ($n > m$)."
  },
  {
    question: "In the combinatorial proof of Vandermonde's Identity, what does the term $\\binom{m}{k}\\binom{n}{r-k}$ represent?",
    options: [
      "Selecting $r$ people from $m$ men and $k$ women.",
      "Selecting $k$ men from $m$ and $r-k$ women from $n$.",
      "Selecting $k$ people from the combined pool of $m+n$.",
      "The total number of ways to form a committee of size $r$."
    ],
    correctIndex: 1,
    explanation: "This term represents a specific case in the partition: choosing exactly $k$ men from the $m$ available, AND $r-k$ women from the $n$ available."
  }
];