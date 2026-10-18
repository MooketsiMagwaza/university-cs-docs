export const quizData = [
  {
    question: "Which of the following correctly defines the Expected Value (Mean) $E[X]$ for a discrete random variable?",
    options: [
      "$E[X] = \\sum_{x} x^2 \\cdot p(x)$",
      "$E[X] = \\sum_{x} x \\cdot p(x)$",
      "$E[X] = \\int_{-\\infty}^{\\infty} x \\cdot p(x) \\, dx$",
      "$E[X] = \\sum_{x} p(x)$"
    ],
    correctIndex: 1,
    explanation: "The expected value of a discrete random variable is the sum of each possible value multiplied by its corresponding probability."
  },
  {
    question: "Which of the following correctly defines the Expected Value (Mean) $E[X]$ for a continuous random variable with PDF $f(x)$?",
    options: [
      "$E[X] = \\int_{-\\infty}^{\\infty} f(x) \\, dx$",
      "$E[X] = \\int_{-\\infty}^{\\infty} x \\cdot f(x) \\, dx$",
      "$E[X] = \\sum_{x} x \\cdot f(x)$",
      "$E[X] = \\int_{-\\infty}^{\\infty} x^2 \\cdot f(x) \\, dx$"
    ],
    correctIndex: 1,
    explanation: "For continuous variables, the summation is replaced by an integral over the entire real line, weighting each value $x$ by its density $f(x)$."
  },
  {
    question: "What is the formal probabilistic interpretation of the Expected Value $E[X]$?",
    options: [
      "The most likely value (mode) of the random variable.",
      "The median value that splits the probability distribution in half.",
      "The long-run average value of the random variable over many independent repetitions.",
      "The maximum possible value the random variable can take."
    ],
    correctIndex: 2,
    explanation: "By the Law of Large Numbers, the sample mean converges to the expected value, making it the theoretical long-run average."
  },
  {
    question: "Which of the following correctly states the Theorem of Linearity of Expectation?",
    options: [
      "$E[aX + b] = aE[X] + b$",
      "$E[aX + b] = aE[X] + bE[X]$",
      "$E[aX + b] = aE[X] \\cdot b$",
      "$E[aX + b] = E[aX] \\cdot E[b]$"
    ],
    correctIndex: 0,
    explanation: "Expectation is a linear operator, meaning constants can be factored out and the expectation of a sum is the sum of expectations."
  },
  {
    question: "Under what strict condition does the Linearity of Expectation $E[aX + b] = aE[X] + b$ hold true?",
    options: [
      "Only when $X$ is a discrete random variable.",
      "Only when $X$ and $Y$ are statistically independent.",
      "It holds true universally for any random variable, regardless of independence.",
      "Only when the variance of $X$ is zero."
    ],
    correctIndex: 2,
    explanation: "Linearity of expectation is a fundamental property of the integral/summation operator and does not require any assumptions about independence or distribution type."
  },
  {
    question: "In the formal proof of the Linearity of Expectation for discrete variables, what is the result of distributing the summation in Step 2?",
    options: [
      "$\\sum_{x} (ax + b) \\cdot p(x) = a \\sum_{x} x + b \\sum_{x} p(x)$",
      "$\\sum_{x} (ax \\cdot p(x) + b \\cdot p(x)) = \\sum_{x} ax \\cdot p(x) + \\sum_{x} b \\cdot p(x)$",
      "$\\sum_{x} (ax + b) \\cdot p(x) = (\\sum_{x} ax) \\cdot (\\sum_{x} b \\cdot p(x))$",
      "$\\sum_{x} (ax + b) \\cdot p(x) = a \\sum_{x} x \\cdot p(x) + b$"
    ],
    correctIndex: 1,
    explanation: "The summation operator is linear, allowing the sum of a sum to be split into the sum of the individual terms."
  },
  {
    question: "In the same proof, which PMF validity condition is applied in the final step to simplify $b \\sum_{x} p(x)$ to $b$?",
    options: [
      "Non-negativity: $p(x) \\ge 0$",
      "Normalization: $\\sum_{x} p(x) = 1$",
      "Event Probability: $P(X \\in A) = \\sum_{x \\in A} p(x)$",
      "The definition of Expected Value."
    ],
    correctIndex: 1,
    explanation: "The normalization condition dictates that the sum of all probabilities in the sample space is exactly 1, so $b \\cdot 1 = b$."
  },
  {
    question: "Which of the following correctly defines the Variance $V(X)$ of a random variable $X$ with mean $\\mu = E[X]$?",
    options: [
      "$V(X) = E[X - \\mu]$",
      "$V(X) = E[(X - \\mu)^2]$",
      "$V(X) = (E[X - \\mu])^2$",
      "$V(X) = E[X^2] - \\mu$"
    ],
    correctIndex: 1,
    explanation: "Variance is formally defined as the expected value of the squared deviation of the random variable from its mean."
  },
  {
    question: "What is the mathematical relationship between Variance $V(X)$ and Standard Deviation $\\sigma$?",
    options: [
      "$\\sigma = V(X)^2$",
      "$\\sigma = \\sqrt{V(X)}$",
      "$\\sigma = \\frac{1}{V(X)}$",
      "$\\sigma = E[X] - V(X)$"
    ],
    correctIndex: 1,
    explanation: "Standard deviation is defined as the positive square root of the variance, bringing the units back to the original scale of the random variable."
  },
  {
    question: "Which of the following correctly states the Computational Formula for Variance?",
    options: [
      "$V(X) = E[X^2] + (E[X])^2$",
      "$V(X) = (E[X])^2 - E[X^2]$",
      "$V(X) = E[X^2] - (E[X])^2$",
      "$V(X) = E[X^2] \\cdot (E[X])^2$"
    ],
    correctIndex: 2,
    explanation: "The computational formula states that variance is the expected value of the square of the variable, minus the square of the expected value."
  },
  {
    question: "In the formal proof of the Computational Formula for Variance, what is the result of expanding the squared term $E[(X - \\mu)^2]$?",
    options: [
      "$E[X^2 - \\mu^2]$",
      "$E[X^2 - 2\\mu X + \\mu^2]$",
      "$E[X^2] - 2E[\\mu X] - E[\\mu^2]$",
      "$E[X]^2 - 2\\mu E[X] + \\mu^2$"
    ],
    correctIndex: 1,
    explanation: "Algebraically expanding $(X - \\mu)^2$ yields the trinomial $X^2 - 2\\mu X + \\mu^2$, which is then placed inside the expectation operator."
  },
  {
    question: "In the same proof, how does the Linearity of Expectation treat the term $\\mu^2$?",
    options: [
      "It is treated as a random variable, so $E[\\mu^2] = \\mu^2 E[X]$.",
      "It is treated as a constant, so $E[\\mu^2] = \\mu^2$.",
      "It is treated as a constant, so $E[\\mu^2] = 0$.",
      "It is ignored because it is not a function of $X$."
    ],
    correctIndex: 1,
    explanation: "Since $\\mu$ is a constant (the mean), $\\mu^2$ is also a constant. The expected value of any constant is simply the constant itself."
  },
  {
    question: "In the final step of the Variance computational proof, substituting $E[X]$ for $\\mu$ in the expression $E[X^2] - 2\\mu^2 + \\mu^2$ yields what result?",
    options: [
      "$E[X^2] - \\mu^2$",
      "$E[X^2] + \\mu^2$",
      "$E[X^2] - 3\\mu^2$",
      "$E[X^2]$"
    ],
    correctIndex: 0,
    explanation: "Combining the like terms $-2\\mu^2 + \\mu^2$ results in $-\\mu^2$. Substituting $\\mu = E[X]$ gives the final formula $E[X^2] - (E[X])^2$."
  },
  {
    question: "Based on the definition of Variance $V(X) = E[(X - \\mu)^2]$, what can be definitively concluded about the sign of $V(X)$?",
    options: [
      "$V(X)$ can be negative, positive, or zero.",
      "$V(X)$ is always strictly greater than 0.",
      "$V(X)$ is always non-negative ($V(X) \\ge 0$).",
      "$V(X)$ is always equal to 1."
    ],
    correctIndex: 2,
    explanation: "Since $(X - \\mu)^2$ is always non-negative, its expected value must also be non-negative. Variance can only be zero if $X$ is a constant."
  },
  {
    question: "As a direct mathematical consequence of the Computational Formula for Variance and the fact that $V(X) \\ge 0$, which inequality must always hold true?",
    options: [
      "$E[X^2] \\le (E[X])^2$",
      "$E[X^2] \\ge (E[X])^2$",
      "$E[X^2] = (E[X])^2$",
      "$E[X^2] < 0$"
    ],
    correctIndex: 1,
    explanation: "Since $V(X) = E[X^2] - (E[X])^2 \\ge 0$, adding $(E[X])^2$ to both sides proves that the expected value of the square is always greater than or equal to the square of the expected value."
  }
];