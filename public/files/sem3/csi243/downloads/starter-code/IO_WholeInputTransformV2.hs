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

transform :: String -> String
transform = undefined -- Your answer here

runProgram :: IO ()
runProgram = undefined -- Your answer here

main :: IO ()
main = runProgram
