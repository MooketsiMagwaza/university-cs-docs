-- Title: Consume a newline character before reading a line
{-
QUESTION
Write runProgram :: IO (). Read a character with getChar and a line
with getLine. Print the character, line, line length, whether the line
is empty, and its first character as a string using take 1. The first
input line is empty, so getChar reads its newline.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdin: 
-- stdin: xyz
-- stdout: '\n'
-- stdout: "xyz"
-- stdout: 3
-- stdout: False
-- stdout: "x"

-- Read the question: Write the declared IO actions and pure functions.
-- Plan: Sequence the actions in order; keep the final action of type IO ().
runProgram :: IO ()
runProgram = do
  c <- getChar
  text <- getLine
  print c
  print text
  print (length text)
  print (null text)
  print (take 1 text)

main :: IO ()
main = runProgram
