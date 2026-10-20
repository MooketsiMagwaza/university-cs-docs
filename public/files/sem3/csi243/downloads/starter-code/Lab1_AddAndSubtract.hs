-- Title: Return the sum and difference as a pair
{-
QUESTION
Write addAndSub :: Int -> Int -> (Int, Int).
Return the sum first and the difference (first minus second) second.
-}

addAndSub :: Int -> Int -> (Int, Int)
addAndSub = undefined -- Your answer here

main :: IO ()
main = do
  print (addAndSub 0 0)  -- expected: (0,0)
  print (addAndSub 7 3)  -- expected: (10,4)
  print (addAndSub 3 7)  -- expected: (10,-4)
  print (addAndSub (-2) 5)  -- expected: (3,-7)
  print (addAndSub 5 (-2))  -- expected: (3,7)
