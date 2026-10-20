-- Title: Use integral exponents with ^
{-
QUESTION
Write power :: Integer -> Int -> Integer using (^).
The exponent is non-negative; include zero to check the identity.
-}

power :: Integer -> Int -> Integer
power = undefined -- Your answer here

main :: IO ()
main = do
  print (power 2 3)  -- expected: 8
  print (power (-2) 3)  -- expected: -8
  print (power (-2) 4)  -- expected: 16
  print (power 0 3)  -- expected: 0
  print (power 5 0)  -- expected: 1
