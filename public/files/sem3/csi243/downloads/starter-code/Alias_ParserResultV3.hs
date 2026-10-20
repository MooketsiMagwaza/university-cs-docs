-- Title: Read parser results and preserve unconsumed input
{-
QUESTION
Given type Parser a = String -> [(a,String)], write parseValue :: Parser String to
consume one character and return two alternatives: its singleton
String, then its doubled String, both with the same remaining input.
Expand Parser at this result type. Distinguish [] (failure) from a
successful result whose remaining input is empty. (7 marks)
-}

type Parser a = String -> [(a,String)]

parseValue :: Parser String
parseValue = undefined -- Your answer here

main :: IO ()
main = do
  print (parseValue "")  -- expected: []
  print (parseValue "a")  -- expected: [("a",""),("aa","")]
  print (parseValue "ab")  -- expected: [("a","b"),("aa","b")]
  print (parseValue "7x")  -- expected: [("7","x"),("77","x")]
  print (parseValue " xy")  -- expected: [(" ","xy"),("  ","xy")]
