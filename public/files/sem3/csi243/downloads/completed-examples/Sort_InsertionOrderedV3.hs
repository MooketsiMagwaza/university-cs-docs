-- Title: Implement insertion sort by ascending string length
{-
QUESTION
Write insertOrdered and insertionSort with the signatures below.
Order strings by ascending length only.
Use recursion, not sort or sortBy. Insert before equal keys and
recursively sort the tail before inserting the head, so ties retain
their input order. insertOrdered assumes its input list is sorted.
-}

-- Read the question: Write the declared functions with the specified ordering.
-- Plan: Follow the ordering rule; preserve ties as stated and handle empty input.
insertOrdered :: String -> [String] -> [String]
insertOrdered x [] = [x]
insertOrdered x allItems@(y:ys)
  | length x <= length y = x : allItems
  | otherwise = y : insertOrdered x ys

insertionSort :: [String] -> [String]
insertionSort [] = []
-- Sorting the tail first makes inserting before an equal key stable.
insertionSort (x:xs) = insertOrdered x (insertionSort xs)

main :: IO ()
main = do
  print (insertionSort [])  -- expected: []
  print (insertionSort [""])  -- expected: [""]
  print (insertionSort ["bb","aa","x","ccc"])  -- expected: ["x","bb","aa","ccc"]
  print (insertionSort ["a","","b"])  -- expected: ["","a","b"]
  print (insertOrdered "zz" ["x","aa","bbb"])  -- expected: ["x","zz","aa","bbb"]
