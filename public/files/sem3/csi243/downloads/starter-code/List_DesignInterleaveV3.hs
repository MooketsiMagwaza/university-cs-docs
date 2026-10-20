-- Title: Add corresponding list values and stop at the shorter list
{-
QUESTION
Write pairSums xs ys. Add corresponding elements. Stop as soon as
either list ends; ignore unmatched elements.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

pairSums :: [Integer] -> [Integer] -> [Integer]
pairSums = undefined -- Your answer here

main :: IO ()
main = do
  print (pairSums [] [])  -- expected: []
  print (pairSums [1] [])  -- expected: []
  print (pairSums [] [2,3])  -- expected: []
  print (pairSums [1,3,5] [2])  -- expected: [3]
  print (pairSums [1,3] [2,4,6])  -- expected: [3,7]
