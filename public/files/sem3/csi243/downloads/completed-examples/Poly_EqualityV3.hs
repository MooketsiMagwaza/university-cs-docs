-- Title: Test whether two lists share an element
{-
QUESTION
Write overlaps :: Eq a => [a] -> [a] -> Bool recursively. [5]
Return True exactly when some element of the first occurs in the second.
You may use elem for the individual membership test.
-}

-- Read the question: Write overlaps :: Eq a => [a] -> [a] -> Bool.
-- Plan: Search the second list for each element of the first.
overlaps :: Eq a => [a] -> [a] -> Bool
overlaps [] _ = False
overlaps (x:xs) ys = elem x ys || overlaps xs ys  -- Search each candidate.

main :: IO ()
main = do
  print (overlaps ([] :: [Int]) [1])  -- expected: False
  print (overlaps [1] [])  -- expected: False
  print (overlaps [1,2] [2,3])  -- expected: True
  print (overlaps [1,2] [3,4])  -- expected: False
  print (overlaps "cat" "dog")  -- expected: False
