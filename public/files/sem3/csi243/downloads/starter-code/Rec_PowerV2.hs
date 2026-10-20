-- Title: Compute exact powers of a fractional base
{-
QUESTION
Write power :: Double -> Int -> Double recursively. [4]
Assume a non-negative exponent and define the zeroth power as 1.
-}

power :: Double -> Int -> Double
power = undefined  -- Your answer here

main :: IO ()
main = do
  print (power 0.5 0)  -- expected: 1.0
  print (power 0.5 1)  -- expected: 0.5
  print (power 0.5 3)  -- expected: 0.125
  print (power 2.5 2)  -- expected: 6.25
  print (power (-2) 3)  -- expected: -8.0
