export const quizData = [
  {
    question: "Who established the modern measure-theoretic foundation of probability in 1933?",
    options: [
      "Carl Friedrich Gauss",
      "Andrey Kolmogorov",
      "Pierre-Simon Laplace",
      "Blaise Pascal"
    ],
    correctIndex: 1,
    explanation: "Andrey Kolmogorov formalized probability theory using measure theory and axioms in his 1933 work 'Foundations of the Theory of Probability'."
  },
  {
    question: "Which of the following correctly states Axiom I of the Kolmogorov Axioms?",
    options: [
      "$P(S) = 1$",
      "$P(\\emptyset) = 0$",
      "$P(A) \\ge 0$",
      "$P(A \\cup B) = P(A) + P(B)$"
    ],
    correctIndex: 2,
    explanation: "Axiom I (Non-negativity) dictates that the probability of any event must be a non-negative real number."
  },
  {
    question: "Which of the following correctly states Axiom II of the Kolmogorov Axioms?",
    options: [
      "$P(A) \\ge 0$ for all events $A$.",
      "$P(S) = 1$, where $S$ is the sample space.",
      "$P(A \\cap B) = P(A)P(B)$ for disjoint events.",
      "$P(A) \\le 1$ for all events $A$."
    ],
    correctIndex: 1,
    explanation: "Axiom II (Normalization) states that the probability of the entire sample space (the Certain Event) is exactly 1."
  },
  {
    question: "What is the strict mathematical condition required to apply Axiom III (Countable Additivity) to two events $A$ and $B$?",
    options: [
      "$A \\cup B = S$",
      "$A \\subseteq B$",
      "$A \\cap B = \\emptyset$",
      "$P(A) = P(B)$"
    ],
    correctIndex: 2,
    explanation: "Axiom III only applies when the events are mutually exclusive (disjoint), meaning their intersection is the empty set."
  },
  {
    question: "What is the mathematical formulation of Axiom III for two mutually exclusive events?",
    options: [
      "$P(A \\cup B) = P(A) \\cdot P(B)$",
      "$P(A \\cup B) = P(A) + P(B)$",
      "$P(A \\cap B) = P(A) + P(B)$",
      "$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$"
    ],
    correctIndex: 1,
    explanation: "For disjoint events, the probability of their union is simply the sum of their individual probabilities."
  },
  {
    question: "According to Theorem 2.2.2, what is the probability of the Impossible Event?",
    options: [
      "$1$",
      "$-1$",
      "$0$",
      "Undefined"
    ],
    correctIndex: 2,
    explanation: "Theorem 2.2.2 rigorously proves that $P(\\emptyset) = 0$ using the axioms of additivity and normalization."
  },
  {
    question: "In the formal proof of Theorem 2.2.2 ($P(\\emptyset) = 0$), what set-theoretic identity is established in Step 1?",
    options: [
      "$S \\cap \\emptyset = \\emptyset$",
      "$S \\cup \\emptyset = S$",
      "$S \\setminus \\emptyset = \\emptyset$",
      "$S \\cup \\emptyset = \\emptyset$"
    ],
    correctIndex: 1,
    explanation: "The proof begins by noting that the union of the sample space and the empty set is just the sample space itself: $S \\cup \\emptyset = S$."
  },
  {
    question: "Which of the following correctly states Theorem 2.2.3 (The Complement Rule)?",
    options: [
      "$P(\\overline{A}) = P(A) - 1$",
      "$P(\\overline{A}) = 1 - P(A)$",
      "$P(\\overline{A}) = 1 + P(A)$",
      "$P(\\overline{A}) = P(A)$"
    ],
    correctIndex: 1,
    explanation: "The Complement Rule states that the probability of an event not occurring is 1 minus the probability of it occurring."
  },
  {
    question: "In the formal proof of the Complement Rule, what set-theoretic identity is used to partition the sample space?",
    options: [
      "$A \\cap \\overline{A} = S$",
      "$A \\cup \\overline{A} = S$",
      "$A \\setminus \\overline{A} = \\emptyset$",
      "$A \\cup \\overline{A} = \\emptyset$"
    ],
    correctIndex: 1,
    explanation: "An event and its complement are mutually exclusive and exhaustive, meaning their union perfectly reconstructs the entire sample space $S$."
  },
  {
    question: "In the proof of the Complement Rule, which specific axiom is invoked to establish the upper bound $P(A) \\le 1$?",
    options: [
      "Axiom I (Non-negativity)",
      "Axiom II (Normalization)",
      "Axiom III (Additivity)",
      "The Partitioning Rule"
    ],
    correctIndex: 0,
    explanation: "Axiom I dictates that $P(\\overline{A}) \\ge 0$. Substituting the complement formula $1 - P(A)$ into this inequality yields $P(A) \\le 1$."
  },
  {
    question: "Which of the following correctly states Theorem 2.2.4 (The Partitioning Rule)?",
    options: [
      "$P(A) = P(A \\cup B) + P(A \\cup \\overline{B})$",
      "$P(A) = P(A \\cap B) + P(A \\cap \\overline{B})$",
      "$P(A) = P(A \\cap B) - P(A \\cap \\overline{B})$",
      "$P(A) = P(A \\cup B) - P(A \\cap B)$"
    ],
    correctIndex: 1,
    explanation: "The Partitioning Rule splits the probability of an event into the sum of its intersections with another event and its complement."
  },
  {
    question: "In the formal proof of the Partitioning Rule, how is the event $A$ deconstructed into mutually exclusive components?",
    options: [
      "$A = (A \\cup B) \\cap (A \\cup \\overline{B})$",
      "$A = (A \\cap B) \\cup (A \\cap \\overline{B})$",
      "$A = (A \\setminus B) \\cup (A \\setminus \\overline{B})$",
      "$A = (A \\cap B) \\cap (A \\cap \\overline{B})$"
    ],
    correctIndex: 1,
    explanation: "Set $A$ is split into the part that overlaps with $B$ and the part that does not overlap with $B$. These two parts are disjoint."
  },
  {
    question: "Which of the following correctly states Theorem 2.2.5 (Monotonicity)?",
    options: [
      "If $A \\cap B = \\emptyset$, then $P(A) = P(B)$.",
      "If $A \\subseteq B$, then $P(A) \\le P(B)$.",
      "If $A \\cup B = S$, then $P(A) + P(B) = 1$.",
      "If $A \\subseteq B$, then $P(A) \\ge P(B)$."
    ],
    correctIndex: 1,
    explanation: "Monotonicity dictates that if the occurrence of $A$ guarantees the occurrence of $B$, then $A$ cannot be more probable than $B$."
  },
  {
    question: "In the formal proof of Monotonicity, how is the event $B$ deconstructed using the assumption $A \\subseteq B$?",
    options: [
      "$B = A \\cup (B \\cap \\overline{A})$",
      "$B = A \\cap (B \\cup \\overline{A})$",
      "$B = (A \\cup B) \\cap \\overline{A}$",
      "$B = A \\setminus (A \\cap B)$"
    ],
    correctIndex: 0,
    explanation: "Because $A$ is entirely inside $B$, $B$ consists exactly of $A$ plus whatever part of $B$ is outside of $A$ (which is $B \\cap \\overline{A}$)."
  },
  {
    question: "Which of the following correctly states Theorem 2.2.6 (The General Addition Rule)?",
    options: [
      "$P(A \\cup B) = P(A) + P(B)$",
      "$P(A \\cup B) = P(A) \\cdot P(B)$",
      "$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$",
      "$P(A \\cup B) = P(A) + P(B) + P(A \\cap B)$"
    ],
    correctIndex: 2,
    explanation: "The General Addition Rule corrects for the double-counting of the intersection when calculating the probability of the union of overlapping events."
  }
];