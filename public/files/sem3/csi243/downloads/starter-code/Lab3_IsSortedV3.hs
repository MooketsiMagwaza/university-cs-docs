-- Title: Check whether a list is strictly descending
{-
QUESTION
Given a list of integers, define isStrictlyDescending recursively.
Return True if every element is strictly greater than its successor.
Equal adjacent values are not allowed.
An empty list and a singleton are sorted. Give the signature and a dry run.
-}

isStrictlyDescending :: [Int] -> Bool
isStrictlyDescending = undefined -- Your answer here

main :: IO ()
main = do
  print (isStrictlyDescending [])  -- expected: True
  print (isStrictlyDescending [5])  -- expected: True
  print (isStrictlyDescending [5,3,1])  -- expected: True
  print (isStrictlyDescending [3,1,5])  -- expected: False
  print (isStrictlyDescending [5,5,1])  -- expected: False
  print (isStrictlyDescending [1,3,5])  -- expected: False
