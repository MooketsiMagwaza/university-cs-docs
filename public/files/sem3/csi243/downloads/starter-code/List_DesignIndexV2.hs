-- Title: Preserve an index when looking up strings
{-
QUESTION
Write atPosition using zero-based indexing. Return the original index
and its element in Just. Return Nothing for a negative index or an
index at least the list length. Preserve the original index in a helper.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

atPosition :: Int -> [String] -> Maybe (Int,String)
atPosition = undefined -- Your answer here

main :: IO ()
main = do
  print (atPosition (-1) ["a"])  -- expected: Nothing
  print (atPosition 0 [])  -- expected: Nothing
  print (atPosition 0 ["red"])  -- expected: Just (0,"red")
  print (atPosition 1 ["a","bb"])  -- expected: Just (1,"bb")
  print (atPosition 2 ["a","bb"])  -- expected: Nothing
  print (atPosition 9 ["a"])  -- expected: Nothing
