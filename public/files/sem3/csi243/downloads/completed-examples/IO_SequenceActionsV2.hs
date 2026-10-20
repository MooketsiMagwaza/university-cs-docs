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

-- Read the question: Write the declared IO actions and pure functions.
-- Plan: Sequence the actions in order; keep the final action of type IO ().
runProgram :: IO ()
runProgram = do
  texts <- mapM (const getLine) [1,2,3 :: Int]
  sequence_ (map putStrLn texts)
  pure ()
  -- Execution continues after pure ().
  print (sum (map length texts))
  putStrLn "Finished"

main :: IO ()
main = runProgram
