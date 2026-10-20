-- Title: Generate primes up to a limit
{-
QUESTION
Write isPrime :: Integer -> Bool and primesTo :: Integer -> [Integer]. [6]
Use divisor comprehensions for primality, then a comprehension to list
all primes at most n in ascending order; n < 2 gives [].
-}

isPrime :: Integer -> Bool
isPrime = undefined  -- Your answer here

primesTo :: Integer -> [Integer]
primesTo = undefined  -- Your answer here

main :: IO ()
main = do
  print (primesTo 0)  -- expected: []
  print (primesTo 1)  -- expected: []
  print (primesTo 2)  -- expected: [2]
  print (primesTo 10)  -- expected: [2,3,5,7]
  print (primesTo 13)  -- expected: [2,3,5,7,11,13]
