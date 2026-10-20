-- Title: Use list recursion to count its elements
{-
QUESTION
Write listLength :: [a] -> Integer using explicit [] and (x:xs) patterns. [4]
For a finite list, count its elements. Do not use a fold or the corresponding Prelude function.
-}

-- Read the question: Write listLength :: [a] -> Integer.
-- Plan: Combine the head contribution with the recursive tail result.
listLength :: [a] -> Integer
listLength [] = 0  -- Empty-list identity.
listLength (x:xs) = 1 + listLength xs

main :: IO ()
main = do
  print (listLength ([] :: [Int]))  -- expected: 0
  print (listLength [9])  -- expected: 1
  print (listLength [4,5,6])  -- expected: 3
  print (listLength "exam")  -- expected: 4
  print (listLength [True,False])  -- expected: 2
