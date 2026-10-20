-- Title: Remove spaces with a string comprehension
{-
QUESTION
Write compact :: String -> String using a comprehension. [3]
Remove literal space characters only, retaining all other characters.
-}

compact :: String -> String
compact = undefined  -- Your answer here

main :: IO ()
main = do
  print (compact "")  -- expected: ""
  print (compact " ")  -- expected: ""
  print (compact "a b")  -- expected: "ab"
  print (compact " a  b ")  -- expected: "ab"
  print (compact "Exam!")  -- expected: "Exam!"
