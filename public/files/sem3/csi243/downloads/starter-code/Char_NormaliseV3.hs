-- Title: Normalise characters across text values
{-
QUESTION
Write normalise :: [String] -> [String] to uppercase every character in each String of a list, preserving empty Strings.
Explain why map toUpper has type String -> String, while transforming
[String] needs an outer map. Do not read keyboard input. (6 marks)
-}

import Data.Char (toUpper, toLower, isAlpha, isAlphaNum)

normalise :: [String] -> [String]
normalise = undefined -- Your answer here

main :: IO ()
main = do
  print (normalise [])  -- expected: []
  print (normalise [""])  -- expected: [""]
  print (normalise ["aB","c"])  -- expected: ["AB","C"]
  print (normalise ["x 1","!"])  -- expected: ["X 1","!"]
  print (normalise ["a","","b"])  -- expected: ["A","","B"]
