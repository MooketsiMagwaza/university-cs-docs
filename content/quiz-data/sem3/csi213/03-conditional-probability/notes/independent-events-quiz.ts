export const quizData = [
  {
    question: "Which of the following correctly states the formal mathematical definition of Statistical Independence for two events $A$ and $B$?",
    options: [
      "$P(A \\cup B) = P(A) + P(B)$",
      "$P(A \\cap B) = P(A)P(B)$",
      "$P(A \\mid B) = 0$",
      "$P(A \\cap B) = \\emptyset$"
    ],
    correctIndex: 1,
    explanation: "Two events are independent if and only if their joint probability equals the product of their marginal probabilities."
  },
  {
    question: "Assuming $P(A) > 0$, which of the following conditional probability statements is mathematically equivalent to the definition of independence?",
    options: [
      "$P(B \\mid A) = P(A)$",
      "$P(B \\mid A) = P(B)$",
      "$P(B \\mid A) = 1$",
      "$P(B \\mid A) = 0$"
    ],
    correctIndex: 1,
    explanation: "If $A$ and $B$ are independent, knowing $A$ occurred provides no information about $B$, so the conditional probability equals the marginal probability."
  },
  {
    question: "What is the strict logical relationship between Mutual Exclusivity and Independence for two events $A$ and $B$ where $P(A) > 0$ and $P(B) > 0$?",
    options: [
      "They are always independent.",
      "They are strictly dependent.",
      "They are independent only if $P(A) = P(B)$.",
      "There is no mathematical relationship between the two concepts."
    ],
    correctIndex: 1,
    explanation: "If they are mutually exclusive, $P(A \\cap B) = 0$. But if they were independent, $P(A \\cap B)$ would equal $P(A)P(B) > 0$. This contradiction proves they must be dependent."
  },
  {
    question: "In the formal proof by contradiction that mutually exclusive events are dependent, what is the value of $P(A \\cap B)$?",
    options: [
      "$P(A)P(B)$",
      "$0$",
      "$1$",
      "Undefined"
    ],
    correctIndex: 1,
    explanation: "By the definition of mutual exclusivity, the events cannot occur simultaneously, so their intersection is the empty set, yielding a probability of 0."
  },
  {
    question: "In the same proof, if $P(A) > 0$ and $P(B) > 0$, what is the mathematical property of the product $P(A)P(B)$?",
    options: [
      "It is strictly less than 0.",
      "It is exactly equal to 0.",
      "It is strictly greater than 0.",
      "It is equal to 1."
    ],
    correctIndex: 2,
    explanation: "The product of two strictly positive real numbers is always strictly positive, creating the contradiction with $P(A \\cap B) = 0$."
  },
  {
    question: "According to Theorem 3.3.1, if events $A$ and $B$ are independent, what is the relationship between $A$ and $\\overline{B}$?",
    options: [
      "They are mutually exclusive.",
      "They are strictly dependent.",
      "They are also independent.",
      "Their relationship cannot be determined."
    ],
    correctIndex: 2,
    explanation: "Independence is preserved under complementation. If $A$ and $B$ are independent, then $A$ and $\\overline{B}$ are also independent."
  },
  {
    question: "In the formal proof that $A$ and $\\overline{B}$ are independent, what is the first step to express $P(A \\cap \\overline{B})$?",
    options: [
      "$P(A \\cap \\overline{B}) = P(A) + P(\\overline{B})$",
      "$P(A \\cap \\overline{B}) = P(A) - P(A \\cap B)$",
      "$P(A \\cap \\overline{B}) = P(A)P(\\overline{B})$",
      "$P(A \\cap \\overline{B}) = P(A \\cup B) - P(B)$"
    ],
    correctIndex: 1,
    explanation: "The proof uses the Partitioning Rule (or Difference Rule), recognizing that $A$ is the union of the disjoint sets $(A \\cap B)$ and $(A \\cap \\overline{B})$."
  },
  {
    question: "In the final step of the same proof, factoring out $P(A)$ from $P(A) - P(A)P(B)$ yields which expression?",
    options: [
      "$P(A)(1 + P(B))$",
      "$P(A)(1 - P(B))$",
      "$P(A)P(B)$",
      "$P(A) - P(B)$"
    ],
    correctIndex: 1,
    explanation: "Factoring out $P(A)$ leaves $(1 - P(B))$, which is exactly the definition of $P(\\overline{B})$, completing the proof that $P(A \\cap \\overline{B}) = P(A)P(\\overline{B})$."
  },
  {
    question: "What is the formal definition of Pairwise Independence for a collection of three events $A, B,$ and $C$?",
    options: [
      "$P(A \\cap B \\cap C) = P(A)P(B)P(C)$",
      "$P(A \\cap B) = P(A)P(B)$, $P(A \\cap C) = P(A)P(C)$, and $P(B \\cap C) = P(B)P(C)$",
      "$P(A \\cup B \\cup C) = P(A) + P(B) + P(C)$",
      "Every event is mutually exclusive from the others."
    ],
    correctIndex: 1,
    explanation: "Pairwise independence requires that the independence condition $P(X \\cap Y) = P(X)P(Y)$ holds true for every possible pair of events in the collection."
  },
  {
    question: "What is the formal definition of Mutual Independence for a collection of three events $A, B,$ and $C$?",
    options: [
      "They are pairwise independent, AND $P(A \\cap B \\cap C) = P(A)P(B)P(C)$.",
      "They are pairwise independent, AND $P(A \\cup B \\cup C) = 1$.",
      "They are mutually exclusive, AND $P(A \\cap B \\cap C) = 0$.",
      "At least two of the events are independent."
    ],
    correctIndex: 0,
    explanation: "Mutual independence is a stronger condition than pairwise independence. It requires pairwise independence plus the condition that the joint probability of all events equals the product of their marginals."
  },
  {
    question: "Does Pairwise Independence imply Mutual Independence?",
    options: [
      "Yes, always.",
      "No, not necessarily.",
      "Yes, but only for continuous random variables.",
      "Yes, but only if the events are mutually exclusive."
    ],
    correctIndex: 1,
    explanation: "Pairwise independence does not guarantee mutual independence. Classic counterexamples exist where all pairs are independent, but the joint probability of all three fails the product rule."
  },
  {
    question: "In the classic counterexample demonstrating that pairwise independence does not imply mutual independence, what is the cardinality of the sample space?",
    options: [
      "2",
      "3",
      "4",
      "8"
    ],
    correctIndex: 2,
    explanation: "The standard counterexample uses a sample space of 4 equally likely outcomes (e.g., $\\{1, 2, 3, 4\\}$) to construct three events that are pairwise independent but not mutually independent."
  },
  {
    question: "In that same counterexample, which specific mathematical condition fails, proving the events are not mutually independent?",
    options: [
      "$P(A \\cap B) \\neq P(A)P(B)$",
      "$P(A \\cap B \\cap C) \\neq P(A)P(B)P(C)$",
      "$P(A \\cup B \\cup C) \\neq 1$",
      "$P(A) + P(B) + P(C) \\neq 1$"
    ],
    correctIndex: 1,
    explanation: "While all pairwise conditions hold, the joint probability of all three events occurring simultaneously does not equal the product of their individual probabilities."
  },
  {
    question: "If events $A$ and $B$ are independent, what is the formula for $P(A \\cup B)$?",
    options: [
      "$P(A) + P(B)$",
      "$P(A) + P(B) - P(A)P(B)$",
      "$P(A)P(B)$",
      "$1 - P(A)P(B)$"
    ],
    correctIndex: 1,
    explanation: "Using the General Addition Rule $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$, and substituting $P(A \\cap B) = P(A)P(B)$ for independent events, yields this formula."
  },
  {
    question: "If $P(A \\mid B) = P(A)$ and $P(B) > 0$, what can be definitively concluded about the relationship between $A$ and $B$?",
    options: [
      "They are mutually exclusive.",
      "They are statistically independent.",
      "They are collectively exhaustive.",
      "$P(A \\cap B) = 0$."
    ],
    correctIndex: 1,
    explanation: "This is the conditional definition of independence. Multiplying both sides by $P(B)$ yields $P(A \\cap B) = P(A)P(B)$, the formal definition."
  }
];