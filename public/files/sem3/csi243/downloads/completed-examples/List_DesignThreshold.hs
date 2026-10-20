-- Title: Select values strictly above a threshold
{-
QUESTION
Write largerY y xs. Select exactly the elements of xs strictly larger
than y, preserving their order and duplicates.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write largerY with the stated list and result types.
-- Plan: Test the head, then select, count or search in the remaining tail.
largerY :: Integer -> [Integer] -> [Integer]
-- Base cases handle missing data; the recursive case consumes list structure.
largerY _ [] = []
largerY y (x:xs)
  | x > y = x : largerY y xs
  | otherwise = largerY y xs

main :: IO ()
main = do
  print (largerY 2 [])  -- expected: []
  print (largerY 2 [2])  -- expected: []
  print (largerY 2 [3,2,5,3])  -- expected: [3,5,3]
  print (largerY 0 [1,2,3])  -- expected: [1,2,3]
  print (largerY 5 [1,2,3])  -- expected: []
  print (largerY (-2) [-3,-2,-1,0])  -- expected: [-1,0]
