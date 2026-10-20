-- Title: Compute exact powers of a fractional base
{-
QUESTION
Write power :: Double -> Int -> Double recursively. [4]
Assume a non-negative exponent and define the zeroth power as 1.
-}

-- Read the question: Write power :: Double -> Int -> Double.
-- Plan: Use the same recursion with a Double base.
power :: Double -> Int -> Double
power _ 0 = 1  -- Multiplicative identity.
power b n = b * power b (n - 1)

main :: IO ()
main = do
  print (power 0.5 0)  -- expected: 1.0
  print (power 0.5 1)  -- expected: 0.5
  print (power 0.5 3)  -- expected: 0.125
  print (power 2.5 2)  -- expected: 6.25
  print (power (-2) 3)  -- expected: -8.0
