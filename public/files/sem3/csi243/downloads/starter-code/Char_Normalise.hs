-- Title: Normalise characters across text values
{-
QUESTION
Write normalise :: String -> String to uppercase each character of one String.
Explain why map toUpper has type String -> String, while transforming
[String] needs an outer map. Do not read keyboard input. (6 marks)
-}

import Data.Char (toUpper, toLower, isAlpha, isAlphaNum)

normalise :: String -> String
normalise = undefined -- Your answer here

main :: IO ()
main = do
  print (normalise "")  -- expected: ""
  print (normalise "aB")  -- expected: "AB"
  print (normalise "a 7!")  -- expected: "A 7!"
  print (normalise "x")  -- expected: "X"
  print (normalise "Already")  -- expected: "ALREADY"
