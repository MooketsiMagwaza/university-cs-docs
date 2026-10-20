-- Title: Add corresponding list values and stop at the shorter list
{-
QUESTION
Write pairSums xs ys. Add corresponding elements. Stop as soon as
either list ends; ignore unmatched elements.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write pairSums with the stated list and result types.
-- Plan: Specify both empty-list cases before consuming the available heads.
pairSums :: [Integer] -> [Integer] -> [Integer]
-- Base cases handle missing data; the recursive case consumes list structure.
pairSums [] _ = []
pairSums _ [] = []
pairSums (x:xs) (y:ys) = (x+y) : pairSums xs ys

main :: IO ()
main = do
  print (pairSums [] [])  -- expected: []
  print (pairSums [1] [])  -- expected: []
  print (pairSums [] [2,3])  -- expected: []
  print (pairSums [1,3,5] [2])  -- expected: [3]
  print (pairSums [1,3] [2,4,6])  -- expected: [3,7]
