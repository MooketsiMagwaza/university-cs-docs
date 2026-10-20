-- Title: Check non-increasing order with duplicates allowed
{-
QUESTION
Write ordered for a list of Integer. Require each adjacent pair to satisfy (>=).
The empty list and a singleton are ordered. Allow equal adjacent values.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

ordered :: [Integer] -> Bool
ordered = undefined -- Your answer here

main :: IO ()
main = do
  print (ordered [])  -- expected: True
  print (ordered [5])  -- expected: True
  print (ordered [5,5,2])  -- expected: True
  print (ordered [5,2,3])  -- expected: False
  print (ordered [-1,-2,-3])  -- expected: True
