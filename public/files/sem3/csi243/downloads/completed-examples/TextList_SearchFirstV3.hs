-- Title: Find the first position of a requested word
{-
QUESTION
Write wordIndex :: String -> [String] -> Maybe Int using elemIndex.
Match case sensitively and return only the first zero-based index.
-}

import Data.List (elemIndex)

-- Read the question: Write wordIndex :: String -> [String] -> Maybe Int; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
wordIndex :: String -> [String] -> Maybe Int
-- Key step: the library operation also handles empty input.
wordIndex = elemIndex

main :: IO ()
main = do
  print (wordIndex "a" [])  -- expected: Nothing
  print (wordIndex "a" ["a"])  -- expected: Just 0
  print (wordIndex "a" ["A"])  -- expected: Nothing
  print (wordIndex "cat" ["dog","cat","cat"])  -- expected: Just 1
  print (wordIndex "" ["x",""])  -- expected: Just 1
