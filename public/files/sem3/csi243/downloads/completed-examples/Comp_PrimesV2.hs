-- Title: Generate primes up to a limit
{-
QUESTION
Write isPrime :: Integer -> Bool and primesTo :: Integer -> [Integer]. [6]
Use divisor comprehensions for primality, then a comprehension to list
all primes at most n in ascending order; n < 2 gives [].
-}

-- Read the question: Write isPrime :: Integer -> Bool; primesTo :: Integer -> [Integer].
-- Plan: Generate candidates and retain those satisfying isPrime.
isPrime :: Integer -> Bool
isPrime n = n >= 2 && null [d | d <- [2..n-1], mod n d == 0]

primesTo :: Integer -> [Integer]
primesTo n = [p | p <- [2..n], isPrime p]  -- Filter candidates.

main :: IO ()
main = do
  print (primesTo 0)  -- expected: []
  print (primesTo 1)  -- expected: []
  print (primesTo 2)  -- expected: [2]
  print (primesTo 10)  -- expected: [2,3,5,7]
  print (primesTo 13)  -- expected: [2,3,5,7,11,13]
