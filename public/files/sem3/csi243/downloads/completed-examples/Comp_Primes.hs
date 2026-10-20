-- Title: Test primality with a factor comprehension
{-
QUESTION
Write isPrime :: Integer -> Bool using a comprehension of divisors. [5]
A prime is at least 2 and has no divisors from 2 to n-1.
-}

-- Read the question: Write isPrime :: Integer -> Bool.
-- Plan: Reject values below two and test that the divisor list is empty.
isPrime :: Integer -> Bool
isPrime n = n >= 2 && null [d | d <- [2..n-1], mod n d == 0]

main :: IO ()
main = do
  print (isPrime 0)  -- expected: False
  print (isPrime 1)  -- expected: False
  print (isPrime 2)  -- expected: True
  print (isPrime 9)  -- expected: False
  print (isPrime 13)  -- expected: True
