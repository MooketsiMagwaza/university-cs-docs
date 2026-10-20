-- Title: Select positive values while preserving order
{-
QUESTION
Write positiveNumbers xs. Select exactly the strictly positive
elements, preserving order and duplicates. Zero is excluded.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

positiveNumbers :: [Integer] -> [Integer]
positiveNumbers = undefined -- Your answer here

main :: IO ()
main = do
  print (positiveNumbers [])  -- expected: []
  print (positiveNumbers [0])  -- expected: []
  print (positiveNumbers [-2,0,3,1,3])  -- expected: [3,1,3]
  print (positiveNumbers [1,2])  -- expected: [1,2]
  print (positiveNumbers [-1,-2])  -- expected: []
