-- Title: Generate twin primes from an infinite prime stream
{-
QUESTION
Write sieve and primes using the lazy sieve of Eratosthenes. [7]
Write twins :: [(Integer,Integer)] by pairing adjacent primes, retaining
only pairs whose difference is two. Use zip and a comprehension.
-}

sieve :: [Integer] -> [Integer]
sieve = undefined  -- Your answer here

primes :: [Integer]
primes = undefined  -- Your answer here

twins :: [(Integer,Integer)]
twins = undefined  -- Your answer here

main :: IO ()
main = do
  print (take 0 twins)  -- expected: []
  print (take 1 twins)  -- expected: [(3,5)]
  print (take 3 twins)  -- expected: [(3,5),(5,7),(11,13)]
  print (take 4 twins)  -- expected: [(3,5),(5,7),(11,13),(17,19)]
  print (takeWhile (\(p,_) -> p < 10) twins)  -- expected: [(3,5),(5,7)]
