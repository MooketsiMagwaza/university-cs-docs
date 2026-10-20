-- Title: Concatenate two lists of Char values
{-
QUESTION
Specify and implement concatLists recursively, without using (++).
It takes two lists of Char values and returns their concatenation.
Keep the elements in their original order, including repetitions.
-}

concatLists :: [Char] -> [Char] -> [Char]
concatLists = undefined -- Your answer here

main :: IO ()
main = do
  print (concatLists "" "")  -- expected: ""
  print (concatLists "a" "")  -- expected: "a"
  print (concatLists "" "b")  -- expected: "b"
  print (concatLists "abc" "def")  -- expected: "abcdef"
  print (concatLists "aa" "b")  -- expected: "aab"
