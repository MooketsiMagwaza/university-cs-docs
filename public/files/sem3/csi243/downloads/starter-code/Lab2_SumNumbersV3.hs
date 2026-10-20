-- Title: Sum squares of whole numbers strictly below n
{-
QUESTION
Specify and implement a recursive function sumSquaresBelow using guards.
Sum the squares of whole numbers greater than or equal to 0 and less than n.
For n <= 0 use the empty sum 0. State the base case and dry run an example.
-}

sumSquaresBelow :: Int -> Int
sumSquaresBelow = undefined -- Your answer here

main :: IO ()
main = do
  print (sumSquaresBelow 0)  -- expected: 0
  print (sumSquaresBelow 1)  -- expected: 0
  print (sumSquaresBelow 2)  -- expected: 1
  print (sumSquaresBelow 4)  -- expected: 14
  print (sumSquaresBelow 10)  -- expected: 285
