-- Title: Count occurrences in a list of Int values
{-
QUESTION
Specify and implement elementOccurs recursively. Count occurrences of a given
Int in a list. Use list first, target second.
For example, elementOccurs [1,2,3,1,3,1] 1 = 3.
-}

elementOccurs :: [Int] -> Int -> Int
elementOccurs = undefined -- Your answer here

main :: IO ()
main = do
  print (elementOccurs [1,2,3,1,3,1] 1)  -- expected: 3
  print (elementOccurs [] 1)  -- expected: 0
  print (elementOccurs [1] 1)  -- expected: 1
  print (elementOccurs [2,3] 1)  -- expected: 0
  print (elementOccurs [1,1] 1)  -- expected: 2
