-- Title: Observe prime gaps from a lazy sieve
{-
QUESTION
Write sieve and primes using the lazy sieve of Eratosthenes. [7]
Also write gaps :: [Integer], the differences between adjacent primes,
using zipWith (-) (tail primes) primes. Observe finite prefixes only.
-}

-- Read the question: Write sieve :: [Integer] -> [Integer]; primes :: [Integer]; gaps :: [Integer].
-- Plan: Generate primes lazily and zip a shifted copy with the original.
sieve :: [Integer] -> [Integer]
sieve [] = []
sieve (p:xs) = p : sieve [x | x <- xs, mod x p /= 0]  -- Remove multiples.

primes :: [Integer]
primes = sieve [2..]
gaps :: [Integer]
gaps = zipWith (-) (tail primes) primes  -- Compare each prime with its predecessor.

main :: IO ()
main = do
  print (take 0 gaps)  -- expected: []
  print (take 1 gaps)  -- expected: [1]
  print (take 5 gaps)  -- expected: [1,2,2,4,2]
  print (take 8 gaps)  -- expected: [1,2,2,4,2,4,2,4]
  print (take 3 primes)  -- expected: [2,3,5]
