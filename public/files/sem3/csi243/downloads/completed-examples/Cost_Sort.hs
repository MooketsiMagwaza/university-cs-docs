-- Title: Instrument insertion sort's key comparisons
{-
QUESTION
Write insertionCount :: [Int] -> ([Int], Int), returning an ascending
insertion sort and its number of <= key comparisons. Sort the tail first;
insert its head before the first value >= it. Do not count pattern tests
or construction. Empty and singleton lists require zero comparisons.
For n>=1, ascending inputs need n-1 comparisons; strictly descending
inputs need 1+...+(n-1)=n(n-1)/2. Assume constant-cost Int comparison.
-}

-- Read the question: Write a definition; insertionCount has input/result type [Int] -> ([Int], Int).
-- Plan: Return the sorted result alongside a counter incremented at each key comparison.
insertionCount :: [Int] -> ([Int], Int)
insertionCount [] = ([], 0)
insertionCount (x:xs) = (result, tailCost + insertCost)
  where
    (sorted, tailCost) = insertionCount xs
    (result, insertCost) = insert x sorted
    insert a [] = ([a], 0)
    insert a ys@(b:bs)
      | a <= b = (a:ys, 1)
      | otherwise = (b:rest, count+1)
      where (rest, count) = insert a bs

main :: IO ()
main = do
  print (insertionCount [])  -- expected: ([],0)
  print (insertionCount [1])  -- expected: ([1],0)
  print (insertionCount [1,2,3,4])  -- expected: ([1,2,3,4],3)
  print (insertionCount [4,3,2,1])  -- expected: ([1,2,3,4],6)
  print (insertionCount [2,1,2])  -- expected: ([1,2,2],3)
