-- Title: Check whether a list is strictly descending
{-
QUESTION
Given a list of integers, define isStrictlyDescending recursively.
Return True if every element is strictly greater than its successor.
Equal adjacent values are not allowed.
An empty list and a singleton are sorted. Give the signature and a dry run.
-}

-- Read the question: Write isStrictlyDescending :: [Int] -> Bool.
-- Plan: Compare adjacent values; recurse retaining the second value for the next pair.
-- Dry run: isStrictlyDescending [5,5,1] = (5>5) && isStrictlyDescending [5,1] = False.
isStrictlyDescending :: [Int] -> Bool
isStrictlyDescending [] = True -- Base: no comparisons.
isStrictlyDescending [_] = True -- Base: no successor.
isStrictlyDescending (x:y:xs) = x > y && isStrictlyDescending (y:xs)

main :: IO ()
main = do
  print (isStrictlyDescending [])  -- expected: True
  print (isStrictlyDescending [5])  -- expected: True
  print (isStrictlyDescending [5,3,1])  -- expected: True
  print (isStrictlyDescending [3,1,5])  -- expected: False
  print (isStrictlyDescending [5,5,1])  -- expected: False
  print (isStrictlyDescending [1,3,5])  -- expected: False
