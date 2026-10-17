export const quizData = [
  {
    question: "Which of the following correctly states the formal mathematical definition of Conditional Probability $P(B \\mid A)$?",
    options: [
      "$P(B \\mid A) = \\frac{P(A \\cup B)}{P(A)}$",
      "$P(B \\mid A) = \\frac{P(A \\cap B)}{P(A)}$",
      "$P(B \\mid A) = \\frac{P(A \\cap B)}{P(B)}$",
      "$P(B \\mid A) = P(A) \\cdot P(B)$"
    ],
    correctIndex: 1,
    explanation: "Conditional probability is formally defined as the joint probability of $A$ and $B$ divided by the probability of the conditioning event $A$."
  },
  {
    question: "What is the strict mathematical condition required for the conditional probability $P(B \\mid A)$ to be well-defined?",
    options: [
      "$P(A) = 0$",
      "$P(A) > 0$",
      "$P(B) > 0$",
      "$P(A \\cap B) > 0$"
    ],
    correctIndex: 1,
    explanation: "The definition involves division by $P(A)$, so $P(A)$ must be strictly greater than zero to avoid division by zero."
  },
  {
    question: "In the set-theoretic interpretation of conditional probability, what does the conditioning event $A$ represent?",
    options: [
      "The universal set $S$.",
      "The new, restricted sample space.",
      "The complement of the sample space.",
      "The empty set $\\emptyset$."
    ],
    correctIndex: 1,
    explanation: "Given that $A$ has occurred, the universe of possible outcomes is restricted to only those within $A$."
  },
  {
    question: "In the formal proof of the Complement Rule in conditional space ($P(B \\mid A) + P(\\overline{B} \\mid A) = 1$), what is the result of combining the numerators in Step 3?",
    options: [
      "$P((A \\cup B) \\cap (A \\cup \\overline{B}))$",
      "$P((A \\cap B) \\cup (A \\cap \\overline{B}))$",
      "$P((A \\cap B) \\cap (A \\cap \\overline{B}))$",
      "$P(A \\cup (B \\cap \\overline{B}))$"
    ],
    correctIndex: 1,
    explanation: "Since the denominators are identical, the numerators are added, representing the union of the two disjoint intersections."
  },
  {
    question: "In the same proof, which set-theoretic law is applied to simplify $(A \\cap B) \\cup (A \\cap \\overline{B})$ to $A$?",
    options: [
      "De Morgan's Law",
      "The Distributive Law",
      "The Absorption Law",
      "The Idempotent Law"
    ],
    correctIndex: 1,
    explanation: "Factoring out $A$ using the Distributive Law yields $A \\cap (B \\cup \\overline{B}) = A \\cap S = A$."
  },
  {
    question: "Which of the following correctly states the General Multiplication Rule for $n$ events?",
    options: [
      "$P(\\bigcap_{i=1}^n A_i) = \\sum_{i=1}^n P(A_i \\mid \\bigcap_{j=1}^{i-1} A_j)$",
      "$P(\\bigcap_{i=1}^n A_i) = P(A_1) \\cdot P(A_2 \\mid A_1) \\cdot P(A_3 \\mid A_1 \\cap A_2) \\dots P(A_n \\mid \\bigcap_{i=1}^{n-1} A_i)$",
      "$P(\\bigcap_{i=1}^n A_i) = P(A_1) + P(A_2 \\mid A_1) + \\dots + P(A_n \\mid \\bigcap_{i=1}^{n-1} A_i)$",
      "$P(\\bigcap_{i=1}^n A_i) = \\prod_{i=1}^n P(A_i)$"
    ],
    correctIndex: 1,
    explanation: "The General Multiplication Rule extends conditional probability to calculate the joint probability of a sequence of events by multiplying the probability of each event given all preceding events."
  },
  {
    question: "In the General Multiplication Rule, what is the very first term in the product?",
    options: [
      "$P(A_1 \\mid A_2)$",
      "$P(A_1)$",
      "$P(A_1 \\cap A_2)$",
      "$1$"
    ],
    correctIndex: 1,
    explanation: "The first event has no preceding conditions, so its term is simply its marginal probability $P(A_1)$."
  },
  {
    question: "If $A \\subseteq B$ and $P(A) > 0$, what is the exact value of $P(B \\mid A)$?",
    options: [
      "$0$",
      "$P(B)$",
      "$1$",
      "Undefined"
    ],
    correctIndex: 2,
    explanation: "If $A$ is a subset of $B$, then $A \\cap B = A$. Therefore, $P(B \\mid A) = \\frac{P(A \\cap B)}{P(A)} = \\frac{P(A)}{P(A)} = 1$."
  },
  {
    question: "If $A \\cap B = \\emptyset$ and $P(A) > 0$, what is the exact value of $P(B \\mid A)$?",
    options: [
      "$0$",
      "$P(B)$",
      "$1$",
      "Undefined"
    ],
    correctIndex: 0,
    explanation: "If $A$ and $B$ are mutually exclusive, $P(A \\cap B) = 0$. Therefore, $P(B \\mid A) = \\frac{0}{P(A)} = 0$."
  },
  {
    question: "Which of the following represents the symmetric definition of joint probability derived from conditional probability?",
    options: [
      "$P(A \\cap B) = P(A \\mid B) + P(B \\mid A)$",
      "$P(A \\cap B) = P(A)P(B \\mid A) = P(B)P(A \\mid B)$",
      "$P(A \\cap B) = \\frac{P(A)}{P(B \\mid A)}$",
      "$P(A \\cap B) = P(A \\cup B) - P(A) - P(B)$"
    ],
    correctIndex: 1,
    explanation: "Rearranging the definition of conditional probability yields two equivalent expressions for the joint probability $P(A \\cap B)$."
  },
  {
    question: "In the General Multiplication Rule, what does the term $P(A_k \\mid A_1 \\cap \\dots \\cap A_{k-1})$ formally represent?",
    options: [
      "The marginal probability of the $k$-th event.",
      "The probability of the $k$-th event given that all preceding $k-1$ events have occurred.",
      "The joint probability of the first $k$ events.",
      "The probability of the union of the first $k$ events."
    ],
    correctIndex: 1,
    explanation: "This term represents the conditional probability of the current event, restricted by the occurrence of every single event that came before it in the sequence."
  },
  {
    question: "What is the logical interpretation of the denominator in the fraction $\\frac{P(A \\cap B)}{P(A)}$?",
    options: [
      "It represents the total probability of the universal set.",
      "It acts as a normalization constant, scaling the joint probability to the new restricted sample space $A$.",
      "It represents the probability of the complement of $A$.",
      "It is the variance of event $A$."
    ],
    correctIndex: 1,
    explanation: "Dividing by $P(A)$ ensures that the total probability of the new restricted sample space $A$ sums to 1, satisfying the normalization axiom."
  },
  {
    question: "If $P(B \\mid A) = P(B)$, what can be definitively concluded about the relationship between $A$ and $B$ (assuming $P(A)>0$)?",
    options: [
      "They are mutually exclusive.",
      "They are statistically independent.",
      "They are collectively exhaustive.",
      "They are dependent."
    ],
    correctIndex: 1,
    explanation: "If the conditional probability equals the marginal probability, the occurrence of $A$ provides no information about $B$, which is the definition of independence."
  },
  {
    question: "Which set-theoretic identity is fundamentally relied upon to prove that $P(B \\mid A) + P(\\overline{B} \\mid A) = 1$?",
    options: [
      "$A \\cup \\overline{A} = S$",
      "$(A \\cap B) \\cup (A \\cap \\overline{B}) = A$",
      "$\\overline{A \\cup B} = \\overline{A} \\cap \\overline{B}$",
      "$A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)$"
    ],
    correctIndex: 1,
    explanation: "The proof requires combining the numerators into a single probability, which simplifies to $P(A)$ via this specific distributive identity."
  },
  {
    question: "In the context of the General Multiplication Rule, if all events $A_1, \\dots, A_n$ are mutually independent, what does the formula simplify to?",
    options: [
      "$\\sum_{i=1}^n P(A_i)$",
      "$\\prod_{i=1}^n P(A_i)$",
      "$1 - \\prod_{i=1}^n (1 - P(A_i))$",
      "$P(A_1)$"
    ],
    correctIndex: 1,
    explanation: "If events are independent, the conditional probabilities reduce to marginal probabilities ($P(A_k \\mid \\dots) = P(A_k)$), resulting in the simple product of all marginal probabilities."
  }
];