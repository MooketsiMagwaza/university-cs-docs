export const quizData = [
  {
    question: "Which of the following correctly defines the Reliability Function (or Survival Function) $R(t)$?",
    options: [
      "$R(t) = P(T \\le t) = F(t)$",
      "$R(t) = P(T > t) = 1 - F(t)$",
      "$R(t) = f(t)$",
      "$R(t) = \\int_{0}^{t} f(x) \\, dx$"
    ],
    correctIndex: 1,
    explanation: "The Reliability Function represents the probability that a component survives beyond time $t$, which is the complement of the CDF."
  },
  {
    question: "Which of the following correctly states the reliability of a Series System consisting of $n$ independent components?",
    options: [
      "$R_{\\text{series}} = \\sum_{i=1}^n R_i(t)$",
      "$R_{\\text{series}} = \\prod_{i=1}^n R_i(t)$",
      "$R_{\\text{series}} = 1 - \\prod_{i=1}^n (1 - R_i(t))$",
      "$R_{\\text{series}} = \\min(R_1(t), \\dots, R_n(t))$"
    ],
    correctIndex: 1,
    explanation: "For a series system to function, all components must function. By independence, the joint probability is the product of the individual reliabilities."
  },
  {
    question: "Which of the following correctly states the reliability of a Parallel System consisting of $n$ independent components?",
    options: [
      "$R_{\\text{parallel}} = \\prod_{i=1}^n R_i(t)$",
      "$R_{\\text{parallel}} = \\sum_{i=1}^n R_i(t)$",
      "$R_{\\text{parallel}} = 1 - \\prod_{i=1}^n (1 - R_i(t))$",
      "$R_{\\text{parallel}} = \\max(R_1(t), \\dots, R_n(t))$"
    ],
    correctIndex: 2,
    explanation: "A parallel system fails only if all components fail. The probability of all failing is $\\prod (1 - R_i(t))$, so the reliability is 1 minus this product."
  },
  {
    question: "What is the formal definition of a $k$-out-of-$n$ System?",
    options: [
      "A system that functions if exactly $k$ components are functioning.",
      "A system that functions if at least $k$ out of its $n$ identical, independent components are functioning.",
      "A system that functions if at most $k$ components fail.",
      "A system that functions if the first $k$ components function."
    ],
    correctIndex: 1,
    explanation: "The $k$-out-of-$n$ model requires a minimum threshold of $k$ working components out of a total of $n$ for the system to operate."
  },
  {
    question: "Which mathematical distribution is used to calculate the reliability of a $k$-out-of-$n$ system with identical components?",
    options: [
      "Poisson Distribution",
      "Exponential Distribution",
      "Binomial Distribution",
      "Hypergeometric Distribution"
    ],
    correctIndex: 2,
    explanation: "Since each component is an independent Bernoulli trial (works or fails with probability $R$), the number of working components follows a Binomial distribution."
  },
  {
    question: "Which of the following correctly defines the Hazard Rate Function $h(t)$?",
    options: [
      "$h(t) = \\frac{F(t)}{R(t)}$",
      "$h(t) = \\frac{f(t)}{R(t)} = \\frac{f(t)}{1 - F(t)}$",
      "$h(t) = \\int_{0}^{t} f(x) \\, dx$",
      "$h(t) = f(t) \\cdot R(t)$"
    ],
    correctIndex: 1,
    explanation: "The hazard rate is the instantaneous rate of failure at time $t$, conditional on survival up to time $t$. It is the PDF divided by the Survival function."
  },
  {
    question: "What is the mathematical relationship between the PDF $f(t)$ and the derivative of the Reliability function $R(t)$?",
    options: [
      "$f(t) = R'(t)$",
      "$f(t) = -R'(t)$",
      "$f(t) = R''(t)$",
      "$f(t) = \\frac{1}{R'(t)}$"
    ],
    correctIndex: 1,
    explanation: "Since $R(t) = 1 - F(t)$ and $F'(t) = f(t)$, differentiating $R(t)$ yields $R'(t) = -f(t)$, so $f(t) = -R'(t)$."
  },
  {
    question: "What is the fundamental conclusion of the theorem regarding a constant hazard rate $h(t) = \\lambda$?",
    options: [
      "It implies the Uniform distribution.",
      "It implies the Normal distribution.",
      "It implies the Exponential distribution.",
      "It implies the Poisson distribution."
    ],
    correctIndex: 2,
    explanation: "The Exponential distribution is the unique continuous distribution characterized by a constant hazard rate over time."
  },
  {
    question: "In the formal proof that a constant hazard rate implies the Exponential distribution, what differential equation is established in Step 3?",
    options: [
      "$\\frac{R'(t)}{R(t)} = \\lambda$",
      "$\\frac{R'(t)}{R(t)} = -\\lambda$",
      "$R'(t) = -\\lambda R(t)^2$",
      "$R''(t) = -\\lambda$"
    ],
    correctIndex: 1,
    explanation: "Substituting $f(t) = -R'(t)$ and $h(t) = \\lambda$ into the hazard rate definition yields $\\lambda = \\frac{-R'(t)}{R(t)}$, which rearranges to $\\frac{R'(t)}{R(t)} = -\\lambda$."
  },
  {
    question: "In the same proof, what is the result of integrating both sides of the differential equation $\\frac{R'(t)}{R(t)} = -\\lambda$?",
    options: [
      "$R(t) = -\\lambda t + C$",
      "$\\ln(R(t)) = -\\lambda t + C$",
      "$e^{R(t)} = -\\lambda t + C$",
      "$\\frac{1}{R(t)} = -\\lambda t + C$"
    ],
    correctIndex: 1,
    explanation: "The integral of $\\frac{R'(t)}{R(t)}$ with respect to $t$ is the natural logarithm $\\ln(R(t))$, and the integral of $-\\lambda$ is $-\\lambda t + C$."
  },
  {
    question: "In the final step of the proof, what initial condition is applied to solve for the constant of integration $C$?",
    options: [
      "$R(\\infty) = 0$",
      "$R(0) = 1$",
      "$R(1) = e^{-\\lambda}$",
      "$R'(0) = -\\lambda$"
    ],
    correctIndex: 1,
    explanation: "At time $t=0$, the component is brand new and has not yet had a chance to fail, so the probability of survival is $R(0) = 1$."
  },
  {
    question: "After applying the initial condition $R(0) = 1$ to $\\ln(R(t)) = -\\lambda t + C$, what is the value of $e^C$?",
    options: [
      "$0$",
      "$1$",
      "$\\lambda$",
      "$e^{-\\lambda}$"
    ],
    correctIndex: 1,
    explanation: "Substituting $t=0$ and $R(0)=1$ gives $\\ln(1) = C$, so $C = 0$. Therefore, $e^C = e^0 = 1$."
  },
  {
    question: "What is the mathematical intuition behind why a Parallel System is always more reliable than its most reliable individual component?",
    options: [
      "Because the components share the load equally.",
      "Because the system only fails if all components fail, providing redundancy.",
      "Because the hazard rate of the system is the sum of the individual hazard rates.",
      "Because the variance of the system is reduced."
    ],
    correctIndex: 1,
    explanation: "Redundancy ensures that the failure of one or more components does not cause system failure, strictly increasing the overall probability of survival."
  },
  {
    question: "If a system has a constant hazard rate $\\lambda$, what is its Mean Time To Failure (MTTF)?",
    options: [
      "$\\lambda$",
      "$\\frac{1}{\\lambda}$",
      "$\\lambda^2$",
      "$\\frac{1}{\\lambda^2}$"
    ],
    correctIndex: 1,
    explanation: "A constant hazard rate implies an Exponential distribution, and the MTTF is the expectation of the Exponential distribution, which is $\\frac{1}{\\lambda}$."
  },
  {
    question: "Which of the following represents the cumulative hazard function $H(t)$, defined as the integral of the hazard rate?",
    options: [
      "$H(t) = \\int_{0}^{t} h(x) \\, dx = -\\ln(R(t))$",
      "$H(t) = \\int_{0}^{t} h(x) \\, dx = \\ln(R(t))$",
      "$H(t) = \\int_{0}^{t} h(x) \\, dx = 1 - R(t)$",
      "$H(t) = \\int_{0}^{t} h(x) \\, dx = e^{-\\lambda t}$"
    ],
    correctIndex: 0,
    explanation: "Integrating $h(x) = \\frac{-R'(x)}{R(x)}$ from $0$ to $t$ yields $-\\ln(R(t)) + \\ln(R(0))$. Since $R(0)=1$ and $\\ln(1)=0$, the result is $-\\ln(R(t))$."
  }
];