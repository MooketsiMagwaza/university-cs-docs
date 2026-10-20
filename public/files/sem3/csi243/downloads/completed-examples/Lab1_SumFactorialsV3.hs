-- Title: Sum factorials at odd indices
{-
QUESTION
Give recursive definitions of fac and sumOddFac, both Integer -> Integer.
Define sumOddFac n = fac 1 + fac 3 + ... + fac (2*n+1).
Assume n >= 0; reject negative arguments.
-}

-- Read the question: Write fac :: Integer -> Integer.
-- Read the question: Write sumOddFac :: Integer -> Integer.
-- Plan: Compute the last factorial recursively and add it to the earlier total.
-- Dry run: sumOddFac 2 = fac 5 + (fac 3 + 1) = 120+6+1 = 127.
fac :: Integer -> Integer
fac n
  | n < 0 = error "fac: negative argument"
  | n == 0 = 1
  | otherwise = n * fac (n - 1)

sumOddFac :: Integer -> Integer
sumOddFac n
  | n < 0 = error "sumOddFac: negative argument"
  | n == 0 = 1 -- Base includes the first factorial.
  | otherwise = fac (2 * n + 1) + sumOddFac (n - 1)

main :: IO ()
main = do
  print (sumOddFac 0)  -- expected: 1
  print (sumOddFac 1)  -- expected: 7
  print (sumOddFac 2)  -- expected: 127
  print (sumOddFac 3)  -- expected: 5167
  print (sumOddFac 4)  -- expected: 368047
