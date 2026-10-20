-- Title: Drop only the initial negative run
{-
QUESTION
Write prefix xs. Discard only the initial consecutive negative values.
Stop at the first non-negative value and return its entire suffix.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write prefix with the stated list and result types.
-- Plan: Distinguish stopping at a boundary from selecting matches throughout the list.
prefix :: [Integer] -> [Integer]
-- Base cases handle missing data; the recursive case consumes list structure.
prefix [] = []
prefix allXs@(x:xs)
  | x < 0 = prefix xs
  | otherwise = allXs

main :: IO ()
main = do
  print (prefix [])  -- expected: []
  print (prefix [-2])  -- expected: []
  print (prefix [0,-1])  -- expected: [0,-1]
  print (prefix [-2,-1,0,-3])  -- expected: [0,-3]
  print (prefix [1,2])  -- expected: [1,2]
