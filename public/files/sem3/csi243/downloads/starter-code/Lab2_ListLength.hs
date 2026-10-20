-- Title: Count the elements of a list of Int values
{-
QUESTION
Give the specification and a recursive implementation of listLength.
It gives the number of elements in a list of Int values.
The length of the empty list is 0. State the base and recursive cases.
-}

listLength :: [Int] -> Int
listLength = undefined -- Your answer here

main :: IO ()
main = do
  print (listLength [])  -- expected: 0
  print (listLength [7])  -- expected: 1
  print (listLength [1,2,3])  -- expected: 3
  print (listLength [4,4])  -- expected: 2
  print (listLength [1,2,3,4,5])  -- expected: 5
