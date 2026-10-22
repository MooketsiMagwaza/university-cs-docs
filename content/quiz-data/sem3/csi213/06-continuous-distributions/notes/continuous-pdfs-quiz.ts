export const quizData = [
  {
    question: "Which two conditions must every probability density function $f$ satisfy?",
    options: [
      "$f(x)\\ge0$ for every $x$, and $\\int_{-\\infty}^{\\infty}f(x)\\,dx=1$",
      "$0\\le f(x)\\le1$ for every $x$, and $\\int f(x)\\,dx=0$",
      "$f(x)>0$ for every $x$, and $f(0)=1$",
      "$f$ must be increasing, and its maximum must equal 1"
    ],
    correctIndex: 0,
    explanation: "A PDF cannot have negative density and its total area must equal 1. Its height may exceed 1, provided the total area remains 1."
  },
  {
    question: "For a continuous random variable, what is $P(X=c)$ for a fixed real number $c$?",
    options: ["$f(c)$", "$F(c)$", "$0$", "$1$"],
    correctIndex: 2,
    explanation: "A point has zero width, so $P(X=c)=\\int_c^c f(x)\\,dx=0$."
  },
  {
    question: "If $F$ is the CDF of a continuous variable, which expression gives $P(a<X\\le b)$?",
    options: ["$F(a)+F(b)$", "$F(b)-F(a)$", "$f(b)-f(a)$", "$1-F(a)-F(b)$"],
    correctIndex: 1,
    explanation: "The CDF accumulates area to the left, so subtracting $F(a)$ from $F(b)$ leaves exactly the area between $a$ and $b$."
  },
  {
    question: "Which statement correctly distinguishes a PDF value from a probability?",
    options: [
      "$f(c)=P(X=c)$ for every continuous variable",
      "$f(c)$ is a density height; probability is obtained from area over an interval",
      "Every PDF value must lie between 0 and 1",
      "A PDF is the same function as its CDF"
    ],
    correctIndex: 1,
    explanation: "Density is probability per unit. Integrating density over an interval produces a probability."
  },
  {
    question: "A candidate PDF is $f(x)=cx$ for $0\\le x\\le2$ and zero otherwise. What value of $c$ normalises it?",
    options: ["$1/4$", "$1/2$", "$1$", "$2$"],
    correctIndex: 1,
    explanation: "$1=\\int_0^2cx\\,dx=c[x^2/2]_0^2=2c$, so $c=1/2$."
  },
  {
    question: "Which formula is the variance shortcut for a continuous random variable?",
    options: [
      "$\\operatorname{Var}(X)=E[X^2]+E[X]^2$",
      "$\\operatorname{Var}(X)=E[X^2]-E[X]^2$",
      "$\\operatorname{Var}(X)=E[X]-E[X^2]$",
      "$\\operatorname{Var}(X)=\\sqrt{E[X^2]}$"
    ],
    correctIndex: 1,
    explanation: "Expanding $E[(X-\\mu)^2]$ gives $E[X^2]-\\mu^2$, where $\\mu=E[X]$."
  },
  {
    question: "If $Y=3X-7$, how is its variance related to the variance of $X$?",
    options: [
      "$\\operatorname{Var}(Y)=3\\operatorname{Var}(X)-7$",
      "$\\operatorname{Var}(Y)=9\\operatorname{Var}(X)$",
      "$\\operatorname{Var}(Y)=3\\operatorname{Var}(X)$",
      "$\\operatorname{Var}(Y)=\\operatorname{Var}(X)-7$"
    ],
    correctIndex: 1,
    explanation: "For $Y=aX+b$, variance is multiplied by $a^2$ and is unaffected by the shift $b$."
  },
  {
    question: "Which property must every CDF have?",
    options: [
      "It must be decreasing",
      "It must be non-decreasing and remain between 0 and 1",
      "It must have total integral 1",
      "It must be symmetric about 0"
    ],
    correctIndex: 1,
    explanation: "A CDF is accumulated probability, so it can never decrease and can never leave the interval from 0 to 1."
  },
  {
    question: "For a very small positive $\\Delta x$, which expression approximates $P(x<X<x+\\Delta x)$?",
    options: ["$f(x)+\\Delta x$", "$f(x)\\Delta x$", "$F(x)\\Delta x^2$", "$f'(x)\\Delta x$"],
    correctIndex: 1,
    explanation: "Over a narrow interval the density is approximately constant, so area is approximately height times width."
  },
  {
    question: "Why are $P(a<X<b)$ and $P(a\\le X\\le b)$ equal for a continuous random variable?",
    options: [
      "Because every interval has probability 1",
      "Because the two endpoint probabilities are zero",
      "Because $a$ and $b$ must be equal",
      "Because the PDF is always constant"
    ],
    correctIndex: 1,
    explanation: "Adding or removing finitely many points changes the probability by zero because $P(X=a)=P(X=b)=0$."
  }
];
