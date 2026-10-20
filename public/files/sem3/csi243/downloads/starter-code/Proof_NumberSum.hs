-- Title: Prove the formula for twice the sum to n
{-
QUESTION
Claim: 2 * total n = n*(n+1) for every Integer n >= 0.
Prove the claim by induction on n, using the definitions below. [8]
Give the base case, hypothesis, step and conclusion, with a reason on every line.
The main checks examples; these tests do not replace the proof.
-}

total :: Integer -> Integer
total 0 = 0
total n = n + total (n - 1)

{- Write your proof here -}

main :: IO ()
main = do
  print (all (\n -> 2 * total n == n*(n+1)) [0..10])  -- expected: True
  print (all (\n -> 2 * total n == n*(n+1)) [11..30])  -- expected: True
  print (all (\n -> 2 * total n == n*(n+1)) [31..60])  -- expected: True
  print (all (\n -> 2 * total n == n*(n+1)) [61..100])  -- expected: True
  print (all (\n -> 2 * total n == n*(n+1)) [0,1,2,10,100,1000])  -- expected: True
