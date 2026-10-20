-- Title: Normalise characters across text values
{-
QUESTION
Write normalise :: String -> String to retain only letters and digits, then lowercase one String.
Explain why map toUpper has type String -> String, while transforming
[String] needs an outer map. Do not read keyboard input. (6 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- normalise :: String -> String
-- Plan: Follow the input's nesting level when applying character functions.
import Data.Char (toUpper, toLower, isAlpha, isAlphaNum)

normalise :: String -> String
-- Choose one map for characters, and an extra map for a list of Strings.
normalise = map toLower . filter isAlphaNum

-- String = [Char], so map toUpper :: [Char] -> [Char].
-- For [String] = [[Char]], map (map toUpper) traverses both list levels.

main :: IO ()
main = do
  print (normalise "")  -- expected: ""
  print (normalise "A B!")  -- expected: "ab"
  print (normalise "CSi243")  -- expected: "csi243"
  print (normalise "7-9")  -- expected: "79"
  print (normalise "!?")  -- expected: ""
