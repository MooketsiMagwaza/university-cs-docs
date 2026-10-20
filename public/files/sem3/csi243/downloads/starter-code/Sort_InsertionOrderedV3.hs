-- Title: Implement insertion sort by ascending string length
{-
QUESTION
Write insertOrdered and insertionSort with the signatures below.
Order strings by ascending length only.
Use recursion, not sort or sortBy. Insert before equal keys and
recursively sort the tail before inserting the head, so ties retain
their input order. insertOrdered assumes its input list is sorted.
-}

insertOrdered :: String -> [String] -> [String]
insertOrdered = undefined -- Your answer here

insertionSort :: [String] -> [String]
insertionSort = undefined -- Your answer here

main :: IO ()
main = do
  print (insertionSort [])  -- expected: []
  print (insertionSort [""])  -- expected: [""]
  print (insertionSort ["bb","aa","x","ccc"])  -- expected: ["x","bb","aa","ccc"]
  print (insertionSort ["a","","b"])  -- expected: ["","a","b"]
  print (insertOrdered "zz" ["x","aa","bbb"])  -- expected: ["x","zz","aa","bbb"]
