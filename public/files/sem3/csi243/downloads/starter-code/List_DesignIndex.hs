-- Title: Preserve an index when looking up integers
{-
QUESTION
Write atPosition using zero-based indexing. Return the original index
and its element in Just. Return Nothing for a negative index or an
index at least the list length. Preserve the original index in a helper.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

atPosition :: Int -> [Integer] -> Maybe (Int,Integer)
atPosition = undefined -- Your answer here

main :: IO ()
main = do
  print (atPosition (-1) [10,20])  -- expected: Nothing
  print (atPosition 0 [])  -- expected: Nothing
  print (atPosition 0 [10])  -- expected: Just (0,10)
  print (atPosition 1 [10,20,30])  -- expected: Just (1,20)
  print (atPosition 2 [10,20])  -- expected: Nothing
  print (atPosition 5 [10])  -- expected: Nothing
