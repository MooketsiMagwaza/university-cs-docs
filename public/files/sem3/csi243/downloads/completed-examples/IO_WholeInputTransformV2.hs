-- Title: Transform every input line with interact
{-
QUESTION
Write transform :: String -> String and runProgram :: IO (). Use
interact transform. Reverse each line separately and use unlines to
join the results, preserving empty lines. The fixed input ends at EOF
after a newline; every input line produces exactly one output line.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdin: abc
-- stdin: 
-- stdin: de
-- stdin: x
-- stdin: end
-- stdout: cba
-- stdout: 
-- stdout: ed
-- stdout: x
-- stdout: dne

-- Read the question: Write the declared IO actions and pure functions.
-- Plan: Sequence the actions in order; keep the final action of type IO ().
transform :: String -> String
transform = unlines . map reverse . lines

runProgram :: IO ()
runProgram = interact transform

main :: IO ()
main = runProgram
