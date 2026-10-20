-- Title: Count occurrences in a list of Char values
{-
QUESTION
Specify and implement elementOccurs recursively. Count occurrences of a given
Char in a list. Use list first, target second.
For example, elementOccurs "banana" 'a' = 3.
-}

-- Read the question: Write elementOccurs :: [Char] -> Char -> Int.
-- Plan: Add one only when the head equals the target, then recurse on the tail.
-- Dry run: elementOccurs "banana" 'a' = 0+(1+(0+(1+(0+(1+0))))) = 3.
elementOccurs :: [Char] -> Char -> Int
elementOccurs xs target
  | null xs = 0 -- Base: no more matches.
  | head xs == target = 1 + elementOccurs (tail xs) target
  | otherwise = elementOccurs (tail xs) target

main :: IO ()
main = do
  print (elementOccurs "banana" 'a')  -- expected: 3
  print (elementOccurs "" 'a')  -- expected: 0
  print (elementOccurs "a" 'a')  -- expected: 1
  print (elementOccurs "xyz" 'a')  -- expected: 0
  print (elementOccurs "aa" 'a')  -- expected: 2
