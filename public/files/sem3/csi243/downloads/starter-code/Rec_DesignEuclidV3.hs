-- Title: Recognise coprime signed integers
{-
QUESTION
Write euclid for signed Integer inputs a and b.
Return True exactly when the non-negative recursive gcd is one.
-}

euclid :: Integer -> Integer -> Bool
euclid = undefined -- Your answer here

main :: IO ()
main = do
  print (euclid 0 0)  -- expected: False
  print (euclid 12 18)  -- expected: False
  print (euclid (-12) 18)  -- expected: False
  print (euclid 0 (-5))  -- expected: False
  print (euclid 5 7)  -- expected: True
