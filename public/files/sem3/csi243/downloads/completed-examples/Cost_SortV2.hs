-- Title: Count comparisons when merging two sorted inputs
{-
QUESTION
Write mergeCount :: [Int] -> [Int] -> ([Int], Int). Both inputs are
ascending. Merge using <= and prefer the left element on ties.
Count only key comparisons. For lengths m,n>0 the worst count is m+n-1;
an empty input needs zero comparisons. The result contains m+n elements,
so constructing an entirely fresh result would have an output-size
lower bound; this implementation may share an untouched suffix.
-}

-- Read the question: Write a definition; mergeCount has input/result type [Int] -> [Int] -> ([Int], Int).
-- Plan: Return the sorted result alongside a counter incremented at each key comparison.
mergeCount :: [Int] -> [Int] -> ([Int], Int)
mergeCount [] ys = (ys, 0) -- Share the remaining suffix.
mergeCount xs [] = (xs, 0)
mergeCount xs@(x:xt) ys@(y:yt)
  | x <= y = (x:left, lc+1)
  | otherwise = (y:right, rc+1)
  where
    (left, lc) = mergeCount xt ys
    (right, rc) = mergeCount xs yt

main :: IO ()
main = do
  print (mergeCount [] [])  -- expected: ([],0)
  print (mergeCount [] [1,2])  -- expected: ([1,2],0)
  print (mergeCount [1] [1])  -- expected: ([1,1],1)
  print (mergeCount [1,3] [2,4])  -- expected: ([1,2,3,4],3)
  print (mergeCount [1,2] [3,4])  -- expected: ([1,2,3,4],2)
  print (mergeCount [2,4] [1,3])  -- expected: ([1,2,3,4],3)
