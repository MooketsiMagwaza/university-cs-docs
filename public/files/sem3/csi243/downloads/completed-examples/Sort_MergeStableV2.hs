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

-- Read the question: Write the declared functions with the specified ordering.
-- Plan: Follow the ordering rule; preserve ties as stated and handle empty input.
mergeOrdered :: [Int] -> [Int] -> [Int]
mergeOrdered [] ys = ys
mergeOrdered xs [] = xs
mergeOrdered left@(x:xs) right@(y:ys)
  | x >= y = x : mergeOrdered xs right
  | otherwise = y : mergeOrdered left ys

mergeSort :: [Int] -> [Int]
mergeSort [] = []
mergeSort [x] = [x]
mergeSort xs = mergeOrdered (mergeSort left) (mergeSort right)
  where
    -- Contiguous halves plus left-first ties preserve original tie order.
    (left, right) = splitAt (length xs `div` 2) xs

main :: IO ()
main = do
  print (mergeOrdered [] [3,1])  -- expected: [3,1]
  print (mergeOrdered [5,3,1] [4,3])  -- expected: [5,4,3,3,1]
  print (mergeOrdered [2] [])  -- expected: [2]
  print (mergeSort [])  -- expected: []
  print (mergeSort [1])  -- expected: [1]
  print (mergeSort [2,5,1,2])  -- expected: [5,2,2,1]
