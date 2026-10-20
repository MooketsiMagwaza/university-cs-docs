-- Title: Generate prime pairs separated by two
{-
QUESTION
Write isPrime :: Integer -> Bool and twinsTo :: Integer -> [(Integer,Integer)]. [7]
Use comprehensions. Return (p,p+2) when both are prime and p+2 <= n,
in increasing p order; n < 5 gives [].
-}

isPrime :: Integer -> Bool
isPrime = undefined  -- Your answer here

twinsTo :: Integer -> [(Integer,Integer)]
twinsTo = undefined  -- Your answer here

main :: IO ()
main = do
  print (twinsTo 0)  -- expected: []
  print (twinsTo 3)  -- expected: []
  print (twinsTo 5)  -- expected: [(3,5)]
  print (twinsTo 10)  -- expected: [(3,5),(5,7)]
  print (twinsTo 13)  -- expected: [(3,5),(5,7),(11,13)]
