-- Title: Append two lists using only cons
{-
QUESTION
Write appendR xs ys. Place every element of xs before every element
of ys. Recurse over xs only; do not use (++).
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write appendR with the stated list and result types.
-- Plan: Specify both empty-list cases before consuming the available heads.
appendR :: [Integer] -> [Integer] -> [Integer]
-- Base cases handle missing data; the recursive case consumes list structure.
appendR [] ys = ys
appendR (x:xs) ys = x : appendR xs ys

main :: IO ()
main = do
  print (appendR [] [])  -- expected: []
  print (appendR [1] [])  -- expected: [1]
  print (appendR [] [2,3])  -- expected: [2,3]
  print (appendR [1,3,5] [2])  -- expected: [1,3,5,2]
  print (appendR [1] [2,4,6])  -- expected: [1,2,4,6]
