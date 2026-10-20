-- Title: Count words until a dot sentinel
{-
QUESTION
Write runProgram :: IO (). Print Start and read lines until the exact
line containing a single dot with no spaces. For each other
line print its word count; at the sentinel print the accumulated word
count and Done. An empty line is data, not the sentinel.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdin: one two
-- stdin: 
-- stdin: three
-- stdin: .
-- stdout: Start
-- stdout: 2
-- stdout: 0
-- stdout: 1
-- stdout: 3
-- stdout: Done

runProgram :: IO ()
runProgram = undefined -- Your answer here

main :: IO ()
main = runProgram
