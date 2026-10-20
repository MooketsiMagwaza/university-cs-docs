-- Title: Count the elements of a list of String values
{-
QUESTION
Give the specification and a recursive implementation of listLength.
It gives the number of elements in a list of String values.
The length of the empty list is 0. State the base and recursive cases.
-}

listLength :: [String] -> Int
listLength = undefined -- Your answer here

main :: IO ()
main = do
  print (listLength [])  -- expected: 0
  print (listLength ["a"])  -- expected: 1
  print (listLength ["a","bb","c"])  -- expected: 3
  print (listLength ["","x"])  -- expected: 2
  print (listLength ["a","b","c","d","e"])  -- expected: 5
