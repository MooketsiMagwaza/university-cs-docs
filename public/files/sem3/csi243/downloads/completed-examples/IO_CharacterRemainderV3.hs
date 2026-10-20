-- Title: Read an integer action followed by a text action
{-
QUESTION
Write runProgram :: IO (). Use readLn to read a valid Int, then getLine
to read text. Print the integer, its double, the text, its length, and
its first two characters as a string. readLn consumes its whole line.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdin: 0
-- stdin: 
-- stdout: 0
-- stdout: 0
-- stdout: ""
-- stdout: 0
-- stdout: ""

-- Read the question: Write the declared IO actions and pure functions.
-- Plan: Sequence the actions in order; keep the final action of type IO ().
runProgram :: IO ()
runProgram = do
  n <- readLn :: IO Int
  text <- getLine
  let doubled = 2 * n
  print n
  print doubled
  print text
  print (length text)
  print (take 2 text)

main :: IO ()
main = runProgram
