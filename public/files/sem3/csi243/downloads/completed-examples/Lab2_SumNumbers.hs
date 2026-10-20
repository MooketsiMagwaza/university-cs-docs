-- Title: Sum whole numbers strictly below n
{-
QUESTION
Specify and implement a recursive function sumNumbers using guards.
Sum all positive whole numbers from 0 up to, but not including n.
For example, sumNumbers 10 returns 1+2+3+4+5+6+7+8+9 = 45.
For n <= 0 use the empty sum 0. State the base case and dry run an example.
-}

-- Read the question: Write sumNumbers :: Int -> Int.
-- Plan: Add the contribution of n-1, then recurse below that value.
-- Dry run: sumNumbers 4 = 3 + (2 + (1 + 0)) = 6.
sumNumbers :: Int -> Int
sumNumbers n
  | n <= 0 = 0 -- Base: empty interval.
  | otherwise = (n - 1) + sumNumbers (n - 1)

main :: IO ()
main = do
  print (sumNumbers 0)  -- expected: 0
  print (sumNumbers 1)  -- expected: 0
  print (sumNumbers 2)  -- expected: 1
  print (sumNumbers 4)  -- expected: 6
  print (sumNumbers 10)  -- expected: 45
