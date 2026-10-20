-- Title: Count occurrences in a list of String values
{-
QUESTION
Specify and implement occurs recursively. Count occurrences of a given
String in a list. Use target first, list second.
For example, occurs "red" ["red","blue","red"] = 2.
-}

-- Read the question: Write occurs :: String -> [String] -> Int.
-- Plan: Add one only when the head equals the target, then recurse on the tail.
-- Dry run: occurs "red" ["red","blue","red"] = 1 + (0 + (1 + 0)) = 2.
occurs :: String -> [String] -> Int
occurs target xs
  | null xs = 0 -- Base: no more matches.
  | head xs == target = 1 + occurs target (tail xs)
  | otherwise = occurs target (tail xs)

main :: IO ()
main = do
  print (occurs "red" ["red","blue","red"])  -- expected: 2
  print (occurs "red" [])  -- expected: 0
  print (occurs "red" ["red"])  -- expected: 1
  print (occurs "red" ["blue"])  -- expected: 0
  print (occurs "" ["",""])  -- expected: 2
