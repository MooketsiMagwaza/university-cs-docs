-- Title: Take only the initial even run
{-
QUESTION
Write prefix xs. Return only the initial consecutive even values,
stopping at the first odd value even when later values are even.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write prefix with the stated list and result types.
-- Plan: Distinguish stopping at a boundary from selecting matches throughout the list.
prefix :: [Integer] -> [Integer]
-- Base cases handle missing data; the recursive case consumes list structure.
prefix [] = []
prefix (x:xs)
  | even x = x : prefix xs
  | otherwise = []

main :: IO ()
main = do
  print (prefix [])  -- expected: []
  print (prefix [2])  -- expected: [2]
  print (prefix [1,2,4])  -- expected: []
  print (prefix [2,4,3,6])  -- expected: [2,4]
  print (prefix [0,-2,8])  -- expected: [0,-2,8]
