-- Title: Insert a character separator between characters
{-
QUESTION
Write punctuate :: Char -> String -> String using intersperse.
Do not put a separator before the first or after the last character.
-}

punctuate :: Char -> String -> String
punctuate = undefined -- Your answer here

main :: IO ()
main = do
  print (punctuate '-' "")  -- expected: ""
  print (punctuate '-' "a")  -- expected: "a"
  print (punctuate '-' "abc")  -- expected: "a-b-c"
  print (punctuate ':' "xy")  -- expected: "x:y"
  print (punctuate ' ' "ab")  -- expected: "a b"
