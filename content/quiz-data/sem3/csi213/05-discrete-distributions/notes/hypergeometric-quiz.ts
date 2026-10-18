export const quizData = [
  {
    question: "What is the fundamental sampling condition that distinguishes the Hypergeometric distribution from the Binomial distribution?",
    options: [
      "Sampling is done with replacement from an infinite population.",
      "Sampling is done without replacement from a finite population.",
      "The trials are continuous rather than discrete.",
      "The probability of success changes randomly according to a Normal distribution."
    ],
    correctIndex: 1,
    explanation: "The Hypergeometric distribution specifically models scenarios where items are drawn without replacement, making successive trials dependent."
  },
  {
    question: "What are the three formal parameters that define a Hypergeometric distribution $X \\sim \\text{Hypergeometric}(N, K, n)$?",
    options: [
      "$n$ (number of trials), $p$ (probability of success), $q$ (probability of failure)",
      "$N$ (population size), $K$ (total successes in population), $n$ (sample size)",
      "$\\lambda$ (rate), $x$ (observed count), $t$ (time interval)",
      "$\\mu$ (mean), $\\sigma^2$ (variance), $n$ (sample size)"
    ],
    correctIndex: 1,
    explanation: "The distribution is defined by the total population size $N$, the number of success states $K$ within that population, and the number of draws $n$."
  },
  {
    question: "Which of the following correctly defines the PMF of a Hypergeometric random variable?",
    options: [
      "$p(x) = \\binom{n}{x} \\left(\\frac{K}{N}\\right)^x \\left(1 - \\frac{K}{N}\\right)^{n-x}$",
      "$p(x) = \\frac{\\binom{K}{x} \\binom{N-K}{n-x}}{\\binom{N}{n}}$",
      "$p(x) = \\frac{\\binom{N}{x} \\binom{K}{n-x}}{\\binom{N-K}{n}}$",
      "$p(x) = \\frac{\\binom{K}{x} \\binom{N-K}{x}}{\\binom{N}{n}}$"
    ],
    correctIndex: 1,
    explanation: "The PMF is the ratio of the number of ways to choose $x$ successes and $n-x$ failures, divided by the total number of ways to choose $n$ items from $N$."
  },
  {
    question: "What is the formal support (valid range of $x$) for a Hypergeometric random variable?",
    options: [
      "$x \\in \\{0, 1, 2, \\dots, n\\}$",
      "$\\max(0, n - (N - K)) \\le x \\le \\min(n, K)$",
      "$0 \\le x \\le N$",
      "$x \\in \\{1, 2, \\dots, K\\}$"
    ],
    correctIndex: 1,
    explanation: "The lower bound ensures we don't demand more successes than available or force more failures than available. The upper bound caps $x$ at the sample size $n$ or total successes $K$, whichever is smaller."
  },
  {
    question: "In the combinatorial derivation of the Hypergeometric PMF, what does the denominator $\\binom{N}{n}$ represent?",
    options: [
      "The number of ways to choose $x$ successes from $K$.",
      "The number of ways to choose $n-x$ failures from $N-K$.",
      "The total number of equally likely ways to choose a sample of size $n$ from the population $N$.",
      "The probability of success on the first draw."
    ],
    correctIndex: 2,
    explanation: "The denominator represents the cardinality of the entire sample space of all possible samples of size $n$ drawn from $N$."
  },
  {
    question: "In the same derivation, what does the numerator term $\\binom{K}{x}$ represent?",
    options: [
      "The number of ways to choose $x$ successes from the $K$ available successes in the population.",
      "The number of ways to choose $n-x$ failures from the $N-K$ available failures.",
      "The total number of successes in the population.",
      "The probability of drawing a success."
    ],
    correctIndex: 0,
    explanation: "This term counts the specific combinations of successfully drawing exactly $x$ items from the $K$ success states available."
  },
  {
    question: "What is the formula for the Expectation $E[X]$ of a Hypergeometric random variable, where $p = \\frac{K}{N}$?",
    options: [
      "$E[X] = np(1-p)$",
      "$E[X] = np$",
      "$E[X] = \\frac{np}{N-1}$",
      "$E[X] = \\lambda$"
    ],
    correctIndex: 1,
    explanation: "Despite the dependence between draws, the linearity of expectation ensures that the expected number of successes is still the sample size $n$ multiplied by the proportion of successes $p$."
  },
  {
    question: "What does the variable $p$ represent in the context of the Hypergeometric expectation and variance formulas?",
    options: [
      "The probability of success on the first draw only.",
      "The proportion of successes in the total population ($p = \\frac{K}{N}$).",
      "The probability of drawing a failure.",
      "The sample proportion of successes ($p = \\frac{x}{n}$)."
    ],
    correctIndex: 1,
    explanation: "$p$ is defined as the initial proportion of success states in the entire population, $K/N$."
  },
  {
    question: "Which of the following correctly states the Variance $V[X]$ of a Hypergeometric random variable?",
    options: [
      "$V[X] = np(1-p)$",
      "$V[X] = np(1-p) \\left( \\frac{N-n}{N-1} \\right)$",
      "$V[X] = np(1-p) \\left( \\frac{N-1}{N-n} \\right)$",
      "$V[X] = np(1-p) \\left( \\frac{n}{N} \\right)$"
    ],
    correctIndex: 1,
    explanation: "The variance is the Binomial variance $np(1-p)$ multiplied by the Finite Population Correction (FPC) factor."
  },
  {
    question: "What is the formal name of the multiplicative factor $\\left( \\frac{N-n}{N-1} \\right)$ in the Hypergeometric variance formula?",
    options: [
      "The Continuity Correction Factor",
      "The Finite Population Correction (FPC) Factor",
      "The Degrees of Freedom Factor",
      "The Normalization Constant"
    ],
    correctIndex: 1,
    explanation: "It is called the Finite Population Correction (FPC) factor because it adjusts the variance to account for the finite size of the population being sampled."
  },
  {
    question: "What is the theoretical intuition behind why the FPC factor reduces the variance compared to the Binomial distribution?",
    options: [
      "Sampling without replacement provides more information about the remaining population, thereby reducing uncertainty.",
      "Sampling without replacement increases the probability of extreme outcomes.",
      "The sample size $n$ is always larger than the population size $N$.",
      "The trials become more independent as the sample size grows."
    ],
    correctIndex: 0,
    explanation: "When you remove an item and do not replace it, the composition of the remaining population is known with greater certainty, which inherently reduces the variance of subsequent draws."
  },
  {
    question: "What is the exact value of the FPC factor $\\left( \\frac{N-n}{N-1} \\right)$ when the sample size equals the population size ($n = N$)?",
    options: [
      "$1$",
      "$0$",
      "$\\infty$",
      "$\\frac{1}{N}$"
    ],
    correctIndex: 1,
    explanation: "Substituting $n = N$ yields $\\frac{N-N}{N-1} = \\frac{0}{N-1} = 0$."
  },
  {
    question: "What is the mathematical consequence for the Variance $V[X]$ when $n = N$ in a Hypergeometric distribution?",
    options: [
      "$V[X]$ is maximized.",
      "$V[X] = np(1-p)$",
      "$V[X] = 0$",
      "$V[X]$ becomes undefined."
    ],
    correctIndex: 2,
    explanation: "If you sample the entire population, there is no uncertainty about the number of successes you will find. The outcome is deterministic, so the variance is exactly 0."
  },
  {
    question: "What is the limiting behavior of the Hypergeometric distribution as the population size $N \\to \\infty$ while the proportion $p = \\frac{K}{N}$ remains constant?",
    options: [
      "It converges to the Poisson distribution.",
      "It converges to the Normal distribution.",
      "It converges to the Binomial distribution.",
      "It converges to the Uniform distribution."
    ],
    correctIndex: 2,
    explanation: "As $N \\to \\infty$, the FPC factor $\\frac{N-n}{N-1} \\to 1$. Sampling without replacement from an infinite population becomes mathematically indistinguishable from sampling with replacement."
  },
  {
    question: "In the limit as $N \\to \\infty$, what happens to the dependence between successive draws in a Hypergeometric model?",
    options: [
      "The dependence becomes strictly positive.",
      "The dependence becomes strictly negative.",
      "The draws become effectively independent.",
      "The dependence oscillates."
    ],
    correctIndex: 2,
    explanation: "Removing a single item from an infinitely large population has a negligible effect on the proportion of remaining successes, rendering the trials effectively independent, which is the defining condition of the Binomial distribution."
  }
];