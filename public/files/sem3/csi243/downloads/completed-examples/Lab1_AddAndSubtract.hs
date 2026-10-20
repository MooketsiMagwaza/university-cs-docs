-- Title: Return the sum and difference as a pair
{-
QUESTION
Write addAndSub :: Int -> Int -> (Int, Int).
Return the sum first and the difference (first minus second) second.
-}

-- Read the question: Write addAndSub :: Int -> Int -> (Int, Int).
-- Plan: Compute both requested results and place them in the specified tuple order.
-- Dry run: addAndSub 7 3 = (7+3,7-3) = (10,4).
-- Key step: a tuple can return two results with one function call.
addAndSub :: Int -> Int -> (Int, Int)
addAndSub x y = (x + y, x - y)

main :: IO ()
main = do
  print (addAndSub 0 0)  -- expected: (0,0)
  print (addAndSub 7 3)  -- expected: (10,4)
  print (addAndSub 3 7)  -- expected: (10,-4)
  print (addAndSub (-2) 5)  -- expected: (3,-7)
  print (addAndSub 5 (-2))  -- expected: (3,7)
