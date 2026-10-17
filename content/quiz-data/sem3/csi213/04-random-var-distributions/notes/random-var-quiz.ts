export const quizData = [
  {
    question: "Which of the following correctly defines a Random Variable $X$ in formal mathematical terms?",
    options: [
      "A stochastic process that generates random numerical outcomes.",
      "A deterministic function that maps every outcome in the sample space $S$ to a real number in $\\mathbb{R}$.",
      "A variable whose value is determined by the flip of a fair coin.",
      "The probability measure assigned to a specific event in the sample space."
    ],
    correctIndex: 1,
    explanation: "A random variable is formally defined as a measurable function $X: S \\to \\mathbb{R}$ that maps sample points to real numbers."
  },
  {
    question: "In rigorous measure theory, what property must a random variable $X$ possess to ensure we can assign valid probabilities to events like $\\{X \\le x\\}$?",
    options: [
      "It must be a continuous function.",
      "It must be a measurable function with respect to the Borel $\\sigma$-algebra.",
      "It must be a bijective mapping.",
      "It must have a finite expected value."
    ],
    correctIndex: 1,
    explanation: "Measurability ensures that the pre-image of any Borel set in $\\mathbb{R}$ is an event in the sample space's $\\sigma$-algebra, allowing probability assignment."
  },
  {
    question: "What is the fundamental mathematical distinction between a discrete and a continuous random variable?",
    options: [
      "Discrete variables use integrals, while continuous variables use summations.",
      "The range of a discrete variable is countable, while the range of a continuous variable is an uncountable interval of real numbers.",
      "Discrete variables can take negative values, while continuous variables cannot.",
      "Continuous variables have a PMF, while discrete variables have a PDF."
    ],
    correctIndex: 1,
    explanation: "The defining characteristic is the cardinality of the range: countable (e.g., integers) for discrete, and uncountable (e.g., real intervals) for continuous."
  },
  {
    question: "Which of the following correctly defines the Probability Mass Function (PMF) of a discrete random variable $X$?",
    options: [
      "$p(x) = P(X \\le x)$",
      "$p(x) = \\int_{-\\infty}^{x} f(t) \\, dt$",
      "$p(x) = P(X = x)$",
      "$p(x) = \\frac{d}{dx} P(X \\le x)$"
    ],
    correctIndex: 2,
    explanation: "The PMF gives the exact probability that the discrete random variable $X$ takes on the specific value $x$."
  },
  {
    question: "Which of the following is NOT one of the three strict validity conditions for a function to be a valid PMF?",
    options: [
      "Non-negativity: $p(x) \\ge 0$ for all $x$.",
      "Normalization: $\\sum_{x} p(x) = 1$.",
      "Continuity: $p(x)$ must be a continuous function over $\\mathbb{R}$.",
      "Event Probability: $P(X \\in A) = \\sum_{x \\in A} p(x)$."
    ],
    correctIndex: 2,
    explanation: "A PMF is defined on a countable set and does not need to be continuous. The three conditions are non-negativity, normalization, and the event probability sum."
  },
  {
    question: "Which of the following correctly states the normalization condition for a Probability Density Function (PDF) $f(x)$?",
    options: [
      "$\\sum_{x} f(x) = 1$",
      "$\\int_{-\\infty}^{\\infty} f(x) \\, dx = 1$",
      "$f(x) \\le 1$ for all $x \\in \\mathbb{R}$",
      "$\\int_{-\\infty}^{\\infty} x f(x) \\, dx = 1$"
    ],
    correctIndex: 1,
    explanation: "For a continuous random variable, the total area under the PDF curve over the entire real line must equal exactly 1."
  },
  {
    question: "Why is the probability of a continuous random variable taking on any single exact value $a$ strictly zero ($P(X = a) = 0$)?",
    options: [
      "Because the PDF $f(a)$ is always equal to 0.",
      "Because the definite integral of any function from a point to itself ($\\int_{a}^{a} f(x) \\, dx$) is always 0.",
      "Because continuous variables can only take integer values.",
      "Because the CDF is undefined at single points."
    ],
    correctIndex: 1,
    explanation: "The probability is the area under the PDF curve. The area of a degenerate interval $[a, a]$ has a width of 0, making the integral exactly 0."
  },
  {
    question: "Which of the following correctly defines the Cumulative Distribution Function (CDF), denoted $F(x)$, for any random variable $X$?",
    options: [
      "$F(x) = P(X = x)$",
      "$F(x) = P(X \\ge x)$",
      "$F(x) = P(X < x)$",
      "$F(x) = P(X \\le x)$"
    ],
    correctIndex: 3,
    explanation: "The CDF is universally defined as the probability that the random variable $X$ takes on a value less than or equal to $x$."
  },
  {
    question: "Which of the following is one of the four fundamental properties that every valid CDF $F(x)$ must satisfy?",
    options: [
      "It must be strictly decreasing.",
      "It must be left-continuous everywhere.",
      "$\\lim_{x \\to -\\infty} F(x) = 0$.",
      "$\\lim_{x \\to \\infty} F(x) = 0$."
    ],
    correctIndex: 2,
    explanation: "The four properties are: non-decreasing, right-continuous, limit at $-\\infty$ is 0, and limit at $\\infty$ is 1."
  },
  {
    question: "What does the 'right-continuous' property of a CDF formally state?",
    options: [
      "$\\lim_{x \\to a^-} F(x) = F(a)$",
      "$\\lim_{x \\to a^+} F(x) = F(a)$",
      "$F(a) = F(-a)$",
      "$\\lim_{x \\to a} F(x)$ does not exist."
    ],
    correctIndex: 1,
    explanation: "Right-continuity means that as you approach a point $a$ from values greater than $a$, the limit of the CDF equals the CDF's value at $a$."
  },
  {
    question: "For a discrete random variable, how is the CDF $F(x)$ mathematically related to the PMF $p(x)$?",
    options: [
      "$F(x) = \\sum_{t \\le x} p(t)$",
      "$F(x) = \\frac{d}{dx} p(x)$",
      "$F(x) = p(x) - p(x-1)$",
      "$F(x) = \\int_{-\\infty}^{x} p(t) \\, dt$"
    ],
    correctIndex: 0,
    explanation: "For discrete variables, the CDF is the step function obtained by summing the PMF values for all outcomes less than or equal to $x$."
  },
  {
    question: "For a continuous random variable where the CDF $F(x)$ is differentiable, how is the PDF $f(x)$ mathematically related to $F(x)$?",
    options: [
      "$f(x) = \\int_{-\\infty}^{x} F(t) \\, dt$",
      "$f(x) = \\frac{d}{dx} F(x)$",
      "$f(x) = F(x) - F(x-1)$",
      "$f(x) = \\sum_{t \\le x} F(t)$"
    ],
    correctIndex: 1,
    explanation: "By the Fundamental Theorem of Calculus, the PDF is the first derivative of the CDF with respect to $x$."
  },
  {
    question: "If a function $f(x)$ satisfies $f(x) \\ge 0$ for all $x$, but $\\int_{-\\infty}^{\\infty} f(x) \\, dx = 2$, what must be done to make it a valid PDF?",
    options: [
      "Square the function: $(f(x))^2$.",
      "Multiply the function by $\\frac{1}{2}$.",
      "Add 1 to the function: $f(x) + 1$.",
      "It is already a valid PDF."
    ],
    correctIndex: 1,
    explanation: "To satisfy the normalization condition (integral equals 1), the entire function must be scaled by the reciprocal of its current total area."
  },
  {
    question: "What is the mathematical consequence of the CDF property $\\lim_{x \\to \\infty} F(x) = 1$?",
    options: [
      "The random variable can only take finite values.",
      "The probability that the random variable takes on some finite real value is certain (probability 1).",
      "The PDF must approach 1 as $x \\to \\infty$.",
      "The variance of the random variable is 1."
    ],
    correctIndex: 1,
    explanation: "As $x$ approaches infinity, the event $\\{X \\le x\\}$ approaches the entire sample space, which must have a probability of 1."
  },
  {
    question: "Which of the following statements about the relationship between PMF and PDF is strictly true?",
    options: [
      "A PDF can take values greater than 1, but a PMF cannot.",
      "A PMF can take values greater than 1, but a PDF cannot.",
      "Both PMF and PDF must always be $\\le 1$.",
      "Neither PMF nor PDF can exceed 1."
    ],
    correctIndex: 0,
    explanation: "A PDF represents density, not probability, so $f(x)$ can be $> 1$ as long as the total area is 1. A PMF represents actual probability, so $p(x) \\le 1$ always."
  }
];