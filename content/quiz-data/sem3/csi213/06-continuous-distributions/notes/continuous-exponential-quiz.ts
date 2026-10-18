export const quizData = [
  {
    question: "Which of the following correctly defines the Probability Density Function (PDF) of a Continuous Uniform random variable $X \\sim U(a, b)$?",
    options: [
      "$f(x) = \\frac{1}{b-a}$ for $a \\le x \\le b$, and $0$ otherwise",
      "$f(x) = \\frac{x-a}{b-a}$ for $a \\le x \\le b$, and $0$ otherwise",
      "$f(x) = \\frac{1}{b-a}$ for $a < x < b$, and $1$ otherwise",
      "$f(x) = e^{-(x-a)/(b-a)}$ for $x \\ge a$"
    ],
    correctIndex: 0,
    explanation: "The Uniform PDF is constant over the interval $[a, b]$ with a height of $\\frac{1}{b-a}$ to ensure the total area under the curve equals 1."
  },
  {
    question: "What is the formal mathematical expression for the Cumulative Distribution Function (CDF) of $X \\sim U(a, b)$ for $a \\le x \\le b$?",
    options: [
      "$F(x) = \\frac{1}{b-a}$",
      "$F(x) = \\frac{x-a}{b-a}$",
      "$F(x) = 1 - \\frac{x-a}{b-a}$",
      "$F(x) = \\frac{b-x}{b-a}$"
    ],
    correctIndex: 1,
    explanation: "The CDF is the integral of the PDF from $a$ to $x$, which evaluates to $\\frac{x-a}{b-a}$."
  },
  {
    question: "What are the exact theoretical moments (Expectation and Variance) of a Continuous Uniform random variable $X \\sim U(a, b)$?",
    options: [
      "$E[X] = \\frac{a+b}{2}$ and $V[X] = \\frac{(b-a)^2}{12}$",
      "$E[X] = \\frac{b-a}{2}$ and $V[X] = \\frac{(b-a)^2}{12}$",
      "$E[X] = \\frac{a+b}{2}$ and $V[X] = \\frac{(b-a)^2}{6}$",
      "$E[X] = b-a$ and $V[X] = \\frac{(b-a)^2}{12}$"
    ],
    correctIndex: 0,
    explanation: "The mean is the midpoint of the interval, and the variance is proportional to the square of the interval's width, scaled by $1/12$."
  },
  {
    question: "Which of the following correctly defines the Probability Density Function (PDF) of an Exponential random variable $X \\sim \\text{Exp}(\\lambda)$?",
    options: [
      "$f(x) = \\lambda e^{-\\lambda x}$ for $x \\ge 0$, and $0$ for $x < 0$",
      "$f(x) = e^{-\\lambda x}$ for $x \\ge 0$, and $0$ for $x < 0$",
      "$f(x) = \\lambda e^{-\\lambda x}$ for all $x \\in \\mathbb{R}$",
      "$f(x) = \\frac{1}{\\lambda} e^{-x/\\lambda}$ for $x \\ge 0$"
    ],
    correctIndex: 0,
    explanation: "The Exponential PDF is defined for non-negative real numbers with the rate parameter $\\lambda$ scaling the exponential decay."
  },
  {
    question: "What is the formal mathematical expression for the Cumulative Distribution Function (CDF) of $X \\sim \\text{Exp}(\\lambda)$ for $x \\ge 0$?",
    options: [
      "$F(x) = e^{-\\lambda x}$",
      "$F(x) = 1 - e^{-\\lambda x}$",
      "$F(x) = \\lambda e^{-\\lambda x}$",
      "$F(x) = 1 - \\lambda e^{-\\lambda x}$"
    ],
    correctIndex: 1,
    explanation: "The CDF is the integral of the PDF from $0$ to $x$, which evaluates to $1 - e^{-\\lambda x}$."
  },
  {
    question: "What are the exact theoretical moments (Expectation and Variance) of an Exponential random variable $X \\sim \\text{Exp}(\\lambda)$?",
    options: [
      "$E[X] = \\lambda$ and $V[X] = \\lambda^2$",
      "$E[X] = \\frac{1}{\\lambda}$ and $V[X] = \\frac{1}{\\lambda^2}$",
      "$E[X] = \\frac{1}{\\lambda}$ and $V[X] = \\frac{1}{\\lambda}$",
      "$E[X] = \\lambda$ and $V[X] = \\frac{1}{\\lambda^2}$"
    ],
    correctIndex: 1,
    explanation: "The mean is the reciprocal of the rate parameter, and the variance is the square of the mean."
  },
  {
    question: "Which of the following correctly states the Memoryless Property of the Exponential distribution?",
    options: [
      "$P(X > s + t \\mid X > s) = P(X > s)$",
      "$P(X > s + t \\mid X > s) = P(X > t)$",
      "$P(X < s + t \\mid X < s) = P(X < t)$",
      "$P(X > s + t) = P(X > s) + P(X > t)$"
    ],
    correctIndex: 1,
    explanation: "The memoryless property states that the conditional probability of surviving an additional time $t$, given survival up to time $s$, is equal to the unconditional probability of surviving time $t$."
  },
  {
    question: "In the formal proof of the Memoryless Property, what is the first step after writing the conditional probability definition?",
    options: [
      "Substitute the PDF $f(x) = \\lambda e^{-\\lambda x}$.",
      "Simplify the intersection $\\{X > s + t\\} \\cap \\{X > s\\}$ to $\\{X > s + t\\}$.",
      "Apply the Law of Total Probability.",
      "Differentiate the survival function."
    ],
    correctIndex: 1,
    explanation: "Since $t \\ge 0$, the event $\\{X > s + t\\}$ is a subset of $\\{X > s\\}$, so their intersection is simply the more restrictive event $\\{X > s + t\\}$."
  },
  {
    question: "In the same proof, what expression is substituted for $P(X > x)$ in the numerator and denominator?",
    options: [
      "$1 - \\lambda e^{-\\lambda x}$",
      "$e^{-\\lambda x}$",
      "$\\lambda e^{-\\lambda x}$",
      "$1 - e^{-\\lambda x}$"
    ],
    correctIndex: 1,
    explanation: "The survival function $P(X > x)$ is $1 - F(x)$, which for the Exponential distribution is exactly $e^{-\\lambda x}$."
  },
  {
    question: "What is the unique mathematical distinction of the Exponential distribution regarding the memoryless property?",
    options: [
      "It is the only discrete distribution with this property.",
      "It is the only continuous distribution with this property.",
      "It shares this property with the Normal distribution.",
      "It shares this property with the Uniform distribution."
    ],
    correctIndex: 1,
    explanation: "The Exponential distribution is the unique continuous probability distribution that satisfies the memoryless property (the Geometric distribution is the unique discrete one)."
  },
  {
    question: "In the context of stochastic processes, what does the Exponential distribution fundamentally model?",
    options: [
      "The number of events in a fixed time interval.",
      "The time between consecutive events in a Poisson process.",
      "The proportion of successes in a finite population.",
      "The sum of independent Normal random variables."
    ],
    correctIndex: 1,
    explanation: "The Exponential distribution models the waiting time or inter-arrival time between events in a homogeneous Poisson process."
  },
  {
    question: "If $X \\sim \\text{Exp}(\\lambda)$, what is the exact value of the survival function $P(X > x)$?",
    options: [
      "$1 - e^{-\\lambda x}$",
      "$e^{-\\lambda x}$",
      "$\\lambda e^{-\\lambda x}$",
      "$1 - \\lambda x$"
    ],
    correctIndex: 1,
    explanation: "The survival function is the complement of the CDF: $1 - (1 - e^{-\\lambda x}) = e^{-\\lambda x}$."
  },
  {
    question: "What is the mathematical relationship between the rate parameter $\\lambda$ and the scale parameter $\\theta$ in the Exponential distribution?",
    options: [
      "$\\theta = \\lambda$",
      "$\\theta = \\lambda^2$",
      "$\\theta = \\frac{1}{\\lambda}$",
      "$\\theta = \\sqrt{\\lambda}$"
    ],
    correctIndex: 2,
    explanation: "The scale parameter $\\theta$ is the mean of the distribution, which is the reciprocal of the rate parameter $\\lambda$."
  },
  {
    question: "For a Continuous Uniform distribution $U(a, b)$, what happens to the variance as the interval width $(b-a)$ increases?",
    options: [
      "It decreases linearly.",
      "It remains constant.",
      "It increases quadratically.",
      "It approaches zero."
    ],
    correctIndex: 2,
    explanation: "Since $V[X] = \\frac{(b-a)^2}{12}$, the variance is proportional to the square of the interval width, meaning it increases quadratically."
  },
  {
    question: "Which of the following represents the normalization condition for the Exponential PDF?",
    options: [
      "$\\int_{0}^{\\infty} \\lambda e^{-\\lambda x} \\, dx = 1$",
      "$\\int_{-\\infty}^{\\infty} \\lambda e^{-\\lambda x} \\, dx = 1$",
      "$\\sum_{x=0}^{\\infty} \\lambda e^{-\\lambda x} = 1$",
      "$\\int_{0}^{\\infty} e^{-\\lambda x} \\, dx = 1$"
    ],
    correctIndex: 0,
    explanation: "The total area under the PDF curve over its entire support $[0, \\infty)$ must equal exactly 1."
  }
];