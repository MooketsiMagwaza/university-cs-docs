-- Title: Scale every integer recursively
{-
QUESTION
Write multList factor xs, multiplying each element by factor.
Preserve order and return [] on empty input.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write multList with the stated list and result types.
-- Plan: Consume one head per step; return the appropriate empty result.
multList :: Integer -> [Integer] -> [Integer]
-- Base cases handle missing data; the recursive case consumes list structure.
multList _ [] = []
multList factor (x:xs) = factor*x : multList factor xs

main :: IO ()
main = do
  print (multList 3 [])  -- expected: []
  print (multList 3 [2])  -- expected: [6]
  print (multList (-2) [1,-3,0])  -- expected: [-2,6,0]
  print (multList 0 [1,2])  -- expected: [0,0]
  print (multList 1 [4,4])  -- expected: [4,4]
