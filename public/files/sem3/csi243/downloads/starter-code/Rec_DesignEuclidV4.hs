-- Title: Compare remainder and subtraction gcd
{-
QUESTION
Write euclid for signed Integer inputs a and b.
Return whether remainder-based and subtraction-based gcd agree.
Both algorithms must handle zero before performing a reduction.
-}

euclid :: Integer -> Integer -> Bool
euclid = undefined -- Your answer here

main :: IO ()
main = do
  print (euclid 0 0)  -- expected: True
  print (euclid 12 18)  -- expected: True
  print (euclid (-12) 18)  -- expected: True
  print (euclid 0 (-5))  -- expected: True
  print (euclid 5 7)  -- expected: True
