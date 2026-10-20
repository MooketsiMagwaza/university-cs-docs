-- Title: Observe the remainder after getChar
{-
QUESTION
Write runProgram :: IO (). Read one character using getChar, then use
getLine twice. Print the character, the remainder of its line, the next
line, and the lengths of those two strings, in that order. Use putChar
for the character and terminate that output line; use print for the rest.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdin: Abee
-- stdin: tail
-- stdout: A
-- stdout: "bee"
-- stdout: "tail"
-- stdout: 3
-- stdout: 4

-- Read the question: Write the declared IO actions and pure functions.
-- Plan: Sequence the actions in order; keep the final action of type IO ().
runProgram :: IO ()
runProgram = do
  c <- getChar
  rest <- getLine
  next <- getLine
  -- getChar consumed one character, not the remainder or its newline.
  putChar c >> putStrLn ""
  print rest
  print next
  print (length rest)
  print (length next)

main :: IO ()
main = runProgram
