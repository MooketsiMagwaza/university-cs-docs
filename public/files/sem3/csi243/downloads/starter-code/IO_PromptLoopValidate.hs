-- Title: Prompt until a nonnegative integer is entered
{-
QUESTION
Write runProgram :: IO (). Print Enter a nonnegative integer: on its own line.
Parse the next line safely as an Int. Accept a nonnegative value.
On failure print Invalid and repeat recursively. On success print
Accepted: followed by one space and the number; then stop.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdin: bad
-- stdin: -2
-- stdin: 0
-- stdout: Enter a nonnegative integer:
-- stdout: Invalid
-- stdout: Enter a nonnegative integer:
-- stdout: Invalid
-- stdout: Enter a nonnegative integer:
-- stdout: Accepted: 0


runProgram :: IO ()
runProgram = undefined -- Your answer here

main :: IO ()
main = runProgram
