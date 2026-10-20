-- Title: Sum the terms of a sequence recursively
{-
QUESTION
Provide a recursive definition, including a base case and recursive step,
for sumList :: [Int] -> Int.
Return the sum of all terms of the input sequence. Empty sum is 0.
-}

-- Read the question: Write sumList :: [Int] -> Int.
-- Plan: Combine the first term with the recursively combined remaining terms.
-- Dry run: sumList [1,2,3] = 1 + (2 + (3 + sumList [])) = 6.
sumList :: [Int] -> Int
sumList [] = 0 -- Base: no terms.
sumList (x:xs) = x + sumList xs

main :: IO ()
main = do
  print (sumList [])  -- expected: 0
  print (sumList [5])  -- expected: 5
  print (sumList [1,2,3])  -- expected: 6
  print (sumList [-2,2])  -- expected: 0
  print (sumList [4,4,1])  -- expected: 9
