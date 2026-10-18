export const quizData = [
  {
    question: "Which of the following correctly represents the set-builder notation for the complement of a set $A$ with respect to a universal set $U$?",
    options: [
      "$\\{x \\in U \\mid x \\notin A\\}$",
      "$\\{x \\in A \\mid x \\notin U\\}$",
      "$\\{x \\in U \\mid x \\in A\\}$",
      "$\\{x \\mid x \\notin A \\land x \\notin U\\}$"
    ],
    correctIndex: 0,
    explanation: "The complement of $A$ contains all elements that belong to the universal set $U$ but do not belong to $A$, formally written as $\\{x \\in U \\mid x \\notin A\\}$."
  },
  {
    question: "According to the formal logical definition of the empty set, which of the following expressions is equivalent to $\\emptyset$?",
    options: [
      "$\\{x \\mid x = x\\}$",
      "$\\{x \\mid x \\neq x\\}$",
      "$\\{x \\in U \\mid x \\in A\\}$",
      "$\\{x \\mid x \\subseteq A\\}$"
    ],
    correctIndex: 1,
    explanation: "The empty set is formally defined using a logically impossible condition: $\\{x \\mid x \\neq x\\}$, meaning no element can satisfy the condition to be in the set."
  },
  {
    question: "If a finite set $A$ has a cardinality of $|A| = n$, what is the formal mathematical relationship that defines the cardinality of its power set $\\mathcal{P}(A)$?",
    options: [
      "$|\\mathcal{P}(A)| = n^2$",
      "$|\\mathcal{P}(A)| = 2n$",
      "$|\\mathcal{P}(A)| = 2^n$",
      "$|\\mathcal{P}(A)| = n!$"
    ],
    correctIndex: 2,
    explanation: "The power set contains all possible subsets of $A$. For each of the $n$ elements, there are 2 choices (include or exclude), resulting in $2^n$ total subsets."
  },
  {
    question: "The theorem of Subset Equivalence states that $A \\subset B$ if and only if which of the following set operations holds true?",
    options: [
      "$A \\cup B = \\emptyset$",
      "$A = A \\cap B$",
      "$A \\cap B = U$",
      "$A = A \\cup B$"
    ],
    correctIndex: 1,
    explanation: "If $A$ is a subset of $B$, adding no new elements outside of $B$, then the intersection of $A$ and $B$ is exactly $A$ itself ($A = A \\cap B$)."
  },
  {
    question: "Which of the following correctly defines the set difference $A - B$ using formal set-builder notation?",
    options: [
      "$\\{x \\mid x \\in A \\lor x \\notin B\\}$",
      "$\\{x \\mid x \\notin A \\land x \\in B\\}$",
      "$\\{x \\mid x \\in A \\land x \\notin B\\}$",
      "$\\{x \\mid x \\in A \\land x \\in B\\}$"
    ],
    correctIndex: 2,
    explanation: "Set difference $A - B$ includes elements that are strictly in $A$ AND not in $B$, which is logically expressed as $\\{x \\mid x \\in A \\land x \\notin B\\}$."
  },
  {
    question: "In the context of set theory, which of the following statements about the empty set $\\emptyset$ is universally true for any arbitrary set $A$?",
    options: [
      "$\\emptyset \\in A$",
      "$A \\subset \\emptyset$",
      "$\\emptyset \\subseteq A$",
      "$\\emptyset \\cap A = U$"
    ],
    correctIndex: 2,
    explanation: "The empty set is a subset of every set. Therefore, $\\emptyset \\subseteq A$ is a universally true property in set theory."
  },
  {
    question: "Which of the following represents the formal set-builder definition of the intersection of two sets $A$ and $B$?",
    options: [
      "$\\{x \\mid x \\in A \\lor x \\in B\\}$",
      "$\\{x \\mid x \\in A \\land x \\in B\\}$",
      "$\\{x \\in A \\mid x \\notin B\\}$",
      "$\\{x \\mid x \\notin A \\lor x \\notin B\\}$"
    ],
    correctIndex: 1,
    explanation: "The intersection of $A$ and $B$ contains elements that are in $A$ AND in $B$, formally written using the logical conjunction $\\land$."
  },
  {
    question: "If a set $A$ is a subset of $B$ ($A \\subseteq B$), which of the following set operations will yield the set $A$ as the result?",
    options: [
      "$A \\cup B$",
      "$B - A$",
      "$A \\cap B$",
      "$\\overline{A} \\cap B$"
    ],
    correctIndex: 2,
    explanation: "Because all elements of $A$ are already inside $B$, intersecting $A$ with $B$ simply returns $A$. This is the basis of the Subset Equivalence theorem."
  },
  {
    question: "What is the defining characteristic of the elements within a set, as per the foundational definition of sets?",
    options: [
      "They must be ordered sequentially.",
      "They must be distinguishable.",
      "They must be numerical values.",
      "They must be finite in quantity."
    ],
    correctIndex: 1,
    explanation: "A set is defined as a collection of distinguishable objects. The order of elements does not matter, and they do not need to be numerical."
  },
  {
    question: "Which of the following mathematical notations correctly denotes that an element $x$ is NOT a member of set $A$?",
    options: [
      "$x \\notin A$",
      "$x \\subset A$",
      "$x \\neq A$",
      "$x \\cap A = \\emptyset$"
    ],
    correctIndex: 0,
    explanation: "The symbol $\\notin$ is the standard mathematical notation used to denote that an element is not a member of a specific set."
  },
  {
    question: "The power set $\\mathcal{P}(A)$ is formally defined as the set of all subsets of $A$. Which of the following set-builder notations correctly represents this?",
    options: [
      "$\\{X \\mid X \\subseteq A\\}$",
      "$\\{X \\mid X \\subset A\\}$",
      "$\\{x \\in A \\mid X \\subseteq A\\}$",
      "$\\{X \\in A \\mid X \\subseteq \\mathcal{P}(A)\\}$"
    ],
    correctIndex: 0,
    explanation: "The power set is the set of all sets $X$ such that $X$ is a subset of $A$, which is written as $\\{X \\mid X \\subseteq A\\}$."
  },
  {
    question: "When evaluating the union of any set $A$ with the empty set $\\emptyset$, the result is governed by which fundamental identity property?",
    options: [
      "$A \\cup \\emptyset = U$",
      "$A \\cup \\emptyset = A$",
      "$A \\cup \\emptyset = \\emptyset$",
      "$A \\cup \\emptyset = \\overline{A}$"
    ],
    correctIndex: 1,
    explanation: "The Identity Law for union states that combining any set with the empty set retains the original set's identity: $A \\cup \\emptyset = A$."
  },
  {
    question: "Which of the following correctly expresses the union of sets $A$ and $B$ in formal set-builder notation?",
    options: [
      "$\\{x \\mid x \\in A \\land x \\in B\\}$",
      "$\\{x \\mid x \\in A \\lor x \\in B\\}$",
      "$\\{x \\in A \\mid x \\notin B\\}$",
      "$\\{x \\mid x \\notin A \\land x \\notin B\\}$"
    ],
    correctIndex: 1,
    explanation: "The union of $A$ and $B$ contains elements that are in $A$ OR in $B$ (or both), formally written using the logical disjunction $\\lor$."
  },
  {
    question: "In the proof of subset equivalence, if $A \\subseteq B$, what is the result of the intersection $A \\cap B$?",
    options: [
      "$B$",
      "$U$",
      "$A$",
      "$\\emptyset$"
    ],
    correctIndex: 2,
    explanation: "If $A$ is a subset of $B$, all elements of $A$ are in $B$. Therefore, the elements common to both (the intersection) are exactly the elements of $A$."
  },
  {
    question: "Which of the following statements accurately describes the elements of the power set $\\mathcal{P}(A)$?",
    options: [
      "The elements are strictly the individual members of $A$.",
      "The elements are subsets of $A$.",
      "The elements are the complements of $A$.",
      "The elements are the intersections of $A$ with $U$."
    ],
    correctIndex: 1,
    explanation: "The power set is a 'set of sets'. Its individual elements are not the raw members of $A$, but rather the subsets of $A$ (including $\\emptyset$ and $A$ itself)."
  }
];