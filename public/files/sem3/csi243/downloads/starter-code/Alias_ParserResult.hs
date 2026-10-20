-- Title: Read parser results and preserve unconsumed input
{-
QUESTION
Given type Parser a = String -> [(a,String)], write parseValue :: Parser Char to
consume one character, or fail on empty input.
Expand Parser at this result type. Distinguish [] (failure) from a
successful result whose remaining input is empty. (7 marks)
-}

type Parser a = String -> [(a,String)]

parseValue :: Parser Char
parseValue = undefined -- Your answer here

main :: IO ()
main = do
  print (parseValue "")  -- expected: []
  print (parseValue "a")  -- expected: [('a',"")]
  print (parseValue "ab")  -- expected: [('a',"b")]
  print (parseValue "7x")  -- expected: [('7',"x")]
  print (parseValue " xy")  -- expected: [(' ',"xy")]
