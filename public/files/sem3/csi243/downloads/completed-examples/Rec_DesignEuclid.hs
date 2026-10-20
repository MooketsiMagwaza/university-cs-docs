-- Title: Normalise signs in Euclid gcd
{-
QUESTION
Write euclid for signed Integer inputs a and b.
Return their non-negative gcd using remainder recursion; gcd(0,0)=0.
-}

-- Read the question: Write euclid with the stated domain and result type.
-- Plan: Normalise signs; Euclid decreases the second argument, subtraction the total.
euclid :: Integer -> Integer -> Integer
-- Base cases stop recursion; each recursive call reduces the stated measure.
euclid a b = gcdR (abs a) (abs b)
  where
    gcdR x 0 = x
    gcdR x y = gcdR y (x `mod` y)

main :: IO ()
main = do
  print (euclid 0 0)  -- expected: 0
  print (euclid 12 18)  -- expected: 6
  print (euclid (-12) 18)  -- expected: 6
  print (euclid 0 (-5))  -- expected: 5
  print (euclid 5 7)  -- expected: 1
