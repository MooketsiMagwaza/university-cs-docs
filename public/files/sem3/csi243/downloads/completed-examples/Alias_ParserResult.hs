-- Title: Read parser results and preserve unconsumed input
{-
QUESTION
Given type Parser a = String -> [(a,String)], write parseValue :: Parser Char to
consume one character, or fail on empty input.
Expand Parser at this result type. Distinguish [] (failure) from a
successful result whose remaining input is empty. (7 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- parseValue :: Parser Char
-- Plan: Pattern-match the input; return a list of value/suffix pairs.
type Parser a = String -> [(a,String)]

parseValue :: Parser Char
-- A successful parse pairs its value with the unconsumed suffix.
parseValue [] = []
parseValue (c:cs) = [(c,cs)]

-- Parser Char = String -> [(Char,String)].
-- [] means no alternatives; [(value,"")] means success with no input left.

main :: IO ()
main = do
  print (parseValue "")  -- expected: []
  print (parseValue "a")  -- expected: [('a',"")]
  print (parseValue "ab")  -- expected: [('a',"b")]
  print (parseValue "7x")  -- expected: [('7',"x")]
  print (parseValue " xy")  -- expected: [(' ',"xy")]
