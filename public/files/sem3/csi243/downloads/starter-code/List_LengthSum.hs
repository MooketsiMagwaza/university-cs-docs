-- Title: Use list recursion to count its elements
{-
QUESTION
Write listLength :: [a] -> Integer using explicit [] and (x:xs) patterns. [4]
For a finite list, count its elements. Do not use a fold or the corresponding Prelude function.
-}

listLength :: [a] -> Integer
listLength = undefined  -- Your answer here

main :: IO ()
main = do
  print (listLength ([] :: [Int]))  -- expected: 0
  print (listLength [9])  -- expected: 1
  print (listLength [4,5,6])  -- expected: 3
  print (listLength "exam")  -- expected: 4
  print (listLength [True,False])  -- expected: 2
