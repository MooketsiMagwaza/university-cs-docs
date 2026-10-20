-- Title: Safely remove the last element recursively
{-
QUESTION
Write prefix xs. Return Nothing for []; otherwise return Just the
list with its final element removed. A singleton gives Just [].
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write prefix with the stated list and result types.
-- Plan: Distinguish stopping at a boundary from selecting matches throughout the list.
prefix :: [Integer] -> Maybe [Integer]
-- Base cases handle missing data; the recursive case consumes list structure.
prefix [] = Nothing
prefix [_] = Just []
prefix (x:xs) = case prefix xs of
  Nothing -> Nothing
  Just ys -> Just (x:ys)

main :: IO ()
main = do
  print (prefix [])  -- expected: Nothing
  print (prefix [7])  -- expected: Just []
  print (prefix [1,2])  -- expected: Just [1]
  print (prefix [1,2,3])  -- expected: Just [1,2]
  print (prefix [4,4,4])  -- expected: Just [4,4]
