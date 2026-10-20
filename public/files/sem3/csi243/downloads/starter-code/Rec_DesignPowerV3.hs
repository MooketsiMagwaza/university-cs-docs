-- Title: Extend recursive power to negative exponents
{-
QUESTION
Write power with the signature below. Return Nothing for a zero base
and negative exponent; otherwise return the signed integral power.
Use recursion and reciprocals, not a built-in power operator.
-}

power :: Double -> Int -> Maybe Double
power = undefined -- Your answer here

main :: IO ()
main = do
  print (power 2 (-3))  -- expected: Just 0.125
  print (power 0 (-1))  -- expected: Nothing
  print (power 0 0)  -- expected: Just 1.0
  print (power (-2) 3)  -- expected: Just (-8.0)
  print (power 0.5 2)  -- expected: Just 0.25
