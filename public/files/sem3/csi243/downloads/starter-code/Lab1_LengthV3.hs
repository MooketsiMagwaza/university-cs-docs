-- Title: Count the elements of a list of Bool values
{-
QUESTION
Give the specification and a recursive implementation of listLength.
It gives the number of elements in a list of Bool values.
The length of the empty list is 0. State the base and recursive cases.
-}

listLength :: [Bool] -> Int
listLength = undefined -- Your answer here

main :: IO ()
main = do
  print (listLength [])  -- expected: 0
  print (listLength [True])  -- expected: 1
  print (listLength [True,False,True])  -- expected: 3
  print (listLength [False,False])  -- expected: 2
  print (listLength [True,False,True,False,True])  -- expected: 5
