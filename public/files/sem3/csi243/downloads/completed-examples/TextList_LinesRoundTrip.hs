-- Title: Split lines while retaining interior empty lines
{-
QUESTION
Write splitLines :: String -> [String] using lines. An empty input has
no lines; a final newline terminates the last line and does not add a
further empty line. Interior empty lines must remain.
-}

-- Read the question: Write splitLines :: String -> [String]; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
splitLines :: String -> [String]
-- Key step: the library operation also handles empty input.
splitLines = lines

main :: IO ()
main = do
  print (splitLines "")  -- expected: []
  print (splitLines "a")  -- expected: ["a"]
  print (splitLines "a\n")  -- expected: ["a"]
  print (splitLines "a\n\nb\n")  -- expected: ["a","","b"]
  print (splitLines "\n")  -- expected: [""]
