-- Title: Overwrite a scratch fixture then append a transformed report
{-
QUESTION
Write process :: String -> String and runProgram :: IO (). First
write the exact fixture "a b\n\nc\n" to Scratch_F6FilePipelineV1Input.txt.
Read it, transform it by normalising words and adding a newline.
Overwrite Scratch_F6FilePipelineV1Output.txt with that result and append
"done\n". Read the output and print its String representation,
line count, word count, null test, and whether it ends with a newline.
All files are in the current directory. Delete nothing. Re-running must
give the same result because writeFile overwrites before appendFile.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdout: "a b c\ndone\n"
-- stdout: 2
-- stdout: 4
-- stdout: False
-- stdout: True

-- Read the question: Write the declared IO actions and pure functions.
-- Plan: Create the fixture, read a separate input path, overwrite the output, then append.
process :: String -> String
process text = unwords (words text) ++ "\n"

runProgram :: IO ()
runProgram = do
  writeFile "Scratch_F6FilePipelineV1Input.txt" "a b\n\nc\n"
  text <- readFile "Scratch_F6FilePipelineV1Input.txt"
  writeFile "Scratch_F6FilePipelineV1Output.txt" (process text)
  appendFile "Scratch_F6FilePipelineV1Output.txt" "done\n"
  result <- readFile "Scratch_F6FilePipelineV1Output.txt"
  print result
  print (length (lines result))
  print (length (words result))
  print (null result)
  print (not (null result) && last result == '\n')

main :: IO ()
main = runProgram
