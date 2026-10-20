-- Title: Construct strings containing escapes from integer codes
{-
QUESTION
Write escaped :: [Int] -> String. Convert each code with chr only when it
is one of 9, 10, 34 or 92; discard other codes. These codes denote tab,
newline, double quote and backslash. Preserve order and print the String
with print so control characters appear escaped on one output line. (5 marks)
-}

import Data.Char (chr)

escaped :: [Int] -> String
escaped = undefined -- Your answer here

main :: IO ()
main = do
  print (escaped [])  -- expected: ""
  print (escaped [9,10])  -- expected: "\t\n"
  print (escaped [34])  -- expected: "\""
  print (escaped [92])  -- expected: "\\"
  print (escaped [65,10,-1,9])  -- expected: "\n\t"
