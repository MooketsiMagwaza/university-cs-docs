export const quizData = [
  {
    question: "Which of the following correctly defines the Probability Mass Function (PMF) of a Bernoulli random variable $X \\sim \\text{Bern}(p)$?",
    options: [
      "$p(x) = p^x (1-p)^{1-x}$ for $x \\in \\{0, 1\\}$",
      "$p(x) = \\binom{n}{x} p^x (1-p)^{n-x}$ for $x \\in \\{0, 1, \\dots, n\\}$",
      "$p(x) = \\frac{e^{-\\lambda} \\lambda^x}{x!}$ for $x \\in \\{0, 1, 2, \\dots\\}$",
      "$p(x) = p(1-p)^x$ for $x \\in \\{0, 1, 2, \\dots\\}$"
    ],
    correctIndex: 0,
    explanation: "The Bernoulli PMF assigns probability $p$ to success ($x=1$) and $1-p$ to failure ($x=0$), compactly written as $p^x (1-p)^{1-x}$."
  },
  {
    question: "What are the exact theoretical moments (Expectation and Variance) of a Bernoulli random variable $X \\sim \\text{Bern}(p)$?",
    options: [
      "$E[X] = p$ and $V[X] = p^2$",
      "$E[X] = 1-p$ and $V[X] = p(1-p)$",
      "$E[X] = p$ and $V[X] = p(1-p)$",
      "$E[X] = np$ and $V[X] = np(1-p)$"
    ],
    correctIndex: 2,
    explanation: "For a single Bernoulli trial, the mean is the probability of success $p$, and the variance is $p(1-p)$."
  },
  {
    question: "Which of the following correctly defines the PMF of a Binomial random variable $X \\sim \\text{Bin}(n, p)$?",
    options: [
      "$p(x) = p^x (1-p)^{n-x}$",
      "$p(x) = \\binom{n}{x} p^x (1-p)^{n-x}$ for $x = 0, 1, \\dots, n$",
      "$p(x) = \\frac{n!}{x!(n-x)!} p^n (1-p)^x$",
      "$p(x) = \\binom{n}{x} p^{n-x} (1-p)^x$ for $x = 0, 1, \\dots, n$"
    ],
    correctIndex: 1,
    explanation: "The Binomial PMF calculates the probability of exactly $x$ successes in $n$ trials using the combination formula $\\binom{n}{x}$."
  },
  {
    question: "In the formal proof that the Binomial PMF sums to 1, which mathematical theorem is invoked?",
    options: [
      "The Maclaurin Series Theorem",
      "The Law of Total Probability",
      "The Binomial Theorem",
      "The Fundamental Theorem of Calculus"
    ],
    correctIndex: 2,
    explanation: "The proof relies on the Binomial Theorem: $(a + b)^n = \\sum_{x=0}^n \\binom{n}{x} a^x b^{n-x}$."
  },
  {
    question: "In the Binomial PMF normalization proof, what specific substitutions are made for $a$ and $b$ in the Binomial Theorem?",
    options: [
      "$a = 1$ and $b = p$",
      "$a = p$ and $b = 1-p$",
      "$a = p$ and $b = q^2$",
      "$a = 1-p$ and $b = p$"
    ],
    correctIndex: 1,
    explanation: "Substituting $a = p$ and $b = 1-p$ yields $(p + (1-p))^n = 1^n = 1$, proving the PMF sums to 1."
  },
  {
    question: "What is the formal derivation insight for the Expectation of a Binomial random variable $E[X] = np$?",
    options: [
      "It is derived by directly evaluating the summation $\\sum x \\binom{n}{x} p^x (1-p)^{n-x}$.",
      "It is derived by expressing $X$ as the sum of $n$ independent Bernoulli random variables and applying Linearity of Expectation.",
      "It is derived using the second factorial moment.",
      "It is derived using the Moment Generating Function."
    ],
    correctIndex: 1,
    explanation: "Since $X = \\sum_{i=1}^n X_i$ where $X_i \\sim \\text{Bern}(p)$, Linearity of Expectation gives $E[X] = \\sum E[X_i] = np$."
  },
  {
    question: "What is the formal derivation insight for the Variance of a Binomial random variable $V[X] = np(1-p)$?",
    options: [
      "It is derived by directly evaluating $E[X^2] - (E[X])^2$.",
      "Because the $n$ Bernoulli trials are independent, their variances simply add: $V[X] = \\sum V[X_i] = np(1-p)$.",
      "It is derived using the Law of Total Variance.",
      "It is derived by differentiating the Moment Generating Function twice."
    ],
    correctIndex: 1,
    explanation: "Independence allows the variance of the sum to equal the sum of the variances: $V[\\sum X_i] = \\sum V[X_i] = n \\cdot p(1-p)$."
  },
  {
    question: "What are the strict mathematical conditions required for a random variable to follow a Binomial distribution?",
    options: [
      "The trials must be dependent, but the probability of success must remain constant.",
      "The trials must be independent, and the probability of success must be identical for each trial.",
      "The trials must be sampled without replacement from a finite population.",
      "The number of trials must be a continuous random variable."
    ],
    correctIndex: 1,
    explanation: "The Binomial model strictly requires independent trials with a constant probability of success $p$."
  },
  {
    question: "What is the exact support (set of possible values) for a Binomial random variable $X \\sim \\text{Bin}(n, p)$?",
    options: [
      "$x \\in \\{1, 2, \\dots, n\\}$",
      "$x \\in \\{0, 1, 2, \\dots\\}$",
      "$x \\in \\{0, 1, 2, \\dots, n\\}$",
      "$x \\in \\mathbb{R}$"
    ],
    correctIndex: 2,
    explanation: "The number of successes can range from 0 (no successes) to $n$ (all successes), inclusive."
  },
  {
    question: "What is the exact support for a Bernoulli random variable $X \\sim \\text{Bern}(p)$?",
    options: [
      "$x \\in \\{0, 1\\}$",
      "$x \\in \\{1, 2, \\dots, n\\}$",
      "$x \\in \\{0, 1, 2, \\dots\\}$",
      "$x \\in [0, 1]$"
    ],
    correctIndex: 0,
    explanation: "A Bernoulli trial has exactly two possible outcomes: failure (0) and success (1)."
  },
  {
    question: "For a Binomial distribution, at what value of $p$ is the variance $V[X] = np(1-p)$ maximized?",
    options: [
      "$p = 0$",
      "$p = 1$",
      "$p = 0.5$",
      "$p = 1/n$"
    ],
    correctIndex: 2,
    explanation: "The quadratic function $p(1-p)$ is a downward-opening parabola with its vertex (maximum) at $p = 0.5$."
  },
  {
    question: "What is the mathematical relationship between the Bernoulli and Binomial distributions?",
    options: [
      "The Bernoulli distribution is the limit of the Binomial distribution as $n \\to \\infty$.",
      "A Binomial random variable is the sum of $n$ independent and identically distributed Bernoulli random variables.",
      "The Bernoulli distribution is the continuous analog of the Binomial distribution.",
      "They are mathematically unrelated."
    ],
    correctIndex: 1,
    explanation: "The Binomial distribution generalizes the Bernoulli distribution to $n$ trials. A single Bernoulli trial is simply a Binomial distribution with $n=1$."
  },
  {
    question: "If $X \\sim \\text{Bin}(n, p)$, what is the value of $E[X^2]$ expressed in terms of $n$ and $p$?",
    options: [
      "$np(1-p)$",
      "$n^2 p^2$",
      "$np(1-p) + n^2 p^2$",
      "$np + n^2 p^2$"
    ],
    correctIndex: 2,
    explanation: "Using the computational variance formula $V[X] = E[X^2] - (E[X])^2$, we rearrange to get $E[X^2] = V[X] + (E[X])^2 = np(1-p) + (np)^2$."
  },
  {
    question: "In the compact form of the Bernoulli PMF, $p(x) = p^x (1-p)^{1-x}$, what is the value of $p(x)$ when $x = 0$?",
    options: [
      "$0$",
      "$1-p$",
      "$p$",
      "$1$"
    ],
    correctIndex: 1,
    explanation: "Substituting $x=0$ yields $p^0 (1-p)^{1-0} = 1 \\cdot (1-p)^1 = 1-p$, which is the probability of failure."
  },
  {
    question: "Which of the following represents the normalization condition for the Binomial PMF?",
    options: [
      "$\\sum_{x=0}^n \\binom{n}{x} p^x (1-p)^{n-x} = 1$",
      "$\\sum_{x=0}^\\infty \\binom{n}{x} p^x (1-p)^{n-x} = 1$",
      "$\\int_{0}^n \\binom{n}{x} p^x (1-p)^{n-x} \\, dx = 1$",
      "$\\sum_{x=1}^n \\binom{n}{x} p^x (1-p)^{n-x} = 1$"
    ],
    correctIndex: 0,
    explanation: "The sum of the probabilities over the entire discrete support $x \\in \\{0, 1, \\dots, n\\}$ must equal exactly 1."
  }
];