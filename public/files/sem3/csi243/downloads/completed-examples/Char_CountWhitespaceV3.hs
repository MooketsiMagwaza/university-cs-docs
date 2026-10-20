-- Title: Count spaces or whitespace at the correct list level
{-
QUESTION
Write countWhite :: [String] -> [Int] to count whitespace separately in each String, preserving list order.
Explain the difference between the Char ' ' and the empty String "".
Every test must print one output line, even if its input contains escapes. (5 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- countWhite :: [String] -> [Int]
-- Plan: Select matching characters, then count them; map for a list of Strings.
import Data.Char (isSpace)

countWhite :: [String] -> [Int]
-- Count after selecting exactly the requested whitespace category.
countWhite = map (length . filter isSpace)

-- A space is one Char; "" is a list with no characters.
-- isSpace also recognises tabs and newlines, unlike (== ' ').

main :: IO ()
main = do
  print (countWhite [])  -- expected: []
  print (countWhite [""])  -- expected: [0]
  print (countWhite ["a b","\t\n"])  -- expected: [1,2]
  print (countWhite [" ","x",""])  -- expected: [1,0,0]
  print (countWhite ["a\tb","c\nd","  "])  -- expected: [1,1,2]
