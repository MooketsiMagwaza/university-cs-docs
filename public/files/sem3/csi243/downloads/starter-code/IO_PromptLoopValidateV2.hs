-- Title: Prompt until an integer mark is in range
{-
QUESTION
Write runProgram :: IO (). Print Enter a mark from 0 to 100: on its own line.
Parse the next line safely as an Int. Accept only values from 0 to 100 inclusive.
On failure print Invalid and repeat recursively. On success print
Accepted: followed by one space and the number; then stop.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdin: 101
-- stdin: -1
-- stdin: 50
-- stdout: Enter a mark from 0 to 100:
-- stdout: Invalid
-- stdout: Enter a mark from 0 to 100:
-- stdout: Invalid
-- stdout: Enter a mark from 0 to 100:
-- stdout: Accepted: 50


runProgram :: IO ()
runProgram = undefined -- Your answer here

main :: IO ()
main = runProgram
