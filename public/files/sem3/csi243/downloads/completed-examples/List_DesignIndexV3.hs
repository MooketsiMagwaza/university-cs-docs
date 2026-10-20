-- Title: Preserve an index when looking up Booleans
{-
QUESTION
Write atPosition using zero-based indexing. Return the original index
and its element in Just. Return Nothing for a negative index or an
index at least the list length. Preserve the original index in a helper.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write atPosition with the stated list and result types.
-- Plan: Match the empty list before taking a component; consume one cell per step.
atPosition :: Int -> [Bool] -> Maybe (Int,Bool)
-- Base cases handle missing data; the recursive case consumes list structure.
atPosition original xs
  | original < 0 = Nothing
  | otherwise = go original xs
  where
    go _ [] = Nothing
    go 0 (y:_) = Just (original,y)
    go k (_:ys) = go (k-1) ys

main :: IO ()
main = do
  print (atPosition (-1) [True])  -- expected: Nothing
  print (atPosition 0 [])  -- expected: Nothing
  print (atPosition 0 [False])  -- expected: Just (0,False)
  print (atPosition 1 [True,False])  -- expected: Just (1,False)
  print (atPosition 2 [True,False])  -- expected: Nothing
  print (atPosition 8 [True])  -- expected: Nothing
