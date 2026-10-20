-- Title: Read parser results and preserve unconsumed input
{-
QUESTION
Given type Parser a = String -> [(a,String)], write parseValue :: Parser String to
consume one character and return two alternatives: its singleton
String, then its doubled String, both with the same remaining input.
Expand Parser at this result type. Distinguish [] (failure) from a
successful result whose remaining input is empty. (7 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- parseValue :: Parser String
-- Plan: Pattern-match the input; return a list of value/suffix pairs.
type Parser a = String -> [(a,String)]

parseValue :: Parser String
-- A successful parse pairs its value with the unconsumed suffix.
parseValue [] = []
parseValue (c:cs) = [([c],cs),([c,c],cs)]

-- Parser String = String -> [(String,String)].
-- [] means no alternatives; [(value,"")] means success with no input left.

main :: IO ()
main = do
  print (parseValue "")  -- expected: []
  print (parseValue "a")  -- expected: [("a",""),("aa","")]
  print (parseValue "ab")  -- expected: [("a","b"),("aa","b")]
  print (parseValue "7x")  -- expected: [("7","x"),("77","x")]
  print (parseValue " xy")  -- expected: [(" ","xy"),("  ","xy")]
