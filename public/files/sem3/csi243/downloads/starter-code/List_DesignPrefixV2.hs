-- Title: Drop only the initial negative run
{-
QUESTION
Write prefix xs. Discard only the initial consecutive negative values.
Stop at the first non-negative value and return its entire suffix.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

prefix :: [Integer] -> [Integer]
prefix = undefined -- Your answer here

main :: IO ()
main = do
  print (prefix [])  -- expected: []
  print (prefix [-2])  -- expected: []
  print (prefix [0,-1])  -- expected: [0,-1]
  print (prefix [-2,-1,0,-3])  -- expected: [0,-3]
  print (prefix [1,2])  -- expected: [1,2]
