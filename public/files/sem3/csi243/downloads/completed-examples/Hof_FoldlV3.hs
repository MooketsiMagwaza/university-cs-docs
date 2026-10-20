-- Title: Compute a reversed list with foldl
{-
QUESTION
Write accumulate :: [Integer] -> [Integer] using foldl (\acc x -> x:acc) []. [4]
Process the input from left to right.
-}

-- Read the question: Write accumulate :: [Integer] -> [Integer].
-- Plan: Update the accumulator with each successive input.
accumulate :: [Integer] -> [Integer]
accumulate = foldl (\acc x -> x:acc) []  -- Feed each result into the next step.

main :: IO ()
main = do
  print (accumulate [])  -- expected: []
  print (accumulate [5])  -- expected: [5]
  print (accumulate [1,2])  -- expected: [2,1]
  print (accumulate [1,2,3])  -- expected: [3,2,1]
  print (accumulate [2,3,4])  -- expected: [4,3,2]
