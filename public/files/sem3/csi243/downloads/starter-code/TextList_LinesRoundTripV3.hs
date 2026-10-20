-- Title: Normalise the final newline of nonempty text
{-
QUESTION
Write terminateLines :: String -> String using unlines . lines.
Explain which inputs are unchanged and why text without a final newline
can change. Preserve interior blank lines.
-}

terminateLines :: String -> String
terminateLines = undefined -- Your answer here

main :: IO ()
main = do
  print (terminateLines "")  -- expected: ""
  print (terminateLines "a")  -- expected: "a\n"
  print (terminateLines "a\n")  -- expected: "a\n"
  print (terminateLines "a\n\nb")  -- expected: "a\n\nb\n"
  print (terminateLines "\n\n")  -- expected: "\n\n"
