-- Title: Check strictly increasing characters
{-
QUESTION
Write ordered for a String. Require each adjacent pair to satisfy (<).
The empty list and a singleton are ordered. Reject equal adjacent values.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

ordered :: String -> Bool
ordered = undefined -- Your answer here

main :: IO ()
main = do
  print (ordered "")  -- expected: True
  print (ordered "a")  -- expected: True
  print (ordered "abc")  -- expected: True
  print (ordered "abb")  -- expected: False
  print (ordered "ba")  -- expected: False
