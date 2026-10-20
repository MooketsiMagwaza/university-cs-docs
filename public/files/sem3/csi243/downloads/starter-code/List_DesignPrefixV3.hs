-- Title: Split at the first value below a threshold
{-
QUESTION
Write prefix threshold xs. Split xs into its longest initial run of
values at least threshold and the remaining suffix. Do not filter.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

prefix :: Integer -> [Integer] -> ([Integer],[Integer])
prefix = undefined -- Your answer here

main :: IO ()
main = do
  print (prefix 2 [])  -- expected: ([],[])
  print (prefix 2 [2])  -- expected: ([2],[])
  print (prefix 2 [1,3])  -- expected: ([],[1,3])
  print (prefix 2 [4,2,1,5])  -- expected: ([4,2],[1,5])
  print (prefix 0 [0,1,2])  -- expected: ([0,1,2],[])
