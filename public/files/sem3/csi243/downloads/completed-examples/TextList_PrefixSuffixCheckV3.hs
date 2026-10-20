-- Title: Test whether a pattern occurs anywhere in text
{-
QUESTION
Write containsText :: String -> String -> Bool using isInfixOf.
The first argument is the pattern; an empty pattern matches even empty text.
-}

import Data.List (isInfixOf)

-- Read the question: Write containsText :: String -> String -> Bool; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
containsText :: String -> String -> Bool
-- Key step: the library operation also handles empty input.
containsText = isInfixOf

main :: IO ()
main = do
  print (containsText "" "")  -- expected: True
  print (containsText "x" "")  -- expected: False
  print (containsText "bc" "abcd")  -- expected: True
  print (containsText "ac" "abcd")  -- expected: False
  print (containsText "aba" "ababa")  -- expected: True
