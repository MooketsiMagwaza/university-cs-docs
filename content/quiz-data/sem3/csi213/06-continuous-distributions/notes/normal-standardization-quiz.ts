export const quizData = [
  {
    question: "Which of the following correctly defines the Probability Density Function (PDF) of a Normal random variable $X \\sim N(\\mu, \\sigma^2)$?",
    options: [
      "$f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2} \\left( \\frac{x-\\mu}{\\sigma} \\right)^2}$",
      "$f(x) = \\frac{1}{\\mu \\sqrt{2\\pi}} e^{-\\frac{1}{2} \\left( \\frac{x-\\sigma}{\\mu} \\right)^2}$",
      "$f(x) = \\frac{1}{\\sqrt{2\\pi}} e^{-\\frac{1}{2} (x-\\mu)^2}$",
      "$f(x) = \\frac{1}{\\sigma \\sqrt{\\pi}} e^{-\\left( \\frac{x-\\mu}{\\sigma} \\right)^2}$"
    ],
    correctIndex: 0,
    explanation: "The Normal PDF is defined by this specific Gaussian function, parameterized by mean $\\mu$ and standard deviation $\\sigma$."
  },
  {
    question: "What is the formal mathematical formula for standardizing a Normal random variable $X \\sim N(\\mu, \\sigma^2)$?",
    options: [
      "$Z = \\frac{X - \\sigma}{\\mu}$",
      "$Z = \\frac{X - \\mu}{\\sigma}$",
      "$Z = \\frac{\\mu - X}{\\sigma}$",
      "$Z = \\frac{X}{\\sigma} + \\mu$"
    ],
    correctIndex: 1,
    explanation: "Standardization subtracts the mean to center the distribution at 0, and divides by the standard deviation to scale the variance to 1."
  },
  {
    question: "What are the exact parameters of the Standard Normal distribution $Z$?",
    options: [
      "$\\mu = 0$ and $\\sigma^2 = 0$",
      "$\\mu = 1$ and $\\sigma^2 = 1$",
      "$\\mu = 0$ and $\\sigma^2 = 1$",
      "$\\mu = 0$ and $\\sigma^2 = \\frac{1}{\\sqrt{2\\pi}}$"
    ],
    correctIndex: 2,
    explanation: "By definition, the Standard Normal distribution has a mean of 0 and a variance (and standard deviation) of 1."
  },
  {
    question: "Which of the following correctly states the Symmetry Axiom of the Standard Normal distribution?",
    options: [
      "$P(Z < -z) = P(Z < z)$",
      "$P(Z < -z) = 1 - P(Z < z)$",
      "$P(Z < -z) = P(Z > z) - 1$",
      "$P(Z < -z) = 2P(Z < z)$"
    ],
    correctIndex: 1,
    explanation: "Due to perfect symmetry about $z=0$, the left tail probability $P(Z < -z)$ is exactly equal to the right tail probability $P(Z > z)$, which is $1 - P(Z < z)$."
  },
  {
    question: "What is the formal mathematical expression for the probability of a Standard Normal variable falling within a symmetric interval $(-z, z)$?",
    options: [
      "$P(-z < Z < z) = P(Z < z) - P(Z < -z)$",
      "$P(-z < Z < z) = 2P(Z < z) - 1$",
      "$P(-z < Z < z) = 1 - 2P(Z < z)$",
      "$P(-z < Z < z) = 2(1 - P(Z < z))$"
    ],
    correctIndex: 1,
    explanation: "Using the symmetry axiom, $P(-z < Z < z) = P(Z < z) - (1 - P(Z < z)) = 2P(Z < z) - 1$."
  },
  {
    question: "In a forward Z-table problem, what is the first mathematical step to find $P(x_1 < X < x_2)$ for $X \\sim N(\\mu, \\sigma^2)$?",
    options: [
      "Look up $x_1$ and $x_2$ directly in the Z-table.",
      "Standardize the bounds to $z_1 = \\frac{x_1 - \\mu}{\\sigma}$ and $z_2 = \\frac{x_2 - \\mu}{\\sigma}$.",
      "Calculate the variance of the interval.",
      "Apply the Central Limit Theorem."
    ],
    correctIndex: 1,
    explanation: "The Z-table only contains probabilities for the Standard Normal distribution, so the raw values must first be converted to Z-scores."
  },
  {
    question: "In an inverse Z-table problem, if you are given a right-tail probability $P(X > x) = \\alpha$, what cumulative probability do you look up in the Z-table?",
    options: [
      "$\\alpha$",
      "$1 - \\alpha$",
      "$\\alpha / 2$",
      "$1 - \\alpha / 2$"
    ],
    correctIndex: 1,
    explanation: "Standard Z-tables provide cumulative left-tail probabilities $P(Z < z)$. Therefore, you must look up the complement $1 - \\alpha$."
  },
  {
    question: "What is the formal mathematical formula for 'un-standardizing' a Z-score $z$ back to the original scale $x$?",
    options: [
      "$x = \\frac{z - \\mu}{\\sigma}$",
      "$x = \\mu + z\\sigma$",
      "$x = z\\mu + \\sigma$",
      "$x = \\frac{z}{\\sigma} + \\mu$"
    ],
    correctIndex: 1,
    explanation: "Algebraically rearranging the standardization formula $z = \\frac{x - \\mu}{\\sigma}$ yields $x = \\mu + z\\sigma$."
  },
  {
    question: "What is the total area under the curve of any valid Normal PDF $f(x)$?",
    options: [
      "$0$",
      "$\\frac{1}{\\sqrt{2\\pi}}$",
      "$1$",
      "$\\infty$"
    ],
    correctIndex: 2,
    explanation: "Like all valid probability density functions, the integral of the Normal PDF over the entire real line $(-\\infty, \\infty)$ is exactly 1."
  },
  {
    question: "What is the asymptotic behavior of the Normal PDF $f(x)$ as $x \\to \\pm\\infty$?",
    options: [
      "$f(x) \\to 1$",
      "$f(x) \\to \\infty$",
      "$f(x) \\to 0$",
      "$f(x)$ oscillates indefinitely."
    ],
    correctIndex: 2,
    explanation: "The exponential term $e^{-\\frac{1}{2} \\left( \\frac{x-\\mu}{\\sigma} \\right)^2}$ approaches 0 as the squared term in the exponent grows infinitely large."
  },
  {
    question: "For a Normal distribution $N(\\mu, \\sigma^2)$, what is the relationship between the mean, median, and mode?",
    options: [
      "Mean > Median > Mode",
      "Mean = Median = Mode = $\\mu$",
      "Mean < Median < Mode",
      "They cannot be determined without knowing $\\sigma$."
    ],
    correctIndex: 1,
    explanation: "Due to the perfect symmetry and unimodality of the Normal distribution, the mean, median, and mode all coincide exactly at the center $\\mu$."
  },
  {
    question: "What is the mathematical effect on the Normal PDF curve when the standard deviation $\\sigma$ increases?",
    options: [
      "The curve becomes taller and narrower.",
      "The curve becomes shorter and wider (flatter).",
      "The curve shifts horizontally to the right.",
      "The curve shifts horizontally to the left."
    ],
    correctIndex: 1,
    explanation: "A larger $\\sigma$ indicates greater dispersion. To maintain a total area of 1, the peak must decrease in height and the tails must spread out."
  },
  {
    question: "What is the mathematical effect on the Normal PDF curve when the mean $\\mu$ increases?",
    options: [
      "The curve becomes taller and narrower.",
      "The curve becomes shorter and wider.",
      "The curve shifts horizontally to the right without changing shape.",
      "The curve shifts horizontally to the left without changing shape."
    ],
    correctIndex: 2,
    explanation: "The mean $\\mu$ is the location parameter. Changing it translates the entire curve along the x-axis without altering its shape or spread."
  },
  {
    question: "For any continuous Normal random variable $X$, what is the exact value of $P(X = c)$ for a specific constant $c$?",
    options: [
      "$f(c)$",
      "$1$",
      "$0$",
      "Undefined"
    ],
    correctIndex: 2,
    explanation: "For any continuous distribution, the probability of the random variable taking on any single, exact point is the integral from $c$ to $c$, which is 0."
  },
  {
    question: "Which mathematical theorem guarantees that the sum of independent Normal random variables is also Normally distributed?",
    options: [
      "The Law of Large Numbers",
      "The Central Limit Theorem",
      "The Reproductive Property of the Normal Distribution",
      "The Markov Inequality"
    ],
    correctIndex: 2,
    explanation: "The Normal distribution is closed under addition. The sum of independent Normal variables is exactly Normal, with mean equal to the sum of means and variance equal to the sum of variances."
  }
];