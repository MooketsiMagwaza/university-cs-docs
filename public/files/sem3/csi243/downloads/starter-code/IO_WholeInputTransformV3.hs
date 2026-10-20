-- Title: Report the length of every line using a pure core
{-
QUESTION
Write transform :: String -> String and runProgram :: IO (). Read all
input with getContents and print, using putStr, transform applied to it.
transform maps each input line to the decimal representation of its
length and joins results with unlines. Input ends with newline then EOF.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdin: 
-- stdin: ab
-- stdin: c
-- stdin: wxyz
-- stdin: end
-- stdout: 0
-- stdout: 2
-- stdout: 1
-- stdout: 4
-- stdout: 3

transform :: String -> String
transform = undefined -- Your answer here

runProgram :: IO ()
runProgram = undefined -- Your answer here

main :: IO ()
main = runProgram
