-- Title: Construct strings containing escapes from integer codes
{-
QUESTION
Write escaped :: [Int] -> String. Convert each code with chr only when it
is one of 9, 10, 34 or 92; discard other codes. These codes denote tab,
newline, double quote and backslash. Preserve order and print the String
with print so control characters appear escaped on one output line. (5 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- escaped :: [Int] -> String
-- Plan: Filter the four allowed codes before applying chr.
import Data.Char (chr)

escaped :: [Int] -> String
-- The membership guard guarantees a valid chr argument.
escaped ns = [chr n | n <- ns, n == 9 || n == 10 || n == 34 || n == 92]

main :: IO ()
main = do
  print (escaped [])  -- expected: ""
  print (escaped [9,10])  -- expected: "\t\n"
  print (escaped [34])  -- expected: "\""
  print (escaped [92])  -- expected: "\\"
  print (escaped [65,10,-1,9])  -- expected: "\n\t"
