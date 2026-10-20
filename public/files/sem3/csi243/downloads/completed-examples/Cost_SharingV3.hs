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

-- Read the question: Write a definition; sumFactorialCosts has input/result type Integer -> (Integer, Integer, Integer).
-- Plan: Keep separate symbolic counters for each explicitly stated traversal policy.
sumFactorialCosts :: Integer -> (Integer, Integer, Integer)
sumFactorialCosts n = (total, repeated n, steps)
  where
    repeated 0 = 0
    repeated k = k + repeated (k-1)
    (total,steps) = go 1 1 1 0
    go k previous acc count
      | k > n = (acc,count)
      | otherwise = go (k+1) current (acc+current) (count+1)
      where current = k * previous

main :: IO ()
main = do
  print (sumFactorialCosts 0)  -- expected: (1,0,0)
  print (sumFactorialCosts 1)  -- expected: (2,1,1)
  print (sumFactorialCosts 2)  -- expected: (4,3,2)
  print (sumFactorialCosts 3)  -- expected: (10,6,3)
  print (sumFactorialCosts 4)  -- expected: (34,10,4)
