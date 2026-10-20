-- Title: Use list recursion to sum its elements
{-
QUESTION
Write listSum :: [Integer] -> Integer using explicit [] and (x:xs) patterns. [4]
For a finite list, sum its elements. Do not use a fold or the corresponding Prelude function.
-}

listSum :: [Integer] -> Integer
listSum = undefined  -- Your answer here

main :: IO ()
main = do
  print (listSum [])  -- expected: 0
  print (listSum [9])  -- expected: 9
  print (listSum [4,5,6])  -- expected: 15
  print (listSum [-2,2])  -- expected: 0
  print (listSum [1,2,3,4])  -- expected: 10
