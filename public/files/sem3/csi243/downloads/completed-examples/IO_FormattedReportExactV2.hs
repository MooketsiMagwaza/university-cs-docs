-- Title: Format an exact mass report to two decimal places
{-
QUESTION
Write runProgram :: IO (). Use printf from Text.Printf to print
five newline-terminated lines: Report; Mass: followed by one space
and the Double 1.25 with %.2f; Count: 3 using %d and an Int; Name: Ada
using %s; and Done. Formatting fixes displayed decimal places, rather
than changing the numeric value. Do not read standard input.
The stdin and stdout comments below give the complete fixed transcript.
-}

-- stdout: Report
-- stdout: Mass: 1.25
-- stdout: Count: 3
-- stdout: Name: Ada
-- stdout: Done

import Text.Printf (printf)

-- Read the question: Write the declared IO actions and pure functions.
-- Plan: Sequence the actions in order; keep the final action of type IO ().
runProgram :: IO ()
runProgram = do
  printf "Report\n"
  printf "Mass: %.2f\n" (1.25 :: Double)
  printf "Count: %d\n" (3 :: Int)
  printf "Name: %s\n" ("Ada" :: String)
  printf "Done\n"

main :: IO ()
main = runProgram
