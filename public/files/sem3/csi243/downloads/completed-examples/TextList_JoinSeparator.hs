-- Title: Insert a character separator between characters
{-
QUESTION
Write punctuate :: Char -> String -> String using intersperse.
Do not put a separator before the first or after the last character.
-}

import Data.List (intersperse)

-- Read the question: Write punctuate :: Char -> String -> String; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
punctuate :: Char -> String -> String
-- Key step: the library operation also handles empty input.
punctuate = intersperse

main :: IO ()
main = do
  print (punctuate '-' "")  -- expected: ""
  print (punctuate '-' "a")  -- expected: "a"
  print (punctuate '-' "abc")  -- expected: "a-b-c"
  print (punctuate ':' "xy")  -- expected: "x:y"
  print (punctuate ' ' "ab")  -- expected: "a b"
