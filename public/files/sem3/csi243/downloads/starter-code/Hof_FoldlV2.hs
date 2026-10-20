-- Title: Compute a decimal digit value with foldl
{-
QUESTION
Write accumulate :: [Integer] -> Integer using foldl (\acc x -> 10*acc+x) 0. [4]
Inputs contain only digits 0..9.
-}

accumulate :: [Integer] -> Integer
accumulate = undefined  -- Your answer here

main :: IO ()
main = do
  print (accumulate [])  -- expected: 0
  print (accumulate [5])  -- expected: 5
  print (accumulate [1,2])  -- expected: 12
  print (accumulate [1,2,3])  -- expected: 123
  print (accumulate [2,3,4])  -- expected: 234
