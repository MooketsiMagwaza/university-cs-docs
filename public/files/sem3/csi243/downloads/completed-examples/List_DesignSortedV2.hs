-- Title: Check strictly decreasing order
{-
QUESTION
Write ordered for a list of Integer. Require each adjacent pair to satisfy (>).
The empty list and a singleton are ordered. Reject equal adjacent values.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write ordered with the stated list and result types.
-- Plan: Compare adjacent heads and retain the second head for the next comparison.
ordered :: [Integer] -> Bool
-- Base cases handle missing data; the recursive case consumes list structure.
ordered [] = True
ordered [_] = True
ordered (x:y:xs) = x > y && ordered (y:xs)

main :: IO ()
main = do
  print (ordered [])  -- expected: True
  print (ordered [5])  -- expected: True
  print (ordered [5,5,2])  -- expected: False
  print (ordered [5,3,1])  -- expected: True
  print (ordered [1,2])  -- expected: False
