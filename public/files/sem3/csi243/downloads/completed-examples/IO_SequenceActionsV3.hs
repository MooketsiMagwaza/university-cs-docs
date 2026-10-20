-- Title: Report two independent parse outcomes using bind
{-
QUESTION
Write runProgram :: IO (). Read two lines using (>>=), parse each
independently with readMaybe :: String -> Maybe Int and print labelled
results using show. Print Checked, then use when to print Missing if
either parse failed and unless to print Both if both succeeded, then End.
Use (>>) to sequence the final outputs.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdin: 12
-- stdin: bad
-- stdout: first: Just 12
-- stdout: second: Nothing
-- stdout: Checked
-- stdout: Missing
-- stdout: End

import Text.Read (readMaybe)
import Control.Monad (when, unless)

-- Read the question: Write the declared IO actions and pure functions.
-- Plan: Sequence the actions in order; keep the final action of type IO ().
runProgram :: IO ()
runProgram = getLine >>= \first -> getLine >>= \second -> do
  let a = readMaybe first :: Maybe Int
      b = readMaybe second :: Maybe Int
  putStrLn ("first: " ++ show a)
  putStrLn ("second: " ++ show b)
  putStrLn "Checked"
  when (a == Nothing || b == Nothing) (putStrLn "Missing")
  unless (a == Nothing || b == Nothing) (putStrLn "Both")
  pure () >> putStrLn "End"

main :: IO ()
main = runProgram
