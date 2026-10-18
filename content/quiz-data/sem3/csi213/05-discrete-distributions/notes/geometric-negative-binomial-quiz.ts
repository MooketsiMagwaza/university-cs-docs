export const quizData = [
  {
    question: "According to the 'failures before success' convention, what does a Geometric random variable $X \\sim \\text{Geo}(p)$ count?",
    options: [
      "The total number of trials required to get the 1st success.",
      "The number of failures before the 1st success.",
      "The number of successes in $n$ trials.",
      "The number of failures before the $r$-th success."
    ],
    correctIndex: 1,
    explanation: "Under this specific convention, $X$ represents the count of failures preceding the first observed success."
  },
  {
    question: "What is the exact support (set of possible values) for a Geometric random variable under the 'failures before success' convention?",
    options: [
      "$x \\in \\{1, 2, 3, \\dots\\}$",
      "$x \\in \\{0, 1, 2, \\dots\\}$",
      "$x \\in \\{0, 1, 2, \\dots, n\\}$",
      "$x \\in \\mathbb{R}$"
    ],
    correctIndex: 1,
    explanation: "Since it is possible to have zero failures before the first success (i.e., success on the first trial), the support starts at $x=0$."
  },
  {
    question: "Which of the following correctly defines the PMF of a Geometric random variable $X \\sim \\text{Geo}(p)$, where $q = 1-p$?",
    options: [
      "$p(x) = p q^{x-1}$ for $x = 1, 2, \\dots$",
      "$p(x) = p q^x$ for $x = 0, 1, 2, \\dots$",
      "$p(x) = \\binom{x}{1} p^1 q^{x-1}$ for $x = 0, 1, 2, \\dots$",
      "$p(x) = q p^x$ for $x = 0, 1, 2, \\dots$"
    ],
    correctIndex: 1,
    explanation: "To have exactly $x$ failures before the 1st success, you need $x$ failures (probability $q^x$) followed by 1 success (probability $p$)."
  },
  {
    question: "What is the formal mathematical expression for the Geometric Survival Function $P(X \\ge x)$?",
    options: [
      "$P(X \\ge x) = q^{x-1}$",
      "$P(X \\ge x) = q^x$",
      "$P(X \\ge x) = p q^x$",
      "$P(X \\ge x) = 1 - q^x$"
    ],
    correctIndex: 1,
    explanation: "The probability of observing at least $x$ failures before the first success is exactly $q^x$. The exponent is $x$, not $x-1$, because the support starts at 0."
  },
  {
    question: "In the formal proof of the Geometric Survival Function, the summation $\\sum_{k=x}^\\infty p q^k$ is recognized as what type of series?",
    options: [
      "A Maclaurin series",
      "A telescoping series",
      "An infinite geometric series",
      "A harmonic series"
    ],
    correctIndex: 2,
    explanation: "The terms form an infinite geometric progression with a common ratio of $q$, where $0 < q < 1$, ensuring convergence."
  },
  {
    question: "In the Geometric Survival Function proof, what is the first term $a$ of the infinite geometric series $\\sum_{k=x}^\\infty p q^k$?",
    options: [
      "$p$",
      "$pq$",
      "$pq^x$",
      "$q^x$"
    ],
    correctIndex: 2,
    explanation: "Evaluating the general term $p q^k$ at the lower bound $k=x$ yields the first term $a = p q^x$."
  },
  {
    question: "In the same proof, what is the common ratio $r$ of the infinite geometric series?",
    options: [
      "$p$",
      "$q$",
      "$pq$",
      "$1-p^2$"
    ],
    correctIndex: 1,
    explanation: "Each successive term in the summation is multiplied by $q$, making $q$ the common ratio."
  },
  {
    question: "According to the 'failures before success' convention, what does a Negative Binomial random variable $X \\sim \\text{NB}(r, p)$ count?",
    options: [
      "The total number of trials required to get $r$ successes.",
      "The number of failures before the $r$-th success.",
      "The number of successes before the $r$-th failure.",
      "The number of failures in $n$ trials."
    ],
    correctIndex: 1,
    explanation: "The Negative Binomial generalizes the Geometric distribution by counting the failures preceding a specified target number of successes $r$."
  },
  {
    question: "What is the exact support for a Negative Binomial random variable $X \\sim \\text{NB}(r, p)$?",
    options: [
      "$x \\in \\{r, r+1, r+2, \\dots\\}$",
      "$x \\in \\{0, 1, 2, \\dots\\}$",
      "$x \\in \\{1, 2, \\dots, r\\}$",
      "$x \\in \\{0, 1, 2, \\dots, n\\}$"
    ],
    correctIndex: 1,
    explanation: "It is possible to achieve $r$ successes with zero failures (if the first $r$ trials are all successes), so the support starts at $x=0$."
  },
  {
    question: "Which of the following correctly defines the PMF of a Negative Binomial random variable?",
    options: [
      "$p(x) = \\binom{x+r}{r} p^r (1-p)^x$",
      "$p(x) = \\binom{x+r-1}{r-1} p^r (1-p)^x$ for $x = 0, 1, 2, \\dots$",
      "$p(x) = \\binom{x+r-1}{x} p^x (1-p)^{r}$",
      "$p(x) = \\binom{n}{x} p^x (1-p)^{n-x}$"
    ],
    correctIndex: 1,
    explanation: "The formula accounts for arranging $x$ failures and $r-1$ successes in the preceding trials, followed by the mandatory $r$-th success."
  },
  {
    question: "In the combinatorial intuition for the Negative Binomial PMF, what is the strict requirement for the final trial (trial number $x+r$)?",
    options: [
      "It must be a failure.",
      "It must be a success.",
      "It can be either a success or a failure.",
      "It must be the $x$-th failure."
    ],
    correctIndex: 1,
    explanation: "By definition, the experiment stops exactly when the $r$-th success is observed. Therefore, the final trial must be that $r$-th success."
  },
  {
    question: "In the same combinatorial intuition, how many total trials occur *before* the final, mandatory success?",
    options: [
      "$x + r$",
      "$x + r - 1$",
      "$x + r - 2$",
      "$r - 1$"
    ],
    correctIndex: 1,
    explanation: "If there are $x$ failures and the final trial is the $r$-th success, the preceding trials consist of $x$ failures and $r-1$ successes, totaling $x+r-1$ trials."
  },
  {
    question: "In the Negative Binomial PMF, why is the combination term $\\binom{x+r-1}{r-1}$ used?",
    options: [
      "It represents the number of ways to arrange $x$ failures and $r-1$ successes in the preceding $x+r-1$ trials.",
      "It represents the total number of ways to choose $r$ successes from $x+r$ trials.",
      "It represents the number of ways to arrange $x$ failures and $r$ successes.",
      "It is the normalization constant for the distribution."
    ],
    correctIndex: 0,
    explanation: "Since the final trial is fixed as a success, we only need to count the number of ways to distribute the remaining $r-1$ successes among the first $x+r-1$ trials."
  },
  {
    question: "What is the formal mathematical relationship between the Geometric and Negative Binomial distributions?",
    options: [
      "The Geometric distribution is the limit of the Negative Binomial as $r \\to \\infty$.",
      "The Geometric distribution is a special case of the Negative Binomial distribution where $r = 1$.",
      "They are mutually exclusive distributions.",
      "The Negative Binomial is the continuous analog of the Geometric."
    ],
    correctIndex: 1,
    explanation: "If you set the target number of successes $r = 1$ in the Negative Binomial PMF, it algebraically reduces exactly to the Geometric PMF."
  },
  {
    question: "Why is the exponent of $q$ in the Geometric PMF $p(x) = p q^x$ exactly $x$, and not $x-1$?",
    options: [
      "Because $x$ represents the total number of trials, which starts at 1.",
      "Because $x$ represents the number of failures, which starts at 0.",
      "Because the probability of success is $q$.",
      "Because the distribution is continuous."
    ],
    correctIndex: 1,
    explanation: "Since the random variable $X$ counts failures starting from 0, achieving exactly $x$ failures requires multiplying the failure probability $q$ exactly $x$ times."
  }
];