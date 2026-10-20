-- Title: Split lines while retaining interior empty lines
{-
QUESTION
Write splitLines :: String -> [String] using lines. An empty input has
no lines; a final newline terminates the last line and does not add a
further empty line. Interior empty lines must remain.
-}

splitLines :: String -> [String]
splitLines = undefined -- Your answer here

main :: IO ()
main = do
  print (splitLines "")  -- expected: []
  print (splitLines "a")  -- expected: ["a"]
  print (splitLines "a\n")  -- expected: ["a"]
  print (splitLines "a\n\nb\n")  -- expected: ["a","","b"]
  print (splitLines "\n")  -- expected: [""]
