-- Title: Generate prime pairs separated by two
{-
QUESTION
Write isPrime :: Integer -> Bool and twinsTo :: Integer -> [(Integer,Integer)]. [7]
Use comprehensions. Return (p,p+2) when both are prime and p+2 <= n,
in increasing p order; n < 5 gives [].
-}

-- Read the question: Write isPrime :: Integer -> Bool; twinsTo :: Integer -> [(Integer,Integer)].
-- Plan: Generate only p values whose partner fits under the bound.
isPrime :: Integer -> Bool
isPrime n = n >= 2 && null [d | d <- [2..n-1], mod n d == 0]

twinsTo :: Integer -> [(Integer,Integer)]
twinsTo n = [(p,p+2) | p <- [2..n-2], isPrime p, isPrime (p+2)]

main :: IO ()
main = do
  print (twinsTo 0)  -- expected: []
  print (twinsTo 3)  -- expected: []
  print (twinsTo 5)  -- expected: [(3,5)]
  print (twinsTo 10)  -- expected: [(3,5),(5,7)]
  print (twinsTo 13)  -- expected: [(3,5),(5,7),(11,13)]
