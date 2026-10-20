-- Title: Execute a list of input actions with sequence
{-
QUESTION
Write runProgram :: IO (). Use sequence [getLine,getLine] to obtain
two strings. Execute mapM_ putStrLn on them, print the number of strings
and their total length, then print Done without quotes.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdin: alpha
-- stdin: 
-- stdout: alpha
-- stdout: 
-- stdout: 2
-- stdout: 5
-- stdout: Done

runProgram :: IO ()
runProgram = undefined -- Your answer here

main :: IO ()
main = runProgram
