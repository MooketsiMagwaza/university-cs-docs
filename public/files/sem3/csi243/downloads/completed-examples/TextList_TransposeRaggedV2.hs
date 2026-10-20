-- Title: Read character rows as columns
{-
QUESTION
Write textColumns :: [String] -> [String] using transpose.
Keep column order and skip missing characters in short or empty rows.
-}

import Data.List (transpose)

-- Read the question: Write textColumns :: [String] -> [String]; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
textColumns :: [String] -> [String]
-- Key step: the library operation also handles empty input.
textColumns = transpose

main :: IO ()
main = do
  print (textColumns [])  -- expected: []
  print (textColumns [""])  -- expected: []
  print (textColumns ["ab","cd"])  -- expected: ["ac","bd"]
  print (textColumns ["abc","d","ef"])  -- expected: ["ade","bf","c"]
  print (textColumns ["","xy"])  -- expected: ["x","y"]
