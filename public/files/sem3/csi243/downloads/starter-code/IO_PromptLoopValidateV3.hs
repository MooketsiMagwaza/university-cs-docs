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

runProgram :: IO ()
runProgram = undefined -- Your answer here

main :: IO ()
main = runProgram
