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

runProgram :: IO ()
runProgram = undefined -- Your answer here

main :: IO ()
main = runProgram
