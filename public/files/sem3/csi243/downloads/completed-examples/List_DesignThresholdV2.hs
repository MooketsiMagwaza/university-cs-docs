-- Title: Select positive values while preserving order
{-
QUESTION
Write positiveNumbers xs. Select exactly the strictly positive
elements, preserving order and duplicates. Zero is excluded.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write positiveNumbers with the stated list and result types.
-- Plan: Test the head, then select, count or search in the remaining tail.
positiveNumbers :: [Integer] -> [Integer]
-- Base cases handle missing data; the recursive case consumes list structure.
positiveNumbers [] = []
positiveNumbers (x:xs)
  | x > 0 = x : positiveNumbers xs
  | otherwise = positiveNumbers xs

main :: IO ()
main = do
  print (positiveNumbers [])  -- expected: []
  print (positiveNumbers [0])  -- expected: []
  print (positiveNumbers [-2,0,3,1,3])  -- expected: [3,1,3]
  print (positiveNumbers [1,2])  -- expected: [1,2]
  print (positiveNumbers [-1,-2])  -- expected: []
