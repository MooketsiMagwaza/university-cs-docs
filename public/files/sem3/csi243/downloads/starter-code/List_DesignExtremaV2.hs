-- Title: Find a safe minimum of negative and positive integers
{-
QUESTION
Write extrema. Return Nothing for the empty list and Just the minimum
otherwise. Initialise from actual list data, never from zero.
Use one recursive call per element and comparisons rather than min/max.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

extrema :: [Integer] -> Maybe Integer
extrema = undefined -- Your answer here

main :: IO ()
main = do
  print (extrema [])  -- expected: Nothing
  print (extrema [7])  -- expected: Just 7
  print (extrema [-8,-3,-5])  -- expected: Just (-8)
  print (extrema [4,4,1])  -- expected: Just 1
  print (extrema [0,-1,2])  -- expected: Just (-1)
