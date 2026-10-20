-- Title: Check strictly increasing characters
{-
QUESTION
Write ordered for a String. Require each adjacent pair to satisfy (<).
The empty list and a singleton are ordered. Reject equal adjacent values.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write ordered with the stated list and result types.
-- Plan: Compare adjacent heads and retain the second head for the next comparison.
ordered :: String -> Bool
-- Base cases handle missing data; the recursive case consumes list structure.
ordered [] = True
ordered [_] = True
ordered (x:y:xs) = x < y && ordered (y:xs)

main :: IO ()
main = do
  print (ordered "")  -- expected: True
  print (ordered "a")  -- expected: True
  print (ordered "abc")  -- expected: True
  print (ordered "abb")  -- expected: False
  print (ordered "ba")  -- expected: False
