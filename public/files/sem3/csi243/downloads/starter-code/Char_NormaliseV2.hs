-- Title: Normalise characters across text values
{-
QUESTION
Write normalise :: String -> String to retain only letters and digits, then lowercase one String.
Explain why map toUpper has type String -> String, while transforming
[String] needs an outer map. Do not read keyboard input. (6 marks)
-}

import Data.Char (toUpper, toLower, isAlpha, isAlphaNum)

normalise :: String -> String
normalise = undefined -- Your answer here

main :: IO ()
main = do
  print (normalise "")  -- expected: ""
  print (normalise "A B!")  -- expected: "ab"
  print (normalise "CSi243")  -- expected: "csi243"
  print (normalise "7-9")  -- expected: "79"
  print (normalise "!?")  -- expected: ""
