export const quizData = [
  {
    question: "Which of the following represents the First Distributive Law of set algebra?",
    options: [
      "$A \\cup (B \\cap C) = (A \\cup B) \\cap (A \\cup C)$",
      "$A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)$",
      "$A \\cap (B \\cap C) = (A \\cap B) \\cup (A \\cap C)$",
      "$A \\cup (B \\cup C) = (A \\cup B) \\cap (A \\cup C)$"
    ],
    correctIndex: 1,
    explanation: "The First Distributive Law states that intersection distributes over union: $A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)$."
  },
  {
    question: "In the double-inclusion proof of De Morgan's Law for Union, what is the logical justification for the forward inclusion step ($\\subseteq$)?",
    options: [
      "If $x \\notin (A \\cup B)$, then $x \\notin A$ AND $x \\notin B$, which implies $x \\in \\overline{A} \\cap \\overline{B}$.",
      "If $x \\in \\overline{A} \\cap \\overline{B}$, then $x \\notin A$ OR $x \\notin B$, which implies $x \\notin (A \\cup B)$.",
      "By applying the Distributive Law to the complement of the union.",
      "By applying the Identity Law to the universal set $U$."
    ],
    correctIndex: 0,
    explanation: "The forward inclusion assumes $x$ is in the complement of the union. This means $x$ is in neither $A$ nor $B$, so it must be in both complements, placing it in their intersection."
  },
  {
    question: "Which of the following correctly states the Second Distributive Law?",
    options: [
      "$A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)$",
      "$A \\cup (B \\cap C) = (A \\cup B) \\cap (A \\cup C)$",
      "$A \\cup (B \\cup C) = (A \\cup B) \\cup (A \\cup C)$",
      "$A \\cap (B \\cap C) = (A \\cup B) \\cap (A \\cup C)$"
    ],
    correctIndex: 1,
    explanation: "The Second Distributive Law states that union distributes over intersection: $A \\cup (B \\cap C) = (A \\cup B) \\cap (A \\cup C)$."
  },
  {
    question: "According to the Domination Laws, what is the result of $A \\cup U$?",
    options: [
      "$A$",
      "$\\emptyset$",
      "$U$",
      "$\\overline{A}$"
    ],
    correctIndex: 2,
    explanation: "The Domination Law for union states that combining any set with the universal set results in the universal set: $A \\cup U = U$."
  },
  {
    question: "Which of the following represents the Absorption Law for union?",
    options: [
      "$A \\cap (A \\cup B) = A$",
      "$A \\cup (A \\cap B) = A$",
      "$A \\cup (A \\cup B) = A$",
      "$A \\cap (A \\cap B) = A$"
    ],
    correctIndex: 1,
    explanation: "The Absorption Law for union states that a set absorbs the intersection of itself with another set: $A \\cup (A \\cap B) = A$."
  },
  {
    question: "In the algebraic proof of the Absorption Law ($A \\cup (A \\cap B) = A$), which identity is applied first to the term $A$?",
    options: [
      "$A = A \\cup U$",
      "$A = A \\cap U$",
      "$A = A \\cup \\emptyset$",
      "$A = A \\cap \\emptyset$"
    ],
    correctIndex: 1,
    explanation: "The proof begins by applying the Identity Law to rewrite $A$ as $A \\cap U$, allowing the Distributive Law to be applied in the next step."
  },
  {
    question: "Which of the following correctly expresses De Morgan's Law for the complement of an intersection?",
    options: [
      "$\\overline{A \\cap B} = \\overline{A} \\cap \\overline{B}$",
      "$\\overline{A \\cap B} = \\overline{A} \\cup \\overline{B}$",
      "$\\overline{A \\cup B} = \\overline{A} \\cup \\overline{B}$",
      "$\\overline{A \\cap B} = A \\cup B$"
    ],
    correctIndex: 1,
    explanation: "De Morgan's Law for intersection states that the complement of an intersection is the union of the individual complements: $\\overline{A \\cap B} = \\overline{A} \\cup \\overline{B}$."
  },
  {
    question: "What is the formal definition of set difference $A - B$ in terms of intersection and complement?",
    options: [
      "$A \\cup \\overline{B}$",
      "$\\overline{A} \\cap B$",
      "$A \\cap \\overline{B}$",
      "$A \\cup B$"
    ],
    correctIndex: 2,
    explanation: "Set difference $A - B$ is formally defined as the intersection of $A$ with the complement of $B$: $A \\cap \\overline{B}$."
  },
  {
    question: "Which of the following represents the Associative Law for intersection?",
    options: [
      "$(A \\cap B) \\cap C = A \\cap (B \\cup C)$",
      "$(A \\cup B) \\cup C = A \\cup (B \\cup C)$",
      "$(A \\cap B) \\cap C = A \\cap (B \\cap C)$",
      "$(A \\cap B) \\cup C = A \\cap (B \\cup C)$"
    ],
    correctIndex: 2,
    explanation: "The Associative Law for intersection states that the grouping of sets does not affect the result: $(A \\cap B) \\cap C = A \\cap (B \\cap C)$."
  },
  {
    question: "In the proof of Set Difference Associativity, $(A - B) - C = A - (B \\cup C)$, which law is applied to transform $\\overline{B} \\cap \\overline{C}$ into $\\overline{(B \\cup C)}$?",
    options: [
      "Distributive Law",
      "De Morgan's Law",
      "Absorption Law",
      "Identity Law"
    ],
    correctIndex: 1,
    explanation: "The transformation of the intersection of complements ($\\overline{B} \\cap \\overline{C}$) into the complement of a union ($\\overline{(B \\cup C)}$) is the direct application of De Morgan's Law."
  },
  {
    question: "Which of the following correctly states the Idempotent Law for intersection?",
    options: [
      "$A \\cap A = U$",
      "$A \\cap A = \\emptyset$",
      "$A \\cap A = A$",
      "$A \\cap A = \\overline{A}$"
    ],
    correctIndex: 2,
    explanation: "The Idempotent Law states that combining a set with itself using intersection yields the original set: $A \\cap A = A$."
  },
  {
    question: "According to the Complement Laws, what is the result of $A \\cup \\overline{A}$?",
    options: [
      "$A$",
      "$\\emptyset$",
      "$U$",
      "$\\overline{U}$"
    ],
    correctIndex: 2,
    explanation: "The Complement Law for union states that a set combined with its complement covers the entire universal set: $A \\cup \\overline{A} = U$."
  },
  {
    question: "In the double-inclusion proof of De Morgan's Law for Intersection, what is the logical justification for the reverse inclusion step ($\\supseteq$)?",
    options: [
      "If $x \\in \\overline{A} \\cup \\overline{B}$, then $x \\notin A$ OR $x \\notin B$, meaning $x$ cannot be in both, so $x \\notin (A \\cap B)$.",
      "If $x \\notin (A \\cap B)$, then $x \\notin A$ AND $x \\notin B$, meaning $x \\in \\overline{A} \\cap \\overline{B}$.",
      "By applying the Distributive Law to the complement of the intersection.",
      "By applying the Domination Law to the universal set $U$."
    ],
    correctIndex: 0,
    explanation: "The reverse inclusion assumes $x$ is in the union of the complements. This means $x$ is missing from at least one of the sets, so it cannot be in their intersection."
  },
  {
    question: "Which of the following represents the Identity Law for union?",
    options: [
      "$A \\cup U = A$",
      "$A \\cup \\emptyset = A$",
      "$A \\cup A = A$",
      "$A \\cup \\overline{A} = A$"
    ],
    correctIndex: 1,
    explanation: "The Identity Law for union states that combining any set with the empty set retains the original set's identity: $A \\cup \\emptyset = A$."
  },
  {
    question: "The proof of De Morgan's on Set Difference, $A - (B \\cup C) = (A - B) \\cap (A - C)$, relies on applying De Morgan's Law to which specific term?",
    options: [
      "$A \\cap (B \\cup C)$",
      "$\\overline{(B \\cup C)}$",
      "$\\overline{A} \\cup (B \\cap C)$",
      "$(A \\cap \\overline{B}) \\cup C$"
    ],
    correctIndex: 1,
    explanation: "After converting the set difference to intersections with complements, De Morgan's Law is applied to the term $\\overline{(B \\cup C)}$ to split it into $\\overline{B} \\cap \\overline{C}$."
  }
];