-- Title: Merge two lexicographically ascending lists
{-
QUESTION
Write mergeR :: [String] -> [String] -> [String] recursively. [6]
Both inputs are lexicographically ascending. Retain duplicates and all unmatched elements.
Do not concatenate then sort.
-}

-- Read the question: Write mergeR :: [String] -> [String] -> [String].
-- Plan: Compare the heads, emit the earlier one and recurse on its tail.
mergeR :: [String] -> [String] -> [String]
mergeR [] ys = ys
mergeR xs [] = xs
mergeR (x:xs) (y:ys)
  | x <= y = x : mergeR xs (y:ys)  -- Consume only the chosen head.
  | otherwise = y : mergeR (x:xs) ys

main :: IO ()
main = do
  print (mergeR [] [])  -- expected: []
  print (mergeR ["a"] [])  -- expected: ["a"]
  print (mergeR [] ["b","c"])  -- expected: ["b","c"]
  print (mergeR ["a","c"] ["b","d"])  -- expected: ["a","b","c","d"]
  print (mergeR ["a","b"] ["b","c"])  -- expected: ["a","b","b","c"]
