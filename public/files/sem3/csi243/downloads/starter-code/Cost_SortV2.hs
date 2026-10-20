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

mergeCount :: [Int] -> [Int] -> ([Int], Int)
mergeCount = undefined -- Your answer here

main :: IO ()
main = do
  print (mergeCount [] [])  -- expected: ([],0)
  print (mergeCount [] [1,2])  -- expected: ([1,2],0)
  print (mergeCount [1] [1])  -- expected: ([1,1],1)
  print (mergeCount [1,3] [2,4])  -- expected: ([1,2,3,4],3)
  print (mergeCount [1,2] [3,4])  -- expected: ([1,2,3,4],2)
  print (mergeCount [2,4] [1,3])  -- expected: ([1,2,3,4],3)
