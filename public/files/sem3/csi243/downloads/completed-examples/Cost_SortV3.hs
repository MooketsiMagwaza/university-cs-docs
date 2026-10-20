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

-- Read the question: Write a definition; mergeSortCount has input/result type [Int] -> ([Int], Int).
-- Plan: Return the sorted result alongside a counter incremented at each key comparison.
mergeSortCount :: [Int] -> ([Int], Int)
mergeSortCount [] = ([], 0)
mergeSortCount [x] = ([x], 0)
mergeSortCount xs = (result, ca+cb+cm)
  where
    (l,r) = splitAt (length xs `div` 2) xs
    (a,ca) = mergeSortCount l
    (b,cb) = mergeSortCount r
    (result,cm) = merge a b
    merge [] ys = (ys,0)
    merge ys [] = (ys,0)
    merge as@(x:xt) bs@(y:yt)
      | x <= y = (x:p,pc+1)
      | otherwise = (y:q,qc+1)
      where
        (p,pc) = merge xt bs
        (q,qc) = merge as yt

main :: IO ()
main = do
  print (mergeSortCount [])  -- expected: ([],0)
  print (mergeSortCount [7])  -- expected: ([7],0)
  print (mergeSortCount [3,1,2])  -- expected: ([1,2,3],3)
  print (mergeSortCount [1,2,3])  -- expected: ([1,2,3],2)
  print (mergeSortCount [4,3,2,1])  -- expected: ([1,2,3,4],4)
