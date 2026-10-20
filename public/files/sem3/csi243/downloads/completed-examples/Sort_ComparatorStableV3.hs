-- Title: Repair sorting after uppercasing a list of strings
{-
QUESTION
Write uppercaseSorted :: [String] -> [String]. Convert every character
of every string to uppercase with map (map toUpper), then use sort
for ascending lexicographic order. Do not confuse String with [String].
-}

import Data.List (sort)
import Data.Char (toUpper)

-- Read the question: Write the declared functions with the specified ordering.
-- Plan: Follow the ordering rule; preserve ties as stated and handle empty input.
uppercaseSorted :: [String] -> [String]
-- The inner map transforms characters; the outer map transforms words.
uppercaseSorted = sort . map (map toUpper)

main :: IO ()
main = do
  print (uppercaseSorted [])  -- expected: []
  print (uppercaseSorted [""])  -- expected: [""]
  print (uppercaseSorted ["b","A","aa"])  -- expected: ["A","AA","B"]
  print (uppercaseSorted ["cat","CAT","Bat"])  -- expected: ["BAT","CAT","CAT"]
  print (uppercaseSorted ["z","","a"])  -- expected: ["","A","Z"]
