-- Title: Normalise characters across text values
{-
QUESTION
Write normalise :: String -> String to uppercase each character of one String.
Explain why map toUpper has type String -> String, while transforming
[String] needs an outer map. Do not read keyboard input. (6 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- normalise :: String -> String
-- Plan: Follow the input's nesting level when applying character functions.
import Data.Char (toUpper, toLower, isAlpha, isAlphaNum)

normalise :: String -> String
-- Choose one map for characters, and an extra map for a list of Strings.
normalise = map toUpper

-- String = [Char], so map toUpper :: [Char] -> [Char].
-- For [String] = [[Char]], map (map toUpper) traverses both list levels.

main :: IO ()
main = do
  print (normalise "")  -- expected: ""
  print (normalise "aB")  -- expected: "AB"
  print (normalise "a 7!")  -- expected: "A 7!"
  print (normalise "x")  -- expected: "X"
  print (normalise "Already")  -- expected: "ALREADY"
