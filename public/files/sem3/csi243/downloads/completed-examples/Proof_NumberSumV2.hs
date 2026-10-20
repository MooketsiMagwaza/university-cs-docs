-- Title: Prove the formula for the sum of the first n odd numbers
{-
QUESTION
Claim: total n = n*n for every Integer n >= 0.
Prove the claim by induction on n, using the definitions below. [8]
Give the base case, hypothesis, step and conclusion, with a reason on every line.
The main checks examples; these tests do not replace the proof.
-}

-- Read the question: Prove the universal claim for the stated domain by induction.
-- Plan: Use the recursive equation, the induction hypothesis, then arithmetic.
total :: Integer -> Integer
total 0 = 0
total n = 2*n-1 + total (n - 1)

{-
Claim: total n = n*n for every Integer n >= 0. -- stated goal over mathematical integers
Induct on: n >= 0. -- total decreases n by one
Base case: n = 0. -- least allowed input
total 0 = 0 = 0*0 -- base equation and arithmetic
Hypothesis: assume total k = k*k for k >= 0. -- smaller argument
Step: prove the claim at k+1. -- successor induction
total (k+1) = (2*(k+1)-1) + total k -- recursive equation
= (2*k+1) + k*k -- arithmetic and inductive hypothesis
= (k+1)*(k+1) -- expand the square backwards
Conclusion: the claim holds for every n >= 0. -- induction from base and successor step
-}

main :: IO ()
main = do
  print (all (\n -> total n == n*n) [0..10])  -- expected: True
  print (all (\n -> total n == n*n) [11..30])  -- expected: True
  print (all (\n -> total n == n*n) [31..60])  -- expected: True
  print (all (\n -> total n == n*n) [61..100])  -- expected: True
  print (all (\n -> total n == n*n) [0,1,2,10,100,1000])  -- expected: True
