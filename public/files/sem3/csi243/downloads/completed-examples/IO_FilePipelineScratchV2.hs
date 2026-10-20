-- Title: Reverse scratch-file lines before appending a marker
{-
QUESTION
Write process :: String -> String and runProgram :: IO (). First
write the exact fixture "ab\n\nc\n" to Scratch_F6FilePipelineV2Input.txt.
Read it, transform it by reversing each line with unlines.
Overwrite Scratch_F6FilePipelineV2Output.txt with that result and append
"END\n". Read the output and print its String representation,
line count, word count, null test, and whether it ends with a newline.
All files are in the current directory. Delete nothing. Re-running must
give the same result because writeFile overwrites before appendFile.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdout: "ba\n\nc\nEND\n"
-- stdout: 4
-- stdout: 3
-- stdout: False
-- stdout: True

-- Read the question: Write the declared IO actions and pure functions.
-- Plan: Create the fixture, read a separate input path, overwrite the output, then append.
process :: String -> String
process text = unlines (map reverse (lines text))

runProgram :: IO ()
runProgram = do
  writeFile "Scratch_F6FilePipelineV2Input.txt" "ab\n\nc\n"
  text <- readFile "Scratch_F6FilePipelineV2Input.txt"
  writeFile "Scratch_F6FilePipelineV2Output.txt" (process text)
  appendFile "Scratch_F6FilePipelineV2Output.txt" "END\n"
  result <- readFile "Scratch_F6FilePipelineV2Output.txt"
  print result
  print (length (lines result))
  print (length (words result))
  print (null result)
  print (not (null result) && last result == '\n')

main :: IO ()
main = runProgram
