-- Title: Use list recursion to multiply its elements
{-
QUESTION
Write listProduct :: [Integer] -> Integer using explicit [] and (x:xs) patterns. [4]
For a finite list, multiply its elements. Do not use a fold or the corresponding Prelude function.
-}

-- Read the question: Write listProduct :: [Integer] -> Integer.
-- Plan: Combine the head contribution with the recursive tail result.
listProduct :: [Integer] -> Integer
listProduct [] = 1  -- Empty-list identity.
listProduct (x:xs) = x * listProduct xs

main :: IO ()
main = do
  print (listProduct [])  -- expected: 1
  print (listProduct [9])  -- expected: 9
  print (listProduct [2,3,4])  -- expected: 24
  print (listProduct [-2,2])  -- expected: -4
  print (listProduct [1,0,3])  -- expected: 0
