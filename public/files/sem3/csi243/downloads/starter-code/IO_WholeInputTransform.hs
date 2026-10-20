-- Title: Count complete input and report normalised words
{-
QUESTION
Write analyse :: String -> [String] and runProgram :: IO (). analyse
returns five strings: the number of lines, words, characters, normalised
words (unwords . words), and END. runProgram reads getContents to EOF
and prints those strings with mapM_ putStrLn. Every supplied input line
is newline terminated, including the empty line.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdin: a b
-- stdin: 
-- stdin: c
-- stdout: 3
-- stdout: 3
-- stdout: 7
-- stdout: a b c
-- stdout: END

analyse :: String -> [String]
analyse = undefined -- Your answer here

runProgram :: IO ()
runProgram = undefined -- Your answer here

main :: IO ()
main = runProgram
