-- Title: Test whether text ends with a requested suffix
{-
QUESTION
Write hasSuffix :: String -> String -> Bool using isSuffixOf.
The first argument is the candidate suffix. An empty suffix always matches.
-}

import Data.List (isSuffixOf)

-- Read the question: Write hasSuffix :: String -> String -> Bool; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
hasSuffix :: String -> String -> Bool
-- Key step: the library operation also handles empty input.
hasSuffix = isSuffixOf

main :: IO ()
main = do
  print (hasSuffix "" "")  -- expected: True
  print (hasSuffix "" "abc")  -- expected: True
  print (hasSuffix "bc" "abc")  -- expected: True
  print (hasSuffix "ab" "abc")  -- expected: False
  print (hasSuffix "abcd" "abc")  -- expected: False
