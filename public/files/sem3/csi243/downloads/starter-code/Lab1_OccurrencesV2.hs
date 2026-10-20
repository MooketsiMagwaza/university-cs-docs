-- Title: Count occurrences in a list of Char values
{-
QUESTION
Specify and implement occurs recursively. Count occurrences of a given
Char in a list. Use target first, list second.
For example, occurs 'a' "banana" = 3.
-}

occurs :: Char -> [Char] -> Int
occurs = undefined -- Your answer here

main :: IO ()
main = do
  print (occurs 'a' "banana")  -- expected: 3
  print (occurs 'a' "")  -- expected: 0
  print (occurs 'a' "a")  -- expected: 1
  print (occurs 'a' "xyz")  -- expected: 0
  print (occurs 'a' "aa")  -- expected: 2
