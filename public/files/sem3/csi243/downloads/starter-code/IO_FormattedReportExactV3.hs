-- Title: Format an exact balance report to two decimal places
{-
QUESTION
Write runProgram :: IO (). Use printf from Text.Printf to print
five newline-terminated lines: Report; Balance: followed by one space
and the Double 0.0 with %.2f; Count: 3 using %d and an Int; Name: Ada
using %s; and Done. Formatting fixes displayed decimal places, rather
than changing the numeric value. Do not read standard input.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdout: Report
-- stdout: Balance: 0.00
-- stdout: Count: 3
-- stdout: Name: Ada
-- stdout: Done


runProgram :: IO ()
runProgram = undefined -- Your answer here

main :: IO ()
main = runProgram
