-- Title: Count occurrences in a list of String values
{-
QUESTION
Specify and implement elementOccurs recursively. Count occurrences of a given
String in a list. Use list first, target second.
For example, elementOccurs ["red","blue","red"] "red" = 2.
-}

-- Read the question: Write elementOccurs :: [String] -> String -> Int.
-- Plan: Add one only when the head equals the target, then recurse on the tail.
-- Dry run: elementOccurs ["red","blue","red"] "red" = 1+(0+(1+0)) = 2.
elementOccurs :: [String] -> String -> Int
elementOccurs xs target
  | null xs = 0 -- Base: no more matches.
  | head xs == target = 1 + elementOccurs (tail xs) target
  | otherwise = elementOccurs (tail xs) target

main :: IO ()
main = do
  print (elementOccurs ["red","blue","red"] "red")  -- expected: 2
  print (elementOccurs [] "red")  -- expected: 0
  print (elementOccurs ["red"] "red")  -- expected: 1
  print (elementOccurs ["blue"] "red")  -- expected: 0
  print (elementOccurs ["",""] "")  -- expected: 2
