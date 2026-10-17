export const quizData = [
  {
    question: "Which of the following correctly defines the population Simple Linear Regression model?",
    options: [
      "$y_i = \\hat{\\beta}_0 + \\hat{\\beta}_1 x_i + e_i$",
      "$y_i = \\beta_0 + \\beta_1 x_i + \\epsilon_i$",
      "$\\hat{y}_i = \\beta_0 + \\beta_1 x_i + \\epsilon_i$",
      "$y_i = \\beta_0 + \\beta_1 x_i$"
    ],
    correctIndex: 1,
    explanation: "The population model uses true parameters ($\\beta_0, \\beta_1$) and the unobservable random error term $\\epsilon_i$. The fitted model uses estimators ($\\hat{\\beta}_0, \\hat{\\beta}_1$) and residuals ($e_i$)."
  },
  {
    question: "What is the formal mathematical objective function that Ordinary Least Squares (OLS) seeks to minimize?",
    options: [
      "The Sum of Absolute Errors: $\\sum_{i=1}^n |y_i - \\hat{y}_i|$",
      "The Sum of Squared Errors (SSE): $\\sum_{i=1}^n (y_i - \\beta_0 - \\beta_1 x_i)^2$",
      "The Regression Sum of Squares (SSR): $\\sum_{i=1}^n (\\hat{y}_i - \\bar{y})^2$",
      "The Total Sum of Squares (SST): $\\sum_{i=1}^n (y_i - \\bar{y})^2$"
    ],
    correctIndex: 1,
    explanation: "OLS finds the parameters $\\beta_0$ and $\\beta_1$ that minimize the Sum of Squared Errors (SSE), also known as the Residual Sum of Squares."
  },
  {
    question: "In the multivariate calculus derivation of OLS, what are the first-order conditions for minimizing the SSE?",
    options: [
      "Setting the second partial derivatives with respect to $\\beta_0$ and $\\beta_1$ to zero.",
      "Setting the first partial derivatives with respect to $\\beta_0$ and $\\beta_1$ to zero.",
      "Setting the total derivative of SSE with respect to $x_i$ to zero.",
      "Equating the SSE to the SSR."
    ],
    correctIndex: 1,
    explanation: "To find the minimum of a multivariate function, we take the first partial derivatives with respect to each parameter and set them equal to zero."
  },
  {
    question: "What is the first normal equation derived from setting $\\frac{\\partial SSE}{\\partial \\beta_0} = 0$?",
    options: [
      "$\\sum_{i=1}^n x_i(y_i - \\beta_0 - \\beta_1 x_i) = 0$",
      "$\\sum_{i=1}^n (y_i - \\beta_0 - \\beta_1 x_i) = 0$",
      "$\\sum_{i=1}^n (y_i - \\beta_0 - \\beta_1 x_i)^2 = 0$",
      "$\\sum_{i=1}^n x_i^2(y_i - \\beta_0 - \\beta_1 x_i) = 0$"
    ],
    correctIndex: 1,
    explanation: "Differentiating SSE with respect to $\\beta_0$ yields $-2 \\sum (y_i - \\beta_0 - \\beta_1 x_i)$. Setting this to zero and dividing by -2 gives the first normal equation."
  },
  {
    question: "What is the second normal equation derived from setting $\\frac{\\partial SSE}{\\partial \\beta_1} = 0$?",
    options: [
      "$\\sum_{i=1}^n (y_i - \\beta_0 - \\beta_1 x_i) = 0$",
      "$\\sum_{i=1}^n x_i(y_i - \\beta_0 - \\beta_1 x_i) = 0$",
      "$\\sum_{i=1}^n x_i^2(y_i - \\beta_0 - \\beta_1 x_i) = 0$",
      "$\\sum_{i=1}^n (y_i - \\beta_0 - \\beta_1 x_i)^2 = 0$"
    ],
    correctIndex: 1,
    explanation: "Differentiating SSE with respect to $\\beta_1$ using the chain rule yields $-2 \\sum x_i(y_i - \\beta_0 - \\beta_1 x_i)$. Setting this to zero gives the second normal equation."
  },
  {
    question: "Solving the first normal equation for $\\beta_0$ yields which estimator formula?",
    options: [
      "$\\hat{\\beta}_0 = \\bar{y} + \\hat{\\beta}_1 \\bar{x}$",
      "$\\hat{\\beta}_0 = \\bar{y} - \\hat{\\beta}_1 \\bar{x}$",
      "$\\hat{\\beta}_0 = \\frac{\\sum y_i}{n} - \\hat{\\beta}_1 \\frac{\\sum x_i}{n}$",
      "Both B and C are correct."
    ],
    correctIndex: 3,
    explanation: "Rearranging $\\sum y_i - n\\beta_0 - \\beta_1 \\sum x_i = 0$ and dividing by $n$ yields $\\bar{y} - \\beta_0 - \\beta_1 \\bar{x} = 0$, which solves to $\\hat{\\beta}_0 = \\bar{y} - \\hat{\\beta}_1 \\bar{x}$."
  },
  {
    question: "What fundamental geometric property does the OLS regression line $\\hat{y}_i = \\hat{\\beta}_0 + \\hat{\\beta}_1 x_i$ always satisfy?",
    options: [
      "It passes through the origin $(0, 0)$.",
      "It passes through the centroid of the data $(\\bar{x}, \\bar{y})$.",
      "It is always orthogonal to the x-axis.",
      "It minimizes the horizontal distances to the data points."
    ],
    correctIndex: 1,
    explanation: "Because $\\hat{\\beta}_0 = \\bar{y} - \\hat{\\beta}_1 \\bar{x}$, substituting $x = \\bar{x}$ into the regression equation yields $\\hat{y} = \\bar{y}$. Thus, the line always passes through $(\\bar{x}, \\bar{y})$."
  },
  {
    question: "Which of the following represents the standard computational formula for the OLS slope estimator $\\hat{\\beta}_1$?",
    options: [
      "$\\hat{\\beta}_1 = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum (x_i - \\bar{x})^2}$",
      "$\\hat{\\beta}_1 = \\frac{\\sum (x_i - \\bar{x})^2}{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}$",
      "$\\hat{\\beta}_1 = \\frac{\\sum x_i y_i}{\\sum x_i^2}$",
      "$\\hat{\\beta}_1 = \\frac{n\\sum x_i^2 - (\\sum x_i)^2}{n\\sum x_i y_i - (\\sum x_i)(\\sum y_i)}$"
    ],
    correctIndex: 0,
    explanation: "The slope estimator is the ratio of the sum of cross-products of deviations to the sum of squared deviations of $x$."
  },
  {
    question: "Which algebraic identity is used to transform $\\sum x_i (x_i - \\bar{x})$ into $\\sum (x_i - \\bar{x})^2$ during the OLS derivation?",
    options: [
      "$\\sum x_i (x_i - \\bar{x}) = \\sum x_i^2 - n\\bar{x}^2 = \\sum (x_i - \\bar{x})^2$",
      "$\\sum x_i (x_i - \\bar{x}) = \\sum x_i^2 + n\\bar{x}^2$",
      "$\\sum x_i (x_i - \\bar{x}) = (\\sum x_i)^2 - n\\bar{x}^2$",
      "$\\sum x_i (x_i - \\bar{x}) = \\sum x_i^2 - \\bar{x}$"
    ],
    correctIndex: 0,
    explanation: "Expanding $\\sum x_i (x_i - \\bar{x})$ gives $\\sum x_i^2 - \\bar{x}\\sum x_i$. Since $\\sum x_i = n\\bar{x}$, this becomes $\\sum x_i^2 - n\\bar{x}^2$, which is algebraically equivalent to $\\sum (x_i - \\bar{x})^2$."
  },
  {
    question: "What does the term $\\epsilon_i$ represent in the population regression model $y_i = \\beta_0 + \\beta_1 x_i + \\epsilon_i$?",
    options: [
      "The residual, which is the observable difference between $y_i$ and $\\hat{y}_i$.",
      "The random error term, representing all unobserved factors affecting $y_i$.",
      "The variance of the dependent variable.",
      "The measurement error in the independent variable $x_i$."
    ],
    correctIndex: 1,
    explanation: "$\\epsilon_i$ is the unobservable stochastic error term capturing all factors other than $x_i$ that influence $y_i$, as well as inherent randomness."
  },
  {
    question: "What is the formal definition of the residual $e_i$ in the fitted OLS model?",
    options: [
      "$e_i = y_i - \\bar{y}$",
      "$e_i = \\hat{y}_i - \\bar{y}$",
      "$e_i = y_i - \\hat{y}_i$",
      "$e_i = \\hat{y}_i - y_i$"
    ],
    correctIndex: 2,
    explanation: "The residual is the observable difference between the actual observed value $y_i$ and the value predicted by the model $\\hat{y}_i$."
  },
  {
    question: "In the context of OLS, what is the relationship between the sum of the residuals $\\sum_{i=1}^n e_i$ and the first normal equation?",
    options: [
      "$\\sum_{i=1}^n e_i = 1$",
      "$\\sum_{i=1}^n e_i = \\bar{y}$",
      "$\\sum_{i=1}^n e_i = 0$",
      "$\\sum_{i=1}^n e_i = \\hat{\\beta}_1$"
    ],
    correctIndex: 2,
    explanation: "The first normal equation $\\sum (y_i - \\hat{\\beta}_0 - \\hat{\\beta}_1 x_i) = 0$ is exactly the statement that the sum of the residuals $\\sum e_i$ equals zero."
  },
  {
    question: "What is the relationship between the sum of the product of the residuals and the independent variable, $\\sum_{i=1}^n e_i x_i$?",
    options: [
      "It equals the sample variance of $x$.",
      "It equals the sample covariance of $x$ and $y$.",
      "It equals $0$.",
      "It equals $1$."
    ],
    correctIndex: 2,
    explanation: "The second normal equation $\\sum x_i(y_i - \\hat{\\beta}_0 - \\hat{\\beta}_1 x_i) = 0$ dictates that $\\sum e_i x_i = 0$. This means the residuals are orthogonal to the predictor variable."
  },
  {
    question: "If the OLS slope estimator $\\hat{\\beta}_1 = 0$, what is the equation of the fitted regression line?",
    options: [
      "$\\hat{y}_i = 0$",
      "$\\hat{y}_i = x_i$",
      "$\\hat{y}_i = \\bar{y}$",
      "$\\hat{y}_i = \\bar{x}$"
    ],
    correctIndex: 2,
    explanation: "If $\\hat{\\beta}_1 = 0$, then $\\hat{\\beta}_0 = \\bar{y} - (0)\\bar{x} = \\bar{y}$. The regression line is a horizontal line at the mean of $y$."
  },
  {
    question: "The OLS estimator $\\hat{\\beta}_1$ can be expressed as the ratio of which two sample statistics?",
    options: [
      "Sample variance of $Y$ to sample variance of $X$.",
      "Sample covariance of $X$ and $Y$ to sample variance of $X$.",
      "Sample correlation of $X$ and $Y$ to sample variance of $Y$.",
      "Sample mean of $Y$ to sample mean of $X$."
    ],
    correctIndex: 1,
    explanation: "$\\hat{\\beta}_1 = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum (x_i - \\bar{x})^2} = \\frac{S_{xy}}{S_{xx}}$, which is the sample covariance divided by the sample variance of $X$."
  }
];