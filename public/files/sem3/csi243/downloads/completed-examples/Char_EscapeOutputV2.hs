-- Title: Replace control characters with visible punctuation
{-
QUESTION
Write visible :: String -> String. Replace newline by '|', tab by '>',
backslash by '/', and double quote by a single quote. Leave every other
character unchanged. Use print in the test program to display the resulting
String, including its surrounding quotes. (6 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- visible :: String -> String
-- Plan: Map a local character replacement over the String.
visible :: String -> String
-- Each replacement is one character, so output length is preserved.
visible = map replace
  where
    replace '\n' = '|'
    replace '\t' = '>'
    replace '\\' = '/'
    replace '"' = '\''
    replace c = c

main :: IO ()
main = do
  print (visible "")  -- expected: ""
  print (visible "\n\t")  -- expected: "|>"
  print (visible "a\\b")  -- expected: "a/b"
  print (visible "\"yes\"")  -- expected: "'yes'"
  print (visible "A\nB\tC")  -- expected: "A|B>C"
