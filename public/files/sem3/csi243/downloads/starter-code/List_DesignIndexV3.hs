-- Title: Preserve an index when looking up Booleans
{-
QUESTION
Write atPosition using zero-based indexing. Return the original index
and its element in Just. Return Nothing for a negative index or an
index at least the list length. Preserve the original index in a helper.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

atPosition :: Int -> [Bool] -> Maybe (Int,Bool)
atPosition = undefined -- Your answer here

main :: IO ()
main = do
  print (atPosition (-1) [True])  -- expected: Nothing
  print (atPosition 0 [])  -- expected: Nothing
  print (atPosition 0 [False])  -- expected: Just (0,False)
  print (atPosition 1 [True,False])  -- expected: Just (1,False)
  print (atPosition 2 [True,False])  -- expected: Nothing
  print (atPosition 8 [True])  -- expected: Nothing
