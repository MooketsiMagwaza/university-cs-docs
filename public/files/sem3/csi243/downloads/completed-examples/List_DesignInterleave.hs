-- Title: Alternate two integer lists and retain the remainder
{-
QUESTION
Write interleave xs ys. Alternate a head from xs then a head from ys.
When one list ends, keep the entire remainder of the other list.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write interleave with the stated list and result types.
-- Plan: Specify both empty-list cases before consuming the available heads.
interleave :: [Integer] -> [Integer] -> [Integer]
-- Base cases handle missing data; the recursive case consumes list structure.
interleave [] ys = ys
interleave xs [] = xs
interleave (x:xs) (y:ys) = x : y : interleave xs ys

main :: IO ()
main = do
  print (interleave [] [])  -- expected: []
  print (interleave [1] [])  -- expected: [1]
  print (interleave [] [2,3])  -- expected: [2,3]
  print (interleave [1,3,5] [2])  -- expected: [1,2,3,5]
  print (interleave [1] [2,4,6])  -- expected: [1,2,4,6]
