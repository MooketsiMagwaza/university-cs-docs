-- Title: Compare non-negative power operators
{-
QUESTION
Write power :: Double -> Int -> Bool. For a non-negative exponent n,
compare x^n and x^^n exactly, then compare x**fromIntegral n with
x^n using absolute tolerance 0.000001. Inputs have positive bases.
-}

power :: Double -> Int -> Bool
power = undefined -- Your answer here

main :: IO ()
main = do
  print (power 1 0)  -- expected: True
  print (power 2 1)  -- expected: True
  print (power 2 3)  -- expected: True
  print (power 0.5 2)  -- expected: True
  print (power 3 2)  -- expected: True
