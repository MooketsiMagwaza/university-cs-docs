export const quizData = [
  {
    question: "Which of the following correctly defines the Total Sum of Squares (SST)?",
    options: [
      "$\\sum_{i=1}^n (\\hat{y}_i - \\bar{y})^2$",
      "$\\sum_{i=1}^n (y_i - \\hat{y}_i)^2$",
      "$\\sum_{i=1}^n (y_i - \\bar{y})^2$",
      "$\\sum_{i=1}^n (y_i - \\bar{x})^2$"
    ],
    correctIndex: 2,
    explanation: "SST measures the total variation in the observed dependent variable $Y$ around its mean $\\bar{y}$."
  },
  {
    question: "Which of the following correctly defines the Regression Sum of Squares (SSR)?",
    options: [
      "$\\sum_{i=1}^n (y_i - \\bar{y})^2$",
      "$\\sum_{i=1}^n (\\hat{y}_i - \\bar{y})^2$",
      "$\\sum_{i=1}^n (y_i - \\hat{y}_i)^2$",
      "$\\sum_{i=1}^n (\\hat{y}_i - y_i)^2$"
    ],
    correctIndex: 1,
    explanation: "SSR measures the variation in the dependent variable that is explained by the regression model (the variation of the predicted values around the mean)."
  },
  {
    question: "Which of the following correctly defines the Error Sum of Squares (SSE)?",
    options: [
      "$\\sum_{i=1}^n (y_i - \\bar{y})^2$",
      "$\\sum_{i=1}^n (\\hat{y}_i - \\bar{y})^2$",
      "$\\sum_{i=1}^n (y_i - \\hat{y}_i)^2$",
      "$\\sum_{i=1}^n (\\hat{y}_i - \\bar{x})^2$"
    ],
    correctIndex: 2,
    explanation: "SSE (or Residual Sum of Squares) measures the unexplained variation, which is the sum of the squared differences between observed and predicted values."
  },
  {
    question: "Which of the following correctly states the fundamental ANOVA Identity?",
    options: [
      "$SST = SSR - SSE$",
      "$SST = SSR + SSE$",
      "$SSR = SST + SSE$",
      "$SSE = SST + SSR$"
    ],
    correctIndex: 1,
    explanation: "The total variation (SST) is exactly partitioned into the variation explained by the model (SSR) and the unexplained residual variation (SSE)."
  },
  {
    question: "In the algebraic proof of the ANOVA identity, what is the first step in decomposing the deviation from the mean $(y_i - \\bar{y})$?",
    options: [
      "Squaring the term immediately.",
      "Adding and subtracting the predicted value $\\hat{y}_i$: $(y_i - \\hat{y}_i) + (\\hat{y}_i - \\bar{y})$.",
      "Substituting $\\hat{\\beta}_1 x_i$ for $y_i$.",
      "Multiplying by the residual $e_i$."
    ],
    correctIndex: 1,
    explanation: "The proof begins by algebraically inserting $-\\hat{y}_i + \\hat{y}_i$ (which equals 0) into the expression to separate the residual from the explained deviation."
  },
  {
    question: "When expanding $\\sum [e_i + (\\hat{y}_i - \\bar{y})]^2$ in the ANOVA proof, what is the cross-product term?",
    options: [
      "$2 \\sum e_i (\\hat{y}_i - \\bar{y})$",
      "$\\sum e_i^2 (\\hat{y}_i - \\bar{y})^2$",
      "$2 \\sum e_i^2$",
      "$\\sum (\\hat{y}_i - \\bar{y})$"
    ],
    correctIndex: 0,
    explanation: "Expanding the square $(a+b)^2 = a^2 + b^2 + 2ab$ yields the cross-product term $2 \\sum e_i (\\hat{y}_i - \\bar{y})$."
  },
  {
    question: "Why does the cross-product term $2 \\sum e_i (\\hat{y}_i - \\bar{y})$ evaluate to exactly zero in the ANOVA proof?",
    options: [
      "Because $e_i$ is always positive.",
      "Because $\\hat{y}_i$ always equals $\\bar{y}$.",
      "Because the OLS normal equations guarantee $\\sum e_i = 0$ and $\\sum e_i x_i = 0$.",
      "Because the sample size $n$ is infinite."
    ],
    correctIndex: 2,
    explanation: "Substituting $\\hat{y}_i - \\bar{y} = \\hat{\\beta}_1(x_i - \\bar{x})$ into the cross-term yields $2\\hat{\\beta}_1(\\sum e_i x_i - \\bar{x}\\sum e_i)$. Both sums are zero due to the OLS normal equations."
  },
  {
    question: "Which of the following correctly defines the Pearson Correlation Coefficient $r$?",
    options: [
      "$r = \\frac{\\sum (x_i - \\bar{x})^2}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\sum (y_i - \\bar{y})^2}}$",
      "$r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\sum (y_i - \\bar{y})^2}}$",
      "$r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum (x_i - \\bar{x})^2 + \\sum (y_i - \\bar{y})^2}$",
      "$r = \\frac{\\sum x_i y_i}{\\sqrt{\\sum x_i^2 \\sum y_i^2}}$"
    ],
    correctIndex: 1,
    explanation: "Pearson $r$ is the sample covariance of $X$ and $Y$ divided by the product of their sample standard deviations."
  },
  {
    question: "What is the strict mathematical range of valid values for the Pearson Correlation Coefficient $r$?",
    options: [
      "$0 \\le r \\le 1$",
      "$-1 \\le r \\le 1$",
      "$-\\infty < r < \\infty$",
      "$0 \\le r \\le \\infty$"
    ],
    correctIndex: 1,
    explanation: "By the Cauchy-Schwarz inequality, the correlation coefficient is strictly bounded between -1 and 1, inclusive."
  },
  {
    question: "What is the mathematical relationship between the sign of the Pearson correlation $r$ and the OLS slope estimator $\\hat{\\beta}_1$?",
    options: [
      "They always have opposite signs.",
      "They always have the same sign.",
      "They are independent of each other.",
      "$r$ is always positive, while $\\hat{\\beta}_1$ can be negative."
    ],
    correctIndex: 1,
    explanation: "Since $\\hat{\\beta}_1 = r \\frac{s_y}{s_x}$ and standard deviations $s_y, s_x$ are always positive, $\\hat{\\beta}_1$ and $r$ must share the exact same sign."
  },
  {
    question: "Which of the following correctly defines the Coefficient of Determination $R^2$ in terms of sums of squares?",
    options: [
      "$R^2 = \\frac{SSE}{SST}$",
      "$R^2 = \\frac{SSR}{SST}$",
      "$R^2 = \\frac{SST}{SSR}$",
      "$R^2 = 1 + \\frac{SSE}{SST}$"
    ],
    correctIndex: 1,
    explanation: "$R^2$ represents the proportion of total variation explained by the model, which is the ratio of Regression Sum of Squares to Total Sum of Squares."
  },
  {
    question: "In the specific context of *simple* linear regression (one independent variable), what is the exact mathematical relationship between $R^2$ and $r$?",
    options: [
      "$R^2 = r$",
      "$R^2 = |r|$",
      "$R^2 = r^2$",
      "$R^2 = \\sqrt{r}$"
    ],
    correctIndex: 2,
    explanation: "In simple linear regression, the coefficient of determination is exactly equal to the square of the Pearson correlation coefficient."
  },
  {
    question: "Which of the following is a critical 'Interpretation Trap' regarding a high $R^2$ value?",
    options: [
      "A high $R^2$ guarantees that the linear model is the true underlying relationship.",
      "A high $R^2$ proves that the OLS assumptions (homoscedasticity, normality) are met.",
      "A high $R^2$ only indicates a strong linear fit, but does not validate model assumptions or prove causation.",
      "A high $R^2$ means there are no outliers in the dataset."
    ],
    correctIndex: 2,
    explanation: "A high $R^2$ merely indicates that the data points are close to the fitted line. It does not prove the relationship is truly linear, nor does it validate statistical assumptions."
  },
  {
    question: "In the context of multiple regression, what is the mathematical behavior of $R^2$ when a new predictor variable is added to the model?",
    options: [
      "It always decreases.",
      "It always remains exactly the same.",
      "It never decreases (it either increases or stays the same).",
      "It becomes negative."
    ],
    correctIndex: 2,
    explanation: "Adding any variable, even a completely irrelevant one, provides the OLS algorithm with more flexibility to fit the noise, so $R^2$ will never decrease. This is why Adjusted $R^2$ is used for model comparison."
  },
  {
    question: "What is the formal statistical interpretation of an $R^2$ value of $0.70$?",
    options: [
      "70% of the observations fall exactly on the regression line.",
      "70% of the variation in the dependent variable is explained by the linear relationship with the independent variable(s).",
      "The correlation between $X$ and $Y$ is 0.70.",
      "The model has a 70% chance of being correct."
    ],
    correctIndex: 1,
    explanation: "$R^2$ is formally defined as the proportion (or percentage) of the total variance in the dependent variable that is predictable from the independent variable(s)."
  }
];