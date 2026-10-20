-- Title: Select values strictly above a threshold
{-
QUESTION
Write largerY y xs. Select exactly the elements of xs strictly larger
than y, preserving their order and duplicates.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

largerY :: Integer -> [Integer] -> [Integer]
largerY = undefined -- Your answer here

main :: IO ()
main = do
  print (largerY 2 [])  -- expected: []
  print (largerY 2 [2])  -- expected: []
  print (largerY 2 [3,2,5,3])  -- expected: [3,5,3]
  print (largerY 0 [1,2,3])  -- expected: [1,2,3]
  print (largerY 5 [1,2,3])  -- expected: []
  print (largerY (-2) [-3,-2,-1,0])  -- expected: [-1,0]
