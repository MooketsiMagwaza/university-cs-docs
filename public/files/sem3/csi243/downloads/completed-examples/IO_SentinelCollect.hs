-- Title: Sum valid integers until a stop sentinel
{-
QUESTION
Write runProgram :: IO (). Print Start, then read lines until the
exact line stop. Other lines contain valid Int values; add them with a
recursive accumulator and print Added after each. At the sentinel print
the total, then Done. Do not parse the sentinel as a number.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdin: 3
-- stdin: -1
-- stdin: 0
-- stdin: stop
-- stdout: Start
-- stdout: Added
-- stdout: Added
-- stdout: Added
-- stdout: 2
-- stdout: Done

-- Read the question: Write the declared IO actions and pure functions.
-- Plan: Sequence the actions in order; keep the final action of type IO ().
runProgram :: IO ()
runProgram = do
  putStrLn "Start"
  loop 0
  putStrLn "Done"
  where
    loop :: Int -> IO ()
    loop total = do
      text <- getLine
      if text == "stop"
        then print total
        else do
          let n = read text :: Int
          putStrLn "Added"
          loop (total + n)

main :: IO ()
main = runProgram
