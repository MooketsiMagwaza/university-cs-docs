-- Title: Check whether a list is sorted in descending order
{-
QUESTION
Given a list of integers, define isSorted recursively.
Return True if the list is in descending (non-increasing) order.
For example, isSorted [5,3,1] = True and isSorted [3,1,5] = False.
Equal adjacent values are allowed.
An empty list and a singleton are sorted. Give the signature and a dry run.
-}

-- Read the question: Write isSorted :: [Int] -> Bool.
-- Plan: Compare adjacent values; recurse retaining the second value for the next pair.
-- Dry run: isSorted [5,3,1] = (5>=3) && (3>=1) && isSorted [1] = True.
isSorted :: [Int] -> Bool
isSorted [] = True -- Base: no comparisons.
isSorted [_] = True -- Base: no successor.
isSorted (x:y:xs) = x >= y && isSorted (y:xs)

main :: IO ()
main = do
  print (isSorted [])  -- expected: True
  print (isSorted [5])  -- expected: True
  print (isSorted [5,3,1])  -- expected: True
  print (isSorted [3,1,5])  -- expected: False
  print (isSorted [5,5,1])  -- expected: True
  print (isSorted [1,3,5])  -- expected: False
