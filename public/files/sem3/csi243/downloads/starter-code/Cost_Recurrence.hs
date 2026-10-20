-- Title: Count unit-cost multiplications in recursive factorial
{-
QUESTION
Write factorialCount :: Integer -> (Integer, Integer) for n >= 0,
returning n! and its multiplication count. Count one multiplication per
positive recursive step, zero at n=0. Assume unit-cost Integer arithmetic
for this model only; real large-Integer operations need not cost O(1).
Derive C(0)=0, C(n)=C(n-1)+1, hence C(n)=n and linear operation count.
The decreasing measure is n; no result is specified for negative n.
-}

factorialCount :: Integer -> (Integer, Integer)
factorialCount = undefined -- Your answer here

main :: IO ()
main = do
  print (factorialCount 0)  -- expected: (1,0)
  print (factorialCount 1)  -- expected: (1,1)
  print (factorialCount 2)  -- expected: (2,2)
  print (factorialCount 3)  -- expected: (6,3)
  print (factorialCount 5)  -- expected: (120,5)
