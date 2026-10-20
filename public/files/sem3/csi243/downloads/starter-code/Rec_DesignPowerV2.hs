-- Title: Design power by exponentiation by squaring
{-
QUESTION
Write power with the signature below. Return Nothing for a negative
exponent; define x^0 as 1, including 0^0 for this algorithm.
Use exponentiation by squaring and share the half-power result.
-}

power :: Integer -> Int -> Maybe Integer
power = undefined -- Your answer here

main :: IO ()
main = do
  print (power 0 0)  -- expected: Just 1
  print (power 2 5)  -- expected: Just 32
  print (power (-2) 3)  -- expected: Just (-8)
  print (power 3 1)  -- expected: Just 3
  print (power 2 (-1))  -- expected: Nothing
