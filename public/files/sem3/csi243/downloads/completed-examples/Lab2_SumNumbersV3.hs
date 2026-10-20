-- Title: Sum squares of whole numbers strictly below n
{-
QUESTION
Specify and implement a recursive function sumSquaresBelow using guards.
Sum the squares of whole numbers greater than or equal to 0 and less than n.
For n <= 0 use the empty sum 0. State the base case and dry run an example.
-}

-- Read the question: Write sumSquaresBelow :: Int -> Int.
-- Plan: Add the contribution of n-1, then recurse below that value.
-- Dry run: sumSquaresBelow 4 = 9 + (4 + (1 + 0)) = 14.
sumSquaresBelow :: Int -> Int
sumSquaresBelow n
  | n <= 0 = 0 -- Base: empty interval.
  | otherwise = ((n - 1) * (n - 1)) + sumSquaresBelow (n - 1)

main :: IO ()
main = do
  print (sumSquaresBelow 0)  -- expected: 0
  print (sumSquaresBelow 1)  -- expected: 0
  print (sumSquaresBelow 2)  -- expected: 1
  print (sumSquaresBelow 4)  -- expected: 14
  print (sumSquaresBelow 10)  -- expected: 285
