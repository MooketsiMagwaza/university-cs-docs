-- Title: Merge two descending lists
{-
QUESTION
Write mergeR :: [Integer] -> [Integer] -> [Integer] recursively. [6]
Both inputs are descending. Retain duplicates and all unmatched elements.
Do not concatenate then sort.
-}

-- Read the question: Write mergeR :: [Integer] -> [Integer] -> [Integer].
-- Plan: Compare the heads, emit the earlier one and recurse on its tail.
mergeR :: [Integer] -> [Integer] -> [Integer]
mergeR [] ys = ys
mergeR xs [] = xs
mergeR (x:xs) (y:ys)
  | x >= y = x : mergeR xs (y:ys)  -- Consume only the chosen head.
  | otherwise = y : mergeR (x:xs) ys

main :: IO ()
main = do
  print (mergeR [] [])  -- expected: []
  print (mergeR [1] [])  -- expected: [1]
  print (mergeR [] [3,2])  -- expected: [3,2]
  print (mergeR [3,1] [4,2])  -- expected: [4,3,2,1]
  print (mergeR [2,1] [3,2])  -- expected: [3,2,2,1]
