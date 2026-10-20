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

mergeOrdered :: [(String,Int)] -> [(String,Int)] -> [(String,Int)]
mergeOrdered = undefined -- Your answer here

mergeSort :: [(String,Int)] -> [(String,Int)]
mergeSort = undefined -- Your answer here

main :: IO ()
main = do
  print (mergeOrdered [] [("a",1)])  -- expected: [("a",1)]
  print (mergeOrdered [("a",1),("b",2)] [("c",2)])  -- expected: [("a",1),("b",2),("c",2)]
  print (mergeOrdered [("a",1)] [])  -- expected: [("a",1)]
  print (mergeSort [])  -- expected: []
  print (mergeSort [("a",1)])  -- expected: [("a",1)]
  print (mergeSort [("z",2),("a",2),("b",1),("c",2)])  -- expected: [("b",1),("z",2),("a",2),("c",2)]
