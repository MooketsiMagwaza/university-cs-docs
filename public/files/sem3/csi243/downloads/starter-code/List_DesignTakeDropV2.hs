-- Title: Drop a bounded prefix with a negative-count policy
{-
QUESTION
Write dropR n xs. Discard the first n elements.
Treat negative counts as zero. If n exceeds the length, return [].
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

dropR :: Int -> [Integer] -> [Integer]
dropR = undefined -- Your answer here

main :: IO ()
main = do
  print (dropR (-2) [1,2])  -- expected: [1,2]
  print (dropR 0 [1])  -- expected: [1]
  print (dropR 3 [])  -- expected: []
  print (dropR 1 [7])  -- expected: []
  print (dropR 2 [1,2,3])  -- expected: [3]
  print (dropR 9 [1,2])  -- expected: []
