-- Title: Find a safe maximum without a fabricated initial value
{-
QUESTION
Write extrema. Return Nothing for the empty list and Just the maximum
otherwise. Initialise from actual list data, never from zero.
Use one recursive call per element and comparisons rather than min/max.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write extrema with the stated list and result types.
-- Plan: Use the singleton as the seed; compare the head with the extrema of the tail.
extrema :: [Integer] -> Maybe Integer
-- Base cases handle missing data; the recursive case consumes list structure.
extrema [] = Nothing
extrema [x] = Just x
extrema (x:xs) = case extrema xs of
  Nothing -> Just x
  Just best -> Just (if x > best then x else best)

main :: IO ()
main = do
  print (extrema [])  -- expected: Nothing
  print (extrema [7])  -- expected: Just 7
  print (extrema [-8,-3,-5])  -- expected: Just (-3)
  print (extrema [4,4,1])  -- expected: Just 4
  print (extrema [0,-1,2])  -- expected: Just 2
