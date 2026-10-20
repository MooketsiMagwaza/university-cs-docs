-- Title: Implement descending insertion sort for integers
{-
QUESTION
Write insertOrdered and insertionSort with the signatures below.
Order integers from greatest to least.
Use recursion, not sort or sortBy. Insert before equal keys and
recursively sort the tail before inserting the head, so ties retain
their input order. insertOrdered assumes its input list is sorted.
-}

-- Read the question: Write the declared functions with the specified ordering.
-- Plan: Follow the ordering rule; preserve ties as stated and handle empty input.
insertOrdered :: Int -> [Int] -> [Int]
insertOrdered x [] = [x]
insertOrdered x allItems@(y:ys)
  | x >= y = x : allItems
  | otherwise = y : insertOrdered x ys

insertionSort :: [Int] -> [Int]
insertionSort [] = []
-- Sorting the tail first makes inserting before an equal key stable.
insertionSort (x:xs) = insertOrdered x (insertionSort xs)

main :: IO ()
main = do
  print (insertionSort [])  -- expected: []
  print (insertionSort [7])  -- expected: [7]
  print (insertionSort [2,1,2,3])  -- expected: [3,2,2,1]
  print (insertionSort [-1,0,-2])  -- expected: [0,-1,-2]
  print (insertOrdered 2 [4,2,1])  -- expected: [4,2,2,1]
