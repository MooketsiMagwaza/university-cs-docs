-- Title: Merge two lexicographically ascending lists
{-
QUESTION
Write mergeR :: [String] -> [String] -> [String] recursively. [6]
Both inputs are lexicographically ascending. Retain duplicates and all unmatched elements.
Do not concatenate then sort.
-}

mergeR :: [String] -> [String] -> [String]
mergeR = undefined  -- Your answer here

main :: IO ()
main = do
  print (mergeR [] [])  -- expected: []
  print (mergeR ["a"] [])  -- expected: ["a"]
  print (mergeR [] ["b","c"])  -- expected: ["b","c"]
  print (mergeR ["a","c"] ["b","d"])  -- expected: ["a","b","c","d"]
  print (mergeR ["a","b"] ["b","c"])  -- expected: ["a","b","b","c"]
