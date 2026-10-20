-- Title: Normalise characters across text values
{-
QUESTION
Write normalise :: [String] -> [String] to retain only letters and lowercase each String of a list, preserving empty results.
Explain why map toUpper has type String -> String, while transforming
[String] needs an outer map. Do not read keyboard input. (6 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- normalise :: [String] -> [String]
-- Plan: Follow the input's nesting level when applying character functions.
import Data.Char (toUpper, toLower, isAlpha, isAlphaNum)

normalise :: [String] -> [String]
-- Choose one map for characters, and an extra map for a list of Strings.
normalise = map (map toLower . filter isAlpha)

-- String = [Char], so map toUpper :: [Char] -> [Char].
-- For [String] = [[Char]], map (map toUpper) traverses both list levels.

main :: IO ()
main = do
  print (normalise [])  -- expected: []
  print (normalise [""])  -- expected: [""]
  print (normalise ["A1","B!"])  -- expected: ["a","b"]
  print (normalise ["123","Hi There"])  -- expected: ["","hithere"]
  print (normalise ["X","","Y"])  -- expected: ["x","","y"]
