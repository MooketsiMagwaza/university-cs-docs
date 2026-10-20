-- Title: Find the lexicographically greatest string safely
{-
QUESTION
Write extrema. Return Nothing for the empty list and Just the lexicographically greatest string
otherwise. Initialise from actual list data, never from zero.
Use one recursive call per element and comparisons rather than min/max.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

extrema :: [String] -> Maybe String
extrema = undefined -- Your answer here

main :: IO ()
main = do
  print (extrema [])  -- expected: Nothing
  print (extrema ["a"])  -- expected: Just "a"
  print (extrema ["ant","zoo","bee"])  -- expected: Just "zoo"
  print (extrema ["","ab","a"])  -- expected: Just "ab"
  print (extrema ["cat","cat"])  -- expected: Just "cat"
