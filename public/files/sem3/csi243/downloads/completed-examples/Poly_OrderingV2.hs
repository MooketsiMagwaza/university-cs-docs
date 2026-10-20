-- Title: Check whether a polymorphic list is sorted
{-
QUESTION
Write sorted :: Ord a => [a] -> Bool recursively. [5]
Return True exactly for non-decreasing lists, including [] and singletons.
-}

-- Read the question: Write sorted :: Ord a => [a] -> Bool.
-- Plan: Check every adjacent pair while shrinking the list.
sorted :: Ord a => [a] -> Bool
sorted [] = True
sorted [_] = True
sorted (x:y:ys) = x <= y && sorted (y:ys)  -- Equal neighbours are allowed.

main :: IO ()
main = do
  print (sorted ([] :: [Int]))  -- expected: True
  print (sorted [7])  -- expected: True
  print (sorted [1,2,2,3])  -- expected: True
  print (sorted [1,3,2])  -- expected: False
  print (sorted "abc")  -- expected: True
