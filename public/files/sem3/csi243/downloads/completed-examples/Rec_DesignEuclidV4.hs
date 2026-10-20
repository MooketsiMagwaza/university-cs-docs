-- Title: Compare remainder and subtraction gcd
{-
QUESTION
Write euclid for signed Integer inputs a and b.
Return whether remainder-based and subtraction-based gcd agree.
Both algorithms must handle zero before performing a reduction.
-}

-- Read the question: Write euclid with the stated domain and result type.
-- Plan: Normalise signs; Euclid decreases the second argument, subtraction the total.
euclid :: Integer -> Integer -> Bool
-- Base cases stop recursion; each recursive call reduces the stated measure.
euclid a b = gcdR (abs a) (abs b) == gcdS (abs a) (abs b)
  where
    gcdR x 0 = x
    gcdR x y = gcdR y (x `mod` y)
    gcdS 0 y = y
    gcdS x 0 = x
    gcdS x y
      | x > y = gcdS (x-y) y
      | otherwise = gcdS x (y-x)

main :: IO ()
main = do
  print (euclid 0 0)  -- expected: True
  print (euclid 12 18)  -- expected: True
  print (euclid (-12) 18)  -- expected: True
  print (euclid 0 (-5))  -- expected: True
  print (euclid 5 7)  -- expected: True
