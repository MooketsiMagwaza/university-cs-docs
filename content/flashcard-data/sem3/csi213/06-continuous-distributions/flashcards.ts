export const flashcardData = [
  {
    front: "What two conditions make $f$ a valid PDF?",
    back: "$f(x)\\ge0$ for every $x$, and $\\int_{-\\infty}^{\\infty}f(x)\\,dx=1$. A PDF value may exceed 1; it is total area, not maximum height, that must equal 1."
  },
  {
    front: "For a continuous variable, what is $P(X=c)$?",
    back: "$P(X=c)=0$ because the interval from $c$ to $c$ has zero width and therefore zero area. This is why strict and inclusive interval endpoints give the same probability."
  },
  {
    front: "How do a PDF and a CDF differ?",
    back: "The PDF $f(x)$ is density height; probabilities are areas under it. The CDF $F(x)=P(X\\le x)$ is accumulated probability. For a continuous variable, $F(x)=\\int_{-\\infty}^x f(t)dt$ and $f(x)=F'(x)$."
  },
  {
    front: "How do you calculate an interval probability from a CDF?",
    back: "$P(a<X\\le b)=F(b)-F(a)$. Subtract the cumulative area up to the lower bound from the cumulative area up to the upper bound."
  },
  {
    front: "What are the expectation and variance formulas for a continuous variable?",
    back: "$E[X]=\\int xf(x)dx$, $E[X^2]=\\int x^2f(x)dx$, and $\\operatorname{Var}(X)=E[X^2]-E[X]^2$, integrating over the full support."
  },
  {
    front: "If $Y=aX+b$, how do its mean and variance change?",
    back: "$E[Y]=aE[X]+b$ and $\\operatorname{Var}(Y)=a^2\\operatorname{Var}(X)$. Adding $b$ shifts but does not spread; multiplying by $a$ scales standard deviation by $|a|$."
  },
  {
    front: "What is the PDF of $U(a,b)$?",
    back: "$f(x)=1/(b-a)$ for $a\\le x\\le b$, and $0$ otherwise. The constant height makes the rectangle's area $(b-a)/(b-a)=1$."
  },
  {
    front: "What are the mean and variance of $U(a,b)$?",
    back: "$E[X]=(a+b)/2$ and $\\operatorname{Var}(X)=(b-a)^2/12$. The mean is the midpoint; the variance depends only on interval width."
  },
  {
    front: "What is the PDF of $\\operatorname{Exp}(\\lambda)$?",
    back: "$f(x)=\\lambda e^{-\\lambda x}$ for $x\\ge0$, and $0$ for $x<0$. The parameter $\\lambda$ is a rate, so its units are inverse time."
  },
  {
    front: "What are the exponential CDF and survival function?",
    back: "$F(x)=P(X\\le x)=1-e^{-\\lambda x}$ and $S(x)=P(X>x)=e^{-\\lambda x}$ for $x\\ge0$."
  },
  {
    front: "How do you find an exponential interval probability?",
    back: "$P(a<X<b)=F(b)-F(a)=e^{-\\lambda a}-e^{-\\lambda b}$. The smaller-time survival probability comes first."
  },
  {
    front: "What are the exponential mean, variance and standard deviation?",
    back: "$E[X]=1/\\lambda$, $\\operatorname{Var}(X)=1/\\lambda^2$, and $\\operatorname{SD}(X)=1/\\lambda$. Rate and mean are reciprocals."
  },
  {
    front: "State the exponential memoryless property.",
    back: "$P(X>s+t\\mid X>s)=P(X>t)$. Given survival to time $s$, the distribution of the additional wait is unchanged."
  },
  {
    front: "What is the connection between Poisson and exponential models?",
    back: "For a Poisson process with rate $\\lambda$, the count in time $t$ is Poisson$(\\lambda t)$ and the wait to the next event is Exp$(\\lambda)$. $P(X>t)=P(N(t)=0)=e^{-\\lambda t}$."
  },
  {
    front: "What do $\\mu$ and $\\sigma$ control in a normal distribution?",
    back: "$\\mu$ is the centre/location. $\\sigma$ is the standard deviation/spread. Increasing $\\mu$ shifts the curve; increasing $\\sigma$ makes it wider and lower."
  },
  {
    front: "What is the standardisation formula?",
    back: "$Z=(X-\\mu)/\\sigma$. It converts a raw value into the number of standard deviations above or below the mean. Divide by $\\sigma$, not $\\sigma^2$."
  },
  {
    front: "What does a cumulative Z-table entry $\\Phi(z)$ mean?",
    back: "$\\Phi(z)=P(Z\\le z)$, the area to the left of $z$ under the standard normal curve. A right tail is $1-\\Phi(z)$."
  },
  {
    front: "What are the key standard-normal symmetry identities?",
    back: "$\\Phi(-z)=1-\\Phi(z)$, $P(Z>z)=P(Z<-z)$, and $P(-z<Z<z)=2\\Phi(z)-1$ for $z>0$."
  },
  {
    front: "How do you find $P(a<X<b)$ for $X\\sim N(\\mu,\\sigma^2)$?",
    back: "Compute $z_a=(a-\\mu)/\\sigma$ and $z_b=(b-\\mu)/\\sigma$, then subtract left areas: $\\Phi(z_b)-\\Phi(z_a)$."
  },
  {
    front: "How do you find a normal cut-off from a probability?",
    back: "Convert the requested area to a left-tail probability, find its $z$-quantile, then un-standardise with $x=\\mu+z\\sigma$."
  },
  {
    front: "What is the 68–95–99.7 rule?",
    back: "Approximately 68.27% of a normal distribution lies within $\\mu\\pm\\sigma$, 95.45% within $\\mu\\pm2\\sigma$, and 99.73% within $\\mu\\pm3\\sigma$."
  },
  {
    front: "If $X\\sim N(\\mu,\\sigma^2)$ and $Y=aX+b$, what is Y's distribution?",
    back: "$Y\\sim N(a\\mu+b,a^2\\sigma^2)$. Normal distributions remain normal under linear transformations."
  },
  {
    front: "What are reliability and hazard?",
    back: "$R(t)=P(T>t)=1-F(t)$ is survival probability. $h(t)=f(t)/R(t)$ is the instantaneous failure rate conditional on survival to $t$."
  },
  {
    front: "How do independent series and parallel reliabilities differ?",
    back: "Series: all must work, so multiply reliabilities, $R_s=\\prod R_i$. Parallel: at least one must work, so complement all failing, $R_p=1-\\prod(1-R_i)$."
  }
];
