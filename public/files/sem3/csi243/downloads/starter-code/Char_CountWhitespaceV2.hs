-- Title: Count spaces or whitespace at the correct list level
{-
QUESTION
Write countWhite :: String -> Int to count every whitespace character using isSpace, including tabs and newlines.
Explain the difference between the Char ' ' and the empty String "".
Every test must print one output line, even if its input contains escapes. (5 marks)
-}

import Data.Char (isSpace)

countWhite :: String -> Int
countWhite = undefined -- Your answer here

main :: IO ()
main = do
  print (countWhite "")  -- expected: 0
  print (countWhite " ")  -- expected: 1
  print (countWhite "a b c")  -- expected: 2
  print (countWhite "\t\n")  -- expected: 2
  print (countWhite " \t x\n ")  -- expected: 5
