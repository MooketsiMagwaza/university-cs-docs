-- Title: Remove spaces with a string comprehension
{-
QUESTION
Write compact :: String -> String using a comprehension. [3]
Remove literal space characters only, retaining all other characters.
-}

-- Read the question: Write compact :: String -> String.
-- Plan: Generate characters and reject spaces.
compact :: String -> String
compact text = [c | c <- text, c /= ' ']  -- A String is a list of Char.

main :: IO ()
main = do
  print (compact "")  -- expected: ""
  print (compact " ")  -- expected: ""
  print (compact "a b")  -- expected: "ab"
  print (compact " a  b ")  -- expected: "ab"
  print (compact "Exam!")  -- expected: "Exam!"
