-- Title: Implement descending insertion sort for integers
{-
QUESTION
Write insertOrdered and insertionSort with the signatures below.
Order integers from greatest to least.
Use recursion, not sort or sortBy. Insert before equal keys and
recursively sort the tail before inserting the head, so ties retain
their input order. insertOrdered assumes its input list is sorted.
-}

insertOrdered :: Int -> [Int] -> [Int]
insertOrdered = undefined -- Your answer here

insertionSort :: [Int] -> [Int]
insertionSort = undefined -- Your answer here

main :: IO ()
main = do
  print (insertionSort [])  -- expected: []
  print (insertionSort [7])  -- expected: [7]
  print (insertionSort [2,1,2,3])  -- expected: [3,2,2,1]
  print (insertionSort [-1,0,-2])  -- expected: [0,-1,-2]
  print (insertOrdered 2 [4,2,1])  -- expected: [4,2,2,1]
