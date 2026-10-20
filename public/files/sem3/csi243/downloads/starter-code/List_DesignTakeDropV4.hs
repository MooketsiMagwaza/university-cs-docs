-- Title: Take a prefix from a list of strings
{-
QUESTION
Write takeR n xs. Return the first n strings.
Treat negative counts as zero. If n exceeds the length, return the whole list.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

takeR :: Int -> [String] -> [String]
takeR = undefined -- Your answer here

main :: IO ()
main = do
  print (takeR (-1) ["a"])  -- expected: []
  print (takeR 0 ["a"])  -- expected: []
  print (takeR 2 [])  -- expected: []
  print (takeR 1 ["cat"])  -- expected: ["cat"]
  print (takeR 2 ["a","bb","c"])  -- expected: ["a","bb"]
  print (takeR 5 ["a"])  -- expected: ["a"]
