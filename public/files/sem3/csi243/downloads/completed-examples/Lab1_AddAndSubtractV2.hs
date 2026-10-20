-- Title: Return the product and sum as a pair
{-
QUESTION
Write multiplyAndAdd :: Int -> Int -> (Int, Int).
Return the product first and the sum second.
-}

-- Read the question: Write multiplyAndAdd :: Int -> Int -> (Int, Int).
-- Plan: Compute both requested results and place them in the specified tuple order.
-- Dry run: multiplyAndAdd 7 3 = (7*3,7+3) = (21,10).
-- Key step: a tuple can return two results with one function call.
multiplyAndAdd :: Int -> Int -> (Int, Int)
multiplyAndAdd x y = (x * y, x + y)

main :: IO ()
main = do
  print (multiplyAndAdd 0 0)  -- expected: (0,0)
  print (multiplyAndAdd 7 3)  -- expected: (21,10)
  print (multiplyAndAdd 3 7)  -- expected: (21,10)
  print (multiplyAndAdd (-2) 5)  -- expected: (-10,3)
  print (multiplyAndAdd 5 (-2))  -- expected: (-10,3)
