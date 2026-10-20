-- Title: Remove a prefix safely without searching inside the text
{-
QUESTION
Write removePrefix :: String -> String -> Maybe String using stripPrefix.
Return the remaining text only when the first argument is a prefix.
-}

import Data.List (stripPrefix)

-- Read the question: Write removePrefix :: String -> String -> Maybe String; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
removePrefix :: String -> String -> Maybe String
-- Key step: the library operation also handles empty input.
removePrefix = stripPrefix

main :: IO ()
main = do
  print (removePrefix "" "")  -- expected: Just ""
  print (removePrefix "" "abc")  -- expected: Just "abc"
  print (removePrefix "ab" "abc")  -- expected: Just "c"
  print (removePrefix "bc" "abc")  -- expected: Nothing
  print (removePrefix "abc" "abc")  -- expected: Just ""
