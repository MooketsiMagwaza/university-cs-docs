-- Title: Derive a safe least common multiple
{-
QUESTION
Write euclid for signed Integer inputs a and b.
Return their non-negative lcm using a local recursive gcd.
Define the lcm as zero when either input is zero.
-}

euclid :: Integer -> Integer -> Integer
euclid = undefined -- Your answer here

main :: IO ()
main = do
  print (euclid 0 0)  -- expected: 0
  print (euclid 12 18)  -- expected: 36
  print (euclid (-12) 18)  -- expected: 36
  print (euclid 0 (-5))  -- expected: 0
  print (euclid 5 7)  -- expected: 35
