-- Title: Implement stable ascending insertion sort on labelled scores
{-
QUESTION
Write insertOrdered and insertionSort with the signatures below.
Order labelled pairs by ascending score only.
Use recursion, not sort or sortBy. Insert before equal keys and
recursively sort the tail before inserting the head, so ties retain
their input order. insertOrdered assumes its input list is sorted.
-}

insertOrdered :: (String,Int) -> [(String,Int)] -> [(String,Int)]
insertOrdered = undefined -- Your answer here

insertionSort :: [(String,Int)] -> [(String,Int)]
insertionSort = undefined -- Your answer here

main :: IO ()
main = do
  print (insertionSort [])  -- expected: []
  print (insertionSort [("a",1)])  -- expected: [("a",1)]
  print (insertionSort [("z",2),("a",2),("b",1)])  -- expected: [("b",1),("z",2),("a",2)]
  print (insertionSort [("a",3),("b",1),("c",2)])  -- expected: [("b",1),("c",2),("a",3)]
  print (insertOrdered ("z",2) [("a",2),("b",3)])  -- expected: [("z",2),("a",2),("b",3)]
