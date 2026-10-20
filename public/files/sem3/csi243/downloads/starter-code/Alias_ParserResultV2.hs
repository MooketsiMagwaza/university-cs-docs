-- Title: Read parser results and preserve unconsumed input
{-
QUESTION
Given type Parser a = String -> [(a,String)], write parseValue :: Parser Int to
consume one ASCII decimal digit as Int, or fail without a result.
Expand Parser at this result type. Distinguish [] (failure) from a
successful result whose remaining input is empty. (7 marks)
-}

import Data.Char (isDigit, digitToInt)

type Parser a = String -> [(a,String)]

parseValue :: Parser Int
parseValue = undefined -- Your answer here

main :: IO ()
main = do
  print (parseValue "")  -- expected: []
  print (parseValue "0")  -- expected: [(0,"")]
  print (parseValue "7x")  -- expected: [(7,"x")]
  print (parseValue "a7")  -- expected: []
  print (parseValue "99")  -- expected: [(9,"9")]
