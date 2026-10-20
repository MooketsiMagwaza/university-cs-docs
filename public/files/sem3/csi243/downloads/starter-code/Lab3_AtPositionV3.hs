-- Title: Look up a list element counting from the right
{-
QUESTION
Define fromEnd to take a list of integers and an index y counted from
the right, with 0 meaning the last element. Return (y,element).
Reject negative indices and indices at or beyond the length.
For example, fromEnd [3,5,2,10] 0 = (0,10).
-}

fromEnd :: [Int] -> Int -> (Int, Int)
fromEnd = undefined -- Your answer here

main :: IO ()
main = do
  print (fromEnd [3,5,2,10] 0)  -- expected: (0,10)
  print (fromEnd [7] 0)  -- expected: (0,7)
  print (fromEnd [4,4,9] 1)  -- expected: (1,4)
  print (fromEnd [0,2] 1)  -- expected: (1,0)
  print (fromEnd [8,6,4] 2)  -- expected: (2,8)
