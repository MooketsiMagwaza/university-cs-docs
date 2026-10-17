export const quizData = [
  {
    question: "Which of the following correctly defines the Probability Mass Function (PMF) of a Poisson random variable $X \\sim \\text{Poi}(\\lambda)$?",
    options: [
      "$p(x) = \\frac{\\lambda^x e^{-\\lambda}}{x!}$ for $x = 0, 1, 2, \\dots$",
      "$p(x) = \\frac{\\lambda^x e^{-\\lambda}}{x!}$ for $x = 1, 2, 3, \\dots$",
      "$p(x) = \\binom{n}{x} \\lambda^x (1-\\lambda)^{n-x}$ for $x = 0, 1, \\dots, n$",
      "$p(x) = \\lambda e^{-\\lambda x}$ for $x \\ge 0$"
    ],
    correctIndex: 0,
    explanation: "The Poisson PMF is defined for non-negative integers $x \\in \\{0, 1, 2, \\dots\\}$ with the formula $\\frac{\\lambda^x e^{-\\lambda}}{x!}$."
  },
  {
    question: "What is the strict mathematical condition on the parameter $\\lambda$ in a Poisson distribution?",
    options: [
      "$\\lambda \\ge 0$",
      "$\\lambda > 0$",
      "$0 \\le \\lambda \\le 1$",
      "$\\lambda \\in \\mathbb{Z}$"
    ],
    correctIndex: 1,
    explanation: "The rate parameter $\\lambda$ represents the average number of occurrences and must be strictly positive ($\\lambda > 0$)."
  },
  {
    question: "In the formal proof of the Poisson expectation $E[X] = \\lambda$, what is the first algebraic step taken after writing out the summation?",
    options: [
      "Apply the Maclaurin series for $e^\\lambda$.",
      "Drop the $x=0$ term and cancel $x$ with $x!$ to leave $(x-1)!$ in the denominator.",
      "Differentiate the summation with respect to $\\lambda$.",
      "Shift the index by letting $y = x - 2$."
    ],
    correctIndex: 1,
    explanation: "Since the $x=0$ term evaluates to 0, the summation starts at $x=1$. The $x$ in the numerator cancels with the $x$ in $x!$, leaving $(x-1)!$."
  },
  {
    question: "In the Poisson expectation proof, after factoring out $\\lambda e^{-\\lambda}$, what index shifting substitution is applied?",
    options: [
      "$y = x$",
      "$y = x - 1$",
      "$y = x + 1$",
      "$y = x - 2$"
    ],
    correctIndex: 1,
    explanation: "To match the standard Maclaurin series form starting at 0, we substitute $y = x - 1$, so the summation index runs from $y=0$ to $\\infty$."
  },
  {
    question: "Which infinite series is recognized and substituted in the final step of the Poisson expectation proof?",
    options: [
      "The geometric series: $\\sum_{y=0}^\\infty r^y = \\frac{1}{1-r}$",
      "The Maclaurin series for $e^\\lambda$: $\\sum_{y=0}^\\infty \\frac{\\lambda^y}{y!} = e^\\lambda$",
      "The Maclaurin series for $\\ln(1+\\lambda)$",
      "The Taylor series for $\\sin(\\lambda)$"
    ],
    correctIndex: 1,
    explanation: "The summation $\\sum_{y=0}^\\infty \\frac{\\lambda^y}{y!}$ is exactly the Maclaurin series expansion of $e^\\lambda$, which simplifies the expression to $\\lambda e^{-\\lambda} e^\\lambda = \\lambda$."
  },
  {
    question: "What is the formal strategy used to prove the variance of the Poisson distribution $V[X] = \\lambda$?",
    options: [
      "Directly compute $E[X^2]$ using the definition of expectation.",
      "Compute the second factorial moment $E[X(X-1)]$ and use the identity $V[X] = E[X(X-1)] + E[X] - (E[X])^2$.",
      "Differentiate the Moment Generating Function twice and evaluate at $t=0$.",
      "Use the Law of Total Variance."
    ],
    correctIndex: 1,
    explanation: "Computing $E[X(X-1)]$ is algebraically simpler because the $x(x-1)$ term cleanly cancels with $x!$ to leave $(x-2)!$, avoiding messy algebraic expansion."
  },
  {
    question: "In the proof of the second factorial moment $E[X(X-1)]$ for the Poisson distribution, which terms of the summation evaluate to zero and are dropped?",
    options: [
      "Only the $x=0$ term.",
      "The $x=0$ and $x=1$ terms.",
      "The $x=0, 1,$ and $2$ terms.",
      "No terms are dropped."
    ],
    correctIndex: 1,
    explanation: "When $x=0$ or $x=1$, the factor $x(x-1)$ becomes zero, so those terms contribute nothing to the sum and can be dropped, allowing the sum to start at $x=2$."
  },
  {
    question: "In the factorial moment proof, after factoring out $\\lambda^2 e^{-\\lambda}$, what index shifting substitution is applied?",
    options: [
      "$y = x - 1$",
      "$y = x - 2$",
      "$y = x + 2$",
      "$y = x / 2$"
    ],
    correctIndex: 1,
    explanation: "Because the summation now starts at $x=2$ and the denominator is $(x-2)!$, we substitute $y = x - 2$ to reset the lower bound to $y=0$."
  },
  {
    question: "What is the exact value of the second factorial moment $E[X(X-1)]$ for a Poisson random variable?",
    options: [
      "$\\lambda$",
      "$\\lambda^2$",
      "$\\lambda^2 + \\lambda$",
      "$\\lambda^2 - \\lambda$"
    ],
    correctIndex: 1,
    explanation: "Following the index shift and Maclaurin series recognition, the sum evaluates to $\\lambda^2 e^{-\\lambda} e^\\lambda = \\lambda^2$."
  },
  {
    question: "Which variance identity is applied in the final step of the Poisson variance proof?",
    options: [
      "$V[X] = E[X^2] - (E[X])^2$",
      "$V[X] = E[X(X-1)] + E[X] - (E[X])^2$",
      "$V[X] = E[X^2] + (E[X])^2$",
      "$V[X] = E[X(X+1)] - E[X] - (E[X])^2$"
    ],
    correctIndex: 1,
    explanation: "By expanding $E[X(X-1)] = E[X^2 - X] = E[X^2] - E[X]$, we can rearrange to find $E[X^2]$, and substitute into the standard variance formula."
  },
  {
    question: "What is the unique relationship between the expectation and variance of a Poisson random variable?",
    options: [
      "$V[X] = (E[X])^2$",
      "$V[X] = \\sqrt{E[X]}$",
      "$V[X] = E[X] = \\lambda$",
      "$V[X] = E[X] + 1$"
    ],
    correctIndex: 2,
    explanation: "A defining characteristic of the Poisson distribution is that its mean and variance are exactly equal to the same parameter $\\lambda$."
  },
  {
    question: "How is the normalization of the Poisson PMF ($\\sum_{x=0}^\\infty p(x) = 1$) formally proven?",
    options: [
      "By applying the Binomial Theorem with $a=p$ and $b=1-p$.",
      "By recognizing the summation as the Maclaurin series for $e^\\lambda$ and multiplying by $e^{-\\lambda}$.",
      "By evaluating the definite integral from $0$ to $\\infty$.",
      "By using the geometric series formula."
    ],
    correctIndex: 1,
    explanation: "$\\sum_{x=0}^\\infty \\frac{e^{-\\lambda} \\lambda^x}{x!} = e^{-\\lambda} \\sum_{x=0}^\\infty \\frac{\\lambda^x}{x!} = e^{-\\lambda} \\cdot e^\\lambda = 1$."
  },
  {
    question: "What does the parameter $\\lambda$ fundamentally represent in the context of the Poisson distribution?",
    options: [
      "The probability of a single success.",
      "The average rate of occurrence of the event over the specified interval.",
      "The maximum possible number of occurrences.",
      "The variance of the time between events."
    ],
    correctIndex: 1,
    explanation: "$\\lambda$ is the expected number of occurrences (the rate) in the given fixed interval of time, space, or volume."
  },
  {
    question: "If $X \\sim \\text{Poi}(\\lambda)$, what is the probability that exactly zero events occur, $P(X = 0)$?",
    options: [
      "$0$",
      "$1$",
      "$e^{-\\lambda}$",
      "$\\lambda e^{-\\lambda}$"
    ],
    correctIndex: 2,
    explanation: "Substituting $x=0$ into the PMF yields $\\frac{e^{-\\lambda} \\lambda^0}{0!} = \\frac{e^{-\\lambda} \\cdot 1}{1} = e^{-\\lambda}$."
  },
  {
    question: "In the Poisson expectation proof, why is it valid to factor $\\lambda$ out of the summation $\\sum_{x=1}^\\infty \\frac{\\lambda^x}{(x-1)!}$?",
    options: [
      "Because $\\lambda$ is the variable of summation.",
      "Because $\\lambda$ is a constant with respect to the summation index $x$.",
      "Because the summation is finite.",
      "Because $\\lambda$ is equal to 1."
    ],
    correctIndex: 1,
    explanation: "In the summation over $x$, the parameter $\\lambda$ is a constant coefficient and can be freely factored out of the summation operator."
  }
];