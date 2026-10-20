-- Title: Merge two ascending lists
{-
QUESTION
Write mergeR :: [Integer] -> [Integer] -> [Integer] recursively. [6]
Both inputs are ascending. Retain duplicates and all unmatched elements.
Do not concatenate then sort.
-}

mergeR :: [Integer] -> [Integer] -> [Integer]
mergeR = undefined  -- Your answer here

main :: IO ()
main = do
  print (mergeR [] [])  -- expected: []
  print (mergeR [1] [])  -- expected: [1]
  print (mergeR [] [2,3])  -- expected: [2,3]
  print (mergeR [1,3] [2,4])  -- expected: [1,2,3,4]
  print (mergeR [1,2] [2,3])  -- expected: [1,2,2,3]
