-- Title: Generate twin primes from an infinite prime stream
{-
QUESTION
Write sieve and primes using the lazy sieve of Eratosthenes. [7]
Write twins :: [(Integer,Integer)] by pairing adjacent primes, retaining
only pairs whose difference is two. Use zip and a comprehension.
-}

-- Read the question: Write sieve :: [Integer] -> [Integer]; primes :: [Integer]; twins :: [(Integer,Integer)].
-- Plan: Zip adjacent primes and test the gap; bound the observed result.
sieve :: [Integer] -> [Integer]
sieve [] = []
sieve (p:xs) = p : sieve [x | x <- xs, mod x p /= 0]  -- Remove multiples.

primes :: [Integer]
primes = sieve [2..]
twins :: [(Integer,Integer)]
twins = [(p,q) | (p,q) <- zip primes (tail primes), q-p == 2]

main :: IO ()
main = do
  print (take 0 twins)  -- expected: []
  print (take 1 twins)  -- expected: [(3,5)]
  print (take 3 twins)  -- expected: [(3,5),(5,7),(11,13)]
  print (take 4 twins)  -- expected: [(3,5),(5,7),(11,13),(17,19)]
  print (takeWhile (\(p,_) -> p < 10) twins)  -- expected: [(3,5),(5,7)]
