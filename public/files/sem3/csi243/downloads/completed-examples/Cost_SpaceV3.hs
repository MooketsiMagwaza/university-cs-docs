-- Title: Count short-circuit search demand and result size
{-
QUESTION
Write searchDemand :: Int -> [Int] -> (Bool, Int, Int). Return whether
the target occurs, the number of equality comparisons demanded by a
left-to-right short-circuit search, and the number of result list cells
(Boolean output uses zero list cells). Do not traverse an untouched
suffix to count it. Empty input costs zero; best non-empty success costs
one comparison and worst case n. Under tail-call reuse, control state
can be constant, but retained external input roots are a separate issue.
No exact runtime memory claim follows from these pure counts.
-}

-- Read the question: Write a definition; searchDemand has input/result type Int -> [Int] -> (Bool, Int, Int).
-- Plan: Count the abstract slots demanded by the question, separately from runtime bytes.
searchDemand :: Int -> [Int] -> (Bool, Int, Int)
searchDemand target xs = (found, comparisons, 0)
  where
    (found,comparisons) = go xs 0
    go [] count = (False,count)
    go (x:rest) count
      | target == x = (True,next)
      | otherwise = next `seq` go rest next
      where next = count+1 -- Force the counter before the tail call.

main :: IO ()
main = do
  print (searchDemand 3 [])  -- expected: (False,0,0)
  print (searchDemand 3 [3])  -- expected: (True,1,0)
  print (searchDemand 3 [3,1,2])  -- expected: (True,1,0)
  print (searchDemand 3 [1,2,3])  -- expected: (True,3,0)
  print (searchDemand 9 [1,2,3])  -- expected: (False,3,0)
