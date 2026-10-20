-- Title: Count spaces or whitespace at the correct list level
{-
QUESTION
Write countWhite :: [String] -> [Int] to count whitespace separately in each String, preserving list order.
Explain the difference between the Char ' ' and the empty String "".
Every test must print one output line, even if its input contains escapes. (5 marks)
-}

import Data.Char (isSpace)

countWhite :: [String] -> [Int]
countWhite = undefined -- Your answer here

main :: IO ()
main = do
  print (countWhite [])  -- expected: []
  print (countWhite [""])  -- expected: [0]
  print (countWhite ["a b","\t\n"])  -- expected: [1,2]
  print (countWhite [" ","x",""])  -- expected: [1,0,0]
  print (countWhite ["a\tb","c\nd","  "])  -- expected: [1,1,2]
