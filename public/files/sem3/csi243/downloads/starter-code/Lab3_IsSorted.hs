-- Title: Check whether a list is sorted in descending order
{-
QUESTION
Given a list of integers, define isSorted recursively.
Return True if the list is in descending (non-increasing) order.
For example, isSorted [5,3,1] = True and isSorted [3,1,5] = False.
Equal adjacent values are allowed.
An empty list and a singleton are sorted. Give the signature and a dry run.
-}

isSorted :: [Int] -> Bool
isSorted = undefined -- Your answer here

main :: IO ()
main = do
  print (isSorted [])  -- expected: True
  print (isSorted [5])  -- expected: True
  print (isSorted [5,3,1])  -- expected: True
  print (isSorted [3,1,5])  -- expected: False
  print (isSorted [5,5,1])  -- expected: True
  print (isSorted [1,3,5])  -- expected: False
