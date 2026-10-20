-- Title: Return the quotient and remainder as a pair
{-
QUESTION
Write quotientAndRemainder :: Int -> Int -> (Int, Int).
Return the integer quotient first and remainder second; divisor is nonzero.
-}

-- Read the question: Write quotientAndRemainder :: Int -> Int -> (Int, Int).
-- Plan: Compute both requested results and place them in the specified tuple order.
-- Dry run: quotientAndRemainder 7 3 = (7 `div` 3,7 `mod` 3) = (2,1).
-- Key step: a tuple can return two results with one function call.
quotientAndRemainder :: Int -> Int -> (Int, Int)
quotientAndRemainder x y = (x `div` y, x `mod` y)

main :: IO ()
main = do
  print (quotientAndRemainder 0 3)  -- expected: (0,0)
  print (quotientAndRemainder 7 3)  -- expected: (2,1)
  print (quotientAndRemainder 3 7)  -- expected: (0,3)
  print (quotientAndRemainder 8 2)  -- expected: (4,0)
  print (quotientAndRemainder 10 4)  -- expected: (2,2)
