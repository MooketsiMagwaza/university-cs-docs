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

process :: String -> String
process = undefined -- Your answer here

runProgram :: IO ()
runProgram = undefined -- Your answer here

main :: IO ()
main = runProgram
