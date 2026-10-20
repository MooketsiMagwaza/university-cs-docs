-- Title: Implement stable merge sort on labelled scores
{-
QUESTION
Write mergeOrdered and mergeSort with the signatures below.
Order labelled pairs by ascending score only.
mergeOrdered assumes both inputs are sorted, keeps all duplicates and
chooses the left input on a tie. mergeSort must split into contiguous
halves with splitAt, recursively sort both, and merge them. Do not use
sort or sortBy. Handle empty, singleton and unequal-length inputs.
-}

-- Read the question: Write the declared functions with the specified ordering.
-- Plan: Follow the ordering rule; preserve ties as stated and handle empty input.
mergeOrdered :: [(String,Int)] -> [(String,Int)] -> [(String,Int)]
mergeOrdered [] ys = ys
mergeOrdered xs [] = xs
mergeOrdered left@(x:xs) right@(y:ys)
  | snd x <= snd y = x : mergeOrdered xs right
  | otherwise = y : mergeOrdered left ys

mergeSort :: [(String,Int)] -> [(String,Int)]
mergeSort [] = []
mergeSort [x] = [x]
mergeSort xs = mergeOrdered (mergeSort left) (mergeSort right)
  where
    -- Contiguous halves plus left-first ties preserve original tie order.
    (left, right) = splitAt (length xs `div` 2) xs

main :: IO ()
main = do
  print (mergeOrdered [] [("a",1)])  -- expected: [("a",1)]
  print (mergeOrdered [("a",1),("b",2)] [("c",2)])  -- expected: [("a",1),("b",2),("c",2)]
  print (mergeOrdered [("a",1)] [])  -- expected: [("a",1)]
  print (mergeSort [])  -- expected: []
  print (mergeSort [("a",1)])  -- expected: [("a",1)]
  print (mergeSort [("z",2),("a",2),("b",1),("c",2)])  -- expected: [("b",1),("z",2),("a",2),("c",2)]
