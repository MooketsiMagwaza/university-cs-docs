-- Title: Count spaces or whitespace at the correct list level
{-
QUESTION
Write countWhite :: String -> Int to count literal spaces only; tabs and newlines do not count.
Explain the difference between the Char ' ' and the empty String "".
Every test must print one output line, even if its input contains escapes. (5 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- countWhite :: String -> Int
-- Plan: Select matching characters, then count them; map for a list of Strings.
import Data.Char (isSpace)

countWhite :: String -> Int
-- Count after selecting exactly the requested whitespace category.
countWhite = length . filter (== ' ')

-- A space is one Char; "" is a list with no characters.
-- isSpace also recognises tabs and newlines, unlike (== ' ').

main :: IO ()
main = do
  print (countWhite "")  -- expected: 0
  print (countWhite " ")  -- expected: 1
  print (countWhite "a b c")  -- expected: 2
  print (countWhite "\t\n")  -- expected: 0
  print (countWhite " \t x\n ")  -- expected: 3
