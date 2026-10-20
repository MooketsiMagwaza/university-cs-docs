-- Title: Recognise coprime signed integers
{-
QUESTION
Write euclid for signed Integer inputs a and b.
Return True exactly when the non-negative recursive gcd is one.
-}

-- Read the question: Write euclid with the stated domain and result type.
-- Plan: Normalise signs; Euclid decreases the second argument, subtraction the total.
euclid :: Integer -> Integer -> Bool
-- Base cases stop recursion; each recursive call reduces the stated measure.
euclid a b = gcdR (abs a) (abs b) == 1
  where
    gcdR x 0 = x
    gcdR x y = gcdR y (x `mod` y)

main :: IO ()
main = do
  print (euclid 0 0)  -- expected: False
  print (euclid 12 18)  -- expected: False
  print (euclid (-12) 18)  -- expected: False
  print (euclid 0 (-5))  -- expected: False
  print (euclid 5 7)  -- expected: True
