-- Title: Safely remove the last element recursively
{-
QUESTION
Write prefix xs. Return Nothing for []; otherwise return Just the
list with its final element removed. A singleton gives Just [].
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

prefix :: [Integer] -> Maybe [Integer]
prefix = undefined -- Your answer here

main :: IO ()
main = do
  print (prefix [])  -- expected: Nothing
  print (prefix [7])  -- expected: Just []
  print (prefix [1,2])  -- expected: Just [1]
  print (prefix [1,2,3])  -- expected: Just [1,2]
  print (prefix [4,4,4])  -- expected: Just [4,4]
