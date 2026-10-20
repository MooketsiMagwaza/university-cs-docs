-- Title: Count occurrences in a list of Char values
{-
QUESTION
Specify and implement elementOccurs recursively. Count occurrences of a given
Char in a list. Use list first, target second.
For example, elementOccurs "banana" 'a' = 3.
-}

elementOccurs :: [Char] -> Char -> Int
elementOccurs = undefined -- Your answer here

main :: IO ()
main = do
  print (elementOccurs "banana" 'a')  -- expected: 3
  print (elementOccurs "" 'a')  -- expected: 0
  print (elementOccurs "a" 'a')  -- expected: 1
  print (elementOccurs "xyz" 'a')  -- expected: 0
  print (elementOccurs "aa" 'a')  -- expected: 2
