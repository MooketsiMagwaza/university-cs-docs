-- Title: Sum even whole numbers strictly below n
{-
QUESTION
Specify and implement a recursive function sumEvenBelow using guards.
Sum the even whole numbers greater than or equal to 0 and less than n.
For n <= 0 use the empty sum 0. State the base case and dry run an example.
-}

-- Read the question: Write sumEvenBelow :: Int -> Int.
-- Plan: Add the contribution of n-1, then recurse below that value.
-- Dry run: sumEvenBelow 4 = 0 + (2 + (0 + 0)) = 2.
sumEvenBelow :: Int -> Int
sumEvenBelow n
  | n <= 0 = 0 -- Base: empty interval.
  | otherwise = (if even (n - 1) then n - 1 else 0) + sumEvenBelow (n - 1)

main :: IO ()
main = do
  print (sumEvenBelow 0)  -- expected: 0
  print (sumEvenBelow 1)  -- expected: 0
  print (sumEvenBelow 2)  -- expected: 0
  print (sumEvenBelow 4)  -- expected: 2
  print (sumEvenBelow 10)  -- expected: 20
