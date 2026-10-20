-- Title: Use list recursion to multiply its elements
{-
QUESTION
Write listProduct :: [Integer] -> Integer using explicit [] and (x:xs) patterns. [4]
For a finite list, multiply its elements. Do not use a fold or the corresponding Prelude function.
-}

listProduct :: [Integer] -> Integer
listProduct = undefined  -- Your answer here

main :: IO ()
main = do
  print (listProduct [])  -- expected: 1
  print (listProduct [9])  -- expected: 9
  print (listProduct [2,3,4])  -- expected: 24
  print (listProduct [-2,2])  -- expected: -4
  print (listProduct [1,0,3])  -- expected: 0
