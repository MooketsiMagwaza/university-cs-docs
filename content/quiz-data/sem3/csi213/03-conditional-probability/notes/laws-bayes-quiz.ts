export const quizData = [
  {
    question: "What are the two strict mathematical conditions that a collection of events $A_1, A_2, \\dots, A_n$ must satisfy to form a partition of the sample space $S$?",
    options: [
      "They must be independent and collectively exhaustive.",
      "They must be pairwise mutually exclusive and collectively exhaustive.",
      "They must be pairwise independent and mutually exclusive.",
      "They must have equal probabilities and be mutually exclusive."
    ],
    correctIndex: 1,
    explanation: "A partition requires that no two events overlap ($A_i \\cap A_j = \\emptyset$) and that together they cover the entire sample space ($\\bigcup A_i = S$)."
  },
  {
    question: "Which of the following correctly states the Law of Total Probability (LoTP) for an event $B$ given a partition $A_1, \\dots, A_n$?",
    options: [
      "$P(B) = \\sum_{i=1}^n P(B \\cap A_i)$",
      "$P(B) = \\sum_{i=1}^n P(B \\mid A_i)P(A_i)$",
      "$P(B) = \\prod_{i=1}^n P(B \\mid A_i)P(A_i)$",
      "$P(B) = P(B \\mid A_1) + P(B \\mid A_2) + \\dots + P(B \\mid A_n)$"
    ],
    correctIndex: 1,
    explanation: "LoTP calculates the total probability of $B$ by summing the probabilities of $B$ occurring through each mutually exclusive pathway $A_i$."
  },
  {
    question: "In the formal proof of the Law of Total Probability, what is the very first set-theoretic step taken to partition event $B$?",
    options: [
      "$B = B \\cup S$",
      "$B = B \\cap S$",
      "$B = B \\setminus S$",
      "$B = \\overline{B} \\cap S$"
    ],
    correctIndex: 1,
    explanation: "The proof begins by intersecting $B$ with the sample space $S$, which is an identity operation ($B \\cap S = B$), allowing the partition of $S$ to be substituted."
  },
  {
    question: "In the LoTP proof, why are the intersected events $(B \\cap A_i)$ guaranteed to be pairwise disjoint?",
    options: [
      "Because $B$ is disjoint from all $A_i$.",
      "Because the partition elements $A_i$ are pairwise disjoint.",
      "Because $B$ is a subset of every $A_i$.",
      "Because of the Complement Rule."
    ],
    correctIndex: 1,
    explanation: "If the original sets $A_i$ share no elements, then intersecting them with the same set $B$ cannot create any new shared elements."
  },
  {
    question: "Which specific Kolmogorov Axiom is applied to transition from $P(\\bigcup_{i=1}^n (B \\cap A_i))$ to $\\sum_{i=1}^n P(B \\cap A_i)$ in the LoTP proof?",
    options: [
      "Axiom I (Non-negativity)",
      "Axiom II (Normalization)",
      "Axiom III (Countable Additivity)",
      "The Monotonicity Theorem"
    ],
    correctIndex: 2,
    explanation: "Axiom III states that the probability of the union of mutually exclusive (disjoint) events is the sum of their individual probabilities."
  },
  {
    question: "Which of the following correctly states Bayes' Theorem for a specific partition element $A_k$ given an observed event $B$?",
    options: [
      "$P(A_k \\mid B) = \\frac{P(B \\mid A_k)P(A_k)}{\\sum_{i=1}^n P(B \\mid A_i)P(A_i)}$",
      "$P(A_k \\mid B) = \\frac{P(A_k \\mid B)P(B)}{\\sum_{i=1}^n P(A_i \\mid B)P(B)}$",
      "$P(A_k \\mid B) = P(B \\mid A_k) + P(A_k)$",
      "$P(A_k \\mid B) = \\frac{P(A_k)}{P(B)}$"
    ],
    correctIndex: 0,
    explanation: "Bayes' Theorem reverses the conditional, placing the likelihood times the prior in the numerator, and the total probability (via LoTP) in the denominator."
  },
  {
    question: "In the context of Bayes' Theorem, what is the formal probabilistic term for $P(A_k)$?",
    options: [
      "Posterior probability",
      "Likelihood",
      "Prior probability",
      "Marginal probability of the evidence"
    ],
    correctIndex: 2,
    explanation: "$P(A_k)$ is the probability of the hypothesis before any new evidence $B$ is observed, hence it is the 'prior'."
  },
  {
    question: "In the context of Bayes' Theorem, what is the formal probabilistic term for $P(B \\mid A_k)$?",
    options: [
      "Posterior probability",
      "Likelihood",
      "Prior probability",
      "Marginal probability"
    ],
    correctIndex: 1,
    explanation: "The likelihood is the probability of observing the evidence $B$ assuming that the specific hypothesis $A_k$ is true."
  },
  {
    question: "In the context of Bayes' Theorem, what is the formal probabilistic term for $P(A_k \\mid B)$?",
    options: [
      "Prior probability",
      "Likelihood",
      "Posterior probability",
      "Joint probability"
    ],
    correctIndex: 2,
    explanation: "The posterior probability is the updated probability of the hypothesis $A_k$ after the evidence $B$ has been observed."
  },
  {
    question: "The denominator in Bayes' Theorem, $\\sum_{i=1}^n P(B \\mid A_i)P(A_i)$, is mathematically equivalent to which theorem?",
    options: [
      "The General Multiplication Rule",
      "The Law of Total Probability",
      "The Complement Rule",
      "The General Addition Rule"
    ],
    correctIndex: 1,
    explanation: "The denominator is simply the marginal probability $P(B)$, which is calculated using the Law of Total Probability."
  },
  {
    question: "What is the fundamental logical derivation starting point for proving Bayes' Theorem?",
    options: [
      "The Law of Total Probability",
      "The symmetric definition of joint probability: $P(A_k \\cap B) = P(B \\cap A_k)$",
      "The definition of a partition",
      "The Complement Rule"
    ],
    correctIndex: 1,
    explanation: "Bayes' Theorem is derived by expressing the joint probability $P(A_k \\cap B)$ in two different ways using the definition of conditional probability, and then equating them."
  },
  {
    question: "If a sample space is partitioned by only two events, $A$ and $\\overline{A}$, what is the specific form of the denominator in Bayes' Theorem for $P(A \\mid B)$?",
    options: [
      "$P(B \\mid A)P(A) + P(B \\mid \\overline{A})P(\\overline{A})$",
      "$P(A \\mid B)P(B) + P(\\overline{A} \\mid B)P(B)$",
      "$P(B \\mid A) + P(B \\mid \\overline{A})$",
      "$P(A) + P(\\overline{A})$"
    ],
    correctIndex: 0,
    explanation: "For a binary partition, the Law of Total Probability expands to exactly two terms: the pathway through $A$ and the pathway through $\\overline{A}$."
  },
  {
    question: "What is the primary purpose of Bayes' Theorem in probabilistic inference?",
    options: [
      "To calculate the total probability of an observed event.",
      "To reverse a conditional relationship, finding the probability of a cause given an observed effect.",
      "To prove that two events are mutually exclusive.",
      "To calculate the variance of a discrete random variable."
    ],
    correctIndex: 1,
    explanation: "Bayes' Theorem allows us to 'invert' probabilities, moving from $P(\\text{Effect} \\mid \\text{Cause})$ to $P(\\text{Cause} \\mid \\text{Effect})$."
  },
  {
    question: "If $P(B) = 0$, what is the mathematical status of $P(A_k \\mid B)$?",
    options: [
      "It equals 1.",
      "It equals 0.",
      "It is undefined.",
      "It equals $P(A_k)$."
    ],
    correctIndex: 2,
    explanation: "Conditional probability requires the conditioning event to have a strictly positive probability. Division by zero makes it undefined."
  },
  {
    question: "In the LoTP proof, the substitution $P(B \\cap A_i) = P(B \\mid A_i)P(A_i)$ relies on which fundamental definition?",
    options: [
      "The definition of a partition",
      "The definition of Conditional Probability",
      "The definition of Independence",
      "The definition of the Empty Set"
    ],
    correctIndex: 1,
    explanation: "This substitution is a direct algebraic rearrangement of the definition $P(B \\mid A_i) = \\frac{P(B \\cap A_i)}{P(A_i)}$."
  }
];