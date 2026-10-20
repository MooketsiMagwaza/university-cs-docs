-- Title: Find the lexicographically greatest string safely
{-
QUESTION
Write extrema. Return Nothing for the empty list and Just the lexicographically greatest string
otherwise. Initialise from actual list data, never from zero.
Use one recursive call per element and comparisons rather than min/max.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write extrema with the stated list and result types.
-- Plan: Use the singleton as the seed; compare the head with the extrema of the tail.
extrema :: [String] -> Maybe String
-- Base cases handle missing data; the recursive case consumes list structure.
extrema [] = Nothing
extrema [x] = Just x
extrema (x:xs) = case extrema xs of
  Nothing -> Just x
  Just best -> Just (if x > best then x else best)

main :: IO ()
main = do
  print (extrema [])  -- expected: Nothing
  print (extrema ["a"])  -- expected: Just "a"
  print (extrema ["ant","zoo","bee"])  -- expected: Just "zoo"
  print (extrema ["","ab","a"])  -- expected: Just "ab"
  print (extrema ["cat","cat"])  -- expected: Just "cat"
