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

-- Read the question: Write the declared IO actions and pure functions.
-- Plan: Sequence the actions in order; keep the final action of type IO ().
analyse :: String -> [String]
analyse text = [show (length (lines text)), show (length (words text)),
                show (length text), unwords (words text), "END"]

runProgram :: IO ()
runProgram = do
  text <- getContents
  -- The finite input is demanded by the counts before output completes.
  mapM_ putStrLn (analyse text)

main :: IO ()
main = runProgram
