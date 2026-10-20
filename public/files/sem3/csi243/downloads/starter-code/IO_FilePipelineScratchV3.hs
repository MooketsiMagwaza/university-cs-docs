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

process :: String -> String
process = undefined -- Your answer here

runProgram :: IO ()
runProgram = undefined -- Your answer here

main :: IO ()
main = runProgram
