export const quizData = [
  {
    question: "Which of the following correctly defines a Random Experiment in probability theory?",
    options: [
      "A process that yields a single, predictable outcome under varying conditions.",
      "A process that can be repeated under identical conditions, yielding a well-defined set of possible outcomes, but with an unpredictable single trial.",
      "A mathematical function that maps a sample space to the real number line.",
      "A sequence of events where the outcome of the first trial dictates the outcome of the second."
    ],
    correctIndex: 1,
    explanation: "A Random Experiment is defined by its repeatability under identical conditions, a well-defined set of outcomes, and the inherent unpredictability of any single trial."
  },
  {
    question: "What is the standard mathematical notation used to denote the Sample Space?",
    options: [
      "$\\Sigma$ or $\\Delta$",
      "$S$ or $\\Omega$",
      "$\\mathcal{P}$ or $\\emptyset$",
      "$\\mu$ or $\\sigma$"
    ],
    correctIndex: 1,
    explanation: "The sample space is universally denoted by the uppercase letter $S$ or the Greek capital letter Omega ($\\Omega$)."
  },
  {
    question: "In the context of a sample space, what is the formal definition of a 'sample point'?",
    options: [
      "A subset of the universal set.",
      "An individual, distinct outcome of a random experiment.",
      "The probability measure assigned to an event.",
      "The intersection of two mutually exclusive events."
    ],
    correctIndex: 1,
    explanation: "A sample point (or elementary event) is a single, indivisible outcome that makes up the elements of the sample space $S$."
  },
  {
    question: "Which of the following set-builder notations correctly represents a continuous sample space measuring the time until an event occurs?",
    options: [
      "$\\{t \\in \\mathbb{Z} \\mid t \\ge 0\\}$",
      "$\\{t \\in \\mathbb{R} \\mid t \\ge 0\\}$",
      "$\\{t \\in \\mathbb{N} \\mid t > 0\\}$",
      "$\\{t \\in \\mathbb{Q} \\mid 0 \\le t \\le 1\\}$"
    ],
    correctIndex: 1,
    explanation: "Time is a continuous variable, meaning it can take any real value ($\\mathbb{R}$) greater than or equal to zero."
  },
  {
    question: "How is an 'Event' formally defined in measure-theoretic probability?",
    options: [
      "A deterministic function mapping outcomes to real numbers.",
      "Any subset of the sample space $S$.",
      "The union of all possible sample points.",
      "A specific numerical probability assigned to an outcome."
    ],
    correctIndex: 1,
    explanation: "An event is formally defined as any subset of the sample space $S$. It is a collection of one or more sample points."
  },
  {
    question: "Under what strict mathematical condition is an event $A$ said to have 'occurred'?",
    options: [
      "When $A \\cap S = \\emptyset$.",
      "When the outcome of the experiment is an element of the subset $A$.",
      "When $P(A) = 0$.",
      "When $A$ is the empty set."
    ],
    correctIndex: 1,
    explanation: "An event $A$ occurs if and only if the realized sample point $\\omega$ from the experiment satisfies $\\omega \\in A$."
  },
  {
    question: "Which of the following defines the 'Certain Event'?",
    options: [
      "The empty set $\\emptyset$.",
      "The complement of the sample space $\\overline{S}$.",
      "The entire sample space $S$.",
      "The intersection of all events."
    ],
    correctIndex: 2,
    explanation: "The Certain Event is the event that is guaranteed to happen, which corresponds to the entire sample space $S$."
  },
  {
    question: "What is the formal mathematical representation of the 'Impossible Event'?",
    options: [
      "$S$",
      "$U$",
      "$\\emptyset$",
      "$\\Omega^c$"
    ],
    correctIndex: 2,
    explanation: "The Impossible Event is the event that contains no sample points, formally represented by the empty set $\\emptyset$."
  },
  {
    question: "What is the strict mathematical condition for two events $A$ and $B$ to be Mutually Exclusive?",
    options: [
      "$A \\cup B = S$",
      "$A \\cap B = \\emptyset$",
      "$P(A \\cap B) = 1$",
      "$A \\subseteq B$"
    ],
    correctIndex: 1,
    explanation: "Two events are mutually exclusive (or disjoint) if they share no common sample points, meaning their intersection is the empty set."
  },
  {
    question: "What is the logical interpretation of two events being Mutually Exclusive?",
    options: [
      "They must occur simultaneously.",
      "The occurrence of one guarantees the occurrence of the other.",
      "They cannot occur simultaneously.",
      "They are statistically independent."
    ],
    correctIndex: 2,
    explanation: "Because their intersection is empty, the occurrence of event $A$ strictly precludes the occurrence of event $B$ in the same trial."
  },
  {
    question: "What is the formal condition for a collection of $n$ events $A_1, A_2, \\dots, A_n$ to be pairwise mutually exclusive?",
    options: [
      "$A_i \\cap A_j = \\emptyset$ for all $i \\neq j$",
      "$\\bigcup_{i=1}^n A_i = S$",
      "$A_i \\cap A_j = S$ for all $i \\neq j$",
      "$P(A_i) = P(A_j)$ for all $i, j$"
    ],
    correctIndex: 0,
    explanation: "Pairwise mutual exclusivity requires that every possible pair of distinct events in the collection has an empty intersection."
  },
  {
    question: "If events $A$ and $B$ are NOT mutually exclusive, which of the following must be true?",
    options: [
      "$A \\cap B = \\emptyset$",
      "$A \\cap B \\neq \\emptyset$",
      "$A \\cup B = \\emptyset$",
      "$P(A \\cap B) = 0$"
    ],
    correctIndex: 1,
    explanation: "If they are not mutually exclusive, they must share at least one common sample point, meaning their intersection is not the empty set."
  },
  {
    question: "If an event $A$ is defined as a subset of a finite sample space $S$ ($A \\subseteq S$), what is the maximum possible cardinality of $A$?",
    options: [
      "$|S| - 1$",
      "$|S|$",
      "$2^{|S|}$",
      "$|S|!$"
    ],
    correctIndex: 1,
    explanation: "Because $A$ is a subset of $S$, the maximum number of elements it can contain is exactly the number of elements in $S$ (when $A = S$)."
  },
  {
    question: "Which mathematical symbol is universally used to denote the Impossible Event?",
    options: [
      "$\\emptyset$",
      "$\\infty$",
      "$\\mathbb{R}$",
      "$\\aleph_0$"
    ],
    correctIndex: 0,
    explanation: "The empty set symbol $\\emptyset$ (or $\\{\\}$) is the standard notation for the Impossible Event."
  },
  {
    question: "What does the set-builder notation $S = \\{t \\in \\mathbb{R} \\mid t \\ge 0\\}$ imply about the nature of the sample space?",
    options: [
      "It is a discrete, finite sample space.",
      "It is a continuous, uncountably infinite sample space.",
      "It is a discrete, countably infinite sample space.",
      "It is a mutually exclusive sample space."
    ],
    correctIndex: 1,
    explanation: "The use of the real numbers ($\\mathbb{R}$) indicates that the sample space is continuous and contains an uncountably infinite number of possible outcomes."
  }
];