-- Title: Take a prefix from a list of strings
{-
QUESTION
Write takeR n xs. Return the first n strings.
Treat negative counts as zero. If n exceeds the length, return the whole list.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write takeR with the stated list and result types.
-- Plan: Handle non-positive counts before inspecting the list; reduce count and tail together.
takeR :: Int -> [String] -> [String]
-- Base cases handle missing data; the recursive case consumes list structure.
takeR n _ | n <= 0 = []
takeR _ [] = []
takeR n (x:xs) = x : takeR (n-1) xs

main :: IO ()
main = do
  print (takeR (-1) ["a"])  -- expected: []
  print (takeR 0 ["a"])  -- expected: []
  print (takeR 2 [])  -- expected: []
  print (takeR 1 ["cat"])  -- expected: ["cat"]
  print (takeR 2 ["a","bb","c"])  -- expected: ["a","bb"]
  print (takeR 5 ["a"])  -- expected: ["a"]
