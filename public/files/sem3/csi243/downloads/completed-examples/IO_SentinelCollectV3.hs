-- Title: Collect text in reverse order until END
{-
QUESTION
Write runProgram :: IO (). Print Start. Read lines until the exact
line END. Cons each data line onto an accumulator and print Stored.
On END, print the accumulated [String] in reverse input order and then
Done. Do not include END in the result.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdin: a
-- stdin: 
-- stdin: b
-- stdin: END
-- stdout: Start
-- stdout: Stored
-- stdout: Stored
-- stdout: Stored
-- stdout: ["b","","a"]
-- stdout: Done

-- Read the question: Write the declared IO actions and pure functions.
-- Plan: Sequence the actions in order; keep the final action of type IO ().
runProgram :: IO ()
runProgram = do
  putStrLn "Start"
  loop []
  putStrLn "Done"
  where
    loop :: [String] -> IO ()
    loop acc = do
      text <- getLine
      if text == "END"
        then print acc
        else putStrLn "Stored" >> loop (text : acc)

main :: IO ()
main = runProgram
