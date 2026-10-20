-- Title: Sum positive integers up to and including n
{-
QUESTION
Write a recursive function sumNumbers :: Integer -> Integer.
Compute the sum of all positive whole numbers up to and including n.
For n = 0 return 0; reject negative n. State the base and recursive cases.
-}

-- Read the question: Write sumNumbers :: Integer -> Integer.
-- Plan: Add the final term to the recursive sum with one fewer term.
-- Dry run: sumNumbers 3 = 3 + (2 + (1 + 0)) = 6.
sumNumbers :: Integer -> Integer
sumNumbers n
  | n < 0 = error "sumNumbers: negative argument"
  | n == 0 = 0 -- Base: no terms.
  | otherwise = n + sumNumbers (n - 1)

main :: IO ()
main = do
  print (sumNumbers 0)  -- expected: 0
  print (sumNumbers 1)  -- expected: 1
  print (sumNumbers 2)  -- expected: 3
  print (sumNumbers 3)  -- expected: 6
  print (sumNumbers 5)  -- expected: 15
