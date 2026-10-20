-- Title: Test primality with a factor comprehension
{-
QUESTION
Write isPrime :: Integer -> Bool using a comprehension of divisors. [5]
A prime is at least 2 and has no divisors from 2 to n-1.
-}

isPrime :: Integer -> Bool
isPrime = undefined  -- Your answer here

main :: IO ()
main = do
  print (isPrime 0)  -- expected: False
  print (isPrime 1)  -- expected: False
  print (isPrime 2)  -- expected: True
  print (isPrime 9)  -- expected: False
  print (isPrime 13)  -- expected: True
