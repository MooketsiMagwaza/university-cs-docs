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
      if text == "."
        then print total
        else do
          let count = length (words text)
          print count
          loop (total + count)

main :: IO ()
main = runProgram
