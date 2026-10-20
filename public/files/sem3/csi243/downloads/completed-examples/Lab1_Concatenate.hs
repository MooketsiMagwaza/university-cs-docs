-- Title: Concatenate two lists of Int values
{-
QUESTION
Specify and implement concatLists recursively, without using (++).
It takes two lists of Int values and returns their concatenation.
For example, concatLists [1,2,3] [4,5,6] = [1,2,3,4,5,6].
-}

-- Read the question: Write concatLists :: [Int] -> [Int] -> [Int].
-- Plan: Copy each head of the first list, then return the second list at the base.
-- Dry run: concatLists [1,2,3] [4,5,6] = 1 : (2 : (3 : [4,5,6])).
concatLists :: [Int] -> [Int] -> [Int]
concatLists xs ys
  | null xs = ys -- Base: nothing remains in the first list.
  | otherwise = head xs : concatLists (tail xs) ys

main :: IO ()
main = do
  print (concatLists [] [])  -- expected: []
  print (concatLists [1] [])  -- expected: [1]
  print (concatLists [] [2])  -- expected: [2]
  print (concatLists [1,2,3] [4,5,6])  -- expected: [1,2,3,4,5,6]
  print (concatLists [1,1] [2])  -- expected: [1,1,2]
