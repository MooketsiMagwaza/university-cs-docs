-- Title: Prompt until a yes or no token is entered
{-
QUESTION
Write runProgram :: IO (). Print Answer yes or no: and read a line.
Only the exact tokens yes and no are valid. Print Accepted: True for
yes or Accepted: False for no. Otherwise print Invalid and recurse.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdin: YES
-- stdin: 
-- stdin: no
-- stdout: Answer yes or no:
-- stdout: Invalid
-- stdout: Answer yes or no:
-- stdout: Invalid
-- stdout: Answer yes or no:
-- stdout: Accepted: False

-- Read the question: Write the declared IO actions and pure functions.
-- Plan: Sequence the actions in order; keep the final action of type IO ().
runProgram :: IO ()
runProgram = do
  putStrLn "Answer yes or no:"
  text <- getLine
  case text of
    "yes" -> putStrLn "Accepted: True"
    "no" -> putStrLn "Accepted: False"
    _ -> putStrLn "Invalid" >> runProgram

main :: IO ()
main = runProgram
