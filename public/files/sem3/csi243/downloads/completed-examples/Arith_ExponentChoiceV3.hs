-- Title: Check floating powers with a tolerance
{-
QUESTION
Write power :: Double -> Double -> Bool. For a non-negative base x,
use (**) to test whether x**e is within 0.000001 of sqrt x.
The test inputs use e=0.5. Do not assume floating powers are exact.
-}

-- Read the question: Write power with the stated exponent domain and result type.
-- Plan: Choose the operator from the exponent type and check the domain.
power :: Double -> Double -> Bool
-- Key step: ^ needs non-negative integers; ^^ allows signed integers; ** uses floating exponents.
power x e = abs (x ** e - sqrt x) <= 0.000001

main :: IO ()
main = do
  print (power 0 0.5)  -- expected: True
  print (power 1 0.5)  -- expected: True
  print (power 4 0.5)  -- expected: True
  print (power 9 0.5)  -- expected: True
  print (power 2 0.5)  -- expected: True
