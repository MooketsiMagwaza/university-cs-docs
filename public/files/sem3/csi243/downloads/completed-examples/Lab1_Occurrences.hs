-- Title: Count occurrences in a list of Int values
{-
QUESTION
Specify and implement occurs recursively. Count occurrences of a given
Int in a list. Use target first, list second.
For example, occurs 1 [1,2,3,1,3,1] = 3.
-}

-- Read the question: Write occurs :: Int -> [Int] -> Int.
-- Plan: Add one only when the head equals the target, then recurse on the tail.
-- Dry run: occurs 1 [1,2,3,1,3,1] = 1 + (0 + (0 + (1 + (0 + (1 + 0))))).
occurs :: Int -> [Int] -> Int
occurs target xs
  | null xs = 0 -- Base: no more matches.
  | head xs == target = 1 + occurs target (tail xs)
  | otherwise = occurs target (tail xs)

main :: IO ()
main = do
  print (occurs 1 [1,2,3,1,3,1])  -- expected: 3
  print (occurs 1 [])  -- expected: 0
  print (occurs 1 [1])  -- expected: 1
  print (occurs 1 [2,3])  -- expected: 0
  print (occurs 1 [1,1])  -- expected: 2
