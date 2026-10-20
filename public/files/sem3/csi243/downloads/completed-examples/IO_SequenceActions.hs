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

-- Read the question: Write the declared IO actions and pure functions.
-- Plan: Sequence the actions in order; keep the final action of type IO ().
runProgram :: IO ()
runProgram = do
  texts <- sequence [getLine, getLine]
  -- A list of actions is executed by sequence; its result is a list.
  mapM_ putStrLn texts
  print (length texts)
  print (sum (map length texts))
  putStrLn "Done"

main :: IO ()
main = runProgram
