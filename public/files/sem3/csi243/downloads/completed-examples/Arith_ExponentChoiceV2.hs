-- Title: Use signed integral exponents with ^^
{-
QUESTION
Write power :: Double -> Int -> Double using (^^).
Negative exponents require a nonzero base.
-}

-- Read the question: Write power with the stated exponent domain and result type.
-- Plan: Choose the operator from the exponent type and check the domain.
power :: Double -> Int -> Double
-- Key step: ^ needs non-negative integers; ^^ allows signed integers; ** uses floating exponents.
power x n = x ^^ n

main :: IO ()
main = do
  print (power 2 (-3))  -- expected: 0.125
  print (power (-2) (-2))  -- expected: 0.25
  print (power 2 0)  -- expected: 1.0
  print (power 0 2)  -- expected: 0.0
  print (power 0.5 2)  -- expected: 0.25
