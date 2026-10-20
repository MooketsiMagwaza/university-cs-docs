-- Title: Count the elements of a list of Bool values
{-
QUESTION
Give the specification and a recursive implementation of listLength.
It gives the number of elements in a list of Bool values.
The length of the empty list is 0. State the base and recursive cases.
-}

-- Read the question: Write listLength :: [Bool] -> Int.
-- Plan: Count one head and recursively count the tail; the empty list counts as zero.
-- Dry run: listLength [True,False,True] = 1 + (1 + (1 + 0)) = 3.
listLength :: [Bool] -> Int
listLength xs
  | null xs = 0 -- Base: empty list.
  | otherwise = 1 + listLength (tail xs)

main :: IO ()
main = do
  print (listLength [])  -- expected: 0
  print (listLength [True])  -- expected: 1
  print (listLength [True,False,True])  -- expected: 3
  print (listLength [False,False])  -- expected: 2
  print (listLength [True,False,True,False,True])  -- expected: 5
