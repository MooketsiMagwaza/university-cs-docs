-- Title: Use integral exponents with ^
{-
QUESTION
Write power :: Integer -> Int -> Integer using (^).
The exponent is non-negative; include zero to check the identity.
-}

-- Read the question: Write power with the stated exponent domain and result type.
-- Plan: Choose the operator from the exponent type and check the domain.
power :: Integer -> Int -> Integer
-- Key step: ^ needs non-negative integers; ^^ allows signed integers; ** uses floating exponents.
power x n = x ^ n

main :: IO ()
main = do
  print (power 2 3)  -- expected: 8
  print (power (-2) 3)  -- expected: -8
  print (power (-2) 4)  -- expected: 16
  print (power 0 3)  -- expected: 0
  print (power 5 0)  -- expected: 1
