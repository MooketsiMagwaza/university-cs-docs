-- Title: Compare repeated and incremental factorial sums
{-
QUESTION
Write sumFactorialCosts :: Integer -> (Integer, Integer, Integer)
for n>=0. Return sum [0!,...,n!], multiplication count when each k!
is recomputed from scratch, and count when the previous factorial is
reused. Count one multiplication for each positive factorial step;
ignore additions. Recomputed count is sum [0..n]=n(n+1)/2; reused count
is n. Assume unit-cost Integer arithmetic; actual bit costs grow.
-}

sumFactorialCosts :: Integer -> (Integer, Integer, Integer)
sumFactorialCosts = undefined -- Your answer here

main :: IO ()
main = do
  print (sumFactorialCosts 0)  -- expected: (1,0,0)
  print (sumFactorialCosts 1)  -- expected: (2,1,1)
  print (sumFactorialCosts 2)  -- expected: (4,3,2)
  print (sumFactorialCosts 3)  -- expected: (10,6,3)
  print (sumFactorialCosts 4)  -- expected: (34,10,4)
