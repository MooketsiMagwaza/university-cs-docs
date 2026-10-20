-- Title: Read parser results and preserve unconsumed input
{-
QUESTION
Given type Parser a = String -> [(a,String)], write parseValue :: Parser Bool to
consume T as True or F as False; fail on any other first character.
Expand Parser at this result type. Distinguish [] (failure) from a
successful result whose remaining input is empty. (7 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- parseValue :: Parser Bool
-- Plan: Pattern-match the input; return a list of value/suffix pairs.
type Parser a = String -> [(a,String)]

parseValue :: Parser Bool
-- A successful parse pairs its value with the unconsumed suffix.
parseValue [] = []
parseValue (c:cs)
  | c == 'T' = [(True,cs)]
  | c == 'F' = [(False,cs)]
  | otherwise = []

-- Parser Bool = String -> [(Bool,String)].
-- [] means no alternatives; [(value,"")] means success with no input left.

main :: IO ()
main = do
  print (parseValue "")  -- expected: []
  print (parseValue "T")  -- expected: [(True,"")]
  print (parseValue "Fx")  -- expected: [(False,"x")]
  print (parseValue "t")  -- expected: []
  print (parseValue "TF")  -- expected: [(True,"F")]
