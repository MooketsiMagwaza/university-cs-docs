-- Title: Write scratch-file line lengths and append a zero
{-
QUESTION
Write process :: String -> String and runProgram :: IO (). First
write the exact fixture "ab\n\nx\n" to Scratch_F6FilePipelineV3Input.txt.
Read it, transform it by mapping each line to its length with unlines.
Overwrite Scratch_F6FilePipelineV3Output.txt with that result and append
"0\n". Read the output and print its String representation,
line count, word count, null test, and whether it ends with a newline.
All files are in the current directory. Delete nothing. Re-running must
give the same result because writeFile overwrites before appendFile.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdout: "2\n0\n1\n0\n"
-- stdout: 4
-- stdout: 4
-- stdout: False
-- stdout: True

-- Read the question: Write the declared IO actions and pure functions.
-- Plan: Create the fixture, read a separate input path, overwrite the output, then append.
process :: String -> String
process text = unlines (map (show . length) (lines text))

runProgram :: IO ()
runProgram = do
  writeFile "Scratch_F6FilePipelineV3Input.txt" "ab\n\nx\n"
  text <- readFile "Scratch_F6FilePipelineV3Input.txt"
  writeFile "Scratch_F6FilePipelineV3Output.txt" (process text)
  appendFile "Scratch_F6FilePipelineV3Output.txt" "0\n"
  result <- readFile "Scratch_F6FilePipelineV3Output.txt"
  print result
  print (length (lines result))
  print (length (words result))
  print (null result)
  print (not (null result) && last result == '\n')

main :: IO ()
main = runProgram
