-- Title: Join word tokens without preserving empty token boundaries
{-
QUESTION
Write joinWords :: [String] -> String using unwords. Insert exactly one
space between adjacent tokens, including empty tokens. Contrast this with
unwords . words, which normalises whitespace.
-}

joinWords :: [String] -> String
joinWords = undefined -- Your answer here

main :: IO ()
main = do
  print (joinWords [])  -- expected: ""
  print (joinWords ["a"])  -- expected: "a"
  print (joinWords ["a","b"])  -- expected: "a b"
  print (joinWords ["","a",""])  -- expected: " a "
  print (joinWords ["",""])  -- expected: " "
