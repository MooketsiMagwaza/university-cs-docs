-- Title: Decode only ASCII code points
{-
QUESTION
Write asciiText :: [Int] -> String using chr. Keep only codes in the
inclusive range 0 to 127, preserving order. Do not call chr on discarded
values. ASCII is a subset of Unicode. (5 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- asciiText :: [Int] -> String
-- Plan: Check the ASCII bounds before constructing each character.
import Data.Char (chr)

asciiText :: [Int] -> String
-- Filter before chr, so every conversion is within its domain.
asciiText ns = [chr n | n <- ns, n >= 0, n <= 127]

main :: IO ()
main = do
  print (asciiText [])  -- expected: ""
  print (asciiText [65,66])  -- expected: "AB"
  print (asciiText [0])  -- expected: "\NUL"
  print (asciiText [127])  -- expected: "\DEL"
  print (asciiText [-1,65,128,1114112])  -- expected: "A"
  print (asciiText [10,9])  -- expected: "\n\t"
