-- Title: Concatenate two lists of Char values
{-
QUESTION
Specify and implement concatLists recursively, without using (++).
It takes two lists of Char values and returns their concatenation.
Keep the elements in their original order, including repetitions.
-}

-- Read the question: Write concatLists :: [Char] -> [Char] -> [Char].
-- Plan: Copy each head of the first list, then return the second list at the base.
-- Dry run: concatLists "ab" "c" = 'a' : ('b' : "c") = "abc".
concatLists :: [Char] -> [Char] -> [Char]
concatLists xs ys
  | null xs = ys -- Base: nothing remains in the first list.
  | otherwise = head xs : concatLists (tail xs) ys

main :: IO ()
main = do
  print (concatLists "" "")  -- expected: ""
  print (concatLists "a" "")  -- expected: "a"
  print (concatLists "" "b")  -- expected: "b"
  print (concatLists "abc" "def")  -- expected: "abcdef"
  print (concatLists "aa" "b")  -- expected: "aab"
