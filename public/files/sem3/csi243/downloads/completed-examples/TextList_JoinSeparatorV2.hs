-- Title: Join string fields with a string separator
{-
QUESTION
Write joinFields :: String -> [String] -> String -> String using intercalate.
Keep empty fields and insert the whole separator between adjacent fields.
-}

import Data.List (intercalate)

-- Read the question: Write joinFields :: String -> [String] -> String; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
joinFields :: String -> [String] -> String
-- Key step: the library operation also handles empty input.
joinFields = intercalate

main :: IO ()
main = do
  print (joinFields "," [])  -- expected: ""
  print (joinFields "," ["a"])  -- expected: "a"
  print (joinFields "::" ["a","b","c"])  -- expected: "a::b::c"
  print (joinFields "," ["","a",""])  -- expected: ",a,"
  print (joinFields "" ["ab","cd"])  -- expected: "abcd"
