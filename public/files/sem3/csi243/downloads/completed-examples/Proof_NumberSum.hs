-- Title: Prove the formula for twice the sum to n
{-
QUESTION
Claim: 2 * total n = n*(n+1) for every Integer n >= 0.
Prove the claim by induction on n, using the definitions below. [8]
Give the base case, hypothesis, step and conclusion, with a reason on every line.
The main checks examples; these tests do not replace the proof.
-}

-- Read the question: Prove the universal claim for the stated domain by induction.
-- Plan: Use the recursive equation, the induction hypothesis, then arithmetic.
total :: Integer -> Integer
total 0 = 0
total n = n + total (n - 1)

{-
Claim: 2 * total n = n*(n+1) for every Integer n >= 0. -- stated goal over mathematical integers
Induct on: n >= 0. -- total decreases n by one
Base case: n = 0. -- least allowed input
2 * total 0 = 2*0 = 0 = 0*(0+1) -- base equation and arithmetic
Hypothesis: assume 2 * total k = k*(k+1) for k >= 0. -- smaller argument
Step: prove the claim at k+1. -- successor induction
2 * total (k+1) = 2 * ((k+1) + total k) -- recursive equation
= 2*(k+1) + 2*total k -- distributivity
= 2*(k+1) + k*(k+1) -- inductive hypothesis
= (k+1)*(k+2) -- factor (k+1) and simplify
Conclusion: the claim holds for every n >= 0. -- induction from base and successor step
-}

main :: IO ()
main = do
  print (all (\n -> 2 * total n == n*(n+1)) [0..10])  -- expected: True
  print (all (\n -> 2 * total n == n*(n+1)) [11..30])  -- expected: True
  print (all (\n -> 2 * total n == n*(n+1)) [31..60])  -- expected: True
  print (all (\n -> 2 * total n == n*(n+1)) [61..100])  -- expected: True
  print (all (\n -> 2 * total n == n*(n+1)) [0,1,2,10,100,1000])  -- expected: True
