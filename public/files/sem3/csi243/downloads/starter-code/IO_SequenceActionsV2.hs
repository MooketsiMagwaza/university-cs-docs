-- Title: Collect mapM results and execute sequence_ output
{-
QUESTION
Write runProgram :: IO (). Use mapM (const getLine) on [1,2,3] to read
three lines. Use sequence_ on their putStrLn actions. Execute pure (),
then print the sum of their lengths and Finished. pure () does not exit.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdin: a
-- stdin: bb
-- stdin: 
-- stdout: a
-- stdout: bb
-- stdout: 
-- stdout: 3
-- stdout: Finished

runProgram :: IO ()
runProgram = undefined -- Your answer here

main :: IO ()
main = runProgram
