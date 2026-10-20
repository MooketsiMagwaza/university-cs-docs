-- Title: Transform each string into its length recursively
{-
QUESTION
Write lengths for a list of strings, returning each length as Int.
Define a recursive local string-length helper as well.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

lengths :: [String] -> [Int]
lengths = undefined -- Your answer here

main :: IO ()
main = do
  print (lengths [])  -- expected: []
  print (lengths [""])  -- expected: [0]
  print (lengths ["a","cat",""])  -- expected: [1,3,0]
  print (lengths ["hi","hi"])  -- expected: [2,2]
  print (lengths ["abcd"])  -- expected: [4]
