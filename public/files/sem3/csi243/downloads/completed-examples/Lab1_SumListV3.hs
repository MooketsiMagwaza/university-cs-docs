-- Title: Join a sequence of strings recursively
{-
QUESTION
Provide a recursive definition, including a base case and recursive step,
for joinWords :: [String] -> String.
Concatenate all strings without adding separators. Empty input gives "".
-}

-- Read the question: Write joinWords :: [String] -> String.
-- Plan: Combine the first term with the recursively combined remaining terms.
-- Dry run: joinWords ["a","b","c"] = "a" ++ ("b" ++ ("c" ++ "")) = "abc".
joinWords :: [String] -> String
joinWords [] = "" -- Base: no terms.
joinWords (x:xs) = x ++ joinWords xs

main :: IO ()
main = do
  print (joinWords [])  -- expected: ""
  print (joinWords ["hi"])  -- expected: "hi"
  print (joinWords ["a","b","c"])  -- expected: "abc"
  print (joinWords ["","x"])  -- expected: "x"
  print (joinWords ["ab","cd","e"])  -- expected: "abcde"
