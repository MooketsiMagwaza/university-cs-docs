-- Title: Compute a decimal digit value with foldl
{-
QUESTION
Write accumulate :: [Integer] -> Integer using foldl (\acc x -> 10*acc+x) 0. [4]
Inputs contain only digits 0..9.
-}

-- Read the question: Write accumulate :: [Integer] -> Integer.
-- Plan: Update the accumulator with each successive input.
accumulate :: [Integer] -> Integer
accumulate = foldl (\acc x -> 10*acc+x) 0  -- Feed each result into the next step.

main :: IO ()
main = do
  print (accumulate [])  -- expected: 0
  print (accumulate [5])  -- expected: 5
  print (accumulate [1,2])  -- expected: 12
  print (accumulate [1,2,3])  -- expected: 123
  print (accumulate [2,3,4])  -- expected: 234
