-- Title: Observe prime gaps from a lazy sieve
{-
QUESTION
Write sieve and primes using the lazy sieve of Eratosthenes. [7]
Also write gaps :: [Integer], the differences between adjacent primes,
using zipWith (-) (tail primes) primes. Observe finite prefixes only.
-}

sieve :: [Integer] -> [Integer]
sieve = undefined  -- Your answer here

primes :: [Integer]
primes = undefined  -- Your answer here

gaps :: [Integer]
gaps = undefined  -- Your answer here

main :: IO ()
main = do
  print (take 0 gaps)  -- expected: []
  print (take 1 gaps)  -- expected: [1]
  print (take 5 gaps)  -- expected: [1,2,2,4,2]
  print (take 8 gaps)  -- expected: [1,2,2,4,2,4,2,4]
  print (take 3 primes)  -- expected: [2,3,5]
