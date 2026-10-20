-- Title: Join word tokens without preserving empty token boundaries
{-
QUESTION
Write joinWords :: [String] -> String using unwords. Insert exactly one
space between adjacent tokens, including empty tokens. Contrast this with
unwords . words, which normalises whitespace.
-}

-- Read the question: Write joinWords :: [String] -> String; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
joinWords :: [String] -> String
-- Key step: the library operation also handles empty input.
joinWords = unwords

main :: IO ()
main = do
  print (joinWords [])  -- expected: ""
  print (joinWords ["a"])  -- expected: "a"
  print (joinWords ["a","b"])  -- expected: "a b"
  print (joinWords ["","a",""])  -- expected: " a "
  print (joinWords ["",""])  -- expected: " "
