-- Title: Implement ascending lexicographic merge sort
{-
QUESTION
Write mergeOrdered and mergeSort with the signatures below.
Order strings in ascending lexicographic order.
mergeOrdered assumes both inputs are sorted, keeps all duplicates and
chooses the left input on a tie. mergeSort must split into contiguous
halves with splitAt, recursively sort both, and merge them. Do not use
sort or sortBy. Handle empty, singleton and unequal-length inputs.
-}

-- Read the question: Write the declared functions with the specified ordering.
-- Plan: Follow the ordering rule; preserve ties as stated and handle empty input.
mergeOrdered :: [String] -> [String] -> [String]
mergeOrdered [] ys = ys
mergeOrdered xs [] = xs
mergeOrdered left@(x:xs) right@(y:ys)
  | x <= y = x : mergeOrdered xs right
  | otherwise = y : mergeOrdered left ys

mergeSort :: [String] -> [String]
mergeSort [] = []
mergeSort [x] = [x]
mergeSort xs = mergeOrdered (mergeSort left) (mergeSort right)
  where
    -- Contiguous halves plus left-first ties preserve original tie order.
    (left, right) = splitAt (length xs `div` 2) xs

main :: IO ()
main = do
  print (mergeOrdered [] ["a"])  -- expected: ["a"]
  print (mergeOrdered ["a","b","z"] ["b"])  -- expected: ["a","b","b","z"]
  print (mergeOrdered ["x"] [])  -- expected: ["x"]
  print (mergeSort [])  -- expected: []
  print (mergeSort [""])  -- expected: [""]
  print (mergeSort ["bat","ant","bat","Cat"])  -- expected: ["Cat","ant","bat","bat"]
