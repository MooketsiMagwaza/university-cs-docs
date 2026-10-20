-- Title: Normalise the final newline of nonempty text
{-
QUESTION
Write terminateLines :: String -> String using unlines . lines.
Explain which inputs are unchanged and why text without a final newline
can change. Preserve interior blank lines.
-}

-- Read the question: Write terminateLines :: String -> String; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
terminateLines :: String -> String
-- Key step: the library operation also handles empty input.
terminateLines = unlines . lines

main :: IO ()
main = do
  print (terminateLines "")  -- expected: ""
  print (terminateLines "a")  -- expected: "a\n"
  print (terminateLines "a\n")  -- expected: "a\n"
  print (terminateLines "a\n\nb")  -- expected: "a\n\nb\n"
  print (terminateLines "\n\n")  -- expected: "\n\n"
