-- Title: Implement descending merge sort on integers
{-
QUESTION
Write mergeOrdered and mergeSort with the signatures below.
Order integers in descending order.
mergeOrdered assumes both inputs are sorted, keeps all duplicates and
chooses the left input on a tie. mergeSort must split into contiguous
halves with splitAt, recursively sort both, and merge them. Do not use
sort or sortBy. Handle empty, singleton and unequal-length inputs.
-}

mergeOrdered :: [Int] -> [Int] -> [Int]
mergeOrdered = undefined -- Your answer here

mergeSort :: [Int] -> [Int]
mergeSort = undefined -- Your answer here

main :: IO ()
main = do
  print (mergeOrdered [] [3,1])  -- expected: [3,1]
  print (mergeOrdered [5,3,1] [4,3])  -- expected: [5,4,3,3,1]
  print (mergeOrdered [2] [])  -- expected: [2]
  print (mergeSort [])  -- expected: []
  print (mergeSort [1])  -- expected: [1]
  print (mergeSort [2,5,1,2])  -- expected: [5,2,2,1]
