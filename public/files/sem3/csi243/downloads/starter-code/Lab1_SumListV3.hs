-- Title: Join a sequence of strings recursively
{-
QUESTION
Provide a recursive definition, including a base case and recursive step,
for joinWords :: [String] -> String.
Concatenate all strings without adding separators. Empty input gives "".
-}

joinWords :: [String] -> String
joinWords = undefined -- Your answer here

main :: IO ()
main = do
  print (joinWords [])  -- expected: ""
  print (joinWords ["hi"])  -- expected: "hi"
  print (joinWords ["a","b","c"])  -- expected: "abc"
  print (joinWords ["","x"])  -- expected: "x"
  print (joinWords ["ab","cd","e"])  -- expected: "abcde"
