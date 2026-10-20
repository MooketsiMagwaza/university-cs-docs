-- Title: Normalise characters across text values
{-
QUESTION
Write normalise :: [String] -> [String] to retain only letters and lowercase each String of a list, preserving empty results.
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
  print (normalise ["A1","B!"])  -- expected: ["a","b"]
  print (normalise ["123","Hi There"])  -- expected: ["","hithere"]
  print (normalise ["X","","Y"])  -- expected: ["x","","y"]
