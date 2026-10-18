export const quizData = [
  {
    question: "Which of the following correctly represents the Linearity Law for splitting a summation across addition?",
    options: [
      "$\\sum_{i=1}^n (a_i + b_i) = \\sum_{i=1}^n a_i \\cdot \\sum_{i=1}^n b_i$",
      "$\\sum_{i=1}^n (a_i + b_i) = \\sum_{i=1}^n a_i + \\sum_{i=1}^n b_i$",
      "$\\sum_{i=1}^n (a_i + b_i) = \\sum_{i=1}^n a_i - \\sum_{i=1}^n b_i$",
      "$\\sum_{i=1}^n (a_i + b_i) = \\left( \\sum_{i=1}^n a_i \\right)^2 + \\left( \\sum_{i=1}^n b_i \\right)^2$"
    ],
    correctIndex: 1,
    explanation: "The Linearity Law allows a summation to be split across addition or subtraction: $\\sum_{i=1}^n (a_i + b_i) = \\sum_{i=1}^n a_i + \\sum_{i=1}^n b_i$."
  },
  {
    question: "What is the closed-form formula for the sum of the first $n$ squares?",
    options: [
      "$\\frac{n(n+1)}{2}$",
      "$\\frac{n(n+1)(2n+1)}{6}$",
      "$\\left( \\frac{n(n+1)}{2} \\right)^2$",
      "$\\frac{n^2(n+1)^2}{4}$"
    ],
    correctIndex: 1,
    explanation: "The standard closed-form identity for the sum of the first $n$ squares is $\\sum_{i=1}^n i^2 = \\frac{n(n+1)(2n+1)}{6}$."
  },
  {
    question: "Under what condition does an infinite geometric series $\\sum_{i=0}^{\\infty} ar^i$ converge?",
    options: [
      "$r > 1$",
      "$r \\le 1$",
      "$|r| < 1$",
      "$|r| \\ge 1$"
    ],
    correctIndex: 2,
    explanation: "An infinite geometric series converges if and only if the absolute value of the common ratio is strictly less than 1 ($|r| < 1$)."
  },
  {
    question: "Which of the following correctly represents the formula for a Finite Geometric Series?",
    options: [
      "$a \\frac{1 - r^n}{1 - r}$",
      "$\\frac{a}{1 - r}$",
      "$a \\frac{r^n - 1}{r - 1}$",
      "$a \\frac{1 - r^n}{1 + r}$"
    ],
    correctIndex: 0,
    explanation: "The sum of a finite geometric series with first term $a$ and ratio $r \\neq 1$ is $a \\frac{1 - r^n}{1 - r}$."
  },
  {
    question: "In the context of index shifting, if the original index is $k$ and the new index is $j = k - c$, how is the general term $f(k)$ rewritten?",
    options: [
      "$f(j - c)$",
      "$f(j + c)$",
      "$f(k + c)$",
      "$f(j \\cdot c)$"
    ],
    correctIndex: 1,
    explanation: "If $j = k - c$, then $k = j + c$. Therefore, the general term $f(k)$ must be rewritten as $f(j + c)$."
  },
  {
    question: "Which of the following correctly states the Binomial Theorem?",
    options: [
      "$(a + b)^n = \\sum_{k=0}^n \\binom{n}{k} a^k b^{n-k}$",
      "$(a + b)^n = \\sum_{k=0}^n \\binom{n}{k} a^{n-k} b^k$",
      "$(a + b)^n = \\sum_{k=1}^n \\binom{n}{k} a^{n-k} b^k$",
      "$(a + b)^n = \\sum_{k=0}^n \\frac{n!}{k!} a^{n-k} b^k$"
    ],
    correctIndex: 1,
    explanation: "The Binomial Theorem expands the power of a binomial as $(a + b)^n = \\sum_{k=0}^n \\binom{n}{k} a^{n-k} b^k$."
  },
  {
    question: "What is the Maclaurin series expansion for $e^x$?",
    options: [
      "$\\sum_{k=0}^{\\infty} \\frac{x^k}{k!}$",
      "$\\sum_{k=1}^{\\infty} \\frac{x^k}{k!}$",
      "$\\sum_{k=0}^{\\infty} x^k$",
      "$\\sum_{k=0}^{\\infty} \\frac{k!}{x^k}$"
    ],
    correctIndex: 0,
    explanation: "The exponential function can be expressed as the infinite power series $e^x = \\sum_{k=0}^{\\infty} \\frac{x^k}{k!}$."
  },
  {
    question: "In the algebraic 'Derivative Trick' used for evaluating Poisson expectation, what is the exact result of the infinite series $\\sum_{k=1}^{\\infty} \\frac{\\lambda^k}{(k-1)!}$?",
    options: [
      "$e^\\lambda$",
      "$\\lambda e^\\lambda$",
      "$\\lambda^2 e^\\lambda$",
      "$\\frac{e^\\lambda}{\\lambda}$"
    ],
    correctIndex: 1,
    explanation: "By factoring out $\\lambda$ and shifting the index to $j = k-1$, the series becomes $\\lambda \\sum_{j=0}^{\\infty} \\frac{\\lambda^j}{j!}$, which evaluates to $\\lambda e^\\lambda$."
  },
  {
    question: "Which of the following correctly represents the closed-form formula for the sum of the first $n$ cubes?",
    options: [
      "$\\frac{n(n+1)(2n+1)}{6}$",
      "$\\frac{n^2(n+1)^2}{4}$",
      "$\\left( \\frac{n(n+1)}{2} \\right)^2$",
      "$\\frac{n(n+1)}{2}$"
    ],
    correctIndex: 2,
    explanation: "The sum of the first $n$ cubes is the square of the sum of the first $n$ integers: $\\sum_{i=1}^n i^3 = \\left( \\frac{n(n+1)}{2} \\right)^2$."
  },
  {
    question: "According to the Linearity Law for factoring a constant, which of the following is true?",
    options: [
      "$\\sum_{i=1}^n c \\cdot a_i = c + \\sum_{i=1}^n a_i$",
      "$\\sum_{i=1}^n c \\cdot a_i = c \\sum_{i=1}^n a_i$",
      "$\\sum_{i=1}^n c \\cdot a_i = \\sum_{i=1}^n c + \\sum_{i=1}^n a_i$",
      "$\\sum_{i=1}^n c \\cdot a_i = c^n \\sum_{i=1}^n a_i$"
    ],
    correctIndex: 1,
    explanation: "Constants can be factored entirely out of the summation operator: $\\sum_{i=1}^n c \\cdot a_i = c \\sum_{i=1}^n a_i$."
  },
  {
    question: "What is the result of the summation of a constant $c$ from $i=1$ to $n$?",
    options: [
      "$c$",
      "$c^n$",
      "$n + c$",
      "$n \\cdot c$"
    ],
    correctIndex: 3,
    explanation: "Adding a constant $c$ exactly $n$ times results in $n \\cdot c$: $\\sum_{i=1}^n c = n \\cdot c$."
  },
  {
    question: "In the formula for an Infinite Geometric Series ($\\frac{a}{1 - r}$), what does the variable $a$ represent?",
    options: [
      "The common ratio of the series.",
      "The total number of terms in the series.",
      "The first term of the series.",
      "The limit of the series as $n \\to \\infty$."
    ],
    correctIndex: 2,
    explanation: "In the geometric series formula, $a$ represents the very first term of the sequence (the term when the index is 0)."
  },
  {
    question: "When applying index shifting to $\\sum_{k=1}^5 k^2$ to start at $j=0$, what is the new upper bound of the summation?",
    options: [
      "$5$",
      "$6$",
      "$4$",
      "$0$"
    ],
    correctIndex: 2,
    explanation: "If the new index is $j = k - 1$, the upper bound shifts from $k=5$ to $j = 5 - 1 = 4$."
  },
  {
    question: "Which of the following correctly represents the closed-form formula for the sum of the first $n$ integers?",
    options: [
      "$\\frac{n(n+1)}{2}$",
      "$\\frac{n(n-1)}{2}$",
      "$\\frac{n^2 + 1}{2}$",
      "$n^2$"
    ],
    correctIndex: 0,
    explanation: "The standard closed-form identity for the sum of the first $n$ integers is $\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$."
  },
  {
    question: "In the Binomial Theorem, what is the general term of the summation?",
    options: [
      "$\\binom{n}{k} a^k b^k$",
      "$\\binom{n}{k} a^{n-k} b^k$",
      "$\\frac{n!}{k!} a^{n-k} b^k$",
      "$\\binom{n}{k} a^n b^k$"
    ],
    correctIndex: 1,
    explanation: "The general term in the expansion of $(a + b)^n$ is $\\binom{n}{k} a^{n-k} b^k$, where the exponents of $a$ and $b$ always sum to $n$."
  }
];