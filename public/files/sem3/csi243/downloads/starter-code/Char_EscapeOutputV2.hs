-- Title: Replace control characters with visible punctuation
{-
QUESTION
Write visible :: String -> String. Replace newline by '|', tab by '>',
backslash by '/', and double quote by a single quote. Leave every other
character unchanged. Use print in the test program to display the resulting
String, including its surrounding quotes. (6 marks)
-}

visible :: String -> String
visible = undefined -- Your answer here

main :: IO ()
main = do
  print (visible "")  -- expected: ""
  print (visible "\n\t")  -- expected: "|>"
  print (visible "a\\b")  -- expected: "a/b"
  print (visible "\"yes\"")  -- expected: "'yes'"
  print (visible "A\nB\tC")  -- expected: "A|B>C"
