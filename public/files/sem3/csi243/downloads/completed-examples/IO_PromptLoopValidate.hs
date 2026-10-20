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

import Text.Read (readMaybe)

-- Read the question: Write the declared IO actions and pure functions.
-- Plan: Sequence the actions in order; keep the final action of type IO ().
runProgram :: IO ()
runProgram = do
  putStrLn "Enter a nonnegative integer:"
  text <- getLine
  -- Invalid text and out-of-range numbers take the same recursive branch.
  case readMaybe text :: Maybe Int of
    Just n | n >= 0 -> putStrLn ("Accepted: " ++ show n)
    _ -> putStrLn "Invalid" >> runProgram

main :: IO ()
main = runProgram
