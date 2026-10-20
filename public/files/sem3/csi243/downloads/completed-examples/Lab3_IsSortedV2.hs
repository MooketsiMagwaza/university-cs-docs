-- Title: Check whether a list is sorted in ascending order
{-
QUESTION
Given a list of integers, define isAscending recursively.
Return True if the list is in ascending (non-decreasing) order.
Equal adjacent values are allowed.
An empty list and a singleton are sorted. Give the signature and a dry run.
-}

-- Read the question: Write isAscending :: [Int] -> Bool.
-- Plan: Compare adjacent values; recurse retaining the second value for the next pair.
-- Dry run: isAscending [1,3,5] = (1<=3) && (3<=5) && isAscending [5] = True.
isAscending :: [Int] -> Bool
isAscending [] = True -- Base: no comparisons.
isAscending [_] = True -- Base: no successor.
isAscending (x:y:xs) = x <= y && isAscending (y:xs)

main :: IO ()
main = do
  print (isAscending [])  -- expected: True
  print (isAscending [5])  -- expected: True
  print (isAscending [5,3,1])  -- expected: False
  print (isAscending [3,1,5])  -- expected: False
  print (isAscending [5,5,1])  -- expected: False
  print (isAscending [1,3,5])  -- expected: True
