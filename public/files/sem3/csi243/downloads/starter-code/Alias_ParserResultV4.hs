-- Title: Read parser results and preserve unconsumed input
{-
QUESTION
Given type Parser a = String -> [(a,String)], write parseValue :: Parser Bool to
consume T as True or F as False; fail on any other first character.
Expand Parser at this result type. Distinguish [] (failure) from a
successful result whose remaining input is empty. (7 marks)
-}

type Parser a = String -> [(a,String)]

parseValue :: Parser Bool
parseValue = undefined -- Your answer here

main :: IO ()
main = do
  print (parseValue "")  -- expected: []
  print (parseValue "T")  -- expected: [(True,"")]
  print (parseValue "Fx")  -- expected: [(False,"x")]
  print (parseValue "t")  -- expected: []
  print (parseValue "TF")  -- expected: [(True,"F")]
