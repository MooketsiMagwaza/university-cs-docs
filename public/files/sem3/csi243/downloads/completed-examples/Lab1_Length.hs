-- Title: Count the elements of a list of Int values
{-
QUESTION
Give the specification and a recursive implementation of listLength.
It gives the number of elements in a list of Int values.
The length of the empty list is 0. State the base and recursive cases.
-}

-- Read the question: Write listLength :: [Int] -> Int.
-- Plan: Count one head and recursively count the tail; the empty list counts as zero.
-- Dry run: listLength [1,2,3] = 1 + (1 + (1 + listLength [])) = 3.
listLength :: [Int] -> Int
listLength xs
  | null xs = 0 -- Base: empty list.
  | otherwise = 1 + listLength (tail xs)

main :: IO ()
main = do
  print (listLength [])  -- expected: 0
  print (listLength [7])  -- expected: 1
  print (listLength [1,2,3])  -- expected: 3
  print (listLength [4,4])  -- expected: 2
  print (listLength [1,2,3,4,5])  -- expected: 5
