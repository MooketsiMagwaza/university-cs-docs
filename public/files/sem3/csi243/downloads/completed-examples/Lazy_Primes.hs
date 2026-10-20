-- Title: Generate primes with a lazy sieve
{-
QUESTION
Write sieve :: [Integer] -> [Integer] and primes :: [Integer]. [6]
For increasing candidates starting at 2, emit the head and sieve the tail
after removing multiples of that head. Define primes by sieving [2..].
-}

-- Read the question: Write sieve :: [Integer] -> [Integer]; primes :: [Integer].
-- Plan: Emit each surviving head before filtering its tail.
sieve :: [Integer] -> [Integer]
sieve [] = []
sieve (p:xs) = p : sieve [x | x <- xs, mod x p /= 0]  -- Remove multiples.

primes :: [Integer]
primes = sieve [2..]

main :: IO ()
main = do
  print (take 0 primes)  -- expected: []
  print (take 1 primes)  -- expected: [2]
  print (take 5 primes)  -- expected: [2,3,5,7,11]
  print (takeWhile (<10) primes)  -- expected: [2,3,5,7]
  print (sieve [2..10])  -- expected: [2,3,5,7]
