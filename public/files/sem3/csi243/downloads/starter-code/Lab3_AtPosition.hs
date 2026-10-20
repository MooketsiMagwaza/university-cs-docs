-- Title: Return an index and its list element
{-
QUESTION
Define atPosition to take a list and an index y, and return (y,element).
Lists are indexed from 0. atPosition [3,5,2,10] 3 returns (3,10).
Display an informative error for negative indices and indices at or beyond
the list length. Give the signature, recursive definition and a dry run.
-}

atPosition :: [Int] -> Int -> (Int, Int)
atPosition = undefined -- Your answer here

main :: IO ()
main = do
  print (atPosition [3,5,2,10] 3)  -- expected: (3,10)
  print (atPosition [7] 0)  -- expected: (0,7)
  print (atPosition [4,4,9] 1)  -- expected: (1,4)
  print (atPosition [0,2] 0)  -- expected: (0,0)
  print (atPosition [8,6,4] 2)  -- expected: (2,4)
