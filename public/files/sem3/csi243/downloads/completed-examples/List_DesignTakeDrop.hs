-- Title: Take a bounded prefix with a negative-count policy
{-
QUESTION
Write takeR n xs. Return the first n elements.
Treat negative counts as zero. If n exceeds the length, return the whole list.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write takeR with the stated list and result types.
-- Plan: Handle non-positive counts before inspecting the list; reduce count and tail together.
takeR :: Int -> [Integer] -> [Integer]
-- Base cases handle missing data; the recursive case consumes list structure.
takeR n _ | n <= 0 = []
takeR _ [] = []
takeR n (x:xs) = x : takeR (n-1) xs

main :: IO ()
main = do
  print (takeR (-2) [1,2])  -- expected: []
  print (takeR 0 [1])  -- expected: []
  print (takeR 3 [])  -- expected: []
  print (takeR 1 [7])  -- expected: [7]
  print (takeR 2 [1,2,3])  -- expected: [1,2]
  print (takeR 9 [1,2])  -- expected: [1,2]
