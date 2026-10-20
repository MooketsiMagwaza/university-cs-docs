-- Title: Compute left-associated subtraction with foldl
{-
QUESTION
Write accumulate :: [Integer] -> Integer using foldl (-) 0. [4]
Process the input from left to right.
-}

-- Read the question: Write accumulate :: [Integer] -> Integer.
-- Plan: Update the accumulator with each successive input.
accumulate :: [Integer] -> Integer
accumulate = foldl (-) 0  -- Feed each result into the next step.

main :: IO ()
main = do
  print (accumulate [])  -- expected: 0
  print (accumulate [5])  -- expected: -5
  print (accumulate [1,2])  -- expected: -3
  print (accumulate [1,2,3])  -- expected: -6
  print (accumulate [2,3,4])  -- expected: -9
