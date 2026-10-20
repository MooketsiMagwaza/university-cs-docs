-- Title: Count occurrences in a list of Int values
{-
QUESTION
Specify and implement elementOccurs recursively. Count occurrences of a given
Int in a list. Use list first, target second.
For example, elementOccurs [1,2,3,1,3,1] 1 = 3.
-}

-- Read the question: Write elementOccurs :: [Int] -> Int -> Int.
-- Plan: Add one only when the head equals the target, then recurse on the tail.
-- Dry run: elementOccurs [1,2,3,1,3,1] 1 = 1+(0+(0+(1+(0+(1+0))))) = 3.
elementOccurs :: [Int] -> Int -> Int
elementOccurs xs target
  | null xs = 0 -- Base: no more matches.
  | head xs == target = 1 + elementOccurs (tail xs) target
  | otherwise = elementOccurs (tail xs) target

main :: IO ()
main = do
  print (elementOccurs [1,2,3,1,3,1] 1)  -- expected: 3
  print (elementOccurs [] 1)  -- expected: 0
  print (elementOccurs [1] 1)  -- expected: 1
  print (elementOccurs [2,3] 1)  -- expected: 0
  print (elementOccurs [1,1] 1)  -- expected: 2
