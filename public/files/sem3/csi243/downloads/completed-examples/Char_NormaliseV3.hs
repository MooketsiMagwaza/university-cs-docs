-- Title: Normalise characters across text values
{-
QUESTION
Write normalise :: [String] -> [String] to uppercase every character in each String of a list, preserving empty Strings.
Explain why map toUpper has type String -> String, while transforming
[String] needs an outer map. Do not read keyboard input. (6 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- normalise :: [String] -> [String]
-- Plan: Follow the input's nesting level when applying character functions.
import Data.Char (toUpper, toLower, isAlpha, isAlphaNum)

normalise :: [String] -> [String]
-- Choose one map for characters, and an extra map for a list of Strings.
normalise = map (map toUpper)

-- String = [Char], so map toUpper :: [Char] -> [Char].
-- For [String] = [[Char]], map (map toUpper) traverses both list levels.

main :: IO ()
main = do
  print (normalise [])  -- expected: []
  print (normalise [""])  -- expected: [""]
  print (normalise ["aB","c"])  -- expected: ["AB","C"]
  print (normalise ["x 1","!"])  -- expected: ["X 1","!"]
  print (normalise ["a","","b"])  -- expected: ["A","","B"]
