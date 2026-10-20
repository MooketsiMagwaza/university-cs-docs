-- Title: Join lines with a newline after every element
{-
QUESTION
Write joinLines :: [String] -> String using unlines. Every element,
including an empty string, contributes a terminating newline. Use print
in the tests so embedded newlines appear as escapes on one output line.
-}

-- Read the question: Write joinLines :: [String] -> String; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
joinLines :: [String] -> String
-- Key step: the library operation also handles empty input.
joinLines = unlines

main :: IO ()
main = do
  print (joinLines [])  -- expected: ""
  print (joinLines [""])  -- expected: "\n"
  print (joinLines ["a"])  -- expected: "a\n"
  print (joinLines ["a","","b"])  -- expected: "a\n\nb\n"
  print (joinLines ["",""])  -- expected: "\n\n"
