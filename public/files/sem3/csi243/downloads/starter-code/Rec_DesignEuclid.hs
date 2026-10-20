-- Title: Normalise signs in Euclid gcd
{-
QUESTION
Write euclid for signed Integer inputs a and b.
Return their non-negative gcd using remainder recursion; gcd(0,0)=0.
-}

euclid :: Integer -> Integer -> Integer
euclid = undefined -- Your answer here

main :: IO ()
main = do
  print (euclid 0 0)  -- expected: 0
  print (euclid 12 18)  -- expected: 6
  print (euclid (-12) 18)  -- expected: 6
  print (euclid 0 (-5))  -- expected: 5
  print (euclid 5 7)  -- expected: 1
