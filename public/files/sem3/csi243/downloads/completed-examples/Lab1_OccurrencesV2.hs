-- Title: Count occurrences in a list of Char values
{-
QUESTION
Specify and implement occurs recursively. Count occurrences of a given
Char in a list. Use target first, list second.
For example, occurs 'a' "banana" = 3.
-}

-- Read the question: Write occurs :: Char -> [Char] -> Int.
-- Plan: Add one only when the head equals the target, then recurse on the tail.
-- Dry run: occurs 'a' "banana" = 0 + (1 + (0 + (1 + (0 + (1 + 0))))).
occurs :: Char -> [Char] -> Int
occurs target xs
  | null xs = 0 -- Base: no more matches.
  | head xs == target = 1 + occurs target (tail xs)
  | otherwise = occurs target (tail xs)

main :: IO ()
main = do
  print (occurs 'a' "banana")  -- expected: 3
  print (occurs 'a' "")  -- expected: 0
  print (occurs 'a' "a")  -- expected: 1
  print (occurs 'a' "xyz")  -- expected: 0
  print (occurs 'a' "aa")  -- expected: 2
