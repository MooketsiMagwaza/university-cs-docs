export const quizData = [
  {
    question: "What is the formal definition of Equally Likely Outcomes in a finite sample space?",
    options: [
      "Every event has a probability of exactly 0.5.",
      "Every individual sample point $\\omega \\in S$ has the exact same probability of occurring.",
      "The sample space must contain an even number of outcomes.",
      "The outcomes must be mutually exclusive and exhaustive."
    ],
    correctIndex: 1,
    explanation: "Equally likely outcomes mean that no single sample point is favored over another; each has a probability of $1/N$."
  },
  {
    question: "If a finite sample space $S$ has $N$ equally likely outcomes, what is the probability of any single sample point $\\omega$?",
    options: [
      "$N$",
      "$1/N$",
      "$1 - N$",
      "$N/2$"
    ],
    correctIndex: 1,
    explanation: "By the normalization axiom, the sum of all probabilities must be 1. If all $N$ outcomes are equally likely, each must be $1/N$."
  },
  {
    question: "Which of the following correctly states Theorem 2.3.1 (The Classical Probability Formula)?",
    options: [
      "$P(A) = \\frac{|S|}{|A|}$",
      "$P(A) = \\frac{|A|}{|S|}$",
      "$P(A) = |A| \\cdot |S|$",
      "$P(A) = |S| - |A|$"
    ],
    correctIndex: 1,
    explanation: "The Classical Probability Formula defines the probability of an event as the ratio of the cardinality of the event to the cardinality of the sample space."
  },
  {
    question: "In the Classical Probability Formula $P(A) = \\frac{n(A)}{N}$, what does the variable $n(A)$ formally represent?",
    options: [
      "The total number of outcomes in the sample space.",
      "The number of favorable outcomes for event $A$.",
      "The probability of the complement of $A$.",
      "The number of mutually exclusive events."
    ],
    correctIndex: 1,
    explanation: "$n(A)$ (or $|A|$) represents the cardinality of the event, which is the count of sample points that satisfy the condition for event $A$."
  },
  {
    question: "In the Classical Probability Formula $P(A) = \\frac{n(A)}{N}$, what does the variable $N$ formally represent?",
    options: [
      "The number of favorable outcomes for event $A$.",
      "The total number of possible outcomes in the sample space $S$.",
      "The number of independent trials.",
      "The cardinality of the power set of $S$."
    ],
    correctIndex: 1,
    explanation: "$N$ (or $|S|$) represents the total cardinality of the sample space, encompassing all possible distinct outcomes."
  },
  {
    question: "What is the strict prerequisite condition for a finite sample space to validly utilize the Classical Probability Formula?",
    options: [
      "The outcomes must be continuous.",
      "The outcomes must be equally likely.",
      "The outcomes must be dependent.",
      "The outcomes must be infinite."
    ],
    correctIndex: 1,
    explanation: "The formula $P(A) = n(A)/N$ is only mathematically valid if every outcome in $N$ has the exact same probability of occurring."
  },
  {
    question: "What is the set-theoretic relationship between an event $A$ and the sample space $S$ in the context of the Classical Probability Formula?",
    options: [
      "$S \\subset A$",
      "$A \\subseteq S$",
      "$A \\cap S = \\emptyset$",
      "$A \\cup S = \\emptyset$"
    ],
    correctIndex: 1,
    explanation: "By definition, an event is a subset of the sample space. Therefore, the maximum value of $n(A)$ is $N$."
  },
  {
    question: "Which combinatorial principle is primarily used to determine the total sample space size $N$ for sequential, multi-stage processes?",
    options: [
      "The Sum Rule",
      "The Product Rule",
      "The Inclusion-Exclusion Principle",
      "The Pigeonhole Principle"
    ],
    correctIndex: 1,
    explanation: "The Product Rule ($|A \\times B| = |A| \\cdot |B|$) is used to calculate the total number of outcomes when an experiment consists of sequential stages."
  },
  {
    question: "Which theorem provides the most computationally efficient strategy for calculating the probability of an event occurring 'at least once'?",
    options: [
      "The General Addition Rule",
      "The Partitioning Rule",
      "The Complement Rule",
      "The Monotonicity Theorem"
    ],
    correctIndex: 2,
    explanation: "The Complement Rule ($P(\\text{at least one}) = 1 - P(\\text{none})$) avoids the need to calculate and sum the probabilities of 1, 2, 3... occurrences."
  },
  {
    question: "What is the mathematical formulation of the 'at least one' probability strategy using the Complement Rule?",
    options: [
      "$P(\\text{at least one}) = P(\\text{none}) - 1$",
      "$P(\\text{at least one}) = 1 - P(\\text{none})$",
      "$P(\\text{at least one}) = 1 + P(\\text{none})$",
      "$P(\\text{at least one}) = P(\\text{none})^2$"
    ],
    correctIndex: 1,
    explanation: "The probability of an event occurring at least once is exactly 1 minus the probability of the event never occurring (its complement)."
  },
  {
    question: "When calculating the sample space size $N$ for selecting items where the order of selection does not matter, which combinatorial formula is applied?",
    options: [
      "Permutations $P(n, r)$",
      "Combinations $C(n, r)$",
      "Multinomial Coefficients",
      "The Sum Rule"
    ],
    correctIndex: 1,
    explanation: "Combinations are used when the sequence of selection is irrelevant, meaning $\\{A, B\\}$ is identical to $\\{B, A\\}$."
  },
  {
    question: "When calculating the sample space size $N$ for arranging items where the order of selection strictly matters, which combinatorial formula is applied?",
    options: [
      "Combinations $C(n, r)$",
      "Permutations $P(n, r)$",
      "The Inclusion-Exclusion Principle",
      "Vandermonde's Identity"
    ],
    correctIndex: 1,
    explanation: "Permutations are used when the sequence of selection is significant, meaning the arrangement $(A, B)$ is distinct from $(B, A)$."
  },
  {
    question: "What is the mathematical result of the Classical Probability Formula when the number of favorable outcomes $n(A) = 0$?",
    options: [
      "$1$",
      "$0$",
      "$0.5$",
      "Undefined"
    ],
    correctIndex: 1,
    explanation: "If there are zero favorable outcomes, the event is impossible, and the formula yields $0/N = 0$."
  },
  {
    question: "What is the mathematical result of the Classical Probability Formula when the number of favorable outcomes $n(A)$ equals the total sample space size $N$?",
    options: [
      "$0$",
      "$0.5$",
      "$1$",
      "$N$"
    ],
    correctIndex: 2,
    explanation: "If every outcome in the sample space is favorable, the event is certain, and the formula yields $N/N = 1$."
  },
  {
    question: "What is the theoretical justification for why the Complement Rule is computationally superior for 'at least one' scenarios?",
    options: [
      "It eliminates the need to calculate the sample space size $N$.",
      "It avoids summing the probabilities of 1, 2, 3... occurrences, requiring only the calculation of the zero-occurrence case.",
      "It automatically accounts for dependent events.",
      "It converts combinations into permutations."
    ],
    correctIndex: 1,
    explanation: "Calculating 'at least one' directly requires evaluating $P(1) + P(2) + \\dots + P(n)$. The complement reduces this to a single calculation: $1 - P(0)$."
  }
];