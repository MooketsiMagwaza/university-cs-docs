-- Title: Count merge-sort comparisons with uneven splitting
{-
QUESTION
Write mergeSortCount :: [Int] -> ([Int], Int). Split at length xs div 2,
recursively sort both halves and merge using <=, taking the left on ties.
Count only key comparisons; do not count length or splitAt traversals.
State separately that those traversals add O(n) local work, giving
T(n)=T(floor(n/2))+T(ceil(n/2))+O(n)=O(n log n).
Two shrinking half-size branches do not give the Fibonacci recurrence.
-}

mergeSortCount :: [Int] -> ([Int], Int)
mergeSortCount = undefined -- Your answer here

main :: IO ()
main = do
  print (mergeSortCount [])  -- expected: ([],0)
  print (mergeSortCount [7])  -- expected: ([7],0)
  print (mergeSortCount [3,1,2])  -- expected: ([1,2,3],3)
  print (mergeSortCount [1,2,3])  -- expected: ([1,2,3],2)
  print (mergeSortCount [4,3,2,1])  -- expected: ([1,2,3,4],4)
