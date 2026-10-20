-- Title: Inspect escape sequences as character codes
{-
QUESTION
Write escapeCodes :: String -> [Int] using ord. For each test, state how
many actual characters the escaped literal contains. The escape sequences
for newline, tab, backslash and quotation mark each represent one Char.
Print the code list so every test prints exactly one line. (5 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- escapeCodes :: String -> [Int]
-- Plan: Use numeric output to observe characters without extra output lines.
import Data.Char (ord)

escapeCodes :: String -> [Int]
-- An escape is decoded by the literal before ord sees the character.
escapeCodes = map ord

main :: IO ()
main = do
  print (escapeCodes "")  -- expected: []
  print (escapeCodes "\n")  -- expected: [10]
  print (escapeCodes "\t")  -- expected: [9]
  print (escapeCodes "\\")  -- expected: [92]
  print (escapeCodes "\"")  -- expected: [34]
  print (escapeCodes "a\nb\tc")  -- expected: [97,10,98,9,99]
