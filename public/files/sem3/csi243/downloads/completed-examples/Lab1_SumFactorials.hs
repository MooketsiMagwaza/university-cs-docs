-- Title: Sum factorials from zero to n
{-
QUESTION
Give recursive definitions of fac and sumFac, both Integer -> Integer.
Define sumFac n = fac 0 + fac 1 + ... + fac n.
Assume n >= 0; reject negative arguments.
-}

-- Read the question: Write fac :: Integer -> Integer.
-- Read the question: Write sumFac :: Integer -> Integer.
-- Plan: Compute the last factorial recursively and add it to the earlier total.
-- Dry run: sumFac 3 = fac 3 + (fac 2 + (fac 1 + 1)) = 6+2+1+1 = 10.
fac :: Integer -> Integer
fac n
  | n < 0 = error "fac: negative argument"
  | n == 0 = 1
  | otherwise = n * fac (n - 1)

sumFac :: Integer -> Integer
sumFac n
  | n < 0 = error "sumFac: negative argument"
  | n == 0 = 1 -- Base includes the first factorial.
  | otherwise = fac n + sumFac (n - 1)

main :: IO ()
main = do
  print (sumFac 0)  -- expected: 1
  print (sumFac 1)  -- expected: 2
  print (sumFac 2)  -- expected: 4
  print (sumFac 3)  -- expected: 10
  print (sumFac 4)  -- expected: 34
