export const quizData = [
  {
    question: "A function is non-negative but its total integral is 1.4. What is the correct conclusion?",
    options: ["It is a valid PDF", "It is a valid CDF", "It is not a valid PDF because total area is not 1", "It becomes valid if its maximum is below 1"],
    correctIndex: 2,
    explanation: "A valid PDF must have total area exactly 1. Non-negativity alone is not sufficient."
  },
  {
    question: "For a continuous random variable with CDF $F$, which expression gives $P(X>7)$?",
    options: ["$F(7)$", "$1-F(7)$", "$f(7)$", "$F(7)-1$"],
    correctIndex: 1,
    explanation: "$F(7)=P(X\\le7)$, so its complement is $P(X>7)=1-F(7)$."
  },
  {
    question: "A PDF is $f(x)=c$ on $2\\le x\\le6$ and zero otherwise. What is $c$?",
    options: ["$1/6$", "$1/4$", "$1/2$", "$4$"],
    correctIndex: 1,
    explanation: "The support width is $6-2=4$, so the rectangle needs height $1/4$ to have area 1."
  },
  {
    question: "If $E[X]=4$ and $E[X^2]=22$, what is $\\operatorname{Var}(X)$?",
    options: ["$2$", "$6$", "$18$", "$38$"],
    correctIndex: 1,
    explanation: "$\\operatorname{Var}(X)=E[X^2]-E[X]^2=22-16=6$."
  },
  {
    question: "For $X\\sim U(4,10)$, what is $P(5<X<8)$?",
    options: ["$1/3$", "$1/2$", "$2/3$", "$3/4$"],
    correctIndex: 1,
    explanation: "The desired interval has width 3 and the full support has width 6, so the probability is $3/6=1/2$."
  },
  {
    question: "For $X\\sim U(-2,4)$, what is $E[X]$?",
    options: ["$-1$", "$0$", "$1$", "$2$"],
    correctIndex: 2,
    explanation: "The uniform mean is the midpoint: $(-2+4)/2=1$."
  },
  {
    question: "An exponential waiting time has mean 8 minutes. What is its rate in events per minute?",
    options: ["$8$", "$1/8$", "$1/64$", "$64$"],
    correctIndex: 1,
    explanation: "For an exponential variable, $E[X]=1/\\lambda$, so $\\lambda=1/8$ per minute."
  },
  {
    question: "If $X\\sim\\operatorname{Exp}(0.5)$, which expression gives $P(2<X<5)$?",
    options: ["$e^{-2.5}-e^{-1}$", "$e^{-1}-e^{-2.5}$", "$1-e^{-1}-e^{-2.5}$", "$e^{-3.5}$"],
    correctIndex: 1,
    explanation: "$P(a<X<b)=e^{-\\lambda a}-e^{-\\lambda b}=e^{-1}-e^{-2.5}$."
  },
  {
    question: "For an exponential lifetime, $P(X>10)=0.2$. What is $P(X>15\\mid X>10)$?",
    options: ["$P(X>5)$", "$P(X>10)$", "$P(X>15)$", "$0$"],
    correctIndex: 0,
    explanation: "Memorylessness removes the already-survived 10 units: $P(X>10+5\\mid X>10)=P(X>5)$."
  },
  {
    question: "If $X\\sim N(50,9)$, which values are $\\mu$ and $\\sigma$?",
    options: ["$\\mu=50,\\sigma=9$", "$\\mu=50,\\sigma=3$", "$\\mu=9,\\sigma=50$", "$\\mu=3,\\sigma=50$"],
    correctIndex: 1,
    explanation: "The second normal parameter is variance $\\sigma^2=9$, so the standard deviation is $\\sigma=3$."
  },
  {
    question: "A value is below the mean of a normal distribution. What must be true of its Z-score?",
    options: ["It is positive", "It is zero", "It is negative", "It is greater than 1"],
    correctIndex: 2,
    explanation: "$z=(x-\\mu)/\\sigma$ has a negative numerator when $x<\\mu$, and $\\sigma$ is positive."
  },
  {
    question: "A cumulative Z-table gives $\\Phi(1.25)=0.8944$. What is $P(Z>1.25)$?",
    options: ["$0.8944$", "$0.1056$", "$0.7888$", "$1.8944$"],
    correctIndex: 1,
    explanation: "The table gives left area, so the right tail is $1-0.8944=0.1056$."
  },
  {
    question: "What is $P(-1.25<Z<1.25)$ if $\\Phi(1.25)=0.8944$?",
    options: ["$0.1056$", "$0.3944$", "$0.7888$", "$0.8944$"],
    correctIndex: 2,
    explanation: "By symmetry, central area $=2\\Phi(1.25)-1=2(0.8944)-1=0.7888$."
  },
  {
    question: "To find the cut-off for the highest 10% of a normal distribution, which left-tail area should be located in a cumulative Z-table?",
    options: ["$0.10$", "$0.20$", "$0.90$", "$0.95$"],
    correctIndex: 2,
    explanation: "If 10% is to the right, then 90% is to the left of the cut-off."
  },
  {
    question: "If $X\\sim N(20,4)$ and $Y=3X+1$, what is the variance of $Y$?",
    options: ["$12$", "$13$", "$36$", "$61$"],
    correctIndex: 2,
    explanation: "$\\operatorname{Var}(Y)=3^2\\operatorname{Var}(X)=9(4)=36$; the added constant does not affect variance."
  }
];
