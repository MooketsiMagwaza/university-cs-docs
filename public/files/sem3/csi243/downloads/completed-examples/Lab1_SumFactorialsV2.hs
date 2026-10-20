-- Title: Sum factorials at even indices
{-
QUESTION
Give recursive definitions of fac and sumEvenFac, both Integer -> Integer.
Define sumEvenFac n = fac 0 + fac 2 + ... + fac (2*n).
Assume n >= 0; reject negative arguments.
-}

-- Read the question: Write fac :: Integer -> Integer.
-- Read the question: Write sumEvenFac :: Integer -> Integer.
-- Plan: Compute the last factorial recursively and add it to the earlier total.
-- Dry run: sumEvenFac 2 = fac 4 + (fac 2 + 1) = 24+2+1 = 27.
fac :: Integer -> Integer
fac n
  | n < 0 = error "fac: negative argument"
  | n == 0 = 1
  | otherwise = n * fac (n - 1)

sumEvenFac :: Integer -> Integer
sumEvenFac n
  | n < 0 = error "sumEvenFac: negative argument"
  | n == 0 = 1 -- Base includes the first factorial.
  | otherwise = fac (2 * n) + sumEvenFac (n - 1)

main :: IO ()
main = do
  print (sumEvenFac 0)  -- expected: 1
  print (sumEvenFac 1)  -- expected: 3
  print (sumEvenFac 2)  -- expected: 27
  print (sumEvenFac 3)  -- expected: 747
  print (sumEvenFac 4)  -- expected: 41067
