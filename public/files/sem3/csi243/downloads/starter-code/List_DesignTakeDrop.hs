-- Title: Take a bounded prefix with a negative-count policy
{-
QUESTION
Write takeR n xs. Return the first n elements.
Treat negative counts as zero. If n exceeds the length, return the whole list.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

takeR :: Int -> [Integer] -> [Integer]
takeR = undefined -- Your answer here

main :: IO ()
main = do
  print (takeR (-2) [1,2])  -- expected: []
  print (takeR 0 [1])  -- expected: []
  print (takeR 3 [])  -- expected: []
  print (takeR 1 [7])  -- expected: [7]
  print (takeR 2 [1,2,3])  -- expected: [1,2]
  print (takeR 9 [1,2])  -- expected: [1,2]
