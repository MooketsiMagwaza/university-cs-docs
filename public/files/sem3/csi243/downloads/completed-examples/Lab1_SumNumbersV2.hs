-- Title: Sum the squares from 1 up to n
{-
QUESTION
Write a recursive function sumSquares :: Integer -> Integer.
Compute 1^2 + 2^2 + ... + n^2.
For n = 0 return 0; reject negative n. State the base and recursive cases.
-}

-- Read the question: Write sumSquares :: Integer -> Integer.
-- Plan: Add the final term to the recursive sum with one fewer term.
-- Dry run: sumSquares 3 = 9 + (4 + (1 + 0)) = 14.
sumSquares :: Integer -> Integer
sumSquares n
  | n < 0 = error "sumSquares: negative argument"
  | n == 0 = 0 -- Base: no terms.
  | otherwise = n * n + sumSquares (n - 1)

main :: IO ()
main = do
  print (sumSquares 0)  -- expected: 0
  print (sumSquares 1)  -- expected: 1
  print (sumSquares 2)  -- expected: 5
  print (sumSquares 3)  -- expected: 14
  print (sumSquares 5)  -- expected: 55
