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


runProgram :: IO ()
runProgram = undefined -- Your answer here

main :: IO ()
main = runProgram
