-- Title: Convert a bounded integer to a hexadecimal digit
{-
QUESTION
Write digitText :: Int -> String. For an integer from 0 to 15 return a
singleton String containing intToDigit's lowercase digit. Outside that
range return the empty String. Do not call intToDigit out of range.
Distinguish the result String from the Char produced by intToDigit. (5 marks)
-}

import Data.Char (intToDigit)

digitText :: Int -> String
digitText = undefined -- Your answer here

main :: IO ()
main = do
  print (digitText (-1))  -- expected: ""
  print (digitText (0))  -- expected: "0"
  print (digitText (9))  -- expected: "9"
  print (digitText (10))  -- expected: "a"
  print (digitText (15))  -- expected: "f"
  print (digitText (16))  -- expected: ""
