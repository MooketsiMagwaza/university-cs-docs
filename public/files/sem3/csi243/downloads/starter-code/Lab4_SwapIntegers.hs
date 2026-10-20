-- Title: Swap the contents of a pair of integers.
{-
QUESTION
Write swapIntegers, taking a two-integer tuple and returning its contents
swapped. For example, swapIntegers (5,7) returns (7,5).
-}

swapIntegers :: (Int, Int) -> (Int, Int)
swapIntegers = undefined -- Your answer here

main :: IO ()
main = do
  print (swapIntegers (5,7))  -- expected: (7,5)
  print (swapIntegers (0,0))  -- expected: (0,0)
  print (swapIntegers (-1,2))  -- expected: (2,-1)
  print (swapIntegers (4,4))  -- expected: (4,4)
  print (swapIntegers (1,0))  -- expected: (0,1)
