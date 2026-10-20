-- Title: Use signed integral exponents with ^^
{-
QUESTION
Write power :: Double -> Int -> Double using (^^).
Negative exponents require a nonzero base.
-}

power :: Double -> Int -> Double
power = undefined -- Your answer here

main :: IO ()
main = do
  print (power 2 (-3))  -- expected: 0.125
  print (power (-2) (-2))  -- expected: 0.25
  print (power 2 0)  -- expected: 1.0
  print (power 0 2)  -- expected: 0.0
  print (power 0.5 2)  -- expected: 0.25
